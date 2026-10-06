// Data konten AskTunas.com.
// Sumber data asli: https://www.tunasharapan.info/official/
//
// CATATAN UNTUK TIM:
// - Field `src: null` pada galeri/video adalah SLOT KOSONG — ganti dengan URL/file
//   foto & video asli sekolah (mis. dari Supabase Storage) saat sudah tersedia.
// - `strukturOrganisasi` sudah mengikuti bagan resmi; entri `unit: true` tampil
//   sebagai kotak unit kerja (nama unitnya ada, pejabatnya memang tidak dicantumkan).
// - TODO(backend): ganti ekspor ini dengan fetch dari Supabase/API bila sudah siap.

export const school = {
  name: "SMK Telekomunikasi Tunas Harapan",
  shortName: "AskTunas",
  tagline: "Portal Cerdas & Asisten Virtual Sekolah",
  logo: "/images/logo-smk-transparan.png", // PNG transparan resmi kiriman tim (2026-10-03); JPG asli tetap tersimpan
  address: "Jl. Umbul Senjoyo I No. 3, Desa Bener, Kec. Tengaran, Kabupaten Semarang, Jawa Tengah 50775",
  // Kutipan dari data sekolah (chatbot-nextjs/data_sekolah/alamat.md): menjelaskan kenapa
  // sebagian publikasi sekolah menyebut "SMK Telkom Salatiga" padahal alamatnya Kab. Semarang.
  lokasiCatatan: "Secara administratif berada di Kabupaten Semarang, namun letaknya berbatasan langsung dengan Kota Salatiga sehingga mudah diakses.",
  phone: "(0298) 311391",
  email: "info@tunasharapan.info",
  website: "https://www.tunasharapan.info/official/",
  jamLayanan: [
    { hari: "Senin – Kamis", jam: "07.30 – 15.00 WIB" },
    { hari: "Jumat", jam: "07.30 – 14.00 WIB" },
    { hari: "Sabtu – Minggu", jam: "Tutup" },
  ],
  // [ISI DATA ASLI] akun media sosial resmi dikirim tim (2026-10-05).
  sosmed: [
    { label: "Instagram", text: "@smk_tth", url: "https://www.instagram.com/smk_tth" },
    { label: "Facebook", text: "Halaman resmi sekolah", url: "https://www.facebook.com/share/1dVJmZSAR5/" },
  ],
};

// [ISI DATA ASLI] Identitas formal sekolah — supplied by Team Fiveslebew (2026-10-01),
// sesuai Dapodik sekolah. `value: null` tampil sebagai "—" di halaman Profil.
// Tanggal berdiri 27 Mei 2001 dikirim user (2026-10-06).
export const identitas = [
  { label: "Tahun Berdiri", value: "27 Mei 2001" },
  { label: "Status Sekolah", value: "Swasta — dinaungi Yayasan Tunas Harapan Semarang" },
  { label: "Akreditasi", value: "A (Unggul)" },
  { label: "NPSN", value: "20331145" },
];

// [ISI DATA ASLI] Narasi sejarah resmi dari pihak sekolah (2026-10-01).
export const sejarah = [
  "SMK Telekomunikasi Tunas Harapan Kabupaten Semarang lahir dari sebuah gagasan visioner untuk menjawab tantangan perkembangan teknologi telekomunikasi dan kebutuhan dunia industri yang semakin pesat. Berdiri di bawah naungan Yayasan Tunas Harapan Semarang, sekolah ini konsisten beradaptasi dengan kemajuan zaman melalui pembelajaran berbasis teknologi, penyiapan kompetensi kejuruan yang kuat, serta penguatan karakter siswa agar siap menghadapi dunia kerja maupun berwirausaha.",
];

// [ISI DATA ASLI] Angka dari tim (2026-10-01). Mohon konfirmasi ulang ke Dapodik/TU
// sebelum lomba karena sebagian dicatat sebagai perkiraan; jumlah mitra industri
// belum tersedia.
export const stats = [
  { label: "Siswa Aktif", value: 1000, suffix: "+", verified: true },
  { label: "Program Keahlian", value: 4, suffix: "", verified: true },
  { label: "Tenaga Pengajar", value: 35, suffix: "+", verified: true },
  { label: "Alumni", value: 1500, suffix: "+", verified: true },
];

