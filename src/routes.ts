/**
 * The site ships as prerendered HTML files, one per route, so navigation is
 * plain anchors and there is no client router. This module is the single place
 * that knows which path maps to which page.
 */

export type Route = "home" | "ranking";

export const ROUTE_PATH: Record<Route, string> = {
  home: "/",
  ranking: "/ranking",
};

export function routeFromPath(pathname: string): Route {
  return /^\/ranking(\/|\/index\.html)?$/.test(pathname) ? "ranking" : "home";
}

/** Prefix for in-page anchors, so shared chrome can link back to home sections. */
export function anchorBase(route: Route): string {
  return route === "home" ? "" : "/";
}
