import { resolve } from 'node:path'
import { defineConfig, loadEnv, type ProxyOptions } from 'vite'
import react from '@vitejs/plugin-react'
import { seo } from './plugins/vite-plugin-seo.ts'
import {
  ROUTES,
  UPSTREAM_ORIGIN,
  UPSTREAM_TIMEOUT_MS,
  type Route,
} from './server/routes.ts'

export default defineConfig(({ isSsrBuild, mode }) => {
  const env = loadEnv(mode, import.meta.dirname, '')

  const origin = env.GAME_API_ORIGIN || UPSTREAM_ORIGIN
  const token = env.STATS_API_TOKEN

  const proxy: Record<string, ProxyOptions> = {}

  for (const route of Object.values(ROUTES) as Route[]) {
    proxy[route.path] = {
      target: origin,
      changeOrigin: true,
      timeout: UPSTREAM_TIMEOUT_MS,
      proxyTimeout: UPSTREAM_TIMEOUT_MS,
      selfHandleResponse: true,
      configure: (server) => {
        server.on('proxyRes', (upstreamRes, _req, res) => {
          const status = upstreamRes.statusCode ?? 502

          if (status >= 300 && status < 400) {
            res.writeHead(502, {
              'content-type': 'application/json; charset=utf-8',
              'cache-control': 'no-store',
            })
            res.end(
              JSON.stringify({
                success: false,
                error: 'Upstream redirected, which usually means it wants a login.',
              }),
            )
            upstreamRes.resume()
            return
          }

          res.writeHead(status, upstreamRes.headers)
          upstreamRes.pipe(res)
        })
      },
      rewrite: (path) => {
        const incoming = new URL(path, 'http://proxy.invalid')
        const params = new URLSearchParams()

        for (const [name, values] of Object.entries(route.forward)) {
          const allowed: readonly string[] = values
          const value = incoming.searchParams.get(name)
          if (value !== null && allowed.includes(value)) params.set(name, value)
        }

        for (const [name, value] of Object.entries(route.pinned)) {
          params.set(name, value)
        }

        if (token) params.set('apiToken', token)

        return `${route.path}?${params.toString()}`
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
