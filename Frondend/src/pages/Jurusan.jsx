import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import TiltCard from '../components/TiltCard'
import Seo from '../components/Seo'
import { jurusan } from '../data/content'

export default function Jurusan() {
  return (
    <>
      <Seo
        title="Program Keahlian · AskTunas"
        description="Empat program keahlian SMK Telekomunikasi Tunas Harapan: PPLG, DKV, TKR, dan TJKT — fokus kompetensi, mata pelajaran inti, dan mitra industri."
      />
      <PageHeader
        title="Program Keahlian"
        subtitle="Empat bidang vokasi yang menghubungkan pembelajaran, praktik, dan kebutuhan dunia kerja. Pilih program untuk melihat detail kompetensi, mata pelajaran, dan mitranya."
      />
      <div className="band-gold mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2">
          {jurusan.map((program, index) => (
            <Reveal key={program.id} delay={index * 0.07}>
              <Link
                to={`/jurusan/${program.kode.toLowerCase()}`}
                aria-label={`Lihat detail ${program.nama}`}
                className="group block h-full"
              >
                <TiltCard max={8} className="depth-card h-full rounded-2xl p-7">
                  <div className="tilt-inner flex h-full flex-col">
                    <div className="flex items-start justify-between">
                      <div className="relative h-20 w-20 preserve-3d">
                        <div className="absolute inset-0 rotate-6 rounded-xl bg-brand-200 shadow-[6px_7px_0_#17365d]" />
                        <div className="absolute inset-0 grid place-items-center rounded-xl border border-brand-200 bg-white font-display text-xl font-bold text-brand-900">
                          {program.monogram}
                        </div>
                      </div>
                      <span className="font-display text-5xl font-bold text-slate-200">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <p className="mt-7 text-xs font-bold uppercase tracking-[.2em] text-brand-600">{program.kode}</p>
                    <h2 className="font-display mt-2 text-2xl font-bold text-brand-950">{program.nama}</h2>
                    <p className="mt-3 leading-7 text-slate-600">{program.desc}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {program.fokus.map((item) => (
                        <span key={item} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-800">
                          {item}
                        </span>
                      ))}
                    </div>
                    <p className="mt-auto flex items-center gap-2 pt-6 text-sm font-bold text-brand-700 transition group-hover:gap-3">
                      Lihat detail program
                      <span aria-hidden="true">→</span>
                    </p>
                  </div>
                </TiltCard>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14">
          <div className="rounded-xl border-l-4 border-accent-500 bg-white p-6 shadow-[0_6px_0_#e2e8ef]">
            <h3 className="font-display text-xl font-bold text-brand-950">Tentang data kurikulum &amp; mitra</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Portal ini hanya memuat kolaborasi yang telah dikonfirmasi sekolah — Mikrotik Academy dan Cisco
              Networking Academy pada TJKT, serta Teaching Factory bersama PT Universal Big Data (UBIG) pada PPLG.
              PT CTI tercatat sebagai kunjungan institusi lintas program. Rincian lainnya menyusul setelah
              dikonfirmasi resmi oleh sekolah.{' '}
              <Link to="/profil" className="font-semibold text-brand-700 hover:underline">
                Lihat profil sekolah →
              </Link>
            </p>
          </div>
        </Reveal>
      </div>
    </>
  )
}
