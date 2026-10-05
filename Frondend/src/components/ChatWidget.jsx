import { useNavigate, useLocation } from 'react-router-dom'

export default function ChatWidget() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  if (pathname === '/chat') return null

  return <button onClick={() => navigate('/chat')} aria-label="Buka layanan informasi" className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-lg bg-brand-950 px-3 py-3 text-white shadow-[0_12px_22px_-10px_rgba(0,0,0,.45)] transition-transform duration-200 hover:-translate-y-1 active:translate-y-0.5"><span className="grid h-8 w-8 place-items-center rounded bg-white font-display text-xs font-bold text-brand-900">TH</span><span className="hidden text-left text-xs font-semibold leading-tight sm:block">Layanan<br />Informasi</span></button>
}
