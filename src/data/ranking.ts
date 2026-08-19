/**
 * Ranking boards.
 *
 * The league board is live: src/data/league.ts fetches it through /api/ranking
 * /league. The other three are still placeholder data, shaped exactly like the
 * payload the game server will return, so wiring each one means replacing its
 * `build*` helper with a fetch and leaving the row types untouched.
 *
 *   GET /api/ranking/league?category=all  -> LeagueRow[]   (live)
 *   GET /api/ranking/gold?page=1          -> GoldRow[]
 *   GET /api/ranking/guild?page=1         -> GuildRow[]
 *   GET /api/ranking/pk?class=all&page=1  -> PkRow[]
 *
 * Every placeholder value is generated from a fixed seed, never from
 * `Math.random` or `Date.now`, so prerendered and hydrated markup agree.
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

export type BoardId = "league" | "gold" | "guild" | "pk";

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

export type GuildTier = "S" | "A" | "B" | "C" | "D" | "E";

export const PAGE_SIZE = 10;

export const RANKING_META = {
  realm: "Channel 0",
  season: "Season 1",
  /** Cadence the snapshot job runs at. Copy only, safe to reword. */
  interval: "10 minutes",
  /** Static string, not a live clock, so server and client markup match. */
  synced: "Synced 4 minutes ago",
  stats: [
    { id: "ranked", label: "Ranked fighters", value: "48,120" },
    { id: "guilds", label: "Guilds tracked", value: "312" },
    { id: "matches", label: "League matches", value: "91,447" },
  ],
} as const;

export const BOARDS: {
  id: BoardId;
  label: string;
  title: string;
  lead: string;
  /** Legend under the metric, explaining how to read it. */
  metricNote: string;
  classFilters: boolean;
}[] = [
  {
    id: "league",
    label: "League",
    title: "League standings",
    lead:
      "Ranked ladder wins and losses across the current season. Sorted by wins, ties broken by fewer losses.",
    metricNote: "Wins – Losses",
    classFilters: true,
  },
  {
    id: "gold",
    label: "Top Gold",
    title: "Top gold",
    lead:
      "Carried gold on the character, counted at the last snapshot. Storage and guild vaults are not included.",
    metricNote: "Gold on hand",
    classFilters: false,
  },
  {
    id: "guild",
    label: "Top Guild",
    title: "Top guild",
    lead:
      "Guild power measured on kills, with roster size, alliances and resurrections alongside it.",
    metricNote: "Ranked by guild kills",
    classFilters: false,
  },
  {
    id: "pk",
    label: "PK Map",
    title: "PK map",
    lead:
      "Open field kills and deaths from every PK map. Deaths do not remove a kill, they sit next to it.",
    metricNote: "Kills – Deaths",
    classFilters: true,
  },
];

export const CLASS_FILTERS: { id: ClassFilterId; label: string; short: string }[] = [
  { id: "all", label: "All Top Class", short: "All" },
  { id: "resurrection", label: "Top Resurrection", short: "Resurrection" },
  { id: "brawler", label: "Top Brawler", short: "Brawler" },
  { id: "swordsman", label: "Top Swordsman", short: "Swordsman" },
  { id: "archer", label: "Top Archer", short: "Archer" },
  { id: "shaman", label: "Top Shaman", short: "Shaman" },
  { id: "heal", label: "Top Heal", short: "Heal" },
];

/**
 * Class filter to the code the league endpoint expects. The game server lists
 * them in its own 400: `Use: all, resu, br, sw, ar, sh, heal`. Keep this total
 * over ClassFilterId, so adding a filter cannot silently skip the mapping.
 */
