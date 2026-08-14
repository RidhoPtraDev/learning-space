# Backend API — LearningSpace

REST API untuk platform LearningSpace, dibangun dengan **Node.js + Express + Sequelize + MySQL**.

## 📦 Stack

- **Runtime**: Node.js 18+
- **Framework**: Express 5
- **ORM**: Sequelize 6
- **Database**: MySQL 8
- **Auth**: JWT + bcryptjs
- **Email**: Nodemailer (Gmail SMTP)
- **Upload**: Multer

## 🚀 Menjalankan Lokal

```bash
npm install
cp .env.example .env   # isi sesuai konfigurasi lokal
npm run dev            # development (nodemon)
npm start              # production
```

Server berjalan di **http://localhost:5000**

## 📁 Struktur

```
controllers/    ← Business logic per resource
middleware/     ← Auth JWT, error handler
models/         ← Sequelize models
routes/         ← Express route definitions
utils/          ← Helper (mailer, template email, analitik)
uploads/        ← File upload hasil (tidak di-commit)
server.js       ← Entry point
.env.example    ← Template environment variables
```

## 🔐 Environment Variables

Salin `.env.example` menjadi `.env` dan isi nilainya:

| Variable | Deskripsi |
|----------|----------|
| `DB_NAME` | Nama database MySQL |
| `DB_USER` | Username MySQL |
| `DB_PASSWORD` | Password MySQL |
| `DB_HOST` | Host MySQL (biasanya `localhost`) |
| `PORT` | Port server (default: `5000`) |
| `JWT_SECRET` | Secret key JWT (buat string random panjang) |
| `EMAIL_USER` | Email Gmail untuk SMTP |
| `EMAIL_PASS` | App Password Gmail (bukan password biasa!) |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID (opsional) |

## 📡 API Endpoints (Ringkasan)

| Method | Endpoint | Deskripsi | Auth |
|--------|---------|-----------|------|
| POST | `/api/auth/register` | Registrasi + kirim OTP | - |
| POST | `/api/auth/verify-otp` | Verifikasi OTP email | - |
| POST | `/api/auth/login` | Login | - |
| POST | `/api/auth/forgot-password` | Kirim OTP reset password | - |
| POST | `/api/auth/reset-password` | Reset password dengan OTP | - |
| GET | `/api/kelas` | Daftar semua kelas | ✅ |
| GET | `/api/kelas/:id/materi` | Daftar materi satu kelas | ✅ |
| GET | `/api/favorit` | Kelas favorit user | ✅ |
| POST | `/api/riwayat` | Catat riwayat belajar | ✅ |
| GET | `/api/analitik/progress` | Data analitik progress | ✅ |
| GET | `/api/reminder` | Daftar reminder | ✅ |
| GET | `/api/admin/summary` | Ringkasan statistik admin | 🔑 Admin |
| GET | `/api/admin/users` | Daftar user | 🔑 Admin |

> Dokumentasi lengkap endpoint tersedia di (akan ditambahkan): Postman Collection / OpenAPI Spec
