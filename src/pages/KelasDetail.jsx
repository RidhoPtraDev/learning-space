import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import logo from '../assets/logo.png'
import avatarDefault from '../assets/avatar-default.png'
import iconMateri from '../assets/icon-materi.png'   // ← export 1 icon atom/molekul dari Figma
import iconKimia from '../assets/icon-pengantar-kimia.png'

// ── DATA SEMUA KELAS ──────────────────────────────────────────
const allKelas = {
  1: {
    nama: 'Kimia',
    desc: 'Pelajari konsep dasar kimia melalui materi yang terstruktur dan mudah dipahami.',
    materi: [
      { id: 1, judul: 'Pengantar Kimia',   sub: 'Pelajari bentuk garis, sudut dan bangun datar.'},
      { id: 2, judul: 'Struktur Atom',     sub: 'Memahami partikel penyusun atom dan konfigurasi elektronnya.'},
      { id: 3, judul: 'Ikatan Kimia',      sub: 'Pelajari dasar - dasar kimia dan peran pentingnya.'},
      { id: 4, judul: 'Reaksi Kimia',      sub: 'Memahami jenis reaksi kimia dan sifatnya.'},
    ],
  },
  2: {
    nama: 'Matematika',
    desc: 'Asah logika dan kemampuan berhitungmu melalui materi yang terstruktur.',
    materi: [
      { id: 1, judul: 'Geometri',          sub: 'Mempelajari konsep geometri, bangun datar dan ruang, serta sifat - sifat dan rumus yang berkaitan.' },
      { id: 2, judul: 'Fungsi',            sub: 'Memahami konsep fungsi, cara menentukan fungsi, bentuk penyajian fungsi, serta grafik dan penerapannya' },
      { id: 3, judul: 'Perkalian',         sub: 'Pelajari operasi perkalian bilangan bulat dan desimal.' },
      { id: 4, judul: 'Pecahan',           sub: 'Memahami konsep pecahan dan operasinya.' },
    ],
  },
  3: {
    nama: 'Sejarah Indonesia',
    desc: 'Kenali perjalanan sejarah bangsa Indonesia dari masa ke masa.',
    materi: [
      { id: 1, judul: 'Proklamasi Kemerdekaan',   sub: 'Mengenal proses proklamasi kemerdekaan indonesia.' },
      { id: 2, judul: 'Kerajaan Nusantara',       sub: 'Memahami kejayaan kerajaan-kerajaan Nusantara.' },
      { id: 3, judul: 'Pergerakan Nasional',      sub: 'Membelajari perjuangan organisasi nasional.' },
      { id: 4, judul: 'Tokoh Nasional',           sub: 'Mempelajari tokoh - tokoh penting dalam  sejarah bangsa.' },
    ],
  },
  4: {
    nama: 'Fisika',
    desc: 'Pahami konsep energi, gaya, dan gerak dengan pembahasan interaktif.',
    materi: [
      { id: 1, judul: 'Vektor',                   sub: 'Memahami besaran vektor dan operasinya.' },
      { id: 2, judul: 'Gerak dan Percepatan',     sub: 'Memahami konsep gerak dan percepatan.' },
      { id: 3, judul: 'Hukum Newton',             sub: 'Memahami hukum-hukum gerak Newton dan Penerapannya.' },
      { id: 4, judul: 'Suhu dan Kalor',           sub: 'Mengenal suhu, pemuaian, dan perpindahan kalor.' },
    ],
  },
  5: {
    nama: 'Bahasa Indonesia',
    desc: 'Tingkatkan kemampuan bahasa dan penulisan dengan tata bahasa yang baik.',
    materi: [
      { id: 1, judul: 'Majas dan Gaya Bahasa',       sub: 'Mempelajari penggunaan bahasa kiasan untuk memperindah tulisan.' },
      { id: 2, judul: 'Kalimat Efektif',             sub: 'Mempelajari ciri - ciri dan cara membuat kalimat yang efektif.' },
      { id: 3, judul: 'Teks Deskripsi',              sub: 'Mempelajari cara menggambarkan objek, tempat dan suasana. ' },
      { id: 4, judul: 'Teks Eksposisi',              sub: 'Mempelajari teks yang menjelaskan suatu informasi atau pengetahuan.' },
    ],
  },
  6: {
    nama: 'Komputer',
    desc: 'Pelajari dasar teknologi dan komputer modern untuk pemula.',
    materi: [
      { id: 1, judul: 'Pemrograman Web',          sub: 'Mempelajari HTML, CSS dan pembuatan Website.' },
      { id: 2, judul: 'Pengenalan Komputer',      sub: 'Memahami dasar - dasar komputer, komponen dan fungsinya.' },
      { id: 3, judul: 'Pemrograman Dasar',        sub: 'Mempelajari konsep dasar pemrograman dan algoritma.' },
      { id: 4, judul: 'Algoritma dan Flowchart',  sub: 'Mempelajari penyusunan algoritma dan representasi flowchart.' },
    ],
  },
}

