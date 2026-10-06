import PageHeader from '../components/PageHeader'
import Seo from '../components/Seo'
import TunasBot from '../components/TunasChat'

export default function Chat() {
  return (
    <>
      <Seo
        title="Tanya Jawab Sekolah · AskTunas"
        description="Ajukan pertanyaan seputar program keahlian, PPDB, fasilitas, dan kegiatan siswa SMK Telekomunikasi Tunas Harapan kepada asisten virtual TunasBot."
      />
      <PageHeader
        title="Tanya TunasBot"
        subtitle="Asisten virtual yang menjawab seputar program keahlian, pendaftaran, fasilitas, dan kegiatan sekolah berdasarkan data yang dikirim pihak sekolah."
      />
      <div className="bg-paper px-4 py-12">
        <TunasBot />
      </div>
    </>
  )
}
