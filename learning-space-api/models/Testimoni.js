const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Testimoni = sequelize.define('Testimoni', {
  nama: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,   // misal: 'Mahasiswa', 'Pelajar', 'Profesional'
    allowNull: true,
  },
  isi: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  foto: {
    type: DataTypes.STRING,   // URL foto avatar (opsional)
    allowNull: true,
  },
  tampil: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,       // true = ditampilkan di homepage
  },
  urutan: {
    type: DataTypes.INTEGER,
    defaultValue: 0,          // untuk mengatur urutan tampil
  },
})

module.exports = Testimoni