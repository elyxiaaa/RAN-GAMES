/**
 * GET /api/stats -- live character and online counts.
 *
 * All of the work is in server/proxy.ts, which the ranking endpoint will share.
 * See the "Live server stats" section of the README for why the browser calls
 * this site's own origin instead of the game server directly.
 *
 * STATS_API_URL and STATS_API_TOKEN are set on the Cloudflare Pages project,
 * under Settings -> Environment variables. There is no token fallback on
 * purpose: an unset variable fails loudly upstream rather than silently
 * shipping a default secret.
 */

import { proxyJson, type ProxyContext } from "../../server/proxy.ts";

type Env = {
  STATS_API_URL?: string;
  STATS_API_TOKEN?: string;
};

const DEFAULT_UPSTREAM = "http://egames.ran-services.com/api/stats";

/** Counts move slowly and the hero polls once a minute. */
const TTL_SECONDS = 30;

export async function onRequestGet(
  context: ProxyContext & { env: Env },
): Promise<Response> {
  return proxyJson(context, {
    upstream: context.env.STATS_API_URL || DEFAULT_UPSTREAM,
    token: context.env.STATS_API_TOKEN,
    ttl: TTL_SECONDS,
  });
}
