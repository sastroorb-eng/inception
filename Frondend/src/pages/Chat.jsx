import PageHeader from '../components/PageHeader'
import ChatBox from '../components/ChatBox'
import Seo from '../components/Seo'

export default function Chat() {
  return (
    <>
      <Seo
        title="Layanan Informasi · AskTunas"
        description="Tanya jawab asistan AskTunas seputar jurusan, PPDB, fasilitas, akreditasi, dan kontak SMK Telekomunikasi Tunas Harapan."
      />
      <PageHeader
        title="Layanan Informasi"
        subtitle="Cari informasi sekolah, program keahlian, fasilitas, dan pendaftaran dalam satu tempat."
      />
      <div className="band-blue mx-auto max-w-3xl px-4 py-10">
        <ChatBox />
      </div>
    </>
  )
}
