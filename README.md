# Frontend

Berisi dua aplikasi frontend terpisah: **Admin** (dashboard admin) dan **User** (aplikasi untuk pengguna).

## 👥 PIC

| Bagian | PIC |
|--------|-----|
| Frontend Admin | Ridho Putra Aulia |
| Frontend User | Arviandra Deska Amatori |

## 🛠️ Teknologi yang Digunakan

Kedua aplikasi (Admin & User) dibangun dengan stack yang sama:

| Teknologi | Fungsi | Versi |
|-----------|--------|-------|
| React | Library utama untuk membangun UI | ^19.2 |
| Vite | Build tool & dev server | ^8 |
| React Router DOM | Routing / navigasi antar halaman | ^7 |
| Axios | HTTP client untuk komunikasi ke backend/API | ^1 |
| Bootstrap | Framework CSS untuk styling & layout | ^5.3 |
| ESLint / Oxlint | Linter untuk menjaga kualitas kode | - |

## 📁 Struktur Folder

- `admin/` - Aplikasi dashboard admin (PIC: Ridho Putra Aulia)
- `user/` - Aplikasi untuk pengguna (PIC: Arviandra Deska Amatori)

## 🚀 Cara Menjalankan

### Frontend Admin
```bash
cd admin
npm install
npm run dev
```

### Frontend User
```bash
cd user
npm install
npm run dev
```

> Pastikan backend (API) sudah berjalan terlebih dahulu agar data bisa dimuat dengan benar.
