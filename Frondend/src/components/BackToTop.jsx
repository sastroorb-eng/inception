import { useEffect, useState } from 'react'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Kembali ke atas halaman"
      className={`fixed bottom-5 left-5 z-40 grid h-12 w-12 place-items-center rounded-xl bg-brand-950 text-white shadow-[0_12px_22px_-10px_rgba(0,0,0,.45)] transition-[opacity,transform] duration-200 hover:-translate-y-1 active:translate-y-0.5 ${
        visible ? 'opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  )
}
