import { useCallback, useEffect, useReducer, useState } from "react";
import { boardUrl, parseBoard } from "../data/boards";
import type { BoardId, BoardRow, ClassFilterId } from "../data/ranking";

const FRESH_MS = 300_000;

export type BoardStatus = "loading" | "ready" | "error";

export type Board = {
  status: BoardStatus;
  rows: BoardRow[];
  retry: () => void;
};

type Entry = {
  status: "ready" | "error";
  rows: BoardRow[];
  at: number;
};

const cache = new Map<string, Entry>();

const NO_ROWS: BoardRow[] = [];

const inflight = new Map<string, Promise<void>>();

function keyFor(board: BoardId, filter: ClassFilterId, filtered: boolean) {
  return filtered ? `${board}:${filter}` : board;
}

function read(key: string): Entry | null {
  const entry = cache.get(key);
  if (!entry) return null;
  return Date.now() - entry.at < FRESH_MS ? entry : null;
}

export function useBoardRows(
  board: BoardId,
  filter: ClassFilterId,
  filtered: boolean,
): Board {
  const [, revalidate] = useReducer((n: number) => n + 1, 0);

  const [attempt, setAttempt] = useState(0);

  const key = keyFor(board, filter, filtered);

  const retry = useCallback(() => {
    cache.delete(key);
    setAttempt((n) => n + 1);
  }, [key]);

  useEffect(() => {
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

  if (board === "pk") return { status: "loading", rows: NO_ROWS, retry };

  const entry = read(key);
  if (!entry) return { status: "loading", rows: NO_ROWS, retry };

  return { status: entry.status, rows: entry.rows, retry };
}
