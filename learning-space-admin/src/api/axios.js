import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

// Otomatis sisipkan token JWT (kalau ada) ke setiap request
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: tangkap 401 global → redirect ke login otomatis
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Hapus sesi yang invalid/expired
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('user')
      // Redirect ke login hanya kalau belum di halaman login
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login?reason=expired'
      }
    }
    return Promise.reject(error)
  }
)

export default api
