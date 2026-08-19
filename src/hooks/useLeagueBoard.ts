import { useCallback, useEffect, useReducer, useState } from "react";
import { leagueUrl, parseLeague } from "../data/league";
import type { ClassFilterId, LeagueRow } from "../data/ranking";

/** Matches the edge TTL in server/routes.ts, so the two cannot disagree. */
const FRESH_MS = 300_000;

export type LeagueStatus = "loading" | "ready" | "error";

export type LeagueBoard = {
  status: LeagueStatus;
  rows: LeagueRow[];
  /** Discards the cached answer for this filter and fetches it again. */
  retry: () => void;
};

type Entry = {
  status: "ready" | "error";
  rows: LeagueRow[];
  at: number;
};

/**
 * One entry per class filter, so switching back to a board already seen is
 * instant and costs no request. Module scope rather than component state,
 * because the rail is switched often and the whole board is only 50 rows.
 */
const cache = new Map<ClassFilterId, Entry>();

/** Stable identity, so a board with no rows does not re-render its children. */
const NO_ROWS: LeagueRow[] = [];

function read(filter: ClassFilterId): Entry | null {
  const entry = cache.get(filter);
  if (!entry) return null;
  return Date.now() - entry.at < FRESH_MS ? entry : null;
}

/**
 * League standings for one class filter.
 *
 * The answer is derived from the module cache during render rather than copied
 * into state by an effect, so there is no render-then-correct pass. The effect
 * only fetches; finishing a fetch bumps a counter to re-read the cache.
 *
 * With an empty cache the first render is always `loading`, on the server and
 * in the browser alike, so prerendered and hydrated markup agree. It also keeps
 * invented player names out of the shipped HTML: there is no placeholder board
 * to fall back to, only the real one or an honest empty state.
 */
export function useLeagueBoard(
  filter: ClassFilterId,
  enabled: boolean,
): LeagueBoard {
  const [, revalidate] = useReducer((n: number) => n + 1, 0);

  // Bumped by retry. Nothing reads it; it exists to re-run the effect below.
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => {
    cache.delete(filter);
    setAttempt((n) => n + 1);
  }, [filter]);

  useEffect(() => {
    if (!enabled || read(filter)) return;

    let cancelled = false;
    const controller = new AbortController();

    const load = async () => {
      try {
        const response = await fetch(leagueUrl(filter), {
          headers: { accept: "application/json" },
          signal: controller.signal,
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const rows = parseLeague(await response.json());
        if (!rows) throw new Error("Unreadable league payload");

        cache.set(filter, { status: "ready", rows, at: Date.now() });
      } catch {
        // An abort means the filter changed and this answer is no longer
        // wanted, so it must not be recorded as a failure of the new one.
        if (controller.signal.aborted) return;
        cache.set(filter, { status: "error", rows: NO_ROWS, at: Date.now() });
      }

      if (!cancelled) revalidate();
    };

    void load();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [filter, enabled, attempt]);

  // Boards that are not fetched are never pending, so they read as ready.
  if (!enabled) return { status: "ready", rows: NO_ROWS, retry };

  const entry = read(filter);
  if (!entry) return { status: "loading", rows: NO_ROWS, retry };

  return { status: entry.status, rows: entry.rows, retry };
}
