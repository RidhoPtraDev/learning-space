# 🧠 PROJECT CONTEXT — LearningSpace

> **Dokumen Konteks Utama & Manual Arsitektur Project**  
> Dokumen ini dirancang sebagai acuan lengkap bagi pengembang, kontributor baru, maupun AI assistant untuk memahami secara mendalam seluruh aspek dari ekosistem **LearningSpace**.

---

## 📌 1. Ringkasan Ekosistem (System Overview)

**LearningSpace** adalah platform e-learning serba ada berbasis web yang ditujukan untuk pelajar di Indonesia. Sistem ini mengusung arsitektur **Monorepo Modular** yang terpisah menjadi 3 aplikasi utama:

1. **`learning-space` (Frontend User)**: Web portal untuk siswa/pelajar mengakses materi, video pembelajaran, sesi Zoom interaktif, analitik progress, dan reminder jadwal belajar.
2. **`learning-space-admin` (Frontend Admin)**: Dashboard manajemen khusus admin untuk mengelola kelas, materi, zoom meeting, data user (ban/unban/delete), testimoni, layanan, dan memantau log aktivitas user real-time.
3. **`learning-space-api` (Backend REST API)**: Node.js Express server sebagai pusat logika bisnis, otorisasi JWT, verifikasi email OTP via SMTP Gmail, ORM database, dan pengolahan statistik.

---

## 🏗️ 2. Arsitektur Teknis & Tech Stack

```text
                               ┌──────────────────────────┐
                               │  learning-space (User)   │ (React 19 + Vite 8)
                               │  http://localhost:5173   │
                               └────────────┬─────────────┘
                                            │ REST API
                                            ▼
┌──────────────────────────┐   ┌──────────────────────────┐
│  learning-space-admin    │   │   learning-space-api     │ (Express 5 + Sequelize)
│  http://localhost:5174   │──►│   http://localhost:5000  │
└──────────────────────────┘   └────────────┬─────────────┘
                                            │ MySQL 8 / MariaDB
                                            ▼
                               ┌──────────────────────────┐
                               │     `learning_space`     │ (Database)
                               └──────────────────────────┘
```

| Layer | Teknologi Utama | Keterangan & Library Pendukung |
| --- | --- | --- |
| **Frontend User** | React 19, Vite 8 | React Router v7, Axios, Pure CSS Design System |
| **Frontend Admin** | React 19, Vite 8 | React Router v7, Axios, Sticky 3-Column Layout |
| **Backend API** | Node.js 22, Express 5 | Sequelize ORM, Multer, Nodemailer, bcryptjs, jsonwebtoken |
| **Database** | MySQL 8 | InnoDB engine, utf8mb4 encoding, Relational Constraints |
| **Email SMTP** | Gmail App Password | Dual Template (OTP Register & OTP Password Reset) |

---

## 👥 3. Pembagian Peran Tim & Branch Standard

Sistem versi kontrol menggunakan strategi **Git Flow** yang diperluas dengan konvensi nama branch pengembang:

