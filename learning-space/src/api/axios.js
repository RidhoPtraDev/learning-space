import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

// Otomatis sisipkan token JWT + bypass localtunnel interstitial page
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  // Bypass localtunnel "Click to Continue" page untuk API requests
  config.headers['bypass-tunnel-reminder'] = 'true'
  return config
})

export default api