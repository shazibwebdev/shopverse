import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ShoppingBag, ArrowRight, Sparkles,
  CreditCard, Search, Shield, Truck, Heart,
  Database, Cloud, Lock, Mail,
  Layers, Users, Package, BarChart3, Zap, CheckCircle,
  Bot, Star, Tag, Image, Settings, UserCheck, RefreshCw
} from 'lucide-react';

function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Core product features - comprehensive coverage
  const coreFeatures = [
    {
      icon: <Search className="w-5 h-5" />,
      title: "Smart Search",
      description: "Fuse.js fuzzy search across 5 fields with typo tolerance",
      tech: "Fuse.js"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Secure Auth",
      description: "JWT + bcrypt with SHA-256 email verification tokens",
      tech: "JWT + bcrypt"
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      title: "Stripe Checkout",
      description: "Webhook-confirmed payments with automatic stock updates",
      tech: "Stripe SDK"
    },
    {
      icon: <Truck className="w-5 h-5" />,
      title: "Order Tracking",
      description: "6-stage lifecycle: pending → confirmed → delivered",
      tech: "MongoDB"
    },
    {
      icon: <Heart className="w-5 h-5" />,
      title: "Wishlist & Reviews",
      description: "Save favorites, rate products, write reviews",
      tech: "Mongoose"
    },
    {
      icon: <Layers className="w-5 h-5" />,
      title: "Admin Dashboard",
      description: "Full CRUD, analytics, order & user management",
      tech: "RBAC"
    }
  ];

  // Technical highlights for floating badges
  const techHighlights = [
    { icon: <Database className="w-4 h-4" />, label: "MongoDB", sublabel: "Mongoose 8" },
    { icon: <Lock className="w-4 h-4" />, label: "JWT Auth", sublabel: "SHA-256" },
    { icon: <CreditCard className="w-4 h-4" />, label: "Stripe", sublabel: "Webhooks" },
    { icon: <Cloud className="w-4 h-4" />, label: "Cloudinary", sublabel: "Images" },
    { icon: <Mail className="w-4 h-4" />, label: "Nodemailer", sublabel: "SMTP" }
  ];

  // Platform statistics
  const stats = [
    { value: "40+", label: "API Endpoints", icon: <Zap className="w-4 h-4" /> },
    { value: "5", label: "Data Models", icon: <Database className="w-4 h-4" /> },
    { value: "2", label: "User Roles", icon: <Users className="w-4 h-4" /> },
    { value: "6", label: "Order States", icon: <Package className="w-4 h-4" /> }
  ];

  // Key differentiators
  const differentiators = [
    {
      icon: <Bot className="w-5 h-5" />,
      title: "AI Shopping Assistant",
      description: "Groq-powered Llama 3.3 for natural language product search & recommendations",
      highlight: "AI-Powered"
    },
    {
      icon: <RefreshCw className="w-5 h-5" />,
      title: "Server-Side Cart",
      description: "Mongoose pre-save hooks for real-time price recalculation with discount support",
      highlight: "Smart Pricing"
    },
    {
      icon: <UserCheck className="w-5 h-5" />,
      title: "Email Verification",
      description: "Auto-regenerating tokens on expiry, forgot/reset password with crypto security",
      highlight: "Production Ready"
    }
  ];

  return (
    <div className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 45, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -right-1/4 w-2/3 h-2/3 bg-gradient-to-br from-blue-100/40 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], rotate: [45, 0, 45] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -left-1/4 w-2/3 h-2/3 bg-gradient-to-tr from-indigo-100/40 to-transparent rounded-full blur-3xl"
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16"
      >
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">

          {/* Left Content - 3 columns */}
          <div className="lg:col-span-3 text-center lg:text-left">

            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-blue-100/50"
            >
              <Sparkles className="w-4 h-4" />
              <span>Production-Ready E-Commerce Platform</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight tracking-tight"
            >
              ShopVerse
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mt-2">
                Full-Stack MERN E-Commerce
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              A complete e-commerce solution featuring{' '}
              <span className="font-medium text-gray-700">Stripe payments with webhook confirmation</span>,{' '}
              <span className="font-medium text-gray-700">JWT authentication with email verification</span>,{' '}
              <span className="font-medium text-gray-700">AI-powered product search</span>, and{' '}
              <span className="font-medium text-gray-700">comprehensive admin dashboard</span>.
              Built with React 19, Express 5, MongoDB, and deployed on Vercel.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8"
            >
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(59, 130, 246, 0.25)" }}
                whileTap={{ scale: 0.98 }}
                className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3.5 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                onClick={() => {
                  const productsSection = document.querySelector('.products-section');
                  if (productsSection) {
                    productsSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Browse Products</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <Link to="/auth">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto bg-white text-gray-800 px-6 py-3.5 rounded-xl font-semibold text-base border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all shadow-sm"
                >
                  Create Account
                </motion.button>
              </Link>
            </motion.div>

            {/* Tech Stack Pills */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center lg:justify-start gap-2 mb-8"
            >
              {[
                { name: "React 19", color: "bg-blue-50 text-blue-700 border-blue-100" },
                { name: "Express 5", color: "bg-gray-50 text-gray-700 border-gray-200" },
                { name: "MongoDB", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
                { name: "Stripe", color: "bg-purple-50 text-purple-700 border-purple-100" },
                { name: "JWT", color: "bg-orange-50 text-orange-700 border-orange-100" },
                { name: "Tailwind v4", color: "bg-cyan-50 text-cyan-700 border-cyan-100" },
                { name: "Groq AI", color: "bg-indigo-50 text-indigo-700 border-indigo-100" }
              ].map((tech, index) => (
                <motion.span
                  key={index}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className={`px-3 py-1 rounded-lg text-xs font-medium border ${tech.color} transition-transform cursor-default`}
                >
                  {tech.name}
                </motion.span>
              ))}
            </motion.div>

            {/* Stats Row */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.03 }}
                  className="flex items-center gap-2 p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm"
                >
                  <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                    {stat.icon}
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Content - Visual Showcase - 2 columns */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 relative"
          >
            <div className="relative">
              {/* Main Card - Admin Dashboard Preview */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
              >
                <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 shadow-2xl">
                  <div className="bg-white rounded-xl p-5 space-y-3">
                    {/* Dashboard Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                          <BarChart3 className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold text-gray-900 text-sm">Admin Dashboard</span>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        Live
                      </span>
                    </div>

                    {/* Mock Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {[
                        { label: "Products", value: "128", icon: <Package className="w-3 h-3" /> },
                        { label: "Orders", value: "1.2K", icon: <ShoppingBag className="w-3 h-3" /> },
                        { label: "Users", value: "856", icon: <Users className="w-3 h-3" /> }
                      ].map((item, i) => (
                        <div key={i} className="bg-gray-50 rounded-lg p-2 text-center">
                          <div className="flex items-center justify-center gap-1 mb-0.5">
                            {item.icon}
                            <span className="text-lg font-bold text-gray-900">{item.value}</span>
                          </div>
                          <div className="text-xs text-gray-500">{item.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Mock Order Items */}
                    <div className="space-y-2">
                      {[
                        { status: "Shipped", color: "bg-blue-100 text-blue-700" },
                        { status: "Delivered", color: "bg-green-100 text-green-700" }
                      ].map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.15 }}
                          className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg"
                        >
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg" />
                          <div className="flex-1">
                            <div className="h-2.5 bg-gray-200 rounded w-20 mb-1.5" />
                            <div className="h-2 bg-gray-100 rounded w-12" />
                          </div>
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${item.color}`}>
                            {item.status}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Tech Badges */}
              {techHighlights.map((tech, index) => {
                const positions = [
                  "absolute -top-3 -right-3",
                  "absolute -bottom-3 -left-3",
                  "absolute top-1/4 -right-5",
                  "absolute top-1/2 -left-5",
                  "absolute bottom-1/4 -right-4"
                ];
                const colors = [
                  "bg-emerald-50 border-emerald-200 text-emerald-700",
                  "bg-purple-50 border-purple-200 text-purple-700",
                  "bg-blue-50 border-blue-200 text-blue-700",
                  "bg-orange-50 border-orange-200 text-orange-700",
                  "bg-cyan-50 border-cyan-200 text-cyan-700"
                ];

                return (
                  <motion.div
                    key={index}
                    animate={{
                      y: [0, index % 2 === 0 ? -8 : 8, 0],
                      rotate: [0, index % 2 === 0 ? 3 : -3, 0]
                    }}
                    transition={{
                      duration: 3 + index * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.2
                    }}
                    className={`${positions[index]} bg-white p-2.5 rounded-xl shadow-lg border z-20 hidden sm:block`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${colors[index]}`}>
                        {tech.icon}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-900">{tech.label}</p>
                        <p className="text-[10px] text-gray-500">{tech.sublabel}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Features Grid - Full Width */}
        <motion.div
          variants={itemVariants}
          className="mt-14 pt-10 border-t border-gray-100"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Where Code Meets <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Commerce</span>
            </h2>
            <p className="text-gray-500">Everything you need for a complete e-commerce experience</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {coreFeatures.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -4, scale: 1.02 }}
                className="group bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all"
              >
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                    {feature.icon}
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm">{feature.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed hidden sm:block">{feature.description}</p>
                  <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    {feature.tech}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Key Differentiators */}
        <motion.div
          variants={itemVariants}
          className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {differentiators.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -4 }}
              className="flex items-start gap-4 p-5 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
            >
              <div className="p-2.5 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 rounded-lg flex-shrink-0">
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900">{item.title}</h4>
                  <span className="text-[10px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                    {item.highlight}
                  </span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Features Strip */}
        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-wrap justify-center gap-3"
        >
          {[
            { icon: <Image className="w-3.5 h-3.5" />, text: "Multi-image Upload" },
            { icon: <Tag className="w-3.5 h-3.5" />, text: "Discount Pricing" },
            { icon: <Star className="w-3.5 h-3.5" />, text: "Product Reviews" },
            { icon: <RefreshCw className="w-3.5 h-3.5" />, text: "Stock Management" },
            { icon: <Mail className="w-3.5 h-3.5" />, text: "Transactional Emails" },
            { icon: <Settings className="w-3.5 h-3.5" />, text: "Role-Based Access" }
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-gray-100 shadow-sm text-xs text-gray-600"
            >
              <span className="text-blue-500">{item.icon}</span>
              <span>{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 0L48 8C96 16 192 32 288 37.3C384 43 480 37 576 32C672 27 768 21 864 26.7C960 32 1056 48 1152 53.3C1248 59 1344 53 1392 50.7L1440 48V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0V0Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
  );
}

export default HeroSection;