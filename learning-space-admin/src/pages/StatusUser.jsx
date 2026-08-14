import React, { useState, useEffect, useCallback } from 'react'
import { AdminLayout } from './AdminDashboard.jsx'
import api from '../api/axios'

export default function StatusUser() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortField, setSortField] = useState('')
  const [actionLoading, setActionLoading] = useState(null)
  const [error, setError] = useState('')

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (search) params.search = search
      if (statusFilter) params.status = statusFilter
      if (sortField) params.sort = sortField

      const res = await api.get('/admin/users', { params })
      setUsers(res.data.users || [])
      setError('')
    } catch (err) {
      console.error('[StatusUser] Gagal memuat data user:', err)
      setError('Gagal memuat daftar user. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter, sortField])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleBan = async (user) => {
    const konfirmasi = window.confirm(`Blokir akun "${user.nama}" (${user.email})?`)
    if (!konfirmasi) return

    setActionLoading(user.id)
    try {
      const res = await api.patch(`/admin/users/${user.id}/ban`)
      alert(res.data.message)
      fetchUsers()
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal memblokir akun.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleUnban = async (user) => {
    const konfirmasi = window.confirm(`Buka blokir akun "${user.nama}" (${user.email})?`)
    if (!konfirmasi) return

    setActionLoading(user.id)
    try {
      const res = await api.patch(`/admin/users/${user.id}/unban`)
      alert(res.data.message)
      fetchUsers()
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal membuka blokir akun.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (user) => {
    const konfirmasi = window.confirm(
      `⚠️ HAPUS (Soft Delete) akun "${user.nama}" (${user.email})?\n\nAkun akan dinonaktifkan tetapi riwayat belajar tetap tersimpan di database.`
    )
    if (!konfirmasi) return

    setActionLoading(user.id)
    try {
      const res = await api.delete(`/admin/users/${user.id}`)
      alert(res.data.message)
      fetchUsers()
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus akun.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleRestore = async (user) => {
    const konfirmasi = window.confirm(`Pulihkan akun "${user.nama}" (${user.email}) yang telah dihapus?`)
    if (!konfirmasi) return

    setActionLoading(user.id)
    try {
      const res = await api.patch(`/admin/users/${user.id}/restore`)
      alert(res.data.message)
      fetchUsers()
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal memulihkan akun.')
    } finally {
      setActionLoading(null)
    }
  }

  const formatTanggal = (isoStr) => {
    const d = new Date(isoStr)
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <AdminLayout activeKey="status-user">
      <h1 style={s.pageTitle}>Status User</h1>
      <p style={s.pageDesc}>Pantau status akun siswa, batasi akses (ban/unban), atau hapus (soft delete) data pendaftaran.</p>

      {error && (
        <div style={s.errorAlert}>
          ⚠️ {error}
        </div>
      )}

      <div style={s.card}>
        <div style={s.headerRow}>
          <div>
            <h3 style={s.cardTitle}>Daftar Siswa</h3>
            <p style={{ color: '#888', fontSize: '0.8rem', margin: '4px 0 0' }}>
              {users.length} siswa ditemukan
            </p>
          </div>
          <div style={s.controlsWrap}>
            <input
              type="text"
              placeholder="Cari nama / email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={s.searchInput}
            />

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={s.selectInput}
            >
              <option value="">Semua Status</option>
              <option value="aktif">Aktif</option>
              <option value="banned">Di-ban</option>
              <option value="dihapus">Dihapus</option>
            </select>

            <select
              value={sortField}
              onChange={e => setSortField(e.target.value)}
              style={s.selectInput}
            >
              <option value="">Urutkan Default</option>
              <option value="streak">Streak Tertinggi 🔥</option>
            </select>
          </div>
        </div>

        <div style={s.tableWrap}>
          {loading ? (
            <p style={s.infoText}>Memuat data...</p>
          ) : users.length === 0 ? (
            <p style={s.infoText}>Tidak ada siswa ditemukan.</p>
          ) : (
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Siswa</th>
                  <th style={s.th}>Email</th>
                  <th style={s.th}>Tanggal Daftar</th>
                  <th style={s.th}>Streak Belajar</th>
                  <th style={s.th}>Status</th>
                  <th style={s.th}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ ...s.tr, opacity: u.status === 'dihapus' ? 0.6 : 1 }}>
                    <td style={s.td}>
                      <div style={s.studentInfo}>
                        {u.foto ? (
                          <img src={u.foto} alt="" style={s.avatar} onError={e => { e.target.style.display = 'none' }} />
                        ) : (
                          <div style={s.avatarFallback}>
                            {(u.nama || 'U').charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span style={s.name}>{u.nama}</span>
                      </div>
                    </td>
                    <td style={s.td}>{u.email}</td>
                    <td style={s.td}>{formatTanggal(u.createdAt)}</td>
                    <td style={s.td}>
                      <span style={s.badgeStreak}>🔥 {u.streak} Hari</span>
                    </td>
                    <td style={s.td}>
                      {u.status === 'dihapus' && <span style={s.badgeDihapus}>🚫 Dihapus</span>}
                      {u.status === 'banned' && <span style={s.badgeBanned}>🔒 Di-ban</span>}
                      {u.status === 'aktif' && <span style={s.badgeAktif}>✅ Aktif</span>}
                    </td>
                    <td style={s.td}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {u.status === 'aktif' && (
                          <>
                            <button
                              onClick={() => handleBan(u)}
                              disabled={actionLoading === u.id}
                              style={{ ...s.btnAction, backgroundColor: '#f59e0b' }}
                            >
                              Ban
                            </button>
                            <button
                              onClick={() => handleDelete(u)}
                              disabled={actionLoading === u.id}
                              style={{ ...s.btnAction, backgroundColor: '#ef4444' }}
                            >
                              Hapus
                            </button>
                          </>
                        )}

                        {u.status === 'banned' && (
                          <>
                            <button
                              onClick={() => handleUnban(u)}
                              disabled={actionLoading === u.id}
                              style={{ ...s.btnAction, backgroundColor: '#10b981' }}
                            >
                              Unban
                            </button>
                            <button
                              onClick={() => handleDelete(u)}
                              disabled={actionLoading === u.id}
                              style={{ ...s.btnAction, backgroundColor: '#ef4444' }}
                            >
                              Hapus
                            </button>
                          </>
                        )}

                        {u.status === 'dihapus' && (
                          <button
                            onClick={() => handleRestore(u)}
                            disabled={actionLoading === u.id}
                            style={{ ...s.btnAction, backgroundColor: '#6366f1' }}
                          >
                            Pulihkan
                          </button>
                        )}
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
  errorAlert: { backgroundColor: '#fee2e2', color: '#dc2626', padding: '14px 20px', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '24px', fontWeight: 600, border: '1.5px solid #fca5a5' },
  card: { backgroundColor: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' },
  cardTitle: { fontSize: '1.1rem', fontWeight: 800, color: '#111', margin: 0 },
  controlsWrap: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  searchInput: { padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #e5e7eb', fontSize: '0.85rem', outline: 'none', fontFamily: "'Poppins', sans-serif" },
  selectInput: { padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #e5e7eb', fontSize: '0.85rem', outline: 'none', backgroundColor: '#fff', fontFamily: "'Poppins', sans-serif", cursor: 'pointer' },
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
  badgeAktif: { backgroundColor: '#f0fdf4', color: '#16a34a', padding: '4px 10px', borderRadius: '20px', fontWeight: 700, fontSize: '0.78rem', whiteSpace: 'nowrap' },
  badgeBanned: { backgroundColor: '#fff7ed', color: '#c2410c', padding: '4px 10px', borderRadius: '20px', fontWeight: 700, fontSize: '0.78rem', whiteSpace: 'nowrap' },
  badgeDihapus: { backgroundColor: '#f3f4f6', color: '#6b7280', padding: '4px 10px', borderRadius: '20px', fontWeight: 700, fontSize: '0.78rem', whiteSpace: 'nowrap' },
  btnAction: { padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem', color: '#fff', transition: 'opacity 0.2s', whiteSpace: 'nowrap' },
  infoText: { textAlign: 'center', color: '#888', padding: '40px 0', fontSize: '0.9rem' }
}
