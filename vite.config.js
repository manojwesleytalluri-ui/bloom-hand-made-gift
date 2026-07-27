import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// Use "/" base on Vercel (auto-detected via VERCEL env var), "/bloom-hand-made-gift/" on GitHub Pages
export default defineConfig({
  base: process.env.VERCEL ? "/" : "/bloom-hand-made-gift/",
  plugins: [
    react(),
    tailwindcss(),
  ],
})
