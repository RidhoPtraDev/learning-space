const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

// Tabel sementara untuk OTP reset password.
// Setelah password berhasil direset, baris ini dihapus.
const PasswordResetOtp = sequelize.define('PasswordResetOtp', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
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

module.exports = PasswordResetOtp
