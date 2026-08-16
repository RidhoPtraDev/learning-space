import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import ilustrasiRiwayat from '../assets/ilustrasi-riwayat.png'
import api from '../api/axios'
import RightSidebar from '../components/RightSidebar.jsx'

function IconKelas() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg> }
function IconRiwayat() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> }
function IconFavorit() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> }
function IconZoom() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg> }
function IconKeluar() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> }

function IconPlay() {
  return (
    <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: '#0066FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><polygon points="6 4 20 12 6 20 6 4"/></svg>
    </div>
  )
}
function IconBaca() {
  return (
    <div style={{ width: 44, height: 44, borderRadius: '12px', backgroundColor: '#FFF6DC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative' }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFD93D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z"/>
        <path d="M22 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z"/>
      </svg>
      <span style={{ position: 'absolute', top: 2, right: 4, fontSize: '0.7rem' }}>✨</span>
    </div>
  )
}
function IconZoomRiwayat() {
  return (
    <div style={{ width: 44, height: 44, borderRadius: '12px', backgroundColor: '#E8F0FE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
      </svg>
    </div>
  )
}

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

const bulanIndo = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']

function formatTanggal(timestamp) {
  const date = new Date(timestamp)
  const now = new Date()

  const sameDay = (a, b) =>
    a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()

  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)

  let label
  if (sameDay(date, now)) label = 'Hari ini'
  else if (sameDay(date, yesterday)) label = 'Kemarin'
  else label = `${date.getDate()} ${bulanIndo[date.getMonth()]} ${date.getFullYear()}`

  const jam   = String(date.getHours()).padStart(2, '0')
  const menit = String(date.getMinutes()).padStart(2, '0')

  return { label, waktu: `${jam}.${menit}` }
}



export default function RiwayatBelajar() {
  const navigate = useNavigate()
  const [activeMenu, setActiveMenu] = useState('riwayat')
  const [riwayat, setRiwayat]       = useState([])
  const [loading, setLoading]       = useState(true)
  const [errorMsg, setErrorMsg]     = useState('')

  // ── FETCH RIWAYAT DARI API ──────────────────────────────────
  useEffect(() => {
    api.get('/riwayat')
      .then(res => setRiwayat(res.data.riwayat))
      .catch(err => setErrorMsg(err.response?.data?.message || 'Gagal memuat riwayat belajar'))
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

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
          <div onClick={handleLogout} style={s.keluarBtn}>
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
            <button onClick={() => navigate('/dashboard')} style={s.backBtn}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0f0f0'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="4"/><polyline points="13 8 8 12 13 16"/>
              </svg>
              <span style={s.backLabel}>Kembali</span>
            </button>
            <h1 style={s.pageTitle}>Riwayat Belajar</h1>
            <p style={s.pageDesc}>
              Lihat ringkasan kegiatan belajarmu, materi yang sudah dipelajari, serta perkembangan pemahamanmu.
            </p>
          </div>
          <img src={ilustrasiRiwayat} alt="ilustrasi"
            style={{ width: 180, objectFit: 'contain', flexShrink: 0 }}
            onError={e => e.target.style.display = 'none'} />
        </div>

        <hr style={s.divider} />

        <h2 style={s.sectionTitle}>Ringkasan Belajar</h2>

        {/* ── LOADING ── */}
        {loading && (
          <div style={s.emptyState}>
            <p style={{ color: '#888' }}>Memuat riwayat belajar...</p>
          </div>
        )}

        {/* ── ERROR ── */}
        {!loading && errorMsg && (
          <div style={{ ...s.emptyState, backgroundColor: '#fee2e2' }}>
            <p style={{ color: '#dc2626' }}>{errorMsg}</p>
          </div>
        )}

        {/* ── KOSONG ── */}
        {!loading && !errorMsg && riwayat.length === 0 && (
          <div style={s.emptyState}>
            <p style={{ fontSize: '2.5rem', marginBottom: 8 }}>🕐</p>
            <p style={{ color: '#888' }}>
              Belum ada riwayat belajar. Mulai pelajari materi untuk melihat riwayatnya di sini.
            </p>
          </div>
        )}

        {/* ── LIST RIWAYAT ── */}
        {!loading && !errorMsg && riwayat.length > 0 && (
          <div style={s.list}>
            {riwayat.map((r) => {
              const { label, waktu } = formatTanggal(r.waktuAkses)
              const isZoom = r.jenis === 'zoom'

              const kelasId  = r.Materi?.kelasId  ?? r.Materi?.KelasId
              const materiId = r.Materi?.id
              const judulMateri = isZoom
                ? (r.ZoomMeeting?.judulMateri || 'Zoom Meeting')
                : (r.Materi?.judul || 'Materi')
              const kelasNama = isZoom
                ? (r.ZoomMeeting?.Kela?.nama || r.ZoomMeeting?.Kelas?.nama || '-')
                : (r.Materi?.Kela?.nama || r.Materi?.Kelas?.nama || '-')

              const handleClick = () => {
                if (isZoom) {
                  if (r.ZoomMeeting?.link) window.open(r.ZoomMeeting.link, '_blank', 'noopener,noreferrer')
                } else if (kelasId && materiId) {
                  navigate(`/kelas/${kelasId}/materi/${materiId}`)
                }
              }

              return (
                <div
                  key={r.id}
                  style={s.item}
                  onClick={handleClick}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f9fafb'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
                >
                  {r.jenis === 'video' ? <IconPlay /> : isZoom ? <IconZoomRiwayat /> : <IconBaca />}
                  <div style={{ flex: 1 }}>
                    <p style={s.itemJenis}>
                      {r.jenis === 'video'
                        ? 'Menonton Video Pembelajaran'
                        : r.jenis === 'jurnal'
                          ? 'Membaca Jurnal Pembelajaran'
                          : isZoom
                            ? 'Mengikuti Zoom Meeting'
                            : 'Membaca Materi Pembelajaran'}
                    </p>
                    <p style={s.itemKelas}>{kelasNama}</p>
                    <p style={s.itemMateri}>{judulMateri}</p>
                  </div>
                  <div style={s.itemWaktu}>
                    <p style={s.itemLabel}>{label}</p>
                    <p style={s.itemJam}>{waktu}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* ── RIGHT PANEL ── */}
      <RightSidebar />

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

  headerRow: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' },
  backBtn: { display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px 10px', borderRadius: '8px', marginBottom: '12px', transition: 'background 0.15s', fontFamily: "'Poppins', sans-serif" },
  backLabel: { fontSize: '0.95rem', fontWeight: 600, color: '#333' },
  pageTitle: { fontSize: '2.2rem', fontWeight: 800, color: '#111', marginBottom: '8px' },
  pageDesc: { color: '#666', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '520px' },
  divider: { border: 'none', borderTop: '1.5px solid #e5e7eb', margin: '20px 0 24px' },

  sectionTitle: { fontSize: '1.3rem', fontWeight: 800, color: '#111', marginBottom: '16px' },

  emptyState: { textAlign: 'center', padding: '60px 0', backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' },

  list: { display: 'flex', flexDirection: 'column', gap: '14px' },
  item: { display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#fff', borderRadius: '14px', padding: '18px 20px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', cursor: 'pointer', transition: 'background 0.15s' },
  itemJenis: { fontSize: '0.78rem', color: '#999', marginBottom: '4px' },
  itemKelas: { fontSize: '0.92rem', color: '#444', marginBottom: '2px' },
  itemMateri: { fontSize: '1rem', fontWeight: 700, color: '#111' },
  itemWaktu: { textAlign: 'right', flexShrink: 0 },
  itemLabel: { fontSize: '0.82rem', color: '#999', marginBottom: '2px' },
  itemJam: { fontSize: '0.9rem', color: '#444', fontWeight: 600 },

}