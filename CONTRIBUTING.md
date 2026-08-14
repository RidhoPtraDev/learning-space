# 🤝 Panduan Berkontribusi — LearningSpace

Terima kasih sudah tertarik berkontribusi ke **LearningSpace**! Dokumen ini menjelaskan standar dan alur kerja yang harus diikuti oleh semua kontributor agar project tetap terstruktur, bersih, dan mudah di-maintain.

---

## 📋 Daftar Isi

1. [Code of Conduct](#-code-of-conduct)
2. [Cara Berkontribusi](#-cara-berkontribusi)
3. [Setup Development Environment](#-setup-development-environment)
4. [Branching Strategy](#-branching-strategy)
5. [Standar Commit Message](#-standar-commit-message)
6. [Standar Kode](#-standar-kode)
7. [Pull Request Process](#-pull-request-process)
8. [Pelaporan Bug](#-pelaporan-bug)
9. [Request Fitur Baru](#-request-fitur-baru)

---

## 🏛️ Code of Conduct

- Saling menghargai sesama kontributor.
- Gunakan bahasa yang sopan dan konstruktif dalam diskusi.
- Tidak ada diskriminasi dalam bentuk apapun.
- Prioritaskan kepentingan project di atas ego pribadi.

---

## 🛠️ Cara Berkontribusi

Ada beberapa cara untuk berkontribusi:

- 🐛 **Melaporkan bug** — buka issue dengan label `bug`
- ✨ **Mengusulkan fitur** — buka issue dengan label `enhancement`
- 💻 **Menulis kode** — fork, buat branch, kerjakan, buat PR
- 📝 **Memperbaiki dokumentasi** — README, komentar kode, dll
- 🧪 **Menulis test** — unit test, integration test

---

## ⚙️ Setup Development Environment

### Prasyarat
- **Node.js** v18+
- **MySQL 8** (XAMPP untuk Windows)
- **Git**
- **VS Code** (direkomendasikan)

### Langkah Setup

```bash
# 1. Fork repository di GitHub

# 2. Clone fork kamu
git clone https://github.com/USERNAME_KAMU/learning-space.git
cd learning-space

# 3. Tambahkan upstream remote (repo asli)
git remote add upstream https://github.com/RidhoPtraDev/learning-space.git

# 4. Setup backend
cd learning-space-api
npm install
cp .env.example .env
# Edit .env sesuai konfigurasi lokal kamu

# 5. Setup frontend user
cd ../learning-space
npm install

# 6. Setup frontend admin
cd ../learning-space-admin
npm install

# 7. Pastikan MySQL sudah running dan database 'learning_space' ada
# Backend akan auto-sync tabel saat pertama kali dijalankan

# 8. Jalankan semua service
# Terminal 1 — Backend
cd learning-space-api && npm run dev

# Terminal 2 — Frontend User
cd learning-space && npm run dev

# Terminal 3 — Frontend Admin
cd learning-space-admin && npm run dev
```

---

## 🌿 Branching Strategy

Kami menggunakan **Git Flow** yang disederhanakan:

```
main              ← Branch produksi (STABIL, tidak boleh push langsung)
develop           ← Branch integrasi (semua fitur di-merge ke sini dulu)
feature/xxx       ← Branch fitur baru
bugfix/xxx        ← Branch perbaikan bug
hotfix/xxx        ← Perbaikan bug kritis di produksi
docs/xxx          ← Update dokumentasi saja
```

### Aturan Branch

| Branch | Push Langsung | Merge Via |
|--------|:---:|---------|
| `main` | ❌ | PR dari `develop` (review Lead Dev) |
| `develop` | ❌ | PR dari `feature/*`, `bugfix/*` |
| `feature/*` | ✅ | PR ke `develop` |
| `bugfix/*` | ✅ | PR ke `develop` |
| `hotfix/*` | ❌ | PR ke `main` + `develop` |

### Membuat Branch Baru

```bash
# Selalu mulai dari develop yang up-to-date
git checkout develop
git pull upstream develop

# Buat branch baru
git checkout -b feature/nama-fitur-kamu
# atau
git checkout -b bugfix/nama-bug-yang-diperbaiki
```

---

## 📝 Standar Commit Message

Kami menggunakan format **Conventional Commits**:

```
<type>(<scope>): <deskripsi singkat>

[opsional: body — jelaskan kenapa, bukan apa]

[opsional: footer — breaking changes, issue reference]
```

### Type yang Valid

| Type | Kapan Dipakai |
|------|--------------|
| `feat` | Fitur baru |
| `fix` | Perbaikan bug |
| `docs` | Perubahan dokumentasi saja |
| `style` | Formatting, spasi (tidak ada perubahan logika) |
| `refactor` | Refactor kode (bukan fitur baru, bukan bugfix) |
| `perf` | Peningkatan performa |
| `test` | Menambah atau memperbaiki test |
| `chore` | Perubahan build, dependency update, dll |
| `revert` | Revert commit sebelumnya |

### Scope (opsional tapi direkomendasikan)

- `api` — backend
- `user` — frontend user (learning-space)
- `admin` — frontend admin (learning-space-admin)
- `db` — database / model
- `auth` — autentikasi

### Contoh Commit yang Baik ✅

```
feat(api): tambah endpoint forgot password dengan OTP via email
fix(user): perbaiki sidebar width tidak konsisten di halaman Reminder
docs: update README dengan instruksi setup environment
style(admin): standarisasi spacing di AdminDashboard
refactor(api): pisahkan logic email ke utils/mailer.js
chore: update dependency nodemailer ke v9.0.3
```

### Contoh Commit yang BURUK ❌

```
update
fix bug
asdf
WIP
semua selesai
```

---

## 🏗️ Standar Kode

### Umum
- **Bahasa kode**: Bahasa Indonesia untuk nama variabel domain bisnis (namaKelas, hargaLayanan), English untuk naming teknis (isLoading, handleSubmit, useEffect)
- Gunakan **camelCase** untuk variabel dan fungsi
- Gunakan **PascalCase** untuk komponen React dan class
- Gunakan **UPPER_SNAKE_CASE** untuk konstanta global

### Frontend (React)
- Setiap halaman ada di `src/pages/`
- Komponen reusable ada di `src/components/`
- Gunakan inline style JS object (konsisten dengan codebase existing)
- Jangan hardcode URL API — gunakan instance dari `src/api/axios.js`
- Jangan expose data sensitif di console.log saat production

### Backend (Node.js)
- Setiap route handler ada di `controllers/`
- Route definition ada di `routes/`
- Model Sequelize ada di `models/`
- Helper/utility ada di `utils/`
- Jangan taruh business logic langsung di route file
- Selalu handle error dengan try-catch dan return response yang proper

### Database
- Perubahan schema harus terdokumentasi di commit message
- Gunakan Sequelize migrations jika sudah ada (bukan `sync force`)
- Jangan hapus kolom tanpa diskusi terlebih dahulu

---

## 🔀 Pull Request Process

### Sebelum Membuat PR

- [ ] Kode sudah ditest secara lokal (tidak ada error di console)
- [ ] Frontend build berhasil: `npm run build`
- [ ] Backend bisa start tanpa error: `npm run dev`
- [ ] Commit message mengikuti standar Conventional Commits
- [ ] Branch sudah di-update dengan `develop` terbaru

### Membuat PR

1. Push branch ke fork kamu:
   ```bash
   git push origin feature/nama-fitur-kamu
   ```

2. Buka GitHub → "New Pull Request"

3. Set: `base: develop` ← `compare: feature/nama-fitur-kamu`

4. Isi template PR yang muncul dengan lengkap

5. Assign reviewer jika tahu siapa yang relevan

### Yang Akan Dilakukan Reviewer

- Review kode (logika, security, konsistensi)
- Test di environment lokal mereka
- Request changes jika ada yang perlu diperbaiki
- Approve dan merge jika sudah OK

---

## 🐛 Pelaporan Bug

Buat [GitHub Issue baru](https://github.com/RidhoPtraDev/learning-space/issues/new?template=bug_report.md) dengan label `bug`.

Sertakan:
- **Deskripsi bug** — apa yang terjadi vs apa yang seharusnya terjadi
- **Langkah reproduksi** — step by step
- **Screenshot / video** (jika visual)
- **Environment** — OS, browser, versi Node
- **Error message / stack trace** (jika ada)

---

## ✨ Request Fitur Baru

Buat [GitHub Issue baru](https://github.com/RidhoPtraDev/learning-space/issues/new?template=feature_request.md) dengan label `enhancement`.

Sertakan:
- **Deskripsi fitur** — apa yang ingin ditambahkan
- **Motivasi** — mengapa fitur ini berguna
- **Contoh / mockup** (opsional tapi sangat membantu)
- **Layer yang terdampak** — frontend user, frontend admin, backend, database

---

## 📞 Kontak

Jika ada pertanyaan yang tidak tercakup di dokumen ini:

- Buka **GitHub Discussion** atau **GitHub Issue**
- Hubungi Lead Dev: [@RidhoPtraDev](https://github.com/RidhoPtraDev)
