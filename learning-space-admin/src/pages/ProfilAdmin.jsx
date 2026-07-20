import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminLayout } from './AdminDashboard.jsx'
import avatarDefault from '../assets/avatar-default.png'
import api from '../api/axios'

const formatBergabung = (dateStr) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  const bulan = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
  return `${bulan[d.getMonth()]} ${d.getFullYear()}`
}

export default function ProfilAdmin() {
  const navigate = useNavigate()
  const storedUser = JSON.parse(sessionStorage.getItem('user') || 'null')

  const [foto, setFoto] = useState(storedUser?.foto || null)
  const [fotoLoading, setFotoLoading] = useState(false)
  const [fotoError, setFotoError] = useState('')
  const [fotoSuccess, setFotoSuccess] = useState('')
  const fotoInputRef = useRef()

  // State ganti password
  const [passForm, setPassForm] = useState({ lama: '', baru: '', konfirmasi: '' })
  const [showPass, setShowPass] = useState({ lama: false, baru: false, konfirmasi: false })
  const [passLoading, setPassLoading] = useState(false)
  const [passError, setPassError] = useState('')
  const [passSuccess, setPassSuccess] = useState('')

  const user = {
    nama: storedUser?.nama || 'Admin',
    email: storedUser?.email || '-',
    bergabung: formatBergabung(storedUser?.createdAt),
  }

  // ── UPLOAD FOTO ───────────────────────────────────────────────
  const handleFotoChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      setFotoError('Ukuran file maksimal 2MB')
      return
    }

    setFotoLoading(true)
    setFotoError('')
    setFotoSuccess('')

    const formData = new FormData()
    formData.append('foto', file)

    try {
      const res = await api.post('/users/foto', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const urlBaru = res.data.foto
      setFoto(urlBaru)

      // Sync localStorage supaya header admin juga update
      const updatedUser = { ...storedUser, foto: urlBaru }
      sessionStorage.setItem('user', JSON.stringify(updatedUser))

      setFotoSuccess('Foto profil berhasil diperbarui!')
      setTimeout(() => setFotoSuccess(''), 3000)
    } catch (err) {
      setFotoError(err.response?.data?.message || 'Gagal mengupload foto')
    } finally {
      setFotoLoading(false)
      // Reset input supaya file yang sama bisa dipilih lagi
      e.target.value = ''
    }
  }

  // ── GANTI PASSWORD ────────────────────────────────────────────
  const handlePassChange = (e) => {
    setPassForm({ ...passForm, [e.target.name]: e.target.value })
    setPassError('')
    setPassSuccess('')
  }

  const handleGantiPassword = async (e) => {
    e.preventDefault()
    setPassError('')
    setPassSuccess('')

    if (!passForm.lama || !passForm.baru || !passForm.konfirmasi) {
      setPassError('Semua field wajib diisi')
      return
    }
    if (passForm.baru.length < 8) {
      setPassError('Password baru minimal 8 karakter')
      return
    }
    if (passForm.baru !== passForm.konfirmasi) {
      setPassError('Konfirmasi password tidak cocok')
      return
    }

    setPassLoading(true)
    try {
      await api.put('/users/password', {
        passwordLama: passForm.lama,
        passwordBaru: passForm.baru,
      })
      setPassSuccess('Password berhasil diubah!')
      setPassForm({ lama: '', baru: '', konfirmasi: '' })
      setTimeout(() => setPassSuccess(''), 3000)
    } catch (err) {
      setPassError(err.response?.data?.message || 'Gagal mengubah password')
    } finally {
      setPassLoading(false)
    }
  }

  return (
    <AdminLayout activeKey="profil" rightPanel={false}>
      {/* Header */}
      <div style={s.headerRow}>
        <div>
          <button onClick={() => navigate('/')} style={s.backBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="4"/><polyline points="13 8 8 12 13 16"/>
            </svg>
            <span style={s.backLabel}>Kembali</span>
          </button>
          <h1 style={s.pageTitle}>Profil Admin</h1>
          <p style={s.pageDesc}>Informasi akun dan pengaturan keamanan admin panel.</p>
        </div>
      </div>

      {/* Card info profil */}
      <div style={s.card}>
        <div style={s.profilRow}>
          {/* Avatar + upload */}
          <div style={s.avatarWrap}>
            <img
              src={foto || avatarDefault}
              alt="avatar"
              style={s.avatarImg}
              onError={e => { e.target.src = avatarDefault }}
            />
            <div
              style={{ ...s.cameraBtn, opacity: fotoLoading ? 0.6 : 1, cursor: fotoLoading ? 'not-allowed' : 'pointer' }}
              onClick={() => !fotoLoading && fotoInputRef.current?.click()}
              title="Ganti foto profil"
            >
              {fotoLoading ? (
                <span style={s.spinner} />
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              )}
            </div>
            <input
              ref={fotoInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              style={{ display: 'none' }}
              onChange={handleFotoChange}
            />
          </div>

          {/* Info teks */}
          <div style={s.profilInfo}>
            <h2 style={s.profilNama}>{user.nama}</h2>
            <span style={s.adminBadge}>👑 Admin LearningSpace</span>
            <p style={s.profilEmail}>{user.email}</p>
            <p style={s.profilBergabung}>Bergabung sejak {user.bergabung}</p>

            {fotoSuccess && <p style={s.successMsg}>{fotoSuccess}</p>}
            {fotoError && <p style={s.errorMsg}>{fotoError}</p>}
          </div>
        </div>
      </div>

      {/* Card informasi akun */}
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
          <span style={s.infoValue}>{user.email}</span>
        </div>
        <hr style={s.infoDiv} />
        <div style={s.infoRow}>
          <span style={s.infoLabel}>Role</span>
          <span style={{ ...s.infoValue, color: '#856404', fontWeight: 600 }}>Admin</span>
        </div>
      </div>

      {/* Card ganti password */}
      <div style={{ ...s.card, marginBottom: 40 }}>
        <h3 style={s.cardTitle}>Ganti Password</h3>
        <p style={s.cardDesc}>Pastikan password baru minimal 8 karakter.</p>

        <form onSubmit={handleGantiPassword} noValidate>
          {/* Password lama */}
          <div style={s.fieldGroup}>
            <label style={s.label}>Password Saat Ini</label>
            <div style={s.inputWrap}>
              <input
                type={showPass.lama ? 'text' : 'password'}
                name="lama"
                placeholder="Masukkan password saat ini"
                value={passForm.lama}
                onChange={handlePassChange}
                style={s.input}
                autoComplete="current-password"
              />
              <button type="button" onClick={() => setShowPass(p => ({ ...p, lama: !p.lama }))} style={s.eyeBtn}>
                {showPass.lama ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
          </div>

          {/* Password baru */}
          <div style={s.fieldGroup}>
            <label style={s.label}>Password Baru</label>
            <div style={s.inputWrap}>
              <input
                type={showPass.baru ? 'text' : 'password'}
                name="baru"
                placeholder="Minimal 8 karakter"
                value={passForm.baru}
                onChange={handlePassChange}
                style={s.input}
                autoComplete="new-password"
              />
              <button type="button" onClick={() => setShowPass(p => ({ ...p, baru: !p.baru }))} style={s.eyeBtn}>
                {showPass.baru ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
            {/* Strength bar */}
            {passForm.baru && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                {[1,2,3,4].map(n => (
                  <div key={n} style={{
                    height: 4, flex: 1, borderRadius: 2,
                    backgroundColor: passForm.baru.length >= n * 2
                      ? (passForm.baru.length >= 8 ? '#22c55e' : '#f59e0b')
                      : '#e5e7eb',
                    transition: 'background-color 0.2s',
                  }} />
                ))}
                <span style={{ fontSize: '0.75rem', color: passForm.baru.length >= 8 ? '#22c55e' : '#f59e0b', marginLeft: 6, whiteSpace: 'nowrap' }}>
                  {passForm.baru.length >= 8 ? 'Kuat' : 'Lemah'}
                </span>
              </div>
            )}
          </div>

          {/* Konfirmasi password */}
          <div style={s.fieldGroup}>
            <label style={s.label}>Konfirmasi Password Baru</label>
            <div style={s.inputWrap}>
              <input
                type={showPass.konfirmasi ? 'text' : 'password'}
                name="konfirmasi"
                placeholder="Ulangi password baru"
                value={passForm.konfirmasi}
                onChange={handlePassChange}
                style={s.input}
                autoComplete="new-password"
              />
              <button type="button" onClick={() => setShowPass(p => ({ ...p, konfirmasi: !p.konfirmasi }))} style={s.eyeBtn}>
                {showPass.konfirmasi ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
            {passForm.konfirmasi && passForm.baru === passForm.konfirmasi && (
              <span style={{ fontSize: '0.75rem', color: '#22c55e', marginTop: 4, display: 'block' }}>✓ Password cocok</span>
            )}
          </div>

          {passError && <p style={s.errorMsg}>{passError}</p>}
          {passSuccess && <p style={s.successMsg}>{passSuccess}</p>}

          <button type="submit" style={{ ...s.submitBtn, opacity: passLoading ? 0.7 : 1 }} disabled={passLoading}>
            {passLoading ? (
              <><span style={s.spinner} /> Menyimpan...</>
            ) : (
              'Simpan Password Baru'
            )}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </AdminLayout>
  )
}

const s = {
  headerRow: { marginBottom: 24 },
  backBtn: { display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px 10px', borderRadius: 8, marginBottom: 12, fontFamily: "'Poppins', sans-serif" },
  backLabel: { fontSize: '0.95rem', fontWeight: 600, color: '#333' },
  pageTitle: { fontSize: '2rem', fontWeight: 800, color: '#111', marginBottom: 8 },
  pageDesc: { color: '#666', fontSize: '0.95rem', lineHeight: 1.6 },

  card: { backgroundColor: '#fff', borderRadius: 16, padding: 28, marginBottom: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  cardTitle: { fontSize: '1.1rem', fontWeight: 800, color: '#111', marginBottom: 6 },
  cardDesc: { color: '#888', fontSize: '0.88rem', marginBottom: 24 },

  profilRow: { display: 'flex', alignItems: 'center', gap: 28 },
  avatarWrap: { position: 'relative', width: 90, height: 90, flexShrink: 0 },
  avatarImg: { width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', border: '3px solid #e5e7eb' },
  cameraBtn: { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, backgroundColor: '#0066FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' },
  profilInfo: { flex: 1 },
  profilNama: { fontSize: '1.4rem', fontWeight: 800, color: '#111', marginBottom: 6 },
  adminBadge: { display: 'inline-block', backgroundColor: '#FFF3CD', color: '#856404', borderRadius: 20, padding: '3px 14px', fontSize: '0.8rem', fontWeight: 600, marginBottom: 10 },
  profilEmail: { color: '#666', fontSize: '0.9rem', marginBottom: 4 },
  profilBergabung: { color: '#999', fontSize: '0.85rem' },

  infoRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0' },
  infoDiv: { border: 'none', borderTop: '1px solid #f0f0f0' },
  infoLabel: { fontSize: '0.92rem', fontWeight: 600, color: '#333', display: 'flex', alignItems: 'center', gap: 8 },
  infoValue: { fontSize: '0.92rem', color: '#666' },
  infoIconBox: { width: 32, height: 32, backgroundColor: '#EBF2FF', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' },

  fieldGroup: { marginBottom: 18 },
  label: { display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#333', marginBottom: 6 },
  inputWrap: { display: 'flex', alignItems: 'center', border: '1.5px solid #e5e7eb', borderRadius: 10, overflow: 'hidden', backgroundColor: '#fff', transition: 'border-color 0.2s' },
  input: { flex: 1, border: 'none', outline: 'none', padding: '12px 14px', fontSize: '0.92rem', color: '#333', fontFamily: "'Poppins', sans-serif", backgroundColor: 'transparent' },
  eyeBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '0 12px', display: 'flex', alignItems: 'center' },

  submitBtn: { backgroundColor: '#0066FF', color: '#fff', border: 'none', borderRadius: 10, padding: '13px 32px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', fontFamily: "'Poppins', sans-serif", display: 'flex', alignItems: 'center', gap: 8, transition: 'opacity 0.2s', marginTop: 4 },

  successMsg: { color: '#16a34a', fontSize: '0.88rem', fontWeight: 600, marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 },
  errorMsg: { color: '#dc2626', fontSize: '0.88rem', fontWeight: 600, marginTop: 10 },
  spinner: { width: 16, height: 16, border: '2.5px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' },
}