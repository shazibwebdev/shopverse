const express = require('express')
const { getUsers, toggleBlockUser, toggleAdminUser, deleteUser, getSingle, updateUser } = require('../controllers/userController')
const verifyToken = require('../middleware/authMiddleware')
const authorize = require('../middleware/authorize')
const router = express.Router()

// Authenticated user
router.get('/single', verifyToken, getSingle)
router.patch('/update', verifyToken, updateUser)

// Admin only
router.get('/get', verifyToken, authorize('admin'), getUsers)
router.patch('/block-toggle/:id', verifyToken, authorize('admin'), toggleBlockUser)
router.patch('/admin-toggle/:id', verifyToken, authorize('admin'), toggleAdminUser)
router.delete('/delete/:id', verifyToken, authorize('admin'), deleteUser)

module.exports = router
