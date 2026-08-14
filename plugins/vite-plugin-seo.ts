import { existsSync } from "node:fs";
import { resolve } from "node:path";
import type { Plugin } from "vite";
import {
  SEO_ROUTES,
  SITE,
  buildHeadTags,
  buildLlmsTxt,
  buildRobotsTxt,
  buildSitemap,
} from "../src/data/seo.ts";

/**
 * Turns the HTML file being transformed into the route it serves, so each entry
 * gets its own title, canonical and structured data.
 *   /index.html   -> /
 *   /ranking.html -> /ranking
 *   /ranking      -> /ranking   (dev server request)
 */
function routeOf(htmlPath: string): string {
  const route = htmlPath
    .replace(/\?.*$/, "")
    .replace(/(index)?\.html$/, "")
    .replace(/\/+$/, "");
  return route || "/";
}

const GENERATED: Record<string, { type: string; build: () => string }> = {
  "robots.txt": { type: "text/plain; charset=utf-8", build: buildRobotsTxt },
  "sitemap.xml": { type: "application/xml; charset=utf-8", build: buildSitemap },
  "llms.txt": { type: "text/plain; charset=utf-8", build: buildLlmsTxt },
};

export function seo(): Plugin {
  let publicDir = "public";
  let isSsrBuild = false;

  return {
    name: "vite-plugin-seo",

    configResolved(config) {
      publicDir = config.publicDir;
      isSsrBuild = Boolean(config.build.ssr);

      if (config.command !== "build" || isSsrBuild) return;

      config.logger.info(`seo: baking canonical origin ${SITE.url}`);

      if (!/^https:\/\/[^/]+$/.test(SITE.url)) {
        this.warn(
          `SITE.url is "${SITE.url}". It must be an https origin with no trailing slash, ` +
            `or canonical, og:url and the sitemap will all point somewhere wrong.`,
        );
      }

      const ogPath = resolve(publicDir, SITE.ogImage.replace(/^\//, ""));
      if (!existsSync(ogPath)) {
        this.warn(
          `SITE.ogImage points at ${SITE.ogImage}, which is not in ${publicDir}. ` +
            `Social cards will render blank.`,
        );
      }
    },

    transformIndexHtml: {
      order: "pre",
      handler: (html, ctx) => ({
        html: html.replace(/(<html[^>]*\slang=")[^"]*(")/i, `$1${SITE.lang}$2`),
        tags: buildHeadTags(routeOf(ctx.path)).map((tag) => ({
          ...tag,
          injectTo: tag.injectTo ?? ("head" as const),
        })),
      }),
    },

    configureServer(server) {
      // Cloudflare serves ranking.html at the extension-less /ranking. The dev
      // server has no such rule, so map the bare path onto the file here and
      // keep both environments answering the same URL.
      const pages = SEO_ROUTES.map((route) => route.path).filter(
        (path) => path !== "/",
      );

      server.middlewares.use((req, _res, next) => {
        const [path, search = ""] = (req.url ?? "").split("?");
        if (pages.includes(path)) {
          req.url = `${path}.html${search ? `?${search}` : ""}`;
        }
        next();
      });

      server.middlewares.use((req, res, next) => {
        const name = (req.url ?? "").split("?")[0].replace(/^\//, "");
        const file = GENERATED[name];
        if (!file) return next();

        res.setHeader("Content-Type", file.type);
        res.end(file.build());
      });
    },

    generateBundle() {
      if (isSsrBuild) return;

      for (const [fileName, file] of Object.entries(GENERATED)) {
        this.emitFile({ type: "asset", fileName, source: file.build() });
      }
    },
  };
}
