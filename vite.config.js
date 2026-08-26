import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages serves this from a /upscale-app/ subpath; Vercel serves it
// from the domain root. The deploy workflow sets VITE_BASE_PATH for Pages
// builds only, so Vercel builds (no env var set) default to '/'.
// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react(), tailwindcss()],
})
