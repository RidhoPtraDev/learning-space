const express        = require('express')
const router         = express.Router()
const authMiddleware  = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')
const { getAllZoom, createZoom, updateZoom, deleteZoom } = require('../controllers/zoomController')

// ── BACA (semua user yang login boleh akses) ──────────────────
router.get('/', authMiddleware, getAllZoom)

// ── KELOLA ZOOM MEETING (ADMIN ONLY) ───────────────────────────
router.post('/', authMiddleware, adminMiddleware, createZoom)
router.put('/:id', authMiddleware, adminMiddleware, updateZoom)
router.delete('/:id', authMiddleware, adminMiddleware, deleteZoom)

module.exports = router