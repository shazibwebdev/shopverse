import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, Sparkles, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

function AiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMessage = message.trim();
    setMessage('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const { data } = await api.post('/api/ai/chat', { message: userMessage });
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.reply,
        products: data.products 
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I\'m having trouble connecting right now. Please try again in a moment.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 
              rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform
              hover:shadow-xl hover:shadow-indigo-500/25"
          >
            <Sparkles className="text-white" size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] 
              bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="text-white" size={18} />
                </div>
                <div>
                  <span className="text-white font-semibold text-sm">ShopVerse AI</span>
                  <p className="text-white/70 text-xs">Your shopping assistant</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white">
              {messages.length === 0 && (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bot className="text-indigo-500" size={28} />
                  </div>
                  <p className="text-gray-600 font-medium">Hi! I'm ShopVerse AI</p>
                  <p className="text-gray-400 text-sm mt-1">Ask me about products, prices, or recommendations!</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {['Show me shoes', 'Nike products', 'What\'s on sale?'].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setMessage(suggestion)}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-full transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2.5 rounded-2xl rounded-br-md' 
                      : 'bg-white text-gray-700 px-4 py-2.5 rounded-2xl rounded-bl-md shadow-sm border border-gray-100'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    
                    {/* Product Cards */}
                    {msg.products && msg.products.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {msg.products.map((product, j) => (
                          <Link
                            key={j}
                            to={`/product/${product._id}`}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors group"
                          >
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded-md"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-800 truncate group-hover:text-indigo-600">
                                {product.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                ${product.discountedPrice || product.price}
                              </p>
                            </div>
                            <ShoppingBag size={14} className="text-gray-400 group-hover:text-indigo-500" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-100">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                      <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-3 border-t border-gray-100 bg-white flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about products..."
                disabled={loading}
                className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm outline-none 
                  focus:ring-2 focus:ring-indigo-500/30 focus:bg-gray-50 transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!message.trim() || loading}
                className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full 
                  flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed
                  hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AiChat;