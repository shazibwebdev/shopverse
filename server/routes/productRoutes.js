const express = require('express')
const { getProducts, getSingleProduct, getFilters, addReview, deleteProduct, editProduct, addProduct } = require('../controllers/productController')
const verifyToken = require('../middleware/authMiddleware')
const authorize = require('../middleware/authorize')
const { addToWishlist, getWishlist, deleteFromWishlist } = require('../controllers/wishlistController')
const router = express.Router()

// Public
router.get('/get-products', getProducts)
router.get('/get-single-product/:id', getSingleProduct)
router.get('/get-filters', getFilters)

// Authenticated users
router.post('/add-review/:id', verifyToken, addReview)
router.get('/add-to-wishlist/:id', verifyToken, addToWishlist)
router.get('/get-wishlist', verifyToken, getWishlist)
router.delete('/delete-from-wishlist/:id', verifyToken, deleteFromWishlist)

// Admin only
router.post('/add', verifyToken, authorize('admin'), addProduct)
router.put('/edit/:id', verifyToken, authorize('admin'), editProduct)
router.delete('/delete/:id', verifyToken, authorize('admin'), deleteProduct)

module.exports = router
