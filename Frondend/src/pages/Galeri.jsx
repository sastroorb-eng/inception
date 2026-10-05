import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import Seo from '../components/Seo'
import { galeri, videos, jurusan } from '../data/content'

const kategori = ['Semua', 'Fasilitas', 'Kegiatan']
// Galeri dipisah per program keahlian supaya foto tiap jurusan mudah dibedakan.
// Foto fasilitas kampus (jurusan: "Umum") tidak punya tab sendiri — hanya tampil di "Semua".
const galeriGroup = ['Semua', ...jurusan.map((j) => j.kode)]

function EmptyTile({ label, note, type = 'photo' }) {
  return (
    <div
      className={`grid w-full place-items-center rounded-xl border border-line bg-paper px-4 py-8 ${
        type === 'video' ? 'h-full' : 'aspect-square'
      }`}
    >
      <div className="text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg border border-slate-300 bg-white text-brand-700">
          {type === 'video' ? '▶' : '▧'}
        </div>
        <p className="mt-3 text-sm font-bold text-brand-950">{label}</p>
        <p className="mx-auto mt-1 max-w-40 text-xs leading-5 text-slate-500">{note}</p>
      </div>
    </div>
  )
}

export default function Galeri() {
  const [grup, setGrup] = useState('Semua')
  const [filter, setFilter] = useState('Semua')
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [gagalLoad, setGagalLoad] = useState([])
  const [gagalVideo, setGagalVideo] = useState([])

  const items = useMemo(
    () =>
      galeri.filter(
        (item) => (grup === 'Semua' || item.jurusan === grup) && (filter === 'Semua' || item.kategori === filter)
      ),
    [grup, filter]
  )
  const countOf = (g) => galeri.filter((item) => g === 'Semua' || item.jurusan === g).length
  const jurusanAktif = jurusan.find((j) => j.kode === grup)
  // Lightbox hanya menavigasi foto yang sedang tampil di layar, bukan seluruh galeri.
  const photoItems = useMemo(
    () => items.filter((item) => item.src && !gagalLoad.includes(item.id)),
    [items, gagalLoad]
  )

  useEffect(() => {
    if (lightboxIndex === null) return
    function onKey(e) {
      if (e.key === 'Escape') setLightboxIndex(null)
      if (e.key === 'ArrowRight') setLightboxIndex((i) => (i + 1) % photoItems.length)
      if (e.key === 'ArrowLeft') setLightboxIndex((i) => (i - 1 + photoItems.length) % photoItems.length)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [lightboxIndex, photoItems.length])

  const selected = lightboxIndex === null ? null : photoItems[lightboxIndex]

  return (
    <>
      <Seo
        title="Galeri · AskTunas"
        description="Dokumentasi foto fasilitas, pembelajaran, dan kegiatan siswa SMK Telekomunikasi Tunas Harapan beserta video profil sekolah."
      />
      <PageHeader
        title="Galeri Sekolah"
        subtitle="Ruang dokumentasi fasilitas, pembelajaran, dan kegiatan siswa — dipisah per program keahlian."
      />
      <div className="band-blue mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-wrap gap-2">
          {galeriGroup.map((g) => (
            <button
              key={g}
              onClick={() => {
                setGrup(g)
                setLightboxIndex(null)
              }}
              aria-pressed={grup === g}
              className={`flex items-center gap-2 rounded-lg border px-5 py-2 text-sm font-semibold transition ${
                grup === g
                  ? 'border-brand-900 bg-brand-900 text-white'
                  : 'border-slate-300 bg-white text-slate-600 hover:border-brand-400'
              }`}
            >
              {g}
              <span className={`text-xs font-bold ${grup === g ? 'text-white/70' : 'text-slate-400'}`}>
                {countOf(g)}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-slate-500">
          {grup === 'Semua'
            ? 'Semua dokumentasi yang terkumpul.'
            : `${jurusanAktif?.nama ?? grup} — ${items.length} foto terdokumentasi.`}
        </p>
        <div className="mt-6 mb-9 flex flex-wrap gap-2">
          {kategori.map((item) => (
            <button
              key={item}
              onClick={() => {
                setFilter(item)
                setLightboxIndex(null)
              }}
              aria-pressed={filter === item}
              className={`rounded-lg border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
                filter === item
                  ? 'border-accent-500 bg-accent-500 text-brand-950'
                  : 'border-slate-300 bg-white text-slate-500 hover:border-brand-400'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-brand-300 bg-card px-6 py-14 text-center">
            {/* [ISI DATA ASLI] Empty state — hilang sendiri begitu entri galeri jurusan ini diisi. */}
            <p className="font-display text-2xl font-bold text-brand-950">Belum ada foto pada pilihan ini</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Dokumentasi kegiatan program keahlian ini sedang dipersiapkan sekolah. Bagian ini terisi otomatis begitu
              fotonya ditambahkan.
            </p>
          </div>
        ) : (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.04}>
              {item.src && !gagalLoad.includes(item.id) ? (
                <button
                  onClick={() => setLightboxIndex(photoItems.findIndex((p) => p.id === item.id))}
                  className="group relative block w-full overflow-hidden rounded-xl shadow-[0_7px_0_#d9e2ea]"
                >
                  <img
                    src={item.src}
                    alt={item.judul}
                    loading="lazy"
                    decoding="async"
                    onError={() => setGagalLoad((list) => (list.includes(item.id) ? list : [...list, item.id]))}
                    className="aspect-square w-full object-cover transition group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-left text-sm font-semibold text-white">
                    {item.judul}
                  </div>
                </button>
              ) : (
                <div className="depth-card rounded-xl p-2">
                  {/* Fallback otomatis: slot kosong tampil selama berkas foto belum ada di public/images */}
                  <EmptyTile label="Segera hadir" note="Dokumentasi foto ini sedang dipersiapkan sekolah." />
                  <div className="px-2 pb-1 pt-3">
                    <p className="font-semibold text-brand-950">{item.judul}</p>
                    <p className="text-xs text-slate-500">{item.kategori}</p>
                  </div>
                </div>
              )}
            </Reveal>
          ))}
        </div>
        )}

        <div className="mt-20">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-brand-600">Dokumentasi Audio Visual</p>
            <h2 className="font-display mt-2 text-4xl font-bold text-brand-950">Video sekolah</h2>
            <p className="mt-2 text-slate-500">Tempat video profil dan dokumentasi kegiatan.</p>
          </Reveal>
          <div className="mt-8 grid gap-7 md:grid-cols-2">
            {videos.map((video, index) => {
              const isLocalFile = /\.(mp4|webm|ogg)$/i.test(video.src || '')
              const canRender = video.src && !gagalVideo.includes(video.id)
              return (
              <Reveal key={video.id} delay={index * 0.08}>
                <div className="depth-card overflow-hidden rounded-2xl">
                  {canRender && isLocalFile ? (
                    <video
                      src={video.src}
                      controls
                      className="aspect-video w-full bg-brand-950"
                      title={video.judul}
                      onError={() => setGagalVideo((list) => (list.includes(video.id) ? list : [...list, video.id]))}
                    />
                  ) : canRender ? (
                    <div className="aspect-video">
                      <iframe src={video.src} title={video.judul} className="h-full w-full" allowFullScreen />
                    </div>
                  ) : (
                    <div className="aspect-video p-3">
                      <EmptyTile label="Segera hadir" note="Video dokumentasi akan ditampilkan di sini." type="video" />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-display text-xl font-bold text-brand-950">{video.judul}</h3>
                    <p className="mt-1 text-sm text-slate-500">{video.desc}</p>
                  </div>
                </div>
              </Reveal>
              )
            })}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Foto: ${selected.judul}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
            className="fixed inset-0 z-50 grid place-items-center bg-brand-950/90 p-4"
          >
            <motion.figure
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-3xl overflow-hidden rounded-xl bg-white"
            >
              <img src={selected.src} alt={selected.judul} className="w-full" />
              <figcaption className="flex items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-semibold text-brand-950">{selected.judul}</p>
                  <p className="text-xs text-slate-500">
                    {selected.kategori} · {lightboxIndex + 1} / {photoItems.length} · gunakan ← → atau Esc
                  </p>
                </div>
                <div className="flex gap-2">
                  {photoItems.length > 1 && (
                    <>
                      <button
                        onClick={() => setLightboxIndex((i) => (i - 1 + photoItems.length) % photoItems.length)}
                        aria-label="Foto sebelumnya"
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-brand-900 transition hover:bg-brand-50"
                      >
                        ←
                      </button>
                      <button
                        onClick={() => setLightboxIndex((i) => (i + 1) % photoItems.length)}
                        aria-label="Foto berikutnya"
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-brand-900 transition hover:bg-brand-50"
                      >
                        →
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setLightboxIndex(null)}
                    className="rounded-lg bg-brand-900 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Tutup
                  </button>
                </div>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
