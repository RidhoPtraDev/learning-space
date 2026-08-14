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

## 👥 Tim & Pembagian Branch Development

Repository ini dikelola secara terstruktur dengan penamaan branch pengembang profesional sesuai peran masing-masing anggota tim:

| Peran / Komponen | Penanggung Jawab | Branch GitHub |
|------------------|------------------|---------------|
| 🎨 **UI / UX Design** | **Muhammad Lukman** | [`ui-ux/muhammad-lukman`](https://github.com/RidhoPtraDev/learning-space/tree/ui-ux/muhammad-lukman) |
| 💻 **Frontend User** | **Arviandra Deska** | [`frontend/arviandra-deska`](https://github.com/RidhoPtraDev/learning-space/tree/frontend/arviandra-deska) |
| ⚙️ **Backend API** | **Ridho Putra Aulia** | [`backend/ridho-putra`](https://github.com/RidhoPtraDev/learning-space/tree/backend/ridho-putra) |
| 🛡️ **Frontend Admin** | **Ridho Putra Aulia** | [`admin/ridho-putra`](https://github.com/RidhoPtraDev/learning-space/tree/admin/ridho-putra) |
| 🗄️ **Database & Security** | **Ridho Putra Aulia** | [`database/ridho-putra`](https://github.com/RidhoPtraDev/learning-space/tree/database/ridho-putra) |
| 🚀 **Production / Main** | **Lead Maintainer** | [`main`](https://github.com/RidhoPtraDev/learning-space/tree/main) |

---

## 🏗️ Struktur Monorepo

```
learning-space/           → Frontend User (React + Vite) — Dev: Arviandra Deska
learning-space-admin/     → Frontend Admin (React + Vite) — Dev: Ridho Putra Aulia
learning-space-api/       → Backend REST API (Node.js + Express + Sequelize) — Dev: Ridho Putra Aulia
```

---

## ✨ Fitur Utama

### 👤 User (Frontend User)
- Registrasi & Login dengan verifikasi OTP via Email
- Lupa Password (reset via OTP email)
- Dashboard kelas pembelajaran dengan filter kategori
- Kelas Favorit, Riwayat Belajar, Kelas Zoom Meeting
- Analitik Progress (grafik aktivitas harian, streak, insight)
- Reminder jadwal belajar
- Edit Profil & Upload Foto

### 🛡️ Admin (Frontend Admin)
- Dashboard ringkasan (total user, kelas, materi, zoom)
- Manajemen Status User (ban/unban/hapus)
- Manajemen Kelas & Materi
- Manajemen Zoom Meeting
- Manajemen Testimoni & Layanan
- Log Aktivitas User real-time
- Profil Admin

---

## 🔒 Privasi Data & Keamanan Database

1. **Aturan File Privasi (.gitignore)**:
   - File `.env` yang berisi kredensial rahasia (DB Password, JWT Secret, App Password Gmail) **TIDAK PERNAH** di-upload ke repository public.
   - Folder `node_modules/`, log file, OS metadata, dan asset upload runtime dikecualikan sepenuhnya dari versi git.
2. **Akses Database**:
   - Skema database dan skrip internal hanya dapat diakses & dikelola secara privat oleh **Ridho Putra Aulia** sebagai Database Lead.
   - Aplikasi menggunakan Sequelize ORM dengan parameterized queries untuk mencegah SQL Injection.

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
npm install
cp .env.example .env
# Isi nilai di .env sesuai environment lokal kamu
npm run dev
```

### 3. Setup Frontend User
```bash
cd learning-space
npm install
npm run dev
```
Akses di: **http://localhost:5173**

### 4. Setup Frontend Admin
```bash
cd learning-space-admin
npm install
npm run dev
```
Akses di: **http://localhost:5174**

---

## 🤝 Berkontribusi

Lihat panduan lengkap di **[CONTRIBUTING.md](./CONTRIBUTING.md)**.

---

## 📜 Changelog

Lihat **[CHANGELOG.md](./CHANGELOG.md)** untuk riwayat perubahan versi.

---

## 📄 Lisensi

Distributed under the **MIT License**. Lihat [`LICENSE`](./LICENSE) untuk detail.
