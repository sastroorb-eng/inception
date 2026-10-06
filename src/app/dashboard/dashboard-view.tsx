"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import type { DashboardEntry } from "./shared";
import { BERITA_CATEGORY } from "./shared";

type TabKey = "berita" | "masukan" | "kegiatan";

type TabConfig = {
  label: string;
  formTitle: string;
  formHint: string;
  titleLabel: string;
  titlePlaceholder: string;
  detailLabel: string;
  detailPlaceholder: string;
  button: string;
  success: string;
  listTitle: string;
  withDate: boolean;
  empty: string;
};

const TABS: Record<TabKey, TabConfig> = {
  berita: {
    label: "Berita",
    formTitle: "Tambah Berita",
    formHint: "Tulis pengumuman singkat untuk warga sekolah.",
    titleLabel: "Judul berita",
    titlePlaceholder: "Contoh: Jadwal Ujian Akhir Semester",
    detailLabel: "Isi singkat",
    detailPlaceholder: "Tulis isi berita secara singkat",
    button: "Tambahkan Berita",
    success: "Berita berhasil ditambahkan.",
    listTitle: "Berita Terbaru",
    withDate: false,
    empty: "Belum ada berita.",
  },
  masukan: {
    label: "Masukan",
    formTitle: "Beri Masukan",
    formHint: "Sampaikan saran atau kendala untuk tim pengembang.",
    titleLabel: "Topik",
    titlePlaceholder: "Contoh: Tampilan di HP",
    detailLabel: "Pesan masukan",
    detailPlaceholder: "Tulis masukan Anda",
    button: "Kirim Masukan",
    success: "Masukan terkirim. Terima kasih!",
    listTitle: "Masukan Terkirim",
    withDate: false,
    empty: "Belum ada masukan.",
  },
  kegiatan: {
    label: "Info Kegiatan",
    formTitle: "Tambah Info Kegiatan",
    formHint: "Bagikan jadwal kegiatan sekolah secara singkat.",
    titleLabel: "Nama kegiatan",
    titlePlaceholder: "Contoh: Lomba Karya Ilmiah",
    detailLabel: "Keterangan singkat",
    detailPlaceholder: "Tempat, waktu, atau catatan penting",
    button: "Tambahkan Kegiatan",
    success: "Info kegiatan berhasil ditambahkan.",
    listTitle: "Info Kegiatan",
    withDate: true,
    empty: "Belum ada info kegiatan.",
  },
};

const EMPTY_FORM = { title: "", detail: "", date: "" };

// Foto profil disimpan di Supabase Storage (bucket publik "avatars")
const AVATAR_BUCKET = "avatars";
const MAX_AVATAR_MB = 2;

// Foto kiriman (berita / kegiatan / masukan) disimpan di bucket "post-images"
const POST_BUCKET = "post-images";
const MAX_POST_PHOTO_MB = 3;
const PHOTO_TYPES = ["image/png", "image/jpeg", "image/webp"];
const PHOTO_EXTENSIONS: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

// ---- Nama tabel Supabase ----
// feedback : id, message, image_url, created_at                          (Masukan)
// events   : id, title, description, event_date, image_url, created_at   (Info Kegiatan)
// news     : tabel berita (kolom isi dideteksi otomatis, lihat newsPayloads)
const FEEDBACK_TABLE = "feedback";
const EVENTS_TABLE = "events";
const NEWS_TABLE = "news";

type EventRow = {
  id: string;
  title: string;
  description: string | null;
  event_date: string | null;
  image_url: string | null;
  created_at: string | null;
};

type FeedbackRow = {
  id: string;
  message: string;
  image_url: string | null;
  created_at: string | null;
};

const EVENT_COLUMNS =
  "id, title, description, event_date, image_url, created_at";
const FEEDBACK_COLUMNS = "id, message, image_url, created_at";

type Notice = { type: "success" | "error"; text: string };

