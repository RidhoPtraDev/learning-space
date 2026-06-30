const User = require('../models/User')
const Kelas = require('../models/Kelas')
const Materi = require('../models/Materi')
const ZoomMeeting = require('../models/ZoomMeeting')
const RiwayatBelajar = require('../models/RiwayatBelajar')
const { Op, fn, col, literal } = require('sequelize')
const sequelize = require('../config/database')

// GET /api/admin/summary
exports.getSummary = async (req, res) => {
  try {
    const [totalUser, totalKelas, totalMateri, totalZoom] = await Promise.all([
      User.count(),
      Kelas.count(),
      Materi.count(),
      ZoomMeeting.count(),
    ])
    res.json({ summary: { totalUser, totalKelas, totalMateri, totalZoom } })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}

// GET /api/admin/logs?page=1&limit=20&search=
exports.getLogs = async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1
    const limit = parseInt(req.query.limit) || 20
    const search = req.query.search || ''
    const offset = (page - 1) * limit

    // Filter by user name jika ada search
    const userWhere = search
      ? { nama: { [Op.like]: `%${search}%` } }
      : {}

    const { count, rows } = await RiwayatBelajar.findAndCountAll({
      include: [
        { model: User,        attributes: ['id','nama','email','foto'], where: userWhere },
        { model: Materi,      attributes: ['id','judul'],               required: false },
        { model: ZoomMeeting, attributes: ['id','judulMateri'],         required: false },
      ],
      order: [['waktuAkses', 'DESC']],
      limit,
      offset,
    })

    res.json({
      logs: rows.map(r => ({
        id:          r.id,
        jenis:       r.jenis || 'zoom',
        waktuAkses:  r.waktuAkses,
        user:        r.User,
        materi:      r.Materi     || null,
        zoom:        r.ZoomMeeting || null,
      })),
      total: count,
      page,
      totalPage: Math.ceil(count / limit),
    })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}

// GET /api/admin/diagram/aktivitas?range=7
// Diagram BATANG — frekuensi tiap jenis aktivitas
exports.getDiagramAktivitas = async (req, res) => {
  try {
    const range = parseInt(req.query.range) || 7

    // Pakai raw SQL + NOW() MySQL supaya timezone-safe (tidak tergantung timezone Node.js)
    const rows = await sequelize.query(`
      SELECT SQL_NO_CACHE
        jenis,
        COUNT(id) AS total
      FROM RiwayatBelajars
      WHERE waktuAkses >= (NOW() - INTERVAL :range DAY)
      GROUP BY jenis
      ORDER BY total DESC
    `, {
      replacements: { range },
      type: sequelize.QueryTypes.SELECT,
    })

    const labelMap = {
      video:  'Nonton Video',
      jurnal: 'Baca Jurnal',
      zoom:   'Zoom Meeting',
    }

    const data = rows.map(r => ({
      jenis: r.jenis || 'zoom',
      label: labelMap[r.jenis] || r.jenis || 'Aktivitas',
      total: parseInt(r.total),
    }))

    res.set('Cache-Control', 'no-store').json({ data, range })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}

// GET /api/admin/diagram/kelas
// Diagram DONAT — kelas mana yang paling banyak dipelajari
exports.getDiagramKelas = async (req, res) => {
  try {
    // Pakai raw SQL supaya join 3 tabel (riwayat->materi->kelas) dijamin benar
    const rows = await sequelize.query(`
      SELECT SQL_NO_CACHE
        k.id        AS kelasId,
        k.nama      AS kelasNama,
        COUNT(rb.id) AS total
      FROM RiwayatBelajars rb
      INNER JOIN Materis m ON m.id = rb.materiId
      INNER JOIN Kelas   k ON k.id = m.kelasId
      WHERE rb.materiId IS NOT NULL
      GROUP BY k.id, k.nama
      ORDER BY total DESC
    `, { type: sequelize.QueryTypes.SELECT })

    const grandTotal = rows.reduce((s, r) => s + parseInt(r.total), 0)

    const data = rows.map((r, i) => ({
      kelasId:   r.kelasId,
      kelasNama: r.kelasNama,
      total:     parseInt(r.total),
      persen:    grandTotal > 0 ? Math.round((parseInt(r.total) / grandTotal) * 100) : 0,
      warna:     PALET[i % PALET.length],
    }))

    res.set('Cache-Control', 'no-store').json({ data, grandTotal })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}

// Palet warna konsisten untuk diagram
const PALET = [
  '#0066FF','#22c55e','#FFD93D','#a855f7','#ef4444',
  '#06b6d4','#f97316','#ec4899','#84cc16','#6366f1',
]