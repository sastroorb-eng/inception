import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Tanpa baris ini Vite mencari config PostCSS sampai ke root repo, lalu memuat
  // postcss.config.mjs milik app Next tim (@tailwindcss/postcss) yang tidak ada di
  // node_modules Frondend -> build gagal. Tailwind di sini lewat plugin @tailwindcss/vite.
  css: { postcss: {} },
})