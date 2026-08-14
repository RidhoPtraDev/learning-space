const express = require('express')
const cors    = require('cors')
require('dotenv').config()

const sequelize = require('./config/database')
const { verifySMTP } = require('./utils/mailer')

require('./models/User')
require('./models/Kelas')
require('./models/Materi')
require('./models/RiwayatBelajar')
require('./models/Favorit')
require('./models/ZoomMeeting')
require('./models/Testimoni')
require('./models/Layanan')
require('./models/OtpVerification')
require('./models/MateriSelesai')
require('./models/Reminder')
require('./models/PasswordResetOtp')

const app = express()
app.use(cors())
app.use(express.json())

// Serve file upload (icon kelas, ilustrasi materi) sebagai static file,
// bisa diakses lewat http://localhost:5000/uploads/kelas/namafile.png dst
app.use('/uploads', express.static(require('path').join(__dirname, 'uploads')))

app.get('/', (req, res) => {
  res.json({ message: 'API LearningSpace jalan!' })
})

app.use('/api/auth',    require('./routes/authRoutes'))
app.use('/api/users',   require('./routes/userRoutes'))
app.use('/api/kelas',   require('./routes/kelasRoutes'))
app.use('/api/riwayat', require('./routes/riwayatRoutes'))
app.use('/api/favorit', require('./routes/favoritRoutes'))
app.use('/api/zoom', require('./routes/zoomRoutes'))
app.use('/api/admin', require('./routes/adminRoutes'))
app.use('/api/testimoni', require('./routes/testimoniRoutes'))
app.use('/api/layanan', require('./routes/layananRoutes'))
app.use('/api/analitik', require('./routes/analitikRoutes'))
app.use('/api/reminder', require('./routes/reminderRoutes'))

const PORT = process.env.PORT || 5000

sequelize.authenticate()
  .then(() => {
    console.log('✅ Database terkoneksi')
    return sequelize.sync()
  })
  .then(() => {
    console.log('✅Semua tabel sudah ter-sync')
    app.listen(PORT, async () => {
      console.log(`🚀 Server jalan di http://localhost:${PORT}`)
      // Cek koneksi SMTP Gmail saat startup — error akan terlihat langsung di log
      await verifySMTP()
    })
  })
  .catch((err) => {
    console.error('❌ Error:', err.message)
  })