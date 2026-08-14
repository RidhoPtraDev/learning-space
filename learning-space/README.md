# Frontend User — LearningSpace

Antarmuka pengguna untuk platform LearningSpace, dibangun dengan **React 19 + Vite 8**.

## 🚀 Menjalankan Lokal

```bash
npm install
npm run dev     # development server → http://localhost:5173
npm run build   # production build
npm run preview # preview build lokal
```

## 📁 Struktur

```
src/
├── api/          ← Axios instance (baseURL, interceptors)
├── assets/       ← Gambar, ikon, ilustrasi
├── components/   ← Komponen reusable (BackButton, RightSidebar)
└── pages/        ← Halaman-halaman aplikasi
    ├── Home.jsx
    ├── Login.jsx
    ├── Register.jsx
    ├── VerifikasiOtp.jsx
    ├── LupaPassword.jsx
    ├── Dashboard.jsx
    ├── KelasDetail.jsx
    ├── MateriDetail.jsx
    ├── KelasFavorit.jsx
    ├── KelasZoom.jsx
    ├── RiwayatBelajar.jsx
    ├── Analitikprogress.jsx
    ├── Reminder.jsx
    ├── Profil.jsx
    └── EditProfil.jsx
```

## ⚙️ Konfigurasi

API base URL dikonfigurasi di `src/api/axios.js`.
Untuk mengubah URL backend, edit file tersebut.

## 🔑 Autentikasi

- Token JWT disimpan di `localStorage` dengan key `token`
- Data user disimpan di `localStorage` dengan key `user`
- Semua request ke endpoint terproteksi otomatis menyertakan header `Authorization: Bearer <token>` via Axios interceptor
