const express = require('express')
const { registerr, login, verifyEmail, resendVerification } = require('../controllers/authController')
const router = express.Router()

router.post('/registerr', registerr)
router.post('/login', login)
router.get('/verify-email/:token', verifyEmail)
router.post('/resend-verification', resendVerification)

module.exports = router
