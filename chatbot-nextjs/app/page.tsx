"use client";

import { useState, useRef, useEffect } from "react";

type Pesan = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<Pesan[]>([
    { role: "assistant", content: "Halo! Aku asisten virtual SMK Telekomunikasi Tunas Harapan 😊 Ada yang bisa aku bantu?" }
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const kirimPesan = async () => {
    if (!input.trim() || loading) return;

    const pesanUser: Pesan = { role: "user", content: input };
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
    if (e.key === "Enter" &&!e.shiftKey) {
      e.preventDefault();
      kirimPesan();
    }
  };

  return (
    <main className="flex flex-col h-screen bg-[#f5f7fb] font-sans">
      {/* HEADER */}
      <header className="bg-white shadow-sm p-4 text-center border-b">
        <h1 className="font-bold text-lg text-slate-800">Asisten SMK Telkom Tunas Harapan</h1>
        <p className="text-xs text-slate-500">Powered by Groq - gpt-oss-20b</p>
      </header>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat.map((c, i) => (
          <div key={i} className={`flex ${c.role === "user"? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] px-4 py-2 rounded-2xl text-[14px] leading-relaxed whitespace-pre-wrap
              ${c.role === "user"? "bg-blue-600 text-white rounded-br-none" : "bg-white text-slate-800 shadow-sm rounded-bl-none border"}`}
            >
              {c.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-2 rounded-2xl rounded-bl-none shadow-sm border text-sm text-slate-400">
              Sedang mengetik...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className="bg-white p-4 border-t flex gap-2">
        <input
          className="flex-1 border border-slate-300 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
          placeholder="Tulis pertanyaan tentang sekolah..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={kirimPesan}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-6 py-2 rounded-full text-sm font-semibold transition"
        >
          Kirim
        </button>
      </div>
    </main>
  );
}