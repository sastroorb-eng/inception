import React, { useState, useRef, useEffect } from "react";
import { sendMessage } from "../services/chat";
import { school } from "../data/content";

const KUNCI_CHAT = "chat_tunasbot";

const buatId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export default function TunasBot() {
  const [isRecording, setIsRecording] = useState(false);
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [konfirmasiReset, setKonfirmasiReset] = useState(false);
  const [pesanSuara, setPesanSuara] = useState("");

  const [isMounted, setIsMounted] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getWaktuSalam = () => {
    const jam = new Date().getHours();
    if (jam < 11) return "Selamat pagi";
    if (jam < 15) return "Selamat siang";
    if (jam < 18) return "Selamat sore";
    return "Selamat malam";
  };

  const pesanAwal = {
    id: buatId(),
    role: "assistant",
    content: `${getWaktuSalam()} Kak. Aku TunasBot, asisten virtual ${school.name}. Ada yang ingin ditanyakan seputar sekolah, jurusan, atau PPDB?`,
  };

  useEffect(() => {
    setIsMounted(true);
    const simpananChat = localStorage.getItem(KUNCI_CHAT);
    if (simpananChat) {
      // Pesan lama dari versi sebelumnya belum punya id, jadi dilengkapi saat dimuat.
      const dipulihkan = JSON.parse(simpananChat).map((pesan) => ({ ...pesan, id: pesan.id || buatId() }));
      setChat(dipulihkan);
    } else {
      setChat([pesanAwal]);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(KUNCI_CHAT, JSON.stringify(chat));
    }
    scrollToBottom();
  }, [chat, isMounted]);

  useEffect(() => {
    if (!pesanSuara) return;
    const id = setTimeout(() => setPesanSuara(""), 4000);
    return () => clearTimeout(id);
  }, [pesanSuara]);

  const pertanyaanCepat = [
    "Berapa biaya masuk PPDB?",
    "Apa saja jurusan yang ada?",
    "Bagaimana syarat daftarnya?",
    "Dimana alamat sekolahnya?"
  ];

  const bacakanTeks = (teks) => {
    if (!("speechSynthesis" in window)) {
      setPesanSuara("Peramban ini tidak mendukung fitur suara.");
      return;
    }
    window.speechSynthesis.cancel();
    const suara = new SpeechSynthesisUtterance(teks);
    suara.lang = "id-ID";
    suara.rate = 1.0;
    suara.pitch = 1.0;
    window.speechSynthesis.speak(suara);
  };

  const hentikanSuara = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const kirimPesan = async (teksPesan = input) => {
    if (!teksPesan.trim() || loading) return;

    const pesanUser = { id: buatId(), role: "user", content: teksPesan };
    const riwayat = chat;
    setChat((prev) => [...prev, pesanUser]);
    setInput("");
    setLoading(true);

    try {
      const balasan = await sendMessage(pesanUser.content, riwayat);
      setChat((prev) => [...prev, { id: buatId(), role: "assistant", content: balasan }]);

    } catch (err) {
      setChat((prev) => [...prev, {
        id: buatId(),
        role: "assistant",
        content: `Maaf, jawaban belum bisa diambil: ${err.message} Periksa koneksi, lalu coba kirim lagi.`,
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      kirimPesan(input);
    }
  };

  const hapusObrolan = () => {
    setChat([{ ...pesanAwal, id: buatId() }]);
    localStorage.removeItem(KUNCI_CHAT);
    hentikanSuara();
    setKonfirmasiReset(false);
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

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Maaf, browser kamu tidak mendukung fitur rekam suara.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID'; // Bahasa Indonesia
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      // Ganti 'setInput' jika state kolom teksmu bernama lain
      setInput((prev) => prev + (prev ? " " : "") + transcript);
    };

    recognition.onerror = (event) => {
      console.error("Error rekam suara:", event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  return (
    <div className="depth-card mx-auto flex h-[650px] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-line bg-card text-ink">

      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-900/30 bg-brand-950 px-4 py-3 text-white">
        <div>
          <h2 className="font-display text-lg font-bold">TunasBot</h2>
          <p className="text-xs text-brand-100/75">Asisten Virtual {school.name}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={hentikanSuara} className="btn btn-ghost btn-sm" title="Hentikan suara">
            Hentikan Suara
          </button>
          <button onClick={unduhObrolan} className="btn btn-ghost btn-sm" title="Unduh riwayat obrolan">
            Simpan
          </button>
          <button
            onClick={() => setKonfirmasiReset(true)}
            className="btn btn-ghost btn-sm"
            title="Mulai obrolan baru"
          >
            Reset
          </button>
        </div>
      </header>

      {konfirmasiReset && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-accent-300/25 px-4 py-2 text-sm text-ink">
          <p>Reset obrolan dan hapus riwayat tersimpan di peramban ini?</p>
          <div className="flex gap-2">
            <button onClick={hapusObrolan} className="btn btn-primary btn-sm">Ya, reset</button>
            <button onClick={() => setKonfirmasiReset(false)} className="btn btn-ghost btn-sm">Batal</button>
          </div>
        </div>
      )}

      {pesanSuara && (
        <p role="status" className="border-b border-line bg-brand-50 px-4 py-2 text-sm text-brand-800">
          {pesanSuara}
        </p>
      )}

      <div className="flex-1 space-y-4 overflow-y-auto bg-paper p-4" role="log" aria-live="polite" aria-label="Percakapan dengan TunasBot">
        {chat.map((c) => (
          <div key={c.id} className={`flex ${c.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-[14px] leading-relaxed whitespace-pre-wrap ${
              c.role === "user"
                ? "rounded-br-none bg-brand-900 text-white"
                : "rounded-bl-none border border-line bg-card text-ink"
            }`}>
              {c.content}
              {c.role === "assistant" && (
                <div className="mt-2 flex justify-end border-t border-line pt-2">
                  <button
                    onClick={() => bacakanTeks(c.content)}
                    className="text-xs font-semibold text-brand-600 underline-offset-4 hover:underline"
                  >
                    Putar Suara
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <p className="rounded-2xl rounded-bl-none border border-line bg-card px-4 py-2 text-sm text-ink-soft animate-pulse">
              TunasBot sedang menyiapkan jawaban...
            </p>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="flex gap-2 overflow-x-auto whitespace-nowrap border-t border-line bg-card px-4 pt-3 pb-2">
        {pertanyaanCepat.map((tanya) => (
          <button
            key={tanya}
            onClick={() => kirimPesan(tanya)}
            disabled={loading}
            className="shrink-0 rounded-full border border-line bg-paper px-4 py-2 text-xs text-brand-800 transition hover:bg-brand-50 disabled:opacity-50"
          >
            {tanya}
          </button>
        ))}
      </div>

      <div className="flex gap-2 border-t border-line bg-card p-4">
        <input
          ref={inputRef}
          className="flex-1 rounded-full border border-line bg-paper px-4 py-2 text-sm text-ink outline-none placeholder:text-ink-soft focus:border-brand-500"
          placeholder="Tanya TunasBot di sini..."
          aria-label="Tulis pertanyaan untuk TunasBot"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        type="button"
          onClick={startRecording}
          className={`p-2 rounded-full transition-all flex items-center justify-center ${
            isRecording 
              ? "bg-red-500 text-white animate-pulse" 
              : "bg-slate-200 text-slate-600 hover:bg-slate-300"
          }`}
          title="Bicara ke TunasBot"
          
        <button
          onClick={() => kirimPesan(input)}
          disabled={loading || !input.trim()}
          className="btn btn-primary"
        >
          Kirim

          <button
          
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" y1="19" x2="12" y2="22"></line>
          </svg>
        </button>
        </button>
      </div>

    </div>
  );
}
