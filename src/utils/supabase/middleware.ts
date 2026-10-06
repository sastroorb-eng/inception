import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const createClient = (request: NextRequest) => {
  // Response yang belum dimodifikasi, dipakai sebagai fallback.
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  return { supabase, supabaseResponse };
};

export const updateSession = async (request: NextRequest) => {
  const { supabase, supabaseResponse } = createClient(request);

  // WAJIB: jangan dihapus. Memanggil getUser() me-refresh token agar sesi
  // tetap valid sepanjang halaman.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, supabaseResponse, user };
};
