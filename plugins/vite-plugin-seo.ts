/**
 * Generates every SEO surface from [src/data/seo.ts](../src/data/seo.ts).
 *
 *   build  — injects <head> tags into index.html, emits robots.txt,
 *            sitemap.xml and llms.txt into dist/
 *   dev    — serves the same three files from memory, so what you test at
 *            localhost is what ships
 *
 * Nothing here is site-specific. Clone the repo, edit seo.ts, and this file
 * keeps working untouched.
 */

import { existsSync } from "node:fs";
import { resolve } from "node:path";
import type { Plugin } from "vite";
import {
  SITE,
  buildHeadTags,
  buildLlmsTxt,
  buildRobotsTxt,
  buildSitemap,
} from "../src/data/seo.ts";

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

      // Always announce the origin being baked in. A clone that forgets to
      // change SITE.url would point its canonical, og:url and sitemap at the
      // domain it was copied from, which reads to Google as "the other site is
      // the original" — the one SEO mistake here that is both silent and fatal.
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
      handler: (html) => ({
        // Keeps <html lang> honest when a clone changes SITE.lang, so the
        // declared language cannot drift from the one in the schema and OG tags.
        html: html.replace(/(<html[^>]*\slang=")[^"]*(")/i, `$1${SITE.lang}$2`),
        // Explicit injectTo on every tag, so nothing lands ahead of the charset
        // declaration that has to stay inside the first 1024 bytes.
        tags: buildHeadTags().map((tag) => ({
          ...tag,
          injectTo: tag.injectTo ?? ("head" as const),
        })),
      }),
    },

    // Dev parity: without this, /robots.txt 404s locally and only appears
    // after a production build, which is exactly when nobody checks it.
    configureServer(server) {
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
