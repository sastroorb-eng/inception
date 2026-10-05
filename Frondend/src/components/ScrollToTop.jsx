import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Kembali ke posisi atas setiap pindah halaman (deep-link hash ditangani halaman tujuan).
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}
