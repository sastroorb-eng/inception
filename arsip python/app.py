from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from groq import Groq

# Memuat variabel lingkungan dari file .env
load_dotenv()

app = Flask(__name__)
CORS(app)

# 1. INISIALISASI GROQ
API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=API_KEY)

 
# 2. FUNGSI BACA DATA SEKOLAH (TETAP SAMA)
def muat_semua_data_sekolah():
    semua_data = ""
    folder_data = "data_sekolah"
    
    if os.path.exists(folder_data):
        for nama_file in os.listdir(folder_data):
            if nama_file.endswith(".md"):
                path_file = os.path.join(folder_data, nama_file)
                with open(path_file, "r", encoding="utf-8") as file:
                    semua_data += f"\n\n--- INFO DARI {nama_file.upper()} ---\n"
                    semua_data += file.read()
    else:
        semua_data = "Data sekolah belum tersedia."
        
    return semua_data

kumpulan_informasi = muat_semua_data_sekolah()

instruksi_sekolah = f"""
Kamu adalah asisten virtual resmi untuk SMK Telekomunikasi Tunas Harapan. 
Tugas utamamu adalah menjawab pertanyaan secara akurat dan ramah menggunakan DATA SEKOLAH yang diberikan di bawah.

ATURAN MENJAWAB (SANGAT PENTING):
1. JAWABLAH DENGAN SINGKAT DAN PADAT. Jangan bertele-tele, maksimal 2-3 kalimat saja.
2. DILARANG KERAS menggunakan format tabel (menggunakan tanda |).
3. DILARANG KERAS menggunakan tanda bintang untuk menebalkan teks (seperti **teks**). Gunakan teks polos biasa saja.
4. Gunakan gaya bahasa santai dan ramah
5. Jika pengguna bertanya hal di luar konteks sekolah, tolak dengan sopan.
6. ai bisa di ajak bercanda misal berganti menjadi tsundere

DATA SEKOLAH:
{kumpulan_informasi}
"""
@app.route('/')
def beranda():
    return jsonify({"pesan": "Backend Chatbot Sekolah Menyala dengan Groq!"})

# --- VARIABEL MEMORI (Taruh di atas @app.route) ---
riwayat_chat = []

@app.route('/api/chat', methods=['POST'])
def chat():
    global riwayat_chat # Panggil memori global
    
    data = request.json
    pesan_user = data.get("pesan")

    if not pesan_user:
        return jsonify({"error": "Pesan tidak boleh kosong"}), 400

    try:
        # 1. Simpan pesan pengguna ke memori
        riwayat_chat.append({"role": "user", "content": pesan_user})

        # 2. Batasi memori maksimal 6 baris obrolan agar token tetap awet
        if len(riwayat_chat) > 6:
            riwayat_chat.pop(0)

        # 3. Gabungkan aturan sekolah + riwayat obrolan
        pesan_lengkap = [{"role": "system", "content": instruksi_sekolah}] + riwayat_chat

        # 4. Eksekusi menggunakan Llama 3.1 yang aktif dan super cepat
        chat_completion = client.chat.completions.create(
            messages=pesan_lengkap,
            model="openai/gpt-oss-20b",
            temperature=0.7, # Dinaikkan sedikit agar luwes saat diajak bercanda
        )
        
        jawaban_ai = chat_completion.choices[0].message.content
        
        # 5. AI mengingat jawabannya sendiri
        riwayat_chat.append({"role": "assistant", "content": jawaban_ai})

        return jsonify({"balasan": jawaban_ai})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
