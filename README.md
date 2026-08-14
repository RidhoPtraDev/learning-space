<div align="center">
  <img src="learning-space/src/assets/logo.png" alt="LearningSpace Logo" height="80" />
  <h1>LearningSpace</h1>
  <p><strong>Platform pembelajaran online modern untuk pelajar Indonesia</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Status-Active-22c55e?style=flat-square" />
    <img src="https://img.shields.io/badge/Node.js-22.x-339933?style=flat-square&logo=node.js" />
    <img src="https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react" />
    <img src="https://img.shields.io/badge/MySQL-8.x-4479A1?style=flat-square&logo=mysql" />
    <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" />
  </p>
</div>

---

## 📖 Tentang Project

**LearningSpace** adalah platform e-learning berbasis web yang memungkinkan pelajar mengakses materi, mengikuti kelas video, Zoom Meeting, serta memantau progress belajar mereka secara real-time. Admin dapat mengelola kelas, materi, zoom meeting, testimoni, layanan, dan memantau aktivitas user melalui dashboard khusus.

---

## 🏗️ Struktur Monorepo

```
learning-space/           → Frontend User (React + Vite)
learning-space-admin/     → Frontend Admin (React + Vite)
learning-space-api/       → Backend REST API (Node.js + Express + Sequelize)
```

---

## ✨ Fitur Utama

### 👤 User
- Registrasi & Login dengan verifikasi OTP via Email
- Lupa Password (reset via OTP email)
- Dashboard kelas pembelajaran dengan filter kategori
- Kelas Favorit, Riwayat Belajar, Kelas Zoom Meeting
- Analitik Progress (grafik aktivitas harian, streak, insight)
- Reminder jadwal belajar
- Edit Profil & Upload Foto

### 🛡️ Admin
- Dashboard ringkasan (total user, kelas, materi, zoom)
- Manajemen Status User (ban/unban/hapus)
- Manajemen Kelas & Materi
- Manajemen Zoom Meeting
- Manajemen Testimoni & Layanan
- Log Aktivitas User real-time
- Profil Admin

---

## 🛠️ Tech Stack

| Layer        | Teknologi                                   |
|-------------|---------------------------------------------|
| Frontend    | React 19, Vite 8, React Router v7           |
| Admin       | React 19, Vite 8, React Router v7           |
| Backend     | Node.js, Express 5, Sequelize ORM           |
| Database    | MySQL 8 (via XAMPP / MySQL Server)          |
| Auth        | JWT (jsonwebtoken) + bcryptjs               |
| Email OTP   | Nodemailer (Gmail SMTP)                     |
| File Upload | Multer                                      |

---

## 🚀 Cara Menjalankan Secara Lokal

### Prasyarat
- Node.js v18+ 
- MySQL (XAMPP direkomendasikan untuk Windows)
- Git

### 1. Clone Repository
```bash
git clone https://github.com/RidhoPtraDev/learning-space.git
cd learning-space
```

### 2. Setup Backend (API)
```bash
cd learning-space-api

# Install dependencies
npm install

# Salin dan konfigurasi environment
cp .env.example .env
# Isi nilai di .env sesuai environment lokal kamu (lihat bagian Environment Variables)

# Jalankan server
npm run dev
```

### 3. Setup Frontend User
```bash
cd learning-space

npm install
cp .env.example .env     # opsional, jika ada konfigurasi khusus
npm run dev
```

Akses di: **http://localhost:5173**

### 4. Setup Frontend Admin
```bash
cd learning-space-admin

npm install
cp .env.example .env     # opsional
npm run dev
```

Akses di: **http://localhost:5174**

---

## 🔐 Environment Variables

### `learning-space-api/.env`

```env
# Database
DB_NAME=learning_space
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=3306

# JWT
JWT_SECRET=your_jwt_secret_key_here

# Server
PORT=5000

# Email (Gmail SMTP — gunakan App Password, bukan password biasa)
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your_gmail_app_password

# Google OAuth (opsional)
GOOGLE_CLIENT_ID=your_google_client_id
```

> ⚠️ **JANGAN pernah commit file `.env` yang berisi kredensial asli ke repository!**

---

## 📁 Struktur Directory Lengkap

```
learning-space-api/
├── controllers/          ← Logic handler tiap route
├── middleware/           ← Auth & error middleware
├── models/               ← Sequelize models (ORM)
├── routes/               ← Definisi endpoint API
├── utils/                ← Helper (mailer, email template, analitik)
├── uploads/              ← File upload (tidak di-commit, lihat .gitignore)
├── .env.example          ← Template environment variables
└── server.js             ← Entry point

learning-space/
├── src/
│   ├── api/              ← Axios instance & config
│   ├── assets/           ← Gambar, ikon, ilustrasi
│   ├── components/       ← Komponen reusable (BackButton, RightSidebar, dll)
│   └── pages/            ← Halaman-halaman aplikasi
└── vite.config.js

learning-space-admin/
├── src/
│   ├── api/              ← Axios instance admin
│   ├── assets/           ← Asset admin
│   └── pages/            ← Halaman admin (AdminDashboard, dll)
└── vite.config.js
```

---

## 🤝 Berkontribusi

Lihat panduan lengkap di **[CONTRIBUTING.md](./CONTRIBUTING.md)**

---

## 📜 Changelog

Lihat **[CHANGELOG.md](./CHANGELOG.md)** untuk riwayat perubahan versi.

---

## 👥 Tim

| Nama | Role | GitHub |
|------|------|--------|
| Ridho Putra Aulia | Lead Developer (Fullstack) | [@RidhoPtraDev](https://github.com/RidhoPtraDev) |

> Ingin bergabung? Baca [CONTRIBUTING.md](./CONTRIBUTING.md) dan buat Pull Request! 🚀

---

## 📄 Lisensi

Distributed under the **MIT License**. Lihat [`LICENSE`](./LICENSE) untuk detail.
