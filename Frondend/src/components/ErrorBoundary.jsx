import { Component } from 'react'
import { Link } from 'react-router-dom'

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold text-brand-950">Terjadi kesalahan pada halaman ini</h1>
        <p className="mt-3 text-slate-600">
          Mohon maaf, ada bagian yang gagal dimuat. Muat ulang halaman, atau kembali ke Beranda.
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <button type="button" onClick={() => window.location.reload()} className="btn btn-primary btn-sm">
            Muat ulang
          </button>
          <Link to="/" className="btn btn-ghost btn-sm">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    )
  }
}
