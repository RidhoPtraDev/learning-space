import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
import Reminder from './pages/Reminder.jsx'
import AnalitikProgress from './pages/AnalitikProgress.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/lupa-password" element={<LupaPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/kelas/:id" element={<KelasDetail />} />
        <Route path="/kelas/:kelasId/materi/:materiId" element={<MateriDetail />} />
        <Route path="/riwayat" element={<RiwayatBelajar />} />
        <Route path="/favorit" element={<KelasFavorit />} />
        <Route path="/zoom" element={<KelasZoom />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/profil/edit" element={<EditProfil />} />
        <Route path="/analitik" element={<AnalitikProgress />} />
        <Route path="/reminder" element={<Reminder />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App