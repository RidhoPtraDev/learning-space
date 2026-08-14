import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function LoginAdmin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Tampilkan pesan sesi habis kalau diarahkan dari interceptor 401
  const isExpired = new URLSearchParams(window.location.search).get('reason') === 'expired'

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/login', form)

      // Halaman ini KHUSUS admin — kalau yang login bukan admin, tolak di sisi
      // client juga (validasi sungguhan tetap di backend lewat adminMiddleware,
      // ini cuma supaya user biasa tidak nyasar masuk dashboard admin).
      if (res.data.user.role !== 'admin') {
        setError('Akun ini bukan akun admin. Gunakan halaman login khusus user.')
        setLoading(false)
        return
      }

      sessionStorage.setItem('token', res.data.token)
      sessionStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan, coba lagi')
      setLoading(false)
    }
  }

  return (
    <div style={s.wrap}>
      <div style={s.card}>
        <h1 style={s.logo}>
          Learning<span style={{ color: '#FFD93D' }}>Space</span>
        </h1>
        <p style={s.subtitle}>Admin Panel</p>

        <form onSubmit={handleSubmit}>
          {isExpired && (
            <p style={{ color: '#d97706', fontSize: '0.85rem', marginBottom: '16px', backgroundColor: '#fffbeb', padding: '10px 12px', borderRadius: '8px', border: '1px solid #fde68a' }}>
              ⏰ Sesi Anda telah berakhir. Silakan login kembali.
            </p>
          )}

          <label style={s.label}>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            style={s.input}
            placeholder="admin@learningspace.com"
            required
          />

          <label style={s.label}>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            style={s.input}
            placeholder="••••••••"
            required
          />

          {error && <p style={s.error}>{error}</p>}

          <button type="submit" style={s.button} disabled={loading}>
            {loading ? 'Memproses...' : 'Masuk ke Dashboard'}
          </button>
        </form>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Poppins', sans-serif; }
      `}</style>
    </div>
  )
}

const s = {
  wrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f4f6fb' },
  card: { backgroundColor: '#fff', borderRadius: '20px', padding: '40px', width: '380px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  logo: { fontSize: '1.6rem', fontWeight: 800, color: '#0066FF', textAlign: 'center', marginBottom: '4px' },
  subtitle: { textAlign: 'center', color: '#888', fontSize: '0.85rem', marginBottom: '28px', fontWeight: 600, letterSpacing: '0.5px' },
  label: { display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#333', marginBottom: '6px', marginTop: '16px' },
  input: { width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #e5e7eb', fontSize: '0.92rem', outline: 'none' },
  error: { color: '#dc2626', fontSize: '0.85rem', marginTop: '12px', backgroundColor: '#fee2e2', padding: '10px 12px', borderRadius: '8px' },
  button: { width: '100%', marginTop: '24px', padding: '13px', backgroundColor: '#0066FF', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' },
}