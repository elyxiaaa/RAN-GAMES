export const STATS_ENDPOINT = "/api/stats";

export type SchoolCode = "SG" | "MP" | "PHX";

export type SchoolCounts = Record<SchoolCode, number>;

export type ServerStats = {
  totalOnline: number;
  totalCharacters: number;
  onlineBySchool: SchoolCounts;
  charactersBySchool: SchoolCounts;
};

export const SNAPSHOT: ServerStats = {
  totalOnline: 123,
  totalCharacters: 4347,
  onlineBySchool: { SG: 34, MP: 42, PHX: 47 },
  charactersBySchool: { SG: 1768, MP: 1658, PHX: 921 },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toCount(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return null;
  }
  return Math.round(value);
}

function isSchoolCode(value: unknown): value is SchoolCode {
  return value === "SG" || value === "MP" || value === "PHX";
}

function readCounts(list: unknown, fallback: SchoolCounts): SchoolCounts {
  if (!Array.isArray(list)) return fallback;

  const counts = { ...fallback };

  for (const entry of list) {
    if (!isRecord(entry) || !isSchoolCode(entry.schoolCode)) continue;

    const count = toCount(entry.count);
    if (count !== null) counts[entry.schoolCode] = count;
  }

  return counts;
}

export function parseStats(payload: unknown): ServerStats | null {
  if (!isRecord(payload) || payload.success !== true) return null;
  if (!isRecord(payload.data)) return null;

  const data = payload.data;

  return {
    totalOnline: toCount(data.totalOnline) ?? SNAPSHOT.totalOnline,
    totalCharacters: toCount(data.totalCharacters) ?? SNAPSHOT.totalCharacters,
    onlineBySchool: readCounts(data.onlineBySchool, SNAPSHOT.onlineBySchool),
    charactersBySchool: readCounts(
      data.charactersBySchool,
      SNAPSHOT.charactersBySchool,
    ),
  };
}
