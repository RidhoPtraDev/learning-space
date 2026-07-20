const RESET_JAM = 0  // reset tepat tengah malam (jam 00:00)

function toDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function awalHariAnalitik(ref = new Date()) {
  const d = new Date(ref)
  if (d.getHours() < RESET_JAM) d.setDate(d.getDate() - 1)
  d.setHours(RESET_JAM, 0, 0, 0)
  return d
}

function awalMingguAnalitik(ref = new Date()) {
  const d = awalHariAnalitik(ref)
  const hariKe = d.getDay() === 0 ? 6 : d.getDay() - 1 // Sen=0
  d.setDate(d.getDate() - hariKe)
  return d
}

const NAMA_HARI    = ['Min','Sen','Sel','Rab','Kam','Jum','Sab']
const NAMA_BULAN   = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']

function namaHari(date)        { return NAMA_HARI[date.getDay()] }
function namaBulanSingkat(date){ return NAMA_BULAN[date.getMonth()] }

function formatDetik(detik) {
  detik = Number(detik)
  if (!Number.isFinite(detik) || detik < 0) detik = 0
  if (detik === 0) return '0m'
  if (detik < 60) return `${detik}d`
  const jam = Math.floor(detik / 3600)
  const menit = Math.floor((detik % 3600) / 60)
  if (jam > 0 && menit > 0) return `${jam}j ${menit}m`
  if (jam > 0) return `${jam}j`
  return `${menit}m`
}

module.exports = {
  RESET_JAM,
  toDateKey,
  awalHariAnalitik,
  awalMingguAnalitik,
  namaHari,
  namaBulanSingkat,
  formatDetik,
  hitungStreak: async function (userId, RiwayatBelajar) {
    const semuaRiwayat = await RiwayatBelajar.findAll({
      where: { userId },
      attributes: ['waktuAkses'],
      order: [['waktuAkses', 'DESC']],
    })
    const sekarang = new Date()
    const tanggalAktif = new Set(
      semuaRiwayat.map(r => {
        const d = new Date(r.waktuAkses)
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
      })
    )
    let streak = 0
    for (let i = 0; i < 365; i++) {
      const cek = new Date(sekarang)
      cek.setDate(cek.getDate() - i)
      const key = `${cek.getFullYear()}-${cek.getMonth()}-${cek.getDate()}`
      if (tanggalAktif.has(key)) {
        streak++
      } else if (i === 0) {
        continue
      } else {
        break
      }
    }
    return { streak, tanggalAktif }
  }
}

