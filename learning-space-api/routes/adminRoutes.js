const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')
const {
  getSummary,
  getLogs,
  getDiagramAktivitas,
  getDiagramKelas,
  getUsers,
  banUser,
  unbanUser,
  deleteUser,
  restoreUser,
} = require('../controllers/adminController')

// semua wajib login + role admin
router.get('/summary',             authMiddleware, adminMiddleware, getSummary)
router.get('/logs',                authMiddleware, adminMiddleware, getLogs)
router.get('/diagram/aktivitas',   authMiddleware, adminMiddleware, getDiagramAktivitas)
router.get('/diagram/kelas',       authMiddleware, adminMiddleware, getDiagramKelas)
router.get('/users',               authMiddleware, adminMiddleware, getUsers)
router.patch('/users/:id/ban',     authMiddleware, adminMiddleware, banUser)
router.patch('/users/:id/unban',   authMiddleware, adminMiddleware, unbanUser)
router.delete('/users/:id',        authMiddleware, adminMiddleware, deleteUser)
router.patch('/users/:id/restore', authMiddleware, adminMiddleware, restoreUser)

module.exports = router