// Program keahlian resmi sesuai situs sekolah.
// [ISI DATA ASLI] `partners[].logo` opsional: isi path berkas logo resmi mitra di
// public/images/mitra/ — kalau kosong, kartu menampilkan inisial nama.
// [ISI DATA ASLI] `logo` = lambang program keahlian kiriman tim via WhatsApp 2026-10-05,
// disimpan di public/images/jurusan/ (latar putih sudah dibuang, warna asli dipertahankan).
// [ISI DATA ASLI] `mataPelajaran` diisi daftar mapel inti sesuai struktur kurikulum
// resmi sekolah (dokumen KOSP/profil jurusan). Saat kosong, halaman Jurusan menampilkan slot.
export const jurusan = [
  {
    id: 1,
    nama: "Pengembangan Perangkat Lunak dan Gim",
    kode: "PPLG",
    desc: "Membangun aplikasi web, mobile, dan gim lewat pembelajaran berbasis produksi (production-based learning) — siswa fokus pada produksi dan bisnis menjawab tantangan industri.",
    fokus: ["FullStack Developers", "Game Developer"],
    monogram: "PPLG",
    logo: "/images/jurusan/pplg.png",
    mataPelajaran: [],
    // [ISI DATA ASLI] dikirim tim via WhatsApp 2026-10-02. TeFa PPLG berkonsentrasi pada RPL
    // dengan menu utama FullStack Developers & Game Developer; kolaborasi TeFa dengan UBIG Malang;
    // sarana prasarana + upskill/reskill guru diperkuat CSR Konsorsium Pengusaha Peduli Vokasi RI.
    // Peran spesifik UKSW dkk belum dirinci sekolah — konfirmasi apakah mitra PPLG atau lintas program.
    // [ISI DATA ASLI] logo mitra resmi dikirim tim via WhatsApp 2026-10-05 (public/images/mitra/).
    // Logo "Konsorsium Pengusaha Peduli Vokasi RI" belum diterima — masih tampil inisial.
    partners: [
      { name: "PT Universal Big Data (UBIG) Malang", logo: "/images/mitra/ubig.png", type: "Kolaborasi Teaching Factory (TeFa)", verified: true },
      { name: "Konsorsium Pengusaha Peduli Vokasi RI", type: "CSR sarana prasarana & upskill/reskill guru", verified: true },
      { name: "UKSW", logo: "/images/mitra/uksw.png", type: null, verified: true },
      { name: "UDINUS Semarang", logo: "/images/mitra/udinus.png", type: null, verified: true },
      { name: "Rumah Mesin Jogjakarta", logo: "/images/mitra/rumah-mesin.png", type: null, verified: true },
      { name: "TVKU Semarang", logo: "/images/mitra/tvku.png", type: null, verified: true },
      { name: "Cakra TV Semarang", logo: "/images/mitra/cakra-tv.png", type: null, verified: true },
      { name: "Busuma Vision Salatiga", logo: "/images/mitra/busuma.png", type: null, verified: true },
    ],
  },
  {
    id: 2,
    nama: "Desain Komunikasi Visual",
    kode: "DKV",
    desc: "Desain grafis, multimedia, videografi, dan komunikasi visual untuk industri kreatif.",
    fokus: ["Desain Grafis", "UI/UX", "Videografi"],
    monogram: "DKV",
    logo: "/images/jurusan/dkv.png",
    mataPelajaran: [],
    partners: [],
  },
  {
    id: 3,
    nama: "Teknik Kendaraan Ringan Otomotif",
    kode: "TKR",
    desc: "Perawatan, perbaikan, dan overhaul sistem kendaraan ringan berbasis teknologi terkini.",
    fokus: ["Engine", "Chassis", "Electrical"],
    monogram: "TKR",
    logo: "/images/jurusan/tkr.png",
    mataPelajaran: [],
    partners: [],
  },
  {
    id: 4,
    nama: "Teknik Jaringan Komputer dan Telekomunikasi",
    kode: "TJKT",
    desc: "Membangun dan mengelola infrastruktur jaringan, server, dan telekomunikasi.",
    fokus: ["Networking", "Server Administration", "Fiber Optic"],
    monogram: "TJKT",
    logo: "/images/jurusan/tjkt.png",
    mataPelajaran: [
      "Administrasi Mikrotik Lanjutan",
      "Keamanan Jaringan (Cyber Security Dasar)",
      "Fiber Optic Splicing & Maintenance",
    ],
    // [ISI DATA ASLI] tim via WhatsApp 2026-10-02: TKJ/TJKT mengintegrasikan kurikulum
    // industri melalui Cisco Network Academy Program dan Mikrotik Academy.
    // [ISI DATA ASLI] logo mitra resmi dikirim tim via WhatsApp 2026-10-05 (public/images/mitra/).
    partners: [
      { name: "Cisco Networking Academy", logo: "/images/mitra/cisco-netacad.png", type: "Integrasi kurikulum industri", verified: true },
      { name: "Mikrotik Academy", logo: "/images/mitra/mikrotik-academy.png", type: "Integrasi kurikulum industri & sertifikasi jaringan", verified: true },
    ],
  },
];

