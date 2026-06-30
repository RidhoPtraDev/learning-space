import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LupaPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: email, 2: otp, 3: password baru, 4: done
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [pass, setPass] = useState({ baru: '', konfirmasi: '' })
  const [showPass, setShowPass] = useState({ baru: false, konfirmasi: false })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  const otpRefs = useRef([])

  // ── STEP 1: Kirim Email ─────────────────────────────────────
  const handleSendEmail = (e) => {
    e.preventDefault()
    if (!email.trim()) { setErrors({ email: 'Email wajib diisi' }); return }
    if (!/\S+@\S+\.\S+/.test(email)) { setErrors({ email: 'Format email tidak valid' }); return }
    setErrors({})
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep(2)
      startResendTimer()
    }, 1300)
  }

  // ── STEP 2: Verifikasi OTP ───────────────────────────────────
  const startResendTimer = () => {
    setResendTimer(30)
    const interval = setInterval(() => {
      setResendTimer(t => {
        if (t <= 1) { clearInterval(interval); return 0 }
        return t - 1
      })
    }, 1000)
  }

  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setErrors({ ...errors, otp: '' })
    if (value && index < 5) otpRefs.current[index + 1]?.focus()
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleVerifyOtp = (e) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length < 6) { setErrors({ otp: 'Masukkan 6 digit kode OTP' }); return }
    setErrors({})
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep(3)
    }, 1300)
  }

  const handleResend = () => {
    if (resendTimer > 0) return
    setOtp(['', '', '', '', '', ''])
    startResendTimer()
  }

  // ── STEP 3: Password Baru ────────────────────────────────────
  const validatePassword = () => {
    const e = {}
    if (!pass.baru) e.baru = 'Password wajib diisi'
    else if (pass.baru.length < 8) e.baru = 'Password minimal 8 karakter'
    if (!pass.konfirmasi) e.konfirmasi = 'Konfirmasi password wajib diisi'
    else if (pass.baru !== pass.konfirmasi) e.konfirmasi = 'Password tidak cocok'
    return e
  }

  const handleResetPassword = (e) => {
    e.preventDefault()
    const e2 = validatePassword()
    if (Object.keys(e2).length > 0) { setErrors(e2); return }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep(4)
    }, 1300)
  }

  // ── STEPPER INDICATOR ────────────────────────────────────────
  const steps = [
    { num: 1, label: 'Email' },
    { num: 2, label: 'Verifikasi' },
    { num: 3, label: 'Password Baru' },
  ]

  return (
    <div style={styles.page}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />
      <div style={styles.blob3} />

      <div style={styles.logoWrap} onClick={() => navigate('/')}>
        <span style={styles.logoText}>LearningSpace</span>
      </div>

      <div style={styles.card}>

        {/* ── Stepper (hide on success) ── */}
        {step < 4 && (
          <div style={styles.stepper}>
            {steps.map((s, i) => (
              <React.Fragment key={s.num}>
                <div style={styles.stepItem}>
                  <div style={{
                    ...styles.stepCircle,
                    backgroundColor: step >= s.num ? '#0066FF' : '#fff',
                    borderColor: step >= s.num ? '#0066FF' : '#d1d5db',
                    color: step >= s.num ? '#fff' : '#999',
                  }}>
                    {step > s.num ? '✓' : s.num}
                  </div>
                  <span style={{
                    ...styles.stepLabel,
                    color: step >= s.num ? '#0066FF' : '#999',
                    fontWeight: step === s.num ? 700 : 500,
                  }}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div style={{
                    ...styles.stepLine,
                    backgroundColor: step > s.num ? '#0066FF' : '#e5e7eb',
                  }} />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* ── STEP 1: EMAIL ── */}
        {step === 1 && (
          <div key="step1" style={styles.stepContent}>
            <div style={styles.iconWrap}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <h2 style={styles.title}>Lupa Password?</h2>
            <p style={styles.subtitle}>
              Tenang, masukkan email akunmu dan kami akan mengirimkan kode OTP untuk mengatur ulang password.
            </p>

            <form onSubmit={handleSendEmail} noValidate>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Email</label>
                <div style={inputWrap(errors.email)}>
                  <span style={styles.inputIcon}>✉️</span>
                  <input
                    type="email"
                    placeholder="Masukkan email kamu"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setErrors({}) }}
                    style={styles.input}
                  />
                </div>
                {errors.email && <span style={styles.error}>{errors.email}</span>}
              </div>

              <button type="submit" style={styles.submitBtn} disabled={loading}>
                {loading ? <span style={styles.spinner} /> : 'Kirim Kode OTP'}
              </button>
            </form>

            <p style={styles.backLink} onClick={() => navigate('/login')}>
              ← Kembali ke Masuk
            </p>
          </div>
        )}

        {/* ── STEP 2: OTP ── */}
        {step === 2 && (
          <div key="step2" style={styles.stepContent}>
            <div style={styles.iconWrap}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h2 style={styles.title}>Masukkan Kode OTP</h2>
            <p style={styles.subtitle}>
              Kami telah mengirimkan kode 6 digit ke <strong style={{ color: '#111' }}>{email || 'email kamu'}</strong>. Masukkan kode tersebut di bawah ini.
            </p>

            <form onSubmit={handleVerifyOtp} noValidate>
              <div style={styles.otpRow}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => otpRefs.current[i] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    style={{
                      ...styles.otpBox,
                      borderColor: errors.otp ? '#ef4444' : (digit ? '#0066FF' : '#d1d5db'),
                    }}
                  />
                ))}
              </div>
              {errors.otp && <span style={{ ...styles.error, display: 'block', textAlign: 'center', marginBottom: 12 }}>{errors.otp}</span>}

              <button type="submit" style={styles.submitBtn} disabled={loading}>
                {loading ? <span style={styles.spinner} /> : 'Verifikasi Kode'}
              </button>
            </form>

            <p style={styles.resendText}>
              Tidak menerima kode?{' '}
              {resendTimer > 0 ? (
                <span style={{ color: '#999' }}>Kirim ulang dalam {resendTimer}s</span>
              ) : (
                <span style={styles.resendLink} onClick={handleResend}>Kirim Ulang</span>
              )}
            </p>

            <p style={styles.backLink} onClick={() => setStep(1)}>
              ← Ganti email
            </p>
          </div>
        )}

        {/* ── STEP 3: PASSWORD BARU ── */}
        {step === 3 && (
          <div key="step3" style={styles.stepContent}>
            <div style={styles.iconWrap}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><circle cx="12" cy="16" r="1"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>
              </svg>
            </div>
            <h2 style={styles.title}>Buat Password Baru</h2>
            <p style={styles.subtitle}>
              Password baru harus berbeda dari password sebelumnya dan minimal 8 karakter.
            </p>

            <form onSubmit={handleResetPassword} noValidate>
              {/* Password Baru */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Password Baru</label>
                <div style={inputWrap(errors.baru)}>
                  <span style={styles.inputIcon}>🔑</span>
                  <input
                    type={showPass.baru ? 'text' : 'password'}
                    placeholder="Isi Password Baru"
                    value={pass.baru}
                    onChange={e => { setPass({ ...pass, baru: e.target.value }); setErrors({ ...errors, baru: '' }) }}
                    style={styles.input}
                  />
                  <button type="button" onClick={() => setShowPass({ ...showPass, baru: !showPass.baru })} style={styles.eyeBtn}>
                    {showPass.baru ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.baru && <span style={styles.error}>{errors.baru}</span>}
                {pass.baru && !errors.baru && (
                  <div style={styles.strengthBar}>
                    {[1,2,3,4].map(n => (
                      <div key={n} style={{
                        ...styles.strengthSegment,
                        backgroundColor: pass.baru.length >= n * 2
                          ? (pass.baru.length >= 8 ? '#22c55e' : '#f59e0b')
                          : '#e5e7eb'
                      }} />
                    ))}
                    <span style={{ fontSize: '0.75rem', color: pass.baru.length >= 8 ? '#22c55e' : '#f59e0b', marginLeft: 6 }}>
                      {pass.baru.length >= 8 ? 'Kuat' : 'Lemah'}
                    </span>
                  </div>
                )}
              </div>

              {/* Konfirmasi Password */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Konfirmasi Password Baru</label>
                <div style={inputWrap(errors.konfirmasi)}>
                  <span style={styles.inputIcon}>🔑</span>
                  <input
                    type={showPass.konfirmasi ? 'text' : 'password'}
                    placeholder="Ulangi Password Baru"
                    value={pass.konfirmasi}
                    onChange={e => { setPass({ ...pass, konfirmasi: e.target.value }); setErrors({ ...errors, konfirmasi: '' }) }}
                    style={styles.input}
                  />
                  <button type="button" onClick={() => setShowPass({ ...showPass, konfirmasi: !showPass.konfirmasi })} style={styles.eyeBtn}>
                    {showPass.konfirmasi ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.konfirmasi && <span style={styles.error}>{errors.konfirmasi}</span>}
                {pass.konfirmasi && pass.baru === pass.konfirmasi && !errors.konfirmasi && (
                  <span style={{ fontSize: '0.75rem', color: '#22c55e' }}>✓ Password cocok</span>
                )}
              </div>

              <button type="submit" style={styles.submitBtn} disabled={loading}>
                {loading ? <span style={styles.spinner} /> : 'Simpan Password Baru'}
              </button>
            </form>
          </div>
        )}

        {/* ── STEP 4: DONE ── */}
        {step === 4 && (
          <div key="step4" style={styles.successBox}>
            <div style={styles.successIconCircle}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h2 style={{ ...styles.title, marginTop: 8 }}>Password Berhasil Diubah!</h2>
            <p style={styles.subtitle}>
              Password baru kamu sudah berhasil disimpan. Sekarang kamu bisa masuk menggunakan password barumu.
            </p>
            <button style={styles.submitBtn} onClick={() => navigate('/login')}>
              Masuk Sekarang
            </button>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes blob {
          0%,100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50%      { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
        }
        @keyframes popIn {
          0%   { transform: scale(0); opacity: 0; }
          60%  { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes float {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-8px); }
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
    position: 'absolute', top: '40%', right: '8%',
    width: '160px', height: '160px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '50%',
    animation: 'float 6s ease-in-out infinite',
  },
  logoWrap: { cursor: 'pointer', marginBottom: '24px', zIndex: 2 },
  logoText: {
    fontSize: '1.9rem', fontWeight: 800, color: '#fff',
    letterSpacing: '-0.5px', textShadow: '0 2px 12px rgba(0,0,0,0.15)',
  },
  card: {
    backgroundColor: '#fff', borderRadius: '24px',
    padding: '40px 44px', width: '100%', maxWidth: '460px',
    boxShadow: '0 25px 60px rgba(0,0,50,0.25)',
    zIndex: 2, animation: 'fadeInUp 0.6s ease both',
  },

  // Stepper
  stepper: { display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '28px' },
  stepItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' },
  stepCircle: {
    width: '32px', height: '32px', borderRadius: '50%',
    border: '2px solid', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.85rem', fontWeight: 700, transition: 'all 0.3s',
  },
  stepLabel: { fontSize: '0.7rem', whiteSpace: 'nowrap', transition: 'all 0.3s' },
  stepLine: { width: '32px', height: '2px', margin: '0 4px 18px', transition: 'background-color 0.3s' },

  stepContent: { animation: 'fadeInUp 0.4s ease both' },

  iconWrap: {
    width: '64px', height: '64px',
    border: '2px solid #e5e7eb', borderRadius: '16px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 20px', animation: 'float 4s ease-in-out infinite',
  },
  title: { fontSize: '1.5rem', fontWeight: 800, color: '#111', textAlign: 'center', marginBottom: '8px' },
  subtitle: { color: '#888', fontSize: '0.875rem', textAlign: 'center', lineHeight: 1.6, marginBottom: '28px' },

  fieldGroup: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#333', marginBottom: '6px' },
  inputIcon: { padding: '0 10px', fontSize: '1rem' },
  input: {
    flex: 1, border: 'none', outline: 'none',
    padding: '12px 8px', fontSize: '0.9rem',
    color: '#333', backgroundColor: 'transparent',
    fontFamily: "'Poppins', sans-serif",
  },
  eyeBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '0 12px', fontSize: '1rem' },
  error: { display: 'block', color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' },

  strengthBar: { display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' },
  strengthSegment: { height: '4px', flex: 1, borderRadius: '2px', transition: 'background-color 0.3s' },

  submitBtn: {
    width: '100%', padding: '14px',
    backgroundColor: '#111', color: '#fff',
    border: 'none', borderRadius: '12px',
    fontSize: '1rem', fontWeight: 700,
    cursor: 'pointer', marginTop: '4px', marginBottom: '4px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: '50px', fontFamily: "'Poppins', sans-serif",
  },
  spinner: {
    width: '20px', height: '20px',
    border: '3px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff', borderRadius: '50%',
    display: 'inline-block', animation: 'spin 0.7s linear infinite',
  },

  backLink: {
    textAlign: 'center', color: '#0066FF', fontSize: '0.85rem',
    fontWeight: 600, cursor: 'pointer', marginTop: '20px',
  },

  // OTP
  otpRow: { display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '16px' },
  otpBox: {
    width: '46px', height: '54px', textAlign: 'center',
    fontSize: '1.3rem', fontWeight: 700, color: '#111',
    border: '1.5px solid #d1d5db', borderRadius: '12px',
    outline: 'none', fontFamily: "'Poppins', sans-serif",
    transition: 'border-color 0.2s',
  },
  resendText: { textAlign: 'center', color: '#888', fontSize: '0.85rem', marginTop: '16px' },
  resendLink: { color: '#0066FF', fontWeight: 700, cursor: 'pointer' },

  // Success
  successBox: { textAlign: 'center', animation: 'fadeInUp 0.4s ease both' },
  successIconCircle: {
    width: '72px', height: '72px', borderRadius: '50%',
    backgroundColor: '#22c55e', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    margin: '0 auto', animation: 'popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
  },
}
