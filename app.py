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
Kamu adalah asisten virtual resmi untuk sekolah menengah ini. 
Tugas utamamu adalah menjawab pertanyaan secara akurat, informatif, dan ramah menggunakan DATA SEKOLAH yang diberikan di bawah.
Jika pengguna bertanya hal yang di luar konteks atau tidak ada di dalam data ini, tolak dengan sopan.

DATA SEKOLAH:
{kumpulan_informasi}
"""

@app.route('/')
def beranda():
    return jsonify({"pesan": "Backend Chatbot Sekolah Menyala dengan Groq!"})

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    pesan_user = data.get("pesan")

    if not pesan_user:
        return jsonify({"error": "Pesan tidak boleh kosong"}), 400

    try:
        # 3. KODE BARU UNTUK MEMANGGIL AI GROQ
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": instruksi_sekolah},
                {"role": "user", "content": pesan_user}
            ],
            model="openai/gpt-oss-20b", # Model AI yang terkenal sangat cepat dan pintar
            temperature=0.5, # Membuat jawaban terukur dan tidak halu
        )
        
        # Mengambil teks balasan dari Groq
        jawaban_ai = chat_completion.choices[0].message.content
        return jsonify({"balasan": jawaban_ai})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)