// Jejaring industri yang terverifikasi dari publikasi resmi sekolah dan kiriman tim
// (terakhir 2026-10-02). PT CTI dicatat sebagai kunjungan institusi, bukan mitra jurusan.
// [ISI DATA ASLI] `logo` opsional (public/images/mitra/); `initials` dipakai selama logonya belum ada.
export const industryNetwork = [
  {
    name: "PT Universal Big Data (UBIG)",
    logo: "/images/mitra/ubig.png",
    type: "Kolaborasi Teaching Factory (TeFa) RPL",
    program: "PPLG",
    initials: "UBG",
  },
  {
    name: "Konsorsium Pengusaha Peduli Vokasi RI",
    type: "CSR sarana prasarana & upskill/reskill guru",
    program: "PPLG",
    initials: "VPV",
  },
  {
    name: "Cisco Networking Academy",
    logo: "/images/mitra/cisco-netacad.png",
    type: "Integrasi kurikulum industri",
    program: "TJKT",
    initials: "CNA",
  },
  {
    name: "Mikrotik Academy",
    logo: "/images/mitra/mikrotik-academy.png",
    type: "Integrasi kurikulum industri & sertifikasi jaringan",
    program: "TJKT",
    initials: "MTA",
  },
  {
    name: "PT CTI",
    type: "Kunjungan institusi & jejaring pendidikan",
    program: "Lintas Program",
    initials: "CTI",
  },
];

