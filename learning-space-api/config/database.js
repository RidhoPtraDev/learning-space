const { Sequelize } = require('sequelize')
require('dotenv').config()

const sequelize = (process.env.MYSQL_URL || process.env.DATABASE_URL)
  ? new Sequelize(process.env.MYSQL_URL || process.env.DATABASE_URL, {
      dialect: 'mysql',
      logging: false,
      dialectOptions: {
        connectTimeout: 30000
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
          connectTimeout: 30000
        }
      }
    )

module.exports = sequelize