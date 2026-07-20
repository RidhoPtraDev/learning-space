const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')
const User = require('../models/User')
const OtpVerification = require('../models/OtpVerification')
const PasswordResetOtp = require('../models/PasswordResetOtp')
const { kirimOtpEmail, kirimResetPasswordEmail } = require('../utils/mailer')

// ── Helper: generate OTP 6 digit ──────────────────────────────────────────────
function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

// ── Helper: hapus baris OtpVerification yang sudah expired ────────────────────
// Dipanggil setiap kali ada request register/verify-otp supaya tabel tidak menumpuk.
async function bersihkanOtpExpired() {
  await OtpVerification.destroy({
    where: { otpExpiresAt: { [Op.lt]: new Date() } },
  })
}

// ── REGISTER (Step 1: kirim OTP, belum buat akun) ─────────────────────────────
exports.register = async (req, res) => {
  try {
    const { nama, email, password } = req.body

    if (!nama || !email || !password) {
      return res.status(400).json({ message: 'Semua field wajib diisi' })
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password minimal 8 karakter' })
    }

    // Bersihkan OTP expired agar tidak menghalangi register ulang
    await bersihkanOtpExpired()

    // Cek apakah email sudah terdaftar sebagai akun AKTIF di Users
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ message: 'Email sudah terdaftar' })
    }

    // Hash password sekali di sini (aman disimpan sementara di OtpVerification)
    const passwordHash = await bcrypt.hash(password, 10)
    const otpCode = generateOtp()
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 menit
    const lastSentAt = new Date()

    // Upsert: kalau email ini sudah ada di OtpVerification (misal daftar ulang
    // sebelum OTP lama kedaluarsa), ganti dengan OTP baru.
    await OtpVerification.upsert({
      nama,
      email,
      passwordHash,
      otpCode,
      otpExpiresAt,
      lastSentAt,
    })

    // Kirim OTP ke email — kalau gagal, jangan buat entri OTP (rollback upsert)
    try {
      await kirimOtpEmail(email, nama, otpCode)
    } catch (mailErr) {
      // Hapus baris yang baru di-upsert agar tidak menjadi entri "menggantung"
      await OtpVerification.destroy({ where: { email } })
      // Log FULL error supaya root cause terlihat di terminal server
      console.error('=== [OTP EMAIL ERROR] ===')
      console.error('code    :', mailErr.code)
      console.error('command :', mailErr.command)
      console.error('message :', mailErr.message)
      console.error('full err:', mailErr)
      console.error('=========================')
      return res.status(500).json({
        message: 'Gagal mengirim email OTP. Pastikan email benar dan coba lagi.',
        error: mailErr.message,
        code: mailErr.code,
      })
    }

    res.status(202).json({
      message: 'Kode OTP telah dikirim ke email Anda. Silakan cek inbox (dan folder spam).',
      email,
    })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}

// ── VERIFY OTP (Step 2: verifikasi, buat akun, login otomatis) ────────────────
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email dan kode OTP wajib diisi' })
    }

    // Bersihkan OTP expired sebelum mencari
    await bersihkanOtpExpired()

    const pending = await OtpVerification.findOne({ where: { email } })
    if (!pending) {
      return res.status(404).json({
        message: 'Tidak ada pendaftaran menunggu untuk email ini. OTP mungkin sudah kadaluarsa, silakan daftar ulang.',
      })
    }

    // Cek kadaluarsa (bersihkanOtpExpired sudah hapus yang expired,
    // tapi kita tetap cek di sini untuk pesan yang lebih informatif)
    if (new Date() > new Date(pending.otpExpiresAt)) {
      await pending.destroy()
      return res.status(400).json({
        message: 'Kode OTP sudah kadaluarsa. Silakan daftar ulang atau minta kirim ulang kode.',
        expired: true,
      })
    }

    if (pending.otpCode !== String(otp)) {
      return res.status(400).json({ message: 'Kode OTP salah. Silakan periksa kembali.' })
    }

    // OTP valid → buat akun permanen di Users
    const user = await User.create({
      nama: pending.nama,
      email: pending.email,
      password: pending.passwordHash,
      role: 'user',
    })

    // Hapus entri OtpVerification setelah akun dibuat
    await pending.destroy()

    // Login otomatis: generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    res.status(201).json({
      message: 'Verifikasi berhasil! Akun Anda sudah aktif.',
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

// ── RESEND OTP (cooldown 60 detik) ────────────────────────────────────────────
exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: 'Email wajib diisi' })
    }

    const pending = await OtpVerification.findOne({ where: { email } })
    if (!pending) {
      return res.status(404).json({
        message: 'Tidak ada pendaftaran menunggu untuk email ini. Silakan daftar ulang.',
      })
    }

    // Cooldown: tidak boleh resend dalam 60 detik terakhir
    if (pending.lastSentAt) {
      const selisihDetik = Math.floor((Date.now() - new Date(pending.lastSentAt).getTime()) / 1000)
      if (selisihDetik < 60) {
        return res.status(429).json({
          message: `Tunggu ${60 - selisihDetik} detik lagi sebelum mengirim ulang kode OTP.`,
          sisaDetik: 60 - selisihDetik,
        })
      }
    }

    // Generate OTP baru, perpanjang waktu expired
    const newOtp = generateOtp()
    pending.otpCode = newOtp
    pending.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000)
    pending.lastSentAt = new Date()
    await pending.save()

    try {
      await kirimOtpEmail(email, pending.nama, newOtp)
    } catch (mailErr) {
      console.error('[mailer] Gagal kirim ulang email:', mailErr.message)
      return res.status(500).json({
        message: 'Gagal mengirim ulang email. Coba lagi nanti.',
        error: mailErr.message,
      })
    }

    res.json({ message: 'Kode OTP baru telah dikirim ke email Anda.' })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}

