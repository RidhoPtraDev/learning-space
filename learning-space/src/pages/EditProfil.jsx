import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import avatarDefault from '../assets/avatar-default.png'
import ilustrasiEditProfil from '../assets/ilustrasi-profil.png'
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

const kotaList = ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang', 'Makassar', 'Yogyakarta', 'Palembang', 'Tangerang', 'Depok']

export default function EditProfil() {
  const navigate = useNavigate()
  const [activeMenu, setActiveMenu] = useState('kelas')
  const fileRef = useRef()

  // Ambil data user asli yang login dari localStorage sebagai nilai awal form
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null')

  const [form, setForm] = useState({
    nama: storedUser?.nama || '',
    email: storedUser?.email || '',
  })
  const [pass, setPass] = useState({ lama: '', baru: '', konfirmasi: '' })
  const [showPass, setShowPass] = useState({ lama: false, baru: false, konfirmasi: false })
  const [extra, setExtra] = useState({
    kelamin: storedUser?.kelamin || 'Laki - Laki',
    tglLahir: storedUser?.tglLahir || '',
    kota: storedUser?.kota || 'Jakarta',
  })
  // Rekonstruksi URL foto agar selalu pakai domain yang benar (VITE_API_URL),
  // bukan domain localtunnel yang bisa berubah dan tersimpan di DB/localStorage.
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

  const [avatar, setAvatar] = useState(buildFotoUrl(storedUser?.foto))
  const [avatarFile, setAvatarFile] = useState(null)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleAvatar = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { setServerError('Foto maksimal 2MB'); return }
    setAvatarFile(file)
    setAvatar(URL.createObjectURL(file))
    setServerError('')
  }

  const handleSimpan = async () => {
    const e = {}
    if (!form.nama.trim()) e.nama = 'Nama tidak boleh kosong'
    if (!form.email.trim()) e.email = 'Email tidak boleh kosong'
    if (pass.baru && pass.baru.length < 8) e.baru = 'Password minimal 8 karakter'
    if (pass.baru && pass.baru !== pass.konfirmasi) e.konfirmasi = 'Password tidak cocok'
    if (pass.baru && !pass.lama) e.lama = 'Isi password saat ini untuk mengganti password'
    if (Object.keys(e).length > 0) { setErrors(e); return }

    setServerError('')
    setLoading(true)

    try {
      // 1. Upload foto dulu kalau ada file baru
      // Simpan path relatif di localStorage — bukan URL absolut localtunnel
      let fotoRelativePath = storedUser?.foto || null
      if (avatarFile) {
        const fd = new FormData()
        fd.append('foto', avatarFile)
        const fotoRes = await api.post('/users/foto', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        fotoRelativePath = fotoRes.data.foto // server sekarang mengembalikan path relatif
      }

      // 2. Update data profil
      const res = await api.put('/users/profile', {
        nama: form.nama,
        email: form.email,
        kelamin: extra.kelamin,
        tglLahir: extra.tglLahir,
        kota: extra.kota,
      })

      // 3. Ganti password kalau diisi
      if (pass.baru) {
        await api.put('/users/password', {
          passwordLama: pass.lama,
          passwordBaru: pass.baru,
        })
      }

      // 4. Simpan ke localStorage — foto disimpan sebagai path relatif
      localStorage.setItem('user', JSON.stringify({ ...res.data.user, foto: fotoRelativePath }))

      setLoading(false)
      setSaved(true)
      setTimeout(() => { setSaved(false); navigate('/profil') }, 1500)
    } catch (err) {
      setLoading(false)
      const msg = err.response?.data?.message || 'Terjadi kesalahan, coba lagi'
      setServerError(msg)
    }
  }

  const EyeIcon = ({ show }) => show
    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>

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

      {/* ── MAIN ── */}
      <main style={s.main}>

        {/* Header */}
        <div style={s.headerRow}>
          <div style={{ flex: 1 }}>
            <button onClick={() => navigate('/profil')} style={s.backBtn}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0f0f0'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="4"/><polyline points="13 8 8 12 13 16"/>
              </svg>
              <span style={s.backLabel}>Kembali</span>
            </button>
            <h1 style={s.pageTitle}>Edit Profil</h1>
            <p style={s.pageDesc}>Perbarui informasi akunmu agar tetap sesuai dan mudah dikenali.</p>
          </div>
          <img src={ilustrasiEditProfil} alt="ilustrasi"
            style={{ width: 180, objectFit: 'contain', flexShrink: 0 }}
            onError={e => e.target.style.display = 'none'} />
        </div>

        {serverError && (
          <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px 16px', borderRadius: '10px', fontSize: '0.88rem', marginBottom: '18px' }}>
            {serverError}
          </div>
        )}

        {/* ── FOTO PROFIL ── */}
        <div style={s.card}>
          <p style={s.cardLabel}>Foto Profil</p>
          <div style={s.fotoRow}>
            <div style={s.avatarWrap}>
              <img src={avatar || avatarDefault} alt="avatar" style={s.avatarImg}
                onError={e => { e.target.src = avatarDefault }} />
              <div style={s.cameraBtn} onClick={() => fileRef.current.click()}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatar} />
            </div>
            <div>
              <p style={s.namaText}>{form.nama}</p>
              <span style={s.roleBadge}>⭐ Student LearningSpace</span>
              <p style={s.formatText}>Format: JPG, PNG atau WEBP, Maksimal 2MB</p>
              <button style={s.ubahFotoBtn} onClick={() => fileRef.current.click()}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Ubah Foto Profil
              </button>
              <p style={{ ...s.formatText, marginTop: 6, marginBottom: 0, color: avatar && avatar !== (storedUser?.foto || null) ? '#16a34a' : '#888' }}>
                {avatar && avatar !== (storedUser?.foto || null) ? '✓ Foto baru siap disimpan' : 'Format: JPG, PNG atau WEBP, Maksimal 2MB'}
              </p>
            </div>
          </div>
        </div>

        {/* ── INFORMASI PRIBADI ── */}
        <div style={s.card}>
          <div style={s.sectionHeader}>
            <div style={s.sectionIconBox}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h3 style={s.sectionTitle}>Informasi Pribadi</h3>
          </div>
          <div style={s.formGrid2}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Nama Lengkap</label>
              <input value={form.nama} onChange={e => { setForm({ ...form, nama: e.target.value }); setErrors({ ...errors, nama: '' }) }}
                style={{ ...s.input, borderColor: errors.nama ? '#ef4444' : '#e5e7eb' }} />
              {errors.nama && <span style={s.error}>{errors.nama}</span>}
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Email</label>
              <input value={form.email} onChange={e => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }) }}
                style={{ ...s.input, borderColor: errors.email ? '#ef4444' : '#e5e7eb' }} />
              {errors.email && <span style={s.error}>{errors.email}</span>}
            </div>
          </div>
        </div>

        {/* ── KEAMANAN AKUN ── */}
        <div style={s.card}>
          <div style={s.sectionHeader}>
            <div style={s.sectionIconBox}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h3 style={s.sectionTitle}>Keamanan Akun</h3>
          </div>
          <div style={s.formGrid3}>
            {[
              { key: 'lama',       label: 'Password Saat Ini' },
              { key: 'baru',       label: 'Password Baru' },
              { key: 'konfirmasi', label: 'Konfirmasi Password' },
            ].map(f => (
              <div key={f.key} style={s.fieldGroup}>
                <label style={s.label}>{f.label}</label>
                <div style={{ ...s.inputWrap, borderColor: errors[f.key] ? '#ef4444' : '#e5e7eb' }}>
                  <input
                    type={showPass[f.key] ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={pass[f.key]}
                    onChange={e => { setPass({ ...pass, [f.key]: e.target.value }); setErrors({ ...errors, [f.key]: '' }) }}
                    style={s.inputInner}
                  />
                  <button type="button" style={s.eyeBtn} onClick={() => setShowPass({ ...showPass, [f.key]: !showPass[f.key] })}>
                    <EyeIcon show={showPass[f.key]} />
                  </button>
                </div>
                {errors[f.key] && <span style={s.error}>{errors[f.key]}</span>}
              </div>
            ))}
          </div>
          <div style={s.passHint}>
            Kosongkan jika tidak ingin mengganti password. Password baru minimal 8 karakter.
          </div>
        </div>

        {/* ── INFORMASI TAMBAHAN ── */}
        <div style={s.card}>
          <div style={s.sectionHeader}>
            <div style={{ ...s.sectionIconBox, backgroundColor: '#FFF8E7' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h3 style={s.sectionTitle}>Informasi Tambahan</h3>
          </div>
          <div style={s.formGrid3}>
            {/* Jenis Kelamin */}
            <div style={s.fieldGroup}>
              <label style={s.label}>Jenis Kelamin</label>
              <div style={s.selectWrap}>
                <select value={extra.kelamin} onChange={e => setExtra({ ...extra, kelamin: e.target.value })} style={s.select}>
                  <option>Laki - Laki</option>
                  <option>Perempuan</option>
                </select>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
            </div>

            {/* Tanggal Lahir */}
            <div style={s.fieldGroup}>
              <label style={s.label}>Tanggal Lahir</label>
              <div style={{ display:'flex', gap:8 }}>
                {/* Tanggal */}
                <div style={{ ...s.selectWrap, flex:1 }}>
                  <select
                    value={extra.tglLahir ? extra.tglLahir.split(' ')[0] : ''}
                    onChange={e => {
                      const parts = (extra.tglLahir || '  ').split(' ')
                      setExtra({ ...extra, tglLahir: [e.target.value, parts[1]||'', parts[2]||''].join(' ').trim() })
                    }}
                    style={s.select}
                  >
                    <option value=''>Tgl</option>
                    {Array.from({length:31},(_,i)=>i+1).map(d=>(
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                {/* Bulan */}
                <div style={{ ...s.selectWrap, flex:2 }}>
                  <select
                    value={extra.tglLahir ? extra.tglLahir.split(' ')[1] : ''}
                    onChange={e => {
                      const parts = (extra.tglLahir || '  ').split(' ')
                      setExtra({ ...extra, tglLahir: [parts[0]||'', e.target.value, parts[2]||''].join(' ').trim() })
                    }}
                    style={s.select}
                  >
                    <option value=''>Bulan</option>
                    {['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'].map(b=>(
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                {/* Tahun */}
                <div style={{ ...s.selectWrap, flex:2 }}>
                  <select
                    value={extra.tglLahir ? extra.tglLahir.split(' ')[2] : ''}
                    onChange={e => {
                      const parts = (extra.tglLahir || '  ').split(' ')
                      setExtra({ ...extra, tglLahir: [parts[0]||'', parts[1]||'', e.target.value].join(' ').trim() })
                    }}
                    style={s.select}
                  >
                    <option value=''>Tahun</option>
                    {Array.from({length: new Date().getFullYear() - 1940 + 1},(_,i)=> new Date().getFullYear() - i).map(y=>(
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}><polyline points="6 9 12 15 18 9"/></svg>
                </div>
              </div>
            </div>

            {/* Tempat Tinggal */}
            <div style={s.fieldGroup}>
              <label style={s.label}>Tempat Tinggal Kota</label>
              <div style={s.selectWrap}>
                <select value={extra.kota} onChange={e => setExtra({ ...extra, kota: e.target.value })} style={s.select}>
                  {kotaList.map(k => <option key={k}>{k}</option>)}
                </select>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ── ACTION BUTTONS ── */}
        <div style={s.actionRow}>
          <button style={{ ...s.simpanBtn, backgroundColor: saved ? '#22c55e' : '#0066FF', opacity: loading ? 0.7 : 1 }} onClick={handleSimpan} disabled={loading}>
            {saved ? '✓ Tersimpan!' : loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
          <button style={s.batalBtn} onClick={() => navigate('/profil')}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f5f5f5'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
          >
            Batalkan Perubahan
          </button>
        </div>

      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        @keyframes fadeInUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        select { -webkit-appearance: none; appearance: none; }
      `}</style>
    </div>
  )
}

const s = {
  layout: { display: 'flex', minHeight: '100vh', fontFamily: "'Poppins',sans-serif", backgroundColor: '#f4f6fb' },
  sidebar: { width: '260px', flexShrink: 0, backgroundColor: '#0066FF', display: 'flex', flexDirection: 'column', padding: '28px 0', position: 'sticky', top: 0, height: '100vh' },
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

  main: { flex: 1, padding: '36px 32px', overflowY: 'auto', animation: 'fadeInUp 0.5s ease both' },

  headerRow: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' },
  backBtn: { display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px 10px', borderRadius: '8px', marginBottom: '12px', transition: 'background 0.15s', fontFamily: "'Poppins',sans-serif" },
  backLabel: { fontSize: '0.95rem', fontWeight: 600, color: '#333' },
  pageTitle: { fontSize: '2.2rem', fontWeight: 800, color: '#111', marginBottom: '8px' },
  pageDesc: { color: '#666', fontSize: '0.9rem' },

  card: { backgroundColor: '#fff', borderRadius: '16px', padding: '24px 28px', marginBottom: '18px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' },
  cardLabel: { fontSize: '0.88rem', fontWeight: 700, color: '#333', marginBottom: '16px' },

  fotoRow: { display: 'flex', alignItems: 'center', gap: '20px' },
  avatarWrap: { position: 'relative', width: '90px', height: '90px', flexShrink: 0 },
  avatarImg: { width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', backgroundColor: '#e5e7eb' },
  cameraBtn: { position: 'absolute', bottom: 0, right: 0, width: '28px', height: '28px', backgroundColor: '#0066FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' },
  namaText: { fontSize: '1.3rem', fontWeight: 800, color: '#111', marginBottom: '4px' },
  roleBadge: { display: 'inline-block', backgroundColor: '#FFF3CD', color: '#856404', borderRadius: '20px', padding: '3px 12px', fontSize: '0.78rem', fontWeight: 600, marginBottom: '8px' },
  formatText: { color: '#888', fontSize: '0.8rem', marginBottom: '10px' },
  ubahFotoBtn: { border: '1.5px solid #0066FF', color: '#0066FF', backgroundColor: '#fff', borderRadius: '8px', padding: '8px 18px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', fontFamily: "'Poppins',sans-serif", display: 'flex', alignItems: 'center' },

  sectionHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' },
  sectionIconBox: { width: '40px', height: '40px', backgroundColor: '#EBF2FF', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  sectionTitle: { fontSize: '1.05rem', fontWeight: 800, color: '#111' },

  formGrid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  formGrid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '0.85rem', fontWeight: 600, color: '#333' },
  input: { border: '1.5px solid #e5e7eb', borderRadius: '10px', padding: '11px 14px', fontSize: '0.9rem', outline: 'none', fontFamily: "'Poppins',sans-serif", color: '#333', transition: 'border-color 0.2s', backgroundColor: '#fff' },
  inputWrap: { display: 'flex', alignItems: 'center', border: '1.5px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden', transition: 'border-color 0.2s' },
  inputInner: { flex: 1, border: 'none', outline: 'none', padding: '11px 14px', fontSize: '0.9rem', fontFamily: "'Poppins',sans-serif", color: '#333', backgroundColor: 'transparent' },
  eyeBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '0 12px', display: 'flex', alignItems: 'center' },
  error: { fontSize: '0.75rem', color: '#ef4444' },
  passHint: { marginTop: '16px', backgroundColor: '#EBF2FF', borderRadius: '8px', padding: '12px 16px', fontSize: '0.85rem', color: '#0066FF', textAlign: 'center' },

  selectWrap: { position: 'relative' },
  select: { width: '100%', border: '1.5px solid #e5e7eb', borderRadius: '10px', padding: '11px 36px 11px 14px', fontSize: '0.9rem', outline: 'none', fontFamily: "'Poppins',sans-serif", color: '#333', backgroundColor: '#fff', cursor: 'pointer' },

  actionRow: { display: 'flex', gap: '14px', justifyContent: 'center', paddingBottom: '40px', paddingTop: '8px' },
  simpanBtn: { color: '#fff', border: 'none', borderRadius: '10px', padding: '13px 40px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', fontFamily: "'Poppins',sans-serif", minWidth: '200px', transition: 'background 0.3s' },
  batalBtn: { backgroundColor: '#fff', color: '#333', border: '1.5px solid #e5e7eb', borderRadius: '10px', padding: '13px 40px', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', fontFamily: "'Poppins',sans-serif", minWidth: '200px', transition: 'background 0.15s' },
}