import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import { school, jurusan } from '../data/content'

const direktori = [
  { to: '/profil', label: 'Profil & Struktur Organisasi' },
  { to: '/jurusan', label: 'Program Keahlian' },
  { to: '/galeri', label: 'Galeri' },
  { to: '/ppdb', label: 'Pendaftaran PPDB' },
  { to: '/kontak', label: 'Kontak & FAQ' },
  { to: '/chat', label: 'Layanan Informasi' },
]

const headingClass = 'mb-4 text-xs font-bold uppercase tracking-[.18em] text-accent-400'

export default function Footer() {
  return (
    <footer className="relative border-t-8 border-accent-400 bg-brand-950 text-brand-100/85">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Identitas */}
        <Reveal>
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-white p-2 shadow-[4px_4px_0_var(--color-accent-400)]">
                <img src={school.logo} alt={`Logo ${school.shortName}`} className="h-12 w-12 object-contain" />
              </div>
              <div>
                <p className="font-display text-xl font-bold text-white">Tunas Harapan</p>
                <p className="text-xs uppercase tracking-wider text-brand-100/60">Sekolah Menengah Kejuruan</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-6">
              Pendidikan vokasi yang menyiapkan keterampilan, karakter, dan kesiapan kerja.
            </p>
            <address className="mt-4 text-sm not-italic leading-6 text-brand-100/75">{school.address}</address>
          </div>
        </Reveal>

        {/* Direktori */}
        <Reveal delay={0.05}>
          <nav aria-label="Direktori layanan">
            <h3 className={headingClass}>Direktori</h3>
            <ul className="space-y-2.5 text-sm">
              {direktori.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="footer-link">{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </Reveal>

        {/* Program Keahlian */}
        <Reveal delay={0.1}>
          <nav aria-label="Program keahlian">
            <h3 className={headingClass}>Program</h3>
            <ul className="space-y-2.5 text-sm">
              {jurusan.map((j) => (
                <li key={j.kode}>
                  <Link to={`/jurusan/${j.kode.toLowerCase()}`} className="footer-link">
                    {j.kode} — {j.nama}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="https://www.tunasharapan.info/official/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  Situs resmi sekolah ↗
                </a>
              </li>
            </ul>
          </nav>
        </Reveal>

        {/* Kontak & jam layanan */}
        <Reveal delay={0.15}>
          <div>
            <h3 className={headingClass}>Hubungi Kami</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href={`tel:${school.phone.replace(/[^+\d]/g, '')}`} className="footer-link">{school.phone}</a>
              </li>
              <li>
                <a href={`mailto:${school.email}`} className="footer-link">{school.email}</a>
              </li>
            </ul>
            <div className="mt-6 border-t border-white/10 pt-4 text-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-100/55">Jam layanan tata usaha</p>
              <ul className="mt-2 space-y-1 text-brand-100/75">
                {school.jamLayanan.map((item) => (
                  <li key={item.hari} className="flex justify-between gap-4">
                    <span>{item.hari}</span>
                    <span className="font-semibold text-white">{item.jam}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Tautan media sosial resmi sekolah, sumber: tim (2026-10-05) */}
            <div className="mt-4 text-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-100/55">Media sosial</p>
              <ul className="mt-2 space-y-1">
                {school.sosmed.map((s) => (
                  <li key={s.label}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="footer-link">
                      {s.label} · {s.text} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
       {/* Tautan Login Admin ditambahkan di sini */}
        {/* Tautan Login Admin */}
        {/* Tautan Login Admin */}
            <li>
              <a 
                href="https://inception-j5z4.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-slate-100 transition-colors flex items-center mt-2"
              >
                Login Admin
              </a>
            </li>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-brand-100/55 sm:flex-row">
          <p>© {new Date().getFullYear()} {school.name}</p>
          <p>Dibuat oleh Team Fiveslebew · INCEPTION 2026</p>
        </div>
      </div>
    </footer>
  )
}
