import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import logo from '../assets/logo.png'
import avatarDefault from '../assets/avatar-default.png'
import iconDeskripsi from '../assets/icon-deskripsi.png'
import api from '../api/axios'

// Helper: tentukan src gambar ilustrasi materi, mendukung 2 format:
// - URL lengkap (hasil upload lewat dashboard admin)
// - nama file saja (data lama dari seed) -> dibaca dari /icons/
function resolveIconSrc(icon) {
  if (!icon) return null
  if (icon.startsWith('http://') || icon.startsWith('https://')) return icon
  return `/icons/${icon}`
}

// ── ICON COMPONENTS (IconBeranda sudah dihapus) ─────────────────
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

// ── MENU SIDEBAR (BERANDA SUDAH DIHAPUS) ─────────────────────
function IconAnalitik() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> }
function IconReminder() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> }

const menuItems = [
  { key: 'kelas',   label: 'Kelas Pembelajaran', path: '/dashboard', icon: <IconKelas /> },
  { key: 'riwayat', label: 'Riwayat Belajar',    path: '/riwayat',   icon: <IconRiwayat /> },
  { key: 'favorit', label: 'Kelas Favorit',       path: '/favorit',   icon: <IconFavorit /> },
  { key: 'zoom',    label: 'Kelas Zoom Meeting',  path: '/zoom',      icon: <IconZoom /> },
  { key: 'analitik', label: 'Analitik Progress',  path: '/analitik',  icon: <IconAnalitik /> },
  { key: 'reminder',  label: 'Reminder',           path: '/reminder',  icon: <IconReminder /> },
]

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
        <button onClick={prev} style={cal.navBtn}>&#8249;</button>
        <span style={cal.monthLabel}>{monthNames[current.month]} {current.year}</span>
        <button onClick={next} style={cal.navBtn}>&#8250;</button>
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

function getYoutubeId(url) {
  if (!url) return null
  const raw = url.trim()
  let m = raw.match(/youtu\.be\/([A-Za-z0-9_-]{11})/)
  if (m) return m[1]
  m = raw.match(/[?&]v=([A-Za-z0-9_-]{11})/)
  if (m) return m[1]
  m = raw.match(/\/embed\/([A-Za-z0-9_-]{11})/)
  if (m) return m[1]
  m = raw.match(/\/([A-Za-z0-9_-]{11})(?:[?&]|$)/)
  if (m) return m[1]
  return null
}

function parseDeskripsi(raw) {
  if (!raw) return []
  if (Array.isArray(raw)) return raw
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : [String(parsed)]
  } catch {
    return [raw]
  }
}

