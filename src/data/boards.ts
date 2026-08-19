/**
 * Ranking boards, live from the game server.
 *
 * The browser calls this site's own origin; the Cloudflare Functions under
 * functions/api/ranking answer. Page and page size are pinned server-side: no
 * board exceeds 50 rows, so one call brings the whole thing back and
 * RankingBoard pages and searches that list locally. See the "Live game server
 * data" section of the README.
 */

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

/**
 * Board to endpoint. `gold` is served by the currency endpoint, whose `type` is
 * pinned in server/routes.ts because gold is the only value it accepts today.
 */
const ENDPOINT: Record<Exclude<BoardId, "pk">, string> = {
  league: "/api/ranking/league",
  mmr: "/api/ranking/mmr",
  gold: "/api/ranking/currency",
  guild: "/api/ranking/guild",
};

/** Boards whose endpoint takes a class category. The others ignore it. */
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

/**
 * A guild's emblem, drawn by its members and served as a small PNG. Requested
 * straight from an <img>, so the browser caches it like any other image.
 */
export function guildIconUrl(guNum: number): string {
  return `/api/guild-icon?guNum=${guNum}`;
}

/** Index is the game server's own `chaSchool` value. */
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

/** Counts cannot be negative, and an unreadable one reads as zero. */
function count(value: unknown): number {
  const parsed = int(value);
  return parsed !== null && parsed >= 0 ? parsed : 0;
}

/** Trims and treats blank as absent: the game pads names out with spaces. */
function text(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

/**
 * Reads `"Archer [F]"` into a class and a body.
 *
 * Parsed from `classLabel` rather than the numeric `chaClass` on purpose. The
 * live boards return 1, 2, 4, 8, 64 and 256 for six combinations, which is not
 * one consistent bit pattern, so the number cannot be decoded without guessing.
 * The label is unambiguous and the server already derives it.
 */
function readClass(label: unknown): { classId: ClassId; gender: Gender } | null {
  if (typeof label !== "string") return null;

  const match = /^\s*([A-Za-z]+)\s*\[([MF])\]\s*$/.exec(label);
  if (!match) return null;

  const classId = CLASS_BY_NAME[match[1].toLowerCase()];
  if (!classId) return null;

  return { classId, gender: match[2] === "F" ? "w" : "m" };
}

/**
 * The character fields every player board shares. A row missing any of them
 * cannot be rendered honestly, so it is dropped rather than shown with a
 * placeholder standing in for real data.
 */
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
    guNum: count(entry.guNum),
    guild: name,
    // `guRank` is the guild level. Clamped rather than trusted, so a value the
    // server grows past cannot drive the level meter off its own scale.
    level: Math.min(count(entry.guRank), GUILD_LEVEL_MAX),
    // A guild with no emblem reports mark version 0.
    badge: count(entry.guMarkVer) > 0,
    alliance: count(entry.alliance),
    // Capped at the roster: more online than members would only be a glitch.
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

/**
 * Validates a board payload. Returns null when the response is not a successful
 * board, which the caller reports as unavailable; an empty array is a real
 * answer meaning nothing is ranked yet.
 */
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
