import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import TiltCard from '../components/TiltCard'
import Seo from '../components/Seo'
import { strukturOrganisasi, school, visiMisi, identitas, sejarah, guru } from '../data/content'

function OrgNode({ jabatan, nama, unit, primary }) {
  if (unit) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-brand-300 bg-brand-100 px-3 py-3 text-center shadow-[0_4px_0_#b9cde6]">
        <p className="text-xs font-bold text-brand-900">{jabatan}</p>
      </div>
    )
  }
  return (
    <TiltCard max={6} className={`depth-card h-full overflow-hidden rounded-xl text-center ${primary ? 'border-brand-500' : ''}`}>
      <div className="tilt-inner">
        {/* Dua tingkat ala bagan resmi: pita jabatan + badan nama, palet biru web */}
        <p className={`px-4 py-2 text-sm font-bold text-white ${primary ? 'bg-brand-800' : 'bg-brand-600'}`}>{jabatan}</p>
        <p className={`px-4 py-2 text-xs ${primary ? 'bg-brand-200 text-brand-950' : 'bg-brand-100 text-brand-900'}`}>{nama}</p>
      </div>
    </TiltCard>
  )
}

// [ISI DATA ASLI] strukturOrganisasi di src/data/content.js — bagan resmi sekolah.
// Lebar baris meniru bagan resmi: tier 0-4 penuh, baris Guru lebih sempit (centered),
// Wali Kelas & Murid kartu tunggal di tengah.
function tierLayout(tier) {
  const unitColumns = {
    1: 'mx-auto max-w-xs',
    5: 'mx-auto max-w-4xl grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
    9: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-9',
  }
  if (tier.every((node) => node.unit)) {
    return `grid gap-5 ${unitColumns[tier.length] ?? 'mx-auto max-w-4xl sm:grid-cols-3'}`
  }
  const columns = {
    1: 'mx-auto max-w-xs',
    2: 'mx-auto max-w-xl sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }
  return `grid gap-5 ${columns[tier.length] ?? columns[4]}`
}

// Kelas varian baris bagan → menentukan garis penghubung di index.css (.org-row*)
function tierRowClass(tier) {
  return `org-row--${tier.length}`
}

// Panah lateral ala bagan resmi: solid = perintah, putus-putus = koordinasi.
// Komite tidak dipanah horizontal — ia menyiku naik ke Kepala SMK (org-elbow-komite).
const lateralLink = {
  0: {
    1: 'org-link org-link--left org-link--head-r',
    2: 'org-link org-link--left org-link--dash org-link--head-r org-link--head-l',
  },
  1: {
    2: 'org-link org-link--left org-link--head-r',
  },
}

function cellLinkClass(tierIndex, i) {
  if (tierIndex === 2 || tierIndex === 3) {
    return i > 0 ? 'org-link org-link--left org-link--dash org-link--head-r org-link--head-l' : ''
  }
  return lateralLink[tierIndex]?.[i] ?? ''
}

function cellClass(tierIndex, i) {
  if (!tierIndex) return 'relative'
  const parts = ['org-cell']
  if (tierIndex === 1 && i !== 1) parts.push('org-cell--nodrop')
  return parts.join(' ')
}

export default function Profil() {
  return (
    <>
      <Seo
        title="Profil & Struktur Organisasi · AskTunas"
        description={`Profil resmi ${school.name}: identitas NPSN, akreditasi, sejarah, visi misi, struktur organisasi, dan tenaga pendidik.`}
      />
      <PageHeader title="Profil & Struktur Organisasi" subtitle={`Informasi kelembagaan ${school.name}.`} />
      <div className="band-blue mx-auto max-w-6xl px-4 py-16">
        {/* Identitas kelembagaan */}
        <Reveal>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-brand-300 bg-brand-300 shadow-[0_8px_0_#b9cde6] md:grid-cols-3">
            {[
              ['Alamat', school.address],
              ['Kontak', `${school.phone} · ${school.email}`],
              ['Visi Singkat', visiMisi.visi],
            ].map(([label, value]) => (
              <div key={label} className="bg-brand-100 p-7">
                <p className="text-xs font-bold uppercase tracking-[.18em] text-brand-600">{label}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{value}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Identitas formal */}
        <div className="mt-16">
          <Reveal>
            <div className="text-xs font-bold uppercase tracking-[.2em] text-brand-600">Identitas Formal</div>
            <h2 className="font-display mt-2 text-3xl font-bold text-brand-950">Data kepustakaan sekolah</h2>
          </Reveal>
          <Reveal delay={0.06}>
            <dl className="mt-8 grid gap-px overflow-hidden rounded-xl border border-brand-300 bg-brand-300 sm:grid-cols-2 lg:grid-cols-4">
              {identitas.map((item) => (
                <div key={item.label} className="bg-brand-100 px-6 py-5">
                  <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">{item.label}</dt>
                  {/* [ISI DATA ASLI] isi `identitas` di src/data/content.js */}
                  <dd className="font-display mt-2 text-2xl font-bold text-brand-900">
                    {item.value ?? <span aria-hidden="true">—</span>}
                  </dd>
                  {item.value === null && (
                    <p className="mt-1 text-[10px] italic text-slate-400">27 Mei 20001</p>
                  )}
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* Sejarah */}
        <div className="mt-20 grid gap-10 md:grid-cols-[.8fr_1.2fr]">
          <Reveal>
            <div className="md:sticky md:top-28">
              <div className="text-xs font-bold uppercase tracking-[.2em] text-brand-600">Sejarah</div>
              <h2 className="font-display mt-2 text-3xl font-bold leading-tight text-brand-950">
                Perjalanan Tunas Harapan
              </h2>
              {sejarah.length === 0 && (
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Narasi sejarah akan ditampilkan di sisi ini setelah naskah resmi diterima dari sekolah.
                </p>
              )}
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            {sejarah.length === 0 ? (
              /* [ISI DATA ASLI] slot narasi sejarah — isi array `sejarah` di src/data/content.js */
              <div className="grid min-h-64 place-content-center rounded-xl border-2 border-dashed border-brand-300 bg-brand-100 p-8 text-center">
                <p className="text-sm font-bold uppercase tracking-wider text-slate-400">Naskah sejarah belum diisi</p>
                <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-400">
                  2–4 paragraf kronologi berdirinya sekolah, pendiri, dan perkembangan program keahlian.
                </p>
              </div>
            ) : (
              <div className="depth-card space-y-5 rounded-xl bg-brand-100 p-8">
                {sejarah.map((paragraf, i) => (
                  <p key={i} className="leading-7 text-slate-600">{paragraf}</p>
                ))}
              </div>
            )}
          </Reveal>
        </div>

        {/* Visi & Misi */}
        <div className="mt-20">
          <Reveal>
            <div className="text-xs font-bold uppercase tracking-[.2em] text-brand-600">Arah Pendidikan</div>
            <h2 className="font-display mt-2 text-3xl font-bold text-brand-950">Visi &amp; Misi</h2>
          </Reveal>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Reveal>
              <div className="depth-card h-full rounded-2xl bg-brand-100 p-8">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Visi</p>
                <p className="font-display mt-3 text-xl leading-relaxed text-brand-950">{visiMisi.visi}</p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="depth-card h-full rounded-2xl bg-brand-100 p-8">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Misi</p>
                <ol className="mt-4 space-y-4">
                  {visiMisi.misi.map((item, i) => (
                    <li key={item} className="flex gap-4 text-sm leading-6 text-slate-600">
                      <span className="font-display text-lg font-bold text-brand-600">{String(i + 1).padStart(2, '0')}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Tenaga Pendidik */}
        <div className="mt-20">
          <Reveal>
            <div className="text-xs font-bold uppercase tracking-[.2em] text-brand-600">Ketenagaan</div>
            <h2 className="font-display mt-2 text-3xl font-bold text-brand-950">Tenaga Pendidik</h2>
          </Reveal>
          <Reveal delay={0.06}>
            {guru.length === 0 ? (
              /* [ISI DATA ASLI] isi array `guru` di src/data/content.js sesuai data kepegawaian resmi */
              <div className="mt-8 grid min-h-48 place-content-center rounded-xl border-2 border-dashed border-brand-300 bg-brand-100 p-8 text-center">
                <p className="text-sm font-bold uppercase tracking-wider text-slate-400">Direktori guru belum diisi</p>
                <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-400">
                  Nama, jabatan, dan bidang yang diampu akan ditampilkan sebagai tabel setelah data resmi dari
                  sekolah diterima.
                </p>
              </div>
            ) : (
              <div className="depth-card mt-8 overflow-hidden rounded-xl bg-brand-100">
                <table className="w-full text-left text-sm">
                  <thead className="bg-brand-200 text-xs uppercase text-slate-600">
                    <tr>
                      <th className="px-5 py-3">Nama</th>
                      <th className="px-5 py-3">Jabatan</th>
                      <th className="px-5 py-3">Bidang Diampu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-200">
                    {guru.map((p) => (
                      <tr key={p.id}>
                        <td className="px-5 py-3 font-semibold text-brand-950">{p.nama}</td>
                        <td className="px-5 py-3 text-slate-600">{p.jabatan}</td>
                        <td className="px-5 py-3 text-slate-600">{p.mengampu}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Reveal>
        </div>

        {/* Struktur Organisasi */}
        <div className="mt-20">
          <Reveal>
            <div className="org-banner mx-auto max-w-3xl rounded-xl px-6 py-6 text-center">
              <p className="text-xs font-bold uppercase tracking-[.2em] text-brand-200">Tata Kelola</p>
              <h2 className="font-display mt-2 text-2xl font-bold uppercase leading-snug text-white sm:text-3xl">
                Struktur Organisasi
                <br />
                {school.name}
              </h2>
              <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-brand-100">Kabupaten Semarang</p>
            </div>
            <p className="mx-auto mt-5 max-w-xl text-center text-sm text-slate-600">
              Bagan mengikuti struktur resmi sekolah. Kotak unit kerja hanya menampilkan nama unitnya karena
              memang tidak ada pejabat bernama di bagan resmi — bukan kolom yang belum diisi.
            </p>
          </Reveal>
          <div className="mt-12 space-y-9">
            {strukturOrganisasi.map((tier, tierIndex) => {
              const below = tierIndex === 4 ? ' org-row--below9' : tierIndex === 5 ? ' org-row--below5' : ''
              return (
                <Reveal key={tierIndex} delay={tierIndex * 0.05}>
                  <div className={`${tierLayout(tier)} ${tierIndex ? `org-row ${tierRowClass(tier)}${tierIndex === 1 ? ' org-row--nobus' : ''}${below}` : ''}`}>
                    {tierIndex === 1 && (
                      <>
                        <span className="org-elbow-h org-elbow-komite-h" aria-hidden="true" />
                        <span className="org-elbow-v org-elbow-komite-v" aria-hidden="true" />
                        <span className="org-elbow-head" aria-hidden="true" />
                      </>
                    )}
                    {tierIndex === 6 && (
                      <>
                        <span className="org-elbow-h org-elbow-wali-h" aria-hidden="true" />
                        <span className="org-elbow-v org-elbow-wali-v" aria-hidden="true" />
                      </>
                    )}
                    {below && (
                      <>
                        <span className="org-foot-head org-foot-head--left" aria-hidden="true" />
                        <span className="org-foot-head org-foot-head--right" aria-hidden="true" />
                      </>
                    )}
                    {tier.map((node, i) => {
                      const link = cellLinkClass(tierIndex, i)
                      const drop = tierIndex >= 1 && !(tierIndex === 1 && i !== 1)
                      return (
                        <div key={node.jabatan} className={cellClass(tierIndex, i)}>
                          {link && <span className={link} aria-hidden="true" />}
                          {drop && <span className="org-head" aria-hidden="true" />}
                          <OrgNode {...node} primary={tierIndex <= 1} />
                        </div>
                      )
                    })}
                  </div>
                </Reveal>
              )
            })}
          </div>
          <Reveal delay={0.1}>
            <div className="mx-auto mt-10 flex max-w-xl flex-wrap items-center justify-center gap-x-8 gap-y-2 rounded-xl border border-brand-300 bg-brand-100 px-6 py-4 text-xs font-semibold text-brand-900">
              <span className="font-bold uppercase tracking-wider">Keterangan:</span>
              <span className="flex items-center gap-2"><span className="org-key" aria-hidden="true" /> Garis Perintah (Komando)</span>
              <span className="flex items-center gap-2"><span className="org-key org-key--dash" aria-hidden="true" /> Garis Koordinasi</span>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  )
}
