import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Linkedin,
  Github,
  Mail,
  Phone,
  MapPin,
  Heart,
  ShoppingBag,
  CreditCard,
  Truck,
  Shield,
  ArrowUp
} from 'lucide-react';
import { useState, useEffect } from 'react';

function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    shop: [
      { name: 'All Products', path: '/' },
      { name: 'Featured Items', path: '/?featured=true' },
      { name: 'New Arrivals', path: '/?sort=newest' },
      { name: 'Best Sellers', path: '/?sort=popular' },
    ],
    account: [
      { name: 'My Profile', path: '/user-dashboard/profile' },
      { name: 'Order History', path: '/user-dashboard/orders' },
      { name: 'Wishlist', path: '/' },
      { name: 'Account Settings', path: '/user-dashboard/account-overview' },
    ],
    support: [
      { name: 'Help Center', path: '#' },
      { name: 'Track Order', path: '/user-dashboard/orders' },
      { name: 'Returns', path: '#' },
      { name: 'Shipping Info', path: '#' },
    ],
    company: [
      { name: 'About Us', path: '#' },
      { name: 'Careers', path: '#' },
      { name: 'Privacy Policy', path: '#' },
      { name: 'Terms of Service', path: '#' },
    ]
  };

  const socialLinks = [
    { icon: <Linkedin className="w-5 h-5" />, url: 'https://linkedin.com/in/shazibwebdev', label: 'LinkedIn' },
    { icon: <Github className="w-5 h-5" />, url: 'https://github.com/shazibwebdev', label: 'GitHub' },
  ];


  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300">

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img
                src="/SHOPVERSE logo.png"
                alt="ShopVerse"
                className="w-12 h-12 rounded"
              />
              <span className="text-2xl font-bold text-white">ShopVerse</span>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Where code meets commerce. A full-stack MERN e-commerce platform showcasing modern web development skills. Built by Shazib Hussain, Full Stack Developer.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-indigo-400" />
                <a href="mailto:shazib.webdev@gmail.com" className="hover:text-indigo-400 transition">
                  shazib.webdev@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-indigo-400" />
                <a href="tel:+923214894332" className="hover:text-indigo-400 transition">
                  +92 321 489 4332
                </a>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 text-indigo-400 mt-1" />
                <span>Lahore, Pakistan</span>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-indigo-400 transition text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-indigo-400 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Account</h3>
            <ul className="space-y-3">
              {footerLinks.account.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-indigo-400 transition text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-indigo-400 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-indigo-400 transition text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-indigo-400 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-indigo-400 transition text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-indigo-400 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-sm text-gray-400 text-center md:text-left">
              © {new Date().getFullYear()} ShopVerse - Where Code Meets Commerce. Built by{' '}
              <a href="https://linkedin.com/in/shazibwebdev" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 transition">
                Shazib Hussain
              </a>
              {' '}<Heart className="w-4 h-4 inline text-red-500 fill-red-500" /> Full Stack Developer
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-gray-800 hover:bg-indigo-600 text-gray-400 hover:text-white rounded-lg transition"
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Powered by</span>
              <div className="flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-lg">
                <span className="text-xs font-semibold text-indigo-400">Stripe</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </footer>
  );
}

export default Footer;
