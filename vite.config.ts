import { resolve } from 'node:path'
import { defineConfig, loadEnv, type ProxyOptions } from 'vite'
import react from '@vitejs/plugin-react'
import { seo } from './plugins/vite-plugin-seo.ts'
import { ROUTES, UPSTREAM_ORIGIN, type Route } from './server/routes.ts'

// One HTML entry per route. Each is prerendered by scripts/prerender.mjs after
// the client build, so /ranking ships as a real document, not a client redirect.
//
// Flat files, not folders: Cloudflare serves ranking.html at /ranking, while a
// ranking/index.html would only be reachable at /ranking/ with a redirect hop.
export default defineConfig(({ isSsrBuild, mode }) => {
  // Read with an empty prefix so the two GAME_/STATS_ names are visible here
  // without a VITE_ prefix, which would inline the token into the client bundle.
  const env = loadEnv(mode, import.meta.dirname, '')

  const origin = env.GAME_API_ORIGIN || UPSTREAM_ORIGIN
  const token = env.STATS_API_TOKEN

  // Stands in for the Functions under functions/, which only run on Cloudflare.
  // Both read the same route table, so the parameters pinned and forwarded here
  // cannot drift from the ones production uses.
  //
  // It is a stand-in, not an equal: there is no edge cache and an unsupported
  // parameter is dropped rather than refused with a 400. Use
  // `npx wrangler pages dev dist` to exercise the real thing.
  const proxy: Record<string, ProxyOptions> = {}

  // Widened to Route: `satisfies` keeps each entry's literal type, so the
  // optional `match` and `upstream` fields are absent from the ones that omit
  // them and the loop below could not read them at all.
  for (const route of Object.values(ROUTES) as Route[]) {
    proxy[route.path] = {
      target: origin,
      changeOrigin: true,
      rewrite: (path) => {
        const incoming = new URL(path, 'http://proxy.invalid')
        const params = new URLSearchParams()

        for (const [name, values] of Object.entries(route.forward)) {
          // Widened: ROUTES keeps literal tuples, so `includes` would otherwise
          // demand an already-narrowed value rather than the raw query string.
          const allowed: readonly string[] = values
          const value = incoming.searchParams.get(name)
          if (value !== null && allowed.includes(value)) params.set(name, value)
        }

        for (const [name, pattern] of Object.entries(route.match ?? {})) {
          const value = incoming.searchParams.get(name)
          if (value !== null && pattern.test(value)) params.set(name, value)
        }

        for (const [name, value] of Object.entries(route.pinned)) {
          params.set(name, value)
        }

        if (token) params.set('apiToken', token)

        // The upstream path, which is not always ours: the emblem endpoint
        // is /api/GuildIcon there and /api/guild-icon here.
        return `${route.upstream ?? route.path}?${params.toString()}`
      },
    }
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
