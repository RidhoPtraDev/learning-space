import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import avatarDefault from '../assets/avatar-default.png'
import ilustrasiReminder from '../assets/ilustrasi-reminder.png' 

// ── ICONS ────────────────────────────────────────────────────
function IconKelas() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg> }
function IconRiwayat() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> }
function IconFavorit() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> }
function IconZoom() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg> }
function IconAnalitik() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> }
function IconKeluar() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> }
function IconCal() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> }
function IconClock() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> }
function IconBell() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> }
function IconPlus() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> }

// Jenis aktivitas dengan warna & icon
function JenisIcon({ jenis }) {
  if (jenis === 'baca') return (
    <div style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: '#FFF8E7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
    </div>
  )
  if (jenis === 'video') return (
    <div style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: '#EBF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#0066FF"><polygon points="6 4 20 12 6 20 6 4"/></svg>
    </div>
  )
  if (jenis === 'zoom') return (
    <div style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9333EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
    </div>
  )
  return null
}

const menuItems = [
  { key: 'kelas',   label: 'Kelas Pembelajaran', path: '/dashboard',  icon: <IconKelas /> },
  { key: 'riwayat', label: 'Riwayat Belajar',    path: '/riwayat',    icon: <IconRiwayat /> },
  { key: 'favorit', label: 'Kelas Favorit',       path: '/favorit',    icon: <IconFavorit /> },
  { key: 'zoom',    label: 'Kelas Zoom Meeting',  path: '/zoom',       icon: <IconZoom /> },
  { key: 'analitik',label: 'Analitik Progress',   path: '/analitik',   icon: <IconAnalitik /> },
]

