import { SERVER_STATS } from "./content.ts";

export const CAP_LEVEL =
  Number.parseInt(
    SERVER_STATS.find((stat) => stat.id === "cap-level")?.value ?? "",
    10,
  ) || 210;

export type BoardId = "league" | "mmr" | "gold" | "guild" | "pk";

export type ClassId = "brawler" | "swordsman" | "archer" | "shaman";

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

export const GUILD_LEVEL_MAX = 5;

export const RANKING_META = {
  realm: "Channel 0",
  season: "Season 1",
  interval: "10 minutes",
  synced: "Synced 4 minutes ago",
} as const;

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
  metricNote: string;
  categories: ClassFilterId[] | null;
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

export type PlayerRow = {
  rank: number;
  name: string;
  level: number;
  classId: ClassId;
  gender: Gender;
  school: SchoolId;
  guild: string | null;
  online: boolean;
};

export type LeagueRow = PlayerRow & { wins: number; losses: number };

export type MmrRow = PlayerRow & {
  rating: number;
  bracket: number;
};

export type GoldRow = PlayerRow & { gold: number };

export type GuildRow = {
  rank: number;
  guild: string;
  level: number;
  alliance: number;
  online: number;
  members: number;
  wins: number;
  losses: number;
  draws: number;
};

export type BoardRow = LeagueRow | MmrRow | GoldRow | GuildRow;

export function formatInt(value: number): string {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatGold(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return formatInt(value);
}

export function rowLabel(row: BoardRow): string {
  return "name" in row ? row.name : row.guild;
}

export function rowKey(row: BoardRow): string {
  return `${rowLabel(row)}-${row.rank}`;
}

export function rowSearchText(row: BoardRow): string {
  return "name" in row ? `${row.name} ${row.guild ?? ""}` : row.guild;
}
