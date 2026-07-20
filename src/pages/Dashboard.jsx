import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReminderMini } from './AnalitikProgress.jsx'
import logo from '../assets/logo.png'
import avatarDefault from '../assets/avatar-default.png'
import ilustrasiDashboard from '../assets/ilustrasi-dashboard.png' // ← export dari Figma (laptop + buku + ikon)
import iconKimia from '../assets/icon-kimia.png'
import iconMatematika from '../assets/icon-matematika.png'
import iconSejarah from '../assets/icon-sejarah.png'
import iconFisika from '../assets/icon-fisika.png'
import iconBahasa from '../assets/icon-bahasa.png'
import iconKomputer from '../assets/icon-komputer.png'


// ── DATA KELAS ────────────────────────────────────────────────
const kelasList = [
  { id: 1, nama: 'Kimia',            desc: 'Pelajari reaksi dan senyawa dasar kimia.\nMateri disusun secara ringkas dan mudah dipahami.',  icon: iconKimia,       kategori: 'Umum' },
  { id: 2, nama: 'Matematika',       desc: 'Asah logika dan kemampuan berhitungmu.\nPelajari konsep dasar dengan penjelasan sederhana.',    icon: iconMatematika,  kategori: 'Digital' },
  { id: 3, nama: 'Sejarah Indonesia',desc: 'Kenali perjalanan sejarah bangsa Indonesia.\nJelajahi peristiwa penting dari masa ke masa.',     icon: iconSejarah,     kategori: 'Sosial' },
  { id: 4, nama: 'Fisika',           desc: 'Pahami konsep energi, gaya, dan gerak.\nDisertai pembahasan materi yang interaktif.',           icon: iconFisika,      kategori: 'Umum' },
  { id: 5, nama: 'Bahasa Indonesia', desc: 'Tingkatkan kemampuan bahasa dan penulisanmu.\nPelajari komunikasi dan tata bahasa yang baik.',  icon: iconBahasa,      kategori: 'Sosial' },
  { id: 6, nama: 'Komputer',         desc: 'Pelajari dasar teknologi dan komputer modern.\nCocok untuk pemula yang ingin mulai berkembang.', icon: iconKomputer,    kategori: 'Digital' },
]

const kategoriList = ['Umum', 'Digital', 'Hukum', 'Sosial', 'Lingkungan']
const kategoriIcons = {
  'Umum':       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  'Digital':    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  'Hukum':      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  'Sosial':     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  'Lingkungan': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22c1.25-1.25 2.5-2.5 3.5-4C7 16 8 13 9 12c1-1 3-1.5 4-1 1 .5 2 2 3 3 1 1 2 2.5 3 2.5"/><path d="M22 22c-1.25-1.25-1.5-4-2-6-.5-2-1-5-3-7s-5-2-7-1"/></svg>,
}

