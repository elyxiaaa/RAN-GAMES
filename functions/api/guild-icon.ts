/**
 * GET /api/guild-icon?guNum=N -- a guild's emblem, as an image.
 *
 * Upstream this is /api/GuildIcon. It is the one endpoint that does not answer
 * to `apiToken`: at the time of writing it sits behind the game site's own
 * login and redirects anonymous callers to /Identity/Account/Login, which
 * server/proxy.ts refuses rather than caches. Once the game server accepts the
 * API token here, this starts working with no change on our side.
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
    route: ROUTES.guildIcon,
    origin: context.env.GAME_API_ORIGIN || UPSTREAM_ORIGIN,
    token: context.env.STATS_API_TOKEN,
  });
}
