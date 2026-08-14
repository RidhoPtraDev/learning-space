import React, { useState, useEffect, useCallback } from 'react'
import { AdminLayout } from './AdminDashboard.jsx'
import api from '../api/axios'

export default function LogAktifitas() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [actionLoading, setActionLoading] = useState(null) // ID user yang sedang diproses

  const [error, setError] = useState('')

  const fetchActivities = useCallback(async () => {
    try {
      const res = await api.get('/admin/user-activities')
      setActivities(res.data.activities || [])
      setError('')
    } catch (err) {
      console.error('[LogAktifitas] Gagal memuat data aktivitas user:', err)
      setError('Gagal memuat daftar user. Silakan periksa koneksi internet Anda atau silakan login ulang.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchActivities()
    // Polling tiap 10 detik untuk update real-time
    const interval = setInterval(fetchActivities, 10000)
    return () => clearInterval(interval)
  }, [fetchActivities])

  const handleBan = async (user) => {
    const konfirmasi = window.confirm(
      user.isBanned
        ? `Buka blokir akun "${user.nama}" (${user.email})?`
        : `Blokir akun "${user.nama}" (${user.email})?\n\nUser tidak akan bisa login setelah diblokir.`
    )
    if (!konfirmasi) return

    setActionLoading(user.id)
    try {
      const res = await api.put(`/admin/users/${user.id}/ban`)
      alert(res.data.message)
      await fetchActivities() // refresh dari server
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal mengubah status ban.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (user) => {
    const konfirmasi = window.confirm(
      `⚠️ HAPUS PERMANEN akun "${user.nama}" (${user.email})?\n\nSemua riwayat belajar, favorit, dan data terkait akan ikut dihapus.\nTindakan ini TIDAK BISA dibatalkan!`
    )
    if (!konfirmasi) return

    // Konfirmasi kedua untuk aksi berbahaya
    const konfirmasi2 = window.confirm(`Yakin hapus akun ${user.email} secara permanen?`)
    if (!konfirmasi2) return

    setActionLoading(user.id)
    try {
      const res = await api.delete(`/admin/users/${user.id}`)
      alert(res.data.message)
      await fetchActivities() // refresh dari server
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus akun.')
    } finally {
      setActionLoading(null)
    }
  }

  const filtered = activities.filter(act =>
    (act.nama || act.name || '').toLowerCase().includes(search.toLowerCase()) ||
    act.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout activeKey="aktifitas">
      <h1 style={s.pageTitle}>Daftar User</h1>
      <p style={s.pageDesc}>Pantau aktivitas siswa, kelola status akun, dan hapus akun yang melanggar aturan.</p>

      {error && (
        <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '14px 20px', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '24px', fontWeight: 600, border: '1.5px solid #fca5a5' }}>
          ⚠️ {error}
        </div>
      )}

      <div style={s.card}>
        <div style={s.headerRow}>
          <div>
            <h3 style={s.cardTitle}>Daftar Siswa Terdaftar</h3>
            <p style={{ color: '#888', fontSize: '0.8rem', margin: '4px 0 0' }}>
              {activities.length} user · Auto-refresh tiap 10 detik
            </p>
          </div>
          <div style={s.searchWrap}>
            <input
              type="text"
              placeholder="Cari siswa..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={s.searchInput}
            />
          </div>
        </div>

        <div style={s.tableWrap}>
          {loading ? (
            <p style={s.infoText}>Memuat data...</p>
          ) : filtered.length === 0 ? (
            <p style={s.infoText}>Tidak ada siswa ditemukan.</p>
          ) : (
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Siswa</th>
                  <th style={s.th}>Email</th>
                  <th style={s.th}>Streak Belajar</th>
                  <th style={s.th}>Materi Dipelajari</th>
                  <th style={s.th}>Status</th>
                  <th style={s.th}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(act => (
                  <tr key={act.id} style={{ ...s.tr, opacity: act.isBanned ? 0.65 : 1 }}>
                    <td style={s.td}>
                      <div style={s.studentInfo}>
                        {act.foto ? (
                          <img src={act.foto} alt={act.nama} style={s.avatar} onError={e => { e.target.style.display = 'none' }} />
                        ) : (
                          <div style={s.avatarFallback}>
                            {(act.nama || act.name || 'U').charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <span style={s.name}>{act.nama || act.name}</span>
                        </div>
                      </div>
                    </td>
                    <td style={s.td}>{act.email}</td>
                    <td style={s.td}>
                      <span style={s.badgeStreak}>🔥 {act.streak} Hari</span>
                    </td>
                    <td style={s.td}>
                      <span style={s.badgeMateri}>📚 {act.materiDipelajari} Materi</span>
                    </td>
                    <td style={s.td}>
                      {act.isBanned ? (
                        <span style={s.badgeBanned}>🚫 Diblokir</span>
                      ) : (
                        <span style={s.badgeAktif}>✅ Aktif</span>
                      )}
                    </td>
                    <td style={s.td}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleBan(act)}
                          disabled={actionLoading === act.id}
                          style={{
                            ...s.btnBan,
                            backgroundColor: act.isBanned ? '#22c55e' : '#f59e0b',
                          }}
                        >
                          {actionLoading === act.id ? '...' : (act.isBanned ? 'Buka Blokir' : 'Ban')}
                        </button>
                        <button
                          onClick={() => handleDelete(act)}
                          disabled={actionLoading === act.id}
                          style={s.btnHapus}
                        >
                          {actionLoading === act.id ? '...' : 'Hapus'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

const s = {
  pageTitle: { fontSize: '2.2rem', fontWeight: 800, color: '#111', marginBottom: '8px' },
  pageDesc: { color: '#666', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '28px' },
  card: { backgroundColor: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' },
  cardTitle: { fontSize: '1.1rem', fontWeight: 800, color: '#111', margin: 0 },
  searchWrap: { width: '240px' },
  searchInput: { width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #e5e7eb', fontSize: '0.85rem', outline: 'none', fontFamily: "'Poppins', sans-serif", boxSizing: 'border-box' },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '12px 16px', borderBottom: '2px solid #e5e7eb', color: '#555', fontWeight: 700, fontSize: '0.85rem', whiteSpace: 'nowrap' },
  tr: { borderBottom: '1px solid #f0f0f0', transition: 'background 0.15s' },
  td: { padding: '12px 16px', fontSize: '0.88rem', color: '#444', verticalAlign: 'middle' },
  studentInfo: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: { width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 },
  avatarFallback: { width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#EBF2FF', color: '#0066FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 },
  name: { fontWeight: 600, color: '#111' },
  badgeStreak: { backgroundColor: '#FFF5EB', color: '#FD7E14', padding: '4px 10px', borderRadius: '20px', fontWeight: 700, fontSize: '0.78rem', whiteSpace: 'nowrap' },
  badgeMateri: { backgroundColor: '#EBF8FF', color: '#0088FF', padding: '4px 10px', borderRadius: '20px', fontWeight: 700, fontSize: '0.78rem', whiteSpace: 'nowrap' },
  badgeAktif: { backgroundColor: '#f0fdf4', color: '#16a34a', padding: '4px 10px', borderRadius: '20px', fontWeight: 700, fontSize: '0.78rem', whiteSpace: 'nowrap' },
  badgeBanned: { backgroundColor: '#fff1f2', color: '#dc2626', padding: '4px 10px', borderRadius: '20px', fontWeight: 700, fontSize: '0.78rem', whiteSpace: 'nowrap' },
  btnBan: { padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem', color: '#fff', transition: 'opacity 0.2s', whiteSpace: 'nowrap' },
  btnHapus: { padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem', backgroundColor: '#ef4444', color: '#fff', transition: 'opacity 0.2s', whiteSpace: 'nowrap' },
  infoText: { textAlign: 'center', color: '#888', padding: '40px 0', fontSize: '0.9rem' }
}
