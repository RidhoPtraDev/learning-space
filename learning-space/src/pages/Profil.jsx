import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import avatarDefault from '../assets/avatar-default.png'
import ilustrasiProfil from '../assets/ilustrasi-profil.png'
import iconKelasDialikuti from '../assets/icon-kelas-diikuti.png'
import iconKelasFavorit from '../assets/icon-kelas-favorit.png'
import iconRiwayatBelajar from '../assets/icon-riwayat-belajar.png'
import iconZoomMeeting from '../assets/icon-zoom-meeting.png'
import api from '../api/axios'

function IconKelas() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg> }
function IconRiwayat() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> }
function IconFavorit() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> }
function IconZoom() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg> }
function IconAnalitik() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> }
function IconReminder() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> }
function IconKeluar() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> }

const menuItems = [
  { key: 'kelas',    label: 'Kelas Pembelajaran', path: '/dashboard', icon: <IconKelas /> },
  { key: 'riwayat', label: 'Riwayat Belajar',    path: '/riwayat',   icon: <IconRiwayat /> },
  { key: 'favorit', label: 'Kelas Favorit',       path: '/favorit',   icon: <IconFavorit /> },
  { key: 'zoom',    label: 'Kelas Zoom Meeting',  path: '/zoom',      icon: <IconZoom /> },
  { key: 'analitik',label: 'Analitik Progress',   path: '/analitik',  icon: <IconAnalitik /> },
  { key: 'reminder', label: 'Reminder',           path: '/reminder',  icon: <IconReminder /> },
]

const aktivitasMeta = [
  { key: 'kelasDiikuti',   label: 'Kelas yang diikuti', icon: iconKelasDialikuti },
  { key: 'kelasFavorit',   label: 'Kelas Favorit',       icon: iconKelasFavorit },
  { key: 'riwayatBelajar', label: 'Riwayat Belajar',     icon: iconRiwayatBelajar },
  { key: 'zoomMeeting',    label: 'Zoom Meeting',         icon: iconZoomMeeting },
]

const formatBergabung = (dateStr) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  const bulan = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
  return `${bulan[d.getMonth()]} ${d.getFullYear()}`
}

