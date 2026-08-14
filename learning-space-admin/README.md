# Frontend Admin — LearningSpace

Dashboard admin untuk platform LearningSpace, dibangun dengan **React 19 + Vite 8**.

## 🚀 Menjalankan Lokal

```bash
npm install
npm run dev     # development server → http://localhost:5174
npm run build   # production build
npm run preview # preview build lokal
```

## 📁 Struktur

```
src/
├── api/          ← Axios instance admin (baseURL, interceptors)
├── assets/       ← Asset admin
└── pages/        ← Halaman-halaman admin
    ├── LoginAdmin.jsx
    ├── AdminDashboard.jsx   ← Layout + Dashboard utama
    ├── StatusUser.jsx
    ├── LogAktifitas.jsx
    ├── KelasAdmin.jsx
    ├── KelasDetailAdmin.jsx
    ├── KelasMateri.jsx
    ├── ZoomMeetingAdmin.jsx
    ├── TestimoniAdmin.jsx
    ├── LayananAdmin.jsx
    └── ProfilAdmin.jsx
```

## ⚙️ Konfigurasi

API base URL dikonfigurasi di `src/api/axios.js`.

## 🔑 Autentikasi Admin

- Token JWT admin disimpan di `sessionStorage` dengan key `token`
- Data admin disimpan di `sessionStorage` dengan key `user`
- Session habis saat browser/tab ditutup (by design, lebih aman untuk admin panel)

## 🏗️ AdminLayout

Semua halaman admin menggunakan komponen `AdminLayout` yang diekspor dari `AdminDashboard.jsx`.

Props `AdminLayout`:
- `activeKey` — string, menentukan menu sidebar yang aktif
- `rightPanel` — boolean (default: `true`), tampilkan/sembunyikan panel kanan
