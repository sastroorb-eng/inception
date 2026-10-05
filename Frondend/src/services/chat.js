// Chat service for the AskTunas RAG assistant.
//
// Semua jawaban mock dibangun dari src/data/content.js (data resmi sekolah) —
// tidak ada fakta yang dikarang. Ganti `USE_MOCK` ke false setelah endpoint
// backend siap; bentuk respons yang diharapkan: { reply: string, sources?: string[] }

import { school, stats, identitas, sejarah, jurusan } from '../data/content'

const USE_MOCK = true
const API_URL = '/api/chat' // TODO(backend): real endpoint

const daftarJurusan = jurusan.map((j) => `${j.nama} (${j.kode})`).join(', ')
const akreditasi = identitas.find((i) => i.label === 'Akreditasi')?.value ?? null
const npsn = identitas.find((i) => i.label === 'NPSN')?.value ?? null
const jamTu = school.jamLayanan.map((j) => `${j.hari}: ${j.jam}`).join(' · ')
const angkaStats = stats
  .filter((s) => s.verified && s.value !== null)
  .map((s) => `${s.label} ${s.value}${s.suffix}`)
  .join(', ')

const mockKnowledge = [
  {
    keys: ['jurusan', 'program', 'keahlian', 'prodi'],
    reply: `Saat ini ada ${jurusan.length} program keahlian: ${daftarJurusan}. Mau tahu detail salah satunya?`,
  },
  {
    keys: ['ppdb', 'daftar', 'pendaftaran', 'masuk'],
    reply:
      'Pendaftaran PPDB 2026/2027 sudah dibuka. Isi formulir tiga langkah di menu "PPDB": data siswa, pilihan program + berkas persyaratan, lalu konfirmasi. Panitia akan memverifikasi datamu.',
  },
  {
    keys: ['fasilitas', 'lab', 'gedung', 'sarana'],
    reply:
      'Fasilitas yang terdokumentasi di portal: gedung utama, laboratorium komputer, workshop/kelas TJKT, dan area sekolah. Foto lengkapnya bisa dilihat di menu "Galeri".',
  },
  {
    keys: ['biaya', 'spp', 'bayar', 'uang'],
    reply: `Untuk informasi biaya pendidikan terbaru, silakan hubungi bagian administrasi di ${school.phone} atau email ${school.email} pada jam layanan (${jamTu}).`,
  },
  {
    keys: ['alamat', 'lokasi', 'dimana', 'di mana'],
    reply: `Sekolah kami berlokasi di ${school.address}.`,
  },
  {
    keys: ['jam', 'buka', 'operasional', 'tata usaha'],
    reply: `Jam layanan tata usaha — ${jamTu}.`,
  },
  {
    keys: ['akreditasi', 'npsn', 'status'],
    reply:
      akreditasi && npsn
        ? `Status sekolah kami ${
            identitas.find((i) => i.label === 'Status Sekolah')?.value ?? ''
          }, terakreditasi ${akreditasi} dengan NPSN ${npsn}.`
        : 'Data formal sekolah belum lengkap dipublikasikan; hubungi TU untuk konfirmasi.',
  },
  {
    keys: ['sejarah', 'berdiri', 'cerita'],
    reply: sejarah[0] ? `Sekilas sejarah: ${sejarah[0]}` : 'Narasi sejarah resmi belum tersedia — hubungi pihak sekolah.',
  },
  {
    keys: ['siswa', 'guru', 'pengajar', 'murid', 'jumlah'],
    reply: angkaStats
      ? `Berdasarkan data portal: ${angkaStats}.`
      : 'Angka statistik resmi belum tersedia di portal.',
  },
]

function mockReply(message) {
  const lower = message.toLowerCase()
  const hit = mockKnowledge.find((k) => k.keys.some((key) => lower.includes(key)))
  return hit
    ? hit.reply
    : 'Pertanyaan menarik! Sebagai asisten AskTunas, aku hanya menjawab berdasarkan data resmi sekolah. Coba tanyakan seputar jurusan, PPDB, fasilitas, akreditasi, jam layanan, atau kontak sekolah.'
}

export async function sendMessage(message, history = []) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 700)) // simulate network/latency
    return { reply: mockReply(message), sources: ['Data resmi sekolah'] }
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  })
  if (!res.ok) throw new Error('Gagal menghubungi asisten.')
  return res.json()
}
