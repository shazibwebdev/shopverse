import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import NavDropdown from "../common/Dropdown";
import { ShoppingCart, Heart } from "lucide-react";
import { useGlobal } from "../../contexts/GlobalContext";
import WishlistDropdown from "../common/Wishlist";
import CartDropdown from "../common/CartDropdown";

function Navbar() {
    const { currentUser } = useAuth();

    const {
        isWishlistOpen,
        setIsWishlistOpen,
        cartItems,
        isOpen,
        setIsOpen,
        toggleCart,
        dropdownRef,
        cartBtn,
        fetchCart,
        fetchWishlist
    } = useGlobal()

    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const scroll = () => {
            setIsScrolled(window.scrollY >= 20)
        }
        window.addEventListener('scroll', scroll)
        fetchCart()
        fetchWishlist()

        return () => {
            window.removeEventListener('scroll', scroll)
        }
    }, [])

    return (
        <nav className={`transition-all duration-300 fixed top-0 left-0 w-full z-50 flex justify-between items-center 
            ${isScrolled ? 'h-[60px] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900' : 'h-[70px] sm:h-[80px] bg-gradient-to-r from-gray-700 via-gray-800 to-gray-500'}
      text-white shadow-lg px-3 sm:px-5 md:px-8 lg:px-12 border-b border-white/10`}>

            {/* Left: Logo */}
            <Link to="/">
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <img
                        className={`${!isScrolled ? 'w-10 h-10 sm:w-14 sm:h-14' : 'w-9 h-9 sm:w-11 sm:h-11'} transition-all duration-300 rounded`}
                        src="/SHOPVERSE logo.png" alt="ShopVerse" />
                    <p className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl text-white tracking-wide">ShopVerse</p>
                </div>
            </Link>

            {/* Center: Admin Dashboard + Dropdown (only if logged in, hidden on small mobile) */}
            <div className="flex justify-center">
                {currentUser && (
                    <div className="flex gap-2 sm:gap-4 items-center">
                        <NavDropdown />
                    </div>
                )}
            </div>

            {/* Right: Cart & Wishlist OR Login/Signup */}
            <div className="flex justify-end gap-2 sm:gap-3 md:gap-4 items-center">
                {/* Cart */}
                <button
                    ref={cartBtn}
                    onClick={toggleCart}
                    className="flex gap-1 sm:gap-2 p-2 relative hover:bg-white/10 rounded-full transition-colors"
                >
                    <ShoppingCart size={22} />
                    <span className="hidden sm:inline text-sm font-medium">Cart</span>
                    {cartItems.cart.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full font-bold">
                            {cartItems.cart.length}
                        </span>
                    )}
                </button>

                {/* Wishlist */}
                <WishlistDropdown />

                {!currentUser && (
                    <Link to="/auth">
                        <button className="bg-gradient-to-r from-indigo-500 to-purple-500
                            hover:from-indigo-600 hover:to-purple-600
                            text-white px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold
                            transition-all shadow-md whitespace-nowrap">
                            Login
                        </button>
                    </Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
