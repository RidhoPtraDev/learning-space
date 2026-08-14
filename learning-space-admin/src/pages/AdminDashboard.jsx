import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import avatarDefault from '../assets/avatar-default.png'
import api from '../api/axios'

// ── ICONS ─────────────────────────────────────────────────────
function IconRingkasan() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg> }
function IconKelas()    { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg> }
function IconZoom()     { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg> }
function IconTestimoni(){ return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> }
function IconLayanan()  { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> }
function IconUser()     { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> }
function IconKeluar()   { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> }
function IconSearch()   { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> }

// ── MENU SIDEBAR ──────────────────────────────────────────────
export const adminMenuItems = [
  { key: 'ringkasan', label: 'Ringkasan',      path: '/',          icon: <IconRingkasan /> },
  { key: 'status-user', label: 'Status User',  path: '/status-user',icon: <IconUser /> },
  { key: 'kelas',     label: 'Kelas & Materi', path: '/kelas',     icon: <IconKelas /> },
  { key: 'zoom',      label: 'Zoom Meeting',   path: '/zoom',      icon: <IconZoom /> },
  { key: 'testimoni', label: 'Testimoni',      path: '/testimoni', icon: <IconTestimoni /> },
  { key: 'layanan',   label: 'Layanan Kami',   path: '/layanan',   icon: <IconLayanan /> },
]

// ── MINI CALENDAR ─────────────────────────────────────────────
export function MiniCalendar() {
  const today = new Date()
  const [current, setCurrent] = useState({ year: today.getFullYear(), month: today.getMonth() })
  const monthNames = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
  const dayNames   = ['Sen','Sel','Rab','Kam','Jum','Sab','Ming']
  const firstDay   = new Date(current.year, current.month, 1).getDay()
  const offset     = firstDay === 0 ? 6 : firstDay - 1
  const daysInMonth= new Date(current.year, current.month + 1, 0).getDate()
  const prev = () => setCurrent(c => c.month === 0 ? { year: c.year-1, month: 11 } : { ...c, month: c.month-1 })
  const next = () => setCurrent(c => c.month === 11 ? { year: c.year+1, month: 0  } : { ...c, month: c.month+1 })
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
      <hr style={{ border:'none', borderTop:'1px solid #e5e7eb', margin:'8px 0' }} />
      <div style={cal.grid}>
        {dayNames.map(d => <div key={d} style={cal.dayName}>{d}</div>)}
        {cells.map((d, i) => <div key={i} style={d && isToday(d) ? cal.today : cal.day}>{d || ''}</div>)}
      </div>
    </div>
  )
}
const cal = {
  wrap:       { backgroundColor:'#fff', borderRadius:'16px', padding:'16px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' },
  header:     { display:'flex', alignItems:'center', justifyContent:'space-between' },
  navBtn:     { background:'none', border:'none', cursor:'pointer', fontSize:'1.2rem', color:'#555', padding:'0 4px' },
  monthLabel: { fontWeight:700, fontSize:'0.9rem', color:'#111' },
  grid:       { display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:'2px', textAlign:'center' },
  dayName:    { fontSize:'0.72rem', color:'#888', fontWeight:600, padding:'4px 0' },
  day:        { fontSize:'0.8rem', color:'#444', padding:'5px 2px', borderRadius:'6px' },
  today:      { fontSize:'0.8rem', color:'#fff', padding:'5px 2px', borderRadius:'6px', backgroundColor:'#0066FF', fontWeight:700 },
}

