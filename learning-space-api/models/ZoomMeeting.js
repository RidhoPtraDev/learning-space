const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')
const Kelas = require('./Kelas')

const ZoomMeeting = sequelize.define('ZoomMeeting', {
  link: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  waktu: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  judulMateri: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tanggalTeks: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  jamTeks: {
    type: DataTypes.STRING,
    allowNull: true,
  },
})

Kelas.hasMany(ZoomMeeting, { foreignKey: 'kelasId' })
ZoomMeeting.belongsTo(Kelas, { foreignKey: 'kelasId' })

module.exports = ZoomMeeting