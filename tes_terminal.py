import requests

print("========================================")
print("  SIMULASI CHATBOT DI TERMINAL  ")
print("  (Ketik 'keluar' untuk berhenti) ")
print("========================================\n")

while True:
    # 1. Mengambil input ketikan darimu
    pesan_kamu = input("Kamu : ")
    
    if pesan_kamu.lower() == 'keluar':
        print("Meninggalkan chat...")
        break
        
    try:
        # 2. Ini adalah simulasi cara Next.js mengirim pesan ke API-mu!
        response = requests.post(
            "http://127.0.0.1:5000/api/chat", 
            json={"pesan": pesan_kamu}
        )
        
        # 3. Menampilkan balasan dari API
        if response.status_code == 200:
            jawaban_ai = response.json().get("balasan")
            print(f"AI   : {jawaban_ai}\n")
        else:
            print(f"Error dari server: {response.text}\n")
            
    except requests.exceptions.ConnectionError:
        print("ERROR: Server Flask belum menyala. Pastikan kamu sudah menjalankan 'python app.py' di terminal lain.\n")