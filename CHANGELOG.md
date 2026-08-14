# 📋 Changelog

Semua perubahan penting pada project ini akan didokumentasikan di file ini.

Format mengikuti [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
dan project ini menggunakan [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

---

## [1.3.0] — 2026-08-14

### Added
- Konfigurasi `vercel.json` SPA rewrites untuk `learning-space` frontend user deployment.
- Header `bypass-tunnel-reminder` pada Axios interceptors untuk transparansi request localtunnel.

### Fixed
- Perbaikan CORS preflight blocking di `learning-space-api/server.js` dengan menyertakan `Cache-Control` dan `Pragma` pada `allowedHeaders`.
- Refactoring `AdminDashboard.jsx` untuk membersihkan Vite HMR Fast Refresh warning (pencabutan export konstanta `adminMenuItems`).
- Optimasi siklus `useEffect` dan `fetchSemua` pada Ringkasan Dashboard Admin.

---

## [1.2.0] — 2026-08-14

### Added
- Fitur Analitik Progress: grafik aktivitas harian, streak belajar, insight otomatis, diagram donat mata pelajaran
- Fitur Reminder: CRUD reminder belajar, filter hari ini & mendatang, notifikasi real-time
- Komponen `RightSidebar` (profil card + mini calendar) yang reusable di semua halaman user
- Komponen `BackButton` untuk navigasi konsisten
- Halaman `VerifikasiOtp` untuk flow verifikasi email OTP
- Menu "Analitik Progress" dan "Reminder" di sidebar semua halaman user

### Changed
- Standardisasi layout: sidebar `260px`, main padding `36px 32px`, pageTitle `2.2rem` di semua halaman
- Right panel admin dashboard sekarang sticky (tidak ikut scroll konten)
- Ilustrasi header Analitik Progress diganti dengan gambar baru yang lebih menarik

### Fixed
- Path API `/api/reminder` → `/reminder` untuk menghindari double prefix
- Sidebar width tidak konsisten di `EditProfil.jsx` dan `Reminder.jsx`

---

## [1.1.0] — 2026-07-18

### Added
- Fitur **Lupa Password**: forgot password → OTP via email → reset password
- Model `OtpVerification`, `PasswordResetOtp`, `Reminder`, `MateriSelesai`
- Endpoint backend: `POST /auth/forgot-password`, `POST /auth/verify-reset-otp`, `POST /auth/resend-reset-otp`, `POST /auth/reset-password`
- Halaman `LupaPassword.jsx` dengan step-by-step flow (email → OTP → password baru)

### Changed
- Migrasi SMTP email pengirim OTP dengan App Password baru
- Sender name email tetap menampilkan "LearningSpace" di inbox penerima

### Fixed
- Error 535 SMTP authentication failure

---

## [1.0.0] — 2026-06-01

### Added
- Initial release platform LearningSpace
- Sistem autentikasi: Register + Login + OTP Email Verification
- Dashboard user dengan daftar kelas pembelajaran, filter kategori, pencarian
- Detail Kelas & Materi (video embed YouTube, deskripsi, jurnal PDF)
- Kelas Favorit: tambah, hapus, pencarian
- Riwayat Belajar: tracking otomatis saat buka materi/video/zoom
- Kelas Zoom Meeting: daftar jadwal, join via link
- Edit Profil & Upload Foto
- Dashboard Admin: ringkasan statistik, diagram aktivitas, diagram kelas
- Manajemen Kelas & Materi (CRUD)
- Manajemen Zoom Meeting (CRUD)
- Manajemen Testimoni & Layanan (CRUD)
- Log Aktivitas User real-time
- Status User: ban/unban/hapus user
- Profil Admin

---

[Unreleased]: https://github.com/RidhoPtraDev/learning-space/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/RidhoPtraDev/learning-space/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/RidhoPtraDev/learning-space/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/RidhoPtraDev/learning-space/releases/tag/v1.0.0
