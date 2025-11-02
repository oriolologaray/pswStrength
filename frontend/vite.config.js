import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use BASE_PATH env for GitHub Pages ("/repo/" for project pages, "/" for user pages)
const base = process.env.BASE_PATH || '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
})
