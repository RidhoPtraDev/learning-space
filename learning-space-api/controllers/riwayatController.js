const RiwayatBelajar = require('../models/RiwayatBelajar')
const Materi         = require('../models/Materi')
const Kelas          = require('../models/Kelas')
const ZoomMeeting    = require('../models/ZoomMeeting')
const { Op }         = require('sequelize')

// Batas tampilan riwayat di halaman user — data di DB TIDAK dihapus
// supaya diagram analytics admin tetap akurat
const TAMPIL_RIWAYAT = 15

// POST /api/riwayat — catat aktivitas belajar baru
exports.createRiwayat = async (req, res) => {
  try {
    const { materiId, zoomMeetingId, jenis } = req.body
    const userId = req.userId

    if (!jenis || (!materiId && !zoomMeetingId)) {
      return res.status(400).json({ message: 'jenis wajib diisi, dan salah satu dari materiId atau zoomMeetingId wajib diisi' })
    }
    if (materiId && zoomMeetingId) {
      return res.status(400).json({ message: 'Hanya boleh salah satu: materiId atau zoomMeetingId' })
    }

    const whereKey = materiId
      ? { materiId, zoomMeetingId: null }
      : { zoomMeetingId, materiId: null }

    // Cegah duplikat dari React StrictMode — window 5 detik per kombinasi
    // userId + jenis + materiId/zoomId. Jurnal dan video dari materi yang sama
    // tetap bisa dicatat sebagai 2 entri berbeda karena jenis-nya beda.
    const limaDetikLalu = new Date(Date.now() - 5000)
    const duplikat = await RiwayatBelajar.findOne({
      where: {
        userId,
        jenis,
        ...whereKey,
        waktuAkses: { [Op.gte]: limaDetikLalu },
      },
    })

    if (duplikat) {
      return res.status(200).json({ message: 'Riwayat sudah tercatat (duplikat diabaikan)' })
    }

    // Selalu buat entry baru — TIDAK ADA penghapusan otomatis
    // Data di DB harus lengkap supaya diagram admin akurat
    await RiwayatBelajar.create({
      userId,
      jenis,
      ...whereKey,
      waktuAkses: new Date(),
    })

    res.status(201).json({ message: 'Riwayat berhasil dicatat' })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}

// GET /api/riwayat — ambil riwayat milik user yang login (tampilan dibatasi 15 terbaru)
exports.getRiwayat = async (req, res) => {
  try {
    const riwayat = await RiwayatBelajar.findAll({
      where: { userId: req.userId },
      include: [
        {
          model: Materi,
          include: [{ model: Kelas, attributes: ['id', 'nama'] }],
        },
        {
          model: ZoomMeeting,
          include: [{ model: Kelas, attributes: ['id', 'nama'] }],
        },
      ],
      order: [['waktuAkses', 'DESC']],
      limit: TAMPIL_RIWAYAT,
    })

    res.json({ riwayat })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}