// ── MINI CALENDAR ─────────────────────────────────────────────
function MiniCalendar({ reminders }) {
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
  const hasReminder = d => reminders.some(r => {
    const rd = new Date(r.tanggal)
    return rd.getDate() === d && rd.getMonth() === current.month && rd.getFullYear() === current.year
  })

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
          <div key={i} style={{
            ...cal.day,
            ...(d && isToday(d) ? cal.today : {}),
            position: 'relative',
          }}>
            {d || ''}
            {d && hasReminder(d) && !isToday(d) && (
              <div style={{ position: 'absolute', bottom: 1, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
            )}
          </div>
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
  day: { fontSize: '0.8rem', color: '#444', padding: '5px 2px', borderRadius: '6px', position: 'relative' },
  today: { color: '#fff', backgroundColor: '#0066FF', fontWeight: 700 },
}

// ── MAIN ─────────────────────────────────────────────────────
export default function Reminder() {
  const navigate = useNavigate()
  const [activeMenu, setActiveMenu] = useState('kelas')
  const userName = 'Alihudin'

  // State reminder
  const [reminders, setReminders] = useState([
    { id: 1, judul: 'Fisika - Hukum Newton',    sub: 'Belajar Materi',       jenis: 'baca',  jam: '15.00', tanggal: new Date().toISOString().slice(0,10), status: 'akan' },
    { id: 2, judul: 'Kimia - Struktur Atom',    sub: 'Menonton Video Materi', jenis: 'video', jam: '18.30', tanggal: new Date().toISOString().slice(0,10), status: 'akan' },
    { id: 3, judul: 'Matematika - Fungsi',      sub: 'Zoom Meeting',         jenis: 'zoom',  jam: '19.30', tanggal: new Date().toISOString().slice(0,10), status: 'akan' },
    { id: 4, judul: 'Fisika - Vektor',          sub: 'Belajar Materi',       jenis: 'baca',  jam: '09.00', tanggal: '2026-07-02', status: 'mendatang' },
    { id: 5, judul: 'Kimia - Pengantar Kimia',  sub: 'Menonton Video Materi', jenis: 'video', jam: '10.30', tanggal: '2026-07-15', status: 'mendatang' },
    { id: 6, judul: 'Matematika - Geometri',    sub: 'Zoom Meeting',         jenis: 'zoom',  jam: '14.30', tanggal: '2026-08-16', status: 'mendatang' },
  ])

  const today = new Date().toISOString().slice(0,10)
  const hariIni = reminders.filter(r => r.tanggal === today)
  const mendatang = reminders.filter(r => r.tanggal !== today)

  // Form tambah reminder
  const [form, setForm] = useState({ judul: '', kategori: '', tanggal: '', jam: '' })
  const [notifBefore, setNotifBefore] = useState('30 Menit Sebelumnya')
  const [notifActive, setNotifActive] = useState(true)
  const [showLihatSemua, setShowLihatSemua] = useState({ hariIni: false, mendatang: false })

  const handleSimpan = () => {
    if (!form.judul || !form.tanggal || !form.jam) return
    const isToday = form.tanggal === today
    setReminders(prev => [...prev, {
      id: Date.now(),
      judul: form.judul,
      sub: form.kategori || 'Belajar Materi',
      jenis: form.kategori === 'Zoom Meeting' ? 'zoom' : form.kategori === 'Menonton Video Materi' ? 'video' : 'baca',
      jam: form.jam,
      tanggal: form.tanggal,
      status: isToday ? 'akan' : 'mendatang',
    }])
    setForm({ judul: '', kategori: '', tanggal: '', jam: '' })
  }

  const handleReset = () => setForm({ judul: '', kategori: '', tanggal: '', jam: '' })

  const handleHapus = (id) => setReminders(prev => prev.filter(r => r.id !== id))

  // Reminder kecil di right panel (3 terbaru)
  const rightReminders = [...reminders]
    .sort((a, b) => new Date(a.tanggal + 'T' + a.jam.replace('.', ':')) - new Date(b.tanggal + 'T' + b.jam.replace('.', ':')))
    .slice(0, 3)

  const formatTanggal = (tgl) => {
    const d = new Date(tgl)
    const bulan = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']
    return `${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`
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
            <h1 style={s.pageTitle}>Reminder</h1>
            <p style={s.pageDesc}>Atur jadwal beljarmu dan jangan sampai terlewat!</p>
          </div>
          <img src={ilustrasiReminder} alt="ilustrasi"
            style={{ width: 160, objectFit: 'contain', flexShrink: 0 }}
            onError={e => e.target.style.display = 'none'} />
        </div>

        {/* ── HARI INI ── */}
        <div style={s.card}>
          <div style={s.cardHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#0066FF' }}><IconCal /></span>
              <h3 style={s.cardTitle}>Hari Ini</h3>
            </div>
            <button style={s.lihatSemua} onClick={() => setShowLihatSemua(p => ({ ...p, hariIni: !p.hariIni }))}>
              {showLihatSemua.hariIni ? 'Sembunyikan' : 'Lihat Semua'}
            </button>
          </div>
          {(showLihatSemua.hariIni ? hariIni : hariIni.slice(0, 3)).length === 0 ? (
            <p style={{ color: '#aaa', fontSize: '0.88rem', padding: '12px 0' }}>Tidak ada jadwal hari ini.</p>
          ) : (
            <div style={s.reminderList}>
              {(showLihatSemua.hariIni ? hariIni : hariIni.slice(0, 3)).map(r => (
                <div key={r.id} style={s.reminderItem}>
                  <JenisIcon jenis={r.jenis} />
                  <div style={{ flex: 1 }}>
                    <p style={s.reminderJudul}>{r.judul}</p>
                    <p style={s.reminderSub}>{r.sub}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <IconClock />
                    <span style={{ fontSize: '0.85rem', color: '#555' }}>{r.jam}</span>
                  </div>
                  <div style={s.badgeAkan}>Akan Datang</div>
                  <button style={s.hapusBtn} onClick={() => handleHapus(r.id)} title="Hapus reminder">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── MENDATANG ── */}
        <div style={s.card}>
          <div style={s.cardHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#0066FF' }}><IconCal /></span>
              <h3 style={s.cardTitle}>Mendatang</h3>
            </div>
            <button style={s.lihatSemua} onClick={() => setShowLihatSemua(p => ({ ...p, mendatang: !p.mendatang }))}>
              {showLihatSemua.mendatang ? 'Sembunyikan' : 'Lihat Semua'}
            </button>
          </div>
          {(showLihatSemua.mendatang ? mendatang : mendatang.slice(0, 3)).length === 0 ? (
            <p style={{ color: '#aaa', fontSize: '0.88rem', padding: '12px 0' }}>Tidak ada jadwal mendatang.</p>
          ) : (
            <div style={s.reminderList}>
              {(showLihatSemua.mendatang ? mendatang : mendatang.slice(0, 3)).map(r => (
                <div key={r.id} style={s.reminderItem}>
                  <JenisIcon jenis={r.jenis} />
                  <div style={{ flex: 1 }}>
                    <p style={s.reminderJudul}>{r.judul}</p>
                    <p style={s.reminderSub}>{r.sub}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <IconClock />
                    <span style={{ fontSize: '0.85rem', color: '#555' }}>{r.jam}</span>
                  </div>
                  <div style={s.badgeTanggal}>{formatTanggal(r.tanggal)}</div>
                  <button style={s.hapusBtn} onClick={() => handleHapus(r.id)} title="Hapus reminder">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── TAMBAH REMINDER ── */}
        <div style={s.card}>
          <div style={s.cardHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: '#FFF8E7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconPlus />
              </div>
              <h3 style={s.cardTitle}>Tambah Reminder</h3>
            </div>
          </div>
          <div style={s.formGrid}>
            {/* Judul */}
            <div style={s.fieldGroup}>
              <label style={s.label}>Judul</label>
              <div style={s.selectWrap}>
                <select value={form.judul} onChange={e => setForm({ ...form, judul: e.target.value })} style={s.select}>
                  <option value="">Contoh: Belajar Materi</option>
                  <option>Fisika - Vektor</option>
                  <option>Fisika - Hukum Newton</option>
                  <option>Kimia - Struktur Atom</option>
                  <option>Kimia - Pengantar Kimia</option>
                  <option>Matematika - Aljabar Dasar</option>
                  <option>Matematika - Geometri</option>
                  <option>Sejarah Indonesia - Kemerdekaan</option>
                  <option>Bahasa Indonesia - Menulis Esai</option>
                  <option>Komputer - Pemrograman Dasar</option>
                </select>
                <ChevronDown />
              </div>
            </div>

            {/* Kategori */}
            <div style={s.fieldGroup}>
              <label style={s.label}>Kategori</label>
              <div style={s.selectWrap}>
                <select value={form.kategori} onChange={e => setForm({ ...form, kategori: e.target.value })} style={s.select}>
                  <option value="">Pilih Kategori</option>
                  <option>Belajar Materi</option>
                  <option>Menonton Video Materi</option>
                  <option>Zoom Meeting</option>
                </select>
                <ChevronDown />
              </div>
            </div>

            {/* Tanggal */}
            <div style={s.fieldGroup}>
              <label style={s.label}>Tanggal</label>
              <input type="date" value={form.tanggal} onChange={e => setForm({ ...form, tanggal: e.target.value })}
                style={s.input} placeholder="dd/mm/yyyy" />
            </div>

            {/* Jam */}
            <div style={s.fieldGroup}>
              <label style={s.label}>Jam</label>
              <input type="time" value={form.jam} onChange={e => setForm({ ...form, jam: e.target.value })}
                style={s.input} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button style={s.btnReset} onClick={handleReset}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e5e7eb'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            >Reset Perubahan</button>
            <button style={s.btnSimpan} onClick={handleSimpan}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#0055dd'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#0066FF'}
            >Simpan Perubahan</button>
          </div>
        </div>

        {/* ── PENGATURAN NOTIFIKASI ── */}
        <div style={{ ...s.card, marginBottom: 40 }}>
          <h3 style={{ ...s.cardTitle, marginBottom: 20 }}>Pengaturan Notifikasi</h3>
          <div style={s.notifRow}>
            <span style={s.notifLabel}>Ingatkan saya sebelum waktu mulai</span>
            <div style={s.selectWrap}>
              <select value={notifBefore} onChange={e => setNotifBefore(e.target.value)} style={{ ...s.select, minWidth: 200 }}>
                <option>5 Menit Sebelumnya</option>
                <option>10 Menit Sebelumnya</option>
                <option>15 Menit Sebelumnya</option>
                <option>30 Menit Sebelumnya</option>
                <option>1 Jam Sebelumnya</option>
              </select>
              <ChevronDown />
            </div>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', margin: '14px 0' }} />
          <div style={s.notifRow}>
            <span style={s.notifLabel}>Aktifkan notifikasi reminder</span>
            <div style={{ ...s.toggle, backgroundColor: notifActive ? '#0066FF' : '#d1d5db' }}
              onClick={() => setNotifActive(!notifActive)}>
              <div style={{ ...s.toggleThumb, transform: notifActive ? 'translateX(22px)' : 'translateX(2px)' }} />
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

        <MiniCalendar reminders={reminders} />

        {/* Reminder mini */}
        <div style={s.reminderMini}>
          <h4 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111', marginBottom: 14 }}>Reminder</h4>
          {rightReminders.map(r => (
            <div key={r.id} style={s.reminderMiniItem}>
              <div style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: '#FFF8E7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <IconBell />
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111', marginBottom: 1 }}>{r.judul}</p>
                <p style={{ fontSize: '0.72rem', color: '#888' }}>{formatTanggal(r.tanggal)} - {r.jam} WIB</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        @keyframes fadeInUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        select { -webkit-appearance: none; appearance: none; }
        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator { cursor: pointer; opacity: 0.6; }
      `}</style>
    </div>
  )
}

function ChevronDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  )
}

// ── STYLES ────────────────────────────────────────────────────
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
  cardHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  cardTitle: { fontSize: '1rem', fontWeight: 700, color: '#111' },
  lihatSemua: { background: 'none', border: 'none', color: '#0066FF', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', fontFamily: "'Poppins',sans-serif" },

  reminderList: { display: 'flex', flexDirection: 'column', gap: 10 },
  reminderItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, border: '1.5px solid #f0f0f0', backgroundColor: '#fafafa', transition: 'background 0.15s' },
  reminderJudul: { fontSize: '0.9rem', fontWeight: 600, color: '#111', marginBottom: 2 },
  reminderSub: { fontSize: '0.78rem', color: '#888' },
  badgeAkan: { backgroundColor: '#EBF2FF', color: '#0066FF', borderRadius: 20, padding: '4px 14px', fontSize: '0.78rem', fontWeight: 600, whiteSpace: 'nowrap' },
  badgeTanggal: { backgroundColor: '#0066FF', color: '#fff', borderRadius: 20, padding: '4px 14px', fontSize: '0.78rem', fontWeight: 600, whiteSpace: 'nowrap' },
  hapusBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', fontSize: '0.85rem', padding: '2px 6px', borderRadius: 4, transition: 'color 0.15s' },

  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: '0.82rem', fontWeight: 600, color: '#333' },
  selectWrap: { position: 'relative' },
  select: { width: '100%', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '10px 32px 10px 12px', fontSize: '0.85rem', outline: 'none', fontFamily: "'Poppins',sans-serif", color: '#333', backgroundColor: '#fff', cursor: 'pointer' },
  input: { border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '10px 12px', fontSize: '0.85rem', outline: 'none', fontFamily: "'Poppins',sans-serif", color: '#333', backgroundColor: '#fff', width: '100%' },
  btnReset: { padding: '10px 24px', backgroundColor: '#f3f4f6', color: '#555', border: '1.5px solid #e5e7eb', borderRadius: 10, fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', fontFamily: "'Poppins',sans-serif", transition: 'background 0.15s' },
  btnSimpan: { padding: '10px 24px', backgroundColor: '#0066FF', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', fontFamily: "'Poppins',sans-serif", transition: 'background 0.15s' },

  notifRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  notifLabel: { fontSize: '0.9rem', color: '#333', fontWeight: 500 },
  toggle: { width: 46, height: 26, borderRadius: 13, cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 },
  toggleThumb: { position: 'absolute', top: 3, width: 20, height: 20, borderRadius: '50%', backgroundColor: '#fff', transition: 'transform 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' },

  rightPanel: { width: '260px', flexShrink: 0, padding: '32px 18px', display: 'flex', flexDirection: 'column', gap: 18 },
  profileCard: { backgroundColor: '#fff', borderRadius: 16, padding: '22px 14px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  avatarWrap: { width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 10px', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  avatar: { width: '100%', height: '100%', objectFit: 'cover' },
  avatarFallback: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e5e7eb' },
  profileName: { fontWeight: 700, fontSize: '1rem', color: '#111', marginBottom: 2 },
  profileRole: { color: '#888', fontSize: '0.82rem', marginBottom: 14 },
  profileBtn: { border: '2px solid #0066FF', color: '#0066FF', backgroundColor: 'transparent', borderRadius: 20, padding: '5px 24px', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', fontFamily: "'Poppins',sans-serif" },

  reminderMini: { backgroundColor: '#fff', borderRadius: 16, padding: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  reminderMiniItem: { display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 },
}
