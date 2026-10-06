import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

// Foto asli sekolah di balik banner judul, dipetakan dari rute supaya semua halaman
// yang sudah memakai PageHeader ikut berubah tanpa perlu prop baru. /admin dan 404
// sengaja tidak dapat foto: bukan halaman publik.
const headerPhoto = [
  ['/profil', 'profil'],
  ['/jurusan', 'jurusan'],
  ['/galeri', 'galeri'],
  ['/ppdb', 'ppdb'],
  ['/kontak', 'kontak'],
  ['/chat', 'chat'],
]

export default function PageHeader({ title, subtitle }) {
  const [shown, setShown] = useState(false)
  const { pathname } = useLocation()
  const photo = headerPhoto.find(([prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`))?.[1]
  useEffect(() => {
    const id = setTimeout(() => setShown(true), 40)
    return () => clearTimeout(id)
  }, [])

  return (
    <header className={`page-header${photo ? ` page-header--foto page-header--${photo}` : ''}`}>
      <div className="page-header__grid" aria-hidden="true" />
      <div className="page-header__object" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div data-reveal={shown ? 'shown' : 'hidden'} className="reveal max-w-3xl">
          <span className="flex items-center gap-3 text-xs font-bold uppercase tracking-[.22em] text-accent-400">
            <span className="h-px w-10 bg-accent-400" />
            Tunas Harapan
          </span>
          <h1 className="font-display mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {subtitle && <p className="mt-4 max-w-2xl leading-7 text-brand-100/85">{subtitle}</p>}
        </div>
      </div>
      <div className="page-header__rule" aria-hidden="true" />
    </header>
  )
}
