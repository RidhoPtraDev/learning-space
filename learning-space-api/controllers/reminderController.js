const Reminder = require('../models/Reminder')

// GET /api/reminder
exports.getReminder = async (req, res) => {
  try {
    const reminders = await Reminder.findAll({
      where: { userId: req.userId },
      order: [
        ['tanggal', 'ASC'],
        ['jam', 'ASC'],
      ],
    })
    res.json({ reminders })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}

// POST /api/reminder
exports.createReminder = async (req, res) => {
  try {
    const { judul, kategori, tanggal, jam, notifBefore, notifActive } = req.body

    if (!judul || !tanggal || !jam) {
      return res.status(400).json({ message: 'Judul, tanggal, dan jam wajib diisi' })
    }

    const reminder = await Reminder.create({
      judul,
      kategori,
      tanggal,
      jam,
      notifBefore,
      notifActive,
      userId: req.userId,
    })

    res.status(201).json({ message: 'Reminder berhasil dibuat', reminder })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}

// PUT /api/reminder/:id
exports.updateReminder = async (req, res) => {
  try {
    const { id } = req.params
    const { judul, kategori, tanggal, jam, notifBefore, notifActive } = req.body

    const reminder = await Reminder.findOne({
      where: { id, userId: req.userId },
    })

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder tidak ditemukan' })
    }

    if (judul !== undefined) reminder.judul = judul
    if (kategori !== undefined) reminder.kategori = kategori
    if (tanggal !== undefined) reminder.tanggal = tanggal
    if (jam !== undefined) reminder.jam = jam
    if (notifBefore !== undefined) reminder.notifBefore = notifBefore
    if (notifActive !== undefined) reminder.notifActive = notifActive

    await reminder.save()

    res.json({ message: 'Reminder berhasil diperbarui', reminder })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}

// DELETE /api/reminder/:id
exports.deleteReminder = async (req, res) => {
  try {
    const { id } = req.params

    const reminder = await Reminder.findOne({
      where: { id, userId: req.userId },
    })

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder tidak ditemukan' })
    }

    await reminder.destroy()

    res.json({ message: 'Reminder berhasil dihapus' })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}
