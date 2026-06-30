// ── 24 ICON SVG UNIK PER MATERI ───────────────────────────────
// Dipakai di KelasDetail.jsx dan KelasFavorit.jsx
// Setiap icon dibungkus kotak putih transparan dengan warna latar biru

// Format: MateriIcon({ kelasId, materiId })
// kelasId 1=Kimia, 2=Matematika, 3=Sejarah, 4=Fisika, 5=Bahasa Indonesia, 6=Komputer

const stroke = { fill: 'none', stroke: '#fff', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }

export const materiIcons = {
  // ── KIMIA ─────────────────────────────────────────────────
  '1-1': ( // Pengantar Kimia — labu erlenmeyer
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M9 3h6v7l4 10H5L9 10z"/>
      <line x1="7" y1="15" x2="17" y2="15"/>
      <circle cx="10" cy="18" r="0.8" fill="#fff"/>
      <circle cx="14" cy="17" r="0.6" fill="#fff"/>
    </svg>
  ),
  '1-2': ( // Struktur Atom — inti + elektron orbit
    <svg viewBox="0 0 24 24" {...stroke}>
      <circle cx="12" cy="12" r="2" fill="#fff"/>
      <ellipse cx="12" cy="12" rx="10" ry="4"/>
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/>
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>
    </svg>
  ),
  '1-3': ( // Ikatan Kimia — rantai molekul
    <svg viewBox="0 0 24 24" {...stroke}>
      <circle cx="5" cy="12" r="3"/>
      <circle cx="12" cy="7" r="3"/>
      <circle cx="19" cy="12" r="3"/>
      <circle cx="12" cy="17" r="3"/>
      <line x1="7.5" y1="10.5" x2="9.5" y2="8.5"/>
      <line x1="14.5" y1="8.5" x2="16.5" y2="10.5"/>
      <line x1="16.5" y1="13.5" x2="14.5" y2="15.5"/>
      <line x1="9.5" y1="15.5" x2="7.5" y2="13.5"/>
    </svg>
  ),
  '1-4': ( // Reaksi Kimia — tabung reaksi + gelembung
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M8 3v11a4 4 0 0 0 8 0V3"/>
      <line x1="6" y1="3" x2="18" y2="3"/>
      <circle cx="10" cy="16" r="1" fill="#fff"/>
      <circle cx="14" cy="14" r="1.2" fill="#fff"/>
      <circle cx="12" cy="18" r="0.8" fill="#fff"/>
    </svg>
  ),

  // ── MATEMATIKA ─────────────────────────────────────────────
  '2-1': ( // Aljabar — x² + simbol
    <svg viewBox="0 0 24 24" {...stroke}>
      <line x1="3" y1="21" x2="21" y2="3"/>
      <line x1="3" y1="3" x2="21" y2="21"/>
      <text x="13" y="8" fontSize="6" fill="#fff" stroke="none" fontWeight="bold">2</text>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="12" y1="3" x2="12" y2="10"/>
    </svg>
  ),
  '2-2': ( // Geometri — segitiga + lingkaran
    <svg viewBox="0 0 24 24" {...stroke}>
      <polygon points="12,3 21,21 3,21"/>
      <circle cx="12" cy="15" r="4"/>
    </svg>
  ),
  '2-3': ( // Statistika — bar chart
    <svg viewBox="0 0 24 24" {...stroke}>
      <rect x="3" y="14" width="4" height="7"/>
      <rect x="10" y="8" width="4" height="13"/>
      <rect x="17" y="4" width="4" height="17"/>
      <line x1="1" y1="21" x2="23" y2="21"/>
    </svg>
  ),
  '2-4': ( // Kalkulus — kurva integral
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M3 18 Q6 3 12 12 Q18 21 21 6"/>
      <path d="M5 20 Q4 22 6 22 Q8 22 7 20" fill="none"/>
      <path d="M19 4 Q18 2 20 2 Q22 2 21 4" fill="none"/>
    </svg>
  ),

  // ── SEJARAH INDONESIA ──────────────────────────────────────
  '3-1': ( // Masa Prasejarah — tengkorak/batu
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M12 3C7 3 4 7 4 11c0 3 1.5 5 4 6v3h8v-3c2.5-1 4-3 4-6 0-4-3-8-8-8z"/>
      <line x1="9" y1="20" x2="15" y2="20"/>
      <line x1="10" y1="17" x2="10" y2="20"/>
      <line x1="14" y1="17" x2="14" y2="20"/>
      <circle cx="9" cy="10" r="1.5" fill="#fff"/>
      <circle cx="15" cy="10" r="1.5" fill="#fff"/>
    </svg>
  ),
  '3-2': ( // Kerajaan Hindu-Buddha — candi
    <svg viewBox="0 0 24 24" {...stroke}>
      <polygon points="12,2 14,8 10,8"/>
      <rect x="9" y="8" width="6" height="4"/>
      <rect x="7" y="12" width="10" height="3"/>
      <rect x="5" y="15" width="14" height="3"/>
      <rect x="4" y="18" width="16" height="3"/>
      <line x1="12" y1="8" x2="12" y2="21"/>
    </svg>
  ),
  '3-3': ( // Masa Kolonial — kapal layar
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M3 17 L12 5 L21 17 Z"/>
      <line x1="12" y1="5" x2="12" y2="20"/>
      <path d="M2 20 Q12 17 22 20"/>
      <line x1="6" y1="13" x2="12" y2="10"/>
    </svg>
  ),
  '3-4': ( // Kemerdekaan — bendera
    <svg viewBox="0 0 24 24" {...stroke}>
      <line x1="4" y1="3" x2="4" y2="21"/>
      <rect x="4" y="3" width="16" height="7" rx="1"/>
      <line x1="4" y1="6.5" x2="20" y2="6.5"/>
    </svg>
  ),

  // ── FISIKA ────────────────────────────────────────────────
  '4-1': ( // Vektor — panah koordinat
    <svg viewBox="0 0 24 24" {...stroke}>
      <line x1="4" y1="20" x2="20" y2="4"/>
      <polyline points="13,4 20,4 20,11"/>
      <line x1="4" y1="20" x2="4" y2="4"/>
      <line x1="4" y1="20" x2="20" y2="20"/>
    </svg>
  ),
  '4-2': ( // Gerak & Percepatan — mobil/panah
    <svg viewBox="0 0 24 24" {...stroke}>
      <rect x="2" y="11" width="16" height="7" rx="2"/>
      <circle cx="7" cy="19" r="2"/>
      <circle cx="15" cy="19" r="2"/>
      <path d="M16 11l4-4"/>
      <polyline points="17,4 21,7 18,8"/>
      <line x1="2" y1="14" x2="6" y2="14"/>
    </svg>
  ),
  '4-3': ( // Hukum Newton — apel jatuh
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M12 2a4 4 0 0 1 4 4c0 3-2 5-4 7-2-2-4-4-4-7a4 4 0 0 1 4-4z"/>
      <path d="M11 2 Q10 0 12 0"/>
      <line x1="12" y1="13" x2="12" y2="22"/>
      <polyline points="9,19 12,22 15,19"/>
    </svg>
  ),
  '4-4': ( // Suhu & Kalor — termometer
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
      <line x1="10" y1="6" x2="14" y2="6"/>
      <line x1="10" y1="9" x2="14" y2="9"/>
      <line x1="10" y1="12" x2="14" y2="12"/>
      <circle cx="11.5" cy="17.5" r="2.5" fill="rgba(255,255,255,0.3)"/>
    </svg>
  ),

  // ── BAHASA INDONESIA ───────────────────────────────────────
  '5-1': ( // Tata Bahasa — huruf A
    <svg viewBox="0 0 24 24" {...stroke}>
      <polyline points="4,20 12,4 20,20"/>
      <line x1="7" y1="14" x2="17" y2="14"/>
      <path d="M3 20 Q4 18 5 20"/>
      <path d="M19 20 Q20 18 21 20"/>
    </svg>
  ),
  '5-2': ( // Membaca Kritis — kaca pembesar di buku
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      <circle cx="13" cy="10" r="3"/>
      <line x1="15.5" y1="12.5" x2="18" y2="15"/>
    </svg>
  ),
  '5-3': ( // Menulis Esai — pena + garis
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M12 20h9"/>
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      <line x1="8" y1="12" x2="14" y2="12"/>
      <line x1="8" y1="16" x2="12" y2="16"/>
    </svg>
  ),
  '5-4': ( // Sastra Indonesia — buku terbuka + bintang
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      <polygon points="12,5 13,8 16,8 13.5,10 14.5,13 12,11 9.5,13 10.5,10 8,8 11,8" fill="rgba(255,217,61,0.6)" stroke="#FFD93D" strokeWidth="1"/>
    </svg>
  ),

  // ── KOMPUTER ──────────────────────────────────────────────
  '6-1': ( // Pengantar Komputer — CPU/chip
    <svg viewBox="0 0 24 24" {...stroke}>
      <rect x="7" y="7" width="10" height="10" rx="1"/>
      <rect x="9" y="9" width="6" height="6" rx="1"/>
      <line x1="7" y1="9" x2="3" y2="9"/>
      <line x1="7" y1="12" x2="3" y2="12"/>
      <line x1="7" y1="15" x2="3" y2="15"/>
      <line x1="17" y1="9" x2="21" y2="9"/>
      <line x1="17" y1="12" x2="21" y2="12"/>
      <line x1="17" y1="15" x2="21" y2="15"/>
      <line x1="9" y1="7" x2="9" y2="3"/>
      <line x1="12" y1="7" x2="12" y2="3"/>
      <line x1="15" y1="7" x2="15" y2="3"/>
      <line x1="9" y1="17" x2="9" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
      <line x1="15" y1="17" x2="15" y2="21"/>
    </svg>
  ),
  '6-2': ( // Sistem Operasi — layar + jendela
    <svg viewBox="0 0 24 24" {...stroke}>
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
      <rect x="5" y="6" width="5" height="4" rx="1"/>
      <rect x="13" y="6" width="5" height="4" rx="1"/>
      <rect x="5" y="12" width="14" height="2" rx="1"/>
    </svg>
  ),
  '6-3': ( // Jaringan — node terhubung
    <svg viewBox="0 0 24 24" {...stroke}>
      <circle cx="12" cy="5" r="2" fill="rgba(255,255,255,0.3)"/>
      <circle cx="5" cy="19" r="2" fill="rgba(255,255,255,0.3)"/>
      <circle cx="19" cy="19" r="2" fill="rgba(255,255,255,0.3)"/>
      <circle cx="12" cy="13" r="2" fill="rgba(255,255,255,0.3)"/>
      <line x1="12" y1="7" x2="12" y2="11"/>
      <line x1="10.5" y1="14.5" x2="6.5" y2="17.5"/>
      <line x1="13.5" y1="14.5" x2="17.5" y2="17.5"/>
      <line x1="11" y1="6" x2="6" y2="17"/>
      <line x1="13" y1="6" x2="18" y2="17"/>
    </svg>
  ),
  '6-4': ( // Pemrograman — tag kode </>
    <svg viewBox="0 0 24 24" {...stroke}>
      <polyline points="16,18 22,12 16,6"/>
      <polyline points="8,6 2,12 8,18"/>
      <line x1="15" y1="4" x2="9" y2="20"/>
    </svg>
  ),
}

// Komponen siap pakai
export function MateriIconBox({ kelasId, materiId, size = 52 }) {
  const icon = materiIcons[`${kelasId}-${materiId}`]
  return (
    <div style={{
      width: size, height: size,
      backgroundColor: 'rgba(255,255,255,0.18)',
      borderRadius: 12, padding: 8,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      {icon || (
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10"/>
          <path d="M2 12h20"/>
        </svg>
      )}
    </div>
  )
}
