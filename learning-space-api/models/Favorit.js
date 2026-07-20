const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')
const User = require('./User')
const Kelas = require('./Kelas')

const Favorit = sequelize.define('Favorit', {})

User.belongsToMany(Kelas, { through: Favorit, foreignKey: 'userId' })
Kelas.belongsToMany(User, { through: Favorit, foreignKey: 'kelasId' })

module.exports = Favorit