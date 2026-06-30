const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const { getProgress } = require('../controllers/analitikController')

router.get('/progress', authMiddleware, getProgress)

module.exports = router