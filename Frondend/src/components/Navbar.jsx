import { useEffect, useRef, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { school, jurusan } from '../data/content'
import ThemeToggle from './ThemeToggle'

const links = [
  { to: '/', label: 'Beranda' },
  { to: '/profil', label: 'Profil' },
  { to: '/galeri', label: 'Galeri' },
  { to: '/ppdb', label: 'PPDB' },
  { to: '/kontak', label: 'Kontak' },
]

const navClass = ({ isActive }) =>
  `relative border-b-2 px-2 py-2 text-sm font-semibold transition ${
    isActive ? 'border-brand-700 text-brand-900' : 'border-transparent text-slate-600 hover:text-brand-800'
  }`

// Varian menu mobile: tap target minimal 44px (WCAG 2.5.5 / best practice sentuh).
const mobileNavClass = (props) => `flex min-h-11 items-center px-2 ${navClass(props)}`

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const megaRef = useRef(null)
  const { pathname, hash } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setMegaOpen(false)
  }, [pathname, hash])

  useEffect(() => {
    if (!megaOpen) return
    function onKey(e) {
      if (e.key === 'Escape') setMegaOpen(false)
    }
    function onClick(e) {
      if (megaRef.current && !megaRef.current.contains(e.target)) setMegaOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [megaOpen])

  return (
    <header
      className={`sticky top-0 z-40 border-b border-slate-200 bg-paper/95 backdrop-blur transition-shadow ${
        scrolled ? 'shadow-sm' : ''
      }`}
    >
      <nav
        aria-label="Navigasi utama"
        className={`mx-auto flex max-w-6xl items-center justify-between px-4 transition-all ${
          scrolled ? 'py-2' : 'py-3'
        }`}
      >
        <Link to="/" className="flex items-center gap-2 sm:gap-3">
          <img src={school.logo} alt={`Logo ${school.shortName}`} className="h-11 w-11 shrink-0 object-contain" />
          <span className="leading-tight">
            {/* Nama resmi lengkap. Di 1024 px satu barisnya makan tempat sampai
                menu desktop penyok, jadi lebarnya dibatasi 12rem dan text-balance
                memecahnya rata: "SMK Telekomunikasi" / "Tunas Harapan". */}
            <span className="font-display block max-w-[12rem] text-balance text-[13px] font-bold text-brand-950 sm:text-sm xl:text-base">
              {school.name}
            </span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-3 lg:flex xl:gap-5" ref={megaRef}>
          {links.slice(0, 2).map((link) => (
            <NavLink key={link.to} to={link.to} className={navClass} end>
              {link.label}
            </NavLink>
          ))}

          {/* Program Keahlian — disclosure + mega-menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMegaOpen((v) => !v)}
              aria-expanded={megaOpen}
              aria-controls="mega-program"
              className={`flex items-center gap-1 border-b-2 px-2 py-2 text-sm font-semibold transition ${
                pathname.startsWith('/jurusan')
                  ? 'border-brand-700 text-brand-900'
                  : 'border-transparent text-slate-600 hover:text-brand-800'
              }`}
            >
              Program Keahlian
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className={`transition-transform ${megaOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {megaOpen && (
              <div
                id="mega-program"
                className="absolute left-1/2 top-full z-50 mt-3 w-[min(92vw,56rem)] -translate-x-1/2 rounded-xl border border-slate-200 bg-white p-5 shadow-[0_30px_60px_-30px_rgba(16,36,62,.5)]"
              >
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[.18em] text-slate-500">
                  4 Program Keahlian
                </p>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {jurusan.map((j) => (
                    <li key={j.kode}>
                      <Link
                        to={`/jurusan/${j.kode.toLowerCase()}`}
                        className="group flex gap-3 rounded-lg border border-transparent p-3 transition hover:border-line hover:bg-paper-deep"
                      >
                        <span
                          className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-brand-950 text-sm font-bold text-accent-400"
                          aria-hidden="true"
                        >
                          {j.monogram}
                        </span>
                        <span>
                          <span className="block text-sm font-bold text-brand-950">
                            {j.kode} — {j.nama}
                          </span>
                          <span className="mt-0.5 block text-xs leading-5 text-slate-600">{j.desc}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 border-t border-slate-100 pt-3 text-right">
                  <Link to="/jurusan" className="text-sm font-semibold text-brand-700 hover:text-brand-900">
                    Lihat detail program &amp; mitra industri →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {links.slice(2).map((link) => (
            <NavLink key={link.to} to={link.to} className={navClass}>
              {link.label}
            </NavLink>
          ))}

          <Link to="/chat" className="btn btn-primary btn-sm">Layanan Informasi</Link>
          {/* Toggle tema paling kanan, sesudah tombol aksi, supaya tidak terlihat
              seperti salah satu item menu. */}
          <ThemeToggle />
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls="menu-mobile"
          aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
          className="rounded-lg border border-slate-300 bg-white p-2 text-brand-950 lg:hidden"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div id="menu-mobile" className="border-t border-slate-200 bg-paper px-4 py-3 lg:hidden">
          <div className="flex flex-col gap-1">
            <NavLink to="/" className={mobileNavClass} end>
              Beranda
            </NavLink>
            <NavLink to="/profil" className={mobileNavClass}>
              Profil
            </NavLink>
            <p className="mt-2 px-2 text-[11px] font-bold uppercase tracking-[.18em] text-slate-500">
              Program Keahlian
            </p>
            <ul className="pl-2">
              {jurusan.map((j) => (
                <li key={j.kode}>
                  <NavLink to={`/jurusan/${j.kode.toLowerCase()}`} className={mobileNavClass}>
                    {j.kode} — {j.nama}
                  </NavLink>
                </li>
              ))}
            </ul>
            <NavLink to="/galeri" className={mobileNavClass}>
              Galeri
            </NavLink>
            <NavLink to="/ppdb" className={mobileNavClass}>
              PPDB
            </NavLink>
            <NavLink to="/kontak" className={mobileNavClass}>
              Kontak
            </NavLink>
            <NavLink to="/chat" className={mobileNavClass}>
              Layanan Informasi
            </NavLink>
          </div>
        </div>
      )}
    </header>
  )
}
