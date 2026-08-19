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

/** Query keys, short enough to survive being pasted into Discord. */
const KEY = {
  board: "board",
  filter: "class",
  page: "page",
  query: "q",
} as const;

export const QUERY_MAX = 40;

function readParams(search: string): BoardState {
  const params = new URLSearchParams(search);

  // Boards still waiting on an endpoint are not selectable, by URL either.
  const board = BOARDS.find(
    (entry) => entry.id === params.get(KEY.board) && !entry.soon,
  );

  // The filter has to be one this board's endpoint accepts: MMR refuses the
  // heal category that League allows, and a stale value would only 400.
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

/** Only non-default values reach the URL, so the plain page stays a plain URL. */
function writeParams(state: BoardState): string {
  const params = new URLSearchParams();
  if (state.board !== DEFAULTS.board) params.set(KEY.board, state.board);
  if (state.filter !== DEFAULTS.filter) params.set(KEY.filter, state.filter);
  if (state.page !== DEFAULTS.page) params.set(KEY.page, String(state.page));
  // Kept verbatim, not trimmed: trimming here would eat spaces as they are typed.
  if (state.query) params.set(KEY.query, state.query);

  const query = params.toString();
  return query ? `?${query}` : "";
}

/** Fired after a same-document URL rewrite, which emits no native event. */
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

/**
 * The page ships prerendered with the default view, so the server snapshot must
 * be the empty query string. React re-reads the real URL once hydration is done
 * and re-renders if a link carried a different view.
 */
const getServerSnapshot = () => "";

/**
 * Board, class filter, page and search, held in the query string rather than in
 * component state: a row can be linked to, a refresh lands on the same view, and
 * there is only ever one source of truth.
 */
export function useBoardState() {
  const search = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const state = useMemo(() => readParams(search), [search]);

  const update = useCallback((patch: Partial<BoardState>) => {
    // Read the live URL rather than a captured value, so rapid changes compose.
    const next = { ...readParams(window.location.search), page: 1, ...patch };
    const url = `${window.location.pathname}${writeParams(next)}${window.location.hash}`;

    // replaceState, not pushState: switching a tab should not fill the back
    // button with steps the visitor has to walk out of.
    window.history.replaceState(null, "", url);
    window.dispatchEvent(new Event(URL_EVENT));
  }, []);

  return { state, update };
}
