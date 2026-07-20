import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReminderMini } from './AnalitikProgress.jsx'
import logo from '../assets/logo.png'
import avatarDefault from '../assets/avatar-default.png'
import ilustrasiProfil from '../assets/ilustrasi-profil.png'
import iconKelasDialikuti from '../assets/icon-kelas-diikuti.png'
import iconKelasFavorit from '../assets/icon-kelas-favorit.png'
import iconRiwayatBelajar from '../assets/icon-riwayat-belajar.png'
import iconZoomMeeting from '../assets/icon-zoom-meeting.png'

function IconKelas() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg> }
function IconRiwayat() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> }
function IconFavorit() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> }
function IconZoom() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg> }
function IconKeluar() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> }
function IconAnalitik() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> }

const menuItems = [
  { key: 'kelas',   label: 'Kelas Pembelajaran', path: '/dashboard', icon: <IconKelas /> },
  { key: 'riwayat', label: 'Riwayat Belajar',    path: '/riwayat',   icon: <IconRiwayat /> },
  { key: 'favorit', label: 'Kelas Favorit',       path: '/favorit',   icon: <IconFavorit /> },
  { key: 'zoom',    label: 'Kelas Zoom Meeting',  path: '/zoom',      icon: <IconZoom /> },
  { key: 'analitik', label: 'Analitik Progress',   path: '/analitik',  icon: <IconAnalitik /> },
]

const aktivitas = [
  { key: 'kelas',   label: 'Kelas yang diikuti', nilai: 6,  icon: iconKelasDialikuti },
  { key: 'favorit', label: 'Kelas Favorit',       nilai: 4,  icon: iconKelasFavorit },
  { key: 'riwayat', label: 'Riwayat Belajar',     nilai: 4,  icon: iconRiwayatBelajar },
  { key: 'zoom',    label: 'Zoom Meeting',         nilai: 0,  icon: iconZoomMeeting },
]

