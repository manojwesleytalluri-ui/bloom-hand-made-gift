import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// Use "/" base on Vercel/Render (cloud), "/bloom-hand-made-gift/" on GitHub Pages (local build)
const isCloudDeploy = process.env.VERCEL || process.env.RENDER || process.env.CI;

export default defineConfig({
  base: isCloudDeploy ? "/" : "/bloom-hand-made-gift/",
  plugins: [
    react(),
    tailwindcss(),
  ],
})
