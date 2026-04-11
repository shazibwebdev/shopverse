const Product = require("../models/Product");

// Using Groq API - Free tier with generous limits
// Get your free API key at: https://console.groq.com
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `You are ShopVerse AI, a friendly and helpful shopping assistant for ShopVerse e-commerce store.

Store Info:
- Name: ShopVerse
- Type: E-commerce store selling various products (electronics, fashion, accessories, etc.)
- Features: Product browsing, cart, wishlist, user accounts, orders, Stripe payments
- Built with: React, Node.js, MongoDB, Express

Personality:
- Friendly, warm, and professional
- Enthusiastic about helping customers find products
- Concise but helpful (2-3 sentences max for most responses)

Guidelines:
- For greetings: Respond warmly and ask how you can help them shop today
- For product searches: Mention products by name with prices when provided
- For general questions: Answer helpfully and guide them to relevant features
- For order/account questions: Direct users to login or check their account dashboard
- Never make up products that aren't in the provided list
- If no products found for a search, suggest browsing categories or popular items`;

// Check if message is a greeting or general conversation
const isGreeting = (message) => {
  const greetings = [
    'hi', 'hello', 'hey', 'hola', 'howdy', 'greetings',
    'good morning', 'good afternoon', 'good evening',
    'what\'s up', 'whats up', 'sup', 'yo'
  ];
  
  const lowerMessage = message.toLowerCase().trim();
  
  // Check if it's a direct greeting
  if (greetings.some(greeting => lowerMessage === greeting || lowerMessage.startsWith(greeting + ' '))) {
    return true;
  }
  
  // Check if it's a short message that's likely a greeting
  const words = lowerMessage.split(/\s+/);
  if (words.length <= 2 && greetings.some(g => words.includes(g))) {
    return true;
  }
  
  return false;
};

// Check if message is a general question (not product search)
const isGeneralQuestion = (message) => {
  const generalPatterns = [
    /^(what|who|how|where|when|why|can you|could you|would you|are you|do you|is this)/i,
    /help/i,
    /thank/i,
    /thanks/i,
    /bye/i,
    /goodbye/i,
    /about shopverse/i,
    /about you/i,
    /who (are|made|built) (you|this)/i,
    /what (can|do) you (do|help)/i
  ];
  
  return generalPatterns.some(pattern => pattern.test(message));
};

// Extract keywords from user query for better search
const extractKeywords = (query) => {
  // Remove common words that don't help search
  const stopWords = ['show', 'all', 'me', 'the', 'a', 'an', 'is', 'are', 'available', 'please', 'i', 'want', 'need', 'find', 'looking', 'for', 'can', 'you', 'give', 'list', 'some', 'any', 'have', 'got'];
  
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
    let products = [];
    let userMessage = message;
    
    // Check if it's a greeting - don't search for products
    if (isGreeting(message)) {
      userMessage = `${message}\n\nThis is a greeting. Respond warmly and ask how you can help them shop today. Mention that you can help them find products, check prices, or answer questions about the store.`;
    }
    // Check if it's a general question - don't search for products
    else if (isGeneralQuestion(message)) {
      userMessage = `${message}\n\nThis is a general question or conversation. Answer helpfully. If they're asking about the store, mention ShopVerse is a full-stack e-commerce platform built with React, Node.js, and MongoDB. If they need help, let them know you can assist with product searches, prices, and store information.`;
    }
    // It's likely a product search
    else {
      products = await searchProducts(message);
      
      if (products.length > 0) {
        userMessage = `${message}\n\nProducts found in store:\n${JSON.stringify(products.map(p => ({
          name: p.name,
          price: p.discountedPrice && p.discountedPrice !== 0 ? p.discountedPrice : p.price,
          brand: p.brand,
          category: p.category,
          rating: p.rating,
          inStock: p.stock > 0
        })), null, 2)}\n\nRecommend relevant products from this list. Mention product names and prices.`;
      } else {
        userMessage = `${message}\n\nNo products found for this specific search. Be helpful and suggest they try:\n- Different keywords (e.g., "shoes", "watch", "headphones")\n- Browsing by category\n- Checking out featured items\nKeep the response friendly and brief.`;
      }
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