function toLocalISO(d: Date) {
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

function todayISO() {
  return toLocalISO(new Date());
}

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Mengambil pesan error asli (termasuk error dari Supabase Storage)
function errorMessage(err: unknown) {
  if (err instanceof Error && err.message) return err.message;
  if (typeof err === "object" && err !== null && "message" in err) {
    const m = (err as { message?: unknown }).message;
    if (typeof m === "string" && m) return m;
  }
  return "";
}

// Menambahkan image_url ke data yang disimpan, hanya kalau ada fotonya
function withImage<T extends object>(payload: T, imageUrl: string | null) {
  return imageUrl ? { ...payload, image_url: imageUrl } : payload;
}

// Tabel feedback hanya punya kolom "message", jadi topik + isi digabung
// dengan pemisah baris baru, lalu dipisah lagi saat ditampilkan.
function buildMessage(title: string, detail: string) {
  return `${title}\n${detail}`;
}

function parseFeedback(row: FeedbackRow): DashboardEntry {
  const idx = row.message.indexOf("\n");
  const title = idx === -1 ? "Masukan" : row.message.slice(0, idx).trim();
  const detail = idx === -1 ? row.message : row.message.slice(idx + 1).trim();

  return {
    id: row.id,
    title: title || "Masukan",
    detail,
    date: row.created_at ? toLocalISO(new Date(row.created_at)) : todayISO(),
    imageUrl: row.image_url,
  };
}

function parseEvent(row: EventRow): DashboardEntry {
  return {
    id: row.id,
    title: row.title,
    detail: row.description ?? "",
    date:
      row.event_date ??
      (row.created_at ? toLocalISO(new Date(row.created_at)) : todayISO()),
    imageUrl: row.image_url,
  };
}

// Tabel news bisa punya nama kolom isi yang berbeda-beda,
// jadi dibaca secara fleksibel.
function parseNews(row: Record<string, unknown>): DashboardEntry {
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  const detail =
    str(row.content) ||
    str(row.body) ||
    str(row.isi) ||
    str(row.description) ||
    str(row.detail) ||
    "";
  const rawDate =
    str(row.event_date) ||
    str(row.published_at) ||
    str(row.date) ||
    str(row.created_at);

  return {
    id: String(row.id ?? Date.now()),
    title: str(row.title) || "Tanpa judul",
    detail,
    date: rawDate ? toLocalISO(new Date(rawDate)) : todayISO(),
    imageUrl: str(row.image_url) || null,
  };
}

// Mencoba beberapa kemungkinan nama kolom isi sampai ada yang cocok
// dengan struktur tabel news.
function newsPayloads(title: string, detail: string, imageUrl: string | null) {
  return [
    { title, content: detail, category: BERITA_CATEGORY },
    { title, content: detail },
    { title, body: detail, category: BERITA_CATEGORY },
    { title, body: detail },
    { title, isi: detail },
    { title, detail },
    { title, description: detail },
  ].map((payload) => withImage(payload, imageUrl));
}

// Mengunggah foto kiriman ke Storage, mengembalikan alamat publiknya
async function uploadPostPhoto(
  supabase: ReturnType<typeof createClient>,
  file: File,
) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    throw userError ?? new Error("Sesi login tidak ditemukan.");
  }

  const ext = PHOTO_EXTENSIONS[file.type] ?? "jpg";
  const random = Math.random().toString(36).slice(2, 8);
  const path = `${userData.user.id}/${Date.now()}-${random}.${ext}`;

  const { error } = await supabase.storage
    .from(POST_BUCKET)
    .upload(path, file, { contentType: file.type });
  if (error) throw error;

  return supabase.storage.from(POST_BUCKET).getPublicUrl(path).data.publicUrl;
}

type IconName =
  | "berita"
  | "masukan"
  | "kegiatan"
  | "logout"
  | "plus"
  | "check"
  | "camera"
  | "image"
  | "close"
  | "alert";

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    berita: (
      <>
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
        <path d="M18 14h-8" />
        <path d="M15 18h-5" />
        <path d="M10 6h8v4h-8V6Z" />
      </>
    ),
    masukan: (
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    ),
    kegiatan: (
      <>
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </>
    ),
    logout: (
      <>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="m16 17 5-5-5-5" />
        <path d="M21 12H9" />
      </>
    ),
    plus: <path d="M5 12h14M12 5v14" />,
    check: <path d="M20 6 9 17l-5-5" />,
    camera: (
      <>
        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
        <circle cx="12" cy="13" r="3" />
      </>
    ),
    image: (
      <>
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
      </>
    ),
    close: <path d="M18 6 6 18M6 6l12 12" />,
    alert: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4M12 16h.01" />
      </>
    ),
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

