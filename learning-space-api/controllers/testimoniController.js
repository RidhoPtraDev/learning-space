const Testimoni = require('../models/Testimoni')
const fs = require('fs')
const path = require('path')

// ── PUBLIC ─────────────────────────────────────────────────────

// GET /api/testimoni — ambil semua testimoni yang ditampilkan (untuk homepage, tanpa auth)
exports.getPublik = async (req, res) => {
  try {
    const data = await Testimoni.findAll({
      where: { tampil: true },
      order: [['urutan', 'ASC'], ['createdAt', 'DESC']],
    })
    res.json({ testimoni: data })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}

// ── ADMIN ──────────────────────────────────────────────────────

// GET /api/admin/testimoni — semua testimoni (termasuk yg disembunyikan)
exports.getAll = async (req, res) => {
  try {
    const data = await Testimoni.findAll({ order: [['urutan', 'ASC'], ['createdAt', 'DESC']] })
    res.json({ testimoni: data })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}

// POST /api/admin/testimoni — tambah testimoni baru
exports.create = async (req, res) => {
  try {
    const { nama, role, isi, urutan, tampil } = req.body
    if (!nama || !isi) {
      return res.status(400).json({ message: 'Nama dan isi testimoni wajib diisi' })
    }

    let fotoUrl = null
    if (req.file) {
      fotoUrl = `${req.protocol}://${req.get('host')}/uploads/testimoni/${req.file.filename}`
    }

    const baru = await Testimoni.create({
      nama,
      role: role || '',
      isi,
      foto: fotoUrl,
      urutan: urutan ? parseInt(urutan) : 0,
      tampil: tampil === 'false' ? false : true,
    })

    res.status(201).json({ message: 'Testimoni berhasil ditambahkan', testimoni: baru })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}

// PUT /api/admin/testimoni/:id — edit testimoni
exports.update = async (req, res) => {
  try {
    const t = await Testimoni.findByPk(req.params.id)
    if (!t) return res.status(404).json({ message: 'Testimoni tidak ditemukan' })

    const { nama, role, isi, urutan, tampil } = req.body

    if (req.file) {
      // Hapus foto lama
      if (t.foto && t.foto.includes('/uploads/testimoni/')) {
        const namaLama = t.foto.split('/uploads/testimoni/')[1]
        const pathLama = path.join(__dirname, '..', 'uploads', 'testimoni', namaLama)
        fs.unlink(pathLama, () => {})
      }
      t.foto = `${req.protocol}://${req.get('host')}/uploads/testimoni/${req.file.filename}`
    }

    if (nama !== undefined) t.nama = nama
    if (role !== undefined) t.role = role
    if (isi !== undefined) t.isi = isi
    if (urutan !== undefined) t.urutan = parseInt(urutan)
    if (tampil !== undefined) t.tampil = tampil === 'false' ? false : true

    await t.save()
    res.json({ message: 'Testimoni berhasil diperbarui', testimoni: t })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}

// DELETE /api/admin/testimoni/:id
exports.destroy = async (req, res) => {
  try {
    const t = await Testimoni.findByPk(req.params.id)
    if (!t) return res.status(404).json({ message: 'Testimoni tidak ditemukan' })

    // Hapus file foto dari disk kalau ada
    if (t.foto && t.foto.includes('/uploads/testimoni/')) {
      const namaFile = t.foto.split('/uploads/testimoni/')[1]
      const pathFile = path.join(__dirname, '..', 'uploads', 'testimoni', namaFile)
      fs.unlink(pathFile, () => {})
    }

    await t.destroy()
    res.json({ message: 'Testimoni berhasil dihapus' })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}