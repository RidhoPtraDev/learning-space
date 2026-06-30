import React, { useState, useEffect, useRef } from 'react'
import { AdminLayout } from './AdminDashboard.jsx'
import api from '../api/axios'

const AVATAR_PLACEHOLDER = 'https://ui-avatars.com/api/?background=0066FF&color=fff&size=80&bold=true&name='

// ── Helpers ──────────────────────────────────────────────────
function avatarSrc(t) {
  if (t.foto) return t.foto
  return AVATAR_PLACEHOLDER + encodeURIComponent(t.nama?.charAt(0) || '?')
}

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
    nama: data?.nama || '',
    role: data?.role || '',
    isi: data?.isi || '',
    urutan: data?.urutan ?? 0,
    tampil: data?.tampil !== false,
  })
  const [fotoPreview, setFotoPreview] = useState(data?.foto || null)
  const [fotoFile, setFotoFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fotoRef = useRef()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleFoto = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { setError('Foto maksimal 2MB'); return }
    setFotoFile(file)
    setFotoPreview(URL.createObjectURL(file))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.nama.trim() || !form.isi.trim()) { setError('Nama dan isi wajib diisi'); return }
    setLoading(true)
    setError('')

    const fd = new FormData()
    fd.append('nama', form.nama)
    fd.append('role', form.role)
    fd.append('isi', form.isi)
    fd.append('urutan', form.urutan)
    fd.append('tampil', form.tampil)
    if (fotoFile) fd.append('foto', fotoFile)

    try {
      if (isEdit) {
        await api.put(`/testimoni/admin/${data.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      } else {
        await api.post('/testimoni/admin', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
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
          <h3 style={ms.title}>{isEdit ? 'Edit Testimoni' : 'Tambah Testimoni'}</h3>
          <button onClick={onClose} style={ms.closeBtn}>✕</button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Foto */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img
                src={fotoPreview || (AVATAR_PLACEHOLDER + encodeURIComponent(form.nama?.charAt(0) || '?'))}
                alt="preview"
                style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e5e7eb' }}
                onError={e => { e.target.src = AVATAR_PLACEHOLDER + encodeURIComponent(form.nama?.charAt(0) || '?') }}
              />
              <div onClick={() => fotoRef.current?.click()} style={{ position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, backgroundColor: '#0066FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
            </div>
            <input ref={fotoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFoto} />
            <p style={{ color: '#999', fontSize: '0.75rem', marginTop: 6 }}>Foto opsional · maks 2MB</p>
          </div>

          <div style={ms.fieldGroup}>
            <label style={ms.label}>Nama <span style={{ color: '#dc2626' }}>*</span></label>
            <input name="nama" value={form.nama} onChange={handleChange} placeholder="cth. Siti Rahmawati" style={ms.input} />
          </div>
          <div style={ms.fieldGroup}>
            <label style={ms.label}>Role / Jabatan</label>
            <input name="role" value={form.role} onChange={handleChange} placeholder="cth. Mahasiswa, Pelajar, Profesional" style={ms.input} />
          </div>
          <div style={ms.fieldGroup}>
            <label style={ms.label}>Isi Testimoni <span style={{ color: '#dc2626' }}>*</span></label>
            <textarea name="isi" value={form.isi} onChange={handleChange} rows={4} placeholder="Tulis isi testimoni di sini..." style={{ ...ms.input, resize: 'vertical', minHeight: 100 }} />
            <p style={{ color: '#aaa', fontSize: '0.75rem', marginTop: 4 }}>{form.isi.length} karakter</p>
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
              {loading ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Tambah Testimoni')}
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

// ── Halaman utama Testimoni admin ─────────────────────────────
export default function TestimoniAdmin() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | {} (tambah) | {id,...} (edit)
  const [confirmDel, setConfirmDel] = useState(null) // id yg mau dihapus
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await api.get('/testimoni/admin')
      setList(res.data.testimoni)
    } catch {
      showToast('Gagal memuat data testimoni')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleSave = () => {
    setModal(null)
    fetchData()
    showToast('Testimoni berhasil disimpan!')
  }

  const handleToggleTampil = async (t) => {
    try {
      const fd = new FormData()
      fd.append('nama', t.nama)
      fd.append('isi', t.isi)
      fd.append('tampil', !t.tampil)
      await api.put(`/testimoni/admin/${t.id}`, fd)
      fetchData()
    } catch {
      showToast('Gagal mengubah status tampil')
    }
  }

  const handleDelete = async () => {
    if (!confirmDel) return
    setDeleting(true)
    try {
      await api.delete(`/testimoni/admin/${confirmDel}`)
      setConfirmDel(null)
      fetchData()
      showToast('Testimoni berhasil dihapus')
    } catch {
      showToast('Gagal menghapus testimoni')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AdminLayout activeKey="testimoni">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111', marginBottom: 4 }}>Testimoni</h1>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>Kelola testimoni yang ditampilkan di halaman utama website.</p>
        </div>
        <button onClick={() => setModal({})} style={s.addBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Tambah Testimoni
        </button>
      </div>

      {/* Stat pills */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={s.pill}><span style={{ fontWeight: 800, color: '#0066FF', fontSize: '1.1rem' }}>{list.length}</span> Total</div>
        <div style={s.pill}><span style={{ fontWeight: 800, color: '#16a34a', fontSize: '1.1rem' }}>{list.filter(t => t.tampil).length}</span> Ditampilkan</div>
        <div style={s.pill}><span style={{ fontWeight: 800, color: '#888', fontSize: '1.1rem' }}>{list.filter(t => !t.tampil).length}</span> Disembunyikan</div>
      </div>

      {/* Table / cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#888' }}>Memuat...</div>
      ) : list.length === 0 ? (
        <div style={s.empty}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>💬</div>
          <p style={{ fontWeight: 700, color: '#333', marginBottom: 4 }}>Belum ada testimoni</p>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>Klik tombol "Tambah Testimoni" untuk mulai menambahkan.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 }}>
          {list.map(t => (
            <div key={t.id} style={{ ...s.card, opacity: t.tampil ? 1 : 0.65 }}>
              {/* Top row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <img
                  src={avatarSrc(t)}
                  alt={t.nama}
                  style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid #e5e7eb' }}
                  onError={e => { e.target.src = AVATAR_PLACEHOLDER + encodeURIComponent(t.nama?.charAt(0) || '?') }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, color: '#111', fontSize: '0.95rem', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.nama}</p>
                  <p style={{ color: '#888', fontSize: '0.8rem' }}>{t.role || '—'}</p>
                </div>
                <Badge active={t.tampil} />
              </div>

              {/* Isi */}
              <div style={{ backgroundColor: '#f9fafb', borderRadius: 10, padding: '10px 14px', marginBottom: 14, position: 'relative' }}>
                <span style={{ fontSize: '1.8rem', color: '#0066FF', lineHeight: 1, position: 'absolute', top: 4, left: 10, opacity: 0.3 }}>"</span>
                <p style={{ color: '#444', fontSize: '0.88rem', lineHeight: 1.7, paddingLeft: 16, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {t.isi}
                </p>
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: '#aaa', fontSize: '0.75rem' }}>Urutan: #{t.urutan}</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => handleToggleTampil(t)}
                    style={{ ...s.iconBtn, backgroundColor: t.tampil ? '#f3f4f6' : '#dcfce7', color: t.tampil ? '#888' : '#16a34a' }}
                    title={t.tampil ? 'Sembunyikan' : 'Tampilkan'}
                  >
                    {t.tampil ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                  <button onClick={() => setModal(t)} style={{ ...s.iconBtn, backgroundColor: '#EBF2FF', color: '#0066FF' }} title="Edit">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button onClick={() => setConfirmDel(t.id)} style={{ ...s.iconBtn, backgroundColor: '#fee2e2', color: '#dc2626' }} title="Hapus">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal tambah/edit */}
      {modal !== null && (
        <Modal data={modal} onClose={() => setModal(null)} onSave={handleSave} />
      )}

      {/* Confirm delete */}
      {confirmDel && (
        <div style={ms.overlay} onClick={() => setConfirmDel(null)}>
          <div style={{ ...ms.modal, maxWidth: 360, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🗑️</div>
            <h3 style={{ fontWeight: 800, color: '#111', marginBottom: 8 }}>Hapus Testimoni?</h3>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: 24 }}>Aksi ini tidak dapat dibatalkan. Testimoni akan dihapus permanen.</p>
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
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', transition: 'transform 0.2s, box-shadow 0.2s' },
  iconBtn: { width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  empty: { backgroundColor: '#fff', borderRadius: 16, padding: '60px 20px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
}