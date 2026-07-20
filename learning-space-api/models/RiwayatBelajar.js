const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')
const User = require('./User')
const Materi = require('./Materi')
const ZoomMeeting = require('./ZoomMeeting')

const RiwayatBelajar = sequelize.define('RiwayatBelajar', {
  jenis: {
    type: DataTypes.STRING, // 'video', 'jurnal', atau 'zoom'
    allowNull: true,
  },
  waktuAkses: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  // materiId DAN zoomMeetingId keduanya opsional (nullable) — satu baris
  // riwayat hanya akan mengisi SALAH SATU dari keduanya, sesuai jenis
  // aktivitasnya: belajar materi (materiId terisi) atau ikut zoom (zoomMeetingId terisi).
  materiId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  zoomMeetingId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
})

User.hasMany(RiwayatBelajar, { foreignKey: 'userId' })
RiwayatBelajar.belongsTo(User, { foreignKey: 'userId' })

Materi.hasMany(RiwayatBelajar, { foreignKey: 'materiId' })
RiwayatBelajar.belongsTo(Materi, { foreignKey: 'materiId' })

ZoomMeeting.hasMany(RiwayatBelajar, { foreignKey: 'zoomMeetingId' })
RiwayatBelajar.belongsTo(ZoomMeeting, { foreignKey: 'zoomMeetingId' })

module.exports = RiwayatBelajar