import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  BOARDS,
  CLASS_FILTERS,
  type BoardId,
  type ClassFilterId,
} from "../../data/ranking";

export type BoardState = {
  board: BoardId;
  filter: ClassFilterId;
  page: number;
  query: string;
};

const DEFAULTS: BoardState = {
  board: "league",
  filter: "all",
  page: 1,
  query: "",
};

const KEY = {
  board: "board",
  filter: "class",
  page: "page",
  query: "q",
} as const;

export const QUERY_MAX = 40;

function readParams(search: string): BoardState {
  const params = new URLSearchParams(search);

  const board = BOARDS.find(
    (entry) => entry.id === params.get(KEY.board) && !entry.soon,
  );

  const allowed = board?.categories ?? BOARDS[0].categories ?? [];
  const filter = CLASS_FILTERS.find(
    (entry) =>
      entry.id === params.get(KEY.filter) && allowed.includes(entry.id),
  );
  const page = Number.parseInt(params.get(KEY.page) ?? "", 10);

  return {
    board: board?.id ?? DEFAULTS.board,
    filter: filter?.id ?? DEFAULTS.filter,
    page: Number.isFinite(page) && page > 0 ? page : DEFAULTS.page,
    query: (params.get(KEY.query) ?? "").slice(0, QUERY_MAX),
  };
}

function writeParams(state: BoardState): string {
  const params = new URLSearchParams();
  if (state.board !== DEFAULTS.board) params.set(KEY.board, state.board);
  if (state.filter !== DEFAULTS.filter) params.set(KEY.filter, state.filter);
  if (state.page !== DEFAULTS.page) params.set(KEY.page, String(state.page));
  if (state.query) params.set(KEY.query, state.query);

  const query = params.toString();
  return query ? `?${query}` : "";
}

const URL_EVENT = "ranking:viewchange";

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(URL_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(URL_EVENT, onChange);
  };
}

const getSnapshot = () => window.location.search;

const getServerSnapshot = () => "";

export function useBoardState() {
  const search = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const state = useMemo(() => readParams(search), [search]);

  const update = useCallback((patch: Partial<BoardState>) => {
    const next = { ...readParams(window.location.search), page: 1, ...patch };
    const url = `${window.location.pathname}${writeParams(next)}${window.location.hash}`;

    window.history.replaceState(null, "", url);
    window.dispatchEvent(new Event(URL_EVENT));
  }, []);

  return { state, update };
}
