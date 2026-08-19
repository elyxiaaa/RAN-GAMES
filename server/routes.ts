export const UPSTREAM_ORIGIN = "http://egames.ran-services.com";

export const UPSTREAM_TIMEOUT_MS = 6000;

export type Route = {
  path: string;
  pinned: Record<string, string>;
  forward: Record<string, readonly string[]>;
  ttl: number;
};

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

export const BOARD_PAGE_SIZE = 50;

const board = {
  page: "1",
  pageSize: String(BOARD_PAGE_SIZE),
};

const BOARD_TTL = 300;

export const ROUTES = {
  stats: {
    path: "/api/stats",
    pinned: {},
    forward: {},
    ttl: 30,
  },

  league: {
    path: "/api/ranking/league",
    pinned: board,
    forward: { category: LEAGUE_CATEGORIES },
    ttl: BOARD_TTL,
  },

  mmr: {
    path: "/api/ranking/mmr",
    pinned: board,
    forward: { category: MMR_CATEGORIES },
    ttl: BOARD_TTL,
  },

  gold: {
    path: "/api/ranking/currency",
    pinned: { ...board, type: "gold" },
    forward: {},
    ttl: BOARD_TTL,
  },

  guild: {
    path: "/api/ranking/guild",
    pinned: board,
    forward: {},
    ttl: BOARD_TTL,
  },
} satisfies Record<string, Route>;
