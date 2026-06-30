const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Kelas = sequelize.define('Kelas', {
  nama: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  deskripsi: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  icon: {
    type: DataTypes.STRING, // path/url icon
    allowNull: true,
  },
  kategori: {
    type: DataTypes.STRING, // Umum, Digital, Sosial, dll
    allowNull: true,
  },
})

module.exports = Kelas