// ── ICON COMPONENTS ──────────────────────────────────────────
function IconKelas() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg> }
function IconRiwayat() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> }
function IconFavorit() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> }
function IconZoom() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg> }
function IconKeluar() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> }
function IconSearch() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> }
function IconFilter() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg> }
function IconChevron({ open }) { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}><polyline points="6 9 12 15 18 9"/></svg> }
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
  const isToday = d => d === today.getDate() && current.month === today.getMonth() && current.year === today.getFullYear()
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
        {cells.map((d, i) => <div key={i} style={d && isToday(d) ? cal.today : cal.day}>{d || ''}</div>)}
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
export default function Dashboard() {
  const navigate = useNavigate()
  const [activeMenu, setActiveMenu] = useState('kelas')
  const [search, setSearch] = useState('')
  const [showFilter, setShowFilter] = useState(false)
  const [selectedKategori, setSelectedKategori] = useState([])
  const [tempKategori, setTempKategori] = useState([])
  const userName = 'Alihudin'

  const toggleTemp = (k) => setTempKategori(prev => prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k])
  const applyFilter = () => { setSelectedKategori(tempKategori); setShowFilter(false) }
  const cancelFilter = () => { setTempKategori(selectedKategori); setShowFilter(false) }
  const openFilter = () => { setTempKategori(selectedKategori); setShowFilter(true) }

  const filtered = kelasList.filter(k => {
    const matchSearch = k.nama.toLowerCase().includes(search.toLowerCase()) || k.desc.toLowerCase().includes(search.toLowerCase())
    const matchKat = selectedKategori.length === 0 || selectedKategori.includes(k.kategori)
    return matchSearch && matchKat
  })

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

      {/* ── MAIN ── */}
      <main style={s.main}>

        {/* Hero */}
        <div style={s.hero}>
          <div style={{ flex: 1 }}>
            <p style={s.heroGreet}>Hai {userName},</p>
            <h1 style={s.heroTitle}>Temukan Pengetahuan<br />Baru Setiap Hari</h1>
            <p style={s.heroDesc}>Jelajahi berbagai materi dan kategori umum, digital, lingkungan, sosial, dan hukum untuk memperluas wawasan serta meningkatkan kemampuanmu.</p>
          </div>
          <img src={ilustrasiDashboard} alt="ilustrasi"
            style={{ width: 220, objectFit: 'contain', flexShrink: 0 }}
            onError={e => e.target.style.display = 'none'} />
        </div>

        {/* Search */}
        <div style={s.searchWrap}>
          <IconSearch />
          <input type="text" placeholder="Cari..." value={search}
            onChange={e => setSearch(e.target.value)} style={s.searchInput} />
        </div>

        {/* Filter */}
        <div style={{ position: 'relative', marginBottom: 28 }}>
          <button style={s.filterBtn} onClick={openFilter}>
            <IconFilter /> Filter <IconChevron open={showFilter} />
          </button>
          {selectedKategori.length > 0 && (
            <span style={s.filterBadge}>{selectedKategori.length}</span>
          )}

          {showFilter && (
            <div style={s.filterDropdown}>
              <div style={s.filterGrid}>
                {kategoriList.map(k => (
                  <label key={k} style={{ ...s.filterItem, backgroundColor: tempKategori.includes(k) ? '#EBF2FF' : '#fff', borderColor: tempKategori.includes(k) ? '#0066FF' : '#e5e7eb' }}>
                    <input type="checkbox" checked={tempKategori.includes(k)} onChange={() => toggleTemp(k)} style={{ display: 'none' }} />
                    <span style={{ color: tempKategori.includes(k) ? '#0066FF' : '#555' }}>{kategoriIcons[k]}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: tempKategori.includes(k) ? 700 : 500, color: tempKategori.includes(k) ? '#0066FF' : '#333' }}>{k}</span>
                  </label>
                ))}
              </div>
              <div style={s.filterActions}>
                <button style={s.btnTerapkan} onClick={applyFilter}>Terapkan</button>
                <button style={s.btnBatal} onClick={cancelFilter}>Batal</button>
              </div>
            </div>
          )}
        </div>

        {/* Kelas Grid */}
        <h2 style={s.sectionTitle}>Kelas Pembelajaran</h2>
        <div style={s.grid}>
          {filtered.map(kelas => (
            <div key={kelas.id} style={s.card}
              onClick={() => navigate(`/kelas/${kelas.id}`)}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,102,255,0.4)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,102,255,0.2)' }}
            >
              <div style={s.cardLeft}>
                <span style={s.cardKat}>{kelas.kategori}</span>
                <h4 style={s.cardTitle}>{kelas.nama}</h4>
                {kelas.desc.split('\n').map((line, i) => (
                  <p key={i} style={s.cardDesc}>{line}</p>
                ))}
              </div>
              <img src={kelas.icon} alt={kelas.nama} style={s.cardIcon}
                onError={e => e.target.style.display = 'none'} />
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#888', padding: '40px', backgroundColor: '#fff', borderRadius: 16 }}>
              Kelas tidak ditemukan 🔍
            </div>
          )}
        </div>
      </main>

      {/* ── RIGHT PANEL ── */}
      <aside style={s.rightPanel}>
        <div style={s.profileCard}>
          <div style={s.avatarWrap}>
            <img src={avatarDefault} alt="Avatar" style={s.avatar}
              onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }} />
            <div style={{ ...s.avatarFallback, display: 'none' }}>
              <svg width="60" height="60" viewBox="0 0 24 24" fill="#aaa"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
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
        @keyframes dropIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </div>
  )
}

