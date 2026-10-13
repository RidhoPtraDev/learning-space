<p align="center">
  <img src="https://raw.githubusercontent.com/RidhoPtraDev/learning-space/main/learning-space/src/assets/logo.png" alt="LearningSpace Logo" height="60" />
</p>

<h1 align="center">LearningSpace</h1>

<p align="center">
  <strong>Sistem Pembelajaran Daring Modern & Terintegrasi Berbasis Web dengan Arsitektur Klien-Server Terpisah, API Tanpa Server (Serverless), dan Basis Data Awan</strong>
</p>

<p align="center">
  <a href="https://learning-space-user.vercel.app"><img src="https://img.shields.io/badge/Platform-Web%20(Vercel)-0066FF?style=flat-square&logo=vercel&logoColor=white" alt="Platform"></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/Frontend-React%2019%20%2F%20Vite%208-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React"></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/Backend-Node.js%20Express-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js"></a>
  <a href="https://sequelize.org"><img src="https://img.shields.io/badge/ORM-Sequelize%20v6-52B0E7?style=flat-square&logo=sequelize&logoColor=white" alt="Sequelize"></a>
  <a href="https://aiven.io"><img src="https://img.shields.io/badge/Database-Aiven%20MySQL%208.4-FF3E00?style=flat-square&logo=mysql&logoColor=white" alt="MySQL"></a>
  <a href="https://jwt.io"><img src="https://img.shields.io/badge/Security-JWT%20%2B%20BCrypt-red?style=flat-square&logo=jsonwebtokens&logoColor=white" alt="JWT"></a>
  <a href="https://nodemailer.com"><img src="https://img.shields.io/badge/Email-Gmail%20SMTP%20OTP-EA4335?style=flat-square&logo=gmail&logoColor=white" alt="SMTP"></a>
  <a href="https://vercel.com"><img src="https://img.shields.io/badge/Deployment-Vercel%20Edge%20Network-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel"></a>
  <a href="#-lisensi-license"><img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="License"></a>
</p>

---

## 📌 Ikhtisar Proyek (Executive Summary)

**LearningSpace** adalah platform pembelajaran daring modern yang dirancang untuk menyederhanakan, mengotomatiskan, dan menata alur belajar siswa di Indonesia melalui kurikulum interaktif, video pembelajaran, kelas tatap muka daring, serta analitik perkembangan belajar terpadu.

Seringkali proses belajar mandiri menghadapi kendala minimnya keteraturan jadwal, materi yang tercecer, dan ketiadaan rekam jejak progres harian. **LearningSpace** hadir sebagai solusi teknologi pendidikan (*ed-tech*) terpadu dengan portal pengguna yang intuitif, pusat kendali admin untuk tata kelola silabus, serta arsitektur backend berkinerja tinggi yang menghubungkan siswa dengan materi pembelajaran berkualitas kapan saja dan di mana saja.

---

## ✨ Fitur Utama (Key Features)

### 1. 🎓 Portal Belajar Siswa (Student Learning Portal)
* **Katalog Kelas Lengkap**: Akses modul pembelajaran terstruktur (Kimia, Matematika, Fisika, Sejarah, Bahasa Indonesia, dan Komputer) dengan video player adaptif dan ringkasan materi.
* **Tatap Muka Virtual (Zoom Integration)**: Jadwal dan tautan langsung ke sesi pertemuan daring interaktif bersama mentor.
* **Manajemen Kelas Favorit & Riwayat**: Penyimpanan modul favorit dengan penandaan otomatis materi yang telah diselesaikan (*checklist progress*).
* **Pengingat Jadwal Belajar (Reminder Engine)**: Sistem pengingat jadwal belajar mandiri dan kelas daring yang tersemat pada bilah samping.

### 2. 📊 Analitik & Progres Belajar (Analytics & Progress)
* Rekam jejak konsistensi belajar harian (*Learning Streak*).
* Visualisasi grafik diagram penyelesaian silabus materi.
* Pemantauan waktu belajar dan indikator pemahaman topik secara langsung.

### 3. 🛡️ Pusat Kendali Pengelola (Admin Command Center)
* **Dasbor Metrik Sistem**: Ringkasan data peserta terdaftar, kelas aktif, modul materi terunggah, dan agenda pertemuan daring.
* **Tata Kelola Pengguna**: Kontrol akses akun, status penangguhan (*suspend/unsuspend*), dan pemantauan aktivitas.
* **Manajemen Kurikulum**: Operasi CRUD penuh untuk penambahan mata pelajaran, bab materi, materi bacaan, dan tautan video.
* **Moderasi Testimoni & Layanan**: Pengelolaan ulasan kepuasan siswa serta pembaruan paket layanan bimbingan.

### 4. 🔐 Autentikasi Pengguna & Keamanan (Auth & Security)
* Registrasi akun aman dengan verifikasi kode OTP 6-digit otomatis melalui email (**Google Cloud SMTP**).
* Sistem masuk berbasis token terenkripsi (**JSON Web Token & BCrypt**).
* Pemulihan akun mandiri melalui alur Lupa Kata Sandi (*Forgot Password flow*) terverifikasi OTP.

---

## 🏗️ Arsitektur & Tech Stack (Architecture & Technology)

Aplikasi dibangun mengacu pada standar arsitektur monorepo terpisah (*Decoupled Monorepo Architecture*):