type Props = {
  userName?: string;
  roleLabel?: string;
  isAdmin?: boolean;
  berita?: DashboardEntry[];
  kegiatan?: DashboardEntry[];
  masukan?: DashboardEntry[];
};

export default function DashboardView({
  userName = "Pengguna",
  roleLabel = "Guru / Tenaga Pendidik",
  berita = [],
  kegiatan = [],
  masukan = [],
}: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const postPhotoRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<TabKey>("berita");
  const [entries, setEntries] = useState<Record<TabKey, DashboardEntry[]>>({
    berita,
    masukan,
    kegiatan,
  });
  const [form, setForm] = useState(EMPTY_FORM);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [viewImage, setViewImage] = useState<{
    url: string;
    title: string;
  } | null>(null);

  const config = TABS[tab];
  const list = entries[tab];
  const initial = userName.trim().charAt(0).toUpperCase() || "P";

  // pesan hilang otomatis (error lebih lama supaya sempat dibaca)
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(
      () => setNotice(null),
      notice.type === "error" ? 6000 : 3000,
    );
    return () => clearTimeout(timer);
  }, [notice]);

  // ambil foto profil yang tersimpan di akun
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      const url = data.user?.user_metadata?.avatar_url;
      if (typeof url === "string" && url) setAvatarUrl(url);
    });
  }, []);

  // ambil info kegiatan, masukan, dan foto berita dari Supabase
  useEffect(() => {
    let active = true;
    const supabase = createClient();
    const newsIds = berita.map((b) => b.id);

    Promise.all([
      supabase
        .from(EVENTS_TABLE)
        .select(EVENT_COLUMNS)
        .order("event_date", { ascending: false }),
      supabase
        .from(FEEDBACK_TABLE)
        .select(FEEDBACK_COLUMNS)
        .order("created_at", { ascending: false }),
      newsIds.length > 0
        ? supabase.from(NEWS_TABLE).select("id, image_url").in("id", newsIds)
        : Promise.resolve({ data: null, error: null }),
    ]).then(([eventsRes, feedbackRes, newsRes]) => {
      if (!active) return;

      // foto untuk berita yang dimuat dari server
      const imageMap = new Map<string, string | null>();
      if (!newsRes.error && Array.isArray(newsRes.data)) {
        for (const row of newsRes.data as {
          id: string | number;
          image_url: string | null;
        }[]) {
          imageMap.set(String(row.id), row.image_url);
        }
      }

      setEntries((prev) => ({
        ...prev,
        berita: prev.berita.map((item) => ({
          ...item,
          imageUrl: item.imageUrl ?? imageMap.get(String(item.id)) ?? null,
        })),
        kegiatan:
          !eventsRes.error && eventsRes.data
            ? (eventsRes.data as EventRow[]).map(parseEvent)
            : prev.kegiatan,
        masukan:
          !feedbackRes.error && feedbackRes.data
            ? (feedbackRes.data as FeedbackRow[]).map(parseFeedback)
            : prev.masukan,
      }));
    });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // pesan error foto profil hilang otomatis
  useEffect(() => {
    if (!avatarError) return;
    const timer = setTimeout(() => setAvatarError(null), 6000);
    return () => clearTimeout(timer);
  }, [avatarError]);

  // tutup tampilan foto besar dengan tombol Escape
  useEffect(() => {
    if (!viewImage) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setViewImage(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewImage]);

  const clearPhoto = () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const handleTab = (key: TabKey) => {
    setTab(key);
    setForm(EMPTY_FORM);
    setNotice(null);
    clearPhoto();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // supaya file yang sama bisa dipilih lagi
    if (!file) return;

    if (!PHOTO_TYPES.includes(file.type)) {
      setNotice({
        type: "error",
        text: "Foto harus berformat JPG, PNG, atau WebP.",
      });
      return;
    }
    if (file.size > MAX_POST_PHOTO_MB * 1024 * 1024) {
      setNotice({
        type: "error",
        text: `Ukuran foto maksimal ${MAX_POST_PHOTO_MB} MB.`,
      });
      return;
    }

    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setNotice(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const title = form.title.trim();
    const detail = form.detail.trim();
    if (!title || !detail) return;

    const fail = (text: string) => setNotice({ type: "error", text });
    const done = () => {
      setForm(EMPTY_FORM);
      clearPhoto();
      setNotice({ type: "success", text: config.success });
    };

    setSubmitting(true);
    try {
      const supabase = createClient();

      // ---- Unggah foto lebih dulu (kalau ada) ----
      let imageUrl: string | null = null;
      if (photoFile) {
        try {
          imageUrl = await uploadPostPhoto(supabase, photoFile);
        } catch (err) {
          const msg = errorMessage(err);
          fail(
            msg ? `Gagal mengunggah foto: ${msg}` : "Gagal mengunggah foto.",
          );
          return;
        }
      }

      // ---- Tab Masukan -> tabel feedback ----
      if (tab === "masukan") {
        const { data, error } = await supabase
          .from(FEEDBACK_TABLE)
          .insert(withImage({ message: buildMessage(title, detail) }, imageUrl))
          .select(FEEDBACK_COLUMNS)
          .single();

        if (error || !data) {
          fail(error?.message || "Gagal mengirim masukan. Coba lagi.");
          return;
        }

        const entry = parseFeedback(data as FeedbackRow);
        setEntries((prev) => ({ ...prev, masukan: [entry, ...prev.masukan] }));
        done();
        return;
      }

      // ---- Tab Info Kegiatan -> tabel events ----
      if (tab === "kegiatan") {
        const { data, error } = await supabase
          .from(EVENTS_TABLE)
          .insert(
            withImage(
              {
                title,
                description: detail,
                event_date: form.date || todayISO(),
              },
              imageUrl,
            ),
          )
          .select(EVENT_COLUMNS)
          .single();

        if (error || !data) {
          fail(error?.message || "Gagal menyimpan kegiatan. Coba lagi.");
          return;
        }

        const entry = parseEvent(data as EventRow);
        setEntries((prev) => ({
          ...prev,
          kegiatan: [entry, ...prev.kegiatan],
        }));
        done();
        return;
      }

      // ---- Tab Berita -> tabel news ----
      let saved: Record<string, unknown> | null = null;
      let lastError: string | null = null;

      for (const payload of newsPayloads(title, detail, imageUrl)) {
        const { data, error } = await supabase
          .from(NEWS_TABLE)
          .insert(payload as any)
          .select("*")
          .single();

        if (!error && data) {
          saved = data as Record<string, unknown>;
          break;
        }
        lastError = error?.message ?? null;
        // masalah di kolom foto, tidak perlu mencoba kolom isi lainnya
        if (lastError?.includes("image_url")) break;
      }

      if (!saved) {
        fail(lastError || "Gagal menyimpan berita. Coba lagi.");
        return;
      }

      const entry = parseNews(saved);
      // pastikan judul, isi, dan foto yang tampil sesuai yang baru diketik
      const merged: DashboardEntry = {
        ...entry,
        title: entry.title === "Tanpa judul" ? title : entry.title,
        detail: entry.detail || detail,
        imageUrl: entry.imageUrl || imageUrl,
      };

      setEntries((prev) => ({ ...prev, berita: [merged, ...prev.berita] }));
      done();
    } finally {
      setSubmitting(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // supaya file yang sama bisa dipilih lagi
    if (!file) return;

    setAvatarError(null);

    if (!file.type.startsWith("image/")) {
      setAvatarError("File harus berupa gambar.");
      return;
    }
    if (file.size > MAX_AVATAR_MB * 1024 * 1024) {
      setAvatarError(`Ukuran foto maksimal ${MAX_AVATAR_MB} MB.`);
      return;
    }

    const previous = avatarUrl;
    setUploading(true);
    setAvatarUrl(URL.createObjectURL(file)); // pratinjau langsung

    try {
      const supabase = createClient();
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData.user) {
        throw userError ?? new Error("Sesi login tidak ditemukan.");
      }

      // satu file per pengguna, ditimpa setiap kali ganti foto
      const path = `${userData.user.id}/avatar`;
      const { error: uploadError } = await supabase.storage
        .from(AVATAR_BUCKET)
        .upload(path, file, { upsert: true, contentType: file.type });
      if (uploadError) throw uploadError;

      const { data: pub } = supabase.storage
        .from(AVATAR_BUCKET)
        .getPublicUrl(path);
      // ?v= supaya browser tidak memakai foto lama dari cache
      const url = `${pub.publicUrl}?v=${Date.now()}`;

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: url },
      });
      if (updateError) throw updateError;

      setAvatarUrl(url);
    } catch (err) {
      setAvatarUrl(previous);
      const msg = errorMessage(err);
      setAvatarError(
        msg ? `Gagal mengunggah foto: ${msg}` : "Gagal mengunggah foto.",
      );
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  };

  return (
    <div className="db-page">
      <div className="db-shell">
        {/* Sidebar */}
        <aside className="db-sidebar">
          <div className="db-brand">
            <img
              className="db-brand-logo"
              src="/tth.png"
              alt="Logo SMK Telekomunikasi Tunas Harapan"
            />
            <div>
              <p className="db-brand-name">SMK Telekomunikasi Tunas Harapan</p>
              <p className="db-brand-role">{roleLabel}</p>
            </div>
          </div>

          <nav className="db-nav" aria-label="Menu dashboard">
            {(Object.keys(TABS) as TabKey[]).map((key) => (
              <button
                key={key}
                type="button"
                className={`db-nav-item${tab === key ? " is-active" : ""}`}
                onClick={() => handleTab(key)}
                aria-current={tab === key ? "page" : undefined}
              >
                <span className="db-nav-icon">
                  <Icon name={key} />
                </span>
                {TABS[key].label}
              </button>
            ))}
          </nav>

          <button
            type="button"
            className="db-logout"
            onClick={handleLogout}
            disabled={loggingOut}
            aria-label="Keluar"
          >
            <Icon name="logout" />
            <span className="db-logout-text">
              {loggingOut ? "Keluar..." : "Keluar"}
            </span>
          </button>
        </aside>

        {/* Konten utama */}
        <main className="db-main">
          <header className="db-topbar">
            <div>
              <h1 className="db-title">Selamat datang, {userName}</h1>
              <p className="db-subtitle">
                Tambahkan berita, kirim masukan, atau bagikan info kegiatan
                sekolah.
              </p>
            </div>
            <div className="db-user">
              <button
                type="button"
                className="db-avatar"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                aria-label="Ganti foto profil"
                title="Ganti foto profil"
              >
                {avatarUrl ? (
                  <img
                    className="db-avatar-img"
                    src={avatarUrl}
                    alt="Foto profil"
                  />
                ) : (
                  initial
                )}
                <span className="db-avatar-edit">
                  <Icon name="camera" />
                </span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                hidden
                onChange={handleAvatarChange}
              />
              <span>
                <span className="db-user-name">{userName}</span>
                <span className="db-user-role">{roleLabel}</span>
                {avatarError && (
                  <span className="db-user-error" role="alert">
                    {avatarError}
                  </span>
                )}
              </span>
            </div>
          </header>

          <div className="db-content" key={tab}>
            {/* Form tambah */}
            <section className="db-card db-form-card">
              <div className="db-card-head">
                <span className="db-card-icon">
                  <Icon name={tab} />
                </span>
                <div>
                  <h2 className="db-card-title">{config.formTitle}</h2>
                  <p className="db-card-hint">{config.formHint}</p>
                </div>
              </div>

              <form className="db-form" onSubmit={handleSubmit}>
                <div className={`db-field${config.withDate ? "" : " is-wide"}`}>
                  <label className="db-label" htmlFor="title">
                    {config.titleLabel}
                  </label>
                  <input
                    className="db-input"
                    type="text"
                    id="title"
                    name="title"
                    placeholder={config.titlePlaceholder}
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                {config.withDate && (
                  <div className="db-field">
                    <label className="db-label" htmlFor="date">
                      Tanggal kegiatan
                    </label>
                    <input
                      className="db-input"
                      type="date"
                      id="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}

                <div className="db-field is-wide">
                  <label className="db-label" htmlFor="detail">
                    {config.detailLabel}
                  </label>
                  <textarea
                    className="db-textarea"
                    id="detail"
                    name="detail"
                    placeholder={config.detailPlaceholder}
                    value={form.detail}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Foto (opsional) */}
                <div className="db-field is-wide">
                  <span className="db-label">Foto (opsional)</span>
                  {photoPreview ? (
                    <div className="db-photo-preview">
                      <img src={photoPreview} alt="Pratinjau foto" />
                      <button
                        type="button"
                        className="db-photo-remove"
                        onClick={clearPhoto}
                        aria-label="Hapus foto"
                      >
                        <Icon name="close" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="db-photo-drop"
                      onClick={() => postPhotoRef.current?.click()}
                    >
                      <Icon name="image" />
                      <span>Tambah foto</span>
                      <small>
                        JPG, PNG, atau WebP, maksimal {MAX_POST_PHOTO_MB} MB
                      </small>
                    </button>
                  )}
                  <input
                    ref={postPhotoRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    hidden
                    onChange={handlePhotoChange}
                  />
                </div>

                <div className="db-actions">
                  {notice && (
                    <span
                      className={`db-notice${notice.type === "error" ? " is-error" : ""}`}
                      role={notice.type === "error" ? "alert" : "status"}
                    >
                      <Icon
                        name={notice.type === "error" ? "alert" : "check"}
                      />
                      {notice.text}
                    </span>
                  )}
                  <button
                    type="submit"
                    className="db-submit"
                    disabled={submitting}
                  >
                    <Icon name="plus" />
                    {submitting ? "Mengirim..." : config.button}
                  </button>
                </div>
              </form>
            </section>

            {/* Daftar */}
            <section className="db-card db-list-card">
              <div className="db-card-head">
                <h2 className="db-card-title">{config.listTitle}</h2>
                <span className="db-count">{list.length} data</span>
              </div>

              {list.length === 0 ? (
                <div className="db-empty">{config.empty}</div>
              ) : (
                <>
                  <div className="db-list-head" aria-hidden="true">
                    <span>{config.titleLabel}</span>
                    <span>{config.detailLabel}</span>
                    <span>
                      {config.withDate ? "Tanggal kegiatan" : "Tanggal"}
                    </span>
                  </div>
                  <ul className="db-list">
                    {list.map((item, i) => {
                      const imageUrl = item.imageUrl;
                      return (
                        <li
                          key={item.id}
                          className="db-row"
                          style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}
                        >
                          <div className="db-row-main">
                            {imageUrl && (
                              <button
                                type="button"
                                className="db-thumb"
                                onClick={() =>
                                  setViewImage({
                                    url: imageUrl,
                                    title: item.title,
                                  })
                                }
                                aria-label={`Lihat foto: ${item.title}`}
                              >
                                <img src={imageUrl} alt="" loading="lazy" />
                              </button>
                            )}
                            <strong className="db-row-title">
                              {item.title}
                            </strong>
                          </div>
                          <span className="db-row-detail">{item.detail}</span>
                          <time className="db-row-date" dateTime={item.date}>
                            {formatDate(item.date)}
                          </time>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
            </section>
          </div>
        </main>
      </div>

      {/* Foto ukuran besar */}
      {viewImage && (
        <div
          className="db-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={viewImage.title}
          onClick={() => setViewImage(null)}
        >
          <figure
            className="db-lightbox-box"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={viewImage.url} alt={viewImage.title} />
            <figcaption>{viewImage.title}</figcaption>
            <button
              type="button"
              className="db-lightbox-close"
              onClick={() => setViewImage(null)}
              aria-label="Tutup foto"
            >
              <Icon name="close" />
            </button>
          </figure>
        </div>
      )}
    </div>
  );
}
