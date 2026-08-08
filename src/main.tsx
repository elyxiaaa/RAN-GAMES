import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource-variable/oswald";
import "@fontsource-variable/ibm-plex-sans";
import "./index.css";
import App from "./App.tsx";

const container = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

/**
 * Production HTML arrives prerendered (see scripts/prerender.mjs) and is
 * hydrated in place. The dev server serves an empty shell, which is mounted
 * normally.
 *
 * The one case that cannot hydrate is a visitor with reduced motion enabled.
 * Motion reads that preference during render and reports null on the server,
 * so the tree branches differently on the client from the very first pass —
 * the hero swaps its background video for a still, among other things. That is
 * a genuine mismatch, not a bug to paper over, so it is detected up front and
 * the root is mounted fresh instead of surfacing as a hydration error.
 */
const prefersReducedMotion =
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

if (container.hasChildNodes() && !prefersReducedMotion) {
  hydrateRoot(container, app);
} else {
  container.replaceChildren();
  createRoot(container).render(app);
}
