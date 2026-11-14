import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // GitHub Pages serves this project from /ice-smp-tierboard/;
  // Vercel serves it from the domain root.
  base: process.env.GITHUB_ACTIONS ? '/ice-smp-tierboard/' : '/',
  plugins: [react(), tailwindcss()],
})
