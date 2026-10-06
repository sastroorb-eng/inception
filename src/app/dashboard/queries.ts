import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { Message, NewsPost, Profile } from "@/utils/supabase/database.types";
import { KEGIATAN_CATEGORY, type DashboardData, type DashboardEntry } from "./shared";

const EMPTY: DashboardData = {
  userId: null,
  profile: null,
  isAdmin: false,
  berita: [],
  kegiatan: [],
  masukan: [],
};

// timestamptz -> YYYY-MM-DD. Ambil bagian tanggalnya langsung supaya tidak
// bergeser sehari karena konversi timezone server.
function toISODate(value: string | null): string {
  if (!value) return new Date().toISOString().slice(0, 10);
  const match = /^(\d{4}-\d{2}-\d{2})/.exec(value);
  return match ? match[1] : new Date(value).toISOString().slice(0, 10);
}

function fromNewsPost(post: NewsPost): DashboardEntry {
  return {
    id: post.id,
    title: post.title,
    detail: post.excerpt?.trim() || post.body,
    date: toISODate(post.published_at),
  };
}

function fromMessage(message: Message): DashboardEntry {
  return {
    id: message.id,
    title: message.subject?.trim() || "(tanpa topik)",
    detail: message.body,
    date: toISODate(message.created_at),
    isUnread: !message.is_read,
  };
}

export async function getDashboardData(): Promise<DashboardData> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return EMPTY;

  const { data: profile } = (await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle()) as { data: Profile | null };

  const isAdmin = profile?.role === "admin";

  const [newsRes, messagesRes] = await Promise.all([
    supabase
      .from("news_posts")
      .select("*")
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(100),
    // RLS: `messages` hanya bisa dibaca oleh admin.
    isAdmin
      ? supabase
          .from("messages")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50)
      : Promise.resolve({ data: [] as Message[] | null }),
  ]);

  const news = (newsRes.data ?? []) as NewsPost[];

  return {
    userId: user.id,
    profile: profile ?? null,
    isAdmin,
    berita: news
      .filter((post) => post.category !== KEGIATAN_CATEGORY)
      .map(fromNewsPost),
    kegiatan: news
      .filter((post) => post.category === KEGIATAN_CATEGORY)
      .map(fromNewsPost),
    masukan: ((messagesRes.data ?? []) as Message[]).map(fromMessage),
  };
}