// [ISI DATA ASLI] Foto dokumentasi asli kiriman tim: batch kampus 2026-10-02, batch
// bengkel/praktik TKR 2026-10-05. Tersimpan di public/images/galeri/ (sisi panjang
// 1152px, JPG). Judul hanya menyebut tulisan/plakat/peralatan yang terlihat di foto —
// jangan mengarang aktivitas. Foto yang menampilkan wajah siswa dengan jelas sengaja
// tidak dipakai; konfirmasi izin sekolah dulu sebelum menambahkannya.
// Field `jurusan` = kode jurusan di array `jurusan` di atas, atau "Umum" untuk fasilitas
// kampus yang dipakai bersama. Pengisian hanya dari bukti di foto (papan "BENGKEL
// OTOMOTIF", unit kendaraan, mesin, tool set otomotif) — jangan memindahkan entri ke
// jurusan lain tanpa bukti. PPLG, DKV dan TJKT belum punya foto sendiri.
export const galeri = [
  { id: 1, judul: "Papan Nama SMK Telekomunikasi Tunas Harapan", kategori: "Fasilitas", jurusan: "Umum", type: "image", src: "/images/galeri/papan-nama-sekolah.jpg" },
  { id: 2, judul: "Gedung SMK Telekomunikasi — Bidang Humas", kategori: "Fasilitas", jurusan: "Umum", type: "image", src: "/images/galeri/gedung-humas.jpg" },
  { id: 3, judul: "Gedung Bengkel Otomotif", kategori: "Fasilitas", jurusan: "TKR", type: "image", src: "/images/galeri/bengkel-otomotif-fasad.jpg" },
  { id: 4, judul: "Interior Bengkel Otomotif — Unit Praktik Siswa", kategori: "Fasilitas", jurusan: "TKR", type: "image", src: "/images/galeri/bengkel-otomotif-interior.jpg" },
  { id: 5, judul: "Area Praktik Bengkel — Banner Safety First", kategori: "Fasilitas", jurusan: "TKR", type: "image", src: "/images/galeri/bengkel-area-praktik.jpg" },
  { id: 6, judul: "Gedung Teaching Factory & GAMELAB", kategori: "Fasilitas", jurusan: "Umum", type: "image", src: "/images/galeri/teaching-factory-gamelab.jpg" },
  { id: 7, judul: "Gedung Pavilion dengan Panel Warna-warni", kategori: "Fasilitas", jurusan: "Umum", type: "image", src: "/images/galeri/gedung-pavilion.jpg" },
  { id: 8, judul: "Gedung Bertingkat di Area Kampus", kategori: "Fasilitas", jurusan: "Umum", type: "image", src: "/images/galeri/gedung-bertingkat.jpg" },
  { id: 9, judul: "Gedung Praktik dengan Aksen Biru", kategori: "Fasilitas", jurusan: "Umum", type: "image", src: "/images/galeri/gedung-aksen-biru.jpg" },
  { id: 10, judul: "Area Parkir Siswa di Pagi Hari", kategori: "Kegiatan", jurusan: "Umum", type: "image", src: "/images/galeri/area-parkir-pagi.jpg" },
  { id: 11, judul: "Hall Praktik Bengkel — Lift dan Unit Mobil", kategori: "Fasilitas", jurusan: "TKR", type: "image", src: "/images/galeri/bengkel-hall-praktik.jpg" },
  { id: 12, judul: "Ruang Unit Mesin — Engine Stand dan Rak Komponen", kategori: "Fasilitas", jurusan: "TKR", type: "image", src: "/images/galeri/bengkel-ruang-unit-mesin.jpg" },
  { id: 13, judul: "Unit Mesin Bertuliskan 16 VALVE EFI", kategori: "Fasilitas", jurusan: "TKR", type: "image", src: "/images/galeri/bengkel-mesin-16-valve.jpg" },
  { id: 14, judul: "Tool Set, Momen Kunci dan Jangka Sorong di Meja Praktik", kategori: "Fasilitas", jurusan: "TKR", type: "image", src: "/images/galeri/meja-tool-set.jpg" },
  { id: 15, judul: "Hydraulic Jack dan Tool Box di Samping Unit Super Kijang", kategori: "Fasilitas", jurusan: "TKR", type: "image", src: "/images/galeri/praktik-hydraulic-jack.jpg" },
  { id: 16, judul: "Pengoperasian Two-Post Lift pada Unit Kijang", kategori: "Kegiatan", jurusan: "TKR", type: "image", src: "/images/galeri/praktik-two-post-lift.jpg" },
  { id: 17, judul: "Siswa Menggunakan Kunci Roda pada Unit Pickup", kategori: "Kegiatan", jurusan: "TKR", type: "image", src: "/images/galeri/praktik-kunci-rod.jpg" },
];

