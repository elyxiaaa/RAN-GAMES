import { readFileSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");
const htmlPath = resolve(root, "dist/index.html");
const serverEntry = resolve(root, "dist-ssr/entry-server.js");
const MOUNT = '<div id="root"></div>';

if (!existsSync(htmlPath)) {
  throw new Error("dist/index.html is missing. Run the client build first.");
}
if (!existsSync(serverEntry)) {
  throw new Error("dist-ssr/entry-server.js is missing. Run the SSR build first.");
}

const { render } = await import(pathToFileURL(serverEntry).href);
const markup = render();

if (!markup || markup.length < 500) {
  throw new Error(
    `Prerender produced ${markup?.length ?? 0} characters, which cannot be the whole page. ` +
      "Refusing to ship a stub.",
  );
}

const html = readFileSync(htmlPath, "utf8");

if (!html.includes(MOUNT)) {
  throw new Error(`Could not find ${MOUNT} in dist/index.html.`);
}

writeFileSync(
  htmlPath,
  html.replace(MOUNT, `<div id="root">${markup}</div>`),
  "utf8",
);

rmSync(resolve(root, "dist-ssr"), { recursive: true, force: true });

const kb = (Buffer.byteLength(markup, "utf8") / 1024).toFixed(1);
console.log(`prerender: injected ${kb} kB of markup into dist/index.html`);
