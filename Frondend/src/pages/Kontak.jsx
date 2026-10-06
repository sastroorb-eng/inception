import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import Seo from '../components/Seo'
import { school, jurusan, identitas, ppdbResmi } from '../data/content'

const mapsSrc = `https://www.google.com/maps?q=${encodeURIComponent(school.address)}&output=embed`
const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(school.address)}`

// FAQ hanya berisi pertanyaan yang jawabannya tersedia di data resmi portal.
const faq = [
  {
    q: 'Bagaimana cara mendaftar PPDB?',
    a: `Buka menu "PPDB", isi formulir tiga langkah: data siswa, pilihan program keahlian dan unggah berkas persyaratan, lalu konfirmasi. Formulir online bersifat sementara sebagai bukti pendaftaran awal — data lengkap diisi saat pendaftaran langsung di sekolah, dan info waktu tes dikirim lewat WhatsApp. Pendaftaran resmi panitia juga tersedia di ${ppdbResmi.portal}.`,
  },
  {
    q: 'Program keahlian apa saja yang tersedia?',
    a: `Tersedia ${jurusan.length} program keahlian: ${jurusan.map((j) => `${j.nama} (${j.kode})`).join(', ')}.`,
  },
  {
    q: 'Di mana lokasi sekolah?',
    a: `${school.address}. ${school.lokasiCatatan} Tombol "Buka di Google Maps" di halaman ini menampilkan rute lengkap.`,
  },
  {
    q: 'Kenapa sekolah ini kadang disebut SMK Telkom Salatiga?',
    a: `Nama resminya ${school.name}. ${school.lokasiCatatan} Sebutan "Salatiga" muncul karena lokasi sekolah tepat di perbatasan dengan Kota Salatiga.`,
  },
  {
    q: 'Jam layanan tata usaha?',
    a: school.jamLayanan.map((j) => `${j.hari}: ${j.jam}`).join(' · ') + '.',
  },
  {
    q: 'Berapa biaya pendidikan?',
    a: `Informasi biaya terbaru disampaikan langsung oleh bagian administrasi — hubungi ${school.phone} atau email ${school.email} pada jam layanan.`,
  },
  {
    q: 'Bagaimana status akreditasi sekolah?',
    a: `Akreditasi resmi ${identitas.find((i) => i.label === 'Akreditasi')?.value ?? 'belum dipublikasikan'} dengan NPSN ${identitas.find((i) => i.label === 'NPSN')?.value ?? '—'}.`,
  },
]

function FaqItem({ item, index, open, onToggle }) {
  return (
    <div className="depth-card overflow-hidden rounded-xl">
      <button
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`faq-panel-${index}`}
        id={`faq-button-${index}`}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-semibold text-brand-950">{item.q}</span>
        <span
          aria-hidden="true"
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-brand-200 bg-brand-50 text-lg font-bold text-brand-700 transition-transform duration-200 ${open ? 'rotate-45' : ''}`}
        >
          +
        </span>
      </button>
      <div
        id={`faq-panel-${index}`}
        role="region"
        aria-labelledby={`faq-button-${index}`}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? 'grid-rows-[1fr]' : 'hidden'}`}
      >
        <div className="overflow-hidden">
          <p className="border-t border-slate-200 px-5 py-4 text-sm leading-7 text-slate-600">{item.a}</p>
        </div>
      </div>
    </div>
  )
}

export default function Kontak() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <>
      <Seo
        title="Kontak & FAQ · AskTunas"
        description={`Kontak resmi, lokasi, jam layanan tata usaha, dan pertanyaan umum SMK Telekomunikasi Tunas Harapan — ${school.address}.`}
      />
      <PageHeader title="Kontak & FAQ" subtitle="Hubungi sekolah, lihat lokasi di peta, dan cari jawaban pertanyaan umum." />
      <div className="band-blue mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal>
            <div className="depth-card h-full rounded-xl p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Alamat</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{school.address}</p>
              <p className="mt-2 text-xs leading-5 text-slate-500">{school.lokasiCatatan}</p>
              <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="footer-link mt-4 inline-block text-sm font-semibold text-brand-800">
                Buka di Google Maps ↗
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="depth-card h-full rounded-xl p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Telepon / Fax</p>
              <a href={`tel:${school.phone.replace(/[^+\d]/g, '')}`} className="mt-3 block text-lg font-bold text-brand-950">
                {school.phone}
              </a>
              <p className="mt-2 text-xs text-slate-500">Sambungan panitia PPDB & tata usaha.</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="depth-card h-full rounded-xl p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Email</p>
              <a href={`mailto:${school.email}`} className="mt-3 block text-sm font-bold break-all text-brand-950">
                {school.email}
              </a>
              <p className="mt-2 text-xs text-slate-500">Balasan pada hari & jam kerja.</p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="depth-card h-full rounded-xl p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Jam Layanan TU</p>
              <ul className="mt-3 space-y-1.5 text-sm">
                {school.jamLayanan.map((item) => (
                  <li key={item.hari} className="flex justify-between gap-3">
                    <span className="text-slate-500">{item.hari}</span>
                    <span className="font-semibold text-brand-950">{item.jam}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <div className="depth-card mt-5 rounded-xl p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Media Sosial Resmi</p>
            <ul className="mt-3 flex flex-wrap gap-x-8 gap-y-2">
              {school.sosmed.map((s) => (
                <li key={s.label}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="footer-link inline-block text-sm font-semibold text-brand-800">
                    {s.label} · {s.text} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal>
          <div className="depth-card mt-10 overflow-hidden rounded-2xl">
            <iframe
              title={`Peta lokasi ${school.name}`}
              src={mapsSrc}
              className="h-80 w-full border-0 sm:h-96"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </Reveal>

        <div className="mt-16 grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <Reveal>
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-xs font-bold uppercase tracking-[.2em] text-brand-600">Pertanyaan Umum</p>
              <h2 className="font-display mt-2 text-3xl font-bold leading-tight text-brand-950">
                Jawaban cepat, tanpa menebak-nebak
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Daftar ini hanya memuat pertanyaan yang jawabannya tersedia dari data resmi sekolah. Untuk hal lain,
                langsung hubungi tata usaha.
              </p>
            </div>
          </Reveal>
          <div className="space-y-4">
            {faq.map((item, index) => (
              <Reveal key={item.q} delay={index * 0.04}>
                <FaqItem
                  item={item}
                  index={index}
                  open={openIndex === index}
                  onToggle={() => setOpenIndex((current) => (current === index ? -1 : index))}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
