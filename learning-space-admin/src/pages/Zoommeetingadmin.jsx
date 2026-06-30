import React, { useState, useEffect } from 'react'
import { AdminLayout } from './AdminDashboard.jsx'
import api from '../api/axios'

export default function ZoomMeetingAdmin() {
  const [meetings, setMeetings] = useState([])
  const [kelasList, setKelasList] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [editingMeeting, setEditingMeeting] = useState(null)
  const [form, setForm] = useState({
    kelasId: '', judulMateri: '', tanggal: '', jamMulai: '', jamSelesai: '', link: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteError, setDeleteError] = useState('')

  const fetchData = async () => {
    setLoading(true)
    setErrorMsg('')
    try {
      const [resMeetings, resKelas] = await Promise.all([
        api.get('/zoom'),
        api.get('/kelas'),
      ])
      setMeetings(resMeetings.data.meetings)
      setKelasList(resKelas.data.kelas)
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Gagal memuat data zoom meeting')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const resetForm = () => setForm({
    kelasId: '', judulMateri: '', tanggal: '', jamMulai: '', jamSelesai: '', link: '',
  })

  const openTambah = () => {
    setEditingMeeting(null)
    resetForm()
    setFormError('')
    setShowModal(true)
  }

  // Pecah ulang field 'waktu' (ISO datetime) dan 'jamTeks' (misal "10.00 - 11.30 WIB")
  // jadi komponen form terpisah supaya mudah diedit
  const openEdit = (m) => {
    setEditingMeeting(m)
    const d = new Date(m.waktu)
    const tanggal = d.toISOString().slice(0, 10) // YYYY-MM-DD untuk <input type="date">

    let jamMulai = '', jamSelesai = ''
    if (m.jamTeks) {
      const match = m.jamTeks.match(/(\d{1,2}[.:]\d{2})\s*-\s*(\d{1,2}[.:]\d{2})/)
      if (match) {
        jamMulai = match[1].replace('.', ':')
        jamSelesai = match[2].replace('.', ':')
      }
    }

    setForm({
      kelasId: m.kelasId || m.Kela?.id || '',
      judulMateri: m.judulMateri || '',
      tanggal,
      jamMulai,
      jamSelesai,
      link: m.link || '',
    })
    setFormError('')
    setShowModal(true)
  }

  const formatTanggalTeks = (tanggalStr) => {
    if (!tanggalStr) return ''
    const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu']
    const bulan = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
    const d = new Date(tanggalStr + 'T00:00:00')
    return `${hari[d.getDay()]}, ${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.kelasId || !form.tanggal || !form.jamMulai || !form.link.trim()) {
      setFormError('Kelas, tanggal, jam mulai, dan link wajib diisi')
      return
    }
    setSubmitting(true)
    setFormError('')

    const waktu = `${form.tanggal}T${form.jamMulai}:00`
    const jamTeks = form.jamSelesai
      ? `${form.jamMulai.replace(':', '.')} - ${form.jamSelesai.replace(':', '.')} WIB`
      : `${form.jamMulai.replace(':', '.')} WIB`

    const payload = {
      kelasId: form.kelasId,
      judulMateri: form.judulMateri,
      waktu,
      tanggalTeks: formatTanggalTeks(form.tanggal),
      jamTeks,
      link: form.link,
    }

    try {
      if (editingMeeting) {
        await api.put(`/zoom/${editingMeeting.id}`, payload)
      } else {
        await api.post('/zoom', payload)
      }
      setShowModal(false)
      fetchData()
    } catch (err) {
      setFormError(err.response?.data?.message || 'Gagal menyimpan zoom meeting')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteError('')
    try {
      await api.delete(`/zoom/${deleteTarget.id}`)
      setDeleteTarget(null)
      fetchData()
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Gagal menghapus zoom meeting')
    }
  }

  return (
    <AdminLayout activeKey="zoom">
      <div style={s.headerRow}>
        <div>
          <h1 style={s.pageTitle}>Zoom Meeting</h1>
          <p style={s.pageDesc}>Kelola jadwal kelas Zoom Meeting untuk seluruh kelas.</p>
        </div>
        <button style={s.addBtn} onClick={openTambah}>+ Tambah Zoom Meeting</button>
      </div>

      {loading && <p style={{ color: '#888' }}>Memuat data...</p>}
      {!loading && errorMsg && <div style={s.errorBox}>{errorMsg}</div>}

      {!loading && !errorMsg && (
        <div style={s.list}>
          {meetings.map(m => (
            <div key={m.id} style={s.item}>
              <div style={{ flex: 1 }}>
                <p style={s.itemKelas}>{m.Kela?.nama || m.Kelas?.nama || '-'}</p>
                <p style={s.itemMateri}>{m.judulMateri || '-'}</p>
              </div>
              <div style={s.itemInfo}>
                <span style={s.badge}>{m.tanggalTeks || new Date(m.waktu).toLocaleDateString('id-ID')}</span>
                <span style={s.badge}>{m.jamTeks || '-'}</span>
              </div>
              <a href={m.link} target="_blank" rel="noreferrer" style={s.linkBtn}>Buka Link</a>
              <div style={s.itemActions}>
                <button style={s.editBtn} onClick={() => openEdit(m)}>Edit</button>
                <button style={s.deleteBtn} onClick={() => { setDeleteTarget(m); setDeleteError('') }}>Hapus</button>
              </div>
            </div>
          ))}

          {meetings.length === 0 && (
            <div style={{ textAlign: 'center', color: '#888', padding: 40, backgroundColor: '#fff', borderRadius: 16 }}>
              Belum ada zoom meeting. Klik "Tambah Zoom Meeting" untuk membuat yang pertama.
            </div>
          )}
        </div>
      )}

      {/* ── MODAL TAMBAH/EDIT ── */}
      {showModal && (
        <div style={s.overlay} onClick={() => setShowModal(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h3 style={s.modalTitle}>{editingMeeting ? 'Edit Zoom Meeting' : 'Tambah Zoom Meeting'}</h3>
            <form onSubmit={handleSubmit}>
              <label style={s.label}>Kelas</label>
              <select style={s.input} value={form.kelasId} onChange={e => setForm({ ...form, kelasId: e.target.value })}>
                <option value="">-- Pilih Kelas --</option>
                {kelasList.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
              </select>

              <label style={s.label}>Materi yang Dibahas</label>
              <input style={s.input} value={form.judulMateri} onChange={e => setForm({ ...form, judulMateri: e.target.value })} placeholder="Misal: Hukum Newton II" />

              <label style={s.label}>Tanggal</label>
              <input type="date" style={s.input} value={form.tanggal} onChange={e => setForm({ ...form, tanggal: e.target.value })} />

              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <label style={s.label}>Jam Mulai</label>
                  <input type="time" style={s.input} value={form.jamMulai} onChange={e => setForm({ ...form, jamMulai: e.target.value })} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={s.label}>Jam Selesai</label>
                  <input type="time" style={s.input} value={form.jamSelesai} onChange={e => setForm({ ...form, jamSelesai: e.target.value })} />
                </div>
              </div>

              <label style={s.label}>Link Zoom</label>
              <input style={s.input} value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="https://zoom.us/j/..." />

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
            <h3 style={s.modalTitle}>Hapus Zoom Meeting?</h3>
            <p style={{ color: '#666', fontSize: '0.92rem', marginBottom: 16 }}>
              Yakin ingin menghapus jadwal zoom <strong>{deleteTarget.judulMateri || 'ini'}</strong>?
              Riwayat user yang sudah mengikuti zoom ini tidak akan terhapus.
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

  list: { display: 'flex', flexDirection: 'column', gap: 12 },
  item: { backgroundColor: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: 20, display: 'flex', alignItems: 'center', gap: 20 },
  itemKelas: { fontSize: '1rem', fontWeight: 700, color: '#111' },
  itemMateri: { fontSize: '0.88rem', color: '#666', marginTop: 2 },
  itemInfo: { display: 'flex', flexDirection: 'column', gap: 6 },
  badge: { backgroundColor: '#EBF2FF', color: '#0066FF', fontSize: '0.78rem', fontWeight: 600, padding: '4px 12px', borderRadius: 20, whiteSpace: 'nowrap' },
  linkBtn: { color: '#0066FF', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' },
  itemActions: { display: 'flex', gap: 8, flexShrink: 0 },
  editBtn: { padding: '8px 16px', borderRadius: 8, border: '1.5px solid #e5e7eb', backgroundColor: '#fff', color: '#0066FF', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', fontFamily: "'Poppins', sans-serif" },
  deleteBtn: { padding: '8px 16px', borderRadius: 8, border: '1.5px solid #e5e7eb', backgroundColor: '#fff', color: '#dc2626', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', fontFamily: "'Poppins', sans-serif" },

  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 },
  modal: { backgroundColor: '#fff', borderRadius: 16, padding: 28, width: 440, maxHeight: '90vh', overflowY: 'auto' },
  modalTitle: { fontSize: '1.2rem', fontWeight: 800, color: '#111', marginBottom: 20 },
  label: { display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#333', marginBottom: 6, marginTop: 14 },
  input: { width: '100%', padding: '11px 12px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: '0.9rem', outline: 'none', fontFamily: "'Poppins', sans-serif" },
  formError: { color: '#dc2626', fontSize: '0.85rem', marginTop: 12, backgroundColor: '#fee2e2', padding: '10px 12px', borderRadius: 8 },
  modalActions: { display: 'flex', gap: 10, marginTop: 22 },
  cancelBtn: { flex: 1, padding: '11px 0', borderRadius: 10, border: '1.5px solid #e5e7eb', backgroundColor: '#fff', color: '#333', fontWeight: 600, cursor: 'pointer', fontFamily: "'Poppins', sans-serif" },
  saveBtn: { flex: 1, padding: '11px 0', borderRadius: 10, border: 'none', backgroundColor: '#0066FF', color: '#fff', fontWeight: 700, cursor: 'pointer', fontFamily: "'Poppins', sans-serif" },
  deleteConfirmBtn: { flex: 1, padding: '11px 0', borderRadius: 10, border: 'none', backgroundColor: '#dc2626', color: '#fff', fontWeight: 700, cursor: 'pointer', fontFamily: "'Poppins', sans-serif" },
}