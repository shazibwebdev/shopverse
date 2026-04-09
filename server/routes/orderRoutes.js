const express = require('express')
const { placeOrder, getOrders, updateStatus, getOrderDetail, cancelOrder, getUserOrders } = require('../controllers/orderController')
const verifyToken = require('../middleware/authMiddleware')
const authorize = require('../middleware/authorize')
const router = express.Router()

// Authenticated users
router.post('/place', verifyToken, placeOrder)
router.get('/user-orders', verifyToken, getUserOrders)
router.get('/detail/:id', verifyToken, getOrderDetail)
router.patch('/cancel/:id', verifyToken, cancelOrder)

// Admin only
router.get('/get', verifyToken, authorize('admin'), getOrders)
router.patch('/update-status/:id', verifyToken, authorize('admin'), updateStatus)

module.exports = router
