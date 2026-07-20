import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import avatarDefault from '../assets/avatar-default.png'
import ilustrasiAnalitik from '../assets/ilustrasi-analitik.png'

function IconKelas() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg> }
function IconRiwayat() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> }
function IconFavorit() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> }
function IconZoom() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg> }
function IconAnalitik() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> }
function IconKeluar() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> }
function IconBell() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> }
function IconClock2() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> }
function IconBook2() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9333EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> }

const menuItems = [
  { key: 'kelas',    label: 'Kelas Pembelajaran', path: '/dashboard', icon: <IconKelas /> },
  { key: 'riwayat',  label: 'Riwayat Belajar',    path: '/riwayat',   icon: <IconRiwayat /> },
  { key: 'favorit',  label: 'Kelas Favorit',       path: '/favorit',   icon: <IconFavorit /> },
  { key: 'zoom',     label: 'Kelas Zoom Meeting',  path: '/zoom',      icon: <IconZoom /> },
  { key: 'analitik', label: 'Analitik Progress',   path: '/analitik',  icon: <IconAnalitik /> },
]

// Data grafik per range
const dataGrafik = {
  '7': [
    { hari: 'Sen', tgl: '15 Juli', jam: 1.5 },
    { hari: 'Sel', tgl: '16 Juli', jam: 2.5 },
    { hari: 'Rab', tgl: '17 Juli', jam: 4.0 },
    { hari: 'Kam', tgl: '18 Juli', jam: 3.0 },
    { hari: 'Jum', tgl: '19 Juli', jam: 3.5 },
    { hari: 'Sab', tgl: '20 Juli', jam: 1.5 },
    { hari: 'Min', tgl: '21 Juli', jam: 0.5 },
  ],
  '14': [
    { hari: 'Sen', tgl: '8 Juli',  jam: 1.0 },
    { hari: 'Sel', tgl: '9 Juli',  jam: 2.0 },
    { hari: 'Rab', tgl: '10 Juli', jam: 3.0 },
    { hari: 'Kam', tgl: '11 Juli', jam: 1.5 },
    { hari: 'Jum', tgl: '12 Juli', jam: 2.5 },
    { hari: 'Sab', tgl: '13 Juli', jam: 0.5 },
    { hari: 'Min', tgl: '14 Juli', jam: 1.0 },
    { hari: 'Sen', tgl: '15 Juli', jam: 1.5 },
    { hari: 'Sel', tgl: '16 Juli', jam: 2.5 },
    { hari: 'Rab', tgl: '17 Juli', jam: 4.0 },
    { hari: 'Kam', tgl: '18 Juli', jam: 3.0 },
    { hari: 'Jum', tgl: '19 Juli', jam: 3.5 },
    { hari: 'Sab', tgl: '20 Juli', jam: 1.5 },
    { hari: 'Min', tgl: '21 Juli', jam: 0.5 },
  ],
  '30': [
    { hari: 'M1', tgl: 'Juni W1', jam: 8.0 },
    { hari: 'M2', tgl: 'Juni W2', jam: 12.0 },
    { hari: 'M3', tgl: 'Juni W3', jam: 10.0 },
    { hari: 'M4', tgl: 'Juni W4', jam: 15.0 },
    { hari: 'M5', tgl: 'Juli W1', jam: 9.0 },
    { hari: 'M6', tgl: 'Juli W2', jam: 18.5 },
  ],
}

const donutData = [
  { label: 'Fisika',     pct: 40, color: '#0066FF' },
  { label: 'Matematika', pct: 25, color: '#22C55E' },
  { label: 'Kimia',      pct: 20, color: '#F59E0B' },
  { label: 'Lainnya',    pct: 15, color: '#9333EA' },
]

