import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminLayout } from './AdminDashboard.jsx'
import api from '../api/axios'

// Helper: tentukan src gambar icon kelas, mendukung 2 format:
// - URL lengkap (hasil upload baru): http://localhost:5000/uploads/kelas/xxx.png
// - nama file saja (data lama dari seed): icon-kimia.png -> dibaca dari /icons/
function resolveIconSrc(icon) {
  if (!icon) return null
  if (icon.startsWith('http://') || icon.startsWith('https://')) return icon
  return `/icons/${icon}`
}

export default function KelasMateri() {
  const navigate = useNavigate()
  const [kelasList, setKelasList] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [editingKelas, setEditingKelas] = useState(null) // null = mode tambah, object = mode edit
  const [form, setForm] = useState({ nama: '', deskripsi: '', kategori: 'Umum' })
  const [iconFile, setIconFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteError, setDeleteError] = useState('')

  const fetchKelas = async () => {
    setLoading(true)
    setErrorMsg('')
    try {
      const res = await api.get('/kelas')
      setKelasList(res.data.kelas)
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Gagal memuat data kelas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchKelas() }, [])

  const openTambah = () => {
    setEditingKelas(null)
    setForm({ nama: '', deskripsi: '', kategori: 'Umum' })
    setIconFile(null)
    setFormError('')
    setShowModal(true)
  }

  const openEdit = (kelas) => {
    setEditingKelas(kelas)
    setForm({ nama: kelas.nama, deskripsi: kelas.deskripsi || '', kategori: kelas.kategori || 'Umum' })
    setIconFile(null)
    setFormError('')
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.nama.trim()) {
      setFormError('Nama kelas wajib diisi')
      return
    }
    setSubmitting(true)
    setFormError('')

    const fd = new FormData()
    fd.append('nama', form.nama)
    fd.append('deskripsi', form.deskripsi)
    fd.append('kategori', form.kategori)
    if (iconFile) fd.append('icon', iconFile)

    try {
      if (editingKelas) {
        await api.put(`/kelas/${editingKelas.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      } else {
        await api.post('/kelas', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      }
      setShowModal(false)
      fetchKelas()
    } catch (err) {
      setFormError(err.response?.data?.message || 'Gagal menyimpan kelas')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteError('')
    try {
      await api.delete(`/kelas/${deleteTarget.id}`)
      setDeleteTarget(null)
      fetchKelas()
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Gagal menghapus kelas')
    }
  }

  return (
    <AdminLayout activeKey="kelas">
      <div style={s.headerRow}>
        <div>
          <h1 style={s.pageTitle}>Kelas & Materi</h1>
          <p style={s.pageDesc}>Kelola kelas pembelajaran. Klik sebuah kelas untuk mengatur materinya.</p>
        </div>
        <button style={s.addBtn} onClick={openTambah}>+ Tambah Kelas</button>
      </div>

      {loading && <p style={{ color: '#888' }}>Memuat data kelas...</p>}
      {!loading && errorMsg && <div style={s.errorBox}>{errorMsg}</div>}

      {!loading && !errorMsg && (
        <div style={s.grid}>
          {kelasList.map(k => (
            <div key={k.id} style={s.card}>
              <div style={s.cardTop} onClick={() => navigate(`/kelas/${k.id}`)}>
                <div style={s.iconBox}>
                  {resolveIconSrc(k.icon) ? (
                    <img src={resolveIconSrc(k.icon)} alt={k.nama} style={s.iconImg}
                      onError={e => { e.target.style.display = 'none' }} />
                  ) : (
                    <span style={{ color: '#fff', fontSize: '1.5rem' }}>📚</span>
                  )}
                </div>
                <h4 style={s.cardTitle}>{k.nama}</h4>
                <p style={s.cardDesc}>{k.deskripsi}</p>
                <span style={s.cardKategori}>{k.kategori || 'Umum'}</span>
              </div>
              <div style={s.cardActions}>
                <button style={s.editBtn} onClick={() => openEdit(k)}>Edit</button>
                <button style={s.deleteBtn} onClick={() => { setDeleteTarget(k); setDeleteError('') }}>Hapus</button>
              </div>
            </div>
          ))}

          {kelasList.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#888', padding: 40 }}>
              Belum ada kelas. Klik "Tambah Kelas" untuk membuat yang pertama.
            </div>
          )}
        </div>
      )}

      {/* ── MODAL TAMBAH/EDIT KELAS ── */}
      {showModal && (
        <div style={s.overlay} onClick={() => setShowModal(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h3 style={s.modalTitle}>{editingKelas ? 'Edit Kelas' : 'Tambah Kelas Baru'}</h3>
            <form onSubmit={handleSubmit}>
              <label style={s.label}>Nama Kelas</label>
              <input
                style={s.input}
                value={form.nama}
                onChange={e => setForm({ ...form, nama: e.target.value })}
                placeholder="Misal: Biologi"
              />

              <label style={s.label}>Deskripsi</label>
              <textarea
                style={{ ...s.input, minHeight: 80, resize: 'vertical' }}
                value={form.deskripsi}
                onChange={e => setForm({ ...form, deskripsi: e.target.value })}
                placeholder="Deskripsi singkat kelas ini"
              />

              <label style={s.label}>Kategori</label>
              <select
                style={s.input}
                value={form.kategori}
                onChange={e => setForm({ ...form, kategori: e.target.value })}
              >
                <option value="Umum">Umum</option>
                <option value="Digital">Digital</option>
                <option value="Sosial">Sosial</option>
                <option value="Hukum">Hukum</option>
                <option value="Lingkungan">Lingkungan</option>
              </select>

              <label style={s.label}>Icon Kelas {editingKelas && '(opsional, biarkan kosong jika tidak ingin mengganti)'}</label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                style={s.input}
                onChange={e => setIconFile(e.target.files[0] || null)}
              />
              {editingKelas?.icon && !iconFile && (
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '0.8rem', color: '#888' }}>Icon saat ini:</span>
                  <img src={resolveIconSrc(editingKelas.icon)} alt="" style={{ width: 32, height: 32, objectFit: 'contain' }} />
                </div>
              )}

              {formError && <p style={s.formError}>{formError}</p>}

              <div style={s.modalActions}>
                <button type="button" style={s.cancelBtn} onClick={() => setShowModal(false)}>Batal</button>
                <button type="submit" style={s.saveBtn} disabled={submitting}>
                  {submitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── KONFIRMASI HAPUS ── */}
      {deleteTarget && (
        <div style={s.overlay} onClick={() => setDeleteTarget(null)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h3 style={s.modalTitle}>Hapus Kelas?</h3>
            <p style={{ color: '#666', fontSize: '0.92rem', marginBottom: 16 }}>
              Yakin ingin menghapus kelas <strong>{deleteTarget.nama}</strong>? Tindakan ini tidak bisa dibatalkan.
            </p>
            {deleteError && <p style={s.formError}>{deleteError}</p>}
            <div style={s.modalActions}>
              <button style={s.cancelBtn} onClick={() => setDeleteTarget(null)}>Batal</button>
              <button style={s.deleteConfirmBtn} onClick={handleDelete}>Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

const s = {
  headerRow: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 },
  pageTitle: { fontSize: '2rem', fontWeight: 800, color: '#111', marginBottom: 6 },
  pageDesc: { color: '#666', fontSize: '0.92rem' },
  addBtn: { backgroundColor: '#0066FF', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 22px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: "'Poppins', sans-serif", flexShrink: 0 },

  errorBox: { backgroundColor: '#fee2e2', color: '#dc2626', padding: 16, borderRadius: 12 },

  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 },
  card: { backgroundColor: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' },
  cardTop: { padding: 20, cursor: 'pointer' },
  iconBox: { width: 52, height: 52, backgroundColor: '#EBF2FF', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, overflow: 'hidden' },
  iconImg: { width: 32, height: 32, objectFit: 'contain' },
  cardTitle: { fontSize: '1.05rem', fontWeight: 700, color: '#111', marginBottom: 4 },
  cardDesc: { fontSize: '0.85rem', color: '#666', lineHeight: 1.5, marginBottom: 8, minHeight: 40 },
  cardKategori: { display: 'inline-block', backgroundColor: '#f4f6fb', color: '#0066FF', fontSize: '0.75rem', fontWeight: 600, padding: '3px 10px', borderRadius: 20 },
  cardActions: { display: 'flex', borderTop: '1px solid #f0f0f0' },
  editBtn: { flex: 1, padding: '12px 0', border: 'none', backgroundColor: 'transparent', color: '#0066FF', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', fontFamily: "'Poppins', sans-serif" },
  deleteBtn: { flex: 1, padding: '12px 0', border: 'none', borderLeft: '1px solid #f0f0f0', backgroundColor: 'transparent', color: '#dc2626', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', fontFamily: "'Poppins', sans-serif" },

  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  modal: { backgroundColor: '#fff', borderRadius: 16, padding: 28, width: 420, maxHeight: '90vh', overflowY: 'auto' },
  modalTitle: { fontSize: '1.2rem', fontWeight: 800, color: '#111', marginBottom: 20 },
  label: { display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#333', marginBottom: 6, marginTop: 14 },
  input: { width: '100%', padding: '11px 12px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: '0.9rem', outline: 'none', fontFamily: "'Poppins', sans-serif" },
  formError: { color: '#dc2626', fontSize: '0.85rem', marginTop: 12, backgroundColor: '#fee2e2', padding: '10px 12px', borderRadius: 8 },
  modalActions: { display: 'flex', gap: 10, marginTop: 22 },
  cancelBtn: { flex: 1, padding: '11px 0', borderRadius: 10, border: '1.5px solid #e5e7eb', backgroundColor: '#fff', color: '#333', fontWeight: 600, cursor: 'pointer', fontFamily: "'Poppins', sans-serif" },
  saveBtn: { flex: 1, padding: '11px 0', borderRadius: 10, border: 'none', backgroundColor: '#0066FF', color: '#fff', fontWeight: 700, cursor: 'pointer', fontFamily: "'Poppins', sans-serif" },
  deleteConfirmBtn: { flex: 1, padding: '11px 0', borderRadius: 10, border: 'none', backgroundColor: '#dc2626', color: '#fff', fontWeight: 700, cursor: 'pointer', fontFamily: "'Poppins', sans-serif" },
}