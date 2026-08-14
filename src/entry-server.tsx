import { renderToString } from "react-dom/server";
import App from "./App.tsx";
import { routeFromPath } from "./routes.ts";

export function render(path = "/"): string {
  return renderToString(<App route={routeFromPath(path)} />);
}
