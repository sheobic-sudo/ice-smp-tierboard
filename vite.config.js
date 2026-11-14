import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Relative asset paths work on both GitHub Pages project URLs and Vercel.
  base: './',
  plugins: [react(), tailwindcss()],
})