// ── DONUT CHART SVG ───────────────────────────────────────────
function DonutChart({ data }) {
  const r = 70, cx = 90, cy = 90, stroke = 40
  const circ = 2 * Math.PI * r
  let offset = 0
  const slices = data.map(d => {
    const dash = (d.pct / 100) * circ
    const gap = circ - dash
    const s = { dasharray: `${dash} ${gap}`, offset, color: d.color }
    offset += dash
    return s
  })
  return (
    <svg width="180" height="180" viewBox="0 0 180 180">
      {slices.map((sl, i) => (
        <circle key={i} cx={cx} cy={cy} r={r}
          fill="none" stroke={sl.color} strokeWidth={stroke}
          strokeDasharray={sl.dasharray}
          strokeDashoffset={-sl.offset}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
      ))}
      <circle cx={cx} cy={cy} r={r - stroke / 2 - 2} fill="#fff" />
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="13" fontWeight="700" fill="#111" fontFamily="Poppins, sans-serif">Total</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="11" fill="#888" fontFamily="Poppins, sans-serif">16.5 jam</text>
    </svg>
  )
}

// ── BAR CHART ────────────────────────────────────────────────
function BarChart({ data }) {
  const maxJam = Math.max(...data.map(d => d.jam), 4)
  const H = 160, W_BAR = Math.min(40, Math.floor(480 / data.length) - 8)
  return (
    <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
      <svg width={Math.max(480, data.length * (W_BAR + 12) + 60)} height={H + 60} style={{ fontFamily: 'Poppins, sans-serif' }}>
        {/* Y axis labels */}
        {[0,1,2,3,4].filter(v => v <= Math.ceil(maxJam)).map(v => (
          <g key={v}>
            <text x="32" y={H - (v / maxJam) * H + 4} textAnchor="end" fontSize="11" fill="#aaa">{v}</text>
            <line x1="38" y1={H - (v / maxJam) * H} x2={data.length * (W_BAR + 12) + 48} y2={H - (v / maxJam) * H} stroke="#f0f0f0" strokeWidth="1"/>
          </g>
        ))}
        <text x="16" y={H / 2} textAnchor="middle" fontSize="11" fill="#aaa" transform={`rotate(-90 16 ${H/2})`}>Jam</text>
        {/* Bars */}
        {data.map((d, i) => {
          const barH = (d.jam / maxJam) * H
          const x = 44 + i * (W_BAR + 12)
          return (
            <g key={i}>
              <rect x={x} y={H - barH} width={W_BAR} height={barH} rx="5" fill="#0066FF" opacity="0.9"/>
              <text x={x + W_BAR / 2} y={H - barH - 6} textAnchor="middle" fontSize="10" fontWeight="700" fill="#0066FF">{d.jam}j</text>
              <text x={x + W_BAR / 2} y={H + 18} textAnchor="middle" fontSize="11" fontWeight="600" fill="#444">{d.hari}</text>
              <text x={x + W_BAR / 2} y={H + 32} textAnchor="middle" fontSize="10" fill="#aaa">{d.tgl}</text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

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

// ── REMINDER MINI (reusable) ──────────────────────────────────
export function ReminderMini({ navigate }) {
  const reminders = [
    { judul: 'Kelas Matematika Dimulai',    tgl: '15 Mei 2026', jam: '08.00' },
    { judul: 'Zoom Meeting Kimia',           tgl: '15 Mei 2026', jam: '13.00' },
    { judul: 'Materi Bahasa Indonesia Baru', tgl: '16 Mei 2026', jam: '10.00' },
  ]
  return (
    <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', cursor: 'pointer' }}
      onClick={() => navigate('/reminder')}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <h4 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111' }}>Reminder</h4>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
      {reminders.map((r, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: i < reminders.length-1 ? 12 : 0 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: '#FFF8E7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
            <IconBell />
          </div>
          <div>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111', marginBottom: 1 }}>{r.judul}</p>
            <p style={{ fontSize: '0.72rem', color: '#888' }}>{r.tgl} - {r.jam} WIB</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── MAIN ─────────────────────────────────────────────────────
export default function AnalitikProgress() {
  const navigate = useNavigate()
  const [activeMenu, setActiveMenu] = useState('analitik')
  const [range, setRange] = useState('7')
  const [showRangeMenu, setShowRangeMenu] = useState(false)
  const grafik = dataGrafik[range]
  const totalJam = grafik.reduce((a, b) => a + b.jam, 0).toFixed(1)
  const userName = 'Alihudin'

  // Hitung dari riwayat localStorage
  const [statsRiwayat, setStatsRiwayat] = useState({ total: 0, video: 0, baca: 0 })
  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('riwayatBelajar') || '[]')
      setStatsRiwayat({
        total: data.length,
        video: data.filter(d => d.jenis === 'video').length,
        baca: data.filter(d => d.jenis === 'baca').length,
      })
    } catch {}
  }, [])

  const rangeLabel = { '7': '7 Hari Terakhir', '14': '14 Hari Terakhir', '30': '30 Hari Terakhir' }

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
            <h1 style={s.pageTitle}>Analitik Progress</h1>
            <p style={s.pageDesc}>Pantau perkembangan belajarmu setiap hari.</p>
          </div>
          <img src={ilustrasiAnalitik} alt="ilustrasi"
            style={{ width: 160, objectFit: 'contain', flexShrink: 0 }}
            onError={e => e.target.style.display = 'none'} />
        </div>

        {/* ── GRAFIK AKTIVITAS ── */}
        <div style={s.card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={s.cardTitle}>Aktivitas Belajar</h3>
            <div style={{ position: 'relative' }}>
              <button style={s.rangeBtn} onClick={() => setShowRangeMenu(!showRangeMenu)}>
                {rangeLabel[range]}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: showRangeMenu ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {showRangeMenu && (
                <div style={s.rangeDropdown}>
                  {Object.entries(rangeLabel).map(([k, v]) => (
                    <div key={k} style={{ ...s.rangeItem, backgroundColor: range === k ? '#EBF2FF' : '#fff', color: range === k ? '#0066FF' : '#333' }}
                      onClick={() => { setRange(k); setShowRangeMenu(false) }}>
                      {v}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <BarChart data={grafik} />
          <div style={{ display: 'flex', gap: 20, marginTop: 16 }}>
            <div style={s.statPill}><span style={{ color: '#0066FF', fontWeight: 700 }}>{totalJam}j</span> Total</div>
            <div style={s.statPill}><span style={{ color: '#22c55e', fontWeight: 700 }}>{statsRiwayat.video}</span> Video</div>
            <div style={s.statPill}><span style={{ color: '#F59E0B', fontWeight: 700 }}>{statsRiwayat.baca}</span> Materi Baca</div>
            <div style={s.statPill}><span style={{ color: '#9333EA', fontWeight: 700 }}>{statsRiwayat.total}</span> Total Akses</div>
          </div>
        </div>

        {/* ── BAWAH: DONUT + INSIGHT ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>

          {/* Donut */}
          <div style={s.card}>
            <h3 style={{ ...s.cardTitle, marginBottom: 16 }}>Mata Pelajaran Terbanyak Dipelajari</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <DonutChart data={donutData} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {donutData.map(d => (
                  <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: d.color, flexShrink: 0 }} />
                    <span style={{ fontSize: '0.85rem', color: '#333', flex: 1 }}>{d.label}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#333' }}>{d.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Insight */}
          <div style={s.card}>
            <h3 style={{ ...s.cardTitle, marginBottom: 16 }}>Insight Belajarmu</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={s.insightItem}>
                <div style={s.insightIcon}><IconClock2 /></div>
                <p style={s.insightText}>Kamu paling sering belajar<br/><strong>Pada Pukul 19.00 - 21.00</strong></p>
              </div>
              <div style={s.insightItem}>
                <div style={s.insightIcon}><IconBook2 /></div>
                <p style={s.insightText}><strong>Fisika</strong> merupakan materi yang paling banyak dipelajari.</p>
              </div>
              <div style={s.insightItem}>
                <div style={{ ...s.insightIcon, backgroundColor: '#F0FFF4' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                </div>
                <p style={s.insightText}>Kamu sudah belajar <strong>{totalJam} jam</strong> dalam {rangeLabel[range].toLowerCase()}.</p>
              </div>
            </div>
          </div>
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
        <ReminderMini navigate={navigate} />
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
  layout: { display: 'flex', minHeight: '100vh', fontFamily: "'Poppins',sans-serif", backgroundColor: '#f4f6fb' },
  sidebar: { width: '240px', flexShrink: 0, backgroundColor: '#0066FF', display: 'flex', flexDirection: 'column', padding: '28px 0', position: 'sticky', top: 0, height: '100vh' },
  logoWrap: { padding: '0 20px 32px', cursor: 'pointer' },
  logoImg: { height: '34px', objectFit: 'contain' },
  logoFallback: { fontSize: '1.2rem', fontWeight: 800, color: '#fff', display: 'inline-block' },
  logoUnderline: { display: 'block', height: '3px', backgroundColor: '#FFD93D', borderRadius: '2px', marginTop: '2px' },
  nav: { flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 10px' },
  menuItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '12px', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' },
  menuActive: { backgroundColor: 'rgba(255,255,255,0.18)' },
  activeBar: { position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: '4px', height: '60%', backgroundColor: '#fff', borderRadius: '0 4px 4px 0' },
  menuIcon: { flexShrink: 0 },
  menuLabel: { fontSize: '0.88rem' },
  keluarWrap: { padding: '16px 20px 0' },
  keluarBtn: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '12px', cursor: 'pointer' },
  keluarLabel: { color: '#ff4d4d', fontWeight: 600, fontSize: '0.88rem' },
  main: { flex: 1, padding: '32px 28px', overflowY: 'auto', animation: 'fadeInUp 0.5s ease both' },
  headerRow: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 },
  backBtn: { display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px 10px', borderRadius: 8, marginBottom: 12, transition: 'background 0.15s', fontFamily: "'Poppins',sans-serif" },
  backLabel: { fontSize: '0.95rem', fontWeight: 600, color: '#333' },
  pageTitle: { fontSize: '2rem', fontWeight: 800, color: '#111', marginBottom: 6 },
  pageDesc: { color: '#666', fontSize: '0.9rem' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: '20px 24px', marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' },
  cardTitle: { fontSize: '1rem', fontWeight: 700, color: '#111' },
  rangeBtn: { display: 'flex', alignItems: 'center', gap: 6, border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '7px 14px', fontSize: '0.82rem', fontWeight: 600, color: '#333', cursor: 'pointer', backgroundColor: '#fff', fontFamily: "'Poppins',sans-serif" },
  rangeDropdown: { position: 'absolute', top: 40, right: 0, backgroundColor: '#fff', borderRadius: 10, boxShadow: '0 6px 24px rgba(0,0,0,0.1)', border: '1px solid #f0f0f0', zIndex: 10, overflow: 'hidden', minWidth: 180 },
  rangeItem: { padding: '10px 16px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 500 },
  statPill: { backgroundColor: '#f8f9fa', borderRadius: 20, padding: '5px 14px', fontSize: '0.82rem', color: '#555', display: 'flex', alignItems: 'center', gap: 5 },
  insightItem: { display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px', borderRadius: 12, backgroundColor: '#fafafa', border: '1px solid #f0f0f0' },
  insightIcon: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#EBF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  insightText: { fontSize: '0.85rem', color: '#555', lineHeight: 1.5 },
  rightPanel: { width: '260px', flexShrink: 0, padding: '32px 18px', display: 'flex', flexDirection: 'column', gap: 18 },
  profileCard: { backgroundColor: '#fff', borderRadius: 16, padding: '22px 14px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  avatarWrap: { width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 10px', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  avatar: { width: '100%', height: '100%', objectFit: 'cover' },
  avatarFallback: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e5e7eb' },
  profileName: { fontWeight: 700, fontSize: '1rem', color: '#111', marginBottom: 2 },
  profileRole: { color: '#888', fontSize: '0.82rem', marginBottom: 14 },
  profileBtn: { border: '2px solid #0066FF', color: '#0066FF', backgroundColor: 'transparent', borderRadius: 20, padding: '5px 24px', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', fontFamily: "'Poppins',sans-serif" },
}
