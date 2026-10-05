import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import Seo from '../components/Seo'
import { KurikulumPanel, PartnerPanel } from '../components/ProgramPanels'
import { jurusan } from '../data/content'

export default function JurusanDetail() {
  const { kode } = useParams()
  const program = jurusan.find((j) => j.kode.toLowerCase() === (kode || '').toLowerCase())

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [kode])

  if (!program) return <Navigate to="/jurusan" replace />

  const index = jurusan.indexOf(program)
  const lainnya = jurusan.filter((j) => j.id !== program.id)

  return (
    <>
      <Seo
        title={`${program.nama} (${program.kode}) · Program Keahlian AskTunas`}
        description={`${program.desc} Fokus: ${program.fokus.join(', ')}.`}
      />
      <PageHeader
        title={program.nama}
        subtitle={`Program keahlian ${program.kode} SMK Telekomunikasi Tunas Harapan — ${program.desc}`}
      />
      <div className="band-gold mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/jurusan"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-800 transition hover:border-brand-400 hover:bg-brand-50"
          >
            <span aria-hidden="true">←</span> Semua program
          </Link>
          <nav aria-label="Program lainnya">
            <ul className="flex flex-wrap gap-2">
              {lainnya.map((j) => (
                <li key={j.kode}>
                  <Link
                    to={`/jurusan/${j.kode.toLowerCase()}`}
                    className="inline-block rounded-full border border-slate-300 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 transition hover:border-brand-400 hover:text-brand-800"
                  >
                    {j.kode}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <Reveal className="mt-8">
          <div className="depth-card rounded-2xl p-7 sm:p-9">
            <div className="flex items-start justify-between gap-6">
              <div className="relative h-24 w-24 shrink-0">
                <div className="absolute inset-0 rotate-6 rounded-xl bg-brand-200 shadow-[6px_7px_0_#17365d]" />
                <div className="absolute inset-0 grid place-items-center rounded-xl border border-brand-200 bg-white font-display text-2xl font-bold text-brand-900">
                  {program.monogram}
                </div>
              </div>
              <p className="font-display text-6xl font-bold text-slate-200" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </p>
            </div>
            <p className="mt-8 text-xs font-bold uppercase tracking-[.2em] text-brand-600">
              Program Keahlian {program.kode}
            </p>
            <h2 className="font-display mt-2 text-2xl font-bold text-brand-950">{program.nama}</h2>
            <p className="mt-3 max-w-3xl leading-7 text-slate-600">{program.desc}</p>

            <div className="mt-6 border-t border-slate-200 pt-5">
              <p className="text-xs font-bold uppercase tracking-[.16em] text-slate-500">Fokus kompetensi</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {program.fokus.map((item) => (
                  <span key={item} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-800">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <KurikulumPanel program={program} />
            <PartnerPanel program={program} />
          </div>
        </Reveal>

        <Reveal className="mt-10" delay={0.08}>
          <div className="flex flex-col items-start justify-between gap-5 rounded-2xl bg-brand-950 px-8 py-9 text-white sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-brand-300">Tertarik dengan {program.kode}?</p>
              <h3 className="font-display mt-2 text-2xl font-bold">Isi formulir PPDB dan sebutkan pilihan programmu.</h3>
            </div>
            <Link to="/ppdb" className="btn btn-primary shrink-0">Daftar PPDB</Link>
          </div>
        </Reveal>
      </div>
    </>
  )
}