export default function MateriDetail() {
  const navigate = useNavigate()
  const { kelasId, materiId } = useParams()
  const [activeMenu, setActiveMenu] = useState('kelas')

  const storedUser = JSON.parse(localStorage.getItem('user') || 'null')
  const userName = storedUser?.nama || 'Pengguna'

  const buildFotoUrl = (fotoPath) => {
    if (!fotoPath) return null
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
    const baseUrl = apiUrl.replace(/\/api\/?$/, '')
    if (fotoPath.startsWith('/uploads/')) return `${baseUrl}${fotoPath}`
    if (fotoPath.includes('/uploads/foto/')) {
      const filename = fotoPath.split('/uploads/foto/').pop()
      return `${baseUrl}/uploads/foto/${filename}`
    }
    return fotoPath
  }

  const userFoto = buildFotoUrl(storedUser?.foto)

  const [materi,   setMateri]   = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const fetchMateri = async () => {
      setLoading(true)
      setErrorMsg('')
      try {
        const res = await api.get(`/kelas/${kelasId}/materi/${materiId}`)
        setMateri(res.data.materi)
      } catch (err) {
        setErrorMsg(err.response?.data?.message || 'Materi tidak ditemukan')
      } finally {
        setLoading(false)
      }
    }
    fetchMateri()
  }, [kelasId, materiId])

  const riwayatSudahDicatat = React.useRef(false)

  useEffect(() => {
    if (!materi) return
    if (riwayatSudahDicatat.current) return
    riwayatSudahDicatat.current = true
    api.post('/riwayat', { materiId: materi.id, jenis: 'video' })
      .catch(err => console.error('Gagal simpan riwayat:', err))
  }, [materi])

  const handleBukaJurnal = async (url) => {
    window.open(url, '_blank', 'noopener,noreferrer')
    try {
      await api.post('/riwayat', { materiId: materi.id, jenis: 'jurnal' })
    } catch (err) {
      console.error('Gagal simpan riwayat jurnal:', err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'Poppins, sans-serif' }}>
        <p style={{ color: '#888' }}>Memuat materi...</p>
      </div>
    )
  }

  if (errorMsg || !materi) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'Poppins, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '3rem' }}>&#128461;</p>
          <h2>{errorMsg || 'Materi tidak ditemukan'}</h2>
          <button onClick={() => navigate(-1)} style={{ marginTop: 16, padding: '10px 24px', backgroundColor: '#0066FF', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
            Kembali
          </button>
        </div>
      </div>
    )
  }

  const ytId = getYoutubeId(materi.videoUrl)
  const deskripsiParagraf = parseDeskripsi(materi.deskripsi)

  return (
    <div style={s.layout}>

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
          <div onClick={handleLogout} style={s.keluarBtn}>
            <span style={{ color: '#ff4d4d' }}><IconKeluar /></span>
            <span style={s.keluarLabel}>Keluar</span>
          </div>
        </div>
      </aside>

      <main style={s.main}>

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
            <h1 style={s.pageTitle}>{materi.judul}</h1>
            <p style={s.pageDesc}>{materi.deskripsiSingkat}</p>
          </div>
          <div style={s.ilustrasiWrap}>
            <img
              src={resolveIconSrc(materi.ilustrasi)}
              alt={materi.judul}
              style={s.ilustrasiImg}
              onError={e => { e.target.style.display = 'none' }}
            />
          </div>
        </div>

        <hr style={s.divider} />

        <section style={s.section}>
          <h2 style={s.sectionTitle}>Video Pembelajaran</h2>
          <div style={s.videoCard}>
            {ytId ? (
              <div style={s.videoEmbed}>
                <iframe
                  src={`https://www.youtube.com/embed/${ytId}`}
                  title={materi.videoJudul || materi.judul}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div style={s.videoPlaceholder}>
                <span style={{ fontSize: '3rem' }}>&#127916;</span>
                <p style={{ color: '#888', marginTop: 8 }}>Video belum tersedia</p>
              </div>
            )}
            {materi.videoUrl && (
              <div style={s.videoLinkRow}>
                <span style={s.videoLinkLabel}>Link Video: </span>
                <a href={materi.videoUrl.trim()} target="_blank" rel="noreferrer" style={s.videoLink}>
                  {materi.videoUrl.trim()}
                </a>
              </div>
            )}
          </div>
        </section>

        <section style={s.section}>
          <h2 style={s.sectionTitle}>Deskripsi Materi</h2>
          <div style={s.deskripsiCard}>
            <div style={{ flex: 1 }}>
              {deskripsiParagraf.length > 0 ? (
                deskripsiParagraf.map((par, i) => (
                  <p key={i} style={{ ...s.deskripsiText, marginBottom: i < deskripsiParagraf.length - 1 ? '12px' : 0 }}>
                    {par}
                  </p>
                ))
              ) : (
                <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Deskripsi belum tersedia</p>
              )}
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
              <div style={{ display: 'none', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="1.5">
                  <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                </svg>
              </div>
            </div>
          </div>
        </section>

        <section style={{ ...s.section, marginBottom: '40px' }}>
          <h2 style={s.sectionTitle}>Jurnal Pembelajaran</h2>
          <div style={s.jurnalCard}>
            <p style={s.jurnalLabel}>Link Jurnal:</p>
            {materi.jurnalUrl ? (
              <a
                href={materi.jurnalUrl}
                onClick={e => { e.preventDefault(); handleBukaJurnal(materi.jurnalUrl) }}
                style={s.jurnalLink}
              >
                {materi.jurnalJudul || materi.jurnalUrl}
              </a>
            ) : (
              <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Jurnal belum tersedia</p>
            )}
          </div>
        </section>

      </main>

      <aside style={s.rightPanel}>
        <div style={s.profileCard}>
          <div style={s.avatarWrap}>
            <img src={userFoto || avatarDefault} alt="Avatar" style={s.avatar}
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
        @keyframes fadeInUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </div>
  )
}

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
  jurnalLink: { fontSize: '0.88rem', color: '#0066FF', lineHeight: 1.6, wordBreak: 'break-word', cursor: 'pointer', textDecoration: 'underline' },
  rightPanel: { width: '280px', flexShrink: 0, padding: '36px 20px', display: 'flex', flexDirection: 'column', gap: '20px' },
  profileCard: { backgroundColor: '#fff', borderRadius: '16px', padding: '24px 16px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  avatarWrap: { width: '90px', height: '90px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 12px', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  avatar: { width: '100%', height: '100%', objectFit: 'cover' },
  avatarFallback: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e5e7eb' },
  profileName: { fontWeight: 700, fontSize: '1rem', color: '#111', marginBottom: '4px' },
  profileRole: { color: '#888', fontSize: '0.85rem', marginBottom: '16px' },
  profileBtn: { border: '2px solid #0066FF', color: '#0066FF', backgroundColor: 'transparent', borderRadius: '20px', padding: '6px 28px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: "'Poppins', sans-serif" },
}