const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')
const Kelas = require('./Kelas')

const Materi = sequelize.define('Materi', {
  judul: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  deskripsiSingkat: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  deskripsi: {
    type: DataTypes.TEXT, // disimpan sebagai JSON string array of paragraf
    allowNull: true,
  },
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  videoJudul: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  jurnalJudul: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  jurnalUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ilustrasi: {
    type: DataTypes.STRING, // nama file, diakses dari /icons/<nama>
    allowNull: true,
  },
})

// Relasi: 1 Kelas punya banyak Materi
Kelas.hasMany(Materi, { foreignKey: 'kelasId' })
Materi.belongsTo(Kelas, { foreignKey: 'kelasId' })

module.exports = Materi