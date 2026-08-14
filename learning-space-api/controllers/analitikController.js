const RiwayatBelajar = require('../models/RiwayatBelajar')
const Materi         = require('../models/Materi')
const Kelas           = require('../models/Kelas')
const { Op }          = require('sequelize')
const sequelize        = require('../config/database')
const { hitungStreak } = require('../utils/analitikHelper')

// Estimasi durasi per jenis aktivitas (menit) — dipakai karena DB tidak
// menyimpan durasi riil video/zoom yang ditonton
const ESTIMASI_MENIT = { video: 15, jurnal: 8, zoom: 45 }

const PALET = ['#0066FF', '#22c55e', '#FFD93D', '#a855f7', '#ef4444', '#06b6d4', '#f97316', '#ec4899']

function namaHari(date) {
  return ['Min','Sen','Sel','Rab','Kam','Jum','Sab'][date.getDay()]
}
function namaBulanSingkat(date) {
  return ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'][date.getMonth()]
}

// GET /api/analitik/progress
// Mengembalikan seluruh data yang dibutuhkan halaman Analitik Progress sekaligus,
// supaya frontend cukup 1 request.
exports.getProgress = async (req, res) => {
  try {
    const userId = req.userId
    const sekarang = new Date()

    // Ambil SEMUA riwayat milik user (tanpa limit) — perhitungan analitik
    // harus berbasis data lengkap, bukan 15 entri terakhir yang ditampilkan
    // di halaman Riwayat Belajar.
    const semuaRiwayat = await RiwayatBelajar.findAll({
      where: { userId },
      include: [
        { model: Materi, attributes: ['id','judul','kelasId'], required: false,
          include: [{ model: Kelas, attributes: ['id','nama'] }] },
      ],
      order: [['waktuAkses', 'DESC']],
    })

    // ── Ringkasan Hari Ini ──────────────────────────────────────
    const awalHariIni = new Date(sekarang); awalHariIni.setHours(0,0,0,0)
    const riwayatHariIni = semuaRiwayat.filter(r => new Date(r.waktuAkses) >= awalHariIni)

    const materiUnikHariIni = new Set(
      riwayatHariIni.filter(r => r.materiId).map(r => r.materiId)
    )
    const menitHariIni = riwayatHariIni.reduce((sum, r) => sum + (ESTIMASI_MENIT[r.jenis] || 10), 0)

    const kelasUnikHariIni = new Set(
      riwayatHariIni.filter(r => r.Materi?.Kelas?.id).map(r => r.Materi.Kelas.id)
    )

    // Streak — hitung mundur dari hari ini, berapa hari berturut-turut ada aktivitas
    const { streak, tanggalAktif } = await hitungStreak(userId, RiwayatBelajar)

    // ── Aktivitas Belajar 7 Hari Terakhir (diagram batang) ──────
    const tujuhHari = []
    for (let i = 6; i >= 0; i--) {
      const tgl = new Date(sekarang)
      tgl.setDate(tgl.getDate() - i)
      tgl.setHours(0,0,0,0)
      const tglAkhir = new Date(tgl); tglAkhir.setHours(23,59,59,999)

      const riwayatHari = semuaRiwayat.filter(r => {
        const w = new Date(r.waktuAkses)
        return w >= tgl && w <= tglAkhir
      })
      const menit = riwayatHari.reduce((sum, r) => sum + (ESTIMASI_MENIT[r.jenis] || 10), 0)

      tujuhHari.push({
        tanggal: tgl.toISOString().slice(0,10),
        hari: namaHari(tgl),
        tanggalLabel: `${tgl.getDate()} ${namaBulanSingkat(tgl)}`,
        jam: Math.round((menit / 60) * 10) / 10,
      })
    }

    // ── Target Mingguan ──────────────────────────────────────────
    const awalMinggu = new Date(sekarang)
    const hariKe = awalMinggu.getDay() === 0 ? 6 : awalMinggu.getDay() - 1 // Senin = awal minggu
    awalMinggu.setDate(awalMinggu.getDate() - hariKe)
    awalMinggu.setHours(0,0,0,0)

    const riwayatMingguIni = semuaRiwayat.filter(r => new Date(r.waktuAkses) >= awalMinggu)
    const materiUnikMingguIni = new Set(
      riwayatMingguIni.filter(r => r.materiId).map(r => r.materiId)
    )
    const TARGET_MINGGUAN = 10 // bisa dijadikan setting per-user nanti

    // ── Mata Pelajaran Terbanyak (diagram donat) — pakai raw SQL ─
    const kelasRows = await sequelize.query(`
      SELECT SQL_NO_CACHE
        k.id   AS kelasId,
        k.nama AS kelasNama,
        COUNT(rb.id) AS total
      FROM RiwayatBelajars rb
      INNER JOIN Materis m ON m.id = rb.materiId
      INNER JOIN Kelas   k ON k.id = m.kelasId
      WHERE rb.userId = :userId AND rb.materiId IS NOT NULL
      GROUP BY k.id, k.nama
      ORDER BY total DESC
    `, { replacements: { userId }, type: sequelize.QueryTypes.SELECT })

    const grandTotalKelas = kelasRows.reduce((s, r) => s + parseInt(r.total), 0)
    const mapelTerbanyak = kelasRows.map((r, i) => ({
      kelasId: r.kelasId,
      kelasNama: r.kelasNama,
      total: parseInt(r.total),
      persen: grandTotalKelas > 0 ? Math.round((parseInt(r.total) / grandTotalKelas) * 100) : 0,
      warna: PALET[i % PALET.length],
    }))

    // ── Insight otomatis ─────────────────────────────────────────
    const insight = []

    // Insight 1: jam paling aktif
    const jamCount = {}
    semuaRiwayat.forEach(r => {
      const jam = new Date(r.waktuAkses).getHours()
      jamCount[jam] = (jamCount[jam] || 0) + 1
    })
    const jamTerbanyak = Object.entries(jamCount).sort((a,b) => b[1]-a[1])[0]
    if (jamTerbanyak) {
      const j = parseInt(jamTerbanyak[0])
      insight.push({
        tipe: 'waktu',
        teks: `Kamu paling sering belajar pada pukul ${String(j).padStart(2,'0')}.00 - ${String(j+1).padStart(2,'0')}.00.`,
      })
    }

    // Insight 2: mapel favorit
    if (mapelTerbanyak.length > 0) {
      insight.push({
        tipe: 'materi',
        teks: `${mapelTerbanyak[0].kelasNama} merupakan materi yang paling banyak dipelajari minggu ini.`,
      })
    }

    res.json({
      ringkasanHariIni: {
        materiDipelajari: materiUnikHariIni.size,
        waktuBelajarMenit: menitHariIni,
        kelasSelesai: kelasUnikHariIni.size,
        streak,
      },
      aktivitas7Hari: tujuhHari,
      targetMingguan: {
        target: TARGET_MINGGUAN,
        selesai: materiUnikMingguIni.size,
        persen: Math.min(100, Math.round((materiUnikMingguIni.size / TARGET_MINGGUAN) * 100)),
      },
      mapelTerbanyak,
      streakDetail: {
        jumlah: streak,
        tanggalAktif: Array.from(tanggalAktif).slice(0, 14),
      },
      insight,
    })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}