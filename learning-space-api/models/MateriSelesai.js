const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')
const User = require('./User')
const Materi = require('./Materi')

// Menandai materi mana yang sudah "selesai dibaca" oleh user.
// Satu baris = satu user sudah menyelesaikan satu materi.
// Dipakai untuk menghitung "Kelas Selesai": kelas dianggap selesai
// kalau SEMUA materi di kelas itu sudah ada baris MateriSelesai milik user.
const MateriSelesai = sequelize.define('MateriSelesai', {
  selesaiPada: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  indexes: [
    { unique: true, fields: ['userId', 'materiId'] }, // 1 user hanya bisa 1x selesai per materi
  ],
})

User.hasMany(MateriSelesai, { foreignKey: 'userId' })
MateriSelesai.belongsTo(User, { foreignKey: 'userId' })

Materi.hasMany(MateriSelesai, { foreignKey: 'materiId' })
MateriSelesai.belongsTo(Materi, { foreignKey: 'materiId' })

module.exports = MateriSelesai