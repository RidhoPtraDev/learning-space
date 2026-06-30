const express = require('express')
const router = express.Router()
const authMiddleware  = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')
const {
  getSummary,
  getLogs,
  getDiagramAktivitas,
  getDiagramKelas,
} = require('../controllers/adminController')

// semua wajib login + role admin
router.get('/summary',             authMiddleware, adminMiddleware, getSummary)
router.get('/logs',                authMiddleware, adminMiddleware, getLogs)
router.get('/diagram/aktivitas',   authMiddleware, adminMiddleware, getDiagramAktivitas)
router.get('/diagram/kelas',       authMiddleware, adminMiddleware, getDiagramKelas)

module.exports = router 