const Favorit   = require('../models/Favorit')
const Kelas     = require('../models/Kelas')
const Materi    = require('../models/Materi')

// GET semua favorit milik user yang login
exports.getFavorit = async (req, res) => {
  try {
    const user = await require('../models/User').findByPk(req.userId, {
      include: [{
        model: Kelas,
        through: { attributes: [] },
        include: [{ model: Materi }],
      }],
    })

    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' })

    res.json({ favorit: user.Kelas || [] })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}

// POST tambah kelas ke favorit
exports.addFavorit = async (req, res) => {
  try {
    const { kelasId } = req.body
    if (!kelasId) return res.status(400).json({ message: 'kelasId wajib diisi' })

    const kelas = await Kelas.findByPk(kelasId)
    if (!kelas) return res.status(404).json({ message: 'Kelas tidak ditemukan' })

    const existing = await Favorit.findOne({ where: { userId: req.userId, kelasId } })
    if (existing) return res.status(400).json({ message: 'Kelas sudah ada di favorit' })

    await Favorit.create({ userId: req.userId, kelasId })
    res.status(201).json({ message: 'Kelas berhasil ditambahkan ke favorit' })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}

// DELETE hapus kelas dari favorit
exports.removeFavorit = async (req, res) => {
  try {
    const { kelasId } = req.params
    const deleted = await Favorit.destroy({ where: { userId: req.userId, kelasId } })
    if (!deleted) return res.status(404).json({ message: 'Favorit tidak ditemukan' })
    res.json({ message: 'Kelas berhasil dihapus dari favorit' })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}