import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { sendMessage } from '../services/chat'
import { school } from '../data/content'

// Kunci riwayat yang sama dengan halaman /chat: obrolan yang dimulai dari popup
// lanjut saat pengguna membuka halaman penuh, bukan mulai dari nol.
const KUNCI_CHAT = 'chat_tunasbot'

const buatId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

const SAPAAN = {
  role: 'assistant',
  content: `Halo Kak. Aku TunasBot, asisten virtual ${school.name}. Tanya seputar program keahlian, PPDB, fasilitas, atau alamat sekolah.`,
}

function bacaRiwayat() {
  try {
    const simpanan = JSON.parse(localStorage.getItem(KUNCI_CHAT) || 'null')
    if (Array.isArray(simpanan) && simpanan.length) {
      return simpanan.map((pesan) => ({ ...pesan, id: pesan.id || buatId() }))
    }
  } catch {
    /* riwayat tersimpan rusak: popup mulai dengan sapaan baru */
  }
  return null
}

export default function ChatPopup() {
  const [buka, setBuka] = useState(false)
  const [chat, setChat] = useState(() => bacaRiwayat() || [{ ...SAPAAN, id: buatId() }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const akhirRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    try {
      localStorage.setItem(KUNCI_CHAT, JSON.stringify(chat))
    } catch {
      /* mode privat: riwayat cukup tersimpan di memori tab ini */
    }
  }, [chat])

  useEffect(() => {
    if (buka) inputRef.current?.focus()
  }, [buka])

  useEffect(() => {
    akhirRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [buka, chat, loading])

  useEffect(() => {
    if (!buka) return
    const onKey = (e) => {
      if (e.key === 'Escape') setBuka(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [buka])

  const kirim = async (teks) => {
    const isi = String(teks ?? input).trim()
    if (!isi || loading) return
    const riwayat = chat
    setChat((prev) => [...prev, { id: buatId(), role: 'user', content: isi }])
    setInput('')
    setLoading(true)
    try {
      const balasan = await sendMessage(isi, riwayat)
      setChat((prev) => [...prev, { id: buatId(), role: 'assistant', content: balasan }])
    } catch (err) {
      setChat((prev) => [...prev, {
        id: buatId(),
        role: 'assistant',
        content: `Maaf, jawaban belum bisa diambil: ${err.message} Periksa koneksi, lalu coba kirim lagi.`,
      }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  return (
    <>
      {buka && (
        <section
          role="dialog"
          aria-label="Tanya TunasBot"
          className="chat-popup fixed bottom-[5.25rem] right-4 z-50 flex h-[min(62vh,27rem)] w-[min(92vw,21rem)] flex-col overflow-hidden rounded-xl border border-line bg-card sm:right-5"
        >
          <header className="flex items-start justify-between gap-3 border-b border-brand-900/30 bg-brand-950 px-4 py-3 text-white">
            <div className="flex items-start gap-2.5">
              <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-paper">
                <img src={school.logo} alt="" aria-hidden="true" className="h-9 w-9 object-contain" />
              </span>
              <div>
                <h2 className="font-display text-base font-bold leading-tight">TunasBot</h2>
                <p className="mt-0.5 text-[11px] leading-snug text-brand-100/75">Asisten virtual {school.name}</p>
              </div>
            </div>
            <Link
              to="/chat"
              onClick={() => setBuka(false)}
              className="mt-0.5 shrink-0 text-[11px] font-semibold text-brand-100 underline underline-offset-4 transition hover:text-white"
            >
              Layar penuh
            </Link>
          </header>

          <div
            className="flex-1 space-y-2.5 overflow-y-auto bg-paper p-3"
            role="log"
            aria-live="polite"
            aria-label="Percakapan dengan TunasBot"
          >
            {chat.map((c) => (
              <div key={c.id} className={`flex ${c.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <p
                  className={`max-w-[86%] whitespace-pre-wrap rounded-xl px-3 py-2 text-[13px] leading-relaxed ${
                    c.role === 'user'
                      ? 'rounded-br-sm bg-brand-900 text-white'
                      : 'rounded-bl-sm border border-line bg-card text-ink'
                  }`}
                >
                  {c.content}
                </p>
              </div>
            ))}
            {loading && (
              <p className="w-fit rounded-xl rounded-bl-sm border border-line bg-card px-3 py-2 text-[13px] text-ink-soft animate-pulse">
                TunasBot sedang menyiapkan jawaban...
              </p>
            )}
            <div ref={akhirRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              kirim()
            }}
            className="flex items-center gap-2 border-t border-line bg-card p-3"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya TunasBot..."
              aria-label="Tulis pertanyaan untuk TunasBot"
              className="min-w-0 flex-1 rounded-full border border-line bg-paper px-3 py-2 text-sm text-ink outline-none placeholder:text-ink-soft focus:border-brand-500"
            />
            <button type="submit" disabled={loading || !input.trim()} className="btn btn-primary btn-sm shrink-0">
              Kirim
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setBuka((v) => !v)}
        aria-expanded={buka}
        aria-haspopup="dialog"
        aria-label={buka ? 'Tutup Tanya TunasBot' : 'Buka Tanya TunasBot'}
        className="fixed bottom-5 right-4 z-50 flex h-14 items-center gap-2.5 rounded-full bg-brand-950 py-2 pl-2 pr-2 text-white shadow-[0_16px_30px_-14px_rgba(0,0,0,.55)] transition hover:-translate-y-1 active:translate-y-0.5 min-[400px]:pr-4 sm:right-5"
      >
        {buka ? (
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/12">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </span>
        ) : (
          <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-paper">
            <img src={school.logo} alt="" aria-hidden="true" className="h-9 w-9 object-contain" />
          </span>
        )}
        {/* Label cuma pembuka ajakan; di bawah 400 px pilnya menyempit jadi lingkaran
            logo supaya tidak menimpa tautan footer. */}
        <span className="hidden font-display text-[13px] font-bold leading-none tracking-wide min-[400px]:inline">
          {buka ? 'Tutup' : 'Tanya TunasBot'}
        </span>
      </button>
    </>
  )
}
