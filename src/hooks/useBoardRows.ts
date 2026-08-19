import { useCallback, useEffect, useReducer, useState } from "react";
import { boardUrl, parseBoard } from "../data/boards";
import type { BoardId, BoardRow, ClassFilterId } from "../data/ranking";

/** Matches the edge TTL in server/routes.ts, so the two cannot disagree. */
const FRESH_MS = 300_000;

export type BoardStatus = "loading" | "ready" | "error";

export type Board = {
  status: BoardStatus;
  rows: BoardRow[];
  /** Discards the cached answer for this board and fetches it again. */
  retry: () => void;
};

type Entry = {
  status: "ready" | "error";
  rows: BoardRow[];
  at: number;
};

/**
 * One entry per board and filter, so switching back to something already seen
 * is instant and costs no request. Module scope rather than component state,
 * because the tabs and rail are switched often and no board exceeds 50 rows.
 */
const cache = new Map<string, Entry>();

/** Stable identity, so a board with no rows does not re-render its children. */
const NO_ROWS: BoardRow[] = [];

/**
 * Fetches in progress, keyed the same as the cache. Two components can want the
 * same board at once -- the ranking header counts guilds while the board itself
 * lists them -- and without this they would each fire their own request.
 */
const inflight = new Map<string, Promise<void>>();

/**
 * Boards without a class rail always use the same key, so a filter left over
 * from another tab cannot split their cache or trigger a pointless refetch.
 */
function keyFor(board: BoardId, filter: ClassFilterId, filtered: boolean) {
  return filtered ? `${board}:${filter}` : board;
}

function read(key: string): Entry | null {
  const entry = cache.get(key);
  if (!entry) return null;
  return Date.now() - entry.at < FRESH_MS ? entry : null;
}

/**
 * Rows for one board, at one class filter.
 *
 * The answer is derived from the module cache during render rather than copied
 * into state by an effect, so there is no render-then-correct pass. The effect
 * only fetches; finishing a fetch bumps a counter to re-read the cache.
 *
 * With an empty cache the first render is always `loading`, on the server and
 * in the browser alike, so prerendered and hydrated markup agree.
 *
 * `filtered` says whether this board's endpoint takes the class filter at all.
 * A board still waiting on an endpoint (PK Map) never fetches and never leaves
 * `loading`; the caller shows its own copy for that case instead.
 */
export function useBoardRows(
  board: BoardId,
  filter: ClassFilterId,
  filtered: boolean,
): Board {
  const [, revalidate] = useReducer((n: number) => n + 1, 0);

  // Bumped by retry. Nothing reads it; it exists to re-run the effect below.
  const [attempt, setAttempt] = useState(0);

  const key = keyFor(board, filter, filtered);

  const retry = useCallback(() => {
    cache.delete(key);
    setAttempt((n) => n + 1);
  }, [key]);

  useEffect(() => {
    // Compared inline so the type narrows for boardUrl and parseBoard, which
    // only accept boards that actually have an endpoint.
    if (board === "pk" || read(key)) return;

    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetch(boardUrl(board, filter), {
          headers: { accept: "application/json" },
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const rows = parseBoard(board, await response.json());
        if (!rows) throw new Error("Unreadable board payload");

        cache.set(key, { status: "ready", rows, at: Date.now() });
      } catch {
        cache.set(key, { status: "error", rows: NO_ROWS, at: Date.now() });
      }
    };

    // Deliberately not aborted on unmount: the request is shared, so one caller
    // leaving must not cancel it for another. Every answer lands under its own
    // cache key, so a switch away cannot be recorded against the new board --
    // it only stops this component from reacting to the old one.
    let pending = inflight.get(key);
    if (!pending) {
      pending = load().finally(() => inflight.delete(key));
      inflight.set(key, pending);
    }

    void pending.then(() => {
      if (!cancelled) revalidate();
    });

    return () => {
      cancelled = true;
    };
  }, [board, filter, key, attempt]);

  // A board with no endpoint yet never resolves; the caller shows its own copy.
  if (board === "pk") return { status: "loading", rows: NO_ROWS, retry };

  const entry = read(key);
  if (!entry) return { status: "loading", rows: NO_ROWS, retry };

  return { status: entry.status, rows: entry.rows, retry };
}
