import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import ilustrasiZoom from '../assets/ilustrasi-zoom.png'
import api from '../api/axios'
import RightSidebar from '../components/RightSidebar.jsx'

function IconKelas()    { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg> }
function IconRiwayat()  { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> }
function IconFavorit()  { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> }
function IconZoom()     { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg> }
function IconKeluar()   { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> }
function IconCalendar() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> }
function IconClock()    { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> }
function IconArrow()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg> }

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

export default function KelasZoom() {
  const navigate = useNavigate()
  const [activeMenu, setActiveMenu] = useState('zoom')
  const [meetings,   setMeetings]   = useState([])
  const [loading,    setLoading]    = useState(true)
  const [errorMsg,   setErrorMsg]   = useState('')

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      setErrorMsg('')
      try {
        const res = await api.get('/zoom')
        setMeetings(res.data.meetings || [])
      } catch (err) {
        setErrorMsg(err.response?.data?.message || 'Gagal memuat jadwal zoom')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  // Catat riwayat belajar (jenis: 'zoom') lalu buka link zoom di tab baru.
  // Pola sama seperti pencatatan riwayat video/jurnal di MateriDetail.jsx —
  // gagal mencatat riwayat tidak boleh menghalangi user membuka link zoom-nya.
  const handleJoinZoom = async (zoom) => {
    try {
      await api.post('/riwayat', { zoomMeetingId: zoom.id, jenis: 'zoom' })
    } catch (err) {
      console.error('Gagal menyimpan riwayat zoom', err)
    }
    window.open(zoom.link, '_blank', 'noopener,noreferrer')
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
            <h1 style={s.pageTitle}>Kelas Zoom Meeting</h1>
            <p style={s.pageDesc}>
              Zoom Meeting menghadirkan pengalaman belajar secara real-time, berpartisipasi dalam diskusi, dan memperoleh pemahaman melalui interaksi langsung.
            </p>
          </div>
          <img src={ilustrasiZoom} alt="ilustrasi"
            style={{ width: 180, objectFit: 'contain', flexShrink: 0 }}
            onError={e => e.target.style.display = 'none'} />
        </div>

        <hr style={s.divider} />
        <h2 style={s.sectionTitle}>Jadwal Zoom Meeting</h2>

        {loading && (
          <div style={s.emptyState}><p style={{ color: '#888' }}>Memuat jadwal zoom...</p></div>
        )}

        {!loading && errorMsg && (
          <div style={{ ...s.emptyState, backgroundColor: '#fee2e2' }}>
            <p style={{ color: '#dc2626' }}>{errorMsg}</p>
          </div>
        )}

        {!loading && !errorMsg && meetings.length === 0 && (
          <div style={s.emptyState}>
            <p style={{ fontSize: '2.5rem', marginBottom: 8 }}>📹</p>
            <p style={{ color: '#888' }}>Belum ada kelas zoom yang dijadwalkan.</p>
          </div>
        )}

        {!loading && !errorMsg && meetings.length > 0 && (
          <div style={s.list}>
            {meetings.map(z => (
              <div
                key={z.id}
                style={s.item}
                onClick={() => handleJoinZoom(z)}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
              >
                <div style={{ flex: 1 }}>
                  <p style={s.itemKeterangan}>Kelas zoom yang akan dilaksanakan</p>
                  <p style={s.itemKelas}>{z.Kela?.nama || z.Kelas?.nama || '-'}</p>
                  <p style={s.itemMateri}>{z.judulMateri || '-'}</p>
                </div>
                <div style={s.badgeWrap}>
                  <div style={s.badge}>
                    <IconCalendar />
                    <span>{z.tanggalTeks || new Date(z.waktu).toLocaleDateString('id-ID', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}</span>
                  </div>
                  <div style={s.badge}>
                    <IconClock />
                    <span>{z.jamTeks || new Date(z.waktu).toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' }) + ' WIB'}</span>
                  </div>
                </div>
                <button
                  style={s.joinBtn}
                  onClick={e => { e.stopPropagation(); handleJoinZoom(z) }}
                  title="Buka Zoom"
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <IconArrow />
                </button>
              </div>
            ))}
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
  pageDesc: { color: '#666', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '540px' },
  divider: { border: 'none', borderTop: '1.5px solid #e5e7eb', margin: '20px 0 24px' },
  sectionTitle: { fontSize: '1.3rem', fontWeight: 800, color: '#111', marginBottom: '16px' },

  emptyState: { textAlign: 'center', padding: '60px 0', backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' },

  list: { display: 'flex', flexDirection: 'column', gap: '14px' },
  item: { display: 'flex', alignItems: 'center', gap: '20px', backgroundColor: '#fff', borderRadius: '14px', padding: '20px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', cursor: 'pointer', transition: 'background 0.15s' },
  itemKeterangan: { fontSize: '0.78rem', color: '#999', marginBottom: '4px' },
  itemKelas: { fontSize: '0.92rem', color: '#444', marginBottom: '2px' },
  itemMateri: { fontSize: '1rem', fontWeight: 700, color: '#111' },

  badgeWrap: { display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 },
  badge: { display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#0066FF', color: '#fff', borderRadius: '8px', padding: '6px 12px', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap' },

  joinBtn: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#FFD93D', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'transform 0.2s' },
}