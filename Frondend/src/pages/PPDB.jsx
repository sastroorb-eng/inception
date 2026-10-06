import { useEffect, useRef, useState } from 'react'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import Seo from '../components/Seo'
import { school, jurusan, ppdbResmi } from '../data/content'

const initialForm = {
  nama: '',
  tanggalLahir: '',
  asalSekolah: '',
  nisn: '',
  telepon: '',
  email: '',
  jurusan: '',
  pesan: '',
  persetujuan: false,
}

const langkah = ['Data Siswa', 'Program & Berkas', 'Konfirmasi']

const berkasWajib = [
  { key: 'rapor', label: 'Foto kopi rapor semester terakhir' },
  { key: 'ijazah', label: 'Ijazah / SKL' },
  { key: 'akta', label: 'Akta kelahiran' },
]

const MAKS_MB = 2
const DRAFT_KEY = 'ppdb-draft'
const today = new Date().toISOString().slice(0, 10)

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100'
const labelClass = 'mb-1.5 block text-sm font-semibold text-brand-950'

const formatTanggal = (iso) =>
  new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso))

const waNumber = school.phone.replace(/[^0-9]/g, '').replace(/^0/, '62')
const telpHref = `tel:${school.phone.replace(/[^+\d]/g, '')}`

function fileError(file) {
  const okExt = /\.(jpe?g|png|pdf)$/i.test(file.name)
  const okType = ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)
  if (!okExt && !okType) return 'Format harus JPG, PNG, atau PDF.'
  if (file.size > MAKS_MB * 1024 * 1024) return `Ukuran maksimal ${MAKS_MB} MB.`
  return ''
}

function validateDataSiswa(form) {
  const next = {}
  if (!form.nama.trim()) next.nama = 'Nama wajib diisi.'
  if (!form.tanggalLahir) next.tanggalLahir = 'Tanggal lahir wajib diisi.'
  else {
    const d = new Date(form.tanggalLahir)
    if (Number.isNaN(d.getTime())) next.tanggalLahir = 'Tanggal lahir tidak valid.'
    else if (d > new Date()) next.tanggalLahir = 'Tanggal lahir tidak boleh di masa depan.'
    else if (d < new Date('1990-01-01')) next.tanggalLahir = 'Tanggal lahir tidak masuk akal untuk calon siswa SMP/MTs.'
  }
  if (!form.asalSekolah.trim()) next.asalSekolah = 'Asal sekolah wajib diisi.'
  if (form.nisn && !/^[0-9]{10}$/.test(form.nisn)) next.nisn = 'NISN harus 10 digit angka.'
  if (!/^(?:08|628|\+628)[0-9]{7,11}$/.test(form.telepon.replace(/[\s-]/g, ''))) {
    next.telepon = 'Format nomor WhatsApp Indonesia tidak valid (contoh: 081234567890).'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) next.email = 'Email tidak valid.'
  return next
}

