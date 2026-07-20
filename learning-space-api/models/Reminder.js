const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')
const User = require('./User')

const Reminder = sequelize.define('Reminder', {
  judul: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  kategori: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tanggal: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  jam: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  notifBefore: {
    type: DataTypes.STRING,
    defaultValue: '30 Menit Sebelumnya',
  },
  notifActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
})

User.hasMany(Reminder, { foreignKey: 'userId' })
Reminder.belongsTo(User, { foreignKey: 'userId' })

module.exports = Reminder
