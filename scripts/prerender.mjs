import { readFileSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");
const serverEntry = resolve(root, "dist-ssr/entry-server.js");
const MOUNT = '<div id="root"></div>';

const ROUTES = [
  { path: "/", file: "dist/index.html" },
  { path: "/ranking", file: "dist/ranking.html" },
];

if (!existsSync(serverEntry)) {
  throw new Error("dist-ssr/entry-server.js is missing. Run the SSR build first.");
}

const { render } = await import(pathToFileURL(serverEntry).href);

for (const route of ROUTES) {
  const htmlPath = resolve(root, route.file);

  if (!existsSync(htmlPath)) {
    throw new Error(`${route.file} is missing. Run the client build first.`);
  }

  const markup = render(route.path);

  if (!markup || markup.length < 500) {
    throw new Error(
      `Prerender of ${route.path} produced ${markup?.length ?? 0} characters, ` +
        "which cannot be the whole page. Refusing to ship a stub.",
    );
  }

  const html = readFileSync(htmlPath, "utf8");

  if (!html.includes(MOUNT)) {
    throw new Error(`Could not find ${MOUNT} in ${route.file}.`);
  }

  writeFileSync(
    htmlPath,
    html.replace(MOUNT, `<div id="root">${markup}</div>`),
    "utf8",
  );

  const kb = (Buffer.byteLength(markup, "utf8") / 1024).toFixed(1);
  console.log(`prerender: ${route.path} -> ${route.file}, ${kb} kB of markup`);
}

rmSync(resolve(root, "dist-ssr"), { recursive: true, force: true });
