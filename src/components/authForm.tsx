"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

// Ikon mata (open = password sedang terlihat)
function EyeIcon({ open }: { open: boolean }) {
  return open ? (
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
      <path d="M9.9 4.24A9.1 9.1 0 0 1 12 4c6.5 0 10 8 10 8a13.2 13.2 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.5 13.5 0 0 0 2 12s3.5 8 10 8a9.7 9.7 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    </svg>
  ) : (
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
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: formData.email.trim(),
      password: formData.password,
    });

    if (authError) {
      setError(
        authError.message === "Invalid login credentials"
          ? "Email atau password salah."
          : authError.message,
      );
      setLoading(false);
      return;
    }

    const redirectTo = searchParams.get("redirectTo");
    router.replace(redirectTo?.startsWith("/") ? redirectTo : "/dashboard");
    router.refresh();
  };

  return (
    <div className="auth-page">
      {/* Foto latar halaman */}
      <img
        className="auth-page-bg"
        src="/asrama.png"
        alt=""
        aria-hidden="true"
      />

      <div className="auth-container">
        {/* Panel kiri: foto dengan tepi miring */}
        <aside className="auth-brand">
          <img
            className="brand-photo"
            src="/asrama.png"
            alt="Gedung SMK Telekomunikasi Tunas Harapan"
          />
          <p className="brand-welcome">Selamat datang di</p>
          <h1 className="brand-name">SMK Telekomunikasi Tunas Harapan</h1>
          <p className="brand-desc">
            Kelola data dan konten sekolah dengan mudah, cepat, dan aman.
          </p>
        </aside>

        {/* Panel kanan: form */}
        <div className="auth-panel">
          <div className="auth-header">
            <img
              className="auth-logo"
              src="/tth.png"
              alt="Logo SMK Telekomunikasi Tunas Harapan"
            />
            <h2>Portal Login Guru & Admin</h2>
            <p>Masuk untuk mengelola data dan konten sekolah</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="username"
                placeholder="nama@tth.sch.id"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Tampilkan password"
                  }
                  aria-pressed={showPassword}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Memproses..." : "Masuk ke Dashboard"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
