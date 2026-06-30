const fs = require('fs')
const path = require('path')
const Kelas = require('../models/Kelas')
const Materi = require('../models/Materi')

// GET semua kelas
exports.getAllKelas = async (req, res) => {
  try {
    const kelas = await Kelas.findAll()
    res.json({ kelas })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}

// GET 1 kelas berdasarkan id, sekaligus daftar materinya
exports.getKelasById = async (req, res) => {
  try {
    const { id } = req.params
    const kelas = await Kelas.findByPk(id, {
      include: [{ model: Materi }],
    })
    if (!kelas) {
      return res.status(404).json({ message: 'Kelas tidak ditemukan' })
    }
    res.json({ kelas })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}

// POST /api/kelas — buat kelas baru (ADMIN ONLY)
// Body (multipart/form-data): nama, deskripsi, kategori, icon (file)
exports.createKelas = async (req, res) => {
  try {
    const { nama, deskripsi, kategori } = req.body

    if (!nama) {
      return res.status(400).json({ message: 'Nama kelas wajib diisi' })
    }

    // req.file diisi oleh multer kalau ada file yang ter-upload.
    // Simpan URL LENGKAP (bukan cuma nama file), karena ini file baru yang
    // disimpan di backend (uploads/kelas/), beda dari icon lama yang cuma
    // nama file dan dibaca dari folder public/icons milik frontend.
    const iconUrl = req.file
      ? `${req.protocol}://${req.get('host')}/uploads/kelas/${req.file.filename}`
      : null

    const kelas = await Kelas.create({
      nama,
      deskripsi: deskripsi || null,
      kategori: kategori || null,
      icon: iconUrl,
    })

    res.status(201).json({ message: 'Kelas berhasil dibuat', kelas })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}

// PUT /api/kelas/:id — update kelas (ADMIN ONLY)
exports.updateKelas = async (req, res) => {
  try {
    const { id } = req.params
    const { nama, deskripsi, kategori } = req.body

    const kelas = await Kelas.findByPk(id)
    if (!kelas) {
      return res.status(404).json({ message: 'Kelas tidak ditemukan' })
    }

    if (nama !== undefined) kelas.nama = nama
    if (deskripsi !== undefined) kelas.deskripsi = deskripsi
    if (kategori !== undefined) kelas.kategori = kategori

    // Kalau admin upload icon baru, ganti icon-nya. Icon lama yang berupa
    // URL hasil upload (bukan nama file statis dari public/icons) dihapus
    // dari disk supaya tidak menumpuk file yatim (orphan).
    if (req.file) {
      const iconLamaUrl = kelas.icon
      kelas.icon = `${req.protocol}://${req.get('host')}/uploads/kelas/${req.file.filename}`

      if (iconLamaUrl && iconLamaUrl.includes('/uploads/kelas/')) {
        const namaFileLama = iconLamaUrl.split('/uploads/kelas/')[1]
        const pathFileLama = path.join(__dirname, '..', 'uploads', 'kelas', namaFileLama)
        fs.unlink(pathFileLama, () => {}) // best-effort, tidak masalah kalau gagal
      }
    }

    await kelas.save()
    res.json({ message: 'Kelas berhasil diperbarui', kelas })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}

// DELETE /api/kelas/:id — hapus kelas (ADMIN ONLY)
exports.deleteKelas = async (req, res) => {
  try {
    const { id } = req.params

    const kelas = await Kelas.findByPk(id)
    if (!kelas) {
      return res.status(404).json({ message: 'Kelas tidak ditemukan' })
    }

    // Cek dulu apakah kelas ini masih punya materi — kalau ya, tolak hapus
    // supaya tidak ada materi yang jadi "yatim" (kelasId menunjuk ke kelas
    // yang sudah tidak ada). Admin harus hapus/pindahkan materinya dulu.
    const jumlahMateri = await Materi.count({ where: { kelasId: id } })
    if (jumlahMateri > 0) {
      return res.status(400).json({
        message: `Kelas ini masih punya ${jumlahMateri} materi. Hapus atau pindahkan materinya dulu sebelum menghapus kelas.`,
      })
    }

    // Hapus file icon dari disk kalau itu hasil upload (bukan icon statis lama)
    if (kelas.icon && kelas.icon.includes('/uploads/kelas/')) {
      const namaFile = kelas.icon.split('/uploads/kelas/')[1]
      const pathFile = path.join(__dirname, '..', 'uploads', 'kelas', namaFile)
      fs.unlink(pathFile, () => {})
    }

    await kelas.destroy()
    res.json({ message: 'Kelas berhasil dihapus' })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}