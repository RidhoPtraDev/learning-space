import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nama: '', email: '', password: '', konfirmasi: '' })
  const [errors, setErrors] = useState({})
  const [showPass, setShowPass] = useState(false)
  const [showKonfirmasi, setShowKonfirmasi] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.nama.trim()) e.nama = 'Nama lengkap wajib diisi'
    if (!form.email.trim()) e.email = 'Email wajib diisi'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Format email tidak valid'
    if (!form.password) e.password = 'Password wajib diisi'
    else if (form.password.length < 8) e.password = 'Password minimal 8 karakter'
    if (!form.konfirmasi) e.konfirmasi = 'Konfirmasi password wajib diisi'
    else if (form.password !== form.konfirmasi) e.konfirmasi = 'Password tidak cocok'
    return e
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length > 0) { setErrors(e2); return }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 1800)
    }, 1500)
  }

  return (
    <div style={styles.page}>
      {/* Background blobs */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      {/* Logo atas */}
      <div style={styles.logoTop} onClick={() => navigate('/')}>
        <span style={styles.logoText}>LearningSpace</span>
      </div>

      {/* Card utama */}
      <div style={styles.card}>

        {/* KIRI — info */}
        <div style={styles.left}>
          <div style={styles.leftInner}>
            <div style={styles.badge}>✨ Bergabung Gratis</div>
            <h2 style={styles.leftTitle}>
              Mulai Perjalanan<br />
              Belajarmu<br />
              di <span style={styles.leftHighlight}>LearningSpace</span>
            </h2>
            <p style={styles.leftDesc}>
              Bergabunglah dan akses berbagai materi pembelajaran,
              video interaktif, serta kelas live untuk mengembangkan skillmu.
            </p>
            <div style={styles.features}>
              {['📚 Ratusan materi & jurnal', '🎬 Video pembelajaran HD', '💻 Kelas Zoom interaktif'].map((f, i) => (
                <div key={i} style={styles.featureItem}>{f}</div>
              ))}
            </div>
          </div>
        </div>

        {/* KANAN — form */}
        <div style={styles.right}>
          {success ? (
            <div style={styles.successBox}>
              <div style={styles.checkCircle}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'drawCheck 0.5s ease 0.3s both', strokeDasharray: 30, strokeDashoffset: 30 }}>
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h3 style={{ color: '#111', fontWeight: 700, marginBottom: 8 }}>Akun Berhasil Dibuat!</h3>
              <p style={{ color: '#555', fontSize: '0.9rem' }}>Mengarahkan ke halaman login...</p>
              <div style={styles.progressBar}><div style={styles.progressFill} /></div>
            </div>
          ) : (
            <>
              <h3 style={styles.formTitle}>Mulai Sekarang</h3>
              <p style={styles.formSub}>Daftarkan akunmu dalam 1 menit</p>

              <form onSubmit={handleSubmit} noValidate>
                {/* Nama */}
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Nama Lengkap</label>
                  <div style={inputWrap(errors.nama)}>
                    <span style={styles.inputIcon}>👤</span>
                    <input
                      name="nama"
                      type="text"
                      placeholder="Isi Nama Lengkap Anda"
                      value={form.nama}
                      onChange={handleChange}
                      style={styles.input}
                    />
                  </div>
                  {errors.nama && <span style={styles.error}>{errors.nama}</span>}
                </div>

                {/* Email */}
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Email</label>
                  <div style={inputWrap(errors.email)}>
                    <span style={styles.inputIcon}>✉️</span>
                    <input
                      name="email"
                      type="email"
                      placeholder="Isi Email Anda"
                      value={form.email}
                      onChange={handleChange}
                      style={styles.input}
                    />
                  </div>
                  {errors.email && <span style={styles.error}>{errors.email}</span>}
                </div>

                {/* Password */}
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Password</label>
                  <div style={inputWrap(errors.password)}>
                    <span style={styles.inputIcon}>🔑</span>
                    <input
                      name="password"
                      type={showPass ? 'text' : 'password'}
                      placeholder="Isi Password Anda"
                      value={form.password}
                      onChange={handleChange}
                      style={styles.input}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                      {showPass ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {errors.password && <span style={styles.error}>{errors.password}</span>}
                  {form.password && !errors.password && (
                    <div style={styles.strengthBar}>
                      {[1,2,3,4].map(n => (
                        <div key={n} style={{
                          ...styles.strengthSegment,
                          backgroundColor: form.password.length >= n * 2
                            ? (form.password.length >= 8 ? '#22c55e' : '#f59e0b')
                            : '#e5e7eb'
                        }} />
                      ))}
                      <span style={{ fontSize: '0.75rem', color: form.password.length >= 8 ? '#22c55e' : '#f59e0b', marginLeft: 6 }}>
                        {form.password.length >= 8 ? 'Kuat' : 'Lemah'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Konfirmasi Password */}
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Konfirmasi Password</label>
                  <div style={inputWrap(errors.konfirmasi)}>
                    <span style={styles.inputIcon}>🔑</span>
                    <input
                      name="konfirmasi"
                      type={showKonfirmasi ? 'text' : 'password'}
                      placeholder="Isi Password Kembali"
                      value={form.konfirmasi}
                      onChange={handleChange}
                      style={styles.input}
                    />
                    <button type="button" onClick={() => setShowKonfirmasi(!showKonfirmasi)} style={styles.eyeBtn}>
                      {showKonfirmasi ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {errors.konfirmasi && <span style={styles.error}>{errors.konfirmasi}</span>}
                  {form.konfirmasi && form.password === form.konfirmasi && !errors.konfirmasi && (
                    <span style={{ fontSize: '0.75rem', color: '#22c55e' }}>✓ Password cocok</span>
                  )}
                </div>

                {/* Submit */}
                <button type="submit" style={styles.submitBtn} disabled={loading}>
                  {loading ? (
                    <span style={styles.spinner} />
                  ) : 'Daftar'}
                </button>
              </form>

              <p style={styles.loginLink}>
                Sudah Punya Akun?{' '}
                <span onClick={() => navigate('/login')} style={styles.loginAnchor}>
                  Masuk Disini
                </span>
              </p>
            </>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes progress {
          from { width: 0% }
          to { width: 100% }
        }
        @keyframes blob {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
        }
        .reg-card { animation: fadeInUp 0.6s ease both; }
        .reg-left { animation: fadeInUp 0.5s ease 0.1s both; }
        .reg-right { animation: fadeInUp 0.5s ease 0.2s both; }
        @keyframes popIn {
          0%   { transform: scale(0); opacity: 0; }
          60%  { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes drawCheck {
          from { stroke-dashoffset: 30; opacity: 0; }
          to   { stroke-dashoffset: 0;  opacity: 1; }
        }
      `}</style>
    </div>
  )
}

const inputWrap = (err) => ({
  display: 'flex', alignItems: 'center',
  border: `1.5px solid ${err ? '#ef4444' : '#d1d5db'}`,
  borderRadius: '10px', overflow: 'hidden',
  backgroundColor: '#fff', transition: 'border-color 0.2s',
})

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0047cc 0%, #0066FF 50%, #1a8cff 100%)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    fontFamily: "'Poppins', sans-serif",
    padding: '24px 16px', position: 'relative', overflow: 'hidden',
  },
  blob1: {
    position: 'absolute', top: '-80px', left: '-80px',
    width: '350px', height: '350px',
    background: 'rgba(255,255,255,0.07)', borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
    animation: 'blob 8s ease-in-out infinite',
  },
  blob2: {
    position: 'absolute', bottom: '-100px', right: '-60px',
    width: '300px', height: '300px',
    background: 'rgba(255,217,61,0.12)', borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%',
    animation: 'blob 10s ease-in-out infinite reverse',
  },
  logoTop: {
    cursor: 'pointer', marginBottom: '20px', zIndex: 2,
  },
  logoText: {
    fontSize: '1.8rem', fontWeight: 800, color: '#fff',
    letterSpacing: '-0.5px', textShadow: '0 2px 12px rgba(0,0,0,0.15)',
  },
  card: {
    display: 'flex', width: '100%', maxWidth: '860px',
    borderRadius: '24px', overflow: 'hidden',
    boxShadow: '0 25px 60px rgba(0,0,50,0.25)',
    zIndex: 2, animation: 'fadeInUp 0.6s ease both',
  },
  left: {
    flex: '0 0 42%', background: 'linear-gradient(160deg, #0052d4 0%, #0066ff 100%)',
    padding: '48px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
  },
  leftInner: { animation: 'fadeInUp 0.5s ease 0.2s both' },
  badge: {
    display: 'inline-block', backgroundColor: 'rgba(255,217,61,0.2)',
    color: '#FFD93D', borderRadius: '20px', padding: '4px 14px',
    fontSize: '0.78rem', fontWeight: 600, marginBottom: '20px', border: '1px solid rgba(255,217,61,0.3)',
  },
  leftTitle: {
    fontSize: '1.65rem', fontWeight: 800, color: '#fff',
    lineHeight: 1.3, marginBottom: '16px',
  },
  leftHighlight: {
    color: '#FFD93D', textDecoration: 'underline',
    textDecorationColor: 'rgba(255,217,61,0.5)',
  },
  leftDesc: {
    color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem',
    lineHeight: 1.7, marginBottom: '24px',
  },
  features: { display: 'flex', flexDirection: 'column', gap: '10px' },
  featureItem: {
    color: '#fff', fontSize: '0.85rem', fontWeight: 500,
    background: 'rgba(255,255,255,0.1)', borderRadius: '8px',
    padding: '8px 14px', backdropFilter: 'blur(4px)',
  },
  right: {
    flex: 1, backgroundColor: '#fff',
    padding: '40px 40px', overflowY: 'auto',
    animation: 'fadeInUp 0.5s ease 0.3s both',
  },
  formTitle: {
    fontSize: '1.5rem', fontWeight: 800, color: '#111',
    marginBottom: '4px',
  },
  formSub: { color: '#888', fontSize: '0.85rem', marginBottom: '24px' },
  fieldGroup: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#333', marginBottom: '6px' },
  inputIcon: { padding: '0 10px', fontSize: '1rem' },
  input: {
    flex: 1, border: 'none', outline: 'none',
    padding: '11px 8px', fontSize: '0.9rem',
    color: '#333', backgroundColor: 'transparent',
    fontFamily: "'Poppins', sans-serif",
  },
  eyeBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    padding: '0 12px', fontSize: '1rem',
  },
  error: { display: 'block', color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' },
  strengthBar: { display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' },
  strengthSegment: { height: '4px', flex: 1, borderRadius: '2px', transition: 'background-color 0.3s' },
  submitBtn: {
    width: '100%', padding: '13px', backgroundColor: '#111',
    color: '#fff', border: 'none', borderRadius: '10px',
    fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
    marginTop: '8px', marginBottom: '16px',
    transition: 'transform 0.15s, box-shadow 0.15s',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: '48px',
  },
  spinner: {
    width: '20px', height: '20px',
    border: '3px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff', borderRadius: '50%',
    display: 'inline-block', animation: 'spin 0.7s linear infinite',
  },
  loginLink: { textAlign: 'center', color: '#666', fontSize: '0.88rem' },
  loginAnchor: { color: '#0066FF', fontWeight: 700, cursor: 'pointer' },
  successBox: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', height: '100%', padding: '40px 20px', textAlign: 'center',
  },
  successIcon: { fontSize: '4rem', marginBottom: '16px', animation: 'fadeInUp 0.4s ease' },
  checkCircle: {
    width: '80px', height: '80px', borderRadius: '50%',
    backgroundColor: '#22c55e',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 20px',
    animation: 'popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
    boxShadow: '0 8px 24px rgba(34,197,94,0.4)',
  },
  progressBar: { width: '100%', height: '4px', backgroundColor: '#e5e7eb', borderRadius: '2px', marginTop: '20px', overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#0066FF', borderRadius: '2px', animation: 'progress 1.8s linear forwards' },
}
