const { Sequelize } = require('sequelize')
require('dns').setDefaultResultOrder('ipv4first')
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

const sequelize = dbUrl
  ? new Sequelize(dbUrl, {
      dialect: 'mysql',
      logging: false,
      dialectOptions: {
        connectTimeout: 30000,
        ssl: {
          rejectUnauthorized: false
        }
      }
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
        dialectOptions: {
          connectTimeout: 30000,
          ssl: {
            rejectUnauthorized: false
          }
        }
      }
    )

module.exports = sequelize