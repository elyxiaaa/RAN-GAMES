/**
 * Ranking boards.
 *
 * Four boards are live, each fetched through this site's own origin by
 * src/data/boards.ts. PK Map has no endpoint yet and is marked `soon`.
 *
 *   GET /api/ranking/league?category=...  -> LeagueRow[]
 *   GET /api/ranking/mmr?category=...     -> MmrRow[]
 *   GET /api/ranking/currency             -> GoldRow[]
 *   GET /api/ranking/guild                -> GuildRow[]
 *
 * There is deliberately no placeholder generator here any more. A generated
 * stand-in would put invented player names into the prerendered page, which is
 * what crawlers read; a board renders a skeleton until its real rows land.
 */

import { SERVER_STATS } from "./content.ts";

/**
 * Cap level, read from the server configuration rather than repeated, so the
 * boards can never disagree with the figure in the server information rail.
 */
export const CAP_LEVEL =
  Number.parseInt(
    SERVER_STATS.find((stat) => stat.id === "cap-level")?.value ?? "",
    10,
  ) || 210;

export type BoardId = "league" | "mmr" | "gold" | "guild" | "pk";

export type ClassId = "brawler" | "swordsman" | "archer" | "shaman";

/**
 * The game models each class twice, once per body. `w` rather than `f` because
 * that is how the icon files in public/images/class-icons are named.
 */
export type Gender = "m" | "w";

export type ClassFilterId =
  | "all"
  | "resurrection"
  | "brawler"
  | "swordsman"
  | "archer"
  | "shaman"
  | "heal";

export type SchoolId = "sacred-gate" | "mystic-peak" | "phoenix";

export const PAGE_SIZE = 10;

/** Guild levels run 0 to 5 on the game server, 5 being the strongest. */
export const GUILD_LEVEL_MAX = 5;

export const RANKING_META = {
  realm: "Channel 0",
  season: "Season 1",
  /** Cadence the snapshot job runs at. Copy only, safe to reword. */
  interval: "10 minutes",
  /** Static string, not a live clock, so server and client markup match. */
  synced: "Synced 4 minutes ago",
} as const;

/**
 * Class filters offered per board. These are deliberately not one shared list:
 * the league endpoint answers all seven, while MMR refuses `heal` with a 400,
 * so offering it there would put a filter in the rail that can only fail.
 */
const LEAGUE_FILTERS: ClassFilterId[] = [
  "all",
  "resurrection",
  "brawler",
  "swordsman",
  "archer",
  "shaman",
  "heal",
];

const MMR_FILTERS: ClassFilterId[] = [
  "all",
  "resurrection",
  "brawler",
  "swordsman",
  "archer",
  "shaman",
];

export const BOARDS: {
  id: BoardId;
  label: string;
  title: string;
  lead: string;
  /** Legend under the metric, explaining how to read it. */
  metricNote: string;
  /** Filters this board's endpoint accepts, or null for no class rail. */
  categories: ClassFilterId[] | null;
  /** Set while a board has no endpoint yet. Not selectable. */
  soon?: true;
}[] = [
  {
    id: "league",
    label: "League",
    title: "League standings",
    lead:
      "Ranked ladder wins and losses across the current season. Sorted by wins, ties broken by fewer losses.",
    metricNote: "Wins – Losses",
    categories: LEAGUE_FILTERS,
  },
  {
    id: "mmr",
    label: "Top MMR",
    title: "Top MMR",
    lead:
      "Matchmaking rating, the ladder's own measure of strength. It moves on who you beat, not on how much you play.",
    metricNote: "Rating",
    categories: MMR_FILTERS,
  },
  {
    id: "gold",
    label: "Top Gold",
    title: "Top gold",
    lead:
      "Carried gold on the character, counted at the last snapshot. Storage and guild vaults are not included.",
    metricNote: "Gold on hand",
    categories: null,
  },
  {
    id: "guild",
    label: "Top Guild",
    title: "Top guild",
    lead:
      "Guild war record across every siege, with roster size, guild level and alliances alongside it.",
    metricNote: "Wins – Losses",
    categories: null,
  },
  {
    id: "pk",
    label: "PK Map",
    title: "PK map",
    lead:
      "Open field kills and deaths from every PK map. Deaths do not remove a kill, they sit next to it.",
    metricNote: "Kills – Deaths",
    categories: null,
    soon: true,
  },
];

