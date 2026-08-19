export type Route = "home" | "ranking";

export const ROUTE_PATH: Record<Route, string> = {
  home: "/",
  ranking: "/ranking",
};

export function routeFromPath(pathname: string): Route {
  return /^\/ranking(\/|\/index\.html)?$/.test(pathname) ? "ranking" : "home";
}

export function anchorBase(route: Route): string {
  return route === "home" ? "" : "/";
}