// Marquee foto Beranda: berkas asli yang sama dengan banner judul halaman dalam
// (public/images/situs/) dan foto galeri (public/images/galeri/). Tidak ada foto baru.
// Alt hanya menyebut tulisan/plakat/ruangan yang terlihat di foto.
export const fotoMarquee = [
  { src: "/images/galeri/papan-nama-sekolah.jpg", alt: "Papan nama SMK Telekomunikasi Tunas Harapan" },
  { src: "/images/galeri/gedung-humas.jpg", alt: "Gedung bidang humas" },
  { src: "/images/situs/lab-komputer.jpg", alt: "Ruang laboratorium komputer dengan perangkat dan siswa" },
  { src: "/images/galeri/gedung-pavilion.jpg", alt: "Gedung pavilion dengan panel warna-warni" },
  { src: "/images/situs/bengkel-otomotif.jpg", alt: "Gedung dua lantai beraksen warna-warni di area kampus" },
  { src: "/images/galeri/area-parkir-pagi.jpg", alt: "Area parkir di pagi hari" },
  { src: "/images/situs/perpustakaan.jpg", alt: "Ruang perpustakaan dengan rak buku dan meja baca" },
  { src: "/images/galeri/gedung-bertingkat.jpg", alt: "Gedung bertingkat di area kampus" },
  { src: "/images/situs/papan-nama-sisi.jpg", alt: "Plakat nama sekolah dari arah samping" },
];

// [ISI DATA ASLI] Video lokal dari tim (2026-10-01). Letakkan berkas di
// public/videos/. Galeri merender <video> untuk .mp4 dan <iframe> untuk URL embed.
export const videos = [
  { id: 1, judul: "Profil Resmi SMK Telekomunikasi Tunas Harapan", desc: "Profil singkat sekolah.", src: "/videos/profil-sekolah.mp4" },
  { id: 2, judul: "Kegiatan Praktik Kejuruan & Teaching Factory", desc: "Dokumentasi praktik kejuruan dan TeFa.", src: "/videos/tefa-activity.mp4" },
];

// Bagan struktur organisasi sesuai situs resmi. `nama` diisi manual oleh tim.
// [ISI DATA ASLI] Bagan resmi struktur organisasi sekolah, dari gambar dikirim tim
// 2026-10-02. `unit: true` = unit kerja tanpa pejabat bernama di bagan (bukan kolom kosong).
export const strukturOrganisasi = [
  [
    { jabatan: 'Ketua Yayasan Tunas Harapan Semarang', nama: 'Wisnu Buwono, Bsc, MBA, Fin' },
    { jabatan: 'Kepala SMK', nama: 'Wisnu Handoko, S.T' },
    { jabatan: 'Partner', nama: 'Konsorsium, DuDi, Universitas, Pelaku Usaha/UMKM' },
  ],
  [
    { jabatan: 'Komite Sekolah', nama: 'Marnoto, B.A' },
    { jabatan: 'Ka. TU', nama: 'Wicaksono, A.Md' },
    { jabatan: 'Bendahara', nama: 'Marhamah, A.Md' },
  ],
  [
    { jabatan: 'Waka Kurikulum', nama: 'Rini Windarti, S.T, M.Pd' },
    { jabatan: 'Waka Kesiswaan', nama: 'Purnomo Sidi Aryo Bimo, S.T' },
    { jabatan: 'Waka Sarpras & Tenaga', nama: 'Zakhiyah Wulansari, S.Ag, M.Pd' },
    { jabatan: 'Waka Hubin', nama: 'Heru Budi Wiyatno, S.Ag, M.Pd' },
  ],
  [
    { jabatan: 'K3 PPLG', nama: 'Krisdayani Talentana, S.Kom, M.Kom' },
    { jabatan: 'K3 TJKT', nama: 'Aris Suryatno, S.T, M.Pd' },
    { jabatan: 'K3 DKV', nama: 'Hendra Christanto, S.Pd' },
    { jabatan: 'K3 TKR', nama: 'Anjar Wahyudi, S.Pd, M.Pd' },
  ],
  [
    { jabatan: 'BP/BK', unit: true },
    { jabatan: 'Staff TU', unit: true },
    { jabatan: 'Staff Kurikulum', unit: true },
    { jabatan: 'Staff Kesiswaan', unit: true },
    { jabatan: 'Staff Sarpras Tenaga', unit: true },
    { jabatan: 'Staff Hubin', unit: true },
    { jabatan: 'Bursa Kerja Khusus', unit: true },
    { jabatan: 'Tim SPMI', unit: true },
    { jabatan: 'Pembina Osis', unit: true },
  ],
  [
    { jabatan: 'Guru Kejuruan PPLG', unit: true },
    { jabatan: 'Guru Kejuruan TJKT', unit: true },
    { jabatan: 'Guru Kejuruan DKV', unit: true },
    { jabatan: 'Guru Kejuruan TKR', unit: true },
    { jabatan: 'Guru Umum', unit: true },
  ],
  [{ jabatan: 'Wali Kelas X, XI, XII', unit: true }],
  [{ jabatan: 'Murid', unit: true }],
];

