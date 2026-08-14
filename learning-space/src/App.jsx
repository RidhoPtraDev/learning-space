import React, { Suspense, lazy, Component } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'

// Halaman publik — eager load (ringan, selalu butuh cepat)
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import LupaPassword from './pages/LupaPassword.jsx'

// Halaman OTP verifikasi — eager (bagian dari alur registrasi yang kritis)
import VerifikasiOtp from './pages/VerifikasiOtp.jsx'

// Halaman user besar — lazy load untuk mempercepat initial load
const Dashboard     = lazy(() => import('./pages/Dashboard.jsx'))
const KelasDetail   = lazy(() => import('./pages/KelasDetail.jsx'))
const MateriDetail  = lazy(() => import('./pages/MateriDetail.jsx'))
const RiwayatBelajar = lazy(() => import('./pages/RiwayatBelajar.jsx'))
const KelasFavorit  = lazy(() => import('./pages/KelasFavorit.jsx'))
const KelasZoom     = lazy(() => import('./pages/KelasZoom.jsx'))
const Profil        = lazy(() => import('./pages/Profil.jsx'))
const EditProfil    = lazy(() => import('./pages/EditProfil.jsx'))
const AnalitikProgress = lazy(() => import('./pages/Analitikprogress.jsx'))
const Reminder = lazy(() => import('./pages/Reminder.jsx'))

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, background: '#fee2e2', color: '#dc2626', fontFamily: "'Poppins', sans-serif", margin: 24, borderRadius: 12, border: '1.5px solid #fca5a5' }}>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '1.3rem', fontWeight: 800 }}>⚠️ Terjadi Kesalahan Rendering</h2>
          <p style={{ margin: '0 0 16px 0', fontSize: '0.9rem', color: '#555' }}>Halaman ini mengalami crash karena runtime error berikut:</p>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#fff', padding: 12, borderRadius: 8, fontSize: '0.85rem', color: '#333', border: '1px solid #f5c2c2', overflowX: 'auto' }}>{this.state.error?.toString()}</pre>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#fff', padding: 12, borderRadius: 8, fontSize: '0.75rem', color: '#666', border: '1px solid #f5c2c2', marginTop: 8, overflowX: 'auto' }}>{this.state.error?.stack}</pre>
          <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', marginTop: 16, fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>Muat Ulang Halaman</button>
        </div>
      )
    }
    return this.props.children
  }
}

// Loading fallback sederhana — tampilkan saat chunk lazy sedang dimuat
function PageLoading() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8faff',
      fontFamily: "'Poppins', sans-serif",
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '40px', height: '40px',
          border: '4px solid #dbeafe',
          borderTopColor: '#0066FF',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 16px',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: '#0066FF', fontWeight: 600, margin: 0 }}>Memuat halaman...</p>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<PageLoading />}>
          <Routes>
            {/* Halaman publik */}
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/lupa-password" element={<LupaPassword />} />
            <Route path="/verifikasi-otp" element={<VerifikasiOtp />} />

            {/* Halaman user (wajib login) */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/kelas/:id" element={<ProtectedRoute><KelasDetail /></ProtectedRoute>} />
            <Route path="/kelas/:kelasId/materi/:materiId" element={<ProtectedRoute><MateriDetail /></ProtectedRoute>} />
            <Route path="/riwayat" element={<ProtectedRoute><RiwayatBelajar /></ProtectedRoute>} />
            <Route path="/favorit" element={<ProtectedRoute><KelasFavorit /></ProtectedRoute>} />
            <Route path="/zoom" element={<ProtectedRoute><KelasZoom /></ProtectedRoute>} />
            <Route path="/analitik" element={<ProtectedRoute><AnalitikProgress /></ProtectedRoute>} />
            <Route path="/reminder" element={<ProtectedRoute><Reminder /></ProtectedRoute>} />
            <Route path="/profil" element={<ProtectedRoute><Profil /></ProtectedRoute>} />
            <Route path="/profil/edit" element={<ProtectedRoute><EditProfil /></ProtectedRoute>} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App