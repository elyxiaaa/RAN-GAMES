/**
 * Server entry, used only by the build.
 *
 * `npm run build` renders this to a string and injects the result into
 * dist/index.html, so the shipped page carries real markup instead of an empty
 * <div id="root">. Googlebot renders JavaScript, but GPTBot, ClaudeBot,
 * PerplexityBot and OAI-SearchBot do not — without this step the site is a
 * blank page to every AI search surface.
 *
 * Nothing here touches the DOM. Every window/document access in the tree is
 * already inside a useEffect, which is why the app renders cleanly on Node.
 */

import { renderToString } from "react-dom/server";
import App from "./App.tsx";

export function render(): string {
  return renderToString(<App />);
}
