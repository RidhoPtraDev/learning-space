import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ReminderMini } from './AnalitikProgress.jsx'
import logo from '../assets/logo.png'
import avatarDefault from '../assets/avatar-default.png'
import iconDeskripsi from '../assets/icon-deskripsi.png' // ← export dari Figma (icon tumpukan buku)

// ── DATA MATERI (nanti diganti dari API backend) ──────────────
// Struktur ini yang akan dikirim dari backend
const materiData = {
  // Fisika
  '4-1': {
    kelasId: '4', kelasNama: 'Fisika', judulMateri: 'Vektor',
    ilustrasi: 'icon-vektor.png', // ← export dari Figma per materi
    deskripsiSingkat: 'Memahami Konsep besaran vektor, arah, besar vektor dan operasi dasar vektor',
    video: {
      url: 'https://youtu.be/EoeePVoAdEo?si=b9Z5IBACPfwhJ0vK',
      embedUrl: 'https://www.youtube.com/embed/EoeePVoAdEo',
      judul: 'VEKTOR: PENGERTIAN DAN PENJUMLAHAN - MATERI FISIKA KELAS 10 | Edcent.id',
    },
    deskripsi: [
      'Vektor merupakan besaran yang memiliki nilai dan arah. Dalam fisika, vektor digunakan untuk menggambarkan berbagai besaran seperti perpindahan, percepatan, kecepatan, dan gaya.',
      'Materi ini akan membahas pengertian vektor, notasi vektor, operasi dasar vektor dan contoh penerapannya dalam sehari - hari.',
    ],
    jurnal: {
      judul: 'KAJIAN MATERI VEKTOR ALJABAR LINEAR: SEBUAH ALTERNATIF DALAM MEMAHAMI ALAM SEMESTA DENGAN MATEMATIKA | Susilo | Journal of Mathematics and Mathematics Education',
      url: 'https://jurnal.uns.ac.id',
    },
  },
  '4-2': {
    kelasId: '4', kelasNama: 'Fisika', judulMateri: 'Gerak dan Percepatan',
    ilustrasi: 'icon-gerak.png',
    deskripsiSingkat: 'Memahami konsep gerak lurus, kecepatan, dan percepatan dalam fisika',
    video: { url: '', embedUrl: '', judul: '' },
    deskripsi: ['Gerak adalah perubahan posisi suatu benda terhadap titik acuan dalam selang waktu tertentu.', 'Materi ini membahas jenis-jenis gerak, kecepatan rata-rata, dan percepatan.'],
    jurnal: { judul: '', url: '' },
  },
  '4-3': {
    kelasId: '4', kelasNama: 'Fisika', judulMateri: 'Hukum Newton',
    ilustrasi: 'icon-newton.png',
    deskripsiSingkat: 'Memahami tiga hukum Newton tentang gerak dan gaya',
    video: { url: '', embedUrl: '', judul: '' },
    deskripsi: ['Hukum Newton adalah tiga hukum fisika yang membentuk dasar mekanika klasik.', 'Materi ini membahas Hukum I, II, dan III Newton beserta penerapannya.'],
    jurnal: { judul: '', url: '' },
  },
  '4-4': {
    kelasId: '4', kelasNama: 'Fisika', judulMateri: 'Suhu dan Kalor',
    ilustrasi: 'icon-suhu.png',
    deskripsiSingkat: 'Memahami konsep suhu, kalor, dan perpindahan energi panas',
    video: { url: '', embedUrl: '', judul: '' },
    deskripsi: ['Suhu adalah ukuran derajat panas atau dinginnya suatu benda.', 'Materi ini membahas skala suhu, kalor jenis, dan perpindahan kalor.'],
    jurnal: { judul: '', url: '' },
  },

  // ── Kimia ──────────────────────────────────────────────────
  '1-1': {
    kelasId: '1', kelasNama: 'Kimia', judulMateri: 'Pengantar Kimia',
    ilustrasi: 'icon-pengantar-kimia.png', // ← export dari Figma
    deskripsiSingkat: 'Pelajari bentuk garis, sudut dan bangun datar.',
    video: { url: '', embedUrl: '', judul: '' },
    deskripsi: [
      'Kimia adalah ilmu yang mempelajari komposisi, struktur, sifat, dan perubahan materi.',
      'Materi ini akan membahas pengenalan ilmu kimia, peran kimia dalam kehidupan, serta dasar-dasar yang perlu dipahami sebelum mempelajari materi lanjutan.',
    ],
    jurnal: { judul: '', url: '' },
  },
  '1-2': {
    kelasId: '1', kelasNama: 'Kimia', judulMateri: 'Struktur Atom',
    ilustrasi: 'icon-struktur-atom.png',
    deskripsiSingkat: 'Memahami partikel penyusun atom dan konfigurasi elektronnya.',
    video: { url: '', embedUrl: '', judul: '' },
    deskripsi: [
      'Atom merupakan unit terkecil dari suatu unsur yang masih memiliki sifat unsur tersebut, terdiri dari proton, neutron, dan elektron.',
      'Materi ini membahas struktur atom, model atom, serta cara penulisan konfigurasi elektron.',
    ],
    jurnal: { judul: '', url: '' },
  },
  '1-3': {
    kelasId: '1', kelasNama: 'Kimia', judulMateri: 'Ikatan Kimia',
    ilustrasi: 'icon-ikatan-kimia.png',
    deskripsiSingkat: 'Pelajari dasar - dasar kimia dan peran pentingnya.',
    video: { url: '', embedUrl: '', judul: '' },
    deskripsi: [
      'Ikatan kimia adalah gaya tarik-menarik antar atom yang menyebabkan terbentuknya suatu molekul atau senyawa.',
      'Materi ini membahas jenis-jenis ikatan kimia seperti ikatan ion, kovalen, dan logam beserta sifat-sifatnya.',
    ],
    jurnal: { judul: '', url: '' },
  },
  '1-4': {
    kelasId: '1', kelasNama: 'Kimia', judulMateri: 'Reaksi Kimia',
    ilustrasi: 'icon-reaksi-kimia.png',
    deskripsiSingkat: 'Memahami jenis reaksi kimia dan sifatnya.',
    video: { url: '', embedUrl: '', judul: '' },
    deskripsi: [
      'Reaksi kimia adalah proses perubahan suatu zat menjadi zat baru yang memiliki sifat berbeda dari zat asalnya.',
      'Materi ini membahas jenis-jenis reaksi kimia, persamaan reaksi, serta penerapannya dalam kehidupan sehari-hari.',
    ],
    jurnal: { judul: '', url: '' },
  },

  // ── Matematika ─────────────────────────────────────────────
  '2-1': {
    kelasId: '2', kelasNama: 'Matematika', judulMateri: 'Aljabar Dasar',
    ilustrasi: 'icon-aljabar.png',
    deskripsiSingkat: 'Pelajari operasi dasar aljabar dan persamaan.',
    video: { url: '', embedUrl: '', judul: '' },
    deskripsi: [
      'Aljabar adalah cabang matematika yang menggunakan simbol dan huruf untuk mewakili angka dan kuantitas dalam persamaan dan rumus.',
      'Materi ini membahas operasi bentuk aljabar, persamaan linear, dan cara menyelesaikan soal-soal aljabar dasar.',
    ],
    jurnal: { judul: '', url: '' },
  },
  '2-2': {
    kelasId: '2', kelasNama: 'Matematika', judulMateri: 'Geometri',
    ilustrasi: 'icon-geometri.png',
    deskripsiSingkat: 'Memahami bentuk, sudut, dan bangun ruang.',
    video: { url: '', embedUrl: '', judul: '' },
    deskripsi: [
      'Geometri adalah cabang matematika yang membahas tentang bentuk, ukuran, posisi, dan sifat-sifat ruang.',
      'Materi ini membahas bangun datar, bangun ruang, serta cara menghitung luas, keliling, dan volume.',
    ],
    jurnal: { judul: '', url: '' },
  },
  '2-3': {
    kelasId: '2', kelasNama: 'Matematika', judulMateri: 'Statistika',
    ilustrasi: 'icon-statistika.png',
    deskripsiSingkat: 'Pelajari cara mengolah dan membaca data.',
    video: { url: '', embedUrl: '', judul: '' },
    deskripsi: [
      'Statistika adalah ilmu yang berkaitan dengan pengumpulan, pengolahan, analisis, dan penyajian data.',
      'Materi ini membahas ukuran pemusatan data, penyebaran data, serta cara membaca diagram dan grafik.',
    ],
    jurnal: { judul: '', url: '' },
  },
  '2-4': {
    kelasId: '2', kelasNama: 'Matematika', judulMateri: 'Kalkulus',
    ilustrasi: 'icon-kalkulus.png',
    deskripsiSingkat: 'Memahami konsep limit, turunan, dan integral.',
    video: { url: '', embedUrl: '', judul: '' },
    deskripsi: [
      'Kalkulus adalah cabang matematika yang membahas perubahan dan gerak melalui konsep limit, turunan, dan integral.',
      'Materi ini membahas dasar-dasar limit fungsi, aturan turunan, serta pengenalan konsep integral.',
    ],
    jurnal: { judul: '', url: '' },
  },

  // ── Sejarah Indonesia ──────────────────────────────────────
  '3-1': {
    kelasId: '3', kelasNama: 'Sejarah Indonesia', judulMateri: 'Masa Prasejarah',
    ilustrasi: 'icon-prasejarah.png',
    deskripsiSingkat: 'Pelajari kehidupan manusia purba di Nusantara.',
    video: { url: '', embedUrl: '', judul: '' },
    deskripsi: [
      'Masa prasejarah adalah periode kehidupan manusia sebelum mengenal tulisan, yang ditandai dengan perkembangan budaya dan teknologi sederhana.',
      'Materi ini membahas kehidupan manusia purba di Nusantara, jenis-jenis manusia purba, serta peninggalan zaman batu dan logam.',
    ],
    jurnal: { judul: '', url: '' },
  },
  '3-2': {
    kelasId: '3', kelasNama: 'Sejarah Indonesia', judulMateri: 'Kerajaan Hindu-Buddha',
    ilustrasi: 'icon-kerajaan-hindu-buddha.png',
    deskripsiSingkat: 'Memahami kejayaan kerajaan-kerajaan Nusantara.',
    video: { url: '', embedUrl: '', judul: '' },
    deskripsi: [
      'Pengaruh Hindu-Buddha masuk ke Nusantara melalui jalur perdagangan dan membentuk berbagai kerajaan besar.',
      'Materi ini membahas kerajaan-kerajaan Hindu-Buddha seperti Kutai, Sriwijaya, dan Majapahit serta peninggalannya.',
    ],
    jurnal: { judul: '', url: '' },
  },
  '3-3': {
    kelasId: '3', kelasNama: 'Sejarah Indonesia', judulMateri: 'Masa Kolonial',
    ilustrasi: 'icon-kolonial.png',
    deskripsiSingkat: 'Pelajari perjuangan melawan penjajahan.',
    video: { url: '', embedUrl: '', judul: '' },
    deskripsi: [
      'Masa kolonial adalah periode ketika bangsa-bangsa Eropa menjajah dan menguasai wilayah Nusantara selama ratusan tahun.',
      'Materi ini membahas kedatangan bangsa Eropa, kebijakan kolonial, serta berbagai perlawanan rakyat Indonesia terhadap penjajah.',
    ],
    jurnal: { judul: '', url: '' },
  },
  '3-4': {
    kelasId: '3', kelasNama: 'Sejarah Indonesia', judulMateri: 'Kemerdekaan',
    ilustrasi: 'icon-kemerdekaan.png',
    deskripsiSingkat: 'Memahami proklamasi dan pembentukan negara.',
    video: { url: '', embedUrl: '', judul: '' },
    deskripsi: [
      'Kemerdekaan Indonesia diproklamasikan pada 17 Agustus 1945 setelah perjuangan panjang melawan penjajahan.',
      'Materi ini membahas peristiwa menjelang proklamasi, isi proklamasi, serta proses pembentukan negara dan pemerintahan Indonesia.',
    ],
    jurnal: { judul: '', url: '' },
  },

  // ── Bahasa Indonesia ───────────────────────────────────────
  '5-1': {
    kelasId: '5', kelasNama: 'Bahasa Indonesia', judulMateri: 'Tata Bahasa',
    ilustrasi: 'icon-tata-bahasa.png',
    deskripsiSingkat: 'Pelajari EYD dan kaidah penulisan yang benar.',
    video: { url: '', embedUrl: '', judul: '' },
    deskripsi: [
      'Tata bahasa adalah kumpulan aturan yang mengatur penggunaan bahasa, termasuk ejaan, tanda baca, dan struktur kalimat.',
      'Materi ini membahas Ejaan Yang Disempurnakan (EYD), penggunaan tanda baca, serta penyusunan kalimat yang baik dan benar.',
    ],
    jurnal: { judul: '', url: '' },
  },
  '5-2': {
    kelasId: '5', kelasNama: 'Bahasa Indonesia', judulMateri: 'Membaca Kritis',
    ilustrasi: 'icon-membaca-kritis.png',
    deskripsiSingkat: 'Memahami isi teks dan menganalisis makna.',
    video: { url: '', embedUrl: '', judul: '' },
    deskripsi: [
      'Membaca kritis adalah kemampuan memahami, menganalisis, dan mengevaluasi isi suatu teks secara mendalam.',
      'Materi ini membahas teknik membaca kritis, cara menemukan gagasan utama, serta menganalisis maksud dan tujuan penulis.',
    ],
    jurnal: { judul: '', url: '' },
  },
  '5-3': {
    kelasId: '5', kelasNama: 'Bahasa Indonesia', judulMateri: 'Menulis Esai',
    ilustrasi: 'icon-menulis-esai.png',
    deskripsiSingkat: 'Pelajari cara menulis esai yang baik dan terstruktur.',
    video: { url: '', embedUrl: '', judul: '' },
    deskripsi: [
      'Esai adalah karya tulis yang berisi pandangan atau pendapat penulis terhadap suatu topik secara terstruktur.',
      'Materi ini membahas struktur esai, teknik menyusun argumen, serta langkah-langkah menulis esai yang baik.',
    ],
    jurnal: { judul: '', url: '' },
  },
  '5-4': {
    kelasId: '5', kelasNama: 'Bahasa Indonesia', judulMateri: 'Sastra Indonesia',
    ilustrasi: 'icon-sastra.png',
    deskripsiSingkat: 'Memahami karya sastra dan nilai budayanya.',
    video: { url: '', embedUrl: '', judul: '' },
    deskripsi: [
      'Sastra Indonesia mencakup berbagai karya seperti puisi, cerpen, novel, dan drama yang mengandung nilai estetika dan budaya.',
      'Materi ini membahas jenis-jenis karya sastra, unsur-unsur pembentuknya, serta nilai-nilai yang terkandung di dalamnya.',
    ],
    jurnal: { judul: '', url: '' },
  },

  // ── Komputer ───────────────────────────────────────────────
  '6-1': {
    kelasId: '6', kelasNama: 'Komputer', judulMateri: 'Pengantar Komputer',
    ilustrasi: 'icon-pengantar-komputer.png',
    deskripsiSingkat: 'Pelajari komponen dasar dan cara kerja komputer.',
    video: { url: '', embedUrl: '', judul: '' },
    deskripsi: [
      'Komputer adalah perangkat elektronik yang dapat menerima, mengolah, dan menyimpan data menjadi informasi.',
      'Materi ini membahas komponen dasar komputer (hardware, software, brainware) serta cara kerja sistem komputer secara umum.',
    ],
    jurnal: { judul: '', url: '' },
  },
  '6-2': {
    kelasId: '6', kelasNama: 'Komputer', judulMateri: 'Sistem Operasi',
    ilustrasi: 'icon-sistem-operasi.png',
    deskripsiSingkat: 'Memahami fungsi dan jenis sistem operasi.',
    video: { url: '', embedUrl: '', judul: '' },
    deskripsi: [
      'Sistem operasi adalah perangkat lunak utama yang mengelola seluruh sumber daya perangkat keras dan menjalankan program pada komputer.',
      'Materi ini membahas fungsi sistem operasi, jenis-jenis sistem operasi populer, serta cara kerjanya dalam mengatur perangkat.',
    ],
    jurnal: { judul: '', url: '' },
  },
  '6-3': {
    kelasId: '6', kelasNama: 'Komputer', judulMateri: 'Jaringan Dasar',
    ilustrasi: 'icon-jaringan.png',
    deskripsiSingkat: 'Pelajari konsep jaringan komputer dan internet.',
    video: { url: '', embedUrl: '', judul: '' },
    deskripsi: [
      'Jaringan komputer adalah kumpulan perangkat yang saling terhubung untuk berbagi data dan sumber daya.',
      'Materi ini membahas jenis-jenis jaringan, topologi jaringan, serta dasar-dasar cara kerja internet.',
    ],
    jurnal: { judul: '', url: '' },
  },
  '6-4': {
    kelasId: '6', kelasNama: 'Komputer', judulMateri: 'Pemrograman Dasar',
    ilustrasi: 'icon-pemrograman.png',
    deskripsiSingkat: 'Memahami logika dan dasar-dasar coding.',
    video: { url: '', embedUrl: '', judul: '' },
    deskripsi: [
      'Pemrograman adalah proses menulis instruksi yang dapat dijalankan oleh komputer untuk menyelesaikan suatu tugas.',
      'Materi ini membahas logika dasar pemrograman, struktur kontrol, serta pengenalan bahasa pemrograman untuk pemula.',
    ],
    jurnal: { judul: '', url: '' },
  },
}

