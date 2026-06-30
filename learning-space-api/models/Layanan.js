const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Layanan = sequelize.define('Layanan', {
  judul: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  deskripsi: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  gambar: {
    type: DataTypes.STRING,   // URL gambar layanan
    allowNull: true,
  },
  tampil: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  urutan: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
})

module.exports = Layanan