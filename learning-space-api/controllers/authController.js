const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

// REGISTER
exports.register = async (req, res) => {
  try {
    const { nama, email, password } = req.body

    if (!nama || !email || !password) {
      return res.status(400).json({ message: 'Semua field wajib diisi' })
    }

    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ message: 'Email sudah terdaftar' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      nama,
      email,
      password: hashedPassword,
      role: 'user',
    })

    res.status(201).json({
      message: 'Registrasi berhasil',
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

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password wajib diisi' })
    }

    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(404).json({ message: 'Email tidak ditemukan' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Password salah' })
    }

    // role ikut masuk ke dalam JWT payload
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    res.json({
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role,
        foto: user.foto || null,
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