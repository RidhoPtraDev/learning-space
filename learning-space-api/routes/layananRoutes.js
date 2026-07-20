const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')
const { uploadGambarLayanan } = require('../middleware/uploadMiddleware')
const { getPublik, getAll, create, update, destroy } = require('../controllers/layananController')

// Public — tanpa auth, dipakai homepage
router.get('/', getPublik)

// Admin — wajib login + role admin
router.get('/admin', authMiddleware, adminMiddleware, getAll)
router.post('/admin', authMiddleware, adminMiddleware, uploadGambarLayanan.single('gambar'), create)
router.put('/admin/:id', authMiddleware, adminMiddleware, uploadGambarLayanan.single('gambar'), update)
router.delete('/admin/:id', authMiddleware, adminMiddleware, destroy)

module.exports = router