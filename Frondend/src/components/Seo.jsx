import { useEffect } from 'react'

// Mengubah document.title, meta description, dan meta robots per rute.
// Ringan — tanpa library tambahan, cukup query ke head yang sudah ada di index.html.
export default function Seo({ title, description, noindex = false }) {
  useEffect(() => {
    document.title = title

    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
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
  }, [title, description, noindex])

  return null
}
