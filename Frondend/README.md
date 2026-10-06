# AskTunas — Frontend (folder `Frondend/`)

Portal informasi SMK Telekomunikasi Tunas Harapan + antarmuka asisten virtual, dibangun
untuk INCEPTION 2026. React 19 + Vite + Tailwind v4 + framer-motion + react-router-dom 7.

## Menjalankan

```bash
npm ci
npm run dev      # http://localhost:5173 (port bergeser kalau sudah dipakai)
npm run build    # produksi ke dist/
npm run preview  # pratinjau hasil build
npm run lint     # oxlint
```

## Tempat apa berada

| Berkas | Isi |
|---|---|
| `src/data/content.js` | **Satu-satunya sumber teks & data sekolah.** Semua halaman membaca dari sini. |
| `src/index.css` | Design token (`@theme`), gaya komponen (`.btn`, `.depth-card`, `.band-*`), dan seluruh override mode gelap `html.dark`. |
| `src/App.jsx` | Daftar rute — sumber tercepat untuk tahu halaman apa saja yang ada. |
| `src/services/chat.js` | Pemanggilan API asisten (`https://inception-ebon.vercel.app/api/chat`). |
| `src/components/TunasChat.jsx` | Komponen chat di `/chat`. |
| `public/images/` | Foto galeri, lambang jurusan (`jurusan/`), logo mitra (`mitra/`), ikon PWA. |

## Aturan data

- Jangan mengarang nama orang, jabatan, angka, biaya, atau caption foto. Kalau belum ada
  datanya, biarkan `null`/`[]` — halaman sudah menampilkan empty state yang jujur.
- Tandai slot yang menunggu data resmi dengan komentar `[ISI DATA ASLI]`.
- Data yang dikirim tim dikumpulkan di `../chatbot-nextjs/data_sekolah/*.md` (dipakai juga
  oleh asisten virtual). Saat menyalin dari sana, sebut sumbernya di komentar seperti yang
  sudah dilakukan pada `fasilitas`, `pkl`, `bkk`, `tataTertib`, `ppdbResmi`, dan `guru`.
- Rincian biaya PPDB di sumber tim masih tertulis "mengacu data PPDB 2022/2023" — jangan
  ditampilkan sebelum panitia mengonfirmasi angka tahun berjalan.

## Mode gelap

Tema gelap memakai override per utilitas (`html.dark .text-slate-600 { ... }`), bukan
membalik token `--color-brand-*`. Penyebabnya: `bg-brand-950` (permukaan gelap) dan
`text-brand-950` (teks gelap) memakai token yang sama, jadi memalik token membuat salah
satu tidak terbaca. Jangan gunakan `!important` atau inline style untuk soal warna.

## Keamanan

- Jangan menaruh API key apa pun di kode client. Key Groq hanya ada di backend
  (`chatbot-nextjs/.env.local`, sudah di-gitignore).
- `/admin` hanya dashboard lokal (membaca `localStorage`), bukan sistem panitia sungguhan,
  dan sudah `noindex`.