// ── LOGIN ──────────────────────────────────────────────────────────────────────
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

    if (user.isBanned) {
      return res.status(403).json({ message: 'Akun Anda telah diblokir oleh admin. Hubungi support untuk informasi lebih lanjut.' })
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

// ── FORGOT PASSWORD (Step 1: kirim OTP ke email) ───────────────────────────────
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ message: 'Email wajib diisi' })

    const user = await User.findOne({ where: { email } })
    if (!user) {
      // Best practice: jangan bocorkan apakah email terdaftar
      return res.status(200).json({ message: 'Jika email terdaftar, kode OTP telah dikirim ke email Anda.' })
    }

    const otpCode = generateOtp()
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000)
    await PasswordResetOtp.upsert({ email, otpCode, otpExpiresAt, lastSentAt: new Date() })

    try {
      await kirimResetPasswordEmail(email, user.nama, otpCode)
    } catch (mailErr) {
      await PasswordResetOtp.destroy({ where: { email } })
      return res.status(500).json({ message: 'Gagal mengirim email OTP.', error: mailErr.message })
    }

    res.status(200).json({ message: 'Jika email terdaftar, kode OTP telah dikirim ke email Anda.' })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}

// ── VERIFY RESET OTP (Step 2: verifikasi OTP → kembalikan resetToken) ──────────
exports.verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body
    if (!email || !otp) return res.status(400).json({ message: 'Email dan kode OTP wajib diisi' })

    const pending = await PasswordResetOtp.findOne({ where: { email } })
    if (!pending) {
      return res.status(404).json({ message: 'Tidak ada permintaan reset password untuk email ini. Silakan ulangi dari awal.' })
    }

    if (new Date() > new Date(pending.otpExpiresAt)) {
      await pending.destroy()
      return res.status(400).json({ message: 'Kode OTP sudah kadaluarsa. Silakan minta kode baru.', expired: true })
    }

    if (pending.otpCode !== String(otp)) {
      return res.status(400).json({ message: 'Kode OTP salah. Silakan periksa kembali.' })
    }

    // OTP valid → issue resetToken (berlaku 10 menit)
    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '10m' })
    res.status(200).json({ message: 'OTP valid. Silakan buat password baru.', resetToken })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}

// ── RESEND RESET OTP (cooldown 60 detik) ───────────────────────────────────────
exports.resendResetOtp = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ message: 'Email wajib diisi' })

    const pending = await PasswordResetOtp.findOne({ where: { email } })
    if (!pending) {
      return res.status(404).json({ message: 'Tidak ada permintaan reset password. Silakan ulangi dari awal.' })
    }

    if (pending.lastSentAt) {
      const detik = Math.floor((Date.now() - new Date(pending.lastSentAt).getTime()) / 1000)
      if (detik < 60) {
        return res.status(429).json({ message: `Tunggu ${60 - detik} detik lagi.`, sisaDetik: 60 - detik })
      }
    }

    const newOtp = generateOtp()
    pending.otpCode = newOtp
    pending.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000)
    pending.lastSentAt = new Date()
    await pending.save()

    const user = await User.findOne({ where: { email } })
    try {
      await kirimResetPasswordEmail(email, user?.nama || 'Pengguna', newOtp)
    } catch (mailErr) {
      return res.status(500).json({ message: 'Gagal mengirim ulang email.', error: mailErr.message })
    }

    res.json({ message: 'Kode OTP baru telah dikirim ke email Anda.' })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}

// ── RESET PASSWORD (Step 3: ganti password pakai resetToken) ───────────────────
exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, passwordBaru } = req.body
    if (!resetToken || !passwordBaru) return res.status(400).json({ message: 'Token dan password baru wajib diisi' })
    if (passwordBaru.length < 8) return res.status(400).json({ message: 'Password minimal 8 karakter' })

    let payload
    try {
      payload = jwt.verify(resetToken, process.env.JWT_SECRET)
    } catch {
      return res.status(401).json({ message: 'Token reset sudah kadaluarsa, silakan ulangi dari awal.', expired: true })
    }

    const user = await User.findOne({ where: { email: payload.email } })
    if (!user) return res.status(404).json({ message: 'Akun tidak ditemukan.' })

    user.password = await bcrypt.hash(passwordBaru, 10)
    await user.save()
    await PasswordResetOtp.destroy({ where: { email: payload.email } })

    res.status(200).json({ message: 'Password berhasil diubah. Silakan login dengan password baru.' })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message })
  }
}