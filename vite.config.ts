import { resolve } from 'node:path'
import { defineConfig, loadEnv, type ProxyOptions } from 'vite'
import react from '@vitejs/plugin-react'
import { seo } from './plugins/vite-plugin-seo.ts'

/** Matches the fallback in functions/api/stats.ts. */
const DEFAULT_STATS_UPSTREAM = 'http://egames.ran-services.com/api/stats'

// One HTML entry per route. Each is prerendered by scripts/prerender.mjs after
// the client build, so /ranking ships as a real document, not a client redirect.
//
// Flat files, not folders: Cloudflare serves ranking.html at /ranking, while a
// ranking/index.html would only be reachable at /ranking/ with a redirect hop.
export default defineConfig(({ isSsrBuild, mode }) => {
  // Read with an empty prefix so the two STATS_ names are visible here without
  // being VITE_-prefixed, which would inline the token into the client bundle.
  const env = loadEnv(mode, import.meta.dirname, '')

  const upstream = new URL(env.STATS_API_URL || DEFAULT_STATS_UPSTREAM)
  if (env.STATS_API_TOKEN) {
    upstream.searchParams.set('apiToken', env.STATS_API_TOKEN)
  }

  // Stands in for functions/api/stats.ts, which only runs on Cloudflare Pages.
  // Both answer /api/stats, so the frontend needs no notion of environment.
  const proxy: Record<string, ProxyOptions> = {
    '/api/stats': {
      target: upstream.origin,
      changeOrigin: true,
      rewrite: () => `${upstream.pathname}${upstream.search}`,
    },
  }

  return {
    plugins: [react(), seo()],
    server: { proxy },
    preview: { proxy },
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
  }
})
