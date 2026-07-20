import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.email.trim()) e.email = 'Email wajib diisi'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Format email tidak valid'
    if (!form.password) e.password = 'Password wajib diisi'
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
      setTimeout(() => navigate('/dashboard'), 1800)
    }, 1500)
  }

  return (
    <div style={styles.page}>
      {/* Animated background blobs */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />
      <div style={styles.blob3} />

      {/* Logo */}
      <div style={styles.logoWrap} onClick={() => navigate('/')}>
        <span style={styles.logoText}>LearningSpace</span>
      </div>

      {/* Card */}
      <div style={styles.card}>
        {success ? (
          <div style={styles.successBox}>
            <div style={styles.checkCircle}>
              <svg style={{ animation: 'drawCheck 0.5s ease 0.3s both' }} width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h3 style={{ color: '#111', fontWeight: 700, marginBottom: 8 }}>Berhasil Masuk!</h3>
            <p style={{ color: '#555', fontSize: '0.9rem' }}>Mengarahkan ke dashboard...</p>
            <div style={styles.progressBar}>
              <div style={styles.progressFill} />
            </div>
          </div>
        ) : (
          <>
            {/* Icon */}
            <div style={styles.iconWrap}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
            </div>

            <h2 style={styles.title}>
              Masuk ke Learning<span style={styles.titleHighlight}>Space</span>
            </h2>
            <p style={styles.subtitle}>Lanjutkan perjalanan belajarmu dan akses materi kapan saja.</p>

            <form onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div style={styles.fieldGroup}>
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
              </div>

              {/* Lupa kata sandi */}
              <div style={{ textAlign: 'right', marginTop: '-8px', marginBottom: '20px' }}>
                <span onClick={() => navigate('/lupa-password')} style={styles.forgotLink}>Lupa Kata Sandi?</span>
              </div>

              {/* Submit */}
              <button type="submit" style={styles.submitBtn} disabled={loading}>
                {loading ? <span style={styles.spinner} /> : 'Masuk Sekarang'}
              </button>
            </form>

            <p style={styles.registerLink}>
              Belum Punya Akun?{' '}
              <span onClick={() => navigate('/register')} style={styles.registerAnchor}>
                Daftar Disini
              </span>
            </p>
          </>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes progress {
          from { width: 0% }
          to   { width: 100% }
        }
        @keyframes blob {
          0%,100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50%      { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
        }
        @keyframes float {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-8px); }
        }
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
  borderRadius: '12px', overflow: 'hidden',
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
    position: 'absolute', top: '-100px', left: '-80px',
    width: '380px', height: '380px',
    background: 'rgba(255,255,255,0.07)',
    borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
    animation: 'blob 8s ease-in-out infinite',
  },
  blob2: {
    position: 'absolute', bottom: '-120px', right: '-60px',
    width: '320px', height: '320px',
    background: 'rgba(255,217,61,0.1)',
    borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%',
    animation: 'blob 10s ease-in-out infinite reverse',
  },
  blob3: {
    position: 'absolute', top: '40%', right: '10%',
    width: '180px', height: '180px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '50%',
    animation: 'float 6s ease-in-out infinite',
  },
  logoWrap: {
    cursor: 'pointer', marginBottom: '24px', zIndex: 2,
  },
  logoText: {
    fontSize: '1.9rem', fontWeight: 800, color: '#fff',
    letterSpacing: '-0.5px', textShadow: '0 2px 12px rgba(0,0,0,0.15)',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '24px',
    padding: '40px 44px',
    width: '100%', maxWidth: '440px',
    boxShadow: '0 25px 60px rgba(0,0,50,0.25)',
    zIndex: 2,
    animation: 'fadeInUp 0.6s ease both',
  },
  iconWrap: {
    width: '64px', height: '64px',
    border: '2px solid #e5e7eb', borderRadius: '16px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 20px', animation: 'float 4s ease-in-out infinite',
  },
  title: {
    fontSize: '1.5rem', fontWeight: 800, color: '#111',
    textAlign: 'center', marginBottom: '8px',
  },
  titleHighlight: {
    borderBottom: '3px solid #FFD93D',
    paddingBottom: '1px',
  },
  subtitle: {
    color: '#888', fontSize: '0.875rem',
    textAlign: 'center', lineHeight: 1.6,
    marginBottom: '28px',
  },
  fieldGroup: { marginBottom: '14px' },
  inputIcon: { padding: '0 10px', fontSize: '1rem' },
  input: {
    flex: 1, border: 'none', outline: 'none',
    padding: '12px 8px', fontSize: '0.9rem',
    color: '#333', backgroundColor: 'transparent',
    fontFamily: "'Poppins', sans-serif",
  },
  eyeBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    padding: '0 12px', fontSize: '1rem',
  },
  error: {
    display: 'block', color: '#ef4444',
    fontSize: '0.75rem', marginTop: '4px',
  },
  forgotLink: {
    fontSize: '0.82rem', color: '#0066FF',
    fontWeight: 600, cursor: 'pointer',
  },
  submitBtn: {
    width: '100%', padding: '14px',
    backgroundColor: '#111', color: '#fff',
    border: 'none', borderRadius: '12px',
    fontSize: '1rem', fontWeight: 700,
    cursor: 'pointer', marginBottom: '20px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: '50px', transition: 'transform 0.15s, opacity 0.15s',
  },
  spinner: {
    width: '20px', height: '20px',
    border: '3px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff', borderRadius: '50%',
    display: 'inline-block', animation: 'spin 0.7s linear infinite',
  },
  registerLink: {
    textAlign: 'center', color: '#666', fontSize: '0.88rem', margin: 0,
  },
  registerAnchor: {
    color: '#0066FF', fontWeight: 700, cursor: 'pointer',
  },
  successBox: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '20px', textAlign: 'center',
  },
  successIcon: {
    fontSize: '4rem', marginBottom: '16px',
    animation: 'fadeInUp 0.4s ease',
  },
  checkCircle: {
    width: '80px', height: '80px', borderRadius: '50%',
    backgroundColor: '#22c55e',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 20px',
    animation: 'popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
    boxShadow: '0 8px 24px rgba(34,197,94,0.4)',
  },
  progressBar: {
    width: '100%', height: '4px',
    backgroundColor: '#e5e7eb', borderRadius: '2px',
    marginTop: '20px', overflow: 'hidden',
  },
  progressFill: {
    height: '100%', backgroundColor: '#0066FF',
    borderRadius: '2px', animation: 'progress 1.8s linear forwards',
  },
}
