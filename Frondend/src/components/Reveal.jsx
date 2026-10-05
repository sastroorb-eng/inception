import { useEffect, useRef, useState } from 'react'

/**
 * Reveal berbasis CSS transition, bukan frame loop JS: konten tetap terlihat
 * penuh bila IO/animasi tidak berjalan (aturan "no hidden content if JS fails").
 */
export function useReveal() {
  const ref = useRef(null)
  const [shown, setShown] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return { ref, shown }
}

// Tangga delay 60ms (stagger), murni kelas CSS — tanpa inline style.
const delayClass = (delay) => {
  const step = Math.round(Number(delay) / 0.06)
  return step > 0 ? `reveal-d${Math.min(step, 8)}` : ''
}

export default function Reveal({ children, delay = 0, className = '' }) {
  const { ref, shown } = useReveal()
  return (
    <div
      ref={ref}
      data-reveal={shown ? 'shown' : 'hidden'}
      className={`reveal ${delayClass(delay)} ${className}`.trim()}
    >
      {children}
    </div>
  )
}
