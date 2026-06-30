const bcrypt = require('bcryptjs')
const User = require('../models/User')
const Favorit = require('../models/Favorit')
const RiwayatBelajar = require('../models/RiwayatBelajar')

// GET RINGKASAN AKTIVITAS BELAJAR (dipakai di halaman Profil)
exports.getStats = async (req, res) => {
  try {
    const userId = req.userId

    const jumlahFavorit = await Favorit.count({ where: { userId } })

    // Riwayat belajar materi (video + jurnal), TIDAK termasuk riwayat zoom
    const jumlahRiwayatBelajar = await RiwayatBelajar.count({
      where: { userId, materiId: { [require('sequelize').Op.ne]: null } },
    })

    // Riwayat ikut zoom meeting (jenis: 'zoom')
    const jumlahZoomDiikuti = await RiwayatBelajar.count({
      where: { userId, zoomMeetingId: { [require('sequelize').Op.ne]: null } },
    })

    res.json({
      stats: {
        // Fitur "ikuti kelas" belum ada di frontend (masih tahap pengembangan),
        // jadi untuk sekarang selalu 0. Nanti kalau fitur itu sudah dibuat,
        // tinggal ganti baris ini dengan hitungan sungguhan (misal dari tabel
        // KelasDiikuti), tidak perlu ubah bagian lain dari endpoint ini.
        kelasDiikuti: 0,
        kelasFavorit: jumlahFavorit,
        riwayatBelajar: jumlahRiwayatBelajar,
        zoomMeeting: jumlahZoomDiikuti,
      },
    })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}

// UPDATE PROFIL
exports.updateProfile = async (req, res) => {
  try {
    const { nama, email, kelamin, tglLahir, kota } = req.body

    const user = await User.findByPk(req.userId)
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' })
    }

    if (!nama || !email) {
      return res.status(400).json({ message: 'Nama dan email wajib diisi' })
    }

    if (email !== user.email) {
      const existing = await User.findOne({ where: { email } })
      if (existing) {
        return res.status(400).json({ message: 'Email sudah digunakan akun lain' })
      }
    }

    user.nama = nama
    user.email = email
    user.kelamin = kelamin || user.kelamin
    user.tglLahir = tglLahir || user.tglLahir
    user.kota = kota || user.kota
    await user.save()

    res.json({
      message: 'Profil berhasil diperbarui',
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role,
        kelamin: user.kelamin,
        tglLahir: user.tglLahir,
        kota: user.kota,
        createdAt: user.createdAt,
      },
    })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}

// GANTI PASSWORD
exports.changePassword = async (req, res) => {
  try {
    const { passwordLama, passwordBaru } = req.body

    if (!passwordLama || !passwordBaru) {
      return res.status(400).json({ message: 'Password lama dan baru wajib diisi' })
    }
    if (passwordBaru.length < 8) {
      return res.status(400).json({ message: 'Password baru minimal 8 karakter' })
    }

    const user = await User.findByPk(req.userId)
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' })
    }

    const isMatch = await bcrypt.compare(passwordLama, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Password saat ini salah' })
    }

    user.password = await bcrypt.hash(passwordBaru, 10)
    await user.save()

    res.json({ message: 'Password berhasil diubah' })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}
// UPLOAD FOTO PROFIL
exports.uploadFoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File foto wajib dipilih' })
    }

    const user = await User.findByPk(req.userId)
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' })
    }

    const fs = require('fs')
    const path = require('path')

    // Hapus foto lama dari disk kalau ada
    if (user.foto && user.foto.includes('/uploads/foto/')) {
      const namaFileLama = user.foto.split('/uploads/foto/')[1]
      const pathFileLama = path.join(__dirname, '..', 'uploads', 'foto', namaFileLama)
      fs.unlink(pathFileLama, () => {})
    }

    const fotoUrl = `${req.protocol}://${req.get('host')}/uploads/foto/${req.file.filename}`
    user.foto = fotoUrl
    await user.save()

    res.json({
      message: 'Foto profil berhasil diperbarui',
      foto: fotoUrl,
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role,
        foto: fotoUrl,
        kelamin: user.kelamin,
        tglLahir: user.tglLahir,
        kota: user.kota,
        createdAt: user.createdAt,
      },
    })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}