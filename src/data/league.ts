/**
 * League standings, live from the game server.
 *
 * The browser calls this site's own origin at /api/ranking/league, which the
 * Cloudflare Function in functions/api/ranking/league.ts answers. Page and page
 * size are pinned server-side: the board is at most 50 rows, so one call brings
 * the whole thing back and RankingBoard pages and searches that list locally.
 * See the "Live server stats" section of the README.
 */

import {
  LEAGUE_CATEGORY,
  type ClassFilterId,
  type ClassId,
  type Gender,
  type LeagueRow,
  type SchoolId,
} from "./ranking.ts";

export function leagueUrl(filter: ClassFilterId): string {
  return `/api/ranking/league?category=${LEAGUE_CATEGORY[filter]}`;
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
 * live board returns 1, 2, 4, 8, 64 and 256 for six combinations, which is not
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

function readRow(entry: unknown): LeagueRow | null {
  if (!isRecord(entry)) return null;

  const parsedClass = readClass(entry.classLabel);
  const name = text(entry.chaName);
  const rank = int(entry.rank);
  const school = SCHOOL_BY_INDEX[int(entry.chaSchool) ?? -1];

  // A row missing any of these cannot be rendered honestly, so it is dropped
  // rather than shown with a placeholder standing in for real data.
  if (!parsedClass || !name || rank === null || !school) return null;

  return {
    rank,
    name,
    level: int(entry.chaLevel) ?? 0,
    classId: parsedClass.classId,
    gender: parsedClass.gender,
    school,
    guild: text(entry.guName),
    wins: int(entry.scoreWin) ?? 0,
    losses: int(entry.scoreLoss) ?? 0,
    online: entry.online === true,
  };
}

/**
 * Validates a league payload. Returns null when the response is not a
 * successful board, which the caller reports as unavailable; an empty array is
 * a real answer meaning nobody is ranked yet.
 */
export function parseLeague(payload: unknown): LeagueRow[] | null {
  if (!isRecord(payload) || payload.success !== true) return null;
  if (!Array.isArray(payload.data)) return null;

  const rows: LeagueRow[] = [];

  for (const entry of payload.data) {
    const row = readRow(entry);
    if (row) rows.push(row);
  }

  return rows;
}
