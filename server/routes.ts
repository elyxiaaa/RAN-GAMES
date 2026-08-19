/**
 * Upstream API routes.
 *
 * Shared by the Cloudflare Functions under functions/ and by the dev proxy in
 * vite.config.ts, so `npm run dev` and production cannot drift apart on which
 * parameters are pinned, forwarded or refused.
 *
 * Deliberately free of Workers globals: vite.config.ts type checks under Node,
 * and server/proxy.ts, which does use them, is never imported from here.
 */

export const UPSTREAM_ORIGIN = "http://egames.ran-services.com";

export type Route = {
  /** Path on this site and on the game server. Kept identical on both. */
  path: string;
  /**
   * Parameters fixed by us, never by the caller. `pageSize` belongs here:
   * a caller-chosen page size is a caller-chosen number of cache entries.
   */
  pinned: Record<string, string>;
  /**
   * Parameters a caller may set, each with the exact values allowed. Anything
   * else is refused at the edge, so an invented value can neither reach the
   * game server nor open a cache entry of its own.
   */
  forward: Record<string, readonly string[]>;
  /** Seconds an answer stays fresh at the edge. */
  ttl: number;
};

/**
 * League categories, spelled the way the game server spells them. Its own 400
 * response is the source: `Use: all, resu, br, sw, ar, sh, heal`.
 */
export const LEAGUE_CATEGORIES = [
  "all",
  "resu",
  "br",
  "sw",
  "ar",
  "sh",
  "heal",
] as const;

export type LeagueCategory = (typeof LEAGUE_CATEGORIES)[number];

/**
 * The game server caps pageSize at 50 and never reports a total above it, so
 * one request is the whole board. Asking for more returns 50 regardless.
 */
export const LEAGUE_PAGE_SIZE = 50;

export const ROUTES = {
  stats: {
    path: "/api/stats",
    pinned: {},
    forward: {},
    /** Counts move slowly and the hero polls once a minute. */
    ttl: 30,
  },

  league: {
    path: "/api/ranking/league",
    // The whole board in one call, because the client pages and searches it
    // locally. Forwarding `page` or a search term would multiply cache entries
    // without saving a single upstream call.
    pinned: { page: "1", pageSize: String(LEAGUE_PAGE_SIZE) },
    forward: { category: LEAGUE_CATEGORIES },
    /** The snapshot job upstream runs every 10 minutes; this sits under it. */
    ttl: 300,
  },
} satisfies Record<string, Route>;
