import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { seo } from './plugins/vite-plugin-seo.ts'

export default defineConfig({
  plugins: [react(), seo()],
})