// ── ICON COMPONENTS ──────────────────────────────────────────
function IconBeranda() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )
}
function IconKelas() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  )
}
function IconRiwayat() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  )
}
function IconFavorit() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  )
}
function IconZoom() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
    </svg>
  )
}
function IconKeluar() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  )
}

const menuItems = [
  { key: 'beranda', label: 'Beranda',            path: '/dashboard', icon: <IconBeranda /> },
  { key: 'kelas',   label: 'Kelas Pembelajaran', path: '/kelas',     icon: <IconKelas /> },
  { key: 'riwayat', label: 'Riwayat Belajar',    path: '/riwayat',   icon: <IconRiwayat /> },
  { key: 'favorit', label: 'Kelas Favorit',       path: '/favorit',   icon: <IconFavorit /> },
  { key: 'zoom',    label: 'Kelas Zoom Meeting',  path: '/zoom',      icon: <IconZoom /> },
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
  day: { fontSize: '0.8rem', color: '#444', padding: '5px 2px', borderRadius: '6px', cursor: 'pointer' },
  today: { fontSize: '0.8rem', color: '#fff', padding: '5px 2px', borderRadius: '6px', backgroundColor: '#0066FF', fontWeight: 700 },
}

// ── MAIN COMPONENT ────────────────────────────────────────────
export default function KelasDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [activeMenu, setActiveMenu] = useState('kelas')
  const [hoveredMateri, setHoveredMateri] = useState(null)

  const kelas = allKelas[id] || allKelas[1]
  const userName = 'Alihudin'

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
            <div
              key={item.key}
              onClick={() => { setActiveMenu(item.key); navigate(item.path) }}
              style={{ ...s.menuItem, ...(activeMenu === item.key ? s.menuActive : {}) }}
            >
              {activeMenu === item.key && <div style={s.activeBar} />}
              <span style={{ ...s.menuIcon, color: activeMenu === item.key ? '#fff' : 'rgba(255,255,255,0.75)' }}>
                {item.icon}
              </span>
              <span style={{ ...s.menuLabel, color: activeMenu === item.key ? '#fff' : 'rgba(255,255,255,0.75)', fontWeight: activeMenu === item.key ? 700 : 400 }}>
                {item.label}
              </span>
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

        {/* Tombol Kembali */}
        <button
          onClick={() => navigate('/dashboard')}
          style={s.backBtn}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0f0f0'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="4"/>
            <polyline points="13 8 8 12 13 16"/>
          </svg>
          <span style={s.backLabel}>Kembali</span>
        </button>

        {/* Header kelas */}
        <h1 style={s.kelasTitle}>{kelas.nama}</h1>
        <p style={s.kelasDesc}>{kelas.desc}</p>
        <hr style={s.divider} />

        {/* Daftar Materi */}
        <h2 style={s.sectionTitle}>Daftar Materi</h2>
        <p style={s.sectionSub}>Pilih materi yang ingin kamu pelajari</p>

        <div style={s.grid}>
          {kelas.materi.map(m => (
            <div
              key={m.id}
              style={{
                ...s.card,
                transform: hoveredMateri === m.id ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)',
                boxShadow: hoveredMateri === m.id ? '0 16px 40px rgba(0,102,255,0.4)' : '0 4px 16px rgba(0,102,255,0.25)',
              }}
              onMouseEnter={() => setHoveredMateri(m.id)}
              onMouseLeave={() => setHoveredMateri(null)}
              onClick={() => navigate(`/kelas/${id}/materi/${m.id}`)}
            >
              {/* Icon box */}
              <div style={s.cardTop}>
                <div style={s.iconBox}>
                  <img
                    src={iconMateri}
                    alt="materi"
                    style={s.iconImg}
                    onError={e => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                  {/* Fallback SVG kalau icon-materi.png belum ada */}
                  <div style={{ display: 'none', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="1.8">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10"/>
                      <path d="M12 2c2.8 0 5 4.5 5 10s-2.2 10-5 10"/>
                      <path d="M2 12h20"/>
                    </svg>
                  </div>
                </div>

                {/* Arrow button */}
                <div style={{
                  ...s.arrowBtn,
                  backgroundColor: hoveredMateri === m.id ? '#FFD93D' : '#FFD93D',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>
              </div>

              {/* Title & desc */}
              <h4 style={s.cardTitle}>{m.judul}</h4>
              <p style={s.cardDesc}>{m.sub}</p>
            </div>
          ))}
        </div>
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
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
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

  backBtn: { display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px 10px', borderRadius: '8px', marginBottom: '16px', transition: 'background 0.15s' },
  backLabel: { fontSize: '0.95rem', fontWeight: 600, color: '#333', fontFamily: "'Poppins', sans-serif" },

  kelasTitle: { fontSize: '2.2rem', fontWeight: 800, color: '#111', marginBottom: '8px' },
  kelasDesc: { color: '#666', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '600px', marginBottom: '20px' },
  divider: { border: 'none', borderTop: '1.5px solid #e5e7eb', marginBottom: '24px' },
  sectionTitle: { fontSize: '1.4rem', fontWeight: 800, color: '#111', marginBottom: '4px' },
  sectionSub: { color: '#888', fontSize: '0.88rem', marginBottom: '20px' },

  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' },
  card: {
    backgroundColor: '#0066FF', borderRadius: '16px', padding: '20px',
    cursor: 'pointer', transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease',
    display: 'flex', flexDirection: 'column', gap: '12px',
  },
  cardTop: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' },
  iconBox: { width: '52px', height: '52px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  iconImg: { width: '32px', height: '32px', objectFit: 'contain' },
  arrowBtn: { width: '34px', height: '34px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'transform 0.2s' },
  cardTitle: { fontSize: '1rem', fontWeight: 700, color: '#fff' },
  cardDesc: { fontSize: '0.82rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 },

  rightPanel: { width: '280px', flexShrink: 0, padding: '36px 20px', display: 'flex', flexDirection: 'column', gap: '20px' },
  profileCard: { backgroundColor: '#fff', borderRadius: '16px', padding: '24px 16px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  avatarWrap: { width: '90px', height: '90px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 12px', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  avatar: { width: '100%', height: '100%', objectFit: 'cover' },
  avatarFallback: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e5e7eb' },
  profileName: { fontWeight: 700, fontSize: '1rem', color: '#111', marginBottom: '4px' },
  profileRole: { color: '#888', fontSize: '0.85rem', marginBottom: '16px' },
  profileBtn: { border: '2px solid #0066FF', color: '#0066FF', backgroundColor: 'transparent', borderRadius: '20px', padding: '6px 28px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: "'Poppins', sans-serif" },
}