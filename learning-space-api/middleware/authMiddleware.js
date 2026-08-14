const jwt = require('jsonwebtoken')
const User = require('../models/User')

module.exports = async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token tidak ditemukan, silakan login ulang' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Admin tidak perlu cek ban — admin dikelola lewat adminMiddleware
    // User biasa: cek apakah akun masih aktif (tidak ban, tidak soft-delete)
    if (decoded.role !== 'admin') {
      // paranoid: false → aman meski kolom deletedAt belum ada di DB (sync belum jalan)
      // Setelah server restart & sync, Sequelize akan filter deletedAt IS NULL secara default
      const user = await User.findByPk(decoded.id, {
        attributes: ['id', 'isBanned', 'deletedAt'],
        paranoid: false,
      })
      if (!user || user.deletedAt) {
        return res.status(401).json({ message: 'Akun tidak ditemukan. Silakan daftar kembali.' })
      }
      if (user.isBanned) {
        return res.status(403).json({ message: 'Akun Anda telah diblokir oleh admin. Hubungi support untuk informasi lebih lanjut.' })
      }
    }

    req.userId = decoded.id
    req.userRole = decoded.role
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Token tidak valid atau sudah expired' })
  }
}