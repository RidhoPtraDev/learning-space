const { Sequelize } = require('sequelize')
require('dns').setDefaultResultOrder('verbatim')
require('dotenv').config()

let dbUrl = process.env.MYSQL_URL || process.env.DATABASE_URL
if (dbUrl) {
  const targetDb = process.env.DB_NAME || 'learning_space'
  try {
    const parsed = new URL(dbUrl)
    parsed.pathname = `/${targetDb}`
    dbUrl = parsed.toString()
  } catch (e) {
    // fallback if string URL parsing fails
  }
}

const isRemoteDb = Boolean(
  process.env.DB_SSL === 'true' ||
  (process.env.DB_HOST && process.env.DB_HOST !== '127.0.0.1' && process.env.DB_HOST !== 'localhost') ||
  (dbUrl && !dbUrl.includes('127.0.0.1') && !dbUrl.includes('localhost'))
)

const dialectOptions = {
  connectTimeout: 30000
}

if (isRemoteDb) {
  dialectOptions.ssl = {
    rejectUnauthorized: false
  }
}

const sequelize = dbUrl
  ? new Sequelize(dbUrl, {
      dialect: 'mysql',
      logging: false,
      dialectOptions
    })
  : new Sequelize(
      process.env.DB_NAME || 'learning_space',
      process.env.DB_USER || 'root',
      process.env.DB_PASSWORD || '',
      {
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false,
        dialectOptions
      }
    )

module.exports = sequelize