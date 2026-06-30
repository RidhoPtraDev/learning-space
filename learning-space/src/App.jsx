import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'

import Home from './pages/Home.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import LupaPassword from './pages/LupaPassword.jsx'
import Dashboard from './pages/Dashboard.jsx'
import KelasDetail from './pages/KelasDetail.jsx'
import MateriDetail from './pages/MateriDetail.jsx'
import RiwayatBelajar from './pages/RiwayatBelajar.jsx'
import KelasFavorit from './pages/KelasFavorit.jsx'
import KelasZoom from './pages/KelasZoom.jsx'
import Profil from './pages/Profil.jsx'
import EditProfil from './pages/EditProfil.jsx'
import AnalitikProgress from './pages/AnalitikProgress.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman publik */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/lupa-password" element={<LupaPassword />} />

        {/* Halaman user (wajib login) */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/kelas/:id" element={<ProtectedRoute><KelasDetail /></ProtectedRoute>} />
        <Route path="/kelas/:kelasId/materi/:materiId" element={<ProtectedRoute><MateriDetail /></ProtectedRoute>} />
        <Route path="/riwayat" element={<ProtectedRoute><RiwayatBelajar /></ProtectedRoute>} />
        <Route path="/favorit" element={<ProtectedRoute><KelasFavorit /></ProtectedRoute>} />
        <Route path="/zoom" element={<ProtectedRoute><KelasZoom /></ProtectedRoute>} />
        <Route path="/analitik" element={<ProtectedRoute><AnalitikProgress /></ProtectedRoute>} />
        <Route path="/profil" element={<ProtectedRoute><Profil /></ProtectedRoute>} />
        <Route path="/profil/edit" element={<ProtectedRoute><EditProfil /></ProtectedRoute>} />

      </Routes>
    </BrowserRouter>
  )
}

export default App