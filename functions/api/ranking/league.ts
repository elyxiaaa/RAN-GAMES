/**
 * GET /api/ranking/league?category=... -- the league standings board.
 *
 * `category` is the only parameter a caller may set, and only to one of the
 * codes the game server accepts (server/routes.ts). Page and page size are
 * pinned: the board is at most 50 rows, so one call fetches all of it and the
 * client pages and searches that list locally.
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
    route: ROUTES.league,
    origin: context.env.GAME_API_ORIGIN || UPSTREAM_ORIGIN,
    token: context.env.STATS_API_TOKEN,
  });
}
