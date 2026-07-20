const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')
const { uploadKelasIcon, uploadMateriIlustrasi } = require('../middleware/uploadMiddleware')

const { getAllKelas, getKelasById, createKelas, updateKelas, deleteKelas } = require('../controllers/kelasController')
const { getMateriById, createMateri, updateMateri, deleteMateri } = require('../controllers/materiController')

// ── BACA (semua user yang login boleh akses) ──────────────────
router.get('/', authMiddleware, getAllKelas)
router.get('/:id', authMiddleware, getKelasById)
router.get('/:kelasId/materi/:materiId', authMiddleware, getMateriById)

// ── KELOLA KELAS (ADMIN ONLY) ──────────────────────────────────
router.post('/', authMiddleware, adminMiddleware, uploadKelasIcon.single('icon'), createKelas)
router.put('/:id', authMiddleware, adminMiddleware, uploadKelasIcon.single('icon'), updateKelas)
router.delete('/:id', authMiddleware, adminMiddleware, deleteKelas)

// ── KELOLA MATERI (ADMIN ONLY) ─────────────────────────────────
router.post('/:kelasId/materi', authMiddleware, adminMiddleware, uploadMateriIlustrasi.single('ilustrasi'), createMateri)
router.put('/:kelasId/materi/:materiId', authMiddleware, adminMiddleware, uploadMateriIlustrasi.single('ilustrasi'), updateMateri)
router.delete('/:kelasId/materi/:materiId', authMiddleware, adminMiddleware, deleteMateri)

module.exports = router