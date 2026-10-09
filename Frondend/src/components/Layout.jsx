import { useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import ScrollToTop from './ScrollToTop'
import BackToTop from './BackToTop'
import ChatPopup from './ChatPopup'

export default function Layout({ children }) {
  const { pathname } = useLocation()
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <a href="#konten" className="skip-link">Lewati ke konten utama</a>
      <Navbar />
      <main id="konten" className={`flex-1 ${pathname === '/' ? '' : 'page-shell'}`}>{children}</main>
      <Footer />
      <BackToTop />
      {/* Popup TunasBot tidak dipasang di /chat agar tidak dobel dengan asisten layar penuh. */}
      {pathname !== '/chat' && <ChatPopup />}
    </div>
  )
}