// [DATA SEKOLAH] Nama guru produktif diambil dari daftar yang dipakai asisten virtual tim
// (chatbot-nextjs/data_sekolah/daftar_guru_jurusan.md, 2026-10-05). Untuk empat ketua
// kompetensi (K3) dipakai ejaan & gelar pada bagan resmi di atas karena sumber guru
// menulis variants yang berbeda — belum dikonfirmasi mana yang baku:
//   K3 PPLG: bagan "Krisdayani Talentana, S.Kom, M.Kom" vs daftar "Krisadyani Talentana, S.Kom."
//   K3 DKV : bagan "Hendra Christanto, S.Pd"          vs daftar "HendrsChristanto, S.Pd."
//   K3 TKR : bagan "Anjar Wahyudi, S.Pd, M.Pd"        vs daftar "Anjar Wahyudi, S.T." (guru TKR)
//   Waka/Si: "Purnomo Sidi Aryo Bimo" (bagan) vs "Purnomo Sidi Ario Bimo" (daftar)
// Pangkat Ibu/Bapak dari sumber dihilangkan agar seragam dengan entri lain. Foto belum ada.
export const guru = [
  {
    id: 1,
    nama: "Wisnu Handoko, S.T.",
    jabatan: "Kepala Sekolah",
    mengampu: "Produktif / Mata Pelajaran Kejuruan",
    foto: null,
  },
  {
    id: 2,
    nama: "Krisdayani Talentana, S.Kom, M.Kom",
    jabatan: "K3 PPLG",
    mengampu: "Pengembangan Perangkat Lunak & Gim",
    foto: null,
  },
  { id: 3, nama: "Rini Windarti, S.T.", jabatan: "Guru PPLG", mengampu: "Pengembangan Perangkat Lunak & Gim", foto: null },
  { id: 4, nama: "Faizi Widadi, S.Kom.", jabatan: "Guru PPLG", mengampu: "Pengembangan Perangkat Lunak & Gim", foto: null },
  { id: 5, nama: "Dian Arif Maharhdi Raharjo, S.Si", jabatan: "Guru PPLG", mengampu: "Pengembangan Perangkat Lunak & Gim", foto: null },
  { id: 6, nama: "Sevylia, S.Kom", jabatan: "Guru PPLG", mengampu: "Pengembangan Perangkat Lunak & Gim", foto: null },
  { id: 7, nama: "Rian Kustito, S.PDkom", jabatan: "Guru PPLG", mengampu: "Pengembangan Perangkat Lunak & Gim", foto: null },
  {
    id: 8,
    nama: "Aris Suryatno, S.T, M.Pd",
    jabatan: "K3 TJKT",
    mengampu: "Teknik Jaringan Komputer & Telekomunikasi",
    foto: null,
  },
  { id: 9, nama: "Siti Karunia Sari, S.Kom.", jabatan: "Guru TJKT", mengampu: "Teknik Jaringan Komputer & Telekomunikasi", foto: null },
  { id: 10, nama: "Tri Joko Mulyono, S.Kom.", jabatan: "Guru TJKT", mengampu: "Teknik Jaringan Komputer & Telekomunikasi", foto: null },
  { id: 11, nama: "Akhmad Fajar, S.Kom.", jabatan: "Guru TJKT", mengampu: "Teknik Jaringan Komputer & Telekomunikasi", foto: null },
  {
    id: 12,
    nama: "Hendra Christanto, S.Pd",
    jabatan: "K3 DKV",
    mengampu: "Desain Komunikasi Visual & Multimedia",
    foto: null,
  },
  { id: 13, nama: "Mushofa, S.Kom.", jabatan: "Guru DKV", mengampu: "Desain Komunikasi Visual & Multimedia", foto: null },
  { id: 14, nama: "Purnomo Sidi Aryo Bimo, S.T", jabatan: "Guru DKV", mengampu: "Desain Komunikasi Visual & Multimedia", foto: null },
  { id: 15, nama: "Arif Lestiyono, S.Kom.", jabatan: "Guru DKV", mengampu: "Desain Komunikasi Visual & Multimedia", foto: null },
  { id: 16, nama: "Yunika Arum Prajanti, S.I.Kom.", jabatan: "Guru DKV", mengampu: "Desain Komunikasi Visual & Multimedia", foto: null },
  { id: 17, nama: "Ristiana Suci Wulandari, S.Ds.", jabatan: "Guru DKV", mengampu: "Desain Komunikasi Visual & Multimedia", foto: null },
  {
    id: 18,
    nama: "Anjar Wahyudi, S.Pd, M.Pd",
    jabatan: "K3 TKR",
    mengampu: "Teknik Kendaraan Ringan",
    foto: null,
  },
  { id: 19, nama: "Dimas Yogo Pratomo, S.T.", jabatan: "Guru TKR", mengampu: "Teknik Kendaraan Ringan", foto: null },
  {
    id: 20,
    nama: "Tim Guru Normatif & Adaptif",
    jabatan: "Team Teaching",
    mengampu: "Matematika, Bahasa Indonesia, Bahasa Inggris, Pend. Agama, PPKn, Sejarah Indonesia",
    foto: null,
  },
];

