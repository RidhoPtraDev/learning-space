const nodemailer = require('nodemailer')
const { buildEmailHTML } = require('./emailTemplate')

/**
 * Buat transporter baru setiap kali dipanggil supaya selalu pakai
 * credential terbaru dari process.env (tidak ter-cache jika .env diupdate
 * saat runtime dan server di-restart).
 */
function buatTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}

/**
 * Verifikasi koneksi SMTP saat server start.
 * Dipanggil dari server.js setelah DB sync.
 */
async function verifySMTP() {
  const transporter = buatTransporter()
  return new Promise((resolve) => {
    transporter.verify((err, success) => {
      if (err) {
        console.error('⚠️  SMTP Gmail GAGAL terhubung:')
        console.error('   code   :', err.code)
        console.error('   message:', err.message)
        console.warn('   Pengiriman OTP email akan gagal. Cek EMAIL_USER/EMAIL_PASS di .env')
        resolve(false)
      } else {
        console.log(`✅ SMTP Gmail OK — ${process.env.EMAIL_USER}`)
        resolve(true)
      }
    })
  })
}

/**
 * Kirim email OTP ke calon user yang baru mendaftar.
 * @param {string} to      Alamat email tujuan
 * @param {string} nama    Nama calon user (untuk sapaan)
 * @param {string} otp     Kode OTP 6 digit
 */
async function kirimOtpEmail(to, nama, otp) {
  const transporter = buatTransporter()

  const bodyContent = `
    <p style="margin:0 0 8px;color:#333;font-size:0.95rem;">Halo, <strong>${nama}</strong>!</p>
    <p style="margin:0 0 20px;color:#555;font-size:0.9rem;line-height:1.6;">
      Terima kasih sudah mendaftar di <strong>LearningSpace</strong>. Gunakan kode verifikasi di bawah ini untuk menyelesaikan pendaftaran Anda.
    </p>
    <div style="text-align:center;margin:24px 0;">
      <div style="display:inline-block;background:linear-gradient(135deg,#EBF2FF,#dbeafe);border:2px solid #0066FF;border-radius:16px;padding:20px 40px;">
        <p style="margin:0 0 6px;font-size:0.78rem;color:#0066FF;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Kode OTP Anda</p>
        <p style="margin:0;font-size:2.5rem;font-weight:900;color:#0047CC;letter-spacing:8px;font-family:monospace;">${otp}</p>
      </div>
    </div>
    <p style="margin:0 0 8px;color:#888;font-size:0.82rem;text-align:center;">Kode berlaku selama <strong>10 menit</strong>. Jangan bagikan kode ini kepada siapapun.</p>
    <p style="margin:16px 0 0;color:#aaa;font-size:0.78rem;text-align:center;">Jika Anda tidak merasa mendaftar, abaikan email ini.</p>
  `

  const html = buildEmailHTML({
    headerTitle: 'Verifikasi Pendaftaran — LearningSpace',
    headerSubtitle: 'Satu langkah lagi untuk memulai belajar 🚀',
    bodyContent,
  })

  await transporter.sendMail({
    from: `"LearningSpace" <${process.env.EMAIL_USER}>`,
    to,
    subject: `[LearningSpace] Kode OTP Verifikasi: ${otp}`,
    html,
  })
}

/**
 * Kirim email OTP reset password ke user.
 * @param {string} to      Alamat email tujuan
 * @param {string} nama    Nama user
 * @param {string} otp     Kode OTP 6 digit
 */
async function kirimResetPasswordEmail(to, nama, otp) {
  const transporter = buatTransporter()

  const bodyContent = `
    <p style="margin:0 0 8px;color:#333;font-size:0.95rem;">Halo, <strong>${nama}</strong>!</p>
    <p style="margin:0 0 20px;color:#555;font-size:0.9rem;line-height:1.6;">
      Kami menerima permintaan untuk <strong>reset password</strong> akun LearningSpace kamu.
      Gunakan kode verifikasi di bawah ini untuk melanjutkan. Jika kamu tidak meminta ini, abaikan email ini.
    </p>
    <div style="text-align:center;margin:24px 0;">
      <div style="display:inline-block;background:linear-gradient(135deg,#FFF8E7,#fef3c7);border:2px solid #F59E0B;border-radius:16px;padding:20px 40px;">
        <p style="margin:0 0 6px;font-size:0.78rem;color:#F59E0B;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Kode Reset Password</p>
        <p style="margin:0;font-size:2.5rem;font-weight:900;color:#92400e;letter-spacing:8px;font-family:monospace;">${otp}</p>
      </div>
    </div>
    <p style="margin:0 0 8px;color:#888;font-size:0.82rem;text-align:center;">Kode berlaku selama <strong>10 menit</strong>. Jangan bagikan kode ini kepada siapapun.</p>
    <p style="margin:16px 0 0;color:#aaa;font-size:0.78rem;text-align:center;">Jika Anda tidak merasa meminta reset password, abaikan email ini. Akun Anda aman.</p>
  `

  const html = buildEmailHTML({
    headerTitle: 'Reset Password — LearningSpace',
    headerSubtitle: 'Buat password baru untuk akun kamu 🔑',
    bodyContent,
  })

  await transporter.sendMail({
    from: `"LearningSpace" <${process.env.EMAIL_USER}>`,
    to,
    subject: `[LearningSpace] Kode Reset Password: ${otp}`,
    html,
  })
}

module.exports = { kirimOtpEmail, kirimResetPasswordEmail, verifySMTP }
