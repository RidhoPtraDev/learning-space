const express = require('express')
const router = express.Router()
const {
  register,
  login,
  verifyOtp,
  resendOtp,
  forgotPassword,
  verifyResetOtp,
  resendResetOtp,
  resetPassword,
} = require('../controllers/authController')

router.post('/register', register)
router.post('/login', login)
router.post('/verify-otp', verifyOtp)
router.post('/resend-otp', resendOtp)

// Forgot password (tanpa authMiddleware — user belum login)
router.post('/forgot-password',  forgotPassword)
router.post('/verify-reset-otp', verifyResetOtp)
router.post('/resend-reset-otp', resendResetOtp)
router.post('/reset-password',   resetPassword)

module.exports = router