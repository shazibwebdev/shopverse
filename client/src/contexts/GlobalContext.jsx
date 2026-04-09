// src/context/GlobalContext.js
import { createContext, useContext, useEffect, useRef, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { TypeOutlineIcon } from "lucide-react";

const GlobalContext = createContext();




export const GlobalProvider = ({ children }) => {

    const {
        currentUser
    } = useAuth()


    const [isWishlistOpen, setIsWishlistOpen] = useState(false);
    const [wishlistItems, setWishlistItems] = useState([])
    // const [isCartFetched, setIsCartFetched] = useState(false)
    const [cartItems, setCartItems] = useState({
        totalCartPrice: 0,
        cart: []
    })

    useEffect(() => {
        if (!currentUser) {
            setCartItems({
                totalCartPrice: 0,
                cart: []
            })
            setWishlistItems([])
        }
    }, [currentUser])

    // useEffect(() => {
    //     fetchCart()
    // }, [])

    const fetchWishlist = async () => {
        if (!currentUser) return
        try {
            const res = await api.get(`/api/products/get-wishlist`)
            console.log(res.data);
            setWishlistItems(res.data.wishlist)
        } catch (error) {
            console.error(error.response?.data?.msg);
        }
    }

    const handleAddToWishlist = async (id) => {
        try {
            const res = await api.get(`/api/products/add-to-wishlist/${id}`);
            toast.success(res.data.msg);
            fetchWishlist();
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Error adding to wishlist');
        }
    };

    const handleDeleteFromWishlist = async (id) => {
        try {
            const res = await api.delete(`/api/products/delete-from-wishlist/${id}`);
            toast.info(res.data.msg);
            fetchWishlist();
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Error removing from wishlist');
        }
    }
    const [isCartLoading, setIsCartLoading] = useState(false)
    const [qtyUpdateId, setQtyUpdateId] = useState(null)


    // ===================================
    // CART LOGIC
    // ===================================
    const [loadingProductId, setLoadingProductId] = useState(null)
    const handleAddToCart = async (id) => {
        try {
            setIsCartLoading(true)
            setLoadingProductId(id)
            const res = await api.post(`/api/cart/add/${id}`, {})
            console.log(res.data.msg);
            toast.success(res.data.msg)
            setCartItems((prev) => ({ ...prev, cart: res.data.cart, totalCartPrice: res.data.totalCartPrice }))
        } catch (error) {
            console.error(error);
            toast.error(error.response.data.msg)
        }
        finally {
            setIsCartLoading(false)
            setLoadingProductId(null)
        }
    }

    const fetchCart = async () => {
        if (!currentUser) return
        try {
            setIsCartLoading(true)
            const res = await api.get(`/api/cart/get`)
            console.log(res.data);
            setCartItems((prev) => ({ ...prev, cart: res.data.cart, totalCartPrice: res.data.totalCartPrice }))
        } catch (error) {
            console.error(error);
        }
        finally {
            setIsCartLoading(false)
        }
    }

    useEffect(() => {
        // console.log("isCartLoading:::", isCartLoading);
        console.log("qtyUpdateId:::", qtyUpdateId);

    }, [qtyUpdateId])

    const handleQtyInc = async (id) => {
        try {
            console.log('id::::', id);
            setQtyUpdateId(id)
            const res = await api.patch(`/api/cart/qty-inc/${id}`, {})
            setCartItems((prev) => ({ ...prev, cart: res.data.cart, totalCartPrice: res.data.totalCartPrice }))
            console.log(res.data.msg);
        } catch (error) {
            console.error(error?.response?.data?.msg || 'Failed to increase quantity');
            toast.error(error?.response?.data?.msg || 'Failed to increase quantity');
        }
        finally {
            setQtyUpdateId(null)
        }
    }

    const handleQtyDec = async (id) => {
        try {
            setQtyUpdateId(id)
            const res = await api.patch(`/api/cart/qty-dec/${id}`, {})
            setCartItems((prev) => ({ ...prev, cart: res.data.cart, totalCartPrice: res.data.totalCartPrice }))
            console.log(res.data.msg);
        } catch (error) {
            console.error(error?.response?.data?.msg || 'Failed to decrease quantity');
            toast.error(error?.response?.data?.msg || 'Failed to decrease quantity');
        }
        finally {
            setQtyUpdateId(null)
        }
    }

    const handleRemoveCartItem = async (id) => {
        try {
            setQtyUpdateId(id)
            const res = await api.delete(`/api/cart/remove/${id}`)
            setCartItems((prev) => ({ ...prev, cart: res.data.cart, totalCartPrice: res.data.totalCartPrice }))
            console.log(res.data.msg);
            toast.info(res.data?.msg || 'Item removed from your cart')
        } catch (error) {
            console.log(error);
        }
        finally {
            setQtyUpdateId(null)
        }
    }

    // /////////////
    const [isOpen, setIsOpen] = useState(false);

    const dropdownRef = useRef(null);
    // Close dropdown when clicked outside

    const cartBtn = useRef(null)
    const toggleCart = () => setIsOpen((prev) => !prev);

    const [isOverlayOpen, setIsOverlayOpen] = useState(false)
    return (
        <GlobalContext.Provider value={{
            isWishlistOpen,
            setIsWishlistOpen,
            fetchWishlist,
            wishlistItems,
            handleAddToWishlist,
            handleDeleteFromWishlist,
            fetchCart,
            handleAddToCart,
            cartItems,
            setCartItems,

            handleQtyInc,
            handleQtyDec,
            handleRemoveCartItem,

            isOpen,
            setIsOpen,
            toggleCart,
            dropdownRef,

            isOverlayOpen,
            setIsOverlayOpen,
            cartBtn,
            isCartLoading,
            loadingProductId,

            qtyUpdateId
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobal = () => useContext(GlobalContext);