// ── STYLES ───────────────────────────────────────────────────
const s = {
  layout: { display:'flex', minHeight:'100vh', fontFamily:"'Poppins',sans-serif", backgroundColor:'#f4f6fb' },
  sidebar: { width:'240px', flexShrink:0, backgroundColor:'#0066FF', display:'flex', flexDirection:'column', padding:'28px 0', position:'sticky', top:0, height:'100vh' },
  logoWrap: { padding:'0 20px 32px', cursor:'pointer' },
  logoImg: { height:'34px', objectFit:'contain' },
  logoFallback: { fontSize:'1.2rem', fontWeight:800, color:'#fff', display:'inline-block' },
  logoUnderline: { display:'block', height:'3px', backgroundColor:'#FFD93D', borderRadius:'2px', marginTop:'2px' },
  nav: { flex:1, display:'flex', flexDirection:'column', gap:'2px', padding:'0 10px' },
  menuItem: { display:'flex', alignItems:'center', gap:'12px', padding:'12px 14px', borderRadius:'12px', cursor:'pointer', position:'relative', transition:'background 0.2s' },
  menuActive: { backgroundColor:'rgba(255,255,255,0.18)' },
  activeBar: { position:'absolute', left:0, top:'50%', transform:'translateY(-50%)', width:'4px', height:'60%', backgroundColor:'#fff', borderRadius:'0 4px 4px 0' },
  menuIcon: { flexShrink:0 },
  menuLabel: { fontSize:'0.88rem' },
  keluarWrap: { padding:'16px 20px 0' },
  keluarBtn: { display:'flex', alignItems:'center', gap:'12px', padding:'12px 14px', borderRadius:'12px', cursor:'pointer' },
  keluarLabel: { color:'#ff4d4d', fontWeight:600, fontSize:'0.88rem' },

  main: { flex:1, padding:'32px 28px', overflowY:'auto', animation:'fadeInUp 0.5s ease both' },

  // Hero
  hero: { display:'flex', alignItems:'center', justifyContent:'space-between', gap:24, marginBottom:28, backgroundColor:'#fff', borderRadius:20, padding:'28px 32px', boxShadow:'0 2px 12px rgba(0,0,0,0.05)' },
  heroGreet: { fontSize:'1.1rem', fontWeight:600, color:'#333', marginBottom:6 },
  heroTitle: { fontSize:'1.6rem', fontWeight:800, color:'#111', lineHeight:1.3, marginBottom:12 },
  heroDesc: { fontSize:'0.88rem', color:'#666', lineHeight:1.7, maxWidth:460 },

  // Search
  searchWrap: { display:'flex', alignItems:'center', gap:10, border:'1.5px solid #e5e7eb', borderRadius:12, backgroundColor:'#fff', padding:'10px 16px', marginBottom:14, boxShadow:'0 2px 8px rgba(0,0,0,0.04)' },
  searchInput: { flex:1, border:'none', outline:'none', fontSize:'0.95rem', fontFamily:"'Poppins',sans-serif", color:'#333', backgroundColor:'transparent' },

  // Filter
  filterBtn: { display:'flex', alignItems:'center', gap:8, border:'1.5px solid #e5e7eb', borderRadius:10, backgroundColor:'#fff', padding:'9px 18px', fontSize:'0.88rem', fontWeight:600, color:'#333', cursor:'pointer', fontFamily:"'Poppins',sans-serif", boxShadow:'0 2px 6px rgba(0,0,0,0.04)' },
  filterBadge: { position:'absolute', top:-6, left:70, width:18, height:18, backgroundColor:'#0066FF', color:'#fff', borderRadius:'50%', fontSize:'0.7rem', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' },
  filterDropdown: { position:'absolute', top:44, left:0, backgroundColor:'#fff', borderRadius:14, boxShadow:'0 8px 32px rgba(0,0,0,0.12)', padding:'20px', zIndex:100, minWidth:320, animation:'dropIn 0.2s ease', border:'1px solid #f0f0f0' },
  filterGrid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 },
  filterItem: { display:'flex', alignItems:'center', gap:8, border:'1.5px solid #e5e7eb', borderRadius:10, padding:'10px 14px', cursor:'pointer', transition:'all 0.15s', userSelect:'none' },
  filterActions: { display:'flex', gap:10 },
  btnTerapkan: { flex:1, padding:'10px', backgroundColor:'#0066FF', color:'#fff', border:'none', borderRadius:10, fontWeight:700, cursor:'pointer', fontFamily:"'Poppins',sans-serif", fontSize:'0.88rem' },
  btnBatal: { flex:1, padding:'10px', backgroundColor:'#fff', color:'#333', border:'1.5px solid #e5e7eb', borderRadius:10, fontWeight:600, cursor:'pointer', fontFamily:"'Poppins',sans-serif", fontSize:'0.88rem' },

  // Grid
  sectionTitle: { fontSize:'1.3rem', fontWeight:800, color:'#111', marginBottom:16 },
  grid: { display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:14 },
  card: { backgroundColor:'#0066FF', borderRadius:16, padding:'18px 16px 18px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer', transition:'transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease', boxShadow:'0 4px 16px rgba(0,102,255,0.2)' },
  cardLeft: { flex:1 },
  cardKat: { fontSize:'0.7rem', fontWeight:600, color:'rgba(255,255,255,0.7)', textTransform:'uppercase', letterSpacing:0.5, display:'block', marginBottom:4 },
  cardTitle: { fontSize:'0.95rem', fontWeight:700, color:'#fff', marginBottom:6 },
  cardDesc: { fontSize:'0.78rem', color:'rgba(255,255,255,0.85)', lineHeight:1.5 },
  cardIcon: { width:72, height:72, objectFit:'contain', flexShrink:0, marginLeft:12 },

  // Right panel
  rightPanel: { width:'260px', flexShrink:0, padding:'32px 18px', display:'flex', flexDirection:'column', gap:18 },
  profileCard: { backgroundColor:'#fff', borderRadius:16, padding:'22px 14px', textAlign:'center', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' },
  avatarWrap: { width:'80px', height:'80px', borderRadius:'50%', overflow:'hidden', margin:'0 auto 10px', backgroundColor:'#e5e7eb', display:'flex', alignItems:'center', justifyContent:'center' },
  avatar: { width:'100%', height:'100%', objectFit:'cover' },
  avatarFallback: { width:'100%', height:'100%', alignItems:'center', justifyContent:'center', backgroundColor:'#e5e7eb' },
  profileName: { fontWeight:700, fontSize:'1rem', color:'#111', marginBottom:2 },
  profileRole: { color:'#888', fontSize:'0.82rem', marginBottom:14 },
  profileBtn: { border:'2px solid #0066FF', color:'#0066FF', backgroundColor:'transparent', borderRadius:20, padding:'5px 24px', fontWeight:700, fontSize:'0.88rem', cursor:'pointer', fontFamily:"'Poppins',sans-serif" },
}
