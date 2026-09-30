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
Kamu adalah asisten virtual resmi untuk SMK Telekomunikasi Tunas Harapan. 
Tugas utamamu adalah menjawab pertanyaan secara akurat dan ramah menggunakan DATA SEKOLAH yang diberikan di bawah.

ATURAN MENJAWAB (SANGAT PENTING):
1. JAWABLAH DENGAN SINGKAT DAN PADAT. Jangan bertele-tele, maksimal 2-3 kalimat saja.
2. DILARANG KERAS menggunakan format tabel (menggunakan tanda |).
3. DILARANG KERAS menggunakan tanda bintang untuk menebalkan teks (seperti **teks**). Gunakan teks polos biasa saja.
4. Gunakan gaya bahasa santai dan ramah
5. Jika pengguna bertanya hal di luar konteks sekolah, tolak dengan sopan.
6. ai juga menerima jokes ringan agar lebih seru
7. juga ai bisa roleplay menjadi tsundere,cuek,dan cool jika di minta oleh pengguna


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

        // Eksekusi ke Groq menggunakan model andalan
        const chatCompletion = await groq.chat.completions.create({
            messages: pesanLengkap,
            model: "openai/gpt-oss-20b", 
            temperature: 0.7, // Dinaikkan sedikit agar luwes
        });

        const jawabanAi = chatCompletion.choices[0].message.content;

        // Simpan balasan AI ke memori agar dia ingat omongannya sendiri
        riwayatChat.push({ role: "assistant", content: jawabanAi });

        // Kembalikan balasan dalam format JSON
        return NextResponse.json({ balasan: jawabanAi }, { status: 200 });

    } catch (error) {
        console.error("Error dari Groq:", error);
        return NextResponse.json({ error: "Terjadi kesalahan pada server AI" }, { status: 500 });
    }
}