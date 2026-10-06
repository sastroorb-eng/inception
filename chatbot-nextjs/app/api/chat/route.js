import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import Groq from 'groq-sdk';

// 1. INISIALISASI GROQ
// Next.js secara otomatis akan membaca kunci dari file .env.local
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Variabel memori global untuk menyimpan riwayat chat sementara
let riwayatChat = [];

// 2. FUNGSI MEMBACA SEMUA DATA SEKOLAH DARI FOLDER .md
function muatSemuaDataSekolah() {
    let semuaData = "";
    // process.cwd() mengarah ke root folder proyek (chatbot-nextjs)
    const folderData = path.join(process.cwd(), 'data_sekolah');
    
    try {
        if (fs.existsSync(folderData)) {
            const files = fs.readdirSync(folderData);
            for (const file of files) {
                if (file.endsWith(".md")) {
                    const filePath = path.join(folderData, file);
                    const content = fs.readFileSync(filePath, "utf-8");
                    semuaData += `\n\n--- INFO DARI ${file.toUpperCase()} ---\n${content}`;
                }
            }
        } else {
            console.warn("Folder data_sekolah tidak ditemukan!");
            semuaData = "Data sekolah belum tersedia.";
        }
    } catch (error) {
        console.error("Gagal membaca folder data_sekolah:", error);
    }
    return semuaData;
}

const kumpulanInformasi = muatSemuaDataSekolah();

// 3. INSTRUKSI KARAKTER AI (PROMPT ENGINEERING)
const instruksiSekolah = `
Kamu adalah asisten virtual resmi untuk SMK Telekomunikasi Tunas Harapan (SMK Telkom Salatiga). 
Tugas utamamu adalah memberikan informasi yang LENGKAP, JELAS, RINCI, dan RAMAH berdasarkan DATA SEKOLAH di bawah.

ATURAN MENJAWAB (SANGAT PENTING):
Kamu adalah TunasChat, asisten virtual ramah dan cerdas resmi untuk SMK Telekomunikasi Tunas Harapan (SMK Telkom Salatiga). 
Selalu sapa pengguna dengan ramah jika ini adalah awal obrolan.
1. Jawablah selengkap mungkin! Jika ditanya soal PPDB, profil, atau biaya, jabarkan poin per poin agar jelas.
2. Gunakan tanda strip (-) untuk membuat daftar/list agar rapi dan enak dibaca.
3. JANGAN gunakan tanda bintang tebal (seperti **teks**). Gunakan baris baru (Enter) saja untuk merapikan teks.
4. Gunakan gaya bahasa santai, sopan, dan ramah, sesekali gunakan emoji yang sesuai (misal: 🏫, 💸, ✨).
5. Dilarang mengarang harga/informasi. Hanya gunakan data dari DATA SEKOLAH.
6. Bisa di ajak bercanda.
7. Bisa roleplay seperti Tsundere, Cool dll jika di minta user.
8. Jangan menggunakan tanda bintang **teks**.
9. TUGAS MUTLAK: Kamu HANYA BOLEH menjawab pertanyaan seputar sekolah. JIKA pengguna bertanya di luar topik sekolah (seperti meminta kode program, matematika, resep, cuaca, dll), KAMU HARUS MENOLAK dengan sopan dan mengingatkan bahwa kamu hanya asisten SMK Telkom Salatiga. DILARANG KERAS memberikan jawaban dari pengetahuan umum di luar konteks sekolah!


DATA SEKOLAH:
${kumpulanInformasi}
`;

// 4. ENDPOINT POST UNTUK MENERIMA PESAN (PENGGANTI @app.route)
export async function POST(request) {
    try {
        const body = await request.json();
        const pesanUser = body.pesan;

        if (!pesanUser) {
            return NextResponse.json({ error: "Pesan tidak boleh kosong" }, { status: 400 });
        }

        // Simpan pesan user ke memori
        riwayatChat.push({ role: "user", content: pesanUser });

        // Batasi memori maksimal 6 pesan agar token tetap hemat
        if (riwayatChat.length > 6) {
            riwayatChat.shift(); // Hapus pesan paling lama (index 0)
        }

        // Gabungkan instruksi utama dengan riwayat obrolan
        const pesanLengkap = [{ role: "system", content: instruksiSekolah }, ...riwayatChat];

     // ... (kode sebelumnya)
        // Eksekusi ke Groq menggunakan model andalan
        const chatCompletion = await groq.chat.completions.create({
            messages: pesanLengkap,
            model: "openai/gpt-oss-20b", 
            temperature: 0.7, 
        });

        // 1. Ambil jawaban asli dari AI
        let jawabanAi = chatCompletion.choices[0].message.content;

        // 2. BERSIHKAN TANDA BINTANG (Hapus secara paksa menggunakan Regex)
        // Ini akan mencari semua kombinasi ** dan * lalu menghapusnya
        const jawabanBersih = jawabanAi.replace(/\*{1,2}/g, ""); 

        // Simpan balasan AI yang sudah bersih ke memori
        riwayatChat.push({ role: "assistant", content: jawabanBersih });

        // Kembalikan balasan yang sudah BERSIH ke frontend
        return NextResponse.json({ balasan: jawabanBersih }, { status: 200 });

    } catch (error) {
        // ...
        console.error("Error dari Groq:", error);
        return NextResponse.json({ error: "Terjadi kesalahan pada server AI" }, { status: 500 });
    }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}