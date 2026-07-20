import React, { useState, useEffect, useRef } from 'react'
import { AdminLayout } from './AdminDashboard.jsx'
import api from '../api/axios'

const IMG_PLACEHOLDER = 'https://placehold.co/400x220/e5e7eb/aaa?text=Gambar+Layanan'

function Badge({ active }) {
  return (
    <span style={{
      display: 'inline-block', borderRadius: 20, padding: '2px 10px', fontSize: '0.75rem', fontWeight: 700,
      backgroundColor: active ? '#dcfce7' : '#f3f4f6',
      color: active ? '#16a34a' : '#888',
    }}>
      {active ? 'Ditampilkan' : 'Disembunyikan'}
    </span>
  )
}

// ── Modal tambah / edit ───────────────────────────────────────
function Modal({ data, onClose, onSave }) {
  const isEdit = !!data?.id
  const [form, setForm] = useState({
    judul: data?.judul || '',
    deskripsi: data?.deskripsi || '',
    urutan: data?.urutan ?? 0,
    tampil: data?.tampil !== false,
  })
  const [gambarPreview, setGambarPreview] = useState(data?.gambar || null)
  const [gambarFile, setGambarFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const gambarRef = useRef()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleGambar = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 3 * 1024 * 1024) { setError('Gambar maksimal 3MB'); return }
    setGambarFile(file)
    setGambarPreview(URL.createObjectURL(file))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.judul.trim()) { setError('Judul layanan wajib diisi'); return }
    setLoading(true)
    setError('')

    const fd = new FormData()
    fd.append('judul', form.judul)
    fd.append('deskripsi', form.deskripsi)
    fd.append('urutan', form.urutan)
    fd.append('tampil', form.tampil)
    if (gambarFile) fd.append('gambar', gambarFile)

    try {
      if (isEdit) {
        await api.put(`/layanan/admin/${data.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      } else {
        await api.post('/layanan/admin', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      }
      onSave()
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={ms.overlay} onClick={onClose}>
      <div style={ms.modal} onClick={e => e.stopPropagation()}>
        <div style={ms.header}>
          <h3 style={ms.title}>{isEdit ? 'Edit Layanan' : 'Tambah Layanan'}</h3>
          <button onClick={onClose} style={ms.closeBtn}>✕</button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Gambar */}
          <div style={{ marginBottom: 18 }}>
            <label style={ms.label}>Gambar Layanan</label>
            <div
              onClick={() => gambarRef.current?.click()}
              style={{
                width: '100%', height: 160, borderRadius: 12, overflow: 'hidden',
                border: '2px dashed #d1d5db', cursor: 'pointer', position: 'relative',
                backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {gambarPreview ? (
                <img src={gambarPreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => { e.target.src = IMG_PLACEHOLDER }} />
              ) : (
                <div style={{ textAlign: 'center', color: '#aaa' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 8 }}>
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <p style={{ fontSize: '0.8rem', margin: 0 }}>Klik untuk upload gambar</p>
                  <p style={{ fontSize: '0.72rem', margin: '4px 0 0' }}>JPG, PNG, WEBP · maks 3MB</p>
                </div>
              )}
              {gambarPreview && (
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.35)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0)'}
                >
                  <span style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 600, opacity: 0, transition: 'opacity 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = 0}
                  >Ganti Gambar</span>
                </div>
              )}
            </div>
            <input ref={gambarRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleGambar} />
          </div>

          <div style={ms.fieldGroup}>
            <label style={ms.label}>Judul Layanan <span style={{ color: '#dc2626' }}>*</span></label>
            <input name="judul" value={form.judul} onChange={handleChange} placeholder="cth. Baca Materi & Jurnal" style={ms.input} />
          </div>

          <div style={ms.fieldGroup}>
            <label style={ms.label}>Deskripsi Singkat</label>
            <textarea name="deskripsi" value={form.deskripsi} onChange={handleChange} rows={3}
              placeholder="Deskripsi singkat layanan ini..." style={{ ...ms.input, resize: 'vertical', minHeight: 80 }} />
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ ...ms.fieldGroup, flex: 1 }}>
              <label style={ms.label}>Urutan Tampil</label>
              <input type="number" name="urutan" value={form.urutan} onChange={handleChange} min={0} style={ms.input} />
            </div>
            <div style={{ ...ms.fieldGroup, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <label style={{ ...ms.label, marginBottom: 10 }}>
                <input type="checkbox" name="tampil" checked={form.tampil} onChange={handleChange} style={{ marginRight: 8 }} />
                Tampilkan di homepage
              </label>
            </div>
          </div>

          {error && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: 12 }}>{error}</p>}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={ms.cancelBtn}>Batal</button>
            <button type="submit" style={{ ...ms.saveBtn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Tambah Layanan')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const ms = {
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 },
  modal: { backgroundColor: '#fff', borderRadius: 18, padding: 28, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  title: { fontSize: '1.1rem', fontWeight: 800, color: '#111' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#888', lineHeight: 1 },
  fieldGroup: { marginBottom: 14 },
  label: { display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#333', marginBottom: 6 },
  input: { width: '100%', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '10px 14px', fontSize: '0.92rem', outline: 'none', fontFamily: "'Poppins', sans-serif", boxSizing: 'border-box' },
  cancelBtn: { padding: '10px 22px', backgroundColor: '#f3f4f6', color: '#555', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontFamily: "'Poppins', sans-serif" },
  saveBtn: { padding: '10px 22px', backgroundColor: '#0066FF', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontFamily: "'Poppins', sans-serif" },
}

// ── Halaman utama Layanan admin ───────────────────────────────
export default function LayananAdmin() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [confirmDel, setConfirmDel] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await api.get('/layanan/admin')
      setList(res.data.layanan)
    } catch {
      showToast('Gagal memuat data layanan')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleSave = () => { setModal(null); fetchData(); showToast('Layanan berhasil disimpan!') }

  const handleToggleTampil = async (l) => {
    try {
      const fd = new FormData()
      fd.append('judul', l.judul)
      fd.append('tampil', !l.tampil)
      await api.put(`/layanan/admin/${l.id}`, fd)
      fetchData()
    } catch { showToast('Gagal mengubah status tampil') }
  }

  const handleDelete = async () => {
    if (!confirmDel) return
    setDeleting(true)
    try {
      await api.delete(`/layanan/admin/${confirmDel}`)
      setConfirmDel(null)
      fetchData()
      showToast('Layanan berhasil dihapus')
    } catch { showToast('Gagal menghapus layanan') }
    finally { setDeleting(false) }
  }

  return (
    <AdminLayout activeKey="layanan">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111', marginBottom: 4 }}>Layanan Kami</h1>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>Kelola layanan yang ditampilkan di halaman utama website.</p>
        </div>
        <button onClick={() => setModal({})} style={s.addBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Tambah Layanan
        </button>
      </div>

      {/* Stat pills */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={s.pill}><span style={{ fontWeight: 800, color: '#0066FF', fontSize: '1.1rem' }}>{list.length}</span> Total</div>
        <div style={s.pill}><span style={{ fontWeight: 800, color: '#16a34a', fontSize: '1.1rem' }}>{list.filter(l => l.tampil).length}</span> Ditampilkan</div>
        <div style={s.pill}><span style={{ fontWeight: 800, color: '#888', fontSize: '1.1rem' }}>{list.filter(l => !l.tampil).length}</span> Disembunyikan</div>
      </div>

      {/* Grid layanan */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#888' }}>Memuat...</div>
      ) : list.length === 0 ? (
        <div style={s.empty}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🛎️</div>
          <p style={{ fontWeight: 700, color: '#333', marginBottom: 4 }}>Belum ada layanan</p>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>Klik tombol "Tambah Layanan" untuk mulai menambahkan.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {list.map(l => (
            <div key={l.id} style={{ ...s.card, opacity: l.tampil ? 1 : 0.6 }}>
              {/* Gambar */}
              <div style={{ position: 'relative', borderRadius: '12px 12px 0 0', overflow: 'hidden', height: 160 }}>
                <img
                  src={l.gambar || IMG_PLACEHOLDER}
                  alt={l.judul}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => { e.target.src = IMG_PLACEHOLDER }}
                />
                <div style={{ position: 'absolute', top: 10, right: 10 }}>
                  <Badge active={l.tampil} />
                </div>
              </div>

              {/* Konten */}
              <div style={{ padding: '16px 18px' }}>
                <p style={{ fontWeight: 700, color: '#111', fontSize: '0.95rem', marginBottom: 6 }}>{l.judul}</p>
                {l.deskripsi && (
                  <p style={{ color: '#666', fontSize: '0.83rem', lineHeight: 1.6, marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {l.deskripsi}
                  </p>
                )}

                {/* Footer */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                  <span style={{ color: '#aaa', fontSize: '0.75rem' }}>Urutan: #{l.urutan}</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => handleToggleTampil(l)}
                      style={{ ...s.iconBtn, backgroundColor: l.tampil ? '#f3f4f6' : '#dcfce7', color: l.tampil ? '#888' : '#16a34a' }}
                      title={l.tampil ? 'Sembunyikan' : 'Tampilkan'}>
                      {l.tampil ? (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      ) : (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      )}
                    </button>
                    <button onClick={() => setModal(l)} style={{ ...s.iconBtn, backgroundColor: '#EBF2FF', color: '#0066FF' }} title="Edit">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button onClick={() => setConfirmDel(l.id)} style={{ ...s.iconBtn, backgroundColor: '#fee2e2', color: '#dc2626' }} title="Hapus">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal tambah/edit */}
      {modal !== null && <Modal data={modal} onClose={() => setModal(null)} onSave={handleSave} />}

      {/* Confirm delete */}
      {confirmDel && (
        <div style={ms.overlay} onClick={() => setConfirmDel(null)}>
          <div style={{ ...ms.modal, maxWidth: 360, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🗑️</div>
            <h3 style={{ fontWeight: 800, color: '#111', marginBottom: 8 }}>Hapus Layanan?</h3>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: 24 }}>Aksi ini tidak dapat dibatalkan. Layanan dan gambarnya akan dihapus permanen.</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button onClick={() => setConfirmDel(null)} style={ms.cancelBtn}>Batal</button>
              <button onClick={handleDelete} disabled={deleting} style={{ ...ms.saveBtn, backgroundColor: '#dc2626', opacity: deleting ? 0.7 : 1 }}>
                {deleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', backgroundColor: '#111', color: '#fff', padding: '12px 24px', borderRadius: 12, fontSize: '0.9rem', fontWeight: 600, zIndex: 2000, boxShadow: '0 8px 24px rgba(0,0,0,0.25)' }}>
          {toast}
        </div>
      )}

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');`}</style>
    </AdminLayout>
  )
}

const s = {
  addBtn: { display: 'flex', alignItems: 'center', gap: 8, backgroundColor: '#0066FF', color: '#fff', border: 'none', borderRadius: 12, padding: '11px 22px', fontWeight: 700, fontSize: '0.92rem', cursor: 'pointer', fontFamily: "'Poppins', sans-serif", boxShadow: '0 4px 14px rgba(0,102,255,0.3)' },
  pill: { backgroundColor: '#fff', borderRadius: 10, padding: '8px 16px', fontSize: '0.88rem', color: '#555', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 6 },
  card: { backgroundColor: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' },
  iconBtn: { width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  empty: { backgroundColor: '#fff', borderRadius: 16, padding: '60px 20px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
}