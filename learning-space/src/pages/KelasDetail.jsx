import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import logo from '../assets/logo.png'
import avatarDefault from '../assets/avatar-default.png'
import api from '../api/axios'

// Helper: tentukan src gambar ilustrasi materi, mendukung 2 format:
// - URL lengkap (hasil upload lewat dashboard admin)
// - nama file saja (data lama dari seed) -> dibaca dari /icons/
function resolveIconSrc(icon) {
  if (!icon) return null
  if (icon.startsWith('http://') || icon.startsWith('https://')) return icon
  return `/icons/${icon}`
}

// ── ICON COMPONENTS ──────────────────────────────────────────
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

// ── MENU SIDEBAR (BERANDA SUDAH DIHAPUS) ─────────────────────
function IconAnalitik() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> }

const menuItems = [
  { key: 'kelas',   label: 'Kelas Pembelajaran', path: '/dashboard', icon: <IconKelas /> },
  { key: 'riwayat', label: 'Riwayat Belajar',    path: '/riwayat',   icon: <IconRiwayat /> },
  { key: 'favorit', label: 'Kelas Favorit',       path: '/favorit',   icon: <IconFavorit /> },
  { key: 'zoom',    label: 'Kelas Zoom Meeting',  path: '/zoom',      icon: <IconZoom /> },
  { key: 'analitik', label: 'Analitik Progress',  path: '/analitik',  icon: <IconAnalitik /> },
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

  const [kelas, setKelas] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  const storedUser = JSON.parse(localStorage.getItem('user') || 'null')
  const userName = storedUser?.nama || 'Pengguna'

  useEffect(() => {
    const fetchKelas = async () => {
      setLoading(true)
      setErrorMsg('')
      try {
        const res = await api.get(`/kelas/${id}`)
        setKelas(res.data.kelas)
      } catch (err) {
        setErrorMsg(err.response?.data?.message || 'Gagal memuat data kelas')
      } finally {
        setLoading(false)
      }
    }
    fetchKelas()
  }, [id])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const daftarMateri = kelas?.Materis || []

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
          <div onClick={handleLogout} style={s.keluarBtn}>
            <span style={{ color: '#ff4d4d' }}><IconKeluar /></span>
            <span style={s.keluarLabel}>Keluar</span>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={s.main}>

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

        {loading && (
          <div style={{ textAlign: 'center', color: '#888', padding: '60px 0' }}>Memuat data kelas...</div>
        )}

        {!loading && errorMsg && (
          <div style={{ textAlign: 'center', color: '#dc2626', padding: '40px', backgroundColor: '#fee2e2', borderRadius: 16 }}>
            {errorMsg}
          </div>
        )}

        {!loading && !errorMsg && kelas && (
          <>
            <h1 style={s.kelasTitle}>{kelas.nama}</h1>
            <p style={s.kelasDesc}>{kelas.deskripsi}</p>
            <hr style={s.divider} />

            <h2 style={s.sectionTitle}>Daftar Materi</h2>
            <p style={s.sectionSub}>Pilih materi yang ingin kamu pelajari</p>

            <div style={s.grid}>
              {daftarMateri.map(m => (
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
                  <div style={s.cardTop}>
                    <div style={s.iconBox}>
                      <img
                        src={resolveIconSrc(m.ilustrasi)}
                        alt={m.judul}
                        style={s.iconImg}
                        onError={e => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                      <div style={{ display: 'none', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="1.8">
                          <circle cx="12" cy="12" r="3"/>
                          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10"/>
                          <path d="M12 2c2.8 0 5 4.5 5 10s-2.2 10-5 10"/>
                          <path d="M2 12h20"/>
                        </svg>
                      </div>
                    </div>

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

                  <h4 style={s.cardTitle}>{m.judul}</h4>
                  <p style={s.cardDesc}>{m.deskripsiSingkat}</p>
                </div>
              ))}

              {daftarMateri.length === 0 && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#888', padding: '40px', backgroundColor: '#fff', borderRadius: 16 }}>
                  Belum ada materi di kelas ini 📭
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* ── RIGHT PANEL ── */}
      <aside style={s.rightPanel}>
        <div style={s.profileCard}>
          <div style={s.avatarWrap}>
            <img src={storedUser?.foto || avatarDefault} alt="Avatar" style={s.avatar}
              onError={e => { e.target.src = avatarDefault }} />
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