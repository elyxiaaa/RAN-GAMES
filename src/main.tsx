import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource-variable/oswald";
import "@fontsource-variable/ibm-plex-sans";
import "./index.css";
import App from "./App.tsx";
import { routeFromPath } from "./routes.ts";

const container = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App route={routeFromPath(window.location.pathname)} />
  </StrictMode>
);

const prefersReducedMotion =
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

if (container.hasChildNodes() && !prefersReducedMotion) {
  hydrateRoot(container, app);
} else {
  container.replaceChildren();
  createRoot(container).render(app);
}
