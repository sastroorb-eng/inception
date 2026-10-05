import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import Seo from '../components/Seo'
import { berita, galeri } from '../data/content'

// CONTOH tampilan (bukan data siswa nyata) — tabel asli tersinkron setelah
// backend Supabase aktif di Tahap 9.
const contohPendaftar = [
  { id: 1, nama: 'Contoh Pendaftar 1', jurusan: 'PPLG', email: 'contoh1@email.com', status: 'Baru' },
  { id: 2, nama: 'Contoh Pendaftar 2', jurusan: 'TJKT', email: 'contoh2@email.com', status: 'Terverifikasi' },
]

const kartuStatistik = [
  { label: 'Pendaftar PPDB', value: '—', catatan: 'menunggu database asli' },
  { label: 'Berita Aktif', value: String(berita.length), catatan: 'dari content.js' },
  { label: 'Entri Galeri', value: String(galeri.length), catatan: 'dari content.js' },
  { label: 'Pertanyaan Chat Hari Ini', value: '—', catatan: 'butuh log backend' },
]

const statusClass = (status) =>
  status === 'Terverifikasi' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'

export default function Admin() {
  return (
    <>
      <Seo title="Dashboard Admin · AskTunas" description="Halaman internal panitia — tidak untuk diindeks." noindex />
      <PageHeader title="Dashboard Admin" subtitle="Kelola konten, pendaftar, dan aktivitas portal sekolah." />
      <div className="mx-auto max-w-6xl px-4 py-14">
        <Reveal>
          <div className="rounded-lg border-l-4 border-amber-500 bg-amber-50 p-4 text-sm text-amber-800">
            Halaman ini masih kerangka demo. Angka bertanda — menunggu backend Supabase (Tahap 9), dan tabel di bawah
            berisi CONTOH tampilan, bukan data pendaftar sebenarnya. Supabase Auth wajib ditambahkan sebelum digunakan
            panitia.
          </div>
        </Reveal>

        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {kartuStatistik.map((item, index) => (
            <Reveal key={item.label} delay={index * 0.05}>
              <div className="depth-card rounded-xl p-5">
                <p className="font-display text-4xl font-bold text-brand-900">{item.value}</p>
                <p className="mt-1 text-sm text-slate-500">{item.label}</p>
                <p className="mt-0.5 text-xs italic text-slate-400">{item.catatan}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="depth-card mt-9 overflow-hidden rounded-xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <h2 className="font-display text-xl font-bold text-brand-950">Pendaftar Terbaru (contoh)</h2>
              <button className="btn btn-primary btn-sm">Tambah</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">Contoh tampilan tabel pendaftar; data asli menunggu backend.</caption>
                <thead className="bg-slate-100 text-xs uppercase text-slate-500">
                  <tr>
                    <th scope="col" className="px-5 py-3">Nama</th>
                    <th scope="col" className="px-5 py-3">Program</th>
                    <th scope="col" className="px-5 py-3">Email</th>
                    <th scope="col" className="px-5 py-3">Status</th>
                    <th scope="col" className="px-5 py-3">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {contohPendaftar.map((item) => (
                    <tr key={item.id}>
                      <td className="px-5 py-4 font-semibold text-brand-950">{item.nama}</td>
                      <td className="px-5 py-4">{item.jurusan}</td>
                      <td className="px-5 py-4 text-slate-500">{item.email}</td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button className="font-semibold text-brand-700">Detail</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </div>
    </>
  )
}
