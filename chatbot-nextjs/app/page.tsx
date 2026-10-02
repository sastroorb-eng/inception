"use client";

import { useState, useRef, useEffect } from "react";

type Pesan = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<Pesan[]>([]);
  const [loading, setLoading] = useState(false);
  
  // State untuk Next.js Hydration agar tidak error saat membaca waktu & LocalStorage
  const [isMounted, setIsMounted] = useState(false); 
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // FITUR 4: Sapaan Otomatis berdasarkan Jam (WIB)
  const getWaktuSalam = () => {
    const jam = new Date().getHours();
    if (jam < 11) return "Selamat Pagi 🌞";
    if (jam < 15) return "Selamat Siang ☀️";
    if (jam < 18) return "Selamat Sore 🌇";
    return "Selamat Malam 🌙";
  };

  const pesanAwal: Pesan = { 
    role: "assistant", 
    content: `${getWaktuSalam()} Kak! 👋 Aku TunasChat, asisten virtual SMK Telekomunikasi Tunas Harapan. Ada yang ingin ditanyakan seputar sekolah, jurusan, atau PPDB?` 
  };

  // FITUR 2: Mengambil Memori dari Local Storage saat pertama kali dibuka
  useEffect(() => {
    setIsMounted(true);
    const simpananChat = localStorage.getItem("chat_tunasChat");
    if (simpananChat) {
      setChat(JSON.parse(simpananChat)); // Jika ada riwayat, panggil lagi
    } else {
      setChat([pesanAwal]); // Jika baru pertama buka, beri sapaan
    }
  }, []);

  // Menyimpan setiap kali ada pesan baru ke Local Storage & Scroll ke bawah
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("chat_tunasChat", JSON.stringify(chat));
    }
    scrollToBottom();
  }, [chat, isMounted]);

  const pertanyaanCepat = [
    "Berapa biaya masuk PPDB?",
    "Apa saja jurusan yang ada?",
    "Bagaimana syarat daftarnya?",
    "Dimana alamat sekolahnya?"
  ];

  const kirimPesan = async (teksPesan: string = input) => {
    if (!teksPesan.trim() || loading) return;

    const pesanUser: Pesan = { role: "user", content: teksPesan };
    setChat((prev) => [...prev, pesanUser]);
    setInput(""); 
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pesan: pesanUser.content }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal terhubung");
      }

      const balasanAi: Pesan = { role: "assistant", content: data.balasan };
      setChat((prev) => [...prev, balasanAi]);

    } catch (err: any) {
      setChat((prev) => [...prev, { role: "assistant", content: `Waduh error: ${err.message} 😅` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      kirimPesan(input);
    }
  };

  const hapusObrolan = () => {
    if(confirm("Yakin ingin mereset obrolan dengan TunasChat?")) {
      setChat([pesanAwal]);
      localStorage.removeItem("chat_tunasChat"); // Hapus juga dari memori browser
    }
  };

  // FITUR 3: Ekspor Obrolan menjadi file TXT
  const unduhObrolan = () => {
    const teks = chat.map(c => `${c.role === "user" ? "Kamu" : "TunasChat"}:\n${c.content}\n`).join("\n- - - - - - - - - - - - - - - -\n\n");
    const blob = new Blob([teks], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Riwayat_Chat_TunasChat.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Cegah error tampilan sebelum script berjalan sempurna
  if (!isMounted) return null;

  return (
    <main className="flex flex-col h-screen bg-[#f5f7fb] font-sans">
      {/* HEADER */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center border-b">
        <div>
          <h1 className="font-bold text-lg text-slate-800">TunasChat 🤖</h1>
          <p className="text-xs text-slate-500">Asisten SMK Telkom Salatiga</p>
        </div>
        
        {/* Tombol Aksi di Kanan Atas */}
        <div className="flex gap-2">
          {/* Tombol Download Riwayat */}
          <button 
            onClick={unduhObrolan}
            className="text-xs md:text-sm bg-green-50 hover:bg-green-100 text-green-600 px-3 py-2 rounded-lg font-medium transition flex items-center gap-1"
            title="Download Riwayat Obrolan"
          >
            📥 Simpan
          </button>
          
          {/* Tombol Hapus/Reset */}
          <button 
            onClick={hapusObrolan}
            className="text-xs md:text-sm bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg font-medium transition flex items-center gap-1"
            title="Mulai Ulang"
          >
            🗑️ Reset
          </button>
        </div>
      </header>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat.map((c, i) => (
          <div key={i} className={`flex ${c.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] px-4 py-2 rounded-2xl text-[14px] leading-relaxed whitespace-pre-wrap
              ${c.role === "user" ? "bg-blue-600 text-white rounded-br-none" : "bg-white text-slate-800 shadow-sm rounded-bl-none border"}`}
            >
              {c.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-2 rounded-2xl rounded-bl-none shadow-sm border text-sm text-slate-400">
              TunasChat sedang mengetik...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* QUICK PROMPTS */}
      <div className="bg-white px-4 pt-3 pb-2 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide border-t">
        {pertanyaanCepat.map((tanya, index) => (
          <button
            key={index}
            onClick={() => kirimPesan(tanya)}
            disabled={loading}
            className="inline-flex bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 text-xs px-4 py-2 rounded-full transition disabled:opacity-50"
          >
            {tanya}
          </button>
        ))}
      </div>

      {/* INPUT AREA */}
      <div className="bg-white p-4 border-t flex gap-2">
        <input
          className="flex-1 border border-slate-300 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
          placeholder="Tanya TunasChat di sini..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={() => kirimPesan(input)}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-6 py-2 rounded-full text-sm font-semibold transition"
        >
          Kirim
        </button>
      </div>
    </main>
  );
}