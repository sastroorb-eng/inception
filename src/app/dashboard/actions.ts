"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import type { Profile } from "@/utils/supabase/database.types";
import { BERITA_CATEGORY, KEGIATAN_CATEGORY, type ActionState } from "./shared";

const ok: ActionState = { success: "ok" };

type StaffCtx = {
  supabase: ReturnType<typeof createClient>;
  user: { id: string; email?: string };
  profile: Pick<Profile, "role" | "full_name"> | null;
};

async function requireStaff(): Promise<StaffCtx> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("user_id", user.id)
    .maybeSingle();

  return { supabase, user, profile: profile ?? null };
}

async function requireAdmin(): Promise<StaffCtx> {
  const ctx = await requireStaff();
  if (ctx.profile?.role !== "admin") {
    throw new Error("Akses khusus administrator.");
  }
  return ctx;
}

function text(formData: FormData, key: string): string {
  return formData.get(key)?.toString().trim() ?? "";
}

// `slug` punya unique constraint, jadi hasil kosong akan menggagalkan insert.
function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return base || `post-${Date.now().toString(36)}`;
}

// "YYYY-MM-DD" -> timestamptz. Nilai tidak valid dibuang agar server yang
// memutuskan, bukan input pengguna.
function toTimestamp(date: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const parsed = new Date(`${date}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

export async function signOutAction(): Promise<void> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  await supabase.auth.signOut();
  redirect("/login");
}

export async function saveNewsPost(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { supabase, user } = await requireStaff();

  const title = text(formData, "title");
  const body = text(formData, "detail");
  if (!title) return { error: "Judul wajib diisi." };
  if (!body) return { error: "Isi wajib diisi." };

  const category = text(formData, "category") || BERITA_CATEGORY;
  // Tab kegiatan bisa memilih tanggal; berita terbit sekarang.
  const publishedAt =
    category === KEGIATAN_CATEGORY
      ? (toTimestamp(text(formData, "date")) ?? new Date().toISOString())
      : new Date().toISOString();

  let slug = text(formData, "slug") || slugify(title);

  const { data: clash } = await supabase
    .from("news_posts")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (clash) slug = `${slug}-${Date.now().toString(36)}`;

  const { error } = await supabase.from("news_posts").insert({
    title,
    slug,
    excerpt: null,
    body,
    category,
    status: "published",
    published_at: publishedAt,
    author_id: user.id,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return ok;
}

export async function deleteNewsPost(
  id: string,
  _formData: FormData,
): Promise<void> {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from("news_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
}

export async function saveMessage(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { supabase, user, profile } = await requireStaff();

  const subject = text(formData, "title");
  const body = text(formData, "detail");
  if (!subject) return { error: "Topik wajib diisi." };
  if (!body) return { error: "Pesan wajib diisi." };

  const { error } = await supabase.from("messages").insert({
    name: profile?.full_name?.trim() || user.email || "Tanpa nama",
    email: user.email ?? "",
    subject,
    body,
    is_read: false,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return ok;
}

export async function markMessageRead(
  id: string,
  isRead: boolean,
  _formData: FormData,
): Promise<void> {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("messages")
    .update({ is_read: isRead })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
}

export async function deleteMessage(
  id: string,
  _formData: FormData,
): Promise<void> {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from("messages").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
}

export async function saveStudent(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { supabase } = await requireStaff();

  const id = text(formData, "id");
  const payload = {
    nis: text(formData, "nis"),
    nisn: text(formData, "nisn") || null,
    full_name: text(formData, "full_name"),
    gender: (text(formData, "gender") || null) as "L" | "P" | null,
    class_id: text(formData, "class_id") || null,
    parent_name: text(formData, "parent_name") || null,
    parent_phone: text(formData, "parent_phone") || null,
    status: (text(formData, "status") || "aktif") as
      | "aktif"
      | "lulus"
      | "pindah"
      | "keluar",
  };

  if (!payload.nis || !payload.full_name) {
    return { error: "NIS dan nama wajib diisi." };
  }

  const query = id
    ? supabase.from("students").update(payload).eq("id", id)
    : supabase.from("students").insert(payload);

  const { error } = await query;
  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return ok;
}

export async function deleteStudent(
  id: string,
  _formData: FormData,
): Promise<void> {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from("students").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
}

export async function saveSetting(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { supabase } = await requireAdmin();

  const key = text(formData, "key");
  if (!key) return { error: "Kunci pengaturan tidak valid." };

  const { error } = await supabase
    .from("school_settings")
    .upsert({ key, value: text(formData, "value") }, { onConflict: "key" });

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return ok;
}