| Komponen / Peran | Penanggung Jawab | Branch GitHub | Tanggung Jawab Utama |
| --- | --- | --- | --- |
| 🎨 **UI / UX Design** | **Muhammad Lukman** | [`ui-ux/muhammad-lukman`](https://github.com/RidhoPtraDev/learning-space/tree/ui-ux/muhammad-lukman) | Design System, Asset Ikon, Layout Spec, Prototyping |
| 💻 **Frontend User** | **Arviandra Deska** | [`frontend/arviandra-deska`](https://github.com/RidhoPtraDev/learning-space/tree/frontend/arviandra-deska) | Pengalaman Pengguna, Halaman Siswa, Integrasi API User |
| ⚙️ **Backend API** | **Ridho Putra Aulia** | [`backend/ridho-putra`](https://github.com/RidhoPtraDev/learning-space/tree/backend/ridho-putra) | REST API Endpoints, Middleware, Auth JWT, SMTP Mailer |
| 🛡️ **Frontend Admin** | **Ridho Putra Aulia** | [`admin/ridho-putra`](https://github.com/RidhoPtraDev/learning-space/tree/admin/ridho-putra) | Dashboard Admin, Moderasi User, CRUD Management |
| 🗄️ **Database & Security** | **Ridho Putra Aulia** | [`database/ridho-putra`](https://github.com/RidhoPtraDev/learning-space/tree/database/ridho-putra) | Schema SQL, Sequelize Models, Keamanan Data & Privasi |
| 🚀 **Production Branch** | **Lead Maintainer** | [`main`](https://github.com/RidhoPtraDev/learning-space/tree/main) | Production-ready Codebase (Protected) |

---

## 📊 4. Skema Database & Relasi Model

Database terdiri dari 11 tabel utama yang dikelola Sequelize ORM di [`learning-space-api/models/`](file:///d:/Project%20PemWeb/learning-space-api/models):

1. **`Users`**: Menyimpan akun (`nama`, `email`, `password` hashed, `role`: `'user'|'admin'`, `isVerified`, `isBanned`, `foto`).
2. **`Kelas`**: Data kelas (`judul`, `kategori`, `deskripsi`, `gambar`).
3. **`Materi`**: Detail modul/video per kelas (`kelasId`, `judul`, `videoUrl`, `jurnalUrl`).
4. **`MateriSelesai`**: Tracking penyelesaian materi siswa (`userId`, `materiId`).
5. **`Favorit`**: Bookmark kelas siswa (`userId`, `kelasId`).
6. **`RiwayatBelajar`**: Activity log siswa (`userId`, `kelasId`, `materiId`, `tipe`).
7. **`Reminders`**: Pengingat jadwal siswa (`userId`, `judul`, `tanggal`, `waktu`, `isSelesai`).
8. **`ZoomMeetings`**: Sesi live meeting (`judul`, `link`, `jadwal`).
9. **`Testimonis`**: Review & ulasan platform.
10. **`Layanans`**: Fitur keunggulan platform.
11. **`OtpVerifications` & `PasswordResetOtps`**: Penyimpanan kode OTP verifikasi email & lupa password sementara.

---

## 🎨 5. Standar Desain & Layout Spesifikasi (UI Constraints)

Untuk menjaga konsistensi visual di seluruh modul frontend user & admin, ikuti aturan standar berikut:

- **Sidebar Width**: `260px` (Fixed / Sticky)
- **Main Container Padding**: `36px 32px`
- **Page Title Font Size**: `2.2rem`, `marginBottom: '8px'`
- **Header Illustration Width**: `180px`
- **Admin Layout**: 3 Kolom (Sidebar Kiri `260px` Sticky, Content Tengah Normal Scroll, Right Panel `sticky` `top:0` `height:100vh`).

---

## 🔐 6. Kebijakan Keamanan & Privasi (Security Guidelines)

1. **Kredensial & Secrets**:
   - File `.env` **DIRESTRUKTURKAN PRIVAT** dan tidak pernah masuk ke repository git.
   - Gunakan selalu `.env.example` sebagai acuan pembuatan variabel environment lokal baru.
2. **Autentikasi**:
   - Token JWT dikirim via header `Authorization: Bearer <token>`.
   - Admin token disimpan di `sessionStorage`, User token di `localStorage`.
3. **Keamanan Input**:
   - Semua query SQL menggunakan Parameterized Queries bawaan Sequelize untuk mencegah SQL Injection.
   - Upload file dibatasi pada ekstensi gambar/PDF via Multer middleware.

---

## 🔄 7. Alur Kerja Kontribusi (Workflow)

```bash
# 1. Selalu ambil pembaruan dari branch main
git checkout main
git pull origin main

# 2. Pindah ke branch kerja masing-masing (misal: frontend/arviandra-deska)
git checkout frontend/arviandra-deska
git merge main

# 3. Lakukan pengodean & commit dengan standar Conventional Commits
git commit -m "feat(user): tambah komponen filter kategori di Dashboard"

# 4. Push ke remote branch kamu
git push origin frontend/arviandra-deska
```

---

## 📄 8. Berkas Acuan Penting Lainnya

- **[`README.md`](file:///d:/Project%20PemWeb/README.md)**: Dokumentasi Ringkas & Cara Menjalankan Aplikasi
- **[`CONTRIBUTING.md`](file:///d:/Project%20PemWeb/CONTRIBUTING.md)**: Panduan Detail Kontribusi & Code of Conduct
- **[`CHANGELOG.md`](file:///d:/Project%20PemWeb/CHANGELOG.md)**: Catatan Riwayat Rilis & Update Perfitur
- **[`learning-space-api/schema.sql`](file:///d:/Project%20PemWeb/learning-space-api/schema.sql)**: Export Struktur Tabel SQL Database

---

## 🌐 9. Catatan Deployment & Konfigurasi Lintas Domain (CORS & Tunnels)

1. **Vercel Frontend Deployment**:
   - `learning-space` (User Frontend) ter-deploy di Vercel dengan rewrites `vercel.json` SPA routing.
   - Variabel lingkungan `VITE_API_URL` mengarah ke publik tunnel backend (`https://<subdomain>.loca.lt/api`).
2. **CORS & Localtunnel Interstitial Bypass**:
   - Backend `server.js` mengonfigurasi CORS dengan `allowedHeaders`: `['Content-Type', 'Authorization', 'bypass-tunnel-reminder', 'Cache-Control', 'Pragma']`.
   - Interceptor Axios otomatis menyisipkan header `bypass-tunnel-reminder: true` untuk melewati halaman peringatan interstitial localtunnel secara transparan.

---

## 📱 10. Catatan Perbaikan Rilis v1.4.0 (Profile Sync, Mobile Responsive & Favicon)

1. **Normalisasi Foto Profil (Relative Path Storage)**:
   - Endpoint `POST /api/users/foto` dan `GET /api/users/profile` menyimpan serta menormalisasi path foto menjadi relatif (`/uploads/foto/filename.jpg`) untuk mencegah URL rusak saat localtunnel ganti subdomain.
   - Frontend (`Profil.jsx`, `EditProfil.jsx`, `RightSidebar.jsx`, `KelasDetail.jsx`, `MateriDetail.jsx`) merekonstruksi URL foto secara dinamis dari `VITE_API_URL`.

2. **Mobile Cross-Browser Responsive System**:
   - Pembersihan aturan `#root` fixed-width `1126px` pada `index.css`.
   - Penambahan aturan CSS responsive mobile ala RuangGuru (navigasi atas horizontal scroll, stack vertikal kartu & form, full-width main container, serta touch scrolling halus untuk iOS Safari & Android Chrome).

3. **Branding & Official Favicon**:
   - Pemasangan logo resmi LearningSpace `favicon.png` pada frontend user & admin panel menggantikan icon default Vite lightning.
