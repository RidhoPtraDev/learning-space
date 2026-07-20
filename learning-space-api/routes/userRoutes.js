const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const { uploadFotoProfil } = require('../middleware/uploadMiddleware')
const { updateProfile, changePassword, getStats, uploadFoto } = require('../controllers/userController')

router.get('/stats', authMiddleware, getStats)
router.put('/profile', authMiddleware, updateProfile)
router.put('/password', authMiddleware, changePassword)
router.post('/foto', authMiddleware, uploadFotoProfil.single('foto'), uploadFoto)

module.exports = router 