const multer = require('multer')
const path = require('path')
const fs = require('fs')

// Filter: hanya terima file gambar (png, jpg, jpeg, webp)
const imageFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/
  const extOk = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimeOk = allowedTypes.test(file.mimetype)
  if (extOk && mimeOk) {
    cb(null, true)
  } else {
    cb(new Error('Hanya file gambar (jpg, jpeg, png, webp) yang diperbolehkan'))
  }
}

// Buat storage config untuk sebuah subfolder di dalam uploads/ (misal 'kelas' atau 'materi')
function buatStorage(subfolder) {
  const tujuanFolder = path.join(__dirname, '..', 'uploads', subfolder)

  // Pastikan foldernya ada (jaga-jaga kalau .gitkeep ke-hapus/folder belum ada)
  if (!fs.existsSync(tujuanFolder)) {
    fs.mkdirSync(tujuanFolder, { recursive: true })
  }

  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, tujuanFolder),
    filename: (req, file, cb) => {
      // Nama file unik: timestamp + random + ekstensi asli, supaya tidak
      // pernah saling menimpa walau nama file asli sama
      const ext = path.extname(file.originalname).toLowerCase()
      const namaUnik = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`
      cb(null, namaUnik)
    },
  })
}

const uploadKelasIcon = multer({
  storage: buatStorage('kelas'),
  fileFilter: imageFileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // maksimal 2MB
})

const uploadMateriIlustrasi = multer({
  storage: buatStorage('materi'),
  fileFilter: imageFileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
})

const uploadFotoProfil = multer({
  storage: buatStorage('foto'),
  fileFilter: imageFileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
})

const uploadFotoTestimoni = multer({
  storage: buatStorage('testimoni'),
  fileFilter: imageFileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
})

const uploadGambarLayanan = multer({
  storage: buatStorage('layanan'),
  fileFilter: imageFileFilter,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB karena gambar layanan lebih besar
})

module.exports = { uploadKelasIcon, uploadMateriIlustrasi, uploadFotoProfil, uploadFotoTestimoni, uploadGambarLayanan }