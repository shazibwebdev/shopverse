const Product = require("../models/Product");

// Using Groq API - Free tier with generous limits
// Get your free API key at: https://console.groq.com
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `You are ShopVerse AI, a helpful shopping assistant for ShopVerse e-commerce store.

Store Info:
- Name: ShopVerse
- Type: E-commerce store selling various products
- Features: Product browsing, cart, wishlist, user accounts, orders

Guidelines:
- Be friendly, helpful, and concise (2-3 sentences max)
- When products are provided, mention them by name with prices
- If no products match, suggest browsing categories or trying different keywords
- For order/account questions, direct users to login or contact support
- Never make up products that aren't in the provided list`;

// Extract keywords from user query for better search
const extractKeywords = (query) => {
  // Remove common words that don't help search
  const stopWords = ['show', 'all', 'me', 'the', 'a', 'an', 'is', 'are', 'available', 'please', 'i', 'want', 'need', 'find', 'looking', 'for', 'can', 'you', 'give', 'list'];
  
  const words = query.toLowerCase().split(/\s+/);
  const keywords = words.filter(word => word.length > 2 && !stopWords.includes(word));
  
  return keywords;
};

// Search products in database
const searchProducts = async (query) => {
  if (!query) return [];
  
  try {
    // Extract meaningful keywords from the query
    const keywords = extractKeywords(query);
    console.log('Extracted keywords:', keywords);
    
    if (keywords.length === 0) return [];
    
    // Build search query - search for ANY of the keywords
    const searchConditions = keywords.map(keyword => ({
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { brand: { $regex: keyword, $options: 'i' } },
        { category: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { tags: { $in: [new RegExp(keyword, 'i')] } }
      ]
    }));
    
    const foundProducts = await Product.find({
      $or: searchConditions
    })
    .select('name price brand category image rating stock discountedPrice')
    .limit(5)
    .lean();

    console.log('Products found:', foundProducts.length);
    
    return foundProducts;
  } catch (error) {
    console.error('Product search error:', error.message);
    return [];
  }
};

// Chat endpoint using Groq API
exports.chat = async (req, res) => {
  const { message } = req.body;

  if (!message?.trim()) {
    return res.status(400).json({ 
      success: false, 
      message: "Message is required" 
    });
  }

  try {
    // Search for relevant products
    const products = await searchProducts(message);

    // Build the user message
    let userMessage = message;
    
    if (products.length > 0) {
      userMessage = `${message}\n\nProducts found in store:\n${JSON.stringify(products.map(p => ({
        name: p.name,
        price: p.price,
        brand: p.brand,
        category: p.category,
        rating: p.rating,
        inStock: p.stock > 0
      })), null, 2)}\n\nRecommend relevant products from this list. Mention product names and prices.`;
    } else {
      userMessage = `${message}\n\nNo products found for this query. Suggest the user try different keywords or browse our categories.`;
    }

    // Call Groq API
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'API request failed');
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      throw new Error("Empty response from AI");
    }

    res.json({ 
      success: true, 
      reply,
      products: products.length > 0 ? products : undefined 
    });

  } catch (error) {
    console.error("AI Chat Error:", error.message);
    
    if (error.message?.includes('API key') || error.message?.includes('invalid')) {
      return res.status(500).json({ 
        success: false, 
        message: "AI service not configured properly" 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Something went wrong. Please try again." 
    });
  }
};