```
learning-space/
├── learning-space/               # Frontend Portal Pengguna (React 19 + Vite 8)
│   ├── src/
│   │   ├── api/axios.js          # Klien HTTP Axios dengan injeksi token JWT
│   │   ├── components/           # Komponen antarmuka (Sidebar, Navigasi, Kalender)
│   │   ├── pages/                # Tampilan halaman (Dashboard, KelasDetail, Profil)
│   │   └── App.jsx               # Konfigurasi rute dinamis (Lazy-loaded routes)
│   └── vercel.json               # Konfigurasi perutean SPA Vercel Edge
├── learning-space-admin/         # Frontend Dasbor Pengelola (React 19 + Vite 8)
│   ├── src/
│   │   ├── api/axios.js          # Klien Axios dengan autentikasi khusus Admin
│   │   ├── pages/                # Modul admin (Kelola Kelas, Materi, User)
│   │   └── App.jsx
│   └── package.json
└── learning-space-api/           # Backend REST API Serverless (Express + Sequelize)
    ├── config/database.js        # Koneksi ORM Sequelize dengan negosiasi SSL Aiven
    ├── controllers/              # Logika bisnis (Auth, User, Kelas, Analitik)
    ├── middleware/               # Verifikasi JWT, kendali akses peran (RBAC)
    ├── models/                   # Definisi skema tabel basis data relasional
    ├── routes/                   # Titik akhir rute REST API
    ├── server.js                 # Titik masuk utama aplikasi & Vercel Serverless
    └── vercel.json               # Konfigurasi Vercel Serverless Function
```

| Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Frontend User** | React 19, Vite 8, React Router v7 | Antarmuka pengguna responsif, cepat, dan ringan |
| **Frontend Admin** | React 19, Vite 8, React Router v7 | Dasbor pengelola data dan kurikulum |
| **Backend Engine** | Node.js, Express.js | Arsitektur RESTful API tanpa server (*Serverless*) |
| **Database ORM** | Sequelize v6, MySQL2 | Abstraksi model relasional dan query terparameterisasi |
| **Cloud Database** | Aiven for MySQL 8.4 | Basis data cloud terkelola dengan koneksi aman TLS/SSL |
| **Authentication** | JWT (jsonwebtoken) & bcryptjs | Enkripsi kredensial dan otentikasi berbasis token stateless |
| **Email Gateway** | Nodemailer (Google SMTP) | Pengiriman email transaksional kode verifikasi OTP |
| **Cloud Hosting** | Vercel Edge Network | Penyebaran global otomatis untuk Frontend dan API |

---

## 👥 Tim & Pembagian Cabang Kerja (Team & Branch Strategy)

Pengembangan repositori ini dikelola secara terstruktur melalui cabang kerja terisolasi sesuai tanggung jawab anggota tim:

| Anggota Tim | Peran Teknis | Tanggung Jawab Modul | Cabang Kerja GitHub (*Branch*) |
|:---|:---|:---|:---|
| **Ridho Putra Aulia** | **Tech Lead & Backend Architect** | REST Micro-API, Manajemen Basis Data, Serverless Vercel, Admin Portal | [`backend/ridho-putra`](https://github.com/RidhoPtraDev/learning-space/tree/backend/ridho-putra)<br>[`admin/ridho-putra`](https://github.com/RidhoPtraDev/learning-space/tree/admin/ridho-putra)<br>[`database/ridho-putra`](https://github.com/RidhoPtraDev/learning-space/tree/database/ridho-putra) |
| **Arviandra Deska** | **Lead Frontend Engineer** | Antarmuka Portal Pengguna, State Management, Integrasi API | [`frontend/arviandra-deska`](https://github.com/RidhoPtraDev/learning-space/tree/frontend/arviandra-deska) |
| **Muhammad Lukman** | **Product & UI/UX Designer** | Desain Tata Letak, Desain Grafis, Panduan Interaksi Pengguna | [`ui-ux/muhammad-lukman`](https://github.com/RidhoPtraDev/learning-space/tree/ui-ux/muhammad-lukman) |
| **Release Maintainer** | **DevOps & QA** | Pengujian Integrasi dan Penerbitan Produksi | [`main`](https://github.com/RidhoPtraDev/learning-space/tree/main) |

---

## 🔒 Standar Keamanan & Reliabilitas (Security & Reliability)

* **Enkripsi Kredensial (Zero-Plaintext)**: Seluruh kata sandi dienkripsi menggunakan `bcryptjs` sebelum disimpan ke basis data.
* **Pencegahan SQL Injection**: Penggunaan ORM Sequelize secara penuh dengan query terparameterisasi (*Parameterized Statements*).
* **Perlindungan Rahasia Lingkungan**: Kredensial sensitif dikelola melalui sistem Vercel Encrypted Secrets dan tidak diunggah ke repositori publik.
* **Koneksi Jaringan Terenkripsi**: Komunikasi web diamankan menggunakan HTTPS/TLS 1.3 dan komunikasi basis data dilindungi protokol SSL terenkripsi.

---

## 📄 Lisensi (License)

Didistribusikan di bawah naungan **Lisensi MIT**. Silakan merujuk ke berkas [`LICENSE`](./LICENSE) untuk rincian ketentuan penggunaan.

<div align="center">
  <sub>Dibangun untuk mendukung kemajuan pendidikan teknologi berkualitas bagi pelajar di seluruh Indonesia. © 2026 Tim Pengembang LearningSpace.</sub>
</div>
