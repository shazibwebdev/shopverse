import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ShoppingBag, ArrowRight, Sparkles,
  CreditCard, Search, Shield, Truck, Heart,
  Database, Cloud, Lock, Smartphone, Mail,
  Layers, Users, Package, BarChart3, Zap, CheckCircle
} from 'lucide-react';

function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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

  // Core product features that define the platform
  const coreFeatures = [
    {
      icon: <Search className="w-5 h-5" />,
      title: "Fuzzy Search",
      description: "Fuse.js powered typo-tolerant search across products",
      tech: "Fuse.js"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "JWT Auth",
      description: "Secure token-based authentication with email verification",
      tech: "bcrypt + JWT"
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      title: "Stripe Payments",
      description: "Webhook-confirmed checkout with automatic stock updates",
      tech: "Stripe SDK"
    },
    {
      icon: <Truck className="w-5 h-5" />,
      title: "Order Lifecycle",
      description: "Full order tracking: pending → shipped → delivered",
      tech: "MongoDB"
    },
    {
      icon: <Heart className="w-5 h-5" />,
      title: "Wishlist & Reviews",
      description: "Save favorites, rate products, leave reviews",
      tech: "Mongoose"
    },
    {
      icon: <Layers className="w-5 h-5" />,
      title: "Admin Dashboard",
      description: "Product CRUD, order management, user control",
      tech: "RBAC"
    }
  ];

  // Technical highlights for the floating badges
  const techHighlights = [
    { icon: <Database className="w-4 h-4" />, label: "MongoDB", sublabel: "Mongoose 8" },
    { icon: <Lock className="w-4 h-4" />, label: "JWT Auth", sublabel: "Secure" },
    { icon: <CreditCard className="w-4 h-4" />, label: "Stripe", sublabel: "Payments" },
    { icon: <Cloud className="w-4 h-4" />, label: "Cloudinary", sublabel: "Images" },
    { icon: <Mail className="w-4 h-4" />, label: "Nodemailer", sublabel: "Emails" }
  ];

  // Stats that matter
  const stats = [
    { value: "40+", label: "API Endpoints", icon: <Zap className="w-4 h-4" /> },
    { value: "5", label: "Data Models", icon: <Database className="w-4 h-4" /> },
    { value: "2", label: "User Roles", icon: <Users className="w-4 h-4" /> },
    { value: "6", label: "Order States", icon: <Package className="w-4 h-4" /> }
  ];

  return (
    <div className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
      {/* Subtle animated background */}
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
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20"
      >
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">

          {/* Left Content - 3 columns */}
          <div className="lg:col-span-3 text-center lg:text-left">

            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-blue-100"
            >
              <Sparkles className="w-4 h-4" />
              <span>Production-Ready E-Commerce Platform</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-5 leading-tight tracking-tight"
            >
              ShopVerse
              <p className="block text-2xl sm:text-3xl lg:text-4xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mt-2">
                Full-Stack MERN E-Commerce
              </p>

            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              A complete e-commerce solution with Stripe payments, JWT authentication,
              admin dashboard, email verification, fuzzy search, and comprehensive order management.
              Built with React 19, Node.js, MongoDB, and Tailwind CSS.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10"
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
                { name: "Node.js", color: "bg-green-50 text-green-700 border-green-100" },
                { name: "MongoDB", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
                { name: "Stripe", color: "bg-purple-50 text-purple-700 border-purple-100" },
                { name: "JWT", color: "bg-orange-50 text-orange-700 border-orange-100" },
                { name: "Tailwind", color: "bg-cyan-50 text-cyan-700 border-cyan-100" }
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
              {/* Main Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
              >
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 shadow-2xl">
                  <div className="bg-white rounded-xl p-5 space-y-3">
                    {/* Mock UI Elements */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <BarChart3 className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-semibold text-gray-900 text-sm">Admin Dashboard</span>
                      </div>
                      {/* <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Live</span> */}
                    </div>

                    {/* Mock Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {[
                        { label: "Products", value: "128" },
                        { label: "Orders", value: "1.2K" },
                        { label: "Users", value: "856" }
                      ].map((item, i) => (
                        <div key={i} className="bg-gray-50 rounded-lg p-2 text-center">
                          <div className="text-lg font-bold text-gray-900">{item.value}</div>
                          <div className="text-xs text-gray-500">{item.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Mock Order Items */}
                    {[1, 2].map((item) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: item * 0.15 }}
                        className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg" />
                        <div className="flex-1">
                          <div className="h-2.5 bg-gray-200 rounded w-20 mb-1.5" />
                          <div className="h-2 bg-gray-100 rounded w-12" />
                        </div>
                        <div className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                      </motion.div>
                    ))}
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
                  "bg-green-50 border-green-200 text-green-700",
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
          className="mt-16 pt-10 border-t border-gray-100"
        >
          <div className="text-center mb-8">
            <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-5 leading-tight tracking-tight">
              WHERE CODE MEETS <span className='bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>COMMERCE</span>
            </p>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Platform Features</h3>
            <p className="text-md text-gray-500">Everything you need for a complete e-commerce experience</p>
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

        {/* Architecture Highlights */}
        <motion.div
          variants={itemVariants}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {[
            {
              icon: <Cloud className="w-5 h-5" />,
              title: "Cloud Deployed",
              description: "Vercel serverless deployment with automatic scaling",
              highlight: "Production Ready"
            },
            {
              icon: <Shield className="w-5 h-5" />,
              title: "Security First",
              description: "JWT tokens, bcrypt hashing, email verification, RBAC",
              highlight: "Enterprise Grade"
            },
            {
              icon: <Smartphone className="w-5 h-5" />,
              title: "Modern UI/UX",
              description: "Framer Motion animations, responsive design, toast notifications",
              highlight: "Polished Experience"
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -4 }}
              className="flex items-start gap-4 p-5 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
            >
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg flex-shrink-0">
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900">{item.title}</h4>
                  <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    {item.highlight}
                  </span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
              </div>
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