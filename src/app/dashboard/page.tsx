import { redirect } from "next/navigation";
import DashboardView from "./dashboard-view";
import { getDashboardData } from "./queries";
import "./dashboard.css";

const ROLE_LABEL: Record<string, string> = {
  admin: "Administrator",
  guru: "Guru / Tenaga Pendidik",
};

export default async function DashboardPage() {
  const { userId, profile, isAdmin, berita, kegiatan, masukan } =
    await getDashboardData();

  // Hanya redirect kalau memang belum login. Kalau user sudah login tapi
  // baris `profiles` belum ada, jangan arahkan ke /login: proxy.ts akan
  // memantulkan user yang login kembali ke /dashboard dan itu jadi loop.
  if (!userId) redirect("/login");

  const roleLabel = profile
    ? (ROLE_LABEL[profile.role] ?? ROLE_LABEL.guru)
    : ROLE_LABEL.guru;

  return (
    <DashboardView
      userName={profile?.full_name?.trim() || "Pengguna"}
      roleLabel={roleLabel}
      isAdmin={isAdmin}
      berita={berita}
      kegiatan={kegiatan}
      masukan={masukan}
    />
  );
}
