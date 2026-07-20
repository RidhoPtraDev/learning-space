const sequelize = require('./config/database')
const RiwayatBelajar = require('./models/RiwayatBelajar')
const User = require('./models/User')

async function run() {
  try {
    await sequelize.authenticate()
    console.log('DB Connected')
    const list = await RiwayatBelajar.findAll({ limit: 5 })
    console.log('RiwayatBelajar entries:', JSON.stringify(list, null, 2))
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

run()
