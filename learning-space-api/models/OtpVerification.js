const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

// Tabel sementara untuk menyimpan data pendaftaran yang BELUM diverifikasi.
// Setelah OTP diverifikasi, baris ini akan dihapus dan baris baru dibuat di Users.
// Baris yang sudah kadaluarsa (otpExpiresAt < NOW) akan dibersihkan secara berkala.
const OtpVerification = sequelize.define('OtpVerification', {
  nama: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  otpCode: {
    type: DataTypes.STRING(6),
    allowNull: false,
  },
  otpExpiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  lastSentAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Waktu terakhir OTP dikirim, dipakai untuk cooldown resend (min 60 detik)',
  },
})

module.exports = OtpVerification
