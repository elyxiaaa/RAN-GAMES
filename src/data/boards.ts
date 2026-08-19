import {
  CATEGORY_CODE,
  GUILD_LEVEL_MAX,
  type BoardId,
  type BoardRow,
  type ClassFilterId,
  type ClassId,
  type Gender,
  type GoldRow,
  type GuildRow,
  type LeagueRow,
  type MmrRow,
  type PlayerRow,
  type SchoolId,
} from "./ranking.ts";

const ENDPOINT: Record<Exclude<BoardId, "pk">, string> = {
  league: "/api/ranking/league",
  mmr: "/api/ranking/mmr",
  gold: "/api/ranking/currency",
  guild: "/api/ranking/guild",
};

const TAKES_CATEGORY: Record<Exclude<BoardId, "pk">, boolean> = {
  league: true,
  mmr: true,
  gold: false,
  guild: false,
};

export function boardUrl(
  board: Exclude<BoardId, "pk">,
  filter: ClassFilterId,
): string {
  const path = ENDPOINT[board];
  return TAKES_CATEGORY[board]
    ? `${path}?category=${CATEGORY_CODE[filter]}`
    : path;
}

const SCHOOL_BY_INDEX: SchoolId[] = ["sacred-gate", "mystic-peak", "phoenix"];

const CLASS_BY_NAME: Record<string, ClassId> = {
  brawler: "brawler",
  swordsman: "swordsman",
  archer: "archer",
  shaman: "shaman",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function int(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.round(value)
    : null;
}

function count(value: unknown): number {
  const parsed = int(value);
  return parsed !== null && parsed >= 0 ? parsed : 0;
}

function text(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function readClass(label: unknown): { classId: ClassId; gender: Gender } | null {
  if (typeof label !== "string") return null;

  const match = /^\s*([A-Za-z]+)\s*\[([MF])\]\s*$/.exec(label);
  if (!match) return null;

  const classId = CLASS_BY_NAME[match[1].toLowerCase()];
  if (!classId) return null;

  return { classId, gender: match[2] === "F" ? "w" : "m" };
}

function readPlayer(entry: unknown): PlayerRow | null {
  if (!isRecord(entry)) return null;

  const parsedClass = readClass(entry.classLabel);
  const name = text(entry.chaName);
  const rank = int(entry.rank);
  const school = SCHOOL_BY_INDEX[int(entry.chaSchool) ?? -1];

  if (!parsedClass || !name || rank === null || !school) return null;

  return {
    rank,
    name,
    level: count(entry.chaLevel),
    classId: parsedClass.classId,
    gender: parsedClass.gender,
    school,
    guild: text(entry.guName),
    online: entry.online === true,
  };
}

function readLeague(entry: unknown): LeagueRow | null {
  const player = readPlayer(entry);
  if (!player || !isRecord(entry)) return null;

  return {
    ...player,
    wins: count(entry.scoreWin),
    losses: count(entry.scoreLoss),
  };
}

function readMmr(entry: unknown): MmrRow | null {
  const player = readPlayer(entry);
  if (!player || !isRecord(entry)) return null;

  return {
    ...player,
    rating: count(entry.mmrExp),
    bracket: count(entry.mmrRank),
  };
}

function readGold(entry: unknown): GoldRow | null {
  const player = readPlayer(entry);
  if (!player || !isRecord(entry)) return null;

  return { ...player, gold: count(entry.money) };
}

function readGuild(entry: unknown): GuildRow | null {
  if (!isRecord(entry)) return null;

  const name = text(entry.guName);
  const rank = int(entry.rank);
  if (!name || rank === null) return null;

  const members = count(entry.totalMembers);

  return {
    rank,
    guild: name,
    level: Math.min(count(entry.guRank), GUILD_LEVEL_MAX),
    alliance: count(entry.alliance),
    online: Math.min(count(entry.online), members),
    members,
    wins: count(entry.win),
    losses: count(entry.loss),
    draws: count(entry.draw),
  };
}

const READERS: Record<Exclude<BoardId, "pk">, (entry: unknown) => BoardRow | null> =
  {
    league: readLeague,
    mmr: readMmr,
    gold: readGold,
    guild: readGuild,
  };

export function parseBoard(
  board: Exclude<BoardId, "pk">,
  payload: unknown,
): BoardRow[] | null {
  if (!isRecord(payload) || payload.success !== true) return null;
  if (!Array.isArray(payload.data)) return null;

  const read = READERS[board];
  const rows: BoardRow[] = [];

  for (const entry of payload.data) {
    const row = read(entry);
    if (row) rows.push(row);
  }

  return rows;
}
