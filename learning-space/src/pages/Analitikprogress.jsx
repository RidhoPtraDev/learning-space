import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import avatarDefault from '../assets/avatar-default.png'
import api from '../api/axios'

// ── ICON COMPONENTS (konsisten dengan Dashboard.jsx) ───────────
function IconKelas()    { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg> }
function IconRiwayat()  { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> }
function IconFavorit()  { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> }
function IconZoom()     { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg> }
function IconAnalitik() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> }
function IconKeluar()   { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> }

const menuItems = [
  { key: 'kelas',    label: 'Kelas Pembelajaran', path: '/dashboard', icon: <IconKelas /> },
  { key: 'riwayat',  label: 'Riwayat Belajar',    path: '/riwayat',   icon: <IconRiwayat /> },
  { key: 'favorit',  label: 'Kelas Favorit',       path: '/favorit',   icon: <IconFavorit /> },
  { key: 'zoom',     label: 'Kelas Zoom Meeting',  path: '/zoom',      icon: <IconZoom /> },
  { key: 'analitik', label: 'Analitik Progress',   path: '/analitik',  icon: <IconAnalitik /> },
]

// ── MINI CALENDAR (sama persis seperti Dashboard.jsx) ──────────
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

// ── DIAGRAM BATANG — Aktivitas 7 hari ──────────────────────────
function DiagramBatang({ data, loading }) {
  if (loading) return <div style={d.skeleton}>Memuat diagram...</div>
  const semuaNol = data.every(item => item.jam === 0)
  if (semuaNol) return (
    <div style={d.empty}><p style={{ color:'#888', fontSize:'0.9rem' }}>Belum ada aktivitas belajar minggu ini.</p></div>
  )

  const BAR_H = 160
  const maxVal = Math.max(...data.map(item => item.jam), 1)
  const yLabels = [maxVal, maxVal*0.75, maxVal*0.5, maxVal*0.25, 0].map(v => Math.round(v*10)/10)

  return (
    <div style={{ width:'100%' }}>
      <div style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
        <div style={{ display:'flex', flexDirection:'column', justifyContent:'space-between', height:BAR_H, flexShrink:0, paddingTop:20 }}>
          {yLabels.map((v,i) => <span key={i} style={{ fontSize:'0.68rem', color:'#aaa', lineHeight:1, textAlign:'right', minWidth:20 }}>{v}</span>)}
        </div>
        <div style={{ flex:1, borderLeft:'1px solid #e5e7eb', borderBottom:'1px solid #e5e7eb', paddingLeft:12, paddingRight:4 }}>
          <div style={{ display:'flex', alignItems:'flex-end', gap:10, height:BAR_H }}>
            {data.map(item => {
              const barH = Math.max(Math.round((item.jam / maxVal) * (BAR_H - 24)), item.jam > 0 ? 6 : 2)
              return (
                <div key={item.tanggal} style={{ display:'flex', flexDirection:'column', alignItems:'center', flex:1 }}>
                  <span style={{ fontSize:'0.72rem', fontWeight:700, color:'#333', marginBottom:4 }}>{item.jam > 0 ? `${item.jam}j` : ''}</span>
                  <div style={{ width:'100%', maxWidth:42, height:barH, backgroundColor:'#0066FF', borderRadius:'6px 6px 0 0', transition:'height 0.6s ease' }} />
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <div style={{ display:'flex', gap:10, marginLeft:32, paddingLeft:12, marginTop:8 }}>
        {data.map(item => (
          <div key={item.tanggal} style={{ flex:1, textAlign:'center' }}>
            <span style={{ fontSize:'0.74rem', fontWeight:600, color:'#444', display:'block' }}>{item.hari}</span>
            <span style={{ fontSize:'0.68rem', color:'#aaa' }}>{item.tanggalLabel}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── DIAGRAM DONAT — Mata pelajaran terbanyak ───────────────────
function DiagramDonat({ data, loading }) {
  if (loading) return <div style={d.skeleton}>Memuat diagram...</div>
  if (!data.length) return (
    <div style={d.empty}><p style={{ color:'#888', fontSize:'0.9rem' }}>Belum ada data mata pelajaran yang dipelajari.</p></div>
  )

  const R = 70, r = 42, cx = 90, cy = 90
  let cumPct = 0
  const slices = data.map(item => { const start = cumPct; cumPct += item.persen; return { ...item, start, end: cumPct } })

  function polar(pct, radius) {
    const angle = (pct / 100) * 2 * Math.PI - Math.PI / 2
    return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)]
  }
  function slicePath(start, end, R, r) {
    if (end - start >= 100) end = 99.99
    const [ox, oy] = polar(start, R), [ix, iy] = polar(start, r)
    const [ex, ey] = polar(end, R),   [nx, ny] = polar(end, r)
    const large = end - start > 50 ? 1 : 0
    return `M ${ox} ${oy} A ${R} ${R} 0 ${large} 1 ${ex} ${ey} L ${nx} ${ny} A ${r} ${r} 0 ${large} 0 ${ix} ${iy} Z`
  }
  const topItem = data[0]

  return (
    <div style={{ display:'flex', alignItems:'center', gap:24, flexWrap:'wrap' }}>
      <div style={{ position:'relative', flexShrink:0 }}>
        <svg width="180" height="180" viewBox="0 0 180 180">
          {slices.map((sl,i) => (
            <path key={i} d={slicePath(sl.start, sl.end, R, r)} fill={sl.warna}
              style={{ transition:'opacity 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.opacity='0.8'}
              onMouseLeave={e => e.currentTarget.style.opacity='1'}>
              <title>{sl.kelasNama}: {sl.persen}%</title>
            </path>
          ))}
          <text x={cx} y={cy-8} textAnchor="middle" fontSize="11" fontWeight="700" fill="#111">{topItem?.persen}%</text>
          <text x={cx} y={cy+8} textAnchor="middle" fontSize="9" fill="#888">{topItem?.kelasNama?.split(' ')[0]}</text>
          <text x={cx} y={cy+20} textAnchor="middle" fontSize="8" fill="#aaa">terbanyak</text>
        </svg>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:8, flex:1, minWidth:140 }}>
        {data.map((item,i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:12, height:12, borderRadius:'50%', backgroundColor:item.warna, flexShrink:0 }} />
              <span style={{ fontSize:'0.82rem', color:'#333', fontWeight:500 }}>{item.kelasNama}</span>
            </div>
            <span style={{ fontSize:'0.82rem', color:'#888', fontWeight:700, flexShrink:0 }}>{item.persen}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const d = {
  skeleton: { height:200, backgroundColor:'#f3f4f6', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', color:'#aaa', fontSize:'0.88rem' },
  empty:    { height:160, display:'flex', alignItems:'center', justifyContent:'center' },
}

// ── MAIN COMPONENT ───────────────────────────────────────────
export default function AnalitikProgress() {
  const navigate = useNavigate()
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null')
  const userName = storedUser?.nama || 'Pelajar'

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/analitik/progress')
      .then(res => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const today = new Date()
  const hariNamaLengkap = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'][today.getDay()]
  const bulanLengkap = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'][today.getMonth()]
  const tanggalHariIni = `${hariNamaLengkap}, ${today.getDate()} ${bulanLengkap} ${today.getFullYear()}`

  const ringkasan = data?.ringkasanHariIni || { materiDipelajari:0, waktuBelajarMenit:0, kelasSelesai:0, streak:0 }
  const jam = Math.floor(ringkasan.waktuBelajarMenit / 60)
  const menit = ringkasan.waktuBelajarMenit % 60
  const waktuBelajarLabel = jam > 0 ? `${jam}j ${menit}m` : `${menit}m`

  const target = data?.targetMingguan || { target:10, selesai:0, persen:0 }
  const mapel = data?.mapelTerbanyak || []
  const insight = data?.insight || []
  const aktivitas7Hari = data?.aktivitas7Hari || Array.from({length:7},(_,i)=>({ tanggal:i, hari:'-', tanggalLabel:'', jam:0 }))

  const statCards = [
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>, bg:'#EBF2FF', value: ringkasan.materiDipelajari, label:'Materi' , title:'Materi Dipelajari'},
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, bg:'#dcfce7', value: waktuBelajarLabel, label:'Jam', title:'Waktu Belajar' },
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>, bg:'#fef3c7', value: ringkasan.kelasSelesai, label:'Kelas', title:'Kelas Aktif Hari Ini' },
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>, bg:'#f3e8ff', value: ringkasan.streak, label:'Hari', title:'Streak' },
  ]

  return (
    <div style={s.layout}>
      {/* ── SIDEBAR ── */}
      <aside style={s.sidebar}>
        <div style={s.logoWrap} onClick={() => navigate('/dashboard')}>
          <img src={logo} alt="LearningSpace" style={s.logoImg}
            onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='block' }} />
          <span style={{ ...s.logoFallback, display:'none' }}>
            Learning<span style={{ color:'#FFD93D' }}>Space</span>
            <span style={s.logoUnderline} />
          </span>
        </div>
        <nav style={s.nav}>
          {menuItems.map(item => (
            <div key={item.key} onClick={() => navigate(item.path)}
              style={{ ...s.menuItem, ...(item.key === 'analitik' ? s.menuActive : {}) }}>
              {item.key === 'analitik' && <div style={s.activeBar} />}
              <span style={{ ...s.menuIcon, color: item.key === 'analitik' ? '#fff' : 'rgba(255,255,255,0.75)' }}>{item.icon}</span>
              <span style={{ ...s.menuLabel, color: item.key === 'analitik' ? '#fff' : 'rgba(255,255,255,0.75)', fontWeight: item.key === 'analitik' ? 700 : 400 }}>{item.label}</span>
            </div>
          ))}
        </nav>
        <div style={s.keluarWrap}>
          <div onClick={handleLogout} style={s.keluarBtn}>
            <span style={{ color:'#ff4d4d' }}><IconKeluar /></span>
            <span style={s.keluarLabel}>Keluar</span>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={s.main}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:8 }}>
          <div>
            <h1 style={s.pageTitle}>Analitik Progress</h1>
            <p style={s.pageDesc}>Pantau perkembangan belajarmu setiap hari.</p>
          </div>
        </div>

        {/* Ringkasan Hari Ini */}
        <div style={s.card}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18, flexWrap:'wrap', gap:8 }}>
            <h3 style={s.cardTitle}>Ringkasan Hari Ini</h3>
            <span style={{ color:'#888', fontSize:'0.85rem', fontWeight:500 }}>{tanggalHariIni}</span>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))', gap:14 }}>
            {statCards.map(c => (
              <div key={c.title} style={s.statBox}>
                <div style={{ width:40, height:40, borderRadius:10, backgroundColor:c.bg, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12 }}>{c.icon}</div>
                <p style={{ fontSize:'1.5rem', fontWeight:800, color:'#111', marginBottom:2 }}>{loading ? '...' : c.value}</p>
                <p style={{ fontSize:'0.8rem', color:'#888' }}>{c.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Aktivitas Belajar 7 Hari */}
        <div style={s.card}>
          <h3 style={s.cardTitle}>Aktivitas Belajar <span style={{ color:'#888', fontWeight:500, fontSize:'0.82rem' }}>(7 Hari Terakhir)</span></h3>
          <div style={{ marginTop:16 }}>
            <DiagramBatang data={aktivitas7Hari} loading={loading} />
          </div>
        </div>

        {/* Target Mingguan + Mapel Terbanyak */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 }}>
          <div style={s.card}>
            <h3 style={s.cardTitle}>🎯 Target Belajar Mingguan</h3>
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:18, marginBottom:10 }}>
              <div>
                <p style={{ fontSize:'0.8rem', color:'#888' }}>Target</p>
                <p style={{ fontSize:'1.1rem', fontWeight:700, color:'#111' }}>{target.target} Materi</p>
              </div>
              <div style={{ textAlign:'right' }}>
                <p style={{ fontSize:'0.8rem', color:'#888' }}>Selesai</p>
                <p style={{ fontSize:'1.1rem', fontWeight:700, color:'#111' }}>{loading ? '...' : target.selesai} Materi</p>
              </div>
            </div>
            <div style={{ height:10, backgroundColor:'#eef0f5', borderRadius:6, overflow:'hidden', marginBottom:14 }}>
              <div style={{ height:'100%', width:`${target.persen}%`, backgroundColor:'#0066FF', borderRadius:6, transition:'width 0.6s ease' }} />
            </div>
            <div style={{ backgroundColor:'#EBF2FF', borderRadius:10, padding:'12px 14px', display:'flex', gap:10, alignItems:'flex-start' }}>
              <span style={{ fontSize:'1.1rem' }}>🏆</span>
              <div>
                <p style={{ fontSize:'0.85rem', fontWeight:700, color:'#0066FF' }}>{target.persen >= 100 ? 'Target tercapai!' : target.persen >= 50 ? 'Kamu sedang on track!' : 'Ayo semangat belajar!'}</p>
                <p style={{ fontSize:'0.78rem', color:'#5a7fc7' }}>Pertahankan konsistensi belajarmu.</p>
              </div>
            </div>
          </div>

          <div style={s.card}>
            <h3 style={s.cardTitle}>📊 Mata Pelajaran Terbanyak</h3>
            <div style={{ marginTop:16 }}>
              <DiagramDonat data={mapel} loading={loading} />
            </div>
          </div>
        </div>

        {/* Streak + Insight */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 }}>
          <div style={s.card}>
            <h3 style={s.cardTitle}>🔥 Streak Belajar</h3>
            <p style={{ fontSize:'1.8rem', fontWeight:800, color:'#111', marginTop:14 }}>{loading ? '...' : ringkasan.streak} Hari Berturut-turut!</p>
            <p style={{ color:'#888', fontSize:'0.85rem', marginTop:6 }}>Belajar lagi hari ini untuk mempertahankan streak-mu.</p>
            <div style={{ display:'flex', gap:10, marginTop:18, flexWrap:'wrap' }}>
              {Array.from({ length: Math.min(7, Math.max(ringkasan.streak, 1)) }).map((_, i) => (
                <div key={i} style={{ width:30, height:30, borderRadius:'50%', backgroundColor: i < ringkasan.streak ? '#0066FF' : '#eef0f5', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {i < ringkasan.streak && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
              ))}
            </div>
          </div>

          <div style={s.card}>
            <h3 style={s.cardTitle}>💡 Insight Untukmu</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:10, marginTop:16 }}>
              {loading ? (
                <p style={{ color:'#aaa', fontSize:'0.85rem' }}>Memuat insight...</p>
              ) : insight.length === 0 ? (
                <p style={{ color:'#aaa', fontSize:'0.85rem' }}>Belum cukup data untuk insight. Yuk mulai belajar!</p>
              ) : insight.map((ins, i) => (
                <div key={i} style={{ backgroundColor:'#f4f6fb', borderRadius:10, padding:'12px 14px', display:'flex', gap:10, alignItems:'flex-start' }}>
                  <span style={{ fontSize:'1rem', flexShrink:0 }}>{ins.tipe === 'waktu' ? '🕐' : '📚'}</span>
                  <p style={{ fontSize:'0.85rem', color:'#444', lineHeight:1.6 }}>{ins.teks}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p style={{ textAlign:'center', color:'#aaa', fontSize:'0.82rem', marginTop:8 }}>
          Setiap langkah kecil hari ini, membawa perubahan besar untuk masa depanmu! 💙
        </p>
      </main>

      {/* ── RIGHT PANEL ── */}
      <aside style={s.rightPanel}>
        <div style={s.profileCard}>
          <div style={s.avatarWrap}>
            <img src={storedUser?.foto || avatarDefault} alt="Avatar" style={s.avatar}
              onError={e => { e.target.src = avatarDefault }} />
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

// ── STYLES ───────────────────────────────────────────────────
const s = {
  layout:  { display:'flex', minHeight:'100vh', fontFamily:"'Poppins', sans-serif", backgroundColor:'#f4f6fb' },
  sidebar: { width:'260px', flexShrink:0, backgroundColor:'#0066FF', display:'flex', flexDirection:'column', padding:'28px 0', position:'sticky', top:0, height:'100vh' },
  logoWrap:{ padding:'0 24px 32px', cursor:'pointer' },
  logoImg: { height:'36px', objectFit:'contain' },
  logoFallback: { fontSize:'1.3rem', fontWeight:800, color:'#fff', position:'relative', display:'inline-block' },
  logoUnderline: { display:'block', height:'3px', backgroundColor:'#FFD93D', borderRadius:'2px', marginTop:'2px' },
  nav:     { flex:1, display:'flex', flexDirection:'column', gap:'4px', padding:'0 12px' },
  menuItem:{ display:'flex', alignItems:'center', gap:'12px', padding:'12px 16px', borderRadius:'12px', cursor:'pointer', position:'relative', transition:'background 0.2s' },
  menuActive: { backgroundColor:'rgba(255,255,255,0.18)' },
  activeBar:  { position:'absolute', left:0, top:'50%', transform:'translateY(-50%)', width:'4px', height:'60%', backgroundColor:'#fff', borderRadius:'0 4px 4px 0' },
  menuIcon:   { flexShrink:0 },
  menuLabel:  { fontSize:'0.92rem' },
  keluarWrap: { padding:'16px 24px 0' },
  keluarBtn:  { display:'flex', alignItems:'center', gap:'12px', padding:'12px 16px', borderRadius:'12px', cursor:'pointer' },
  keluarLabel:{ color:'#ff4d4d', fontWeight:600, fontSize:'0.92rem' },

  main: { flex:1, padding:'36px 32px', overflowY:'auto', animation:'fadeInUp 0.5s ease both', display:'flex', flexDirection:'column', gap:18 },
  pageTitle: { fontSize:'1.7rem', fontWeight:800, color:'#111', marginBottom:6 },
  pageDesc:  { color:'#666', fontSize:'0.92rem' },

  card: { backgroundColor:'#fff', borderRadius:16, padding:24, boxShadow:'0 2px 12px rgba(0,0,0,0.06)' },
  cardTitle: { fontSize:'1.02rem', fontWeight:800, color:'#111' },
  statBox: { backgroundColor:'#f9fafb', borderRadius:14, padding:'16px 18px', border:'1px solid #f0f0f0' },

  rightPanel: { width:'280px', flexShrink:0, padding:'36px 20px', display:'flex', flexDirection:'column', gap:'20px' },
  profileCard:{ backgroundColor:'#fff', borderRadius:'16px', padding:'24px 16px', textAlign:'center', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' },
  avatarWrap: { width:'90px', height:'90px', borderRadius:'50%', overflow:'hidden', margin:'0 auto 12px', backgroundColor:'#e5e7eb', display:'flex', alignItems:'center', justifyContent:'center' },
  avatar:     { width:'100%', height:'100%', objectFit:'cover' },
  profileName:{ fontWeight:700, fontSize:'1rem', color:'#111', marginBottom:'4px' },
  profileRole:{ color:'#888', fontSize:'0.85rem', marginBottom:'16px' },
  profileBtn: { border:'2px solid #0066FF', color:'#0066FF', backgroundColor:'transparent', borderRadius:'20px', padding:'6px 28px', fontWeight:700, fontSize:'0.9rem', cursor:'pointer', fontFamily:"'Poppins', sans-serif" },
}