export const visiMisi = {
  // Sumber: chatbot-nextjs/data_sekolah/Profil.md. Versi lama ("Menjadi lembaga pendidikan
  // vokasi unggulan...") tidak ditemukan di dokumen sekolah — tunggu konfirmasi bila sekolah
  // tetap memakai naskah tersebut.
  visi: "Terwujudnya SMK unggul, berkarakter, berdaya saing global, dan link and match dengan Dunia Usaha dan Dunia Industri (DUDI) berbasis teknologi dan kreativitas.",
  misi: [
    "Menyelenggarakan pembelajaran berbasis industri dan teknologi.",
    "Menghasilkan lulusan kompeten, berkarakter Pancasila, dan siap kerja/berwirausaha.",
    "Mengembangkan SDM pendidik dan tenaga kependidikan yang profesional.",
    "Memperkuat kemitraan dengan DUDI, perguruan tinggi, dan masyarakat.",
    "Mewujudkan tata kelola sekolah yang transparan, akuntabel, dan berkelanjutan.",
  ],
};

// [DATA SEKOLAH] chatbot-nextjs/data_sekolah/fasilitas.md — dijelaskan seperti bunyi
// dokumen aslinya, tanpa menambah detail yang tidak ditulis sekolah.
export const fasilitas = [
  {
    nama: "Teaching Factory (TeFa)",
    ket: "Pembelajaran tempat siswa memproduksi barang atau jasa nyata seperti di industri sungguhan. Untuk PPLG tersedia beberapa ruangan yang menunjang pembelajaran produktif.",
  },
  {
    nama: "Tempat Uji Kompetensi (TUK) Mandiri",
    ket: "Fasilitas yang disertifikasi Lembaga Sertifikasi Profesi (LSP) Teknologi Digital untuk ujian kompetensi siswa TKJ.",
  },
  {
    nama: "Aula Asrama Siswa (Lantai 1)",
    ket: "Digunakan untuk kegiatan besar seperti seminar dan tes rekrutmen perusahaan.",
  },
  {
    nama: "Masjid",
    ket: "Fasilitas ibadah bagi siswa, siswi, guru, dan seluruh warga sekolah.",
  },
];

// [DATA SEKOLAH] chatbot-nextjs/data_sekolah/ekstrakulikuler.md
export const ekstrakurikuler = [
  { nama: "Pramuka", ket: "Wajib" },
  { nama: "Pleton Inti", ket: null },
  { nama: "Klub Bahasa", ket: null },
  { nama: "Band", ket: null },
  { nama: "Bola ping-pong", ket: null },
  { nama: "Olahraga", ket: "Sepak Bola, Basket, Bola Voli, Badminton, Pencak Silat" },
];

