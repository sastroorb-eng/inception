import React, { useState, useRef, useEffect } from "react";

export default function TunasBot() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [isMounted, setIsMounted] = useState(false); 
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getWaktuSalam = () => {
    const jam = new Date().getHours();
    if (jam < 11) return "Selamat Pagi 🌞";
    if (jam < 15) return "Selamat Siang ☀️";
    if (jam < 18) return "Selamat Sore 🌇";
    return "Selamat Malam 🌙";
  };

  const pesanAwal = { 
    role: "assistant", 
    content: `${getWaktuSalam()} Kak! 👋 Aku TunasBot, asisten virtual SMK Telekomunikasi Tunas Harapan. Ada yang ingin ditanyakan seputar sekolah, jurusan, atau PPDB?` 
  };

  useEffect(() => {
    setIsMounted(true);
    const simpananChat = localStorage.getItem("chat_tunasbot");
    if (simpananChat) {
      setChat(JSON.parse(simpananChat));
    } else {
      setChat([pesanAwal]);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("chat_tunasbot", JSON.stringify(chat));
    }
    scrollToBottom();
  }, [chat, isMounted]);

  const pertanyaanCepat = [
    "Berapa biaya masuk PPDB?",
    "Apa saja jurusan yang ada?",
    "Bagaimana syarat daftarnya?",
    "Dimana alamat sekolahnya?"
  ];

  const bacakanTeks = (teks) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel(); 
      const suara = new SpeechSynthesisUtterance(teks);
      suara.lang = "id-ID"; 
      suara.rate = 1.0; 
      suara.pitch = 1.0; 
      window.speechSynthesis.speak(suara);
    } else {
      alert("Maaf, browsermu tidak mendukung fitur suara.");
    }
  };

  const hentikanSuara = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const kirimPesan = async (teksPesan = input) => {
    if (!teksPesan.trim() || loading) return;

    const pesanUser = { role: "user", content: teksPesan };
    setChat((prev) => [...prev, pesanUser]);
    setInput(""); 
    setLoading(true);

    try {
      const res = await fetch("https://inception-ebon.vercel.app/api/chat", {
    
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pesan: pesanUser.content }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal terhubung");
      }

      const balasanAi = { role: "assistant", content: data.balasan };
      setChat((prev) => [...prev, balasanAi]);

    } catch (err) {
      setChat((prev) => [...prev, { role: "assistant", content: `Waduh error: ${err.message} 😅 (Periksa koneksi / CORS Vercel)` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      kirimPesan(input);
    }
  };

  const hapusObrolan = () => {
    if(window.confirm("Yakin ingin mereset obrolan dengan TunasBot?")) {
      setChat([pesanAwal]);
      localStorage.removeItem("chat_tunasbot");
      hentikanSuara(); 
    }
  };

  const unduhObrolan = () => {
    const teks = chat.map(c => `${c.role === "user" ? "Kamu" : "TunasBot"}:\n${c.content}\n`).join("\n- - - - - - - - - - - - - - - -\n\n");
    const blob = new Blob([teks], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Riwayat_Chat_TunasBot.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isMounted) return null;

  return (
    // Menggunakan tema warna gelap yang selaras dengan background web (Navy/Dark slate dengan aksen emas)
    <div className="flex flex-col h-[650px] w-full max-w-3xl mx-auto bg-[#0f172a] font-sans border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
      
      {/* Header */}
      <header className="bg-[#1e293b] shadow-md p-4 flex justify-between items-center border-b border-slate-700">
        <div>
          <h1 className="font-bold text-lg text-white flex items-center gap-2">TunasBot 🤖</h1>
          <p className="text-xs text-slate-400">Asisten Virtual SMK Telkom Salatiga</p>
        </div>
        
        <div className="flex gap-2">
          <button onClick={hentikanSuara} className="text-xs bg-slate-800 hover:bg-slate-700 text-yellow-400 border border-slate-600 px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1" title="Hentikan Suara">
            🔇 Stop
          </button>
          <button onClick={unduhObrolan} className="text-xs bg-slate-800 hover:bg-slate-700 text-green-400 border border-slate-600 px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1" title="Download Riwayat">
            📥 Simpan
          </button>
          <button onClick={hapusObrolan} className="text-xs bg-slate-800 hover:bg-slate-700 text-red-400 border border-slate-600 px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1" title="Mulai Ulang">
            🗑️ Reset
          </button>
        </div>
      </header>

      {/* Ruang Chat */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0b1329]">
        {chat.map((c, i) => (
          <div key={i} className={`flex ${c.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[14px] leading-relaxed whitespace-pre-wrap ${
              c.role === "user" 
                ? "bg-blue-600 text-white rounded-br-none shadow-md" 
                : "bg-[#1e293b] text-slate-200 shadow-md rounded-bl-none border border-slate-700"
            }`}>
              {c.content}
              {c.role === "assistant" && (
                <div className="mt-2 pt-2 border-t border-slate-700/60 flex justify-end">
                  <button onClick={() => bacakanTeks(c.content)} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium transition">
                    🔊 Putar Suara
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#1e293b] text-slate-400 border border-slate-700 px-4 py-2 rounded-2xl rounded-bl-none shadow-sm text-sm animate-pulse">
              TunasBot sedang mengetik...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Pertanyaan Cepat */}
      <div className="bg-[#1e293b] px-4 pt-3 pb-2 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide border-t border-slate-700">
        {pertanyaanCepat.map((tanya, index) => (
          <button key={index} onClick={() => kirimPesan(tanya)} disabled={loading} className="inline-flex bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-600 text-xs px-4 py-2 rounded-full transition disabled:opacity-50">
            {tanya}
          </button>
        ))}
      </div>

      {/* Input Pesan */}
      <div className="bg-[#1e293b] p-4 border-t border-slate-700 flex gap-2">
        <input 
          className="flex-1 bg-[#0f172a] border border-slate-600 rounded-full px-4 py-2 text-sm text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500" 
          placeholder="Tanya TunasBot di sini..." 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyDown={handleKeyDown} 
        />
        <button onClick={() => kirimPesan(input)} disabled={loading} className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white px-6 py-2 rounded-full text-sm font-semibold transition shadow-md">
          Kirim
        </button>
      </div>

    </div>
  );
}