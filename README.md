# 🎓 Inception: TunasBot - Asisten Virtual SMK Telkom Salatiga

Selamat datang di repositori **Inception**! Proyek ini berisi pengembangan **TunasBot**, sebuah asisten virtual cerdas berbasis AI yang dirancang khusus untuk memberikan layanan informasi cepat, interaktif, dan akurat seputar SMK Telekomunikasi Tunas Harapan (SMK Telkom Salatiga).

## ✨ Fitur Utama

- 🤖 **AI Super Cepat:** Terintegrasi dengan Groq API menggunakan model `openai/gpt-oss-20b` untuk respons obrolan yang natural dan instan.
- 🏫 **Konteks Terkunci (Strict Prompting):** AI dikonfigurasi secara ketat untuk **hanya** menjawab pertanyaan terkait sekolah (Profil, Jurusan, PPDB, dan Fasilitas). Mampu menolak pertanyaan di luar topik dengan sopan.
- 🔊 **Pemutar Suara (Text-to-Speech):** Dilengkapi tombol "Putar Suara" untuk membacakan respons teks dari TunasBot.
- 🔄 **Reset Percakapan:** Tombol khusus untuk menghapus riwayat obrolan dan memulai percakapan baru.
- 🎨 **Antarmuka Modern:** Dibangun menggunakan React (Vite) dengan gaya desain yang responsif dan elegan.

## 🛠️ Teknologi yang Digunakan

- **Frontend:** React.js (Vite), Tailwind CSS
- **Backend (API Chatbot):** Next.js (App Router)
- **AI Engine:** Groq API (`openai/gpt-oss-20b`)
- **Deployment:** Vercel

## 📂 Struktur Direktori Utama

- `/Frondend` : Berisi kode sumber untuk antarmuka pengguna (UI) website utama dan komponen `TunasChat.jsx`.
- `/chatbot-nextjs` : Berisi mesin *backend* Next.js tempat instruksi AI (*prompt engineering*) dan integrasi API Groq dijalankan.

## 🚀 Cara Menjalankan Proyek Secara Lokal

Pastikan kamu sudah menginstal **Node.js** dan **npm** di laptopmu. Karena proyek ini terdiri dari dua bagian (Frontend dan Backend API), kamu perlu membuka dua terminal yang berbeda.

### 1. Menjalankan Backend API (TunasBot)
Buka terminal pertama, lalu jalankan:
```bash
cd chatbot-nextjs
npm install