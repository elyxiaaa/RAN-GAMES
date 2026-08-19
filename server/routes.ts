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
  /** Path on this site. Also the path upstream unless `upstream` overrides it. */
  path: string;
  /** Upstream path, when the game server spells it differently to us. */
  upstream?: string;
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
  /**
   * Parameters validated by shape rather than by an enum, for values with no
   * fixed list -- an id, say. The pattern is the whole allowlist, so keep it
   * anchored and bounded: it is the only thing standing between a caller and an
   * unlimited number of cache entries.
   */
  match?: Record<string, RegExp>;
  /**
   * What the upstream is expected to return. Checked against the response's
   * own content type before anything is cached, so an HTML login page can
   * never be stored and served as if it were the resource.
   */
  expect: "json" | "image";
  /** Seconds an answer stays fresh at the edge. */
  ttl: number;
};

/**
 * Class categories, spelled the way the game server spells them. Each board
 * that takes one was probed against the live API; they are not the same list.
 *
 * League answers all seven. MMR rejects `heal` with a 400, so it gets its own
 * list rather than a shared one that would 400 for a filter the rail offers.
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

export const MMR_CATEGORIES = ["all", "resu", "br", "sw", "ar", "sh"] as const;

/**
 * The game server caps pageSize at 50 on every board and never reports a total
 * above it, so one request is always the whole board. Asking for more returns
 * 50 regardless.
 */
export const BOARD_PAGE_SIZE = 50;

/** Every board is one call, paged and searched client side. */
const board = {
  page: "1",
  pageSize: String(BOARD_PAGE_SIZE),
};

/** The snapshot job upstream runs every 10 minutes; this sits under it. */
const BOARD_TTL = 300;

export const ROUTES = {
  stats: {
    path: "/api/stats",
    pinned: {},
    forward: {},
    /** Counts move slowly and the hero polls once a minute. */
    expect: "json",
    ttl: 30,
  },

  league: {
    path: "/api/ranking/league",
    pinned: board,
    forward: { category: LEAGUE_CATEGORIES },
    expect: "json",
    ttl: BOARD_TTL,
  },

  mmr: {
    path: "/api/ranking/mmr",
    pinned: board,
    forward: { category: MMR_CATEGORIES },
    expect: "json",
    ttl: BOARD_TTL,
  },

  gold: {
    // `type` is pinned because gold is the only value the server accepts today.
    // Its 400 mentions epoint and gpoint "if SP provides them"; when they do,
    // add them here and to the board's own filter list, not to `forward` alone.
    path: "/api/ranking/currency",
    pinned: { ...board, type: "gold" },
    forward: {},
    expect: "json",
    ttl: BOARD_TTL,
  },

  guild: {
    path: "/api/ranking/guild",
    pinned: board,
    forward: {},
    expect: "json",
    ttl: BOARD_TTL,
  },

  /**
   * Guild emblems, as PNG rather than JSON.
   *
   * `guNum` has no fixed list, so it is validated by shape instead: digits
   * only, at most five of them. That bound is the cache's protection -- without
   * it a caller could mint an unlimited number of entries by counting upwards.
   *
   * A long TTL because an emblem only changes when a guild redraws it, which
   * the guild payload reports separately as `guMarkVer`.
   */
  guildIcon: {
    path: "/api/guild-icon",
    upstream: "/api/GuildIcon",
    pinned: {},
    forward: {},
    match: { guNum: /^[0-9]{1,5}$/ },
    expect: "image",
    ttl: 86_400,
  },
} satisfies Record<string, Route>;
