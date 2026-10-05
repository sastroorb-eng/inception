export function initialsOf(name) {
  return name
    .split(/\s+/)
    .filter((word) => /^[A-Za-z0-9]/.test(word))
    .slice(0, 3)
    .map((word) => word[0].toUpperCase())
    .join('')
}

export function PartnerPanel({ program }) {
  if (program.partners.length) {
    return (
      <div className="mt-6 border-t border-slate-200 pt-5">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-slate-500">Kolaborasi terverifikasi</p>
        {program.partners.map((partner) => (
          <div key={partner.name} className="mt-3 flex items-center gap-3 rounded-lg border border-brand-200 bg-brand-50 p-3">
            {partner.logo ? (
              <img
                src={partner.logo}
                alt={`Logo ${partner.name}`}
                width="40"
                height="40"
                loading="lazy"
                className="h-10 w-auto max-w-[152px] shrink-0 rounded-md bg-white object-contain p-1"
              />
            ) : (
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-brand-900 font-display text-xs font-bold text-white">
                {initialsOf(partner.name)}
              </div>
            )}
            <div>
              <p className="font-semibold text-brand-950">{partner.name}</p>
              {partner.type
                ? <p className="text-xs text-slate-500">{partner.type}</p>
                : <p className="text-xs text-slate-500">Mitra sekolah — peran rinci belum dipublikasikan.</p>}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="mt-6 border-t border-slate-200 pt-5">
      <p className="text-xs font-bold uppercase tracking-[.16em] text-slate-500">Mitra industri program</p>
      <div className="mt-3 rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
        Kerja sama mitra untuk program ini sedang dikurasi bersama tata usaha dan akan ditampilkan di sini.
      </div>
    </div>
  )
}

export function KurikulumPanel({ program }) {
  return (
    <div className="mt-6 border-t border-slate-200 pt-5">
      <p className="text-xs font-bold uppercase tracking-[.16em] text-slate-500">Mata pelajaran inti</p>
      {program.mataPelajaran.length === 0 ? (
        <div className="mt-3 rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
          Daftar mata pelajaran inti program ini mengikuti dokumen kurikulum yang berlaku dan dapat dikonsultasikan ke tata usaha.
        </div>
      ) : (
        <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
          {program.mataPelajaran.map((mapel) => (
            <li key={mapel} className="flex items-start gap-2 text-sm text-slate-600">
              <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
              {mapel}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
