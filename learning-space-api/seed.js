require('dotenv').config()
const bcrypt = require('bcryptjs')
const sequelize = require('./config/database')

require('./models/User')
require('./models/Kelas')
require('./models/Materi')
require('./models/RiwayatBelajar')
require('./models/Favorit')
require('./models/ZoomMeeting')

const User = require('./models/User')
const Kelas = require('./models/Kelas')
const Materi = require('./models/Materi')
const ZoomMeeting = require('./models/ZoomMeeting')

const seed = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ Database terkoneksi')

    await sequelize.sync()
    console.log('✅ Tabel dipastikan sudah ada (tidak ada data yang dihapus)')

    // ── USER ADMIN & USER BIASA ──────────────────────────────
    // findOrCreate: kalau email sudah ada (misal akun ini sudah pernah dibuat
    // sebelumnya, atau kamu sudah register manual dengan email yang sama),
    // SKIP — tidak menimpa apapun. Akun lain yang sudah kamu register lewat
    // halaman web tetap aman, tidak tersentuh sama sekali.
    const adminPass = await bcrypt.hash('admin123', 10)
    const userPass  = await bcrypt.hash('user123', 10)

    const [, adminCreated] = await User.findOrCreate({
      where: { email: 'admin@learningspace.com' },
      defaults: {
        nama: 'Admin LearningSpace',
        password: adminPass,
        role: 'admin',
        kelamin: 'Laki - Laki',
        kota: 'Jakarta',
      },
    })
    console.log(adminCreated
      ? '✅ Akun admin dibuat  →  admin@learningspace.com / admin123'
      : 'ℹ️  Akun admin sudah ada sebelumnya, dilewati')

    const [, userCreated] = await User.findOrCreate({
      where: { email: 'user@learningspace.com' },
      defaults: {
        nama: 'User Demo',
        password: userPass,
        role: 'user',
        kelamin: 'Laki - Laki',
        kota: 'Bandung',
      },
    })
    console.log(userCreated
      ? '✅ Akun user dibuat   →  user@learningspace.com / user123'
      : 'ℹ️  Akun user demo sudah ada sebelumnya, dilewati')

    // ── KELAS ────────────────────────────────────────────────
    const kelasList = [
      { nama: 'Kimia',            deskripsi: 'Pelajari konsep dasar kimia melalui materi yang terstruktur dan mudah dipahami.',              icon: 'icon-kimia.png',       kategori: 'Umum'    },
      { nama: 'Matematika',       deskripsi: 'Asah logika dan kemampuan berhitungmu melalui materi matematika dari dasar hingga lanjut.',    icon: 'icon-matematika.png',  kategori: 'Digital' },
      { nama: 'Sejarah Indonesia',deskripsi: 'Kenali perjalanan sejarah bangsa Indonesia dari masa prasejarah hingga era modern.',           icon: 'icon-sejarah.png',     kategori: 'Sosial'  },
      { nama: 'Fisika',           deskripsi: 'Pahami konsep energi, gaya, dan gerak dengan pembelajaran fisika yang aplikatif.',             icon: 'icon-fisika.png',      kategori: 'Umum'    },
      { nama: 'Bahasa Indonesia', deskripsi: 'Tingkatkan kemampuan bahasa dan penulisan dengan materi bahasa Indonesia yang komprehensif.',  icon: 'icon-bahasa.png',      kategori: 'Sosial'  },
      { nama: 'Komputer',         deskripsi: 'Pelajari dasar teknologi dan komputer modern untuk mempersiapkan diri di era digital.',        icon: 'icon-komputer.png',    kategori: 'Digital' },
    ]

    const kelasObjs = []
    let kelasBaruCount = 0
    for (const k of kelasList) {
      const [obj, created] = await Kelas.findOrCreate({
        where: { nama: k.nama },
        defaults: k,
      })
      kelasObjs.push(obj)
      if (created) kelasBaruCount++
    }
    console.log(kelasBaruCount > 0
      ? `✅ ${kelasBaruCount} Kelas baru berhasil dibuat (${kelasList.length - kelasBaruCount} sudah ada sebelumnya)`
      : 'ℹ️  Semua kelas sudah ada sebelumnya, tidak ada yang ditambahkan')

    // ── MATERI ───────────────────────────────────────────────
    const materiData = [
      // Kimia (kelasId 1)
      { kelasId: kelasObjs[0].id, judul: 'Pengantar Kimia',    deskripsiSingkat: 'Mengenal dasar-dasar ilmu kimia, metode ilmiah, dan cabangnya.', deskripsi: JSON.stringify(['Kimia adalah ilmu yang mempelajari tentang materi dan perubahannya.','Ilmu kimia mencakup studi tentang sifat, komposisi, struktur, dan reaksi materi.','Metode ilmiah digunakan dalam kimia untuk mengamati, merumuskan hipotesis, dan melakukan eksperimen.']), videoUrl: 'https://youtu.be/UBoK4NnfnhE?si=-R_0wEtngcYVoUiB', videoJudul: 'Pengantar Kimia', jurnalJudul: 'Konsep Dasar Kimia untuk PGMI', jurnalUrl: 'https://doaj.org/article/8dd0565194c64c41aeb5942a67bddd5d', ilustrasi: 'icon-pengantar-kimia.png' },
      { kelasId: kelasObjs[0].id, judul: 'Struktur Atom',      deskripsiSingkat: 'Mempelajari penyusunan atom: partikel penyusun dan model atom.', deskripsi: JSON.stringify(['Atom adalah partikel terkecil dari suatu unsur yang masih memiliki sifat unsur tersebut.','Atom terdiri dari proton, neutron, dan elektron.','Model atom berkembang dari model Dalton, Thomson, Rutherford, Bohr, hingga model mekanika kuantum.']), videoUrl: 'https://youtu.be/KaAipzqkDdg?si=jcWXN-MN-eudZFXL', videoJudul: 'Struktur Atom Lengkap', jurnalJudul: 'Chemistry Structure Sheet sebagai Media Pembelajaran Kimia Berbasis Augmented Reality pada Materi Struktur Atom', jurnalUrl: 'https://jurnal.uny.ac.id/index.php/jpms/article/view/42773/pdf', ilustrasi: 'icon-struktur-atom.png' },
      { kelasId: kelasObjs[0].id, judul: 'Ikatan Kimia',       deskripsiSingkat: 'Mempelajari jenis ikatan kimia dan cara terbentuknya.', deskripsi: JSON.stringify(['Ikatan kimia adalah gaya yang menyatukan atom-atom dalam suatu senyawa.','Jenis ikatan kimia meliputi ikatan ion, ikatan kovalen, dan ikatan logam.','Ikatan kovalen terbentuk ketika dua atom berbagi pasangan elektron.']), videoUrl: 'https://youtu.be/hifilq6pzGk?si=c5-LeEUcJHKB_exT', videoJudul: 'Ikatan Kimia', jurnalJudul: 'Pengembangan Modul Pembelajaran Kimia Berbasis Learning Cycle-5E pada Materi Ikatan Kimia', jurnalUrl: 'https://jurnal.untirta.ac.id/index.php/EduChemia/article/view/3348/4016', ilustrasi: 'icon-ikatan-kimia.png' },
      { kelasId: kelasObjs[0].id, judul: 'Reaksi Kimia',       deskripsiSingkat: 'Mempelajari proses perubahan zat menjadi zat baru melalui reaksi.', deskripsi: JSON.stringify(['Reaksi kimia adalah proses dimana satu atau lebih zat berubah menjadi zat baru.','Reaksi kimia melibatkan pemutusan dan pembentukan ikatan kimia.','Persamaan reaksi kimia harus memenuhi hukum kekekalan massa (setara).']), videoUrl: 'https://youtu.be/YRZb_hmonsU?si=S3M8_lOJdO01hlPF', videoJudul: 'Reaksi Kimia', jurnalJudul: 'Kimia Organik (Pengantar, Struktur Molekul, Reaksi, Sintesis, dan Kegunaan)', jurnalUrl: 'https://repository.stikesbcm.ac.id/id/eprint/493/', ilustrasi: 'icon-reaksi-kimia.png' },
      // Matematika (kelasId 2)
      { kelasId: kelasObjs[1].id, judul: 'Geometri',    deskripsiSingkat: 'Mempelajari konsep geometri, bangun datar dan ruang.', deskripsi: JSON.stringify(['Geometri adalah cabang matematika yang mempelajari bentuk, ukuran, dan sifat ruang.','Geometri mencakup studi tentang titik, garis, sudut, permukaan, dan padatan.','Teorema Pythagoras adalah salah satu konsep penting dalam geometri bidang datar.']), videoUrl: 'https://youtu.be/ZRDRX359HU4?si=6e6mtiHe7xgcYCA8', videoJudul: 'Geometri Lengkap', jurnalJudul: 'Analisis Kemampuan Pemahaman Konsep Geometri Siswa', jurnalUrl: 'https://journal.unsika.ac.id/index.php/sesiomadika/article/view/2862', ilustrasi: 'icon-geometri.png' },
      { kelasId: kelasObjs[1].id, judul: 'Fungsi',      deskripsiSingkat: 'Mempelajari konsep fungsi, cara mendefinisikan dan menggunakannya.', deskripsi: JSON.stringify(['Fungsi adalah relasi khusus yang menghubungkan setiap anggota domain dengan tepat satu anggota kodomain.','Fungsi dapat dinyatakan dalam bentuk tabel, grafik, atau persamaan aljabar.','Jenis-jenis fungsi meliputi fungsi linear, kuadrat, eksponensial, dan trigonometri.']), videoUrl: 'https://youtu.be/jOrYdGYq7nY?si=fFEe3QUHDQ7tAtuf', videoJudul: 'Fungsi Matematika', jurnalJudul: 'Analisis Pemahaman Konsep Fungsi pada Siswa SMA', jurnalUrl: 'https://jurnal.uibbc.ac.id/index.php/changethink/article/view/744', ilustrasi: 'icon-fungsi.png' },
      { kelasId: kelasObjs[1].id, judul: 'Perkalian',   deskripsiSingkat: 'Mempelajari konsep perkalian, sifat-sifatnya dan penerapannya.', deskripsi: JSON.stringify(['Perkalian adalah operasi matematika yang merupakan penjumlahan berulang dari suatu bilangan.','Sifat-sifat perkalian meliputi komutatif, asosiatif, dan distributif.','Perkalian dapat diterapkan dalam berbagai situasi nyata seperti menghitung luas, volume, dan kecepatan.']), videoUrl: 'https://youtu.be/PrnAUNTbIQ0?si=3mUy8ZguCNXQ15ga', videoJudul: 'Konsep Perkalian', jurnalJudul: 'Peningkatan Kemampuan Perkalian Menggunakan Media Pembelajaran', jurnalUrl: 'https://journal.ikipsiliwangi.ac.id/collase/article/view/3342', ilustrasi: 'icon-perkalian.png' },
      { kelasId: kelasObjs[1].id, judul: 'Pecahan',     deskripsiSingkat: 'Mempelajari konsep pecahan, jenis-jenis dan operasinya.', deskripsi: JSON.stringify(['Pecahan adalah bagian dari keseluruhan yang dinyatakan dalam bentuk a/b dimana b tidak nol.','Jenis-jenis pecahan meliputi pecahan biasa, campuran, desimal, dan persen.','Operasi pecahan meliputi penjumlahan, pengurangan, perkalian, dan pembagian.']), videoUrl: 'https://youtu.be/Du_HnNCVXdc?si=THUQSMXNXFsr9y1e', videoJudul: 'Konsep Pecahan', jurnalJudul: 'Analisis Kesulitan Belajar Pecahan pada Siswa', jurnalUrl: 'https://ojs.iai-rakeyansantang.ac.id/index.php/tahsinia/article/view/334', ilustrasi: 'icon-pecahan.png' },
      // Sejarah Indonesia (kelasId 3)
      { kelasId: kelasObjs[2].id, judul: 'Proklamasi Kemerdekaan', deskripsiSingkat: 'Memahami peristiwa proklamasi kemerdekaan Indonesia.', deskripsi: JSON.stringify(['Proklamasi kemerdekaan Indonesia adalah pernyataan resmi kemerdekaan bangsa Indonesia.','Proklamasi dibacakan oleh Soekarno dan Hatta pada tanggal 17 Agustus 1945 di Jakarta.','Peristiwa ini menandai berakhirnya penjajahan dan lahirnya negara Indonesia merdeka.']), videoUrl: 'https://youtu.be/OVL5ruoBXRo?si=EoCEMeYxJFNZTXEy', videoJudul: 'Proklamasi Kemerdekaan', jurnalJudul: 'Makna Proklamasi Kemerdekaan Indonesia bagi Bangsa Indonesia', jurnalUrl: 'https://jurnal.stkippgritulungagung.ac.id/index.php/rontal/article/view/1660', ilustrasi: 'icon-proklamasi.png' },
      { kelasId: kelasObjs[2].id, judul: 'Kerajaan Nusantara',    deskripsiSingkat: 'Mengenal kerajaan-kerajaan di nusantara, perkembangan dan kehidupannya.', deskripsi: JSON.stringify(['Kerajaan nusantara adalah kerajaan-kerajaan yang pernah berdiri di wilayah kepulauan Indonesia.','Kerajaan-kerajaan ini memiliki sistem pemerintahan, budaya, dan agama yang beragam.','Contoh kerajaan besar nusantara antara lain Sriwijaya, Majapahit, Mataram, dan Demak.']), videoUrl: 'https://youtu.be/S7GVz-YGWrY?si=DeCeJ3mNXKNlIAN5', videoJudul: 'Kerajaan Nusantara', jurnalJudul: 'Perkembangan Kerajaan Sriwijaya di Nusantara', jurnalUrl: 'https://jurnalsentral.com/index.php/jdss/article/view/132', ilustrasi: 'icon-kerajaan-nusantara.png' },
      { kelasId: kelasObjs[2].id, judul: 'Pergerakan Nasional',   deskripsiSingkat: 'Mempelajari lahirnya kesadaran nasional dan organisasi pergerakan.', deskripsi: JSON.stringify(['Pergerakan nasional adalah gerakan yang bertujuan untuk memperoleh kemerdekaan Indonesia dari penjajah.','Pergerakan nasional ditandai dengan berdirinya organisasi-organisasi nasional seperti Budi Utomo (1908).','Sumpah Pemuda 1928 menjadi tonggak penting dalam pergerakan nasional Indonesia.']), videoUrl: 'https://youtu.be/hGtZ35FiLIo?si=uvS_v9T-LQlD5Z6w', videoJudul: 'Pergerakan Nasional', jurnalJudul: 'Pergerakan Nasional Indonesia Awal Abad XX', jurnalUrl: 'https://online-journal.unja.ac.id/jejak/article/view/24821', ilustrasi: 'icon-pergerakan-nasional.png' },
      { kelasId: kelasObjs[2].id, judul: 'Tokoh Nasional',        deskripsiSingkat: 'Memahami tokoh-tokoh penting dalam sejarah nasional Indonesia.', deskripsi: JSON.stringify(['Tokoh nasional adalah individu yang memberikan kontribusi besar dalam perjalanan bangsa Indonesia.','Tokoh-tokoh nasional berperan penting dalam pergerakan kemerdekaan, pendidikan, dan pembangunan.','Mempelajari tokoh nasional membantu kita memahami nilai-nilai perjuangan bangsa.']), videoUrl: 'https://youtu.be/BFQlmmoN1OE?si=KX4lNAwPJuOkHtVT', videoJudul: 'Tokoh Nasional', jurnalJudul: 'Perjuangan Soekarno dalam Kemerdekaan Indonesia', jurnalUrl: 'https://e-journal.metrouniv.ac.id/social-pedagogy/article/view/7716', ilustrasi: 'icon-tokoh-nasional.png' },
      // Fisika (kelasId 4)
      { kelasId: kelasObjs[3].id, judul: 'Vektor',               deskripsiSingkat: 'Mempelajari konsep besaran vektor, arah, besar dan penjumlahannya.', deskripsi: JSON.stringify(['Vektor adalah besaran yang memiliki nilai dan arah, seperti kecepatan, gaya, dan percepatan.','Vektor dapat dijumlahkan menggunakan metode segitiga, jajar genjang, atau komponen.','Dalam fisika, vektor sangat penting dalam menganalisis gerak dan gaya pada benda.']), videoUrl: 'https://youtu.be/EoeePVoAdEo?si=b9Z5lBACPfwhJ0vK', videoJudul: 'Vektor Fisika', jurnalJudul: 'Kajian Materi Vektor Aljabar Linear', jurnalUrl: 'https://jurnal.uns.ac.id/jmme/article/view/9922/8838', ilustrasi: 'icon-vektor.png' },
      { kelasId: kelasObjs[3].id, judul: 'Gerak dan Percepatan', deskripsiSingkat: 'Mempelajari konsep gerak, jenis-jenis gerak dan percepatan benda.', deskripsi: JSON.stringify(['Gerak adalah perubahan posisi suatu benda terhadap acuan tertentu.','Jenis-jenis gerak meliputi gerak lurus beraturan, gerak lurus berubah beraturan, dan gerak melingkar.','Percepatan adalah perubahan kecepatan per satuan waktu dan merupakan besaran vektor.']), videoUrl: 'https://youtu.be/PQ43p7E1X1c?si=GvRnoCefaKYzk3s3', videoJudul: 'Gerak Fisika', jurnalJudul: 'Eksplorasi Kesulitan Belajar Siswa dalam Menyelesaikan Masalah Hukum Newton Tentang Gerak', jurnalUrl: 'https://jurnal.radenfatah.ac.id/index.php/alilmi/article/view/18455', ilustrasi: 'icon-gerak.png' },
      { kelasId: kelasObjs[3].id, judul: 'Hukum Newton',         deskripsiSingkat: 'Memahami tiga hukum newton dan penerapannya dalam kehidupan.', deskripsi: JSON.stringify(['Hukum Newton menjelaskan hubungan antara gaya yang bekerja pada benda dan gerak benda tersebut.','Hukum Newton I (Inersia): benda diam tetap diam dan benda bergerak tetap bergerak jika tidak ada gaya luar.','Hukum Newton II: percepatan benda sebanding dengan gaya neto dan berbanding terbalik dengan massa benda (F=ma).','Hukum Newton III: untuk setiap aksi ada reaksi yang sama besar dan berlawanan arah.']), videoUrl: 'https://youtu.be/oB1K_E754kA?si=8t9VIjAT9fzt-BgJ', videoJudul: 'Hukum Newton', jurnalJudul: 'Analisis Pemahaman Konsep pada Materi Hukum Newton', jurnalUrl: 'https://ejournal.unikama.ac.id/index.php/jtst/article/view/8556', ilustrasi: 'icon-newton.png' },
      { kelasId: kelasObjs[3].id, judul: 'Suhu dan Kalor',       deskripsiSingkat: 'Memahami konsep suhu, kalor, perpindahan kalor, dan perubahannya.', deskripsi: JSON.stringify(['Suhu adalah ukuran derajat panas atau dingin suatu benda yang diukur dengan termometer.','Kalor adalah energi panas yang berpindah dari benda bersuhu tinggi ke benda bersuhu rendah.','Perpindahan kalor dapat terjadi melalui konduksi, konveksi, dan radiasi.']), videoUrl: 'https://youtu.be/PQ43p7E1X1c?si=_Buoe6aTwgsLEdzq', videoJudul: 'Suhu dan Kalor', jurnalJudul: 'Pemahaman Konsep Suhu dan Kalor Mahasiswa Calon Guru', jurnalUrl: 'https://ojs.fkip.ummetro.ac.id/index.php/fisika/article/view/1547', ilustrasi: 'icon-suhu.png' },
      // Bahasa Indonesia (kelasId 5)
      { kelasId: kelasObjs[4].id, judul: 'Majas dan Gaya Bahasa', deskripsiSingkat: 'Mempelajari cara menggunakan majas untuk memperindah bahasa.', deskripsi: JSON.stringify(['Majas adalah gaya bahasa yang digunakan untuk memperindah dan memperkuat kesan dalam kalimat.','Jenis-jenis majas antara lain: majas perbandingan, pertentangan, pertautan, dan perulangan.','Penggunaan majas yang tepat dapat membuat tulisan lebih hidup, menarik, dan berkesan.']), videoUrl: 'https://youtu.be/7C4qZIMfV2E?si=2xvTuV37xKATFSQE', videoJudul: 'Majas Bahasa', jurnalJudul: 'Analisis Gaya Bahasa dalam Novel', jurnalUrl: 'https://jurnal.alahyansukabumi.com/index.php/ecos-preneurs/article/view/253', ilustrasi: 'icon-majas.png' },
      { kelasId: kelasObjs[4].id, judul: 'Kalimat Efektif',      deskripsiSingkat: 'Mempelajari cara membuat kalimat yang efektif, jelas dan tepat.', deskripsi: JSON.stringify(['Kalimat efektif adalah kalimat yang disusun sesuai kaidah bahasa dan menyampaikan pesan dengan jelas.','Syarat kalimat efektif meliputi kesatuan, kehematan, kesejajaran, penekanan, dan kelogisan.','Menghindari pengulangan kata, pleonasme, dan kontaminasi struktur penting dalam kalimat efektif.']), videoUrl: 'https://youtu.be/xxDi6F3dVBA?si=MNFgY1LvyulYegB0', videoJudul: 'Kalimat Efektif', jurnalJudul: 'Analisis Penggunaan Kalimat Efektif dalam Karya Tulis Siswa', jurnalUrl: 'https://www.jm.ejournal.id/index.php/mendidik/article/view/112', ilustrasi: 'icon-kalimat-efektif.png' },
      { kelasId: kelasObjs[4].id, judul: 'Teks Deskripsi',       deskripsiSingkat: 'Mempelajari cara memahami, menyusun, dan mengembangkan teks deskripsi.', deskripsi: JSON.stringify(['Teks deskripsi adalah teks yang menggambarkan suatu objek secara rinci agar pembaca seolah melihat langsung.','Struktur teks deskripsi terdiri dari identifikasi dan deskripsi bagian.','Ciri kebahasaan teks deskripsi meliputi penggunaan kata sifat, kata kerja aktif, dan perincian yang jelas.']), videoUrl: 'https://youtu.be/cTidIp76Dqg?si=7hQBFSaZjP-ml0ni', videoJudul: 'Teks Deskripsi', jurnalJudul: 'Kemampuan Menulis Teks Deskripsi Siswa SMP', jurnalUrl: 'https://jurnal.unigal.ac.id/literasi/article/view/85', ilustrasi: 'icon-teks-deskripsi.png' },
      { kelasId: kelasObjs[4].id, judul: 'Teks Eksposisi',       deskripsiSingkat: 'Mempelajari cara memahami dan menyusun teks eksposisi yang baik.', deskripsi: JSON.stringify(['Teks eksposisi adalah teks yang bertujuan menjelaskan, memaparkan, atau memberikan informasi secara faktual.','Struktur teks eksposisi terdiri dari tesis, argumen, dan penegasan ulang.','Teks eksposisi menggunakan kata penghubung, kata teknis bidang tertentu, dan nomina/verba.']), videoUrl: 'https://youtu.be/reampYr6PtI?si=SoDZGt9AAisageI9', videoJudul: 'Teks Eksposisi', jurnalJudul: 'Kemampuan Menulis Teks Eksposisi Siswa SMA', jurnalUrl: 'https://ejournal.uimsya.ac.id/index.php/Tarbiyatuna/article/view/975', ilustrasi: 'icon-teks-eksposisi.png' },
      // Komputer (kelasId 6)
      { kelasId: kelasObjs[5].id, judul: 'Pemrograman WEB',      deskripsiSingkat: 'Mempelajari dasar-dasar pemrograman WEB, HTML, CSS dan JavaScript.', deskripsi: JSON.stringify(['Pemrograman WEB adalah proses pembuatan aplikasi yang berjalan melalui browser internet.','Teknologi utama pemrograman web terdiri dari HTML untuk struktur, CSS untuk tampilan, dan JavaScript untuk interaksi.','Framework modern seperti React, Vue, dan Angular mempermudah pembuatan aplikasi web yang kompleks.']), videoUrl: 'https://youtu.be/t8Nxs7F4qEM?si=C8u5RAhurvrMxSsf', videoJudul: 'Pemrograman WEB', jurnalJudul: 'Perancangan Sistem Informasi Berbasis Web', jurnalUrl: 'https://lib.unib.ac.id/index.php?p=show_detail&id=15230', ilustrasi: 'icon-pemrograman-web.png' },
      { kelasId: kelasObjs[5].id, judul: 'Pengenalan Komputer',  deskripsiSingkat: 'Mempelajari dasar-dasar komputer, komponen utama dan cara kerjanya.', deskripsi: JSON.stringify(['Komputer adalah mesin elektronik yang dapat menerima, memproses, menyimpan, dan menghasilkan informasi.','Komponen utama komputer terdiri dari hardware (perangkat keras) dan software (perangkat lunak).','Hardware komputer meliputi CPU, memori (RAM dan ROM), media penyimpanan, dan perangkat input/output.']), videoUrl: 'https://youtu.be/gSImFfrlsE0?si=DV3GZxhKADuhvydK', videoJudul: 'Pengenalan Komputer', jurnalJudul: 'Pengenalan Dasar Sistem Komputer', jurnalUrl: 'https://journal.ppmi.web.id/index.php/JPKI2/article/view/34', ilustrasi: 'icon-pengenalan-komputer.png' },
      { kelasId: kelasObjs[5].id, judul: 'Pemrograman Dasar',    deskripsiSingkat: 'Mempelajari konsep dasar pemrograman, struktur dan logika program.', deskripsi: JSON.stringify(['Pemrograman dasar adalah langkah awal dalam mempelajari cara membuat program komputer.','Konsep dasar pemrograman meliputi variabel, tipe data, operator, percabangan, dan perulangan.','Algoritma dan flowchart digunakan untuk merencanakan solusi sebelum menulis kode program.']), videoUrl: 'https://youtu.be/jGyYuQf-GeE?si=qEm_0sU9s2n4CiCo', videoJudul: 'Pemrograman Dasar', jurnalJudul: 'Pembelajaran Pemrograman Dasar Menggunakan Python', jurnalUrl: 'https://jurnal.stkippgritulungagung.ac.id/index.php/jipi/article/view/228', ilustrasi: 'icon-pemrograman-dasar.png' },
      { kelasId: kelasObjs[5].id, judul: 'Algoritma dan Flowchart', deskripsiSingkat: 'Mempelajari cara membuat algoritma dan flowchart untuk memecahkan masalah.', deskripsi: JSON.stringify(['Algoritma adalah urutan langkah-langkah logis dan terstruktur untuk memecahkan suatu masalah.','Flowchart adalah representasi visual dari algoritma menggunakan simbol-simbol standar.','Membuat algoritma yang baik adalah kunci dalam menghasilkan program yang efisien dan benar.']), videoUrl: 'https://youtu.be/ig7MCZQthj4?si=vcQJooPTwpcxVmi4', videoJudul: 'Algoritma & Flowchart', jurnalJudul: 'Penerapan Algoritma dan Flowchart dalam Pemrograman', jurnalUrl: 'https://www.neliti.com/publications/177019/pembelajaran-dasar-algoritma-dan-pemrograman-menggunakan-el-goritma-berbasis-web', ilustrasi: 'icon-algoritma-flowchart.png' },
    ]

    let materiBaruCount = 0
    for (const m of materiData) {
      const [, created] = await Materi.findOrCreate({
        where: { kelasId: m.kelasId, judul: m.judul },
        defaults: m,
      })
      if (created) materiBaruCount++
    }
    console.log(materiBaruCount > 0
      ? `✅ ${materiBaruCount} Materi baru berhasil dibuat (${materiData.length - materiBaruCount} sudah ada sebelumnya)`
      : 'ℹ️  Semua materi sudah ada sebelumnya, tidak ada yang ditambahkan')

    // ── ZOOM MEETING ─────────────────────────────────────────
    const zoomData = [
      { kelasId: kelasObjs[2].id, link: 'https://www.zoom.com', waktu: new Date('2026-06-16T10:00:00'), judulMateri: 'Proklamasi Kemerdekaan Indonesia', tanggalTeks: 'Rabu, 16 Juni 2026', jamTeks: '10.00 - 11.30 WIB' },
      { kelasId: kelasObjs[4].id, link: 'https://www.zoom.com', waktu: new Date('2026-06-21T08:00:00'), judulMateri: 'Kalimat Efektif', tanggalTeks: 'Senin, 21 Juni 2026', jamTeks: '08.00 - 09.30 WIB' },
      { kelasId: kelasObjs[5].id, link: 'https://www.zoom.com', waktu: new Date('2026-07-10T14:00:00'), judulMateri: 'Pemrograman WEB', tanggalTeks: 'Kamis, 10 Juli 2026', jamTeks: '14.00 - 15.30 WIB' },
      { kelasId: kelasObjs[3].id, link: 'https://www.zoom.com', waktu: new Date('2026-07-11T16:00:00'), judulMateri: 'Hukum Newton', tanggalTeks: 'Jumat, 11 Juli 2026', jamTeks: '16.00 - 17.30 WIB' },
    ]
    let zoomBaruCount = 0
    for (const z of zoomData) {
      const [, created] = await ZoomMeeting.findOrCreate({
        where: { kelasId: z.kelasId, judulMateri: z.judulMateri, waktu: z.waktu },
        defaults: z,
      })
      if (created) zoomBaruCount++
    }
    console.log(zoomBaruCount > 0
      ? `✅ ${zoomBaruCount} Zoom Meeting baru berhasil dibuat (${zoomData.length - zoomBaruCount} sudah ada sebelumnya)`
      : 'ℹ️  Semua zoom meeting sudah ada sebelumnya, tidak ada yang ditambahkan')

    console.log('\n🌱 Seeding selesai!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('  Admin  : admin@learningspace.com / admin123')
    console.log('  User   : user@learningspace.com  / user123')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    process.exit(0)
  } catch (err) {
    console.error('❌ Error seeding:', err.message)
    process.exit(1)
  }
}

seed()