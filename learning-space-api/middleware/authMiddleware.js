const jwt = require('jsonwebtoken')

module.exports = function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token tidak ditemukan, silakan login ulang' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.id
    req.userRole = decoded.role
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Token tidak valid atau sudah expired' })
  }
}