const User = require('../models/User')
const Kelas = require('../models/Kelas')
const Materi = require('../models/Materi')
const ZoomMeeting = require('../models/ZoomMeeting')
const RiwayatBelajar = require('../models/RiwayatBelajar')
const Favorit = require('../models/Favorit')
const { Op, fn, col, literal } = require('sequelize')
const sequelize = require('../config/database')
const { hitungStreak } = require('../utils/analitikHelper')

// GET /api/admin/summary
exports.getSummary = async (req, res) => {
  try {
    const [totalUser, totalKelas, totalMateri, totalZoom] = await Promise.all([
      User.count({ where: { role: 'user' } }),
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

    // Filter by user name jika ada search, dan batasi hanya untuk role 'user'
    const userWhere = {
      role: 'user'
    }
    if (search) {
      userWhere.nama = { [Op.like]: `%${search}%` }
    }

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

// GET /api/admin/users — List semua user dengan filter search, status (aktif/banned/dihapus), dan sort streak
exports.getUsers = async (req, res) => {
  try {
    const { search, status, sort } = req.query

    const whereClause = {
      role: 'user',
    }

    if (search) {
      whereClause[Op.or] = [
        { nama: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ]
    }

    if (status === 'dihapus') {
      whereClause.deletedAt = { [Op.ne]: null }
    } else if (status === 'banned') {
      whereClause.isBanned = true;
      whereClause.deletedAt = null;
    } else if (status === 'aktif') {
      whereClause.isBanned = false;
      whereClause.deletedAt = null;
    }

    // paranoid: false agar user yang di-soft-delete (deletedAt) tetap terambil
    const users = await User.findAll({
      where: whereClause,
      paranoid: false,
      attributes: ['id', 'nama', 'email', 'foto', 'isBanned', 'createdAt', 'deletedAt'],
      order: [['createdAt', 'DESC']],
    })

    const result = await Promise.all(
      users.map(async (u) => {
        const { streak } = await hitungStreak(u.id, RiwayatBelajar)
        let userStatus = 'aktif'
        if (u.deletedAt) {
          userStatus = 'dihapus'
        } else if (u.isBanned) {
          userStatus = 'banned'
        }

        return {
          id: u.id,
          nama: u.nama,
          email: u.email,
          foto: u.foto,
          createdAt: u.createdAt,
          status: userStatus,
          streak,
        }
      })
    )

    if (sort === 'streak') {
      result.sort((a, b) => b.streak - a.streak)
    }

    res.json({ users: result })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}

// PATCH /api/admin/users/:id/ban
exports.banUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { paranoid: false })
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' })
    }
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Tidak bisa ban akun admin' })
    }
    user.isBanned = true
    await user.save()
    res.json({ message: `Akun ${user.nama} berhasil diblokir.`, isBanned: true })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}

// PATCH /api/admin/users/:id/unban
exports.unbanUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { paranoid: false })
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' })
    }
    user.isBanned = false
    await user.save()
    res.json({ message: `Blokir akun ${user.nama} berhasil dibuka.`, isBanned: false })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}

// DELETE /api/admin/users/:id — Soft delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' })
    }
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Tidak bisa hapus akun admin' })
    }
    await user.destroy()
    res.json({ message: `Akun ${user.nama} berhasil dinonaktifkan (dihapus).` })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}

// PATCH /api/admin/users/:id/restore — Memulihkan user soft-deleted
exports.restoreUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { paranoid: false })
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' })
    }
    if (!user.deletedAt) {
      return res.status(400).json({ message: 'Akun ini masih aktif (tidak dihapus)' })
    }
    await user.restore()
    res.json({ message: `Akun ${user.nama} berhasil dipulihkan.` })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}