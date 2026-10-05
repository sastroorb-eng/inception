import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sendMessage } from '../services/chat'

const suggestions = ['Program keahlian apa saja?', 'Bagaimana cara daftar PPDB?', 'Fasilitas apa yang tersedia?']

export default function ChatBox() {
  const [messages, setMessages] = useState([{ role: 'bot', text: 'Selamat datang di layanan informasi Tunas Harapan. Silakan tanyakan informasi seputar sekolah.' }])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, typing])

  async function send(text) {
    const message = (text ?? input).trim()
    if (!message || typing) return
    setInput('')
    setMessages((current) => [...current, { role: 'user', text: message }])
    setTyping(true)
    try {
      const { reply, sources } = await sendMessage(message, messages)
      setMessages((current) => [...current, { role: 'bot', text: reply, sources }])
    } catch {
      setMessages((current) => [...current, { role: 'bot', text: 'Layanan sedang mengalami kendala. Silakan coba kembali.' }])
    } finally { setTyping(false) }
  }

  return (
    <div className="depth-card flex h-[70vh] flex-col overflow-hidden rounded-2xl bg-white">
      <div className="flex items-center gap-3 border-b border-brand-800 bg-brand-950 px-5 py-4 text-white">
        <div className="grid h-11 w-11 place-items-center rounded-lg bg-white font-display font-bold text-brand-900 shadow-[4px_4px_0_var(--color-brand-400)]">TH</div>
        <div><p className="font-semibold">Layanan Informasi Sekolah</p><p className="text-xs text-brand-200">Informasi bersumber dari data sekolah</p></div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto bg-[#f2f4f5] p-4">
        <AnimatePresence initial={false}>{messages.map((message, index) => <motion.div key={index} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[82%] rounded-xl px-4 py-3 text-sm leading-6 ${message.role === 'user' ? 'rounded-br-sm bg-brand-900 text-white' : 'rounded-bl-sm border border-slate-200 bg-white text-slate-700 shadow-sm'}`}><p className="whitespace-pre-line">{message.text}</p>{message.sources && <p className="mt-2 border-t border-slate-200 pt-1 text-[10px] font-bold uppercase tracking-wider text-brand-600">Sumber: {message.sources.join(', ')}</p>}</div></motion.div>)}</AnimatePresence>
        {typing && <div className="flex justify-start"><div className="flex gap-1 rounded-xl rounded-bl-sm border border-slate-200 bg-white px-4 py-3">{[0, 1, 2].map((item) => <motion.span key={item} className="h-2 w-2 rounded-full bg-brand-500" animate={{ opacity: [.3, 1, .3], y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: .9, delay: item * .15 }} />)}</div></div>}
        <div ref={bottomRef} />
      </div>

      {messages.length <= 1 && <div className="flex flex-wrap gap-2 border-t border-slate-200 bg-white px-4 py-3">{suggestions.map((item) => <button key={item} onClick={() => send(item)} className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-800 hover:bg-brand-100">{item}</button>)}</div>}
      <form onSubmit={(event) => { event.preventDefault(); send() }} className="flex items-center gap-2 border-t border-slate-200 bg-white p-3"><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Tulis pertanyaan..." className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100" /><button type="submit" disabled={typing || !input.trim()} className="grid h-11 w-11 place-items-center rounded-lg bg-brand-900 text-white shadow-[0_4px_0_#0b223d] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_0_#0b223d] active:translate-y-[3px] active:shadow-[0_1px_0_#0b223d] disabled:opacity-50" aria-label="Kirim"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg></button></form>
    </div>
  )
}