export default function Profil() {
  const navigate = useNavigate()
  const [activeMenu, setActiveMenu] = useState('kelas')

  const user = {
    nama: 'Alihudin',
    email: 'alihudin@gmail.com',
    bergabung: 'Mei 2026',
    role: 'Student LearningSpace',
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
            <h1 style={s.pageTitle}>Profil Saya</h1>
            <p style={s.pageDesc}>Kelola informasi akun dan pantau aktifitas belajarmu di LearningSpace.</p>
          </div>
          <img src={ilustrasiProfil} alt="ilustrasi"
            style={{ width: 200, objectFit: 'contain', flexShrink: 0 }}
            onError={e => e.target.style.display = 'none'} />
        </div>

        {/* Card Profil */}
        <div style={s.card}>
          <div style={s.profilRow}>
            <div style={s.avatarWrap}>
              <img src={avatarDefault} alt="avatar" style={s.avatarImg}
                onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }} />
              <div style={{ ...s.avatarFallback, display: 'none' }}>
                <svg width="60" height="60" viewBox="0 0 24 24" fill="#aaa"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
              </div>
              {/* Camera icon */}
              <div style={s.cameraBtn}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
            </div>
            <div style={s.profilInfo}>
              <h2 style={s.profilNama}>{user.nama}</h2>
              <span style={s.roleBadge}>⭐ {user.role}</span>
              <p style={s.profilEmail}>{user.email}</p>
              <p style={s.profilBergabung}>Bergabung sejak {user.bergabung}</p>
            </div>
            <div style={s.profilActions}>
              <button style={s.editBtn} onClick={() => navigate('/profil/edit')}>Edit Profil</button>
              <button style={s.passwordBtn}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Ubah Password
              </button>
            </div>
          </div>
        </div>

        {/* Informasi Akun */}
        <div style={s.card}>
          <h3 style={s.cardTitle}>Informasi Akun</h3>
          <div style={s.infoRow}>
            <span style={s.infoLabel}>Nama Lengkap</span>
            <span style={s.infoValue}>{user.nama}</span>
          </div>
          <hr style={s.infoDiv} />
          <div style={s.infoRow}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={s.infoIconBox}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <span style={s.infoLabel}>Email</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={s.infoValue}>{user.email}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>
          <hr style={s.infoDiv} />
          <div style={s.infoRow}>
            <span style={s.infoLabel}>Password</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ ...s.infoValue, letterSpacing: 3, fontSize: '1.1rem' }}>••••••••••</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>
        </div>

        {/* Ringkasan Aktivitas */}
        <div style={{ ...s.card, marginBottom: 40 }}>
          <h3 style={s.cardTitle}>Ringkasan Aktivitas Belajar</h3>
          <div style={s.aktivitasGrid}>
            {aktivitas.map(a => (
              <div key={a.key} style={s.aktivitasCard}>
                <img src={a.icon} alt={a.label} style={s.aktivitasIcon}
                  onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='block' }} />
                <span style={{ display:'none', fontSize:'2rem' }}>📚</span>
                <p style={s.aktivitasNilai}>{a.nilai}</p>
                <p style={s.aktivitasLabel}>{a.label}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        @keyframes fadeInUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        * { box-sizing:border-box; margin:0; padding:0; }
      `}</style>
    </div>
  )
}

const s = {
  layout: { display:'flex', minHeight:'100vh', fontFamily:"'Poppins',sans-serif", backgroundColor:'#f4f6fb' },
  sidebar: { width:'260px', flexShrink:0, backgroundColor:'#0066FF', display:'flex', flexDirection:'column', padding:'28px 0', position:'sticky', top:0, height:'100vh' },
  logoWrap: { padding:'0 24px 32px', cursor:'pointer' },
  logoImg: { height:'36px', objectFit:'contain' },
  logoFallback: { fontSize:'1.3rem', fontWeight:800, color:'#fff', position:'relative', display:'inline-block' },
  logoUnderline: { display:'block', height:'3px', backgroundColor:'#FFD93D', borderRadius:'2px', marginTop:'2px' },
  nav: { flex:1, display:'flex', flexDirection:'column', gap:'4px', padding:'0 12px' },
  menuItem: { display:'flex', alignItems:'center', gap:'12px', padding:'12px 16px', borderRadius:'12px', cursor:'pointer', position:'relative', transition:'background 0.2s' },
  menuActive: { backgroundColor:'rgba(255,255,255,0.18)' },
  activeBar: { position:'absolute', left:0, top:'50%', transform:'translateY(-50%)', width:'4px', height:'60%', backgroundColor:'#fff', borderRadius:'0 4px 4px 0' },
  menuIcon: { flexShrink:0 },
  menuLabel: { fontSize:'0.92rem' },
  keluarWrap: { padding:'16px 24px 0' },
  keluarBtn: { display:'flex', alignItems:'center', gap:'12px', padding:'12px 16px', borderRadius:'12px', cursor:'pointer' },
  keluarLabel: { color:'#ff4d4d', fontWeight:600, fontSize:'0.92rem' },

  main: { flex:1, padding:'36px 32px', overflowY:'auto', animation:'fadeInUp 0.5s ease both' },
  headerRow: { display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'24px' },
  backBtn: { display:'flex', alignItems:'center', gap:'8px', background:'transparent', border:'none', cursor:'pointer', padding:'6px 10px', borderRadius:'8px', marginBottom:'12px', transition:'background 0.15s', fontFamily:"'Poppins',sans-serif" },
  backLabel: { fontSize:'0.95rem', fontWeight:600, color:'#333' },
  pageTitle: { fontSize:'2.2rem', fontWeight:800, color:'#111', marginBottom:'8px' },
  pageDesc: { color:'#666', fontSize:'0.95rem', lineHeight:1.6 },

  card: { backgroundColor:'#fff', borderRadius:'16px', padding:'28px', marginBottom:'20px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' },
  cardTitle: { fontSize:'1.1rem', fontWeight:800, color:'#111', marginBottom:'20px' },

  profilRow: { display:'flex', alignItems:'center', gap:'24px' },
  avatarWrap: { position:'relative', width:'90px', height:'90px', flexShrink:0 },
  avatarImg: { width:'90px', height:'90px', borderRadius:'50%', objectFit:'cover' },
  avatarFallback: { width:'90px', height:'90px', borderRadius:'50%', backgroundColor:'#e5e7eb', alignItems:'center', justifyContent:'center' },
  cameraBtn: { position:'absolute', bottom:0, right:0, width:'28px', height:'28px', backgroundColor:'#0066FF', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow:'0 2px 6px rgba(0,0,0,0.2)' },
  profilInfo: { flex:1 },
  profilNama: { fontSize:'1.4rem', fontWeight:800, color:'#111', marginBottom:'6px' },
  roleBadge: { display:'inline-block', backgroundColor:'#FFF3CD', color:'#856404', borderRadius:'20px', padding:'3px 12px', fontSize:'0.8rem', fontWeight:600, marginBottom:'8px' },
  profilEmail: { color:'#666', fontSize:'0.9rem', marginBottom:'4px' },
  profilBergabung: { color:'#999', fontSize:'0.85rem' },
  profilActions: { display:'flex', flexDirection:'column', gap:'12px', flexShrink:0 },
  editBtn: { backgroundColor:'#0066FF', color:'#fff', border:'none', borderRadius:'10px', padding:'12px 32px', fontWeight:700, fontSize:'0.95rem', cursor:'pointer', fontFamily:"'Poppins',sans-serif", minWidth:'180px' },
  passwordBtn: { backgroundColor:'#fff', color:'#0066FF', border:'1.5px solid #0066FF', borderRadius:'10px', padding:'11px 32px', fontWeight:600, fontSize:'0.95rem', cursor:'pointer', fontFamily:"'Poppins',sans-serif", display:'flex', alignItems:'center', justifyContent:'center', transition:'background 0.15s' },

  infoRow: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 0' },
  infoDiv: { border:'none', borderTop:'1px solid #f0f0f0' },
  infoLabel: { fontSize:'0.92rem', fontWeight:600, color:'#333', display:'flex', alignItems:'center', gap:8 },
  infoValue: { fontSize:'0.92rem', color:'#666' },
  infoIconBox: { width:'32px', height:'32px', backgroundColor:'#EBF2FF', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center' },

  aktivitasGrid: { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px' },
  aktivitasCard: { border:'1.5px solid #e5e7eb', borderRadius:'12px', padding:'20px 12px', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:'8px' },
  aktivitasIcon: { width:'48px', height:'48px', objectFit:'contain' },
  aktivitasNilai: { fontSize:'1.4rem', fontWeight:800, color:'#111' },
  aktivitasLabel: { fontSize:'0.8rem', color:'#666', fontWeight:500 },
}
