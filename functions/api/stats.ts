/**
 * GET /api/stats -- live character and online counts.
 *
 * The work is in server/proxy.ts; the route's shape is in server/routes.ts.
 * See the "Live server stats" section of the README for why the browser calls
 * this site's own origin instead of the game server directly.
 */

import { proxyJson, type ProxyContext } from "../../server/proxy.ts";
import { ROUTES, UPSTREAM_ORIGIN } from "../../server/routes.ts";

type Env = {
  GAME_API_ORIGIN?: string;
  STATS_API_TOKEN?: string;
};

export async function onRequestGet(
  context: ProxyContext & { env: Env },
): Promise<Response> {
  return proxyJson(context, {
    route: ROUTES.stats,
    origin: context.env.GAME_API_ORIGIN || UPSTREAM_ORIGIN,
    token: context.env.STATS_API_TOKEN,
  });
}