// ── ICON COMPONENTS ──────────────────────────────────────────
function IconBeranda() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
}
function IconKelas() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
}
function IconRiwayat() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
}
function IconFavorit() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
}
function IconZoom() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
}
function IconKeluar() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
}
function IconAnalitik() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> }


const menuItems = [
  { key: 'kelas',   label: 'Kelas Pembelajaran', path: '/dashboard', icon: <IconKelas /> },
  { key: 'riwayat', label: 'Riwayat Belajar',    path: '/riwayat',   icon: <IconRiwayat /> },
  { key: 'favorit', label: 'Kelas Favorit',       path: '/favorit',   icon: <IconFavorit /> },
  { key: 'zoom',    label: 'Kelas Zoom Meeting',  path: '/zoom',      icon: <IconZoom /> },
  { key: 'analitik', label: 'Analitik Progress',   path: '/analitik',  icon: <IconAnalitik /> },
]

// ── MINI CALENDAR ─────────────────────────────────────────────
function MiniCalendar() {
  const today = new Date()
  const [current, setCurrent] = useState({ year: today.getFullYear(), month: today.getMonth() })
  const monthNames = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
  const dayNames = ['Sen','Sel','Rab','Kam','Jum','Sab','Ming']
  const firstDay = new Date(current.year, current.month, 1).getDay()
  const offset = firstDay === 0 ? 6 : firstDay - 1
  const daysInMonth = new Date(current.year, current.month + 1, 0).getDate()
  const prev = () => setCurrent(c => c.month === 0 ? { year: c.year-1, month: 11 } : { ...c, month: c.month-1 })
  const next = () => setCurrent(c => c.month === 11 ? { year: c.year+1, month: 0 } : { ...c, month: c.month+1 })
  const cells = []
  for (let i = 0; i < offset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  const isToday = (d) => d === today.getDate() && current.month === today.getMonth() && current.year === today.getFullYear()
  return (
    <div style={cal.wrap}>
      <div style={cal.header}>
        <button onClick={prev} style={cal.navBtn}>‹</button>
        <span style={cal.monthLabel}>{monthNames[current.month]} {current.year}</span>
        <button onClick={next} style={cal.navBtn}>›</button>
      </div>
      <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '8px 0' }} />
      <div style={cal.grid}>
        {dayNames.map(d => <div key={d} style={cal.dayName}>{d}</div>)}
        {cells.map((d, i) => (
          <div key={i} style={d && isToday(d) ? cal.today : cal.day}>{d || ''}</div>
        ))}
      </div>
    </div>
  )
}
const cal = {
  wrap: { backgroundColor: '#fff', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  navBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#555', padding: '0 4px' },
  monthLabel: { fontWeight: 700, fontSize: '0.9rem', color: '#111' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', textAlign: 'center' },
  dayName: { fontSize: '0.72rem', color: '#888', fontWeight: 600, padding: '4px 0' },
  day: { fontSize: '0.8rem', color: '#444', padding: '5px 2px', borderRadius: '6px' },
  today: { fontSize: '0.8rem', color: '#fff', padding: '5px 2px', borderRadius: '6px', backgroundColor: '#0066FF', fontWeight: 700 },
}

// ── MAIN COMPONENT ────────────────────────────────────────────
export default function MateriDetail() {
  const navigate = useNavigate()
  const { kelasId, materiId } = useParams()
  const [activeMenu, setActiveMenu] = useState('kelas')
  const userName = 'Alihudin'

  const key = `${kelasId}-${materiId}`
  const materi = materiData[key]

  // ── CATAT RIWAYAT BELAJAR (real-time ke localStorage) ─────────
  useEffect(() => {
    if (!materi) return

    const entry = {
      kelasId,
      materiId,
      kelasNama: materi.kelasNama,
      judulMateri: materi.judulMateri,
      // jenis: 'video' kalau materi punya video, 'baca' kalau tidak
      jenis: materi.video?.url ? 'video' : 'baca',
      timestamp: Date.now(),
    }

    try {
      const existing = JSON.parse(localStorage.getItem('riwayatBelajar') || '[]')
      // hapus entri lama untuk materi yang sama, lalu tambahkan yang baru di depan
      const filtered = existing.filter(item => !(item.kelasId === kelasId && item.materiId === materiId))
      const updated = [entry, ...filtered].slice(0, 50) // simpan maksimal 50 riwayat terbaru
      localStorage.setItem('riwayatBelajar', JSON.stringify(updated))
    } catch (e) {
      console.error('Gagal menyimpan riwayat belajar', e)
    }
  }, [kelasId, materiId, materi])

  if (!materi) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'Poppins, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '3rem' }}>📭</p>
          <h2>Materi tidak ditemukan</h2>
          <button onClick={() => navigate(-1)} style={{ marginTop: 16, padding: '10px 24px', backgroundColor: '#0066FF', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
            Kembali
          </button>
        </div>
      </div>
    )
  }

  const getYoutubeId = (url) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=))([^?&]+)/)
    return match ? match[1] : null
  }
  const ytId = getYoutubeId(materi.video.url)

  return (
    <div style={s.layout}>

      {/* ── SIDEBAR ── */}
      <aside style={s.sidebar}>
        <div style={s.logoWrap} onClick={() => navigate('/')}>
          <img src={logo} alt="LearningSpace" style={s.logoImg}
            onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='block' }} />
          <span style={{ ...s.logoFallback, display: 'none' }}>
            Learning<span style={{ color: '#FFD93D' }}>Space</span>
            <span style={s.logoUnderline} />
          </span>
        </div>
        <nav style={s.nav}>
          {menuItems.map(item => (
            <div key={item.key}
              onClick={() => { setActiveMenu(item.key); navigate(item.path) }}
              style={{ ...s.menuItem, ...(activeMenu === item.key ? s.menuActive : {}) }}
            >
              {activeMenu === item.key && <div style={s.activeBar} />}
              <span style={{ ...s.menuIcon, color: activeMenu === item.key ? '#fff' : 'rgba(255,255,255,0.75)' }}>{item.icon}</span>
              <span style={{ ...s.menuLabel, color: activeMenu === item.key ? '#fff' : 'rgba(255,255,255,0.75)', fontWeight: activeMenu === item.key ? 700 : 400 }}>{item.label}</span>
            </div>
          ))}
        </nav>
        <div style={s.keluarWrap}>
          <div onClick={() => navigate('/')} style={s.keluarBtn}>
            <span style={{ color: '#ff4d4d' }}><IconKeluar /></span>
            <span style={s.keluarLabel}>Keluar</span>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={s.main}>

        {/* Header */}
        <div style={s.headerRow}>
          <div style={{ flex: 1 }}>
            <button onClick={() => navigate(`/kelas/${kelasId}`)} style={s.backBtn}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0f0f0'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="4"/>
                <polyline points="13 8 8 12 13 16"/>
              </svg>
              <span style={s.backLabel}>Kembali</span>
            </button>
            <h1 style={s.pageTitle}>{materi.judulMateri}</h1>
            <p style={s.pageDesc}>{materi.deskripsiSingkat}</p>
          </div>
          {/* Ilustrasi kanan atas — export per materi dari Figma */}
          <div style={s.ilustrasiWrap}>
            <img
              src={`/src/assets/${materi.ilustrasi}`}
              alt={materi.judulMateri}
              style={s.ilustrasiImg}
              onError={e => e.target.style.display = 'none'}
            />
          </div>
        </div>

        <hr style={s.divider} />

        {/* ── VIDEO PEMBELAJARAN ── */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>Video Pembelajaran</h2>
          <div style={s.videoCard}>
            {ytId ? (
              <div style={s.videoEmbed}>
                <iframe
                  src={`https://www.youtube.com/embed/${ytId}`}
                  title={materi.video.judul}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div style={s.videoPlaceholder}>
                <span style={{ fontSize: '3rem' }}>🎬</span>
                <p style={{ color: '#888', marginTop: 8 }}>Video belum tersedia</p>
              </div>
            )}
            {materi.video.url && (
              <div style={s.videoLinkRow}>
                <span style={s.videoLinkLabel}>Link Video: </span>
                <a href={materi.video.url} target="_blank" rel="noreferrer" style={s.videoLink}>
                  {materi.video.url}
                </a>
              </div>
            )}
          </div>
        </section>

        {/* ── DESKRIPSI MATERI ── */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>Deskripsi Materi</h2>
          <div style={s.deskripsiCard}>
            <div style={{ flex: 1 }}>
              {materi.deskripsi.map((par, i) => (
                <p key={i} style={{ ...s.deskripsiText, marginBottom: i < materi.deskripsi.length - 1 ? '12px' : 0 }}>
                  {par}
                </p>
              ))}
            </div>
            <div style={s.deskripsiIconWrap}>
              <img
                src={iconDeskripsi}
                alt="deskripsi"
                style={s.deskripsiIcon}
                onError={e => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
              {/* Fallback */}
              <div style={{ display: 'none', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="1.5">
                  <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* ── JURNAL PEMBELAJARAN ── */}
        <section style={{ ...s.section, marginBottom: '40px' }}>
          <h2 style={s.sectionTitle}>Jurnal Pembelajaran</h2>
          <div style={s.jurnalCard}>
            <p style={s.jurnalLabel}>Link Jurnal:</p>
            {materi.jurnal.url ? (
              <a href={materi.jurnal.url} target="_blank" rel="noreferrer" style={s.jurnalLink}>
                {materi.jurnal.judul}
              </a>
            ) : (
              <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Jurnal belum tersedia</p>
            )}
          </div>
        </section>

      </main>

      {/* ── RIGHT PANEL ── */}
      <aside style={s.rightPanel}>
        <div style={s.profileCard}>
          <div style={s.avatarWrap}>
            <img src={avatarDefault} alt="Avatar" style={s.avatar}
              onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }} />
            <div style={{ ...s.avatarFallback, display: 'none' }}>
              <svg width="60" height="60" viewBox="0 0 24 24" fill="#aaa">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            </div>
          </div>
          <p style={s.profileName}>{userName}</p>
          <p style={s.profileRole}>Student</p>
          <button style={s.profileBtn} onClick={() => navigate('/profil')}>Profil</button>
        </div>
        <MiniCalendar />
      </aside>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        @keyframes fadeInUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </div>
  )
}

