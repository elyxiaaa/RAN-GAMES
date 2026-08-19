/**
 * Live server stats.
 *
 * The browser only ever calls this site's own origin. In production that is the
 * Cloudflare Pages Function in functions/api/stats.ts; under `npm run dev` and
 * `npm run preview` it is the proxy in vite.config.ts. Either way the API token
 * stays server-side, and the game server's plain-HTTP endpoint is never reached
 * from a page served over HTTPS, which a browser would block as mixed content.
 *
 * Nothing here runs during the prerender. The page ships with SNAPSHOT below
 * baked into the markup and swaps in live figures once the fetch lands, so the
 * readout has real numbers on first paint and an outage is invisible.
 */

export const STATS_ENDPOINT = "/api/stats";

/** The three schools, keyed by the code the game server sends. */
export type SchoolCode = "SG" | "MP" | "PHX";

export type SchoolCounts = Record<SchoolCode, number>;

export type ServerStats = {
  totalOnline: number;
  totalCharacters: number;
  onlineBySchool: SchoolCounts;
  charactersBySchool: SchoolCounts;
};

/**
 * A real reading taken on 2026-08-19, not invented figures. This is what the
 * prerendered HTML carries, so it is also what a crawler and any visitor whose
 * fetch fails will see. Refresh it if it ever drifts far enough to look wrong.
 */
export const SNAPSHOT: ServerStats = {
  totalOnline: 123,
  totalCharacters: 4347,
  onlineBySchool: { SG: 34, MP: 42, PHX: 47 },
  charactersBySchool: { SG: 1768, MP: 1658, PHX: 921 },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/** Counts are whole and non-negative; anything else is treated as absent. */
function toCount(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return null;
  }
  return Math.round(value);
}

function isSchoolCode(value: unknown): value is SchoolCode {
  return value === "SG" || value === "MP" || value === "PHX";
}

/**
 * Reads one `[{ schoolCode, count }, ...]` list. A school the payload omits
 * keeps its snapshot figure rather than collapsing to zero, so a partial
 * response degrades one number instead of blanking the whole readout.
 */
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

/**
 * Validates a `/api/stats` body. Returns null when the payload is not a
 * successful response, which the caller treats as "keep the numbers on screen".
 */
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
