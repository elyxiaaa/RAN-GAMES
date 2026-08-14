import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { seo } from './plugins/vite-plugin-seo.ts'

// One HTML entry per route. Each is prerendered by scripts/prerender.mjs after
// the client build, so /ranking ships as a real document, not a client redirect.
//
// Flat files, not folders: Cloudflare serves ranking.html at /ranking, while a
// ranking/index.html would only be reachable at /ranking/ with a redirect hop.
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), seo()],
  build: isSsrBuild
    ? {}
    : {
        rollupOptions: {
          input: {
            main: resolve(import.meta.dirname, 'index.html'),
            ranking: resolve(import.meta.dirname, 'ranking.html'),
          },
        },
      },
}))