export const CLASS_FILTERS: {
  id: ClassFilterId;
  label: string;
  short: string;
}[] = [
  { id: "all", label: "All Top Class", short: "All" },
  { id: "resurrection", label: "Top Resurrection", short: "Resurrection" },
  { id: "brawler", label: "Top Brawler", short: "Brawler" },
  { id: "swordsman", label: "Top Swordsman", short: "Swordsman" },
  { id: "archer", label: "Top Archer", short: "Archer" },
  { id: "shaman", label: "Top Shaman", short: "Shaman" },
  { id: "heal", label: "Top Heal", short: "Heal" },
];

/**
 * Class filter to the code the endpoints expect. The game server lists them in
 * its own 400: `Use: all, resu, br, sw, ar, sh, heal`. Kept total over
 * ClassFilterId, so adding a filter cannot silently skip the mapping.
 */
export const CATEGORY_CODE: Record<ClassFilterId, string> = {
  all: "all",
  resurrection: "resu",
  brawler: "br",
  swordsman: "sw",
  archer: "ar",
  shaman: "sh",
  heal: "heal",
};

export const CLASSES: Record<ClassId, { label: string }> = {
  brawler: { label: "Brawler" },
  swordsman: { label: "Swordsman" },
  archer: { label: "Archer" },
  shaman: { label: "Shaman" },
};

/** Filename stem of each class in public/images/class-icons. */
export const CLASS_ICON_STEM: Record<ClassId, string> = {
  brawler: "br",
  swordsman: "sm",
  archer: "ar",
  shaman: "sh",
};

export function classIconSrc(classId: ClassId, gender: Gender): string {
  return `/images/class-icons/${CLASS_ICON_STEM[classId]}_${gender}.webp`;
}

export const SCHOOLS: Record<
  SchoolId,
  { name: string; short: string; crest: string }
> = {
  "sacred-gate": { name: "Sacred Gate", short: "SG", crest: "/images/SG.webp" },
  "mystic-peak": { name: "Mystic Peak", short: "MP", crest: "/images/MP.webp" },
  phoenix: { name: "Phoenix", short: "PHNX", crest: "/images/PHNX.webp" },
};

/* -------------------------------------------------------------------------- */
/* Rows                                                                       */
/* -------------------------------------------------------------------------- */

export type PlayerRow = {
  rank: number;
  name: string;
  level: number;
  classId: ClassId;
  gender: Gender;
  school: SchoolId;
  guild: string | null;
  /** Live from the game server, true only while the character is logged in. */
  online: boolean;
};

export type LeagueRow = PlayerRow & { wins: number; losses: number };

export type MmrRow = PlayerRow & {
  rating: number;
  /** The server's own MMR bracket for the character, counting up from zero. */
  bracket: number;
};

export type GoldRow = PlayerRow & { gold: number };

export type GuildRow = {
  rank: number;
  /** The server's own guild id. The emblem endpoint is keyed by it. */
  guNum: number;
  guild: string;
  /** 0 to GUILD_LEVEL_MAX, straight from the server's `guRank`. */
  level: number;
  /** The guild has an emblem set, which the server reports as a mark version. */
  badge: boolean;
  alliance: number;
  online: number;
  members: number;
  wins: number;
  losses: number;
  draws: number;
};

export type BoardRow = LeagueRow | MmrRow | GoldRow | GuildRow;

/* -------------------------------------------------------------------------- */
/* Formatting                                                                 */
/* -------------------------------------------------------------------------- */

/** Hand rolled so node and the browser cannot disagree on separators. */
export function formatInt(value: number): string {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatGold(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return formatInt(value);
}

/** The searchable label for a row: player handle, or guild name on the guild board. */
export function rowLabel(row: BoardRow): string {
  return "name" in row ? row.name : row.guild;
}

export function rowKey(row: BoardRow): string {
  return `${rowLabel(row)}-${row.rank}`;
}

/**
 * Everything a row can be found by. Player boards include the guild, so a guild
 * tag can be typed in to pull up its members.
 */
export function rowSearchText(row: BoardRow): string {
  return "name" in row ? `${row.name} ${row.guild ?? ""}` : row.guild;
}
