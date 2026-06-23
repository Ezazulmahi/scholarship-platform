const express = require('express')
const { register, verifyOtp, login, logout, me, forgotPassword, resetPassword, mailStatus } = require('../controllers/authController')

const router = express.Router()

router.post('/register', register)
router.post('/verify-otp', verifyOtp)
router.post('/login', login)
router.post('/logout', logout)
router.get('/me', me)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.get('/mail-status', mailStatus)

module.exports = router
