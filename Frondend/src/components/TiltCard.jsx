import { useRef } from 'react'

export default function TiltCard({ children, className = '', max = 10 }) {
  const ref = useRef(null)

  function onMove(event) {
    const element = ref.current
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const rect = element.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    const rotateY = (x - 0.5) * max
    const rotateX = (0.5 - y) * max

    element.style.transform = `translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    element.style.setProperty('--glare-x', `${x * 100}%`)
    element.style.setProperty('--glare-y', `${y * 100}%`)
    element.style.setProperty('--glare-opacity', '1')
  }

  function onLeave() {
    const element = ref.current
    if (!element) return
    element.style.transform = ''
    element.style.setProperty('--glare-opacity', '0')
  }

  return (
    <div className="perspective-1000 h-full">
      <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={`tilt-card ${className}`}>
        {children}
      </div>
    </div>
  )
}
