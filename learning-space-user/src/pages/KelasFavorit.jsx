import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReminderMini } from './AnalitikProgress.jsx'
import logo from '../assets/logo.png'
import avatarDefault from '../assets/avatar-default.png'
import ilustrasiFavorit from '../assets/ilustrasi-favorit.png' // ← export dari Figma (buku + bintang)

// ── ICON COMPONENTS ──────────────────────────────────────────
function IconKelas() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg> }
function IconRiwayat() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> }
function IconFavorit() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> }
function IconZoom() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg> }
function IconKeluar() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> }
function IconBookmarkFilled() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFD93D" stroke="#FFD93D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg> }
function IconBookmarkOutline() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg> }
function IconAdd() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h14l4 4v14H2z"/><path d="M16 3v4h4"/><line x1="9" y1="11" x2="9" y2="17"/><line x1="6" y1="14" x2="12" y2="14"/></svg> }
function IconSearch() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> }
function IconClose() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> }
function IconAnalitik() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> }

const menuItems = [
  { key: 'kelas',   label: 'Kelas Pembelajaran', path: '/dashboard', icon: <IconKelas /> },
  { key: 'riwayat', label: 'Riwayat Belajar',    path: '/riwayat',   icon: <IconRiwayat /> },
  { key: 'favorit', label: 'Kelas Favorit',       path: '/favorit',   icon: <IconFavorit /> },
  { key: 'zoom',    label: 'Kelas Zoom Meeting',  path: '/zoom',      icon: <IconZoom /> },
  { key: 'analitik', label: 'Analitik Progress',   path: '/analitik',  icon: <IconAnalitik /> },
]

// ── DAFTAR SEMUA MATERI (sumber: KelasDetail & MateriDetail) ──
// Nanti diganti dari data backend (gabungan tabel kelas + materi)
const allMateri = [
  { kelasId: '1', materiId: '1', judul: 'Pengantar Kimia',    kelasNama: 'Kimia',             ilustrasi: 'icon-pengantar-kimia.png' },
  { kelasId: '1', materiId: '2', judul: 'Struktur Atom',      kelasNama: 'Kimia',             ilustrasi: 'icon-struktur-atom.png' },
  { kelasId: '1', materiId: '3', judul: 'Ikatan Kimia',       kelasNama: 'Kimia',             ilustrasi: 'icon-ikatan-kimia.png' },
  { kelasId: '1', materiId: '4', judul: 'Reaksi Kimia',       kelasNama: 'Kimia',             ilustrasi: 'icon-reaksi-kimia.png' },

  { kelasId: '2', materiId: '1', judul: 'Aljabar Dasar',      kelasNama: 'Matematika',        ilustrasi: 'icon-aljabar.png' },
  { kelasId: '2', materiId: '2', judul: 'Geometri',           kelasNama: 'Matematika',        ilustrasi: 'icon-geometri.png' },
  { kelasId: '2', materiId: '3', judul: 'Statistika',         kelasNama: 'Matematika',        ilustrasi: 'icon-statistika.png' },
  { kelasId: '2', materiId: '4', judul: 'Kalkulus',           kelasNama: 'Matematika',        ilustrasi: 'icon-kalkulus.png' },

  { kelasId: '3', materiId: '1', judul: 'Masa Prasejarah',          kelasNama: 'Sejarah Indonesia', ilustrasi: 'icon-prasejarah.png' },
  { kelasId: '3', materiId: '2', judul: 'Kerajaan Hindu-Buddha',     kelasNama: 'Sejarah Indonesia', ilustrasi: 'icon-kerajaan-hindu-buddha.png' },
  { kelasId: '3', materiId: '3', judul: 'Masa Kolonial',             kelasNama: 'Sejarah Indonesia', ilustrasi: 'icon-kolonial.png' },
  { kelasId: '3', materiId: '4', judul: 'Kemerdekaan',               kelasNama: 'Sejarah Indonesia', ilustrasi: 'icon-kemerdekaan.png' },

  { kelasId: '4', materiId: '1', judul: 'Vektor',             kelasNama: 'Fisika',            ilustrasi: 'icon-vektor.png' },
  { kelasId: '4', materiId: '2', judul: 'Gerak dan Percepatan', kelasNama: 'Fisika',          ilustrasi: 'icon-gerak.png' },
  { kelasId: '4', materiId: '3', judul: 'Hukum Newton',       kelasNama: 'Fisika',            ilustrasi: 'icon-newton.png' },
  { kelasId: '4', materiId: '4', judul: 'Suhu dan Kalor',     kelasNama: 'Fisika',            ilustrasi: 'icon-suhu.png' },

  { kelasId: '5', materiId: '1', judul: 'Tata Bahasa',        kelasNama: 'Bahasa Indonesia',  ilustrasi: 'icon-tata-bahasa.png' },
  { kelasId: '5', materiId: '2', judul: 'Membaca Kritis',     kelasNama: 'Bahasa Indonesia',  ilustrasi: 'icon-membaca-kritis.png' },
  { kelasId: '5', materiId: '3', judul: 'Menulis Esai',       kelasNama: 'Bahasa Indonesia',  ilustrasi: 'icon-menulis-esai.png' },
  { kelasId: '5', materiId: '4', judul: 'Sastra Indonesia',   kelasNama: 'Bahasa Indonesia',  ilustrasi: 'icon-sastra.png' },

  { kelasId: '6', materiId: '1', judul: 'Pengantar Komputer', kelasNama: 'Komputer',          ilustrasi: 'icon-pengantar-komputer.png' },
  { kelasId: '6', materiId: '2', judul: 'Sistem Operasi',     kelasNama: 'Komputer',          ilustrasi: 'icon-sistem-operasi.png' },
  { kelasId: '6', materiId: '3', judul: 'Jaringan Dasar',     kelasNama: 'Komputer',          ilustrasi: 'icon-jaringan.png' },
  { kelasId: '6', materiId: '4', judul: 'Pemrograman Dasar',  kelasNama: 'Komputer',          ilustrasi: 'icon-pemrograman.png' },
]

