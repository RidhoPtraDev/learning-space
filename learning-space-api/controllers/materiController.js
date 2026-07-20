const fs = require('fs')
const path = require('path')
const Materi = require('../models/Materi')
const Kelas = require('../models/Kelas')

// GET 1 materi berdasarkan id (untuk halaman MateriDetail)
exports.getMateriById = async (req, res) => {
  try {
    const { kelasId, materiId } = req.params
    const materi = await Materi.findOne({
      where: { id: materiId, kelasId },
      include: [{ model: Kelas }],
    })
    if (!materi) {
      return res.status(404).json({ message: 'Materi tidak ditemukan' })
    }
    res.json({ materi })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}

// Helper: ubah deskripsi panjang (dikirim dari form sebagai 1 string biasa
// dengan baris baru per paragraf) menjadi JSON string array, sesuai format
// yang sudah dipakai di seed.js dan dibaca oleh MateriDetail.jsx
function formatDeskripsi(input) {
  if (!input) return null
  // Kalau sudah berupa array (misal dikirim dari client sebagai JSON), pakai langsung
  if (Array.isArray(input)) return JSON.stringify(input)
  // Kalau string biasa, pecah per baris baru jadi array paragraf
  const paragraf = String(input).split('\n').map(p => p.trim()).filter(p => p.length > 0)
  return JSON.stringify(paragraf)
}

// POST /api/kelas/:kelasId/materi — buat materi baru di sebuah kelas (ADMIN ONLY)
// Body (multipart/form-data): judul, deskripsiSingkat, deskripsi, videoUrl,
// videoJudul, jurnalJudul, jurnalUrl, ilustrasi (file)
exports.createMateri = async (req, res) => {
  try {
    const { kelasId } = req.params
    const { judul, deskripsiSingkat, deskripsi, videoUrl, videoJudul, jurnalJudul, jurnalUrl } = req.body

    if (!judul) {
      return res.status(400).json({ message: 'Judul materi wajib diisi' })
    }

    const kelas = await Kelas.findByPk(kelasId)
    if (!kelas) {
      return res.status(404).json({ message: 'Kelas tidak ditemukan' })
    }

    const ilustrasiUrl = req.file
      ? `${req.protocol}://${req.get('host')}/uploads/materi/${req.file.filename}`
      : null

    const materi = await Materi.create({
      kelasId,
      judul,
      deskripsiSingkat: deskripsiSingkat || null,
      deskripsi: formatDeskripsi(deskripsi),
      videoUrl: videoUrl || null,
      videoJudul: videoJudul || null,
      jurnalJudul: jurnalJudul || null,
      jurnalUrl: jurnalUrl || null,
      ilustrasi: ilustrasiUrl,
    })

    res.status(201).json({ message: 'Materi berhasil dibuat', materi })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}

// PUT /api/kelas/:kelasId/materi/:materiId — update materi (ADMIN ONLY)
exports.updateMateri = async (req, res) => {
  try {
    const { kelasId, materiId } = req.params
    const { judul, deskripsiSingkat, deskripsi, videoUrl, videoJudul, jurnalJudul, jurnalUrl } = req.body

    const materi = await Materi.findOne({ where: { id: materiId, kelasId } })
    if (!materi) {
      return res.status(404).json({ message: 'Materi tidak ditemukan' })
    }

    if (judul !== undefined) materi.judul = judul
    if (deskripsiSingkat !== undefined) materi.deskripsiSingkat = deskripsiSingkat
    if (deskripsi !== undefined) materi.deskripsi = formatDeskripsi(deskripsi)
    if (videoUrl !== undefined) materi.videoUrl = videoUrl
    if (videoJudul !== undefined) materi.videoJudul = videoJudul
    if (jurnalJudul !== undefined) materi.jurnalJudul = jurnalJudul
    if (jurnalUrl !== undefined) materi.jurnalUrl = jurnalUrl

    if (req.file) {
      const ilustrasiLama = materi.ilustrasi
      materi.ilustrasi = `${req.protocol}://${req.get('host')}/uploads/materi/${req.file.filename}`

      if (ilustrasiLama && ilustrasiLama.includes('/uploads/materi/')) {
        const namaFileLama = ilustrasiLama.split('/uploads/materi/')[1]
        const pathFileLama = path.join(__dirname, '..', 'uploads', 'materi', namaFileLama)
        fs.unlink(pathFileLama, () => {})
      }
    }

    await materi.save()
    res.json({ message: 'Materi berhasil diperbarui', materi })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}

// DELETE /api/kelas/:kelasId/materi/:materiId — hapus materi (ADMIN ONLY)
exports.deleteMateri = async (req, res) => {
  try {
    const { kelasId, materiId } = req.params

    const materi = await Materi.findOne({ where: { id: materiId, kelasId } })
    if (!materi) {
      return res.status(404).json({ message: 'Materi tidak ditemukan' })
    }

    if (materi.ilustrasi && materi.ilustrasi.includes('/uploads/materi/')) {
      const namaFile = materi.ilustrasi.split('/uploads/materi/')[1]
      const pathFile = path.join(__dirname, '..', 'uploads', 'materi', namaFile)
      fs.unlink(pathFile, () => {})
    }

    await materi.destroy()
    res.json({ message: 'Materi berhasil dihapus' })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}