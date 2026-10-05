// Kode asli untuk menghubungkan service chat
const API_URL = "https://inception-ebon.vercel.app/api/chat";

export async function sendMessage(message, history = []) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pesan: message }),
    });

    if (!res.ok) throw new Error('Gagal menghubungi asisten.');
    
    const data = await res.json();
    return data.balasan;
  } catch (error) {
    console.error("Error chat service:", error);
    throw error;
  }
}