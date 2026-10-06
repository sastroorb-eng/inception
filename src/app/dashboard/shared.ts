// Berisi konstanta & tipe yang dipakai bersama oleh server component,
// server action, dan client component. Jangan menaruh kode server-only
// (mis. `next/headers` atau createClient) di file ini.

export const KEGIATAN_CATEGORY = "Kegiatan";
export const BERITA_CATEGORY = "Pengumuman";

export type ActionState = { error?: string; success?: string } | null;

export type DashboardEntry = {
  id: string;
  title: string;
  detail: string;
  date: string; // YYYY-MM-DD
  isUnread?: boolean;
  imageUrl?: string | null;
};

export type DashboardData = {
  // null berarti belum login. `profile` tetap null ketika user sudah login
  // tetapi baris profiles belum ada, jadi jangan pakai `profile` untuk
  // menentukan status autentikasi.
  userId: string | null;
  profile: import("@/utils/supabase/database.types").Profile | null;
  isAdmin: boolean;
  berita: DashboardEntry[];
  kegiatan: DashboardEntry[];
  masukan: DashboardEntry[];
};
