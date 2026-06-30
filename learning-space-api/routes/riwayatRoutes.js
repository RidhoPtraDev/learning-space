const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const { createRiwayat, getRiwayat } = require('../controllers/riwayatController')

router.post('/', authMiddleware, createRiwayat)
router.get('/', authMiddleware, getRiwayat)

module.exports = router