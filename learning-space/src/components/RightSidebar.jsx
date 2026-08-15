import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import avatarDefault from '../assets/avatar-default.png'

// ── ICONS ────────────────────────────────────────────────────
function IconBell() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

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

import api from '../api/axios'

export default function RightSidebar() {
  const navigate = useNavigate()
  const [reminders, setReminders] = useState([])
  
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
  const fetchReminders = async () => {
    try {
      const res = await api.get('/reminder')
      setReminders(res.data.reminders || [])
    } catch (err) {
      console.error('Gagal memuat reminder di sidebar:', err)
    }
  }

  useEffect(() => {
    fetchReminders()

    // Custom event listener untuk sinkronisasi di satu tab
    window.addEventListener('reminders_updated', fetchReminders)

    return () => {
      window.removeEventListener('reminders_updated', fetchReminders)
    }
  }, [])

  // Urutkan berdasarkan waktu terdekat dan ambil 3 saja
  const rightReminders = [...reminders]
    .sort((a, b) => new Date(a.tanggal + 'T' + a.jam.replace('.', ':')) - new Date(b.tanggal + 'T' + b.jam.replace('.', ':')))
    .slice(0, 3)

  const formatTanggal = (tgl) => {
    const d = new Date(tgl)
    const bulan = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']
    return `${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`
  }

  return (
    <aside style={s.rightPanel}>
      {/* Profile Card */}
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

      {/* Mini Calendar */}
      <MiniCalendar reminders={reminders} />

      {/* Reminder Mini */}
      <div style={s.reminderMini}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h4 style={s.cardTitle}>Reminder</h4>
          <button onClick={() => navigate('/reminder')} style={s.arrowBtn} title="Lihat semua reminder">
            ›
          </button>
        </div>
        {rightReminders.length === 0 ? (
          <p style={{ color: '#aaa', fontSize: '0.78rem', textAlign: 'center', padding: '10px 0' }}>Tidak ada reminder</p>
        ) : (
          rightReminders.map(r => (
            <div key={r.id} style={s.reminderMiniItem}>
              <div style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: '#FFF8E7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <IconBell />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111', marginBottom: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.judul}</p>
                <p style={{ fontSize: '0.72rem', color: '#888' }}>{formatTanggal(r.tanggal)} - {r.jam} WIB</p>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  )
}

const s = {
  rightPanel: { 
    width: '280px', 
    flexShrink: 0, 
    padding: '36px 20px', 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '20px',
    position: 'sticky',
    top: 0,
    height: '100vh',
    overflowY: 'auto'
  },
  profileCard: { backgroundColor: '#fff', borderRadius: '16px', padding: '24px 16px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  avatarWrap: { width: '90px', height: '90px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 12px', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  avatar: { width: '100%', height: '100%', objectFit: 'cover' },
  avatarFallback: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e5e7eb' },
  profileName: { fontWeight: 700, fontSize: '1rem', color: '#111', marginBottom: '4px' },
  profileRole: { color: '#888', fontSize: '0.85rem', marginBottom: '16px' },
  profileBtn: { border: '2px solid #0066FF', color: '#0066FF', backgroundColor: 'transparent', borderRadius: '20px', padding: '6px 28px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: "'Poppins', sans-serif" },
  
  reminderMini: { backgroundColor: '#fff', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  cardTitle: { fontWeight: 700, fontSize: '0.95rem', color: '#111', margin: 0 },
  arrowBtn: { background: 'none', border: 'none', color: '#0066FF', fontSize: '1.6rem', lineHeight: '1', fontWeight: '800', cursor: 'pointer', padding: '0 4px', display: 'flex', alignItems: 'center' },
  reminderMiniItem: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 },
}
