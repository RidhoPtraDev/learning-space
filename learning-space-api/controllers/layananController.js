const Layanan = require('../models/Layanan')
const fs = require('fs')
const path = require('path')

// ── PUBLIC ─────────────────────────────────────────────────────

// GET /api/layanan — untuk homepage (tanpa auth)
exports.getPublik = async (req, res) => {
  try {
    const data = await Layanan.findAll({
      where: { tampil: true },
      order: [['urutan', 'ASC'], ['createdAt', 'ASC']],
    })
    res.json({ layanan: data })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}

// ── ADMIN ──────────────────────────────────────────────────────

// GET /api/layanan/admin — semua layanan termasuk yang disembunyikan
exports.getAll = async (req, res) => {
  try {
    const data = await Layanan.findAll({ order: [['urutan', 'ASC'], ['createdAt', 'ASC']] })
    res.json({ layanan: data })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}

// POST /api/layanan/admin — tambah layanan baru
exports.create = async (req, res) => {
  try {
    const { judul, deskripsi, urutan, tampil } = req.body
    if (!judul) return res.status(400).json({ message: 'Judul layanan wajib diisi' })

    let gambarUrl = null
    if (req.file) {
      gambarUrl = `${req.protocol}://${req.get('host')}/uploads/layanan/${req.file.filename}`
    }

    const baru = await Layanan.create({
      judul,
      deskripsi: deskripsi || '',
      gambar: gambarUrl,
      urutan: urutan ? parseInt(urutan) : 0,
      tampil: tampil === 'false' ? false : true,
    })

    res.status(201).json({ message: 'Layanan berhasil ditambahkan', layanan: baru })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}

// PUT /api/layanan/admin/:id — edit layanan
exports.update = async (req, res) => {
  try {
    const l = await Layanan.findByPk(req.params.id)
    if (!l) return res.status(404).json({ message: 'Layanan tidak ditemukan' })

    const { judul, deskripsi, urutan, tampil } = req.body

    if (req.file) {
      // Hapus gambar lama dari disk
      if (l.gambar && l.gambar.includes('/uploads/layanan/')) {
        const namaLama = l.gambar.split('/uploads/layanan/')[1]
        const pathLama = path.join(__dirname, '..', 'uploads', 'layanan', namaLama)
        fs.unlink(pathLama, () => {})
      }
      l.gambar = `${req.protocol}://${req.get('host')}/uploads/layanan/${req.file.filename}`
    }

    if (judul !== undefined) l.judul = judul
    if (deskripsi !== undefined) l.deskripsi = deskripsi
    if (urutan !== undefined) l.urutan = parseInt(urutan)
    if (tampil !== undefined) l.tampil = tampil === 'false' ? false : true

    await l.save()
    res.json({ message: 'Layanan berhasil diperbarui', layanan: l })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}

// DELETE /api/layanan/admin/:id
exports.destroy = async (req, res) => {
  try {
    const l = await Layanan.findByPk(req.params.id)
    if (!l) return res.status(404).json({ message: 'Layanan tidak ditemukan' })

    if (l.gambar && l.gambar.includes('/uploads/layanan/')) {
      const namaFile = l.gambar.split('/uploads/layanan/')[1]
      const pathFile = path.join(__dirname, '..', 'uploads', 'layanan', namaFile)
      fs.unlink(pathFile, () => {})
    }

    await l.destroy()
    res.json({ message: 'Layanan berhasil dihapus' })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}