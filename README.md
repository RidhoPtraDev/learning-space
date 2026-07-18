# Backend

Berisi source code API (server) dan database untuk project Learning Space.

## 👤 PIC

| Bagian | PIC |
|--------|-----|
| Backend & Database | Ridho Putra Aulia |

## 🛠️ Teknologi yang Digunakan

| Teknologi | Fungsi | Kategori |
|-----------|--------|----------|
| Node.js | Runtime JavaScript untuk menjalankan server | Runtime |
| Express | Framework untuk membangun REST API | Framework |
| MySQL | Database relasional untuk menyimpan seluruh data aplikasi | Database |
| Sequelize | ORM (Object Relational Mapping) untuk koneksi & query ke MySQL | ORM |
| JSON Web Token (JWT) | Autentikasi & otorisasi user (login, sesi) | Auth |
| Bcrypt | Enkripsi/hashing password agar aman tersimpan di database | Security |
| Multer | Menangani upload file (gambar, dokumen, dll) dari client | File Handling |

## 📁 Struktur Folder

- `api/` - Source code backend (server, routes, controller, model, dll)
- `database/` - File backup/export database (.sql)

## 🚀 Cara Menjalankan

### 1. Setup Database
Import file `.sql` yang ada di folder `database/` ke MySQL lokal (lihat detail di dalam folder tersebut).

### 2. Jalankan API
```bash
cd api
npm install
npm run dev
```

> Pastikan file konfigurasi koneksi database (.env) sudah diisi sesuai environment lokal masing-masing sebelum menjalankan aplikasi.
