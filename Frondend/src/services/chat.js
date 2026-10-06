// Kode asli untuk menghubungkan service chat
const API_URL = "https://inception-ebon.vercel.app/api/chat";

export async function sendMessage(message, history = []) {
  // Ambil 6 pesan terakhir agar konteks nyambung tanpa memboroskan token.
  const riwayat = history
    .filter((pesan) => pesan && (pesan.role === 'user' || pesan.role === 'assistant') && pesan.content?.trim())
    .slice(-6)
    .map((pesan) => ({ role: pesan.role, content: pesan.content }));

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pesan: message, riwayat }),
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.error || 'Gagal menghubungi asisten.');
    }

    const data = await res.json();
    return data.balasan;
  } catch (error) {
    console.error("Error chat service:", error);
    throw error;
  }
}