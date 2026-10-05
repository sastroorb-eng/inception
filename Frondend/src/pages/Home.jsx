import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import TiltCard from '../components/TiltCard'
import Reveal from '../components/Reveal'
import CountUp from '../components/CountUp'
import Seo from '../components/Seo'
import { school, jurusan, stats, berita, visiMisi, industryNetwork } from '../data/content'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}

const formatTanggal = (iso) =>
  new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso))

// Marquee mitra: diambil dari daftar mitra per program (jurusan[].partners) — tidak ada data baru.
const mitraMarquee = jurusan.flatMap((j) => j.partners)

function MitraPlate({ mitra, salinan = false }) {
  return (
    <div className="marquee-item" aria-hidden={salinan ? 'true' : undefined}>
      {mitra.logo
        ? <img src={mitra.logo} alt={`Logo ${mitra.name}`} loading="lazy" />
        : <span>{mitra.name}</span>}
    </div>
  )
}

export default function Home() {
  return (
    <>
      <Seo
        title="AskTunas · SMK Telekomunikasi Tunas Harapan"
        description="Portal resmi SMK Telekomunikasi Tunas Harapan, Tengaran, Kabupaten Semarang: 4 program keahlian, PPDB, galeri, dan layanan informasi sekolah."
      />
      <section className="aurora relative text-slate-900">
        <div className="grid-overlay absolute inset-0" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 pb-20 pt-16 md:grid-cols-[1.05fr_.95fr] md:items-center md:pb-24 md:pt-24">
          <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
            <motion.div variants={fadeUp} className="flex items-center gap-3 text-xs font-bold uppercase tracking-[.2em] text-brand-700">
              <span className="h-px w-10 bg-brand-600" /> Sekolah Menengah Kejuruan
            </motion.div>
            <motion.h1 variants={fadeUp} className="font-display mt-5 text-5xl font-bold leading-[1.04] text-brand-950 sm:text-6xl lg:text-7xl">
              Tumbuh terampil,
              <span className="block text-brand-600">siap berkarya.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              {school.name} menyiapkan generasi terampil melalui pendidikan vokasi, praktik industri, dan pembentukan karakter.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
              <Link to="/profil" className="btn btn-primary">Kenali Sekolah</Link>
              <Link to="/ppdb" className="btn btn-ghost">Informasi PPDB</Link>
            </motion.div>
            <motion.p variants={fadeUp} className="mt-6 text-sm text-slate-500">
              Tengaran, Kabupaten Semarang · Berdiri untuk pendidikan vokasi yang relevan
            </motion.p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="solar-scene">
            <div className="solar-scene__stage">
              <div className="solar-orbit solar-orbit--outer">
                <span className="solar-planet solar-planet--start">PPLG</span>
                <span className="solar-planet solar-planet--end">TJKT</span>
              </div>
              <div className="solar-orbit solar-orbit--inner">
                <span className="solar-planet solar-planet--start">DKV</span>
                <span className="solar-planet solar-planet--end">TKR</span>
              </div>
              <div className="solar-sun">
                <img src={school.logo} alt={`Lambang ${school.name}`} />
                <span className="solar-ring-dot" aria-hidden="true" />
              </div>
            </div>
            <p className="font-display mt-14 text-center text-xl font-bold text-brand-950">Tunas Harapan</p>
            <p className="mt-1 text-center text-[10px] font-bold uppercase tracking-[.24em] text-slate-500">Kabupaten Semarang</p>
          </motion.div>
        </div>

        <div className="relative border-y border-brand-900/10 bg-white/70">
          <div className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4">
            {stats.map((s, index) => (
              <div key={s.label} className={`px-5 py-7 text-center ${index % 2 ? 'border-l border-brand-900/10' : ''} md:border-l md:first:border-l-0`}>
                <p className="font-display text-3xl font-bold text-brand-900">
                  {s.verified ? <CountUp value={s.value} suffix={s.suffix} /> : <span aria-hidden="true">—</span>}
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">{s.label}</p>
                {!s.verified && (
                  <p className="mt-1 text-[10px] italic text-slate-400">menunggu data resmi sekolah</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band-blue py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal className="grid gap-5 md:grid-cols-[.7fr_1.3fr] md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-brand-600">Program Keahlian</p>
              <h2 className="font-display mt-3 text-4xl font-bold leading-tight text-brand-950">Belajar melalui praktik nyata.</h2>
            </div>
            <p className="max-w-2xl text-slate-600">Empat bidang keahlian dirancang untuk mempertemukan kemampuan teknis, kreativitas, dan kebutuhan dunia kerja.</p>
          </Reveal>

          <div className="mt-12 grid gap-7 md:grid-cols-2">
            {jurusan.map((program, index) => (
              <Reveal key={program.id} delay={index * 0.06}>
                <TiltCard max={7} className="depth-card group h-full min-h-72 overflow-hidden rounded-2xl p-7">
                  <div className="tilt-inner flex h-full flex-col">
                    <div className="flex items-start justify-between">
                      <div className="program-logo">
                        <img src={program.logo} alt={`Lambang ${program.nama}`} width="72" height="72" loading="lazy" />
                      </div>
                      <span className="font-display text-4xl font-bold text-brand-200">0{index + 1}</span>
                    </div>
                    <p className="mt-6 text-xs font-bold uppercase tracking-[.2em] text-brand-600">{program.kode}</p>
                    <h3 className="font-display mt-2 text-2xl font-bold text-brand-950">{program.nama}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{program.desc}</p>
                    <div className="mt-auto flex flex-wrap gap-2 pt-5">
                      {program.fokus.map((item) => <span key={item} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-800">{item}</span>)}
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-950 py-20 text-white md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal className="grid gap-6 md:grid-cols-2 md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-brand-300">Jejaring Industri</p>
              <h2 className="font-display mt-3 text-4xl font-bold">Belajar dekat dengan dunia kerja.</h2>
            </div>
            <p className="text-brand-100/75">Daftar berikut hanya memuat institusi yang dapat diverifikasi dari publikasi resmi sekolah.</p>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {industryNetwork.map((partner, index) => (
              <Reveal key={partner.name} delay={index * 0.08}>
                <div className="relative rounded-xl border border-white/15 bg-white/[.06] p-6 shadow-[0_8px_0_rgba(255,255,255,.08)] transition hover:-translate-y-1 hover:shadow-[0_12px_0_rgba(255,255,255,.1)]">
                  <div className="flex items-center gap-5">
                    {partner.logo ? (
                      <img
                        src={partner.logo}
                        alt={`Logo ${partner.name}`}
                        width="64"
                        height="64"
                        loading="lazy"
                        className="h-16 w-auto max-w-[200px] shrink-0 rounded-lg bg-white object-contain p-2 shadow-[5px_5px_0_var(--color-brand-400)]"
                      />
                    ) : (
                      <div className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-white font-display text-lg font-bold text-brand-900 shadow-[5px_5px_0_var(--color-brand-400)]">{partner.initials}</div>
                    )}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-brand-300">{partner.program}</p>
                      <h3 className="mt-1 text-xl font-bold">{partner.name}</h3>
                      <p className="mt-1 text-sm text-brand-100/70">{partner.type}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-xs text-brand-200/60">Sebagian mitra bekerja sama pada program tertentu — rincian per program ada di halaman Program Keahlian.</p>
        </div>
      </section>

      <section className="band-gold py-20 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-[.8fr_1.2fr]">
          <Reveal>
            <div className="sticky top-28">
              <p className="text-xs font-bold uppercase tracking-[.2em] text-brand-600">Arah Pendidikan</p>
              <h2 className="font-display mt-3 text-4xl font-bold text-brand-950">Sekolah yang bergerak bersama zaman.</h2>
            </div>
          </Reveal>
          <div className="space-y-6">
            <Reveal><div className="depth-card rounded-2xl p-8"><p className="text-xs font-bold uppercase tracking-wider text-brand-600">Visi</p><p className="font-display mt-3 text-2xl leading-relaxed text-brand-950">{visiMisi.visi}</p></div></Reveal>
            <Reveal delay={0.08}><div className="depth-card rounded-2xl p-8"><p className="text-xs font-bold uppercase tracking-wider text-brand-600">Misi</p><ol className="mt-4 space-y-4">{visiMisi.misi.map((item, i) => <li key={item} className="flex gap-4 text-slate-600"><span className="font-display text-xl font-bold text-brand-600">{String(i + 1).padStart(2, '0')}</span><span>{item}</span></li>)}</ol></div></Reveal>
          </div>
        </div>
      </section>

      <section className="band-cream py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal className="flex items-end justify-between gap-4">
            <div><p className="text-xs font-bold uppercase tracking-[.2em] text-brand-600">Kabar Sekolah</p><h2 className="font-display mt-2 text-4xl font-bold text-brand-950">Berita terbaru</h2></div>
            <Link to="/profil" className="text-sm font-semibold text-brand-700 hover:underline">Lihat informasi sekolah</Link>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {berita.length === 0
              ? [1, 2, 3].map((n) => (
                  <Reveal key={n} delay={(n - 1) * 0.06}>
                    {/* [ISI DATA ASLI] slot berita — isi array `berita` di src/data/content.js */}
                    <div className="grid min-h-48 place-content-center rounded-lg border-2 border-dashed border-slate-300 bg-[#faf9f5] p-6 text-center">
                      <p className="text-sm font-bold uppercase tracking-wider text-slate-400">Slot berita {n} dari 3</p>
                      <p className="mt-2 text-xs leading-5 text-slate-400">
                        Judul, tanggal, dan ringkasan kabar resmi sekolah akan ditampilkan di sini.
                      </p>
                    </div>
                  </Reveal>
                ))
              : berita.map((item, index) => (
                  <Reveal key={item.id} delay={index * 0.06}>
                    <article className="rounded-xl border-t-4 border-brand-700 bg-card p-6 shadow-[0_10px_22px_-16px_rgba(30,41,59,.35)]">
                      <time dateTime={item.tanggal} className="text-xs font-semibold text-slate-500">{formatTanggal(item.tanggal)}</time>
                      <h3 className="font-display mt-3 text-xl font-bold text-brand-950">{item.judul}</h3>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{item.ringkas}</p>
                    </article>
                  </Reveal>
                ))}
          </div>
        </div>
      </section>

      <section className="band-blue py-20 md:py-24">
        <Reveal className="mx-auto max-w-6xl px-4">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-brand-600">Jaringan Kerja Sama</p>
          <h2 className="font-display mt-2 text-3xl font-bold text-brand-950">
            Mitra yang bekerja sama dengan program keahlian.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="marquee-mask mt-10">
            <div className="marquee-track">
              {mitraMarquee.map((m) => <MitraPlate key={`depan-${m.name}`} mitra={m} />)}
              {mitraMarquee.map((m) => <MitraPlate key={`ulang-${m.name}`} mitra={m} salinan />)}
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}