// [DATA SEKOLAH] chatbot-nextjs/data_sekolah/pkl.md — syarat & durasi persis seperti naskah.
export const pkl = {
  info: "Program wajib bagi siswa kelas XI untuk mendapatkan pengalaman langsung di dunia industri.",
  syarat: [
    "Menyelesaikan seluruh tugas mata pelajaran produktif pada semester sebelumnya.",
    "Kehadiran sekolah minimal 90%.",
    "Lulus pembekalan kedisiplinan dan budaya kerja industri.",
  ],
  durasi: "3 sampai 6 bulan, tergantung kesepakatan dengan industri mitra.",
  lokasi: "Perusahaan teknologi, software house, dan instansi IT di wilayah Salatiga dan sekitarnya. Siswa boleh mengajukan tempat PKL mandiri yang relevan dengan jurusannya.",
};

// [DATA SEKOLAH] chatbot-nextjs/data_sekolah/BKK.md — contoh kegiatan disebut sekolah
// sendiri, jadi dikutip apa adanya.
export const bkk = {
  nama: "Hubungan Industri (Hubin) & Bursa Kerja Khusus (BKK)",
  info: "Unit aktif yang memperbesar kerja sama dengan dunia usaha dan dunia industri serta tingkat serapan lulusan ke lapangan kerja.",
  kegiatan: [
    "Tes rekrutmen calon karyawan langsung di sekolah, contohnya rekrutmen PT Fukusuke Kogyo Indonesia di aula sekolah.",
    "Informasi lowongan kerja aktif untuk alumni, seperti Web Developer di Educa Studio, Technical Support di G-Media, dan posisi IT lainnya.",
  ],
};

// [DATA SEKOLAH] chatbot-nextjs/data_sekolah/Aturan.md
export const tataTertib = [
  "Siswa dilarang memiliki tato dan tindik (bagi laki-laki), serta harus lolos tes kesehatan dasar saat pendaftaran.",
  "Calon siswa menandatangani kesanggupan menaati seluruh tata tertib sekolah, termasuk kesiapan wali murid mendukung program kedisiplinan yang ditetapkan.",
];

// [DATA SEKOLAH] chatbot-nextjs/data_sekolah/ppdb.md. Rincian BIAYA sengaja tidak
// dimasukkan: sumber aslinya tertulis "mengacu data PPDB 2022/2023" dan belum dikonfirmasi
// untuk tahun ajaran berjalan.
export const ppdbResmi = {
  portal: "https://spmb.tunasharapan.info",
  sistem: "Bebas zonasi — tidak dibatasi wilayah zona seperti sekolah negeri.",
  alur: [
    "Mengisi formulir pendaftaran; formulir online bersifat sementara sebagai bukti pendaftaran awal.",
    "Data lengkap diisi saat pendaftaran langsung di sekolah.",
    "Informasi waktu tes dan syarat lengkap dikirim sekolah melalui WhatsApp (atau SMS bila tidak memiliki WhatsApp) setelah formulir diisi.",
  ],
  catatan: ["Tersedia asrama bagi siswa yang membutuhkan."],
};

// [ISI DATA ASLI] Berita supplied oleh tim (2026-10-01). Bentuk entri Beranda:
// { id, judul, tanggal: "YYYY-MM-DD", ringkas }
export const berita = [
  {
    id: 1,
    judul: "PPDB Tahun Ajaran Baru Resmi Dibuka",
    tanggal: "2026-06-01",
    ringkas: "Pendaftaran siswa-siswi baru SMK Telekomunikasi Tunas Harapan telah dibuka untuk berbagai program unggulan jurusan.",
  },
  {
    id: 2,
    judul: "Siswa SMK TTH Menorehkan Prestasi Sertifikasi Internasional",
    tanggal: "2026-09-07",
    ringkas: "Siswa kembali menorehkan prestasi dalam pencapaian skor sertifikasi bahasa dan keahlian IT global.",
  },
];