export default function Profil() {
  const navigate = useNavigate()
  const [activeMenu, setActiveMenu] = useState('kelas')
  const [stats, setStats] = useState({ kelasDiikuti: 0, kelasFavorit: 0, riwayatBelajar: 0, zoomMeeting: 0 })

  const storedUser = JSON.parse(localStorage.getItem('user') || 'null')
  const [profileUser, setProfileUser] = useState(storedUser)

  // Mengubah path relatif/absolut foto menjadi URL yang bisa diload oleh browser
  // Karena foto disimpan di backend lokal (localtunnel), URL absolut tidak bisa
  // diakses oleh browser karena localtunnel membutuhkan header khusus yang tidak
  // bisa dikirim via tag <img>. Solusinya: simpan path relatif di DB,
  // rekonstruksi URL dari VITE_API_URL di frontend.
  const buildFotoUrl = (fotoPath) => {
    if (!fotoPath) return null
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
    const baseUrl = apiUrl.replace(/\/api\/?$/, '')
    // Path relatif seperti /uploads/foto/file.jpg
    if (fotoPath.startsWith('/uploads/')) {
      return `${baseUrl}${fotoPath}`
    }
    // URL absolut lama — ekstrak nama file dan rekonstruksi dengan domain sekarang
    if (fotoPath.includes('/uploads/foto/')) {
      const filename = fotoPath.split('/uploads/foto/').pop()
      return `${baseUrl}/uploads/foto/${filename}`
    }
    return fotoPath
  }

  const [foto, setFoto] = useState(buildFotoUrl(storedUser?.foto))
  const fotoRef = useRef()
  const [fotoLoading, setFotoLoading] = useState(false)
  const [fotoMsg, setFotoMsg] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resStats, resProfile] = await Promise.all([
          api.get('/users/stats'),
          api.get('/users/profile'),
        ])
        setStats(resStats.data.stats)
        if (resProfile.data?.user) {
          setProfileUser(resProfile.data.user)
          setFoto(buildFotoUrl(resProfile.data.user.foto))
          localStorage.setItem('user', JSON.stringify(resProfile.data.user))
        }
      } catch (err) {
        console.error('Gagal memuat data profil', err)
      }
    }
    fetchData()
  }, [])

  // Role Badge Dinamis
  const getRoleBadge = (role) => {
    if (role === 'admin') {
      return {
        text: 'Admin LearningSpace',
        icon: '👑',
        color: '#856404',
        bgColor: '#FFF3CD'
      }
    }
    return {
      text: 'Student LearningSpace',
      icon: '⭐',
      color: '#856404',
      bgColor: '#FFF3CD'
    }
  }

  const userRole = profileUser?.role || 'user'
  const roleInfo = getRoleBadge(userRole)

  const user = {
    nama: profileUser?.nama || 'Pengguna',
    email: profileUser?.email || '-',
    kelamin: profileUser?.kelamin || '-',
    tglLahir: profileUser?.tglLahir || '-',
    kota: profileUser?.kota || '-',
    bergabung: formatBergabung(profileUser?.createdAt),
    role: roleInfo.text,
    roleIcon: roleInfo.icon,
    roleColor: roleInfo.color,
    roleBg: roleInfo.bgColor,
  }

  const aktivitas = aktivitasMeta.map(a => ({ ...a, nilai: stats[a.key] ?? 0 }))

  const handleUploadFoto = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { setFotoMsg('Foto maksimal 2MB'); return }
    setFotoLoading(true)
    setFotoMsg('')
    const fd = new FormData()
    fd.append('foto', file)
    try {
      const res = await api.post('/users/foto', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      // res.data.foto berisi path relatif: /uploads/foto/namafile.jpg
      const builtUrl = buildFotoUrl(res.data.foto)
      setFoto(builtUrl)
      // Simpan path relatif di localStorage agar buildFotoUrl bisa rekonstruksi ulang saat reload
      localStorage.setItem('user', JSON.stringify({ ...storedUser, foto: res.data.foto }))
      setFotoMsg('Foto berhasil diperbarui!')
      setTimeout(() => setFotoMsg(''), 3000)
    } catch { setFotoMsg('Gagal upload foto') }
    finally { setFotoLoading(false); e.target.value = '' }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div style={s.layout}>
      {/* SIDEBAR */}
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

      {/* MAIN CONTENT */}
      <main style={s.main}>
        <div style={s.headerRow}>
          <div style={{ flex: 1 }}>
            <button onClick={() => navigate('/dashboard')} style={s.backBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="4"/><polyline points="13 8 8 12 13 16"/>
              </svg>
              <span style={s.backLabel}>Kembali</span>
            </button>
            <h1 style={s.pageTitle}>Profil Saya</h1>
            <p style={s.pageDesc}>Kelola informasi akun dan pantau aktifitas belajarmu di LearningSpace.</p>
          </div>
          <img src={ilustrasiProfil} alt="ilustrasi" style={{ width: 180, objectFit: 'contain', flexShrink: 0 }} />
        </div>

        {/* Card Profil */}
        <div style={s.card}>
          <div style={s.profilRow}>
            <div style={s.avatarWrap}>
              <img src={foto || avatarDefault} alt="avatar" style={s.avatarImg}
                onError={e => { e.target.src = avatarDefault }} />
              <div style={{ ...s.cameraBtn, opacity: fotoLoading ? 0.6 : 1, cursor: fotoLoading ? 'not-allowed' : 'pointer' }}
                onClick={() => !fotoLoading && fotoRef.current?.click()}>
                {fotoLoading
                  ? <span style={{ width:12,height:12,border:'2px solid rgba(255,255,255,0.4)',borderTopColor:'#fff',borderRadius:'50%',display:'inline-block',animation:'spin 0.7s linear infinite' }}/>
                  : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                }
              </div>
              <input ref={fotoRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp"
                style={{ display:'none' }} onChange={handleUploadFoto} />
            </div>

            <div style={s.profilInfo}>
              <h2 style={s.profilNama}>{user.nama}</h2>
              <span style={{
                display: 'inline-block',
                backgroundColor: user.roleBg,
                color: user.roleColor,
                borderRadius: '20px',
                padding: '3px 12px',
                fontSize: '0.8rem',
                fontWeight: 600,
                marginBottom: '8px'
              }}>
                {user.roleIcon} {user.role}
              </span>
              <p style={s.profilEmail}>{user.email}</p>
              <p style={s.profilBergabung}>Bergabung sejak {user.bergabung}</p>
              {fotoMsg && <p style={{ fontSize:'0.82rem', fontWeight:600, marginTop:8, color: fotoMsg.includes('berhasil') ? '#16a34a' : '#dc2626' }}>{fotoMsg}</p>}
            </div>

            <div style={s.profilActions}>
              <button style={s.editBtn} onClick={() => navigate('/profil/edit')}>Edit Profil</button>
              <button style={s.passwordBtn} onClick={() => navigate('/profil/edit')}>
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
            </div>
          </div>
          <hr style={s.infoDiv} />
          <div style={s.infoRow}>
            <span style={s.infoLabel}>Jenis Kelamin</span>
            <span style={s.infoValue}>{user.kelamin}</span>
          </div>
          <hr style={s.infoDiv} />
          <div style={s.infoRow}>
            <span style={s.infoLabel}>Tanggal Lahir</span>
            <span style={s.infoValue}>{user.tglLahir}</span>
          </div>
          <hr style={s.infoDiv} />
          <div style={s.infoRow}>
            <span style={s.infoLabel}>Kota / Kabupaten</span>
            <span style={s.infoValue}>{user.kota}</span>
          </div>
          <hr style={s.infoDiv} />
          <div style={s.infoRow}>
            <span style={s.infoLabel}>Password</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ ...s.infoValue, letterSpacing: 3, fontSize: '1.1rem' }}>••••••••••</span>
            </div>
          </div>
        </div>

        {/* Ringkasan Aktivitas */}
        <div style={{ ...s.card, marginBottom: 40 }}>
          <h3 style={s.cardTitle}>Ringkasan Aktivitas Belajar</h3>
          <div style={s.aktivitasGrid}>
            {aktivitas.map(a => (
              <div key={a.key} style={s.aktivitasCard}>
                <img src={a.icon} alt={a.label} style={s.aktivitasIcon} />
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
        @keyframes spin { to { transform: rotate(360deg); } }
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
  cameraBtn: { position:'absolute', bottom:0, right:0, width:'28px', height:'28px', backgroundColor:'#0066FF', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow:'0 2px 6px rgba(0,0,0,0.2)' },
  profilInfo: { flex:1 },
  profilNama: { fontSize:'1.4rem', fontWeight:800, color:'#111', marginBottom:'6px' },
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