// ── MATERI ICON dengan fallback SVG ───────────────────────────
function MateriIcon({ ilustrasi, judul }) {
  return (
    <>
      <img
        src={`/src/assets/${ilustrasi}`}
        alt={judul}
        style={{ width: '90px', height: '90px', objectFit: 'contain' }}
        onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
      />
      <div style={{ display: 'none', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#FFD93D" strokeWidth="1.5">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10"/>
          <path d="M12 2c2.8 0 5 4.5 5 10s-2.2 10-5 10"/>
          <path d="M2 12h20"/>
        </svg>
      </div>
    </>
  )
}

// ── MAIN COMPONENT ─────────────────────────────────────────────
export default function KelasFavorit() {
  const navigate = useNavigate()
  const [activeMenu, setActiveMenu] = useState('favorit')
  const [search, setSearch] = useState('')

  // Default favorit awal (nanti dari backend / API)
  const [favorites, setFavorites] = useState(['1-3', '2-1', '4-1', '6-4'])
  // Catatan: di desain Figma ada "Fungsi" (Matematika) & "Pemrograman WEB" (Komputer)
  // yang belum ada di daftar materi kamu — sementara diganti "Aljabar Dasar" & "Pemrograman Dasar".
  // Kalau judul materi aslinya memang "Fungsi" / "Pemrograman WEB", tinggal update di allMateri & MateriDetail.jsx.

  const [showModal, setShowModal] = useState(false)
  const [modalSearch, setModalSearch] = useState('')
  const [selectedToAdd, setSelectedToAdd] = useState([])

  const key = (m) => `${m.kelasId}-${m.materiId}`

  const favoriteItems = allMateri.filter(m => favorites.includes(key(m)))
  const filteredFavorites = favoriteItems.filter(m =>
    m.judul.toLowerCase().includes(search.toLowerCase()) ||
    m.kelasNama.toLowerCase().includes(search.toLowerCase())
  )

  const filteredModalList = allMateri.filter(m =>
    !favorites.includes(key(m)) &&
    (m.judul.toLowerCase().includes(modalSearch.toLowerCase()) ||
     m.kelasNama.toLowerCase().includes(modalSearch.toLowerCase()))
  )

  const toggleSelect = (k) => {
    setSelectedToAdd(prev => prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k])
  }

  const handleTambahkan = () => {
    setFavorites(prev => [...prev, ...selectedToAdd])
    setSelectedToAdd([])
    setModalSearch('')
    setShowModal(false)
  }

  const handleHapus = (k) => {
    setFavorites(prev => prev.filter(f => f !== k))
  }

  const userName = 'Alihudin'

  return (
    <div style={s.layout}>

      {/* ── SIDEBAR ── */}
      <aside style={s.sidebar}>
        <div style={s.logoWrap} onClick={() => navigate('/')}>
          <img src={logo} alt="LearningSpace" style={s.logoImg}
            onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='block' }} />
          <span style={{ ...s.logoFallback, display: 'none' }}>
            Learning<span style={{ color: '#FFD93D' }}>Space</span>
            <span style={s.logoUnderline} />
          </span>
        </div>
        <nav style={s.nav}>
          {menuItems.map(item => (
            <div key={item.key}
              onClick={() => { setActiveMenu(item.key); navigate(item.path) }}
              style={{ ...s.menuItem, ...(activeMenu === item.key ? s.menuActive : {}) }}
            >
              {activeMenu === item.key && <div style={s.activeBar} />}
              <span style={{ ...s.menuIcon, color: activeMenu === item.key ? '#fff' : 'rgba(255,255,255,0.75)' }}>{item.icon}</span>
              <span style={{ ...s.menuLabel, color: activeMenu === item.key ? '#fff' : 'rgba(255,255,255,0.75)', fontWeight: activeMenu === item.key ? 700 : 400 }}>{item.label}</span>
            </div>
          ))}
        </nav>
        <div style={s.keluarWrap}>
          <div onClick={() => navigate('/')} style={s.keluarBtn}>
            <span style={{ color: '#ff4d4d' }}><IconKeluar /></span>
            <span style={s.keluarLabel}>Keluar</span>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={s.main}>

        {/* Header */}
        <div style={s.headerRow}>
          <div style={{ flex: 1 }}>
            <button onClick={() => navigate('/dashboard')} style={s.backBtn}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0f0f0'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="4"/><polyline points="13 8 8 12 13 16"/>
              </svg>
              <span style={s.backLabel}>Kembali</span>
            </button>
            <h1 style={s.pageTitle}>Kelas Favorit</h1>
            <p style={s.pageDesc}>
              Kelas favorit adalah kumpulan materi pembelajaran yang kamu simpan untuk diakses dengan lebih mudah kapan saja.
            </p>
          </div>
          <img src={ilustrasiFavorit} alt="ilustrasi"
            style={{ width: 180, objectFit: 'contain', flexShrink: 0 }}
            onError={e => e.target.style.display = 'none'} />
        </div>

        <hr style={s.divider} />

        <h2 style={s.sectionTitle}>Kelas Favorit Saya</h2>

        {/* Toolbar: Tambah & Search */}
        <div style={s.toolbar}>
          <button style={s.tambahBtn} onClick={() => setShowModal(true)}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#EBF2FF'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
          >
            <IconAdd /> Tambah Kelas Favorit
          </button>
          <div style={s.searchWrap}>
            <IconSearch />
            <input
              type="text"
              placeholder="Cari Kelas Favorit..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={s.searchInput}
            />
          </div>
        </div>

        {/* Grid Favorit */}
        {filteredFavorites.length === 0 ? (
          <div style={s.emptyState}>
            <p style={{ fontSize: '2.5rem', marginBottom: 8 }}>⭐</p>
            <p style={{ color: '#888' }}>
              {favorites.length === 0
                ? 'Belum ada kelas favorit. Klik "Tambah Kelas Favorit" untuk menambahkan.'
                : 'Kelas favorit tidak ditemukan.'}
            </p>
          </div>
        ) : (
          <div style={s.grid}>
            {filteredFavorites.map(m => (
              <div
                key={key(m)}
                style={s.card}
                onClick={() => navigate(`/kelas/${m.kelasId}/materi/${m.materiId}`)}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)'
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,102,255,0.45)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,102,255,0.25)'
                }}
              >
                {/* Bookmark — hapus dari favorit */}
                <button
                  style={s.bookmarkBtn}
                  onClick={e => { e.stopPropagation(); handleHapus(key(m)) }}
                  title="Hapus dari favorit"
                >
                  <IconBookmarkFilled />
                </button>

                <div style={s.cardIconWrap}>
                  <MateriIcon ilustrasi={m.ilustrasi} judul={m.judul} />
                </div>

                <h4 style={s.cardTitle}>{m.judul}</h4>
                <p style={s.cardSub}>{m.kelasNama}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── RIGHT PANEL ── */}
      <aside style={s.rightPanel}>
        <div style={s.profileCard}>
          <div style={s.avatarWrap}>
            <img src={avatarDefault} alt="Avatar" style={s.avatar}
              onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }} />
            <div style={{ ...s.avatarFallback, display: 'none' }}>
              <svg width="60" height="60" viewBox="0 0 24 24" fill="#aaa">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            </div>
          </div>
          <p style={s.profileName}>{userName}</p>
          <p style={s.profileRole}>Student</p>
          <button style={s.profileBtn} onClick={() => navigate('/profil')}>Profil</button>
        </div>
      </aside>

      {/* ── MODAL TAMBAH KELAS FAVORIT ── */}
      {showModal && (
        <div style={s.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={s.modalBox} onClick={e => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h3 style={s.modalTitle}>Tambah Kelas Favorit</h3>
              <button style={s.closeBtn} onClick={() => setShowModal(false)}><IconClose /></button>
            </div>

            <div style={s.modalSearchWrap}>
              <IconSearch />
              <input
                type="text"
                placeholder="Cari kelas atau materi..."
                value={modalSearch}
                onChange={e => setModalSearch(e.target.value)}
                style={s.searchInput}
              />
            </div>

            <div style={s.modalList}>
              {filteredModalList.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#999', padding: '24px 0' }}>
                  Semua materi sudah ditambahkan atau tidak ditemukan.
                </p>
              ) : (
                filteredModalList.map(m => {
                  const k = key(m)
                  const checked = selectedToAdd.includes(k)
                  return (
                    <div key={k} style={{ ...s.modalItem, backgroundColor: checked ? '#EBF2FF' : '#fff' }}
                      onClick={() => toggleSelect(k)}
                    >
                      <div style={s.modalItemIcon}>
                        <MateriIcon ilustrasi={m.ilustrasi} judul={m.judul} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={s.modalItemTitle}>{m.judul}</p>
                        <p style={s.modalItemSub}>{m.kelasNama}</p>
                      </div>
                      <div style={{ ...s.checkbox, ...(checked ? s.checkboxChecked : {}) }}>
                        {checked && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            <div style={s.modalFooter}>
              <span style={{ fontSize: '0.85rem', color: '#666' }}>
                {selectedToAdd.length} dipilih
              </span>
              <button
                style={{ ...s.modalAddBtn, opacity: selectedToAdd.length === 0 ? 0.5 : 1, cursor: selectedToAdd.length === 0 ? 'not-allowed' : 'pointer' }}
                onClick={handleTambahkan}
                disabled={selectedToAdd.length === 0}
              >
                Tambahkan ke Favorit
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        @keyframes fadeInUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes scaleIn { from { opacity:0; transform: scale(0.95) translateY(10px); } to { opacity:1; transform: scale(1) translateY(0); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </div>
  )
}

// ── STYLES ────────────────────────────────────────────────────
const s = {
  layout: { display: 'flex', minHeight: '100vh', fontFamily: "'Poppins', sans-serif", backgroundColor: '#f4f6fb' },
  sidebar: { width: '260px', flexShrink: 0, backgroundColor: '#0066FF', display: 'flex', flexDirection: 'column', padding: '28px 0', position: 'sticky', top: 0, height: '100vh' },
  logoWrap: { padding: '0 24px 32px', cursor: 'pointer' },
  logoImg: { height: '36px', objectFit: 'contain' },
  logoFallback: { fontSize: '1.3rem', fontWeight: 800, color: '#fff', position: 'relative', display: 'inline-block' },
  logoUnderline: { display: 'block', height: '3px', backgroundColor: '#FFD93D', borderRadius: '2px', marginTop: '2px' },
  nav: { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 12px' },
  menuItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' },
  menuActive: { backgroundColor: 'rgba(255,255,255,0.18)' },
  activeBar: { position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: '4px', height: '60%', backgroundColor: '#fff', borderRadius: '0 4px 4px 0' },
  menuIcon: { flexShrink: 0 },
  menuLabel: { fontSize: '0.92rem' },
  keluarWrap: { padding: '16px 24px 0' },
  keluarBtn: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', cursor: 'pointer' },
  keluarLabel: { color: '#ff4d4d', fontWeight: 600, fontSize: '0.92rem' },

  main: { flex: 1, padding: '36px 32px', overflowY: 'auto', animation: 'fadeInUp 0.5s ease both' },

  headerRow: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' },
  backBtn: { display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px 10px', borderRadius: '8px', marginBottom: '12px', transition: 'background 0.15s', fontFamily: "'Poppins', sans-serif" },
  backLabel: { fontSize: '0.95rem', fontWeight: 600, color: '#333' },
  pageTitle: { fontSize: '2.2rem', fontWeight: 800, color: '#111', marginBottom: '8px' },
  pageDesc: { color: '#666', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '520px' },
  divider: { border: 'none', borderTop: '1.5px solid #e5e7eb', margin: '20px 0 24px' },

  sectionTitle: { fontSize: '1.3rem', fontWeight: 800, color: '#111', marginBottom: '16px' },

  toolbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' },
  tambahBtn: { display: 'flex', alignItems: 'center', gap: '8px', border: '1.5px solid #0066FF', color: '#0066FF', backgroundColor: '#fff', borderRadius: '10px', padding: '10px 20px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', fontFamily: "'Poppins', sans-serif", transition: 'background 0.15s' },
  searchWrap: { display: 'flex', alignItems: 'center', gap: '8px', border: '1.5px solid #d1d5db', borderRadius: '10px', backgroundColor: '#fff', padding: '8px 16px', minWidth: '240px' },
  searchInput: { flex: 1, border: 'none', outline: 'none', fontSize: '0.9rem', fontFamily: "'Poppins', sans-serif", color: '#333', backgroundColor: 'transparent' },

  emptyState: { textAlign: 'center', padding: '60px 0', backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' },

  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' },
  card: {
    backgroundColor: '#0066FF', borderRadius: '16px', padding: '28px 20px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
    cursor: 'pointer', position: 'relative',
    transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease',
    boxShadow: '0 4px 16px rgba(0,102,255,0.25)',
    minHeight: '210px', justifyContent: 'center',
  },
  bookmarkBtn: { position: 'absolute', top: '14px', right: '14px', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' },
  cardIconWrap: { marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '90px' },
  cardTitle: { fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginBottom: '4px' },
  cardSub: { fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)' },

  rightPanel: { width: '280px', flexShrink: 0, padding: '36px 20px', display: 'flex', flexDirection: 'column', gap: '20px' },
  profileCard: { backgroundColor: '#fff', borderRadius: '16px', padding: '24px 16px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  avatarWrap: { width: '90px', height: '90px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 12px', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  avatar: { width: '100%', height: '100%', objectFit: 'cover' },
  avatarFallback: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e5e7eb' },
  profileName: { fontWeight: 700, fontSize: '1rem', color: '#111', marginBottom: '4px' },
  profileRole: { color: '#888', fontSize: '0.85rem', marginBottom: '16px' },
  profileBtn: { border: '2px solid #0066FF', color: '#0066FF', backgroundColor: 'transparent', borderRadius: '20px', padding: '6px 28px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: "'Poppins', sans-serif" },

  // Modal
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 0.2s ease' },
  modalBox: { backgroundColor: '#fff', borderRadius: '20px', width: '480px', maxWidth: '90vw', maxHeight: '80vh', display: 'flex', flexDirection: 'column', animation: 'scaleIn 0.25s ease', overflow: 'hidden' },
  modalHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #f0f0f0' },
  modalTitle: { fontSize: '1.15rem', fontWeight: 800, color: '#111' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', display: 'flex' },
  modalSearchWrap: { display: 'flex', alignItems: 'center', gap: '8px', border: '1.5px solid #d1d5db', borderRadius: '10px', backgroundColor: '#fff', padding: '8px 16px', margin: '16px 24px' },
  modalList: { flex: 1, overflowY: 'auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '8px' },
  modalItem: { display: 'flex', alignItems: 'center', gap: '12px', border: '1.5px solid #f0f0f0', borderRadius: '12px', padding: '10px 14px', cursor: 'pointer', transition: 'background 0.15s' },
  modalItemIcon: { width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  modalItemTitle: { fontSize: '0.92rem', fontWeight: 700, color: '#111' },
  modalItemSub: { fontSize: '0.78rem', color: '#888' },
  checkbox: { width: '22px', height: '22px', borderRadius: '6px', border: '2px solid #d1d5db', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' },
  checkboxChecked: { backgroundColor: '#0066FF', borderColor: '#0066FF' },
  modalFooter: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderTop: '1px solid #f0f0f0' },
  modalAddBtn: { backgroundColor: '#0066FF', color: '#fff', border: 'none', borderRadius: '10px', padding: '11px 24px', fontWeight: 700, fontSize: '0.9rem', fontFamily: "'Poppins', sans-serif" },
}