// ── DIAGRAM BATANG (Aktivitas) ────────────────────────────────
function DiagramBatang({ data, loading }) {
  if (loading) return <div style={d.skeleton}>Memuat diagram...</div>
  if (!data.length) return (
    <div style={d.empty}>
      <p style={{ color:'#888', fontSize:'0.9rem' }}>Belum ada data aktivitas pada periode ini.</p>
    </div>
  )

  const BAR_H = 160
  const maxVal = Math.max(...data.map(item => item.total), 1)
  const warnaPalet = ['#0066FF','#22c55e','#FFD93D','#a855f7','#ef4444','#06b6d4','#f97316','#ec4899']
  const yLabels = [maxVal, Math.round(maxVal*0.75), Math.round(maxVal*0.5), Math.round(maxVal*0.25), 0]

  return (
    <div style={{ width:'100%' }}>
      <div style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
        {/* Y-axis labels */}
        <div style={{ display:'flex', flexDirection:'column', justifyContent:'space-between', height:BAR_H, flexShrink:0, paddingTop:20 }}>
          {yLabels.map((v, i) => (
            <span key={i} style={{ fontSize:'0.68rem', color:'#aaa', lineHeight:1, textAlign:'right', minWidth:20 }}>{v}</span>
          ))}
        </div>
        {/* Bars area */}
        <div style={{ flex:1, borderLeft:'1px solid #e5e7eb', borderBottom:'1px solid #e5e7eb', paddingLeft:12, paddingRight:4 }}>
          <div style={{ display:'flex', alignItems:'flex-end', gap:12, height:BAR_H }}>
            {data.map((item, i) => {
              const barH = Math.max(Math.round((item.total / maxVal) * (BAR_H - 24)), 6)
              return (
                <div key={item.jenis} style={{ display:'flex', flexDirection:'column', alignItems:'center', flex:1 }}>
                  <span style={{ fontSize:'0.75rem', fontWeight:700, color:'#333', marginBottom:4 }}>{item.total}x</span>
                  <div style={{
                    width:'100%',
                    maxWidth:60,
                    height:barH,
                    backgroundColor: warnaPalet[i % warnaPalet.length],
                    borderRadius:'6px 6px 0 0',
                    transition:'height 0.6s ease',
                  }} />
                </div>
              )
            })}
          </div>
        </div>
      </div>
      {/* X labels */}
      <div style={{ display:'flex', gap:12, marginLeft:36, paddingLeft:12, marginTop:8 }}>
        {data.map((item, i) => (
          <div key={item.jenis} style={{ flex:1, textAlign:'center' }}>
            <div style={{ width:24, height:3, borderRadius:2, backgroundColor:warnaPalet[i % warnaPalet.length], margin:'0 auto 4px' }} />
            <span style={{ fontSize:'0.72rem', color:'#666', lineHeight:1.3 }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── DIAGRAM DONAT (Kelas terbanyak) ──────────────────────────
function DiagramDonat({ data, loading }) {
  if (loading) return <div style={d.skeleton}>Memuat diagram...</div>
  if (!data.length) return (
    <div style={d.empty}>
      <p style={{ color:'#888', fontSize:'0.9rem' }}>Belum ada data aktivitas belajar kelas.</p>
    </div>
  )

  // Hitung koordinat SVG donat
  const R = 70, r = 42, cx = 90, cy = 90
  let cumPct = 0
  const slices = data.map(item => {
    const start = cumPct
    cumPct += item.persen
    return { ...item, start, end: cumPct }
  })

  function polar(pct, radius) {
    const angle = (pct / 100) * 2 * Math.PI - Math.PI / 2
    return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)]
  }

  function slicePath(start, end, R, r) {
    if (end - start >= 100) end = 99.99
    const [ox, oy] = polar(start, R)
    const [ix, iy] = polar(start, r)
    const [ex, ey] = polar(end, R)
    const [nx, ny] = polar(end, r)
    const large = end - start > 50 ? 1 : 0
    return `M ${ox} ${oy} A ${R} ${R} 0 ${large} 1 ${ex} ${ey} L ${nx} ${ny} A ${r} ${r} 0 ${large} 0 ${ix} ${iy} Z`
  }

  const topItem = data[0]

  return (
    <div style={{ display:'flex', alignItems:'center', gap:24, flexWrap:'wrap' }}>
      {/* SVG */}
      <div style={{ position:'relative', flexShrink:0 }}>
        <svg width="180" height="180" viewBox="0 0 180 180">
          {slices.map((sl, i) => (
            <path key={i} d={slicePath(sl.start, sl.end, R, r)} fill={sl.warna}
              style={{ transition:'opacity 0.2s', cursor:'default' }}
              onMouseEnter={e => e.currentTarget.style.opacity='0.8'}
              onMouseLeave={e => e.currentTarget.style.opacity='1'}
            >
              <title>{sl.kelasNama}: {sl.persen}%</title>
            </path>
          ))}
          {/* Label tengah */}
          <text x={cx} y={cy-8}  textAnchor="middle" fontSize="11" fontWeight="700" fill="#111">{topItem?.persen}%</text>
          <text x={cx} y={cy+8}  textAnchor="middle" fontSize="9"  fill="#888">{topItem?.kelasNama?.split(' ')[0]}</text>
          <text x={cx} y={cy+20} textAnchor="middle" fontSize="8"  fill="#aaa">terbanyak</text>
        </svg>
      </div>
      {/* Legenda */}
      <div style={{ display:'flex', flexDirection:'column', gap:8, flex:1, minWidth:140 }}>
        {data.map((item, i) => (
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
  chartWrap: { position:'relative', height:220, width:'100%' },
  skeleton:  { height:220, backgroundColor:'#f3f4f6', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', color:'#aaa', fontSize:'0.88rem' },
  empty:     { height:160, display:'flex', alignItems:'center', justifyContent:'center' },
}

// ── TABEL LOG AKTIVITAS ───────────────────────────────────────
function LogAktivitas() {
  const [logs, setLogs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [query, setQuery]     = useState('')
  const [page, setPage]       = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const [total, setTotal]     = useState(0)

  const LIMIT = 10

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/logs', { params: { page, limit: LIMIT, search: query } })
      setLogs(res.data.logs)
      setTotal(res.data.total)
      setTotalPage(res.data.totalPage)
    } catch { /* silent */ }
    finally { setLoading(false) }
  }, [page, query])

  useEffect(() => { fetchLogs() }, [fetchLogs])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    setQuery(search)
  }

  const jenisConfig = {
    video:  { label:'Nonton Video',  bg:'#EBF2FF', color:'#0066FF' },
    jurnal: { label:'Baca Jurnal',   bg:'#dcfce7', color:'#16a34a' },
    zoom:   { label:'Zoom Meeting',  bg:'#fef3c7', color:'#d97706' },
  }

  const formatWaktu = (w) => {
    const d = new Date(w)
    const pad = n => String(n).padStart(2,'0')
    const bulan = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']
    return `${pad(d.getDate())} ${bulan[d.getMonth()]} ${d.getFullYear()}, ${pad(d.getHours())}:${pad(d.getMinutes())}`
  }

  return (
    <div style={{ backgroundColor:'#fff', borderRadius:16, padding:24, boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
      {/* Header log */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12, marginBottom:16 }}>
        <div>
          <h3 style={{ fontWeight:800, fontSize:'1.1rem', color:'#111' }}>Log Aktivitas User</h3>
          <p style={{ color:'#888', fontSize:'0.82rem', marginTop:2 }}>{total} aktivitas tercatat</p>
        </div>
        {/* Search */}
        <form onSubmit={handleSearch} style={{ display:'flex', gap:8 }}>
          <div style={{ display:'flex', alignItems:'center', border:'1.5px solid #e5e7eb', borderRadius:10, overflow:'hidden', backgroundColor:'#f9fafb' }}>
            <span style={{ padding:'0 10px', color:'#aaa' }}><IconSearch /></span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama user..."
              style={{ border:'none', outline:'none', padding:'8px 10px 8px 0', fontSize:'0.85rem', backgroundColor:'transparent', fontFamily:"'Poppins',sans-serif", width:180 }}
            />
          </div>
          <button type="submit" style={{ backgroundColor:'#0066FF', color:'#fff', border:'none', borderRadius:10, padding:'8px 16px', fontWeight:600, fontSize:'0.85rem', cursor:'pointer', fontFamily:"'Poppins',sans-serif" }}>Cari</button>
        </form>
      </div>

      {/* Tabel */}
      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.85rem' }}>
          <thead>
            <tr style={{ backgroundColor:'#f9fafb' }}>
              {['#','User','Email','Aktivitas','Materi / Zoom','Waktu'].map(h => (
                <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontWeight:700, color:'#555', borderBottom:'1.5px solid #e5e7eb', whiteSpace:'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign:'center', padding:40, color:'#aaa' }}>Memuat...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign:'center', padding:40, color:'#aaa' }}>Tidak ada data</td></tr>
            ) : logs.map((log, i) => {
              const cfg = jenisConfig[log.jenis] || jenisConfig.zoom
              const namaAktivitas = log.materi?.judul || log.zoom?.judulMateri || '—'
              return (
                <tr key={log.id} style={{ borderBottom:'1px solid #f0f0f0', transition:'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor='#f9fafb'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor='transparent'}
                >
                  <td style={{ padding:'12px 14px', color:'#aaa', fontWeight:600 }}>{(page-1)*LIMIT + i + 1}</td>
                  <td style={{ padding:'12px 14px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      {log.user?.foto ? (
                        <img src={log.user.foto} alt="" style={{ width:32, height:32, borderRadius:'50%', objectFit:'cover', flexShrink:0 }} onError={e=>{e.target.style.display='none'}} />
                      ) : (
                        <div style={{ width:32, height:32, borderRadius:'50%', backgroundColor:'#EBF2FF', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'0.8rem', fontWeight:700, color:'#0066FF' }}>
                          {log.user?.nama?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span style={{ fontWeight:600, color:'#111' }}>{log.user?.nama || '—'}</span>
                    </div>
                  </td>
                  <td style={{ padding:'12px 14px', color:'#666' }}>{log.user?.email || '—'}</td>
                  <td style={{ padding:'12px 14px' }}>
                    <span style={{ backgroundColor:cfg.bg, color:cfg.color, borderRadius:20, padding:'3px 10px', fontSize:'0.75rem', fontWeight:700, whiteSpace:'nowrap' }}>
                      {cfg.label}
                    </span>
                  </td>
                  <td style={{ padding:'12px 14px', color:'#555', maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{namaAktivitas}</td>
                  <td style={{ padding:'12px 14px', color:'#888', whiteSpace:'nowrap', fontSize:'0.8rem' }}>{formatWaktu(log.waktuAkses)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPage > 1 && (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:16, flexWrap:'wrap', gap:8 }}>
          <span style={{ fontSize:'0.82rem', color:'#888' }}>Halaman {page} dari {totalPage}</span>
          <div style={{ display:'flex', gap:6 }}>
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}
              style={{ padding:'6px 14px', borderRadius:8, border:'1.5px solid #e5e7eb', backgroundColor: page===1 ? '#f3f4f6' : '#fff', color: page===1 ? '#aaa' : '#333', cursor: page===1 ? 'not-allowed' : 'pointer', fontWeight:600, fontSize:'0.82rem', fontFamily:"'Poppins',sans-serif" }}>
              ← Prev
            </button>
            {Array.from({ length: Math.min(5, totalPage) }, (_, i) => {
              const p = Math.max(1, Math.min(page - 2 + i, totalPage - 4 + i))
              return p
            }).filter((p,i,a) => a.indexOf(p)===i && p >= 1 && p <= totalPage).map(p => (
              <button key={p} onClick={() => setPage(p)}
                style={{ padding:'6px 12px', borderRadius:8, border:'1.5px solid', borderColor: p===page ? '#0066FF' : '#e5e7eb', backgroundColor: p===page ? '#0066FF' : '#fff', color: p===page ? '#fff' : '#333', fontWeight:700, cursor:'pointer', fontSize:'0.82rem', fontFamily:"'Poppins',sans-serif" }}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPage, p+1))} disabled={page===totalPage}
              style={{ padding:'6px 14px', borderRadius:8, border:'1.5px solid #e5e7eb', backgroundColor: page===totalPage ? '#f3f4f6' : '#fff', color: page===totalPage ? '#aaa' : '#333', cursor: page===totalPage ? 'not-allowed' : 'pointer', fontWeight:600, fontSize:'0.82rem', fontFamily:"'Poppins',sans-serif" }}>
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── ADMIN LAYOUT ──────────────────────────────────────────────
export function AdminLayout({ activeKey, children, rightPanel = true }) {
  const navigate   = useNavigate()
  const storedUser = JSON.parse(sessionStorage.getItem('user') || 'null')
  const adminName  = storedUser?.nama || 'Admin'
  const adminFoto  = storedUser?.foto || null

  const handleLogout = () => {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div style={s.layout}>
      <aside style={s.sidebar}>
        <div style={s.logoWrap}>
          <img src={logo} alt="LearningSpace" style={s.logoImg}
            onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='block' }} />
          <span style={{ ...s.logoFallback, display:'none' }}>
            Learning<span style={{ color:'#FFD93D' }}>Space</span>
            <span style={s.logoUnderline} />
          </span>
          <p style={s.adminBadge}>Admin Panel</p>
        </div>
        <nav style={s.nav}>
          {adminMenuItems.map(item => (
            <div key={item.key} onClick={() => navigate(item.path)}
              style={{ ...s.menuItem, ...(activeKey === item.key ? s.menuActive : {}) }}>
              {activeKey === item.key && <div style={s.activeBar} />}
              <span style={{ ...s.menuIcon, color: activeKey === item.key ? '#fff' : 'rgba(255,255,255,0.75)' }}>{item.icon}</span>
              <span style={{ ...s.menuLabel, color: activeKey === item.key ? '#fff' : 'rgba(255,255,255,0.75)', fontWeight: activeKey === item.key ? 700 : 400 }}>{item.label}</span>
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

      <main style={s.main}>{children}</main>

      {rightPanel && (
        <aside style={s.rightPanel}>
          <div style={s.profileCard}>
            <div style={s.avatarWrap}>
              <img src={adminFoto || avatarDefault} alt="Avatar" style={s.avatar}
                onError={e => { e.target.src = avatarDefault }} />
            </div>
            <p style={s.profileName}>{adminName}</p>
            <p style={s.profileRole}>Admin</p>
            <button style={s.profileBtn} onClick={() => navigate('/profil')}>Profil</button>
          </div>
          <MiniCalendar />
        </aside>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        @keyframes fadeInUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </div>
  )
}

// ── DASHBOARD UTAMA ───────────────────────────────────────────
export default function AdminDashboard() {
  const [summary,  setSummary]  = useState({ totalUser:0, totalKelas:0, totalMateri:0, totalZoom:0 })
  const [diagAkt,  setDiagAkt]  = useState([])
  const [diagKelas,setDiagKelas]= useState([])
  const [range,    setRange]    = useState(7)
  const [loadSum,  setLoadSum]  = useState(true)
  const [loadAkt,  setLoadAkt]  = useState(true)
  const [loadKelas,setLoadKelas]= useState(true)

  const noCache = { headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' } }

  const fetchDiagram = useCallback((currentRange) => {
    const ts = Date.now()
    api.get('/admin/diagram/aktivitas', { params: { range: currentRange, _t: ts }, ...noCache })
      .then(r => setDiagAkt(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoadAkt(false))

    api.get('/admin/diagram/kelas', { params: { _t: ts }, ...noCache })
      .then(r => setDiagKelas(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoadKelas(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchSemua = useCallback((currentRange) => {
    const ts = Date.now()
    setLoadAkt(true)
    setLoadKelas(true)
    setLoadSum(true)

    api.get('/admin/summary', { params: { _t: ts }, ...noCache })
      .then(r => setSummary(r.data.summary))
      .catch(() => {})
      .finally(() => setLoadSum(false))

    fetchDiagram(currentRange)
  }, [fetchDiagram]) // eslint-disable-line react-hooks/exhaustive-deps

  // Load saat pertama mount
  useEffect(() => {
    fetchSemua(range)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Re-fetch diagram saat range berubah
  useEffect(() => {
    setLoadAkt(true)
    fetchDiagram(range)
  }, [range]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-refresh diagram dan summary setiap 10 detik — tanpa loading spinner supaya tidak kedip
  useEffect(() => {
    const interval = setInterval(() => {
      const ts = Date.now()
      api.get('/admin/diagram/aktivitas', { params: { range, _t: ts }, ...noCache })
        .then(r => setDiagAkt(r.data.data || []))
        .catch(() => {})
      api.get('/admin/diagram/kelas', { params: { _t: ts }, ...noCache })
        .then(r => setDiagKelas(r.data.data || []))
        .catch(() => {})
      api.get('/admin/summary', { params: { _t: ts }, ...noCache })
        .then(r => setSummary(r.data.summary))
        .catch(() => {})
    }, 10000)
    return () => clearInterval(interval)
  }, [range]) // eslint-disable-line react-hooks/exhaustive-deps

  const cards = [
    { label:'Total User',         value: summary.totalUser,   color:'#0066FF', icon:'👤' },
    { label:'Total Kelas',        value: summary.totalKelas,  color:'#FFD93D', icon:'📚' },
    { label:'Total Materi',       value: summary.totalMateri, color:'#22c55e', icon:'📄' },
    { label:'Total Zoom Meeting', value: summary.totalZoom,   color:'#ef4444', icon:'🎥' },
  ]

  const rangeOptions = [
    { label:'7 Hari',  value:7  },
    { label:'30 Hari', value:30 },
    { label:'90 Hari', value:90 },
  ]

  return (
    <AdminLayout activeKey="ringkasan">
      <h1 style={s.pageTitle}>Dashboard Admin</h1>
      <p style={s.pageDesc}>Selamat datang kembali, kelola seluruh data LearningSpace di sini.</p>

      {/* ── Stat Cards ── */}
      <div style={s.cardGrid}>
        {cards.map(c => (
          <div key={c.label} style={s.statCard}>
            <div style={{ ...s.statBar, backgroundColor: c.color }} />
            <div style={{ marginLeft:8 }}>
              <p style={s.statValue}>{loadSum ? '...' : c.value}</p>
              <p style={s.statLabel}>{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Diagram row ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:24 }}>

        {/* Diagram Batang */}
        <div style={s.chartCard}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:8 }}>
            <div>
              <h3 style={{ fontWeight:800, fontSize:'1rem', color:'#111' }}>Aktivitas Belajar</h3>
              <p style={{ color:'#888', fontSize:'0.78rem', marginTop:2 }}>Frekuensi tiap jenis aktivitas</p>
            </div>
            {/* Range selector + Refresh */}
            <div style={{ display:'flex', gap:4, alignItems:'center' }}>
              {rangeOptions.map(opt => (
                <button key={opt.value} onClick={() => setRange(opt.value)}
                  style={{ padding:'5px 12px', borderRadius:8, border:'1.5px solid', borderColor: range===opt.value ? '#0066FF' : '#e5e7eb', backgroundColor: range===opt.value ? '#0066FF' : '#fff', color: range===opt.value ? '#fff' : '#555', fontSize:'0.75rem', fontWeight:700, cursor:'pointer', fontFamily:"'Poppins',sans-serif" }}>
                  {opt.label}
                </button>
              ))}
              <button onClick={() => fetchSemua(range)} title="Refresh data"
                style={{ width:32, height:32, borderRadius:8, border:'1.5px solid #e5e7eb', backgroundColor:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', marginLeft:4 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10"/>
                  <polyline points="1 20 1 14 7 14"/>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                </svg>
              </button>
            </div>
          </div>
          <DiagramBatang data={diagAkt} loading={loadAkt} range={range} onRangeChange={setRange} />
        </div>

        {/* Diagram Donat */}
        <div style={s.chartCard}>
          <div style={{ marginBottom:16 }}>
            <h3 style={{ fontWeight:800, fontSize:'1rem', color:'#111' }}>Kelas Terbanyak Dipelajari</h3>
            <p style={{ color:'#888', fontSize:'0.78rem', marginTop:2 }}>Berdasarkan seluruh riwayat belajar</p>
          </div>
          <DiagramDonat data={diagKelas} loading={loadKelas} />
        </div>
      </div>

      {/* ── Log Aktivitas ── */}
      <LogAktivitas />

      <style>{`@keyframes fadeInUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </AdminLayout>
  )
}

// ── STYLES ────────────────────────────────────────────────────
const s = {
  layout:      { display:'flex', minHeight:'100vh', fontFamily:"'Poppins',sans-serif", backgroundColor:'#f4f6fb' },
  sidebar:     { width:'260px', flexShrink:0, backgroundColor:'#0066FF', display:'flex', flexDirection:'column', padding:'28px 0', position:'sticky', top:0, height:'100vh', overflowY:'auto' },
  logoWrap:    { padding:'0 24px 24px' },
  logoImg:     { height:'36px', objectFit:'contain' },
  logoFallback:{ fontSize:'1.3rem', fontWeight:800, color:'#fff', position:'relative', display:'inline-block' },
  logoUnderline:{ display:'block', height:'3px', backgroundColor:'#FFD93D', borderRadius:'2px', marginTop:'2px' },
  adminBadge:  { color:'rgba(255,255,255,0.65)', fontSize:'0.75rem', fontWeight:600, letterSpacing:'0.5px', marginTop:'8px' },
  nav:         { flex:1, display:'flex', flexDirection:'column', gap:'4px', padding:'0 12px' },
  menuItem:    { display:'flex', alignItems:'center', gap:'12px', padding:'12px 16px', borderRadius:'12px', cursor:'pointer', position:'relative', transition:'background 0.2s' },
  menuActive:  { backgroundColor:'rgba(255,255,255,0.18)' },
  activeBar:   { position:'absolute', left:0, top:'50%', transform:'translateY(-50%)', width:'4px', height:'60%', backgroundColor:'#fff', borderRadius:'0 4px 4px 0' },
  menuIcon:    { flexShrink:0 },
  menuLabel:   { fontSize:'0.88rem' },
  keluarWrap:  { padding:'16px 24px 0' },
  keluarBtn:   { display:'flex', alignItems:'center', gap:'12px', padding:'12px 16px', borderRadius:'12px', cursor:'pointer' },
  keluarLabel: { color:'#ff4d4d', fontWeight:600, fontSize:'0.92rem' },

  main:        { flex:1, padding:'36px 32px', overflowY:'auto', animation:'fadeInUp 0.5s ease both', minWidth:0 },
  pageTitle:   { fontSize:'2.2rem', fontWeight:800, color:'#111', marginBottom:'8px' },
  pageDesc:    { color:'#666', fontSize:'0.95rem', lineHeight:1.6, marginBottom:'28px' },

  cardGrid:    { display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'16px', marginBottom:24 },
  statCard:    { backgroundColor:'#fff', borderRadius:'16px', padding:'20px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', position:'relative', overflow:'hidden', display:'flex', alignItems:'center', gap:4 },
  statBar:     { position:'absolute', top:0, left:0, width:'6px', height:'100%' },
  statValue:   { fontSize:'2rem', fontWeight:800, color:'#111' },
  statLabel:   { fontSize:'0.85rem', color:'#666', marginTop:'4px' },

  chartCard:   { backgroundColor:'#fff', borderRadius:16, padding:24, boxShadow:'0 2px 12px rgba(0,0,0,0.06)' },

  rightPanel:  { width:'280px', flexShrink:0, padding:'36px 20px', display:'flex', flexDirection:'column', gap:'20px', position:'sticky', top:0, height:'100vh', overflowY:'auto' },
  profileCard: { backgroundColor:'#fff', borderRadius:'16px', padding:'24px 16px', textAlign:'center', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' },
  avatarWrap:  { width:'90px', height:'90px', borderRadius:'50%', overflow:'hidden', margin:'0 auto 12px', backgroundColor:'#e5e7eb', display:'flex', alignItems:'center', justifyContent:'center' },
  avatar:      { width:'100%', height:'100%', objectFit:'cover' },
  profileName: { fontWeight:700, fontSize:'1rem', color:'#111', marginBottom:'4px' },
  profileRole: { color:'#888', fontSize:'0.85rem', marginBottom:'16px' },
  profileBtn:  { border:'2px solid #0066FF', color:'#0066FF', backgroundColor:'transparent', borderRadius:'20px', padding:'6px 28px', fontWeight:700, fontSize:'0.9rem', cursor:'pointer', fontFamily:"'Poppins',sans-serif" },
}