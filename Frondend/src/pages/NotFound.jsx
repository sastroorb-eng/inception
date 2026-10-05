import { Link } from 'react-router-dom'
import Seo from '../components/Seo'

const destinations = [
  { to: '/', label: 'Beranda' },
  { to: '/jurusan', label: 'Program Keahlian' },
  { to: '/ppdb', label: 'PPDB' },
  { to: '/kontak', label: 'Kontak & FAQ' },
]

export default function NotFound() {
  return (
    <>
      <Seo title="Halaman tidak ditemukan · AskTunas" description="Halaman yang kamu cari tidak tersedia." noindex />
      <section className="band-blue">
        <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
          <p className="font-display text-6xl font-bold text-brand-300">404</p>
          <h1 className="font-display mt-4 text-3xl font-bold text-brand-950">Halaman ini tidak ditemukan</h1>
          <p className="mt-3 leading-7 text-slate-600">
            Tautan yang kamu buka mungkin sudah berpindah. Coba mulai dari salah satu halaman utama berikut.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {destinations.map((item) => (
              <Link key={item.to} to={item.to} className="btn btn-ghost btn-sm min-h-11">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
