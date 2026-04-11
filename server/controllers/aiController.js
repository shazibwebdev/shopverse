const { GoogleGenAI } = require("@google/genai");
const Product = require("../models/Product");

// Initialize Gemini - API key from environment
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

// Search products in database
const searchProducts = async (query) => {
  if (!query) return [];
  
  return Product.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { brand: { $regex: query, $options: 'i' } },
      { category: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } }
    ]
  })
  .select('name price brand category image rating stock discountedPrice')
  .limit(5)
  .lean();
};

// Chat endpoint
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

    // Build the prompt
    let prompt = SYSTEM_PROMPT;
    
    if (products.length > 0) {
      prompt += `\n\nProducts available in our store right now:\n${JSON.stringify(products.map(p => ({
        name: p.name,
        price: p.price,
        discountedPrice: p.discountedPrice,
        brand: p.brand,
        category: p.category,
        inStock: p.stock > 0
      })), null, 2)}\n\nIf relevant, recommend these products with their names and prices.`;
    } else {
      prompt += `\n\nNo products matched the user's search. Be helpful and suggest they browse categories or try different keywords.`;
    }

    prompt += `\n\nUser message: ${message}`;

    // Call Gemini API
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ 
        role: 'user', 
        parts: [{ text: prompt }] 
      }]
    });

    const reply = response?.candidates?.[0]?.content?.parts?.[0]?.text;

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
    
    // Handle specific errors
    if (error.message?.includes('API key')) {
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