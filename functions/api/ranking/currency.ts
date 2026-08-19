/**
 * GET /api/ranking/currency -- see server/routes.ts for the parameters this
 * accepts and server/proxy.ts for the caching and allowlisting around it.
 */

import { proxyJson, type ProxyContext } from "../../../server/proxy.ts";
import { ROUTES, UPSTREAM_ORIGIN } from "../../../server/routes.ts";

type Env = {
  GAME_API_ORIGIN?: string;
  STATS_API_TOKEN?: string;
};

export async function onRequestGet(
  context: ProxyContext & { env: Env },
): Promise<Response> {
  return proxyJson(context, {
    route: ROUTES.gold,
    origin: context.env.GAME_API_ORIGIN || UPSTREAM_ORIGIN,
    token: context.env.STATS_API_TOKEN,
  });
}
