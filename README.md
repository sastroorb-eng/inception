# Backend API - Chatbot Profil Sekolah SMK Telekomunikasi Tunas Harapan

Proyek ini adalah sistem backend untuk website profil sekolah yang terintegrasi dengan Artificial Intelligence (AI). Sistem ini dikembangkan untuk kompetisi INCEPTION Vol. 2 Tahun 2026.

## Teknologi yang Digunakan
- **Bahasa Pemrograman:** Python
- **Framework:** Flask
- **Generative AI:** Groq API (llama-3.1-8b-instant)
- **Library Tambahan:** python-dotenv, flask-cors, groq, gunicorn

## Petunjuk Instalasi

1. Clone repositori ini ke dalam komputer lokal:
   ```bash
   git clone https://github.com/username-kamu/backend-inception.git
   ```

2. Masuk ke folder proyek:
   ```bash
   cd backend-inception
   ```

3. Install semua library pendukung:
   ```bash
   pip install -r requirements.txt
   ```

4. Buat file `.env` di folder proyek dan masukkan API Key Groq:
   ```env
   GROQ_API_KEY=gsk_masukkan_api_key_kamu_disini
   ```

5. Jalankan server lokal:
   ```bash
   python app.py
   ```

6. (Opsional) Untuk menguji chatbot langsung melalui terminal lokal, buka terminal baru dan jalankan:
   ```bash
   python tes_terminal.py
   ```