export const LEAGUE_CATEGORY: Record<ClassFilterId, string> = {
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

export const SCHOOLS: Record<SchoolId, { name: string; short: string; crest: string }> = {
  "sacred-gate": { name: "Sacred Gate", short: "SG", crest: "/images/SG.webp" },
  "mystic-peak": { name: "Mystic Peak", short: "MP", crest: "/images/MP.webp" },
  phoenix: { name: "Phoenix", short: "PHNX", crest: "/images/PHNX.webp" },
};

const SCHOOL_IDS: SchoolId[] = ["sacred-gate", "mystic-peak", "phoenix"];
const CLASS_IDS: ClassId[] = ["brawler", "swordsman", "archer", "shaman"];
const GENDERS: Gender[] = ["m", "w"];
const TIERS: GuildTier[] = ["S", "A", "B", "C", "D", "E"];

/** Classes that a class filter resolves to. `all` keeps the mixed board. */
const FILTER_CLASS: Record<Exclude<ClassFilterId, "all">, ClassId> = {
  resurrection: "shaman",
  brawler: "brawler",
  swordsman: "swordsman",
  archer: "archer",
  shaman: "shaman",
  heal: "shaman",
};

export type PlayerRow = {
  rank: number;
  name: string;
  level: number;
  classId: ClassId;
  gender: Gender;
  school: SchoolId;
  guild: string | null;
};

export type LeagueRow = PlayerRow & {
  wins: number;
  losses: number;
  /** Live from the game server, true only while the character is logged in. */
  online: boolean;
};
export type GoldRow = PlayerRow & { gold: number };
export type PkRow = PlayerRow & { kills: number; deaths: number };

export type GuildRow = {
  rank: number;
  guild: string;
  tier: GuildTier;
  badge: boolean;
  alliance: number;
  online: number;
  members: number;
  kills: number;
  deaths: number;
  resu: number;
};

export type BoardRow = LeagueRow | GoldRow | GuildRow | PkRow;

/* -------------------------------------------------------------------------- */
/* Deterministic placeholder generator                                        */
/* -------------------------------------------------------------------------- */

function seedFrom(key: string): number {
  let hash = 2166136261;
  for (let i = 0; i < key.length; i += 1) {
    hash ^= key.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** Small linear congruential generator. Same key, same board, every time. */
function rng(key: string) {
  let state = seedFrom(key) || 1;

  const next = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };

  return {
    next,
    int: (min: number, max: number) => min + Math.floor(next() * (max - min + 1)),
    pick: <T,>(list: readonly T[]) => list[Math.floor(next() * list.length)],
    chance: (probability: number) => next() < probability,
  };
}

const ROWS_PER_LIST = 50;
const NAME_POOL = 180;
const GUILD_POOL = 30;

/** Unique `Dummy{n}` handles, drawn without repeats inside one board. */
function names(random: ReturnType<typeof rng>, count: number): string[] {
  const pool = Array.from({ length: NAME_POOL }, (_, i) => i + 1);
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = random.int(0, i);
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count).map((n) => `Dummy${n}`);
}

function fighters(key: string, filter: ClassFilterId): PlayerRow[] {
  const random = rng(key);
  const handles = names(random, ROWS_PER_LIST);
  const fixed = filter === "all" ? null : FILTER_CLASS[filter];

  return handles.map((name, index) => ({
    rank: index + 1,
    name,
    level:
      index < 34 || random.chance(0.5)
        ? CAP_LEVEL
        : random.int(CAP_LEVEL - 7, CAP_LEVEL - 1),
    classId: fixed ?? random.pick(CLASS_IDS),
    gender: random.pick(GENDERS),
    school: random.pick(SCHOOL_IDS),
    guild: random.chance(0.82)
      ? `DummyGuild${random.int(1, GUILD_POOL)}`
      : null,
  }));
}

function buildGold(): GoldRow[] {
  const random = rng("gold");
  let gold = random.int(8_600_000_000, 9_800_000_000);

  return fighters("gold-roster", "all").map((fighter) => {
    const row = { ...fighter, gold: Math.round(gold / 50_000) * 50_000 };
    gold = Math.max(4_000_000, gold * (0.86 + random.next() * 0.09));
    return row;
  });
}

function buildPk(filter: ClassFilterId): PkRow[] {
  const random = rng(`pk:${filter}`);
  let kills = random.int(5_800, 6_400);

  return fighters(`pk-roster:${filter}`, filter).map((fighter) => {
    const row = {
      ...fighter,
      kills,
      deaths: random.int(Math.round(kills * 0.08), Math.round(kills * 0.72)),
    };
    kills = Math.max(24, Math.round(kills * (0.88 + random.next() * 0.09)));
    return row;
  });
}

function buildGuilds(): GuildRow[] {
  const random = rng("guild");
  const pool = Array.from({ length: GUILD_POOL }, (_, i) => i + 1);
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = random.int(0, i);
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  let kills = random.int(9_200, 10_400);

  return pool.map((n, index) => {
    const members = random.int(index < 10 ? 18 : 4, 40);
    const row: GuildRow = {
      rank: index + 1,
      guild: `DummyGuild${n}`,
      tier: index < 3 ? TIERS[random.int(0, 1)] : random.pick(TIERS),
      badge: random.chance(0.62),
      alliance: random.chance(0.55) ? random.int(1, 3) : 0,
      members,
      online: Math.min(members, random.int(0, Math.round(members * 0.8))),
      kills,
      deaths: random.int(Math.round(kills * 0.2), Math.round(kills * 0.85)),
      resu: random.int(0, Math.round(kills * 0.35)),
    };
    kills = Math.max(18, Math.round(kills * (0.87 + random.next() * 0.1)));
    return row;
  });
}

/** Cache so re-renders and repeated tab visits reuse the same generated list. */
const cache = new Map<string, BoardRow[]>();

/**
 * Placeholder rows for the boards that are not wired yet. League is absent on
 * purpose: it comes from the game server, and a generated stand-in would put
 * invented player names into the prerendered page.
 */
export function getBoardRows(
  board: Exclude<BoardId, "league">,
  filter: ClassFilterId,
): BoardRow[] {
  const key = `${board}:${board === "pk" ? filter : "all"}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const rows: BoardRow[] =
    board === "pk"
      ? buildPk(filter)
      : board === "gold"
        ? buildGold()
        : buildGuilds();

  cache.set(key, rows);
  return rows;
}

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
