import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' — чтобы собранный сайт открывался из любой папки и на любом хостинге
export default defineConfig({
  base: './',
  plugins: [react()],
})
