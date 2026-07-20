import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginAdmin from './pages/LoginAdmin.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import KelasMateri from './pages/KelasMateri.jsx'
import KelasDetailAdmin from './pages/KelasDetailAdmin.jsx'
import ZoomMeetingAdmin from './pages/ZoomMeetingAdmin.jsx'
import ProfilAdmin from './pages/ProfilAdmin.jsx'
import TestimoniAdmin from './pages/TestimoniAdmin.jsx'
import LayananAdmin from './pages/LayananAdmin.jsx'
import LogAktifitas from './pages/LogAktifitas.jsx'
import StatusUser from './pages/StatusUser.jsx'
import AdminRoute from './components/AdminRoute.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginAdmin />} />

        {/* Semua route di bawah ini wajib login + role admin */}
        <Route path="/" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/status-user" element={<AdminRoute><StatusUser /></AdminRoute>} />
        <Route path="/kelas" element={<AdminRoute><KelasMateri /></AdminRoute>} />
        <Route path="/kelas/:id" element={<AdminRoute><KelasDetailAdmin /></AdminRoute>} />
        <Route path="/zoom" element={<AdminRoute><ZoomMeetingAdmin /></AdminRoute>} />
        <Route path="/profil" element={<AdminRoute><ProfilAdmin /></AdminRoute>} />
        <Route path="/testimoni" element={<AdminRoute><TestimoniAdmin /></AdminRoute>} />
        <Route path="/layanan" element={<AdminRoute><LayananAdmin /></AdminRoute>} />
        <Route path="/log-aktifitas" element={<AdminRoute><LogAktifitas /></AdminRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App