// ── STYLES ────────────────────────────────────────────────────
const s = {
  layout: { display: 'flex', minHeight: '100vh', fontFamily: "'Poppins', sans-serif", backgroundColor: '#f4f6fb' },
  sidebar: { width: '260px', flexShrink: 0, backgroundColor: '#0066FF', display: 'flex', flexDirection: 'column', padding: '28px 0', position: 'sticky', top: 0, height: '100vh' },
  logoWrap: { padding: '0 24px 32px', cursor: 'pointer' },
  logoImg: { height: '36px', objectFit: 'contain' },
  logoFallback: { fontSize: '1.3rem', fontWeight: 800, color: '#fff', position: 'relative', display: 'inline-block' },
  logoUnderline: { display: 'block', height: '3px', backgroundColor: '#FFD93D', borderRadius: '2px', marginTop: '2px' },
  nav: { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 12px' },
  menuItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' },
  menuActive: { backgroundColor: 'rgba(255,255,255,0.18)' },
  activeBar: { position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: '4px', height: '60%', backgroundColor: '#fff', borderRadius: '0 4px 4px 0' },
  menuIcon: { flexShrink: 0 },
  menuLabel: { fontSize: '0.92rem' },
  keluarWrap: { padding: '16px 24px 0' },
  keluarBtn: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', cursor: 'pointer' },
  keluarLabel: { color: '#ff4d4d', fontWeight: 600, fontSize: '0.92rem' },

  main: { flex: 1, padding: '36px 32px', overflowY: 'auto', animation: 'fadeInUp 0.5s ease both' },

  headerRow: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' },
  backBtn: { display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px 10px', borderRadius: '8px', marginBottom: '12px', transition: 'background 0.15s', fontFamily: "'Poppins', sans-serif" },
  backLabel: { fontSize: '0.95rem', fontWeight: 600, color: '#333' },
  pageTitle: { fontSize: '2.2rem', fontWeight: 800, color: '#111', marginBottom: '8px' },
  pageDesc: { color: '#666', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '560px' },
  ilustrasiWrap: { flexShrink: 0, marginLeft: '24px' },
  ilustrasiImg: { width: '140px', height: '120px', objectFit: 'contain' },
  divider: { border: 'none', borderTop: '1.5px solid #e5e7eb', margin: '20px 0 28px' },

  section: { marginBottom: '32px' },
  sectionTitle: { fontSize: '1.1rem', fontWeight: 800, color: '#111', marginBottom: '12px' },

  videoCard: { backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  videoEmbed: { width: '100%', aspectRatio: '16/9', backgroundColor: '#000' },
  videoPlaceholder: { width: '100%', aspectRatio: '16/9', backgroundColor: '#f4f6fb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  videoLinkRow: { padding: '12px 16px', borderTop: '1px solid #f0f0f0' },
  videoLinkLabel: { fontSize: '0.85rem', fontWeight: 700, color: '#111' },
  videoLink: { fontSize: '0.85rem', color: '#0066FF', textDecoration: 'none', wordBreak: 'break-all' },

  deskripsiCard: { backgroundColor: '#fff', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'flex-start', gap: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  deskripsiText: { color: '#444', fontSize: '0.92rem', lineHeight: 1.75 },
  deskripsiIconWrap: { flexShrink: 0 },
  deskripsiIcon: { width: '110px', height: '110px', objectFit: 'contain' },

  jurnalCard: { backgroundColor: '#fff', borderRadius: '16px', padding: '20px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  jurnalLabel: { fontSize: '0.88rem', fontWeight: 700, color: '#111', marginBottom: '8px' },
  jurnalLink: { fontSize: '0.88rem', color: '#0066FF', lineHeight: 1.6, wordBreak: 'break-word' },

  rightPanel: { width: '280px', flexShrink: 0, padding: '36px 20px', display: 'flex', flexDirection: 'column', gap: '20px' },
  profileCard: { backgroundColor: '#fff', borderRadius: '16px', padding: '24px 16px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  avatarWrap: { width: '90px', height: '90px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 12px', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  avatar: { width: '100%', height: '100%', objectFit: 'cover' },
  avatarFallback: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e5e7eb' },
  profileName: { fontWeight: 700, fontSize: '1rem', color: '#111', marginBottom: '4px' },
  profileRole: { color: '#888', fontSize: '0.85rem', marginBottom: '16px' },
  profileBtn: { border: '2px solid #0066FF', color: '#0066FF', backgroundColor: 'transparent', borderRadius: '20px', padding: '6px 28px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: "'Poppins', sans-serif" },
}
