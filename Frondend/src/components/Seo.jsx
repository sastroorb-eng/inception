import { useEffect } from 'react'

// Mengubah document.title, meta description, meta robots, tag Open Graph, dan
// canonical per rute. Ringan — tanpa library tambahan, cukup query ke head yang
// sudah ada di index.html.
export default function Seo({ title, description, noindex = false }) {
  useEffect(() => {
    document.title = title

    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      meta.setAttribute('content', '')
      document.head.appendChild(meta)
    }
    if (description) meta.setAttribute('content', description)

    let robots = document.querySelector('meta[name="robots"]')
    if (!robots) {
      robots = document.createElement('meta')
      robots.name = 'robots'
      document.head.appendChild(robots)
    }
    robots.setAttribute('content', noindex ? 'noindex, follow' : 'index, follow')

    // Canonical + Open Graph ikut rute aktif, supaya tautan yang dibagikan
    // calon siswa menampilkan judul halaman yang benar.
    const url = window.location.origin + window.location.pathname
    const tagMeta = (properti, nilai) => {
      let tag = document.querySelector(`meta[property="${properti}"]`)
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute('property', properti)
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', nilai)
    }
    tagMeta('og:title', title)
    if (description) tagMeta('og:description', description)
    tagMeta('og:url', url)

    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url
  }, [title, description, noindex])

  return null
}
