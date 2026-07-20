import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AdminLayout } from './AdminDashboard.jsx'
import api from '../api/axios'

function resolveIconSrc(icon) {
  if (!icon) return null
  if (icon.startsWith('http://') || icon.startsWith('https://')) return icon
  return `/icons/${icon}`
}

// Helper: deskripsi disimpan sebagai JSON string array di database.
// Untuk form, kita tampilkan/terima sebagai textarea biasa (1 paragraf per baris).
function deskripsiArrayToText(raw) {
  if (!raw) return ''
  try {
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? arr.join('\n') : String(arr)
  } catch {
    return raw
  }
}

export default function KelasDetailAdmin() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [kelas, setKelas] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [editingMateri, setEditingMateri] = useState(null)
  const [form, setForm] = useState({
    judul: '', deskripsiSingkat: '', deskripsi: '',
    videoUrl: '', videoJudul: '', jurnalJudul: '', jurnalUrl: '',
  })
  const [ilustrasiFile, setIlustrasiFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteError, setDeleteError] = useState('')

  const fetchKelas = async () => {
    setLoading(true)
    setErrorMsg('')
    try {
      const res = await api.get(`/kelas/${id}`)
      setKelas(res.data.kelas)
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Gagal memuat data kelas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchKelas() }, [id])

  const resetForm = () => setForm({
    judul: '', deskripsiSingkat: '', deskripsi: '',
    videoUrl: '', videoJudul: '', jurnalJudul: '', jurnalUrl: '',
  })

  const openTambah = () => {
    setEditingMateri(null)
    resetForm()
    setIlustrasiFile(null)
    setFormError('')
    setShowModal(true)
  }

  const openEdit = (m) => {
    setEditingMateri(m)
    setForm({
      judul: m.judul || '',
      deskripsiSingkat: m.deskripsiSingkat || '',
      deskripsi: deskripsiArrayToText(m.deskripsi),
      videoUrl: m.videoUrl || '',
      videoJudul: m.videoJudul || '',
      jurnalJudul: m.jurnalJudul || '',
      jurnalUrl: m.jurnalUrl || '',
    })
    setIlustrasiFile(null)
    setFormError('')
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.judul.trim()) {
      setFormError('Judul materi wajib diisi')
      return
    }
    setSubmitting(true)
    setFormError('')

    const fd = new FormData()
    Object.entries(form).forEach(([key, val]) => fd.append(key, val))
    if (ilustrasiFile) fd.append('ilustrasi', ilustrasiFile)

    try {
      if (editingMateri) {
        await api.put(`/kelas/${id}/materi/${editingMateri.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      } else {
        await api.post(`/kelas/${id}/materi`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      }
      setShowModal(false)
      fetchKelas()
    } catch (err) {
      setFormError(err.response?.data?.message || 'Gagal menyimpan materi')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteError('')
    try {
      await api.delete(`/kelas/${id}/materi/${deleteTarget.id}`)
      setDeleteTarget(null)
      fetchKelas()
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Gagal menghapus materi')
    }
  }

  const daftarMateri = kelas?.Materis || []

  return (
    <AdminLayout activeKey="kelas">
      <button style={s.backBtn} onClick={() => navigate('/kelas')}>‹ Kembali ke Daftar Kelas</button>

      {loading && <p style={{ color: '#888' }}>Memuat data...</p>}
      {!loading && errorMsg && <div style={s.errorBox}>{errorMsg}</div>}

      {!loading && !errorMsg && kelas && (
        <>
          <div style={s.headerRow}>
            <div>
              <h1 style={s.pageTitle}>{kelas.nama}</h1>
              <p style={s.pageDesc}>{kelas.deskripsi}</p>
            </div>
            <button style={s.addBtn} onClick={openTambah}>+ Tambah Materi</button>
          </div>

          <div style={s.grid}>
            {daftarMateri.map(m => (
              <div key={m.id} style={s.card}>
                <div style={s.cardTop}>
                  <div style={s.iconBox}>
                    {resolveIconSrc(m.ilustrasi) ? (
                      <img src={resolveIconSrc(m.ilustrasi)} alt={m.judul} style={s.iconImg}
                        onError={e => { e.target.style.display = 'none' }} />
                    ) : (
                      <span style={{ color: '#0066FF', fontSize: '1.4rem' }}>📄</span>
                    )}
                  </div>
                  <h4 style={s.cardTitle}>{m.judul}</h4>
                  <p style={s.cardDesc}>{m.deskripsiSingkat}</p>
                </div>
                <div style={s.cardActions}>
                  <button style={s.editBtn} onClick={() => openEdit(m)}>Edit</button>
                  <button style={s.deleteBtn} onClick={() => { setDeleteTarget(m); setDeleteError('') }}>Hapus</button>
                </div>
              </div>
            ))}

            {daftarMateri.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#888', padding: 40 }}>
                Belum ada materi di kelas ini. Klik "Tambah Materi" untuk membuat yang pertama.
              </div>
            )}
          </div>
        </>
      )}

      {/* ── MODAL TAMBAH/EDIT MATERI ── */}
      {showModal && (
        <div style={s.overlay} onClick={() => setShowModal(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h3 style={s.modalTitle}>{editingMateri ? 'Edit Materi' : 'Tambah Materi Baru'}</h3>
            <form onSubmit={handleSubmit}>
              <label style={s.label}>Judul Materi</label>
              <input style={s.input} value={form.judul} onChange={e => setForm({ ...form, judul: e.target.value })} placeholder="Misal: Pengantar Kimia" />

              <label style={s.label}>Deskripsi Singkat</label>
              <input style={s.input} value={form.deskripsiSingkat} onChange={e => setForm({ ...form, deskripsiSingkat: e.target.value })} placeholder="Ringkasan 1 kalimat" />

              <label style={s.label}>Deskripsi Panjang (1 paragraf per baris)</label>
              <textarea
                style={{ ...s.input, minHeight: 100, resize: 'vertical' }}
                value={form.deskripsi}
                onChange={e => setForm({ ...form, deskripsi: e.target.value })}
                placeholder={"Paragraf pertama...\nParagraf kedua..."}
              />

              <label style={s.label}>Ilustrasi Materi {editingMateri && '(opsional, biarkan kosong jika tidak ingin mengganti)'}</label>
              <input type="file" accept="image/png,image/jpeg,image/webp" style={s.input}
                onChange={e => setIlustrasiFile(e.target.files[0] || null)} />
              {editingMateri?.ilustrasi && !ilustrasiFile && (
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '0.8rem', color: '#888' }}>Ilustrasi saat ini:</span>
                  <img src={resolveIconSrc(editingMateri.ilustrasi)} alt="" style={{ width: 32, height: 32, objectFit: 'contain' }} />
                </div>
              )}

              <label style={s.label}>Link Video YouTube</label>
              <input style={s.input} value={form.videoUrl} onChange={e => setForm({ ...form, videoUrl: e.target.value })} placeholder="https://youtu.be/..." />

              <label style={s.label}>Judul Video</label>
              <input style={s.input} value={form.videoJudul} onChange={e => setForm({ ...form, videoJudul: e.target.value })} placeholder="Judul video pembelajaran" />

              <label style={s.label}>Judul Jurnal</label>
              <input style={s.input} value={form.jurnalJudul} onChange={e => setForm({ ...form, jurnalJudul: e.target.value })} placeholder="Judul jurnal/artikel" />

              <label style={s.label}>Link Jurnal</label>
              <input style={s.input} value={form.jurnalUrl} onChange={e => setForm({ ...form, jurnalUrl: e.target.value })} placeholder="https://..." />

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
            <h3 style={s.modalTitle}>Hapus Materi?</h3>
            <p style={{ color: '#666', fontSize: '0.92rem', marginBottom: 16 }}>
              Yakin ingin menghapus materi <strong>{deleteTarget.judul}</strong>? Tindakan ini tidak bisa dibatalkan.
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
  backBtn: { background: 'none', border: 'none', color: '#0066FF', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', marginBottom: 16, padding: 0, fontFamily: "'Poppins', sans-serif" },
  headerRow: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 },
  pageTitle: { fontSize: '2rem', fontWeight: 800, color: '#111', marginBottom: 6 },
  pageDesc: { color: '#666', fontSize: '0.92rem', maxWidth: 500 },
  addBtn: { backgroundColor: '#0066FF', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 22px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: "'Poppins', sans-serif", flexShrink: 0 },

  errorBox: { backgroundColor: '#fee2e2', color: '#dc2626', padding: 16, borderRadius: 12 },

  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 },
  card: { backgroundColor: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' },
  cardTop: { padding: 20 },
  iconBox: { width: 52, height: 52, backgroundColor: '#EBF2FF', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, overflow: 'hidden' },
  iconImg: { width: 32, height: 32, objectFit: 'contain' },
  cardTitle: { fontSize: '1.05rem', fontWeight: 700, color: '#111', marginBottom: 4 },
  cardDesc: { fontSize: '0.85rem', color: '#666', lineHeight: 1.5, minHeight: 40 },
  cardActions: { display: 'flex', borderTop: '1px solid #f0f0f0' },
  editBtn: { flex: 1, padding: '12px 0', border: 'none', backgroundColor: 'transparent', color: '#0066FF', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', fontFamily: "'Poppins', sans-serif" },
  deleteBtn: { flex: 1, padding: '12px 0', border: 'none', borderLeft: '1px solid #f0f0f0', backgroundColor: 'transparent', color: '#dc2626', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', fontFamily: "'Poppins', sans-serif" },

  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 },
  modal: { backgroundColor: '#fff', borderRadius: 16, padding: 28, width: 460, maxHeight: '90vh', overflowY: 'auto' },
  modalTitle: { fontSize: '1.2rem', fontWeight: 800, color: '#111', marginBottom: 20 },
  label: { display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#333', marginBottom: 6, marginTop: 14 },
  input: { width: '100%', padding: '11px 12px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: '0.9rem', outline: 'none', fontFamily: "'Poppins', sans-serif" },
  formError: { color: '#dc2626', fontSize: '0.85rem', marginTop: 12, backgroundColor: '#fee2e2', padding: '10px 12px', borderRadius: 8 },
  modalActions: { display: 'flex', gap: 10, marginTop: 22 },
  cancelBtn: { flex: 1, padding: '11px 0', borderRadius: 10, border: '1.5px solid #e5e7eb', backgroundColor: '#fff', color: '#333', fontWeight: 600, cursor: 'pointer', fontFamily: "'Poppins', sans-serif" },
  saveBtn: { flex: 1, padding: '11px 0', borderRadius: 10, border: 'none', backgroundColor: '#0066FF', color: '#fff', fontWeight: 700, cursor: 'pointer', fontFamily: "'Poppins', sans-serif" },
  deleteConfirmBtn: { flex: 1, padding: '11px 0', borderRadius: 10, border: 'none', backgroundColor: '#dc2626', color: '#fff', fontWeight: 700, cursor: 'pointer', fontFamily: "'Poppins', sans-serif" },
}