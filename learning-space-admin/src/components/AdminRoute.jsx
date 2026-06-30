import { Navigate } from 'react-router-dom'

function isTokenExpired(token) {
  try {
    // JWT payload ada di bagian kedua (index 1), di-encode base64
    const payload = JSON.parse(atob(token.split('.')[1]))
    // exp adalah unix timestamp dalam detik
    return payload.exp < Math.floor(Date.now() / 1000)
  } catch {
    // Token malformed — anggap expired
    return true
  }
}

export default function AdminRoute({ children }) {
  const token = sessionStorage.getItem('token')
  const user  = JSON.parse(sessionStorage.getItem('user') || 'null')

  // Tidak ada token sama sekali
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // Token sudah expired — bersihkan storage dan redirect ke login
  if (isTokenExpired(token)) {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    return <Navigate to="/login" replace />
  }

  // Token ada tapi bukan admin
  if (!user || user.role !== 'admin') {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    return <Navigate to="/login" replace />
  }

  return children
}