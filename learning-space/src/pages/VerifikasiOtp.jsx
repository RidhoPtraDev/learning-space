import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../api/axios'

export default function VerifikasiOtp() {
  const navigate = useNavigate()
  const location = useLocation()

  // Inisialisasi email langsung dari route state/query params — hindari setState di dalam effect
  const [email] = useState(() => {
    const stateEmail = location.state?.email
    if (stateEmail) return stateEmail
    const searchParams = new URLSearchParams(location.search)
    return searchParams.get('email') || ''
  })

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(false)

  const otpRefs = useRef([])

  useEffect(() => {
    // Jika tidak ada email, kembalikan ke register
    if (!email) {
      navigate('/register')
    }
  }, [email, navigate])

  const startResendTimer = (seconds = 60) => {
    setResendTimer(seconds)
    const interval = setInterval(() => {
      setResendTimer(t => {
        if (t <= 1) {
          clearInterval(interval)
          return 0
        }
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
    setServerError('')
    if (value && index < 5) otpRefs.current[index + 1]?.focus()
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length < 6) {
      setErrors({ otp: 'Masukkan 6 digit kode OTP' })
      return
    }
    setErrors({})
    setServerError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/verify-otp', {
        email,
        otp: code,
      })
      
      // Simpan token JWT dan data user ke localStorage (seperti alur login biasa)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      
      setLoading(false)
      setSuccess(true)
      
      setTimeout(() => {
        navigate('/dashboard')
      }, 1500)
    } catch (err) {
      setLoading(false)
      const msg = err.response?.data?.message || 'Kode OTP salah atau sudah kadaluarsa.'
      setServerError(msg)
    }
  }

  const handleResend = async () => {
    if (resendTimer > 0) return
    setServerError('')
    try {
      await api.post('/auth/resend-otp', { email })
      setOtp(['', '', '', '', '', ''])
      startResendTimer(60)
      alert('Kode OTP baru telah dikirim ke email Anda.')
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal mengirim ulang kode OTP.'
      setServerError(msg)
      if (err.response?.data?.sisaDetik) {
        startResendTimer(err.response.data.sisaDetik)
      }
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />
      <div style={styles.blob3} />

      <div style={styles.logoWrap} onClick={() => navigate('/')}>
        <span style={styles.logoText}>LearningSpace</span>
      </div>

      <div style={styles.card}>
        {success ? (
          <div style={styles.successBox}>
            <div style={styles.successIconCircle}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h2 style={{ ...styles.title, marginTop: 16 }}>Verifikasi Berhasil!</h2>
            <p style={styles.subtitle}>
              Akun Anda telah diaktifkan secara sukses. Mengarahkan Anda ke Dashboard belajar...
            </p>
          </div>
        ) : (
          <div style={styles.stepContent}>
            <div style={styles.iconWrap}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h2 style={styles.title}>Verifikasi Email Anda</h2>
            <p style={styles.subtitle}>
              Kami telah mengirimkan 6 digit kode verifikasi ke <strong style={{ color: '#111' }}>{email}</strong>. Masukkan kode tersebut di bawah ini.
            </p>

            {serverError && (
              <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px', textAlign: 'center' }}>
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
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
                      borderColor: errors.otp || serverError ? '#ef4444' : (digit ? '#0066FF' : '#d1d5db'),
                    }}
                  />
                ))}
              </div>
              {errors.otp && <span style={{ ...styles.error, display: 'block', textAlign: 'center', marginBottom: 12 }}>{errors.otp}</span>}

              <button type="submit" style={styles.submitBtn} disabled={loading}>
                {loading ? <span style={styles.spinner} /> : 'Verifikasi Akun'}
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

            <p style={styles.backLink} onClick={() => navigate('/register')}>
              ← Ganti email pendaftaran
            </p>
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

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0047cc 0%, #0066FF 50%, #1a8cff 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Poppins', sans-serif",
    padding: '24px 16px',
    position: 'relative',
    overflow: 'hidden',
  },
  blob1: {
    position: 'absolute',
    top: '-100px',
    left: '-80px',
    width: '380px',
    height: '380px',
    background: 'rgba(255,255,255,0.07)',
    borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
    animation: 'blob 8s ease-in-out infinite',
  },
  blob2: {
    position: 'absolute',
    bottom: '-120px',
    right: '-60px',
    width: '320px',
    height: '320px',
    background: 'rgba(255,217,61,0.1)',
    borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%',
    animation: 'blob 10s ease-in-out infinite reverse',
  },
  blob3: {
    position: 'absolute',
    top: '40%',
    right: '8%',
    width: '160px',
    height: '160px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '50%',
    animation: 'float 6s ease-in-out infinite',
  },
  logoWrap: { cursor: 'pointer', marginBottom: '24px', zIndex: 2 },
  logoText: {
    fontSize: '1.9rem',
    fontWeight: 800,
    color: '#fff',
    letterSpacing: '-0.5px',
    textShadow: '0 2px 12px rgba(0,0,0,0.15)',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '24px',
    padding: '40px 44px',
    width: '100%',
    maxWidth: '460px',
    boxShadow: '0 25px 60px rgba(0,0,50,0.25)',
    zIndex: 2,
    animation: 'fadeInUp 0.6s ease both',
  },
  stepContent: { animation: 'fadeInUp 0.4s ease both' },
  iconWrap: {
    width: '64px',
    height: '64px',
    border: '2px solid #e5e7eb',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    animation: 'float 4s ease-in-out infinite',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#111',
    textAlign: 'center',
    marginBottom: '8px',
  },
  subtitle: {
    color: '#888',
    fontSize: '0.875rem',
    textAlign: 'center',
    lineHeight: 1.6,
    marginBottom: '28px',
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#111',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: '4px',
    marginBottom: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '50px',
    fontFamily: "'Poppins', sans-serif",
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '3px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 0.7s linear infinite',
  },
  backLink: {
    textAlign: 'center',
    color: '#0066FF',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '20px',
  },
  otpRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '16px',
  },
  otpBox: {
    width: '46px',
    height: '54px',
    textAlign: 'center',
    fontSize: '1.3rem',
    fontWeight: 700,
    color: '#111',
    border: '1.5px solid #d1d5db',
    borderRadius: '12px',
    outline: 'none',
    fontFamily: "'Poppins', sans-serif",
    transition: 'border-color 0.2s',
  },
  resendText: {
    textAlign: 'center',
    color: '#888',
    fontSize: '0.85rem',
    marginTop: '16px',
  },
  resendLink: { color: '#0066FF', fontWeight: 700, cursor: 'pointer' },
  successBox: { textAlign: 'center', animation: 'fadeInUp 0.4s ease both' },
  successIconCircle: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    backgroundColor: '#22c55e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    animation: 'popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
  },
  error: { display: 'block', color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' },
}
