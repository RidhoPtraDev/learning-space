# Learning Space

Project PemWeb

## 👥 Tim

| Bagian | PIC |
|--------|-----|
| Backend & Database | Ridho Putra Aulia |
| Frontend User | Arviandra Deska Amatori |
| UI/UX | Muhammad Lukman Abdul Rafif |

## 🛠️ Teknologi yang Digunakan

### Backend
| Teknologi | Fungsi |
|-----------|--------|
| Node.js | Runtime JavaScript untuk menjalankan server |
| Express | Framework untuk membangun REST API |
| JSON Web Token (JWT) | Autentikasi & otorisasi user (login, sesi) |
| Bcrypt | Enkripsi/hashing password |
| Multer | Menangani upload file (gambar, dokumen, dll) |

### Database
| Teknologi | Fungsi |
|-----------|--------|
| MySQL | Database relasional untuk menyimpan seluruh data aplikasi |
| Sequelize | ORM (Object Relational Mapping) untuk koneksi & query dari Node.js ke MySQL |

### Frontend (Admin & User)
| Teknologi | Fungsi |
|-----------|--------|
| React | Library utama untuk membangun antarmuka (UI) |
| Vite | Build tool & dev server untuk React |
| React Router DOM | Routing / navigasi antar halaman |
| Axios | HTTP client untuk komunikasi ke backend/API |
| Bootstrap | Framework CSS untuk styling & layout |

### UI/UX Design
| Tools | Fungsi |
|-------|--------|
| Figma | Desain UI, wireframe, dan prototyping |

## 📁 Struktur Folder

| Folder | Isi | PIC |
|--------|-----|-----|
| `backend/api/` | Server & REST API | Ridho Putra Aulia |
| `backend/database/` | Backup/export database (.sql) | Ridho Putra Aulia |
| `frontend/admin/` | Dashboard admin | Ridho Putra Aulia |
| `frontend/user/` | Aplikasi untuk user | Arviandra Deska Amatori |
| `ui-ux/` | Desain, wireframe, dan assets | Muhammad Lukman Abdul Rafif |

## 🌿 Alur Kerja (Branch)

Setiap bagian dikerjakan di branch masing-masing agar branch `main` selalu berisi versi yang stabil:

| Branch | Digunakan Untuk |
|--------|------------------|
| `backend` | Pengembangan API & database |
| `frontend` | Pengembangan aplikasi admin & user |
| `ui-ux` | Desain UI/UX |
| `main` | Versi final |

## 🚀 Cara Menjalankan Project

### Backend
```bash
cd backend/api
npm install
npm run dev
```

### Frontend Admin
```bash
cd frontend/admin
npm install
npm run dev
```

### Frontend User
```bash
cd frontend/user
npm install
npm run dev
```

> Pastikan database sudah diimport dan file `.env` sudah dikonfigurasi sebelum menjalankan backend.
