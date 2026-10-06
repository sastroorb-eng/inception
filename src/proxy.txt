import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

// Daftar halaman yang wajib login
const PROTECTED_PREFIXES = ["/dashboard"];
const AUTH_ROUTES = ["/login"];

export async function middleware(request: NextRequest) {
  // Mengecek sesi (session) user saat ini dari Supabase
  const { supabaseResponse, user } = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  // Cek apakah halaman yang sedang dibuka ada di daftar PROTECTED_PREFIXES
  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  // LOGIKA PENGAMAN: Jika mencoba masuk /dashboard TAPI belum login
  if (isProtected && !user) {
    // Lemparkan (redirect) paksa ke halaman login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // LOGIKA TAMBAHAN: Jika SUDAH login tapi malah buka /login lagi
  if (AUTH_ROUTES.includes(pathname) && user) {
    // Lemparkan langsung masuk ke dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return supabaseResponse;
}

// Konfigurasi ini memberi tahu Next.js di halaman mana saja middleware ini berjalan
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};