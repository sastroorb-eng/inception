import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ErrorBoundary from './components/ErrorBoundary'
import Home from './pages/Home'

const Profil = lazy(() => import('./pages/Profil'))
const Jurusan = lazy(() => import('./pages/Jurusan'))
const JurusanDetail = lazy(() => import('./pages/JurusanDetail'))
const Galeri = lazy(() => import('./pages/Galeri'))
const PPDB = lazy(() => import('./pages/PPDB'))
const Kontak = lazy(() => import('./pages/Kontak'))
const Admin = lazy(() => import('./pages/Admin'))
const Chat = lazy(() => import('./pages/Chat'))
const NotFound = lazy(() => import('./pages/NotFound'))

const fallback = (
  <div className="mx-auto max-w-6xl px-4 py-24 text-center text-sm font-semibold uppercase tracking-wider text-slate-500">
    Memuat halaman…
  </div>
)

export default function App() {
  return (
    <ErrorBoundary>
      <Layout>
        <Suspense fallback={fallback}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/jurusan" element={<Jurusan />} />
            <Route path="/jurusan/:kode" element={<JurusanDetail />} />
            <Route path="/galeri" element={<Galeri />} />
            <Route path="/ppdb" element={<PPDB />} />
            <Route path="/kontak" element={<Kontak />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </ErrorBoundary>
  )
  
}