export default function PPDB() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(() => {
    try {
      const draft = localStorage.getItem(DRAFT_KEY)
      return draft ? { ...initialForm, ...JSON.parse(draft) } : initialForm
    } catch {
      return initialForm
    }
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [berkas, setBerkas] = useState({ rapor: null, ijazah: null, akta: null })
  const fieldRefs = useRef({})
  const errorSummaryRef = useRef(null)

  // Draf hanya teks isian; berkas tidak pernah disimpan di peramban.
  // Selain 'idle' (panel siap kirim) draf jangan ditulis ulang — kalau tidak,
  // penghapusan di handleSubmit langsung tertimpa efek ini.
  useEffect(() => {
    if (status !== 'idle') return
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form))
    } catch {
      /* mode privat: draf tidak tersimpan */
    }
  }, [form, status])

  function update(event) {
    const { name, value, type, checked } = event.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    setErrors((prev) => {
      if (!prev[name]) return prev
      const next = { ...prev }
      delete next[name]
      return next
    })
  }

  function pickBerkas(key, event) {
    const file = event.target.files?.[0]
    if (!file) return
    const message = fileError(file)
    if (message) {
      setErrors((prev) => ({ ...prev, [`berkas-${key}`]: message }))
      event.target.value = ''
      return
    }
    setBerkas((prev) => ({ ...prev, [key]: { nama: file.name, ukuran: file.size } }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[`berkas-${key}`]
      return next
    })
  }

  function hapusBerkas(key) {
    setBerkas((prev) => ({ ...prev, [key]: null }))
  }

  function validateStep(index) {
    if (index === 0) return validateDataSiswa(form)
    if (index === 1) {
      const next = {}
      if (!form.jurusan) next.jurusan = 'Pilih salah satu program.'
      berkasWajib.forEach(({ key, label }) => {
        if (!berkas[key]) next[`berkas-${key}`] = `${label} belum diunggah.`
      })
      return next
    }
    if (index === 2 && !form.persetujuan) {
      return { persetujuan: 'Centang persetujuan untuk mengirim pendaftaran.' }
    }
    return {}
  }

  function fokusError(next) {
    const firstKey = Object.keys(next)[0]
    if (!firstKey) return
    const target = fieldRefs.current[firstKey]
    if (target && target.isConnected) {
      requestAnimationFrame(() => target.focus())
      return
    }
    // Berkas yang belum dipilih tidak punya input di DOM; umumkan lewat ringkasan error.
    errorSummaryRef.current?.focus()
  }

  function goNext() {
    const next = validateStep(step)
    setErrors(next)
    if (Object.keys(next).length === 0) setStep((s) => Math.min(s + 1, langkah.length - 1))
    else fokusError(next)
  }

  function goBack() {
    setErrors({})
    setStep((s) => Math.max(s - 1, 0))
  }

  function goTo(index) {
    if (index < step) {
      setErrors({})
      setStep(index)
    }
  }

  const ringkasanBaris = () => [
    `Nama: ${form.nama}`,
    `Tanggal lahir: ${form.tanggalLahir ? formatTanggal(form.tanggalLahir) : '-'}`,
    `Asal sekolah: ${form.asalSekolah}`,
    `NISN: ${form.nisn || '-'}`,
    `WhatsApp: ${form.telepon}`,
    `Email: ${form.email}`,
    `Program pilihan: ${form.jurusan}`,
    `Berkas: ${berkasWajib.map(({ key }) => `${key} (${berkas[key]?.nama || '-'})`).join(', ')}`,
    `Pesan: ${form.pesan || '-'}`,
  ].join('\n')

  async function handleSubmit(event) {
    event.preventDefault()
    const next = validateStep(2)
    setErrors(next)
    if (Object.keys(next).length) {
      fokusError(next)
      return
    }
    // Belum ada backend panitia — jangan klaim terkirim. Data disiapkan untuk jalur nyata.
    setStatus('ready')
    try {
      localStorage.removeItem(DRAFT_KEY)
    } catch {
      /* abaikan */
    }
  }

  function kirimWhatsApp() {
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(`Pendaftaran PPDB 2026/2027\n\n${ringkasanBaris()}`)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  function kirimEmail() {
    const subject = encodeURIComponent('Pendaftaran PPDB 2026/2027')
    const body = encodeURIComponent(
      `Yang terhormat Panitia PPDB,\n\nberikut data pendaftaran:\n\n${ringkasanBaris()}\n\nHormat saya,\n${form.nama}`
    )
    window.location.href = `mailto:${school.email}?subject=${subject}&body=${body}`
  }

  function resetAll() {
    setForm(initialForm)
    setErrors({})
    setBerkas({ rapor: null, ijazah: null, akta: null })
    setStep(0)
    setStatus('idle')
    try {
      localStorage.removeItem(DRAFT_KEY)
    } catch {
      /* abaikan */
    }
  }

  const error = (name) =>
    errors[name] && (
      <p id={`error-${name}`} role="alert" className="mt-1 text-xs font-semibold text-red-600">
        {errors[name]}
      </p>
    )

  const registerField = (name) => (el) => {
    fieldRefs.current[name] = el
  }

  if (status === 'ready') {
    return (
      <>
        <Seo
          title="Pendaftaran PPDB · AskTunas"
          description="Formulir pendaftaran PPDB 2026/2027 SMK Telekomunikasi Tunas Harapan dalam tiga langkah: data siswa, pilihan program, konfirmasi."
        />
        <PageHeader title="Pendaftaran PPDB" subtitle="Tahun ajaran 2026/2027" />
        <div className="band-blue">
          <div className="mx-auto max-w-xl px-4 py-24 text-center">
            <Reveal>
              <div className="depth-card rounded-2xl p-10 text-left">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-50 text-2xl text-brand-800">
                  ✉
                </div>
                <h2 className="font-display mt-5 text-center text-3xl font-bold text-brand-950">
                  Formulir siap dikirim
                </h2>
                <p className="mt-3 text-center leading-6 text-slate-600">
                  Portal ini belum terhubung ke sistem panitia, jadi data <strong>belum terkirim</strong> ke sekolah.
                  Gunakan salah satu jalur resmi berikut — isianmu sudah diformat otomatis dan tidak ada berkas yang ikut
                  terkirim lewat tautan ini.
                </p>
                <div className="mt-7 flex flex-col gap-3">
                  <button type="button" onClick={kirimWhatsApp} className="btn btn-primary w-full">
                    Kirim via WhatsApp panitia
                  </button>
                  <button type="button" onClick={kirimEmail} className="btn btn-ghost w-full">
                    Kirim via email ke {school.email}
                  </button>
                  <a
                    href={ppdbResmi.portal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost w-full text-center"
                  >
                    Lanjutkan di portal PPDB resmi sekolah
                  </a>
                  <button type="button" onClick={resetAll} className="btn btn-ghost w-full">
                    Isi ulang formulir
                  </button>
                </div>
                <p className="nums mt-6 text-center text-xs text-slate-500">
                  Kontak panitia: {' '}
                  <a href={telpHref} className="font-semibold text-brand-800 hover:underline">
                    {school.phone}
                  </a>{' '}
                  · layanan {school.jamLayanan[0].hari} {school.jamLayanan[0].jam}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </>
    )
  }

  // Panel memakai CSS transition murni (lihat .step-panel di index.css):
  // konten tidak pernah terkunci tak terlihat bila animasi/frame loop tidak berjalan.

  return (
    <>
      <Seo
        title="Pendaftaran PPDB · AskTunas"
        description="Formulir pendaftaran PPDB 2026/2027 SMK Telekomunikasi Tunas Harapan dalam tiga langkah: data siswa, pilihan program, konfirmasi."
      />
      <PageHeader
        title="Pendaftaran PPDB"
        subtitle="Formulir minat calon peserta didik tahun ajaran 2026/2027 dalam tiga langkah."
      />
      <div className="band-blue">
        <div className="mx-auto grid max-w-5xl gap-10 px-4 py-16 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <aside className="rounded-2xl bg-brand-950 p-8 text-white shadow-[0_18px_34px_-20px_rgba(0,0,0,.5)]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.18em] text-accent-400">Persyaratan</p>
                <ul className="mt-4 space-y-2.5 text-sm text-brand-100">
                  <li>Foto kopi rapor semester terakhir</li>
                  <li>Scan ijazah / SKL atau surat keterangan lulus</li>
                  <li>Akta kelahiran (file JPG/PNG/PDF, maks {MAKS_MB} MB per berkas)</li>
                </ul>
              </div>
              <div className="mt-5 border-t border-white/10 pt-5 text-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-100">Alur sesuai data sekolah</p>
                <ol className="mt-3 list-decimal space-y-2 pl-5 text-brand-100">
                  {ppdbResmi.alur.map((langkah) => <li key={langkah}>{langkah}</li>)}
                </ol>
                <p className="mt-3 text-brand-100">Sistem penerimaan: {ppdbResmi.sistem}</p>
                {ppdbResmi.catatan.map((item) => (
                  <p key={item} className="mt-2 text-brand-100">{item}</p>
                ))}
                <a
                  href={ppdbResmi.portal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block font-semibold text-white underline decoration-accent-400 underline-offset-4"
                >
                  Portal PPDB resmi sekolah ↗
                </a>
              </div>
              <div className="mt-5 border-t border-white/10 pt-5 text-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-100">Kendala pendaftaran?</p>
                <p className="mt-2 text-brand-100">
                  Hubungi Panitia PPDB melalui{' '}
                  <a href={telpHref} className="font-semibold text-white underline decoration-accent-400 underline-offset-4">
                    {school.phone}
                  </a>{' '}
                  atau{' '}
                  <a
                    href={`mailto:${school.email}`}
                    className="break-all font-semibold text-white underline decoration-accent-400 underline-offset-4"
                  >
                    {school.email}
                  </a>
                  .
                </p>
              </div>
              <div className="mt-5 border-t border-white/10 pt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-100">Jam layanan tata usaha</p>
                <ul className="nums mt-2 space-y-1 text-sm text-brand-100">
                  {school.jamLayanan.map((item) => (
                    <li key={item.hari} className="flex justify-between gap-4">
                      <span>{item.hari}</span>
                      <span className="font-semibold text-white">{item.jam}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </Reveal>

          <Reveal delay={0.08}>
            <form onSubmit={handleSubmit} noValidate className="depth-card rounded-2xl p-7 sm:p-9">
              {/* Stepper + progress bar */}
              <div>
                <div className="flex items-end justify-between gap-2">
                  {langkah.map((title, index) => (
                    <button
                      key={title}
                      type="button"
                      onClick={() => goTo(index)}
                      aria-current={index === step ? 'step' : undefined}
                      className={`flex min-h-11 items-center gap-2.5 rounded-lg px-2 py-1 text-left text-sm font-semibold transition ${
                        index === step
                          ? 'text-brand-950'
                          : index < step
                            ? 'cursor-pointer text-brand-600 hover:bg-brand-50'
                            : 'text-slate-400'
                      }`}
                    >
                      <span
                        className={`grid h-8 w-8 place-items-center rounded-full border-2 text-xs font-bold transition ${
                          index < step
                            ? 'border-brand-700 bg-brand-700 text-white'
                            : index === step
                              ? 'border-brand-700 bg-white text-brand-900'
                              : 'border-slate-300 bg-white text-slate-400'
                        }`}
                      >
                        {index < step ? '✓' : index + 1}
                      </span>
                      <span className="hidden sm:inline">{title}</span>
                    </button>
                  ))}
                </div>
                <div
                  className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200"
                  role="progressbar"
                  aria-valuenow={step + 1}
                  aria-valuemin={1}
                  aria-valuemax={3}
                  aria-label="Progres pengisian formulir"
                >
                  <div
                    className="bar h-full rounded-full bg-gradient-to-r from-brand-500 via-brand-700 to-accent-500 transition-[width] duration-[400ms] ease-out"
                    data-progress={step + 1}
                  />
                </div>
                <p aria-live="polite" className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {Object.keys(errors).length
                    ? `Langkah ${step + 1} dari ${langkah.length} — ada ${Object.keys(errors).length} isian yang perlu diperbaiki`
                    : `Langkah ${step + 1} dari ${langkah.length} — ${langkah[step]}`}
                </p>
                <p
                  ref={errorSummaryRef}
                  tabIndex={-1}
                  role="status"
                  aria-live="polite"
                  className="sr-only"
                >
                  {Object.keys(errors).length
                    ? `Ada ${Object.keys(errors).length} isian yang perlu diperbaiki. ${Object.values(errors)[0]}`
                    : ''}
                </p>
              </div>

              <div key={step} className="step-panel mt-7 space-y-5">
                  {step === 0 && (
                    <>
                      <div>
                        <label className={labelClass} htmlFor="nama">Nama Lengkap</label>
                        <input
                          id="nama" name="nama" value={form.nama} onChange={update} ref={registerField('nama')}
                          autoComplete="name" required
                          aria-describedby={errors.nama ? 'error-nama' : undefined}
                          className={inputClass} placeholder="Nama sesuai akta"
                        />
                        {error('nama')}
                      </div>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <label className={labelClass} htmlFor="tanggalLahir">Tanggal Lahir</label>
                          <input
                            id="tanggalLahir" name="tanggalLahir" type="date" value={form.tanggalLahir}
                            onChange={update} ref={registerField('tanggalLahir')}
                            min="2005-01-01" max={today} required
                            aria-describedby={errors.tanggalLahir ? 'error-tanggalLahir' : undefined}
                            className={`${inputClass} nums`}
                          />
                          {error('tanggalLahir')}
                        </div>
                        <div>
                          <label className={labelClass} htmlFor="nisn">NISN (opsional)</label>
                          <input
                            id="nisn" name="nisn" inputMode="numeric" autoComplete="off" value={form.nisn}
                            onChange={update} ref={registerField('nisn')}
                            maxLength={10} placeholder="10 digit angka"
                            aria-describedby={errors.nisn ? 'error-nisn' : undefined}
                            className={`${inputClass} nums`}
                          />
                          {error('nisn')}
                        </div>
                      </div>
                      <div>
                        <label className={labelClass} htmlFor="asalSekolah">Asal Sekolah</label>
                        <input
                          id="asalSekolah" name="asalSekolah" value={form.asalSekolah} onChange={update}
                          ref={registerField('asalSekolah')} autoComplete="organization" required
                          aria-describedby={errors.asalSekolah ? 'error-asalSekolah' : undefined}
                          className={inputClass} placeholder="Nama SMP/MTs"
                        />
                        {error('asalSekolah')}
                      </div>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <label className={labelClass} htmlFor="telepon">Nomor WhatsApp</label>
                          <input
                            id="telepon" name="telepon" type="tel" inputMode="tel" autoComplete="tel"
                            value={form.telepon} onChange={update} ref={registerField('telepon')} required
                            aria-describedby={errors.telepon ? 'error-telepon' : undefined}
                            className={`${inputClass} nums`} placeholder="08xxxxxxxxxx"
                          />
                          {error('telepon')}
                        </div>
                        <div>
                          <label className={labelClass} htmlFor="email">Email</label>
                          <input
                            id="email" name="email" type="email" inputMode="email" autoComplete="email"
                            value={form.email} onChange={update} ref={registerField('email')} required
                            aria-describedby={errors.email ? 'error-email' : undefined}
                            className={inputClass} placeholder="nama@email.com"
                          />
                          {error('email')}
                        </div>
                      </div>
                    </>
                  )}

                  {step === 1 && (
                    <>
                      <fieldset>
                        <legend className={labelClass}>Program Keahlian Pilihan</legend>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {jurusan.map((item) => (
                            <label
                              key={item.kode}
                              className={`group relative flex cursor-pointer items-center gap-4 rounded-xl border-2 bg-white p-4 transition hover:-translate-y-0.5 ${
                                form.jurusan === item.kode
                                  ? 'border-brand-700'
                                  : 'border-slate-200 hover:border-brand-300'
                              }`}
                            >
                              <input
                                type="radio"
                                name="jurusan"
                                value={item.kode}
                                checked={form.jurusan === item.kode}
                                onChange={update}
                                className="sr-only"
                              />
                              <span
                                className={`font-display grid h-12 w-12 shrink-0 place-items-center rounded-lg text-sm font-bold transition ${
                                  form.jurusan === item.kode ? 'bg-brand-900 text-white' : 'bg-brand-50 text-brand-700'
                                }`}
                              >
                                {item.monogram}
                              </span>
                              <span>
                                <span className="block text-sm font-bold text-brand-950">{item.kode}</span>
                                <span className="block text-xs leading-5 text-slate-500">{item.nama}</span>
                              </span>
                            </label>
                          ))}
                        </div>
                        {error('jurusan')}
                      </fieldset>

                      <div className="space-y-4">
                        <p className={labelClass}>Berkas Persyaratan (JPG/PNG/PDF, maks {MAKS_MB} MB)</p>
                        {berkasWajib.map(({ key, label }) => (
                          <div key={key} className="rounded-lg border border-slate-200 bg-white p-4">
                            <p className="text-sm font-semibold text-brand-950">{label}</p>
                            {berkas[key] ? (
                              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                                <p className="min-w-0 flex-1 truncate text-sm text-slate-600">
                                  {berkas[key].nama}
                                  <span className="nums ml-2 text-xs text-slate-400">
                                    · {Math.max(1, Math.round(berkas[key].ukuran / 1024))} KB
                                  </span>
                                </p>
                                <div className="flex gap-2">
                                  <label className="btn btn-ghost btn-sm cursor-pointer">
                                    Ganti
                                    <input
                                      type="file" accept=".jpg,.jpeg,.png,.pdf" className="sr-only"
                                      onChange={(e) => pickBerkas(key, e)}
                                    />
                                  </label>
                                  <button
                                    type="button" onClick={() => hapusBerkas(key)}
                                    className="btn btn-ghost btn-sm"
                                  >
                                    Hapus
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <label className="mt-2 flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-paper px-4 py-4 text-sm font-semibold text-slate-500 transition hover:border-brand-400 hover:text-brand-700">
                                Pilih berkas {label.toLowerCase()}
                                <input
                                  ref={registerField(`berkas-${key}`)}
                                  type="file" accept=".jpg,.jpeg,.png,.pdf" className="sr-only"
                                  aria-describedby={errors[`berkas-${key}`] ? `error-berkas-${key}` : undefined}
                                  onChange={(e) => pickBerkas(key, e)}
                                />
                              </label>
                            )}
                            {error(`berkas-${key}`)}
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <div>
                        <p className={labelClass}>Ringkasan Pendaftaran</p>
                        <dl className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
                          {[
                            { label: 'Nama Lengkap', value: form.nama, step: 0 },
                            { label: 'Tanggal Lahir', value: form.tanggalLahir ? formatTanggal(form.tanggalLahir) : '', step: 0 },
                            { label: 'Asal Sekolah', value: form.asalSekolah, step: 0 },
                            { label: 'NISN', value: form.nisn || '—', step: 0 },
                            { label: 'Nomor WhatsApp', value: form.telepon, step: 0 },
                            { label: 'Email', value: form.email, step: 0 },
                            { label: 'Program Keahlian', value: form.jurusan, step: 1 },
                            {
                              label: 'Berkas',
                              value: berkasLabel(berkas),
                              step: 1,
                            },
                            { label: 'Pesan', value: form.pesan || '—', step: 2 },
                          ].map((row) => (
                            <div key={row.label} className="flex items-start justify-between gap-4 px-4 py-3">
                              <dt className="text-xs font-bold uppercase tracking-wider text-slate-400">{row.label}</dt>
                              <dd className="flex items-start gap-3 text-right">
                                <span className="nums text-sm font-semibold text-brand-950">{row.value || '—'}</span>
                                <button
                                  type="button"
                                  // Baris Pesan berada di langkah yang sama, jadi "Ubah" tidak bisa
                                  // melompat mundur — arahkan fokus ke textarea-nya di bawah ringkasan.
                                  onClick={() => (row.step === step ? fieldRefs.current.pesan?.focus() : goTo(row.step))}
                                  className="text-xs font-semibold text-brand-700 hover:underline"
                                >
                                  Ubah
                                </button>
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                      <div>
                        <label className={labelClass} htmlFor="pesan">Pesan (opsional)</label>
                        <textarea
                          id="pesan" name="pesan" rows="3" value={form.pesan} onChange={update}
                          ref={registerField('pesan')}
                          className={inputClass} placeholder="Pertanyaan tambahan untuk panitia"
                        />
                      </div>
                      <label
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 text-sm transition ${
                          errors.persetujuan ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white hover:border-brand-300'
                        }`}
                      >
                        <input
                          type="checkbox" name="persetujuan" checked={form.persetujuan} onChange={update}
                          className="mt-0.5 h-4 w-4 accent-[#2f4b7c]"
                          aria-describedby={errors.persetujuan ? 'error-persetujuan' : undefined}
                        />
                        <span className="leading-6 text-slate-600">
                          Saya menyatakan data di atas benar dan bersedia diverifikasi oleh panitia PPDB. Data pribadi
                          ini hanya digunakan untuk keperluan pendaftaran dan dikirim langsung ke panitia melalui jalur
                          yang saya pilih.
                        </span>
                      </label>
                      {error('persetujuan')}
                    </>
                  )}
              </div>

              <div className="mt-8 flex gap-3">
                {step > 0 && (
                  <button type="button" onClick={goBack} className="btn btn-ghost shrink-0">
                    ← Kembali
                  </button>
                )}
                {step < langkah.length - 1 ? (
                  <button type="button" onClick={goNext} className="btn btn-primary w-full">
                    Lanjut ke {langkah[step + 1]}
                  </button>
                ) : (
                  <button type="submit" disabled={status === 'loading'} className="btn btn-primary w-full">
                    {status === 'loading' ? 'Memeriksa…' : 'Selesaikan Pendaftaran'}
                  </button>
                )}
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </>
  )
}

function berkasLabel(map) {
  return berkasWajib.map(({ key }) => `${key}: ${map[key]?.nama || '—'}`).join(' · ')
}
