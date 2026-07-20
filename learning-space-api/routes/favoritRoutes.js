const express = require('express')
const router  = express.Router()
const authMiddleware  = require('../middleware/authMiddleware')
const { getFavorit, addFavorit, removeFavorit } = require('../controllers/favoritController')

router.get('/',           authMiddleware, getFavorit)
router.post('/',          authMiddleware, addFavorit)
router.delete('/:kelasId', authMiddleware, removeFavorit)

module.exports = router