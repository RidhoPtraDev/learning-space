const ZoomMeeting = require('../models/ZoomMeeting')
const Kelas = require('../models/Kelas')

// GET semua zoom meeting
exports.getAllZoom = async (req, res) => {
  try {
    const meetings = await ZoomMeeting.findAll({
      include: [{ model: Kelas, attributes: ['id', 'nama'] }],
      order: [['waktu', 'ASC']],
    })
    res.json({ meetings })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}

// POST /api/zoom — buat zoom meeting baru (ADMIN ONLY)
// Body: kelasId, judulMateri, waktu (format ISO datetime, misal "2026-07-15T10:00:00"),
// tanggalTeks (opsional, misal "Rabu, 15 Juli 2026"), jamTeks (opsional, misal "10.00 - 11.30 WIB"), link
exports.createZoom = async (req, res) => {
  try {
    const { kelasId, judulMateri, waktu, tanggalTeks, jamTeks, link } = req.body

    if (!kelasId || !waktu || !link) {
      return res.status(400).json({ message: 'kelasId, waktu, dan link wajib diisi' })
    }

    const kelas = await Kelas.findByPk(kelasId)
    if (!kelas) {
      return res.status(404).json({ message: 'Kelas tidak ditemukan' })
    }

    const meeting = await ZoomMeeting.create({
      kelasId,
      judulMateri: judulMateri || null,
      waktu,
      tanggalTeks: tanggalTeks || null,
      jamTeks: jamTeks || null,
      link,
    })

    const meetingWithKelas = await ZoomMeeting.findByPk(meeting.id, {
      include: [{ model: Kelas, attributes: ['id', 'nama'] }],
    })

    res.status(201).json({ message: 'Zoom meeting berhasil dibuat', meeting: meetingWithKelas })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}

// PUT /api/zoom/:id — update zoom meeting (ADMIN ONLY)
exports.updateZoom = async (req, res) => {
  try {
    const { id } = req.params
    const { kelasId, judulMateri, waktu, tanggalTeks, jamTeks, link } = req.body

    const meeting = await ZoomMeeting.findByPk(id)
    if (!meeting) {
      return res.status(404).json({ message: 'Zoom meeting tidak ditemukan' })
    }

    if (kelasId !== undefined) {
      const kelas = await Kelas.findByPk(kelasId)
      if (!kelas) {
        return res.status(404).json({ message: 'Kelas tidak ditemukan' })
      }
      meeting.kelasId = kelasId
    }
    if (judulMateri !== undefined) meeting.judulMateri = judulMateri
    if (waktu !== undefined) meeting.waktu = waktu
    if (tanggalTeks !== undefined) meeting.tanggalTeks = tanggalTeks
    if (jamTeks !== undefined) meeting.jamTeks = jamTeks
    if (link !== undefined) meeting.link = link

    await meeting.save()

    const meetingWithKelas = await ZoomMeeting.findByPk(meeting.id, {
      include: [{ model: Kelas, attributes: ['id', 'nama'] }],
    })

    res.json({ message: 'Zoom meeting berhasil diperbarui', meeting: meetingWithKelas })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}

// DELETE /api/zoom/:id — hapus zoom meeting (ADMIN ONLY)
exports.deleteZoom = async (req, res) => {
  try {
    const { id } = req.params

    const meeting = await ZoomMeeting.findByPk(id)
    if (!meeting) {
      return res.status(404).json({ message: 'Zoom meeting tidak ditemukan' })
    }

    // Catatan: riwayat belajar yang sudah mencatat zoomMeetingId ini akan
    // tetap ada di database, tapi relasi ZoomMeeting-nya jadi null saat
    // di-fetch ulang (foreign key tidak di-cascade-delete). Ini supaya
    // riwayat user tidak ikut hilang hanya karena admin hapus zoom meeting.
    await meeting.destroy()
    res.json({ message: 'Zoom meeting berhasil dihapus' })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}