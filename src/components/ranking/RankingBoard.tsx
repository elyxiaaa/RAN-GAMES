import {
  useEffect,
  useId,
  useRef,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowsClockwise,
  CaretLeft,
  CaretRight,
  MagnifyingGlass,
  X,
} from "@phosphor-icons/react";
import {
  BOARDS,
  CLASS_FILTERS,
  PAGE_SIZE,
  RANKING_META,
  formatInt,
  getBoardRows,
  rowSearchText,
  type ClassFilterId,
} from "../../data/ranking";
import { Podium } from "./Podium";
import { RankingTable } from "./RankingTable";
import { FILTER_ICON } from "./icons";
import { TierMark } from "./marks";
import { QUERY_MAX, useBoardState } from "./useBoardState";

/** Height of the sticky tab strip, so the filter rail can sit below it. */
const TABS_H = "52px";
const RAIL_TOP = `calc(var(--nav-h) + ${TABS_H} + 2rem)`;

export function RankingBoard() {
  const { state, update } = useBoardState();
  const reduce = useReducedMotion();
  const panelId = useId();
  const tabsRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const board = BOARDS.find((entry) => entry.id === state.board) ?? BOARDS[0];
  const activeFilter =
    CLASS_FILTERS.find((entry) => entry.id === state.filter) ?? CLASS_FILTERS[0];

  const rows = getBoardRows(board.id, state.filter);
  const term = state.query.trim().toLowerCase();
  const matched = term
    ? rows.filter((row) => rowSearchText(row).toLowerCase().includes(term))
    : rows;

  const pages = Math.max(1, Math.ceil(matched.length / PAGE_SIZE));
  const page = Math.min(state.page, pages);
  const start = (page - 1) * PAGE_SIZE;
  const visible = matched.slice(start, start + PAGE_SIZE);
  const noun = board.id === "guild" ? "guilds" : "fighters";

  // Paging or switching board replaces everything below the fold. If the table
  // has scrolled past the top of the panel, bring the panel back into view so
  // the new rows start where the eye already is.
  const view = `${board.id}:${state.filter}:${page}`;
  const lastView = useRef(view);

  useEffect(() => {
    if (lastView.current === view) return;
    lastView.current = view;

    const panel = panelRef.current;
    if (!panel) return;
    if (panel.getBoundingClientRect().top >= 0) return;

    panel.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  }, [view, reduce]);

  const focusIn = (container: HTMLElement | null, index: number) => {
    const items = container?.querySelectorAll<HTMLButtonElement>("[data-nav]");
    items?.[index]?.focus();
  };

  const onTabKeys = (event: KeyboardEvent<HTMLElement>) => {
    const index = BOARDS.findIndex((entry) => entry.id === board.id);
    const next = moveIndex(event.key, index, BOARDS.length, "horizontal");
    if (next === null) return;

    event.preventDefault();
    update({ board: BOARDS[next].id });
    focusIn(tabsRef.current, next);
  };

  return (
    <section id="board" className="bg-ink pb-20 lg:pb-28">
      {/* Sticks under the header bar so the boards stay switchable while a table
          scrolls past. */}
      <div className="sticky top-[var(--nav-h)] z-30 border-y border-burgundy-900 bg-ink/95 backdrop-blur-md">
        <div className="mx-auto max-w-shell px-4 sm:px-6 lg:px-10">
          <div
            ref={tabsRef}
            role="tablist"
            aria-label="Ranking boards"
            onKeyDown={onTabKeys}
            className="no-scrollbar -mx-1 flex items-stretch overflow-x-auto"
            style={{ height: TABS_H }}
          >
            {BOARDS.map((entry) => {
              const active = entry.id === board.id;

              return (
                <button
                  key={entry.id}
                  type="button"
                  role="tab"
                  data-nav
                  id={`${panelId}-tab-${entry.id}`}
                  aria-selected={active}
                  aria-controls={panelId}
                  tabIndex={active ? 0 : -1}
                  onClick={() => update({ board: entry.id })}
                  className={`label relative flex shrink-0 items-center px-3.5 text-[11px] transition-colors duration-150 sm:px-6 ${
                    active ? "text-blush" : "text-rose hover:text-blush"
                  }`}
                >
                  {entry.label}
                  {active ? (
                    reduce ? (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-3 bottom-0 h-[2px] bg-crimson"
                      />
                    ) : (
                      <motion.span
                        aria-hidden="true"
                        layoutId="ranking-tab-underline"
                        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-x-3 bottom-0 h-[2px] bg-crimson"
                      />
                    )
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div
        id={panelId}
        ref={panelRef}
        role="tabpanel"
        aria-labelledby={`${panelId}-tab-${board.id}`}
        tabIndex={-1}
        style={{ scrollMarginTop: RAIL_TOP }}
        className="mx-auto max-w-shell px-4 pt-10 sm:px-6 lg:px-10 lg:pt-14"
      >
        <header className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <span aria-hidden="true" className="mb-4 block h-[3px] w-10 bg-crimson" />
            <h2 className="display text-[30px] sm:text-[38px]">
              {board.title}
              {board.classFilters && state.filter !== "all" ? (
                <span className="text-crimson-hot">
                  {" / "}
                  {activeFilter.short}
                </span>
              ) : null}
            </h2>
            <p className="mt-3 max-w-[62ch] text-[14px] leading-relaxed text-rose">
              {board.lead}
            </p>
          </div>

          <Search
            value={state.query}
            onChange={(query) => update({ query })}
            label={
              board.id === "guild" ? "Find a guild" : "Find a player or guild"
            }
          />
        </header>

        {/* The rail keeps its column on every board, so switching tabs never
            shifts the table sideways. */}
        <div className="grid gap-8 lg:grid-cols-[210px_minmax(0,1fr)]">
          <div className="lg:sticky lg:self-start" style={{ top: RAIL_TOP }}>
            {board.classFilters ? (
              <ClassRail
                value={state.filter}
                onChange={(filter) => update({ filter })}
              />
            ) : board.id === "guild" ? (
              <GuildLegend />
            ) : (
              <GoldLegend />
            )}
          </div>

          <div className="min-w-0">
            <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-burgundy-900 pb-4">
              <p className="label text-[10px] text-rose">{board.metricNote}</p>
              <p role="status" className="text-[12px] text-rose">
                <span className="stat-num text-[13px] text-blush">
                  {formatInt(matched.length)}
                </span>{" "}
                {term ? `matching ${noun}` : `ranked ${noun}`}
              </p>
              <p className="ml-auto inline-flex items-center gap-2 text-[12px] text-rose">
                <ArrowsClockwise size={13} weight="bold" aria-hidden="true" />
                {RANKING_META.synced}
              </p>
            </div>

            {visible.length ? (
              <>
                {page === 1 && !term ? (
                  <Podium rows={matched} board={board.id} />
                ) : null}

                <div className="notch border border-burgundy-900 bg-ember">
                  <RankingTable board={board.id} rows={visible} />
                </div>

                <Pagination
                  page={page}
                  pages={pages}
                  onChange={(next) => update({ page: next })}
                  from={start + 1}
                  to={start + visible.length}
                  total={matched.length}
                />
              </>
            ) : (
              <Empty
                query={state.query}
                noun={noun}
                filter={board.classFilters ? activeFilter.label : null}
                onClear={() => update({ query: "" })}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Left rail                                                                 */
/* -------------------------------------------------------------------------- */

function ClassRail({
  value,
  onChange,
}: {
  value: ClassFilterId;
  onChange: (next: ClassFilterId) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onKeys = (event: KeyboardEvent<HTMLElement>) => {
    const index = CLASS_FILTERS.findIndex((entry) => entry.id === value);
    const next = moveIndex(event.key, index, CLASS_FILTERS.length, "both");
    if (next === null) return;

    event.preventDefault();
    onChange(CLASS_FILTERS[next].id);
    ref.current?.querySelectorAll<HTMLButtonElement>("[data-nav]")[next]?.focus();
  };

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label="Class ranking"
      onKeyDown={onKeys}
      className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0"
    >
      <p className="label hidden pb-3 text-[10px] text-rose lg:block">Class</p>

      {CLASS_FILTERS.map((entry) => {
        const active = entry.id === value;

        return (
          <button
            key={entry.id}
            type="button"
            role="radio"
            data-nav
            aria-checked={active}
            // The label shortens at small widths, so the name comes from here
            // instead of whichever span happens to be visible.
            aria-label={entry.label}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(entry.id)}
            className={`group flex min-h-11 shrink-0 items-center gap-2.5 border px-3.5 text-left transition-colors duration-150 lg:w-full ${
              active
                ? "border-crimson bg-burgundy-900/60 text-blush"
                : "border-burgundy-900 bg-ember text-rose hover:border-burgundy-700 hover:text-blush"
            }`}
          >
            <span
              aria-hidden="true"
              className={`shrink-0 transition-colors ${
                active ? "text-crimson-hot" : "text-rose group-hover:text-blush"
              }`}
            >
              {FILTER_ICON[entry.id]}
            </span>
            <span
              aria-hidden="true"
              className="label whitespace-nowrap text-[10px] lg:whitespace-normal"
            >
              <span className="lg:hidden">{entry.short}</span>
              <span className="hidden lg:inline">{entry.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function Legend({
  heading,
  children,
  note,
}: {
  heading: string;
  children: ReactNode;
  note: string;
}) {
  return (
    <aside className="border border-burgundy-900 bg-ember p-4">
      <p className="label text-[10px] text-rose">{heading}</p>
      {children}
      <p className="mt-4 border-t border-burgundy-900 pt-3 text-[12px] leading-relaxed text-rose">
        {note}
      </p>
    </aside>
  );
}

/** The gold column is abbreviated, so the rail spells the units out. */
function GoldLegend() {
  const units = [
    { symbol: "B", label: "Billions" },
    { symbol: "M", label: "Millions" },
    { symbol: "K", label: "Thousands" },
  ];

  return (
    <Legend heading="Reading gold" note="Hover a figure for the exact amount.">
      <dl className="mt-3 flex flex-col gap-2 lg:mt-4">
        {units.map((unit) => (
          <div key={unit.symbol} className="flex items-baseline gap-3">
            <dt className="stat-num w-5 text-[15px] text-crimson-hot">
              {unit.symbol}
            </dt>
            <dd className="text-[13px] text-blush/90">{unit.label}</dd>
          </div>
        ))}
      </dl>
    </Legend>
  );
}

/** The guild board's Level column holds a letter grade, which needs a key. */
function GuildLegend() {
  return (
    <Legend
      heading="Guild grade"
      note="Resu counts resurrections cast by members. Alliance counts allied guilds."
    >
      <div className="mt-3 flex flex-wrap gap-1.5 lg:mt-4">
        {(["S", "A", "B", "C", "D", "E"] as const).map((tier) => (
          <TierMark key={tier} tier={tier} />
        ))}
      </div>
      <p className="mt-3 text-[12px] leading-relaxed text-blush/90">
        S is the highest grade, E the lowest.
      </p>
    </Legend>
  );
}

/* -------------------------------------------------------------------------- */
/* Controls                                                                  */
/* -------------------------------------------------------------------------- */

function Search({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (next: string) => void;
  label: string;
}) {
  const id = useId();

  return (
    <div className="shrink-0">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="flex h-11 items-center gap-2.5 border border-burgundy-900 bg-ember pl-3.5 pr-1.5 transition-colors focus-within:border-crimson md:w-[264px]">
        <MagnifyingGlass
          size={16}
          weight="bold"
          aria-hidden="true"
          className="shrink-0 text-rose"
        />
        <input
          id={id}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape" && value) {
              event.preventDefault();
              onChange("");
            }
          }}
          placeholder={label}
          autoComplete="off"
          spellCheck={false}
          autoCapitalize="off"
          enterKeyHint="search"
          maxLength={QUERY_MAX}
          className="min-w-0 flex-1 bg-transparent text-[14px] text-blush outline-none placeholder:text-rose/85 [&::-webkit-search-cancel-button]:hidden"
        />
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          tabIndex={value ? 0 : -1}
          className={`flex h-9 w-9 shrink-0 items-center justify-center text-rose transition-colors hover:text-crimson-hot ${
            value ? "" : "invisible"
          }`}
        >
          <X size={15} weight="bold" />
        </button>
      </div>
    </div>
  );
}

function Pagination({
  page,
  pages,
  onChange,
  from,
  to,
  total,
}: {
  page: number;
  pages: number;
  onChange: (next: number) => void;
  from: number;
  to: number;
  total: number;
}) {
  if (pages === 1) {
    return (
      <p className="mt-5 text-[12px] text-rose">
        All{" "}
        <span className="stat-num text-[13px] text-blush">{formatInt(total)}</span>{" "}
        rows shown
      </p>
    );
  }

  return (
    <nav
      aria-label="Ranking pages"
      className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between"
    >
      <p className="text-[12px] text-rose">
        Showing{" "}
        <span className="stat-num text-[13px] text-blush">
          {from}–{to}
        </span>{" "}
        of <span className="stat-num text-[13px] text-blush">{formatInt(total)}</span>
      </p>

      <div className="flex items-center gap-1.5">
        <PageStep
          label="Previous page"
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
        >
          <CaretLeft size={15} weight="bold" />
        </PageStep>

        {pageSlots(page, pages).map((slot, index) =>
          slot === null ? (
            <span
              key={`gap-${index}`}
              aria-hidden="true"
              className="px-1 text-[13px] text-rose"
            >
              …
            </span>
          ) : (
            <button
              key={slot}
              type="button"
              onClick={() => onChange(slot)}
              aria-current={slot === page ? "page" : undefined}
              aria-label={`Page ${slot}`}
              className={`stat-num h-11 min-w-11 border px-2 text-[14px] transition-colors duration-150 ${
                slot === page
                  ? "border-crimson bg-crimson/15 text-blush"
                  : "border-burgundy-900 bg-ember text-rose hover:border-burgundy-700 hover:text-blush"
              }`}
            >
              {slot}
            </button>
          ),
        )}

        <PageStep
          label="Next page"
          disabled={page === pages}
          onClick={() => onChange(page + 1)}
        >
          <CaretRight size={15} weight="bold" />
        </PageStep>
      </div>
    </nav>
  );
}

function PageStep({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center border border-burgundy-900 bg-ember text-rose transition-colors duration-150 hover:border-crimson hover:text-blush disabled:pointer-events-none disabled:border-burgundy-900/60 disabled:text-rose/40"
    >
      {children}
    </button>
  );
}

/** Page numbers around the current one, with ellipses standing in for the rest. */
function pageSlots(page: number, pages: number): (number | null)[] {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);

  const wanted = new Set([1, pages, page, page - 1, page + 1]);
  const list = [...wanted]
    .filter((n) => n >= 1 && n <= pages)
    .sort((a, b) => a - b);

  const out: (number | null)[] = [];
  list.forEach((n, index) => {
    if (index && n - list[index - 1] > 1) out.push(null);
    out.push(n);
  });

  return out;
}

function Empty({
  query,
  noun,
  filter,
  onClear,
}: {
  query: string;
  noun: string;
  filter: string | null;
  onClear: () => void;
}) {
  const searching = Boolean(query.trim());

  return (
    <div className="notch border border-burgundy-900 bg-ember px-6 py-14 text-center">
      <p className="display text-[24px]">
        {searching ? "No one by that name" : "Nothing ranked yet"}
      </p>
      <p className="mx-auto mt-3 max-w-[46ch] break-words text-[14px] leading-relaxed text-rose">
        {searching ? (
          <>
            No {noun} matching “{query.trim()}”
            {filter && filter !== "All Top Class" ? ` under ${filter}` : ""}. Names
            are case insensitive, and only ranked characters appear here.
          </>
        ) : (
          <>This board fills up as soon as the first result of the season lands.</>
        )}
      </p>
      {searching ? (
        <button
          type="button"
          onClick={onClear}
          className="label mt-6 min-h-11 border border-burgundy-700 px-4 text-[10px] text-blush transition-colors duration-150 hover:border-crimson"
        >
          Clear search
        </button>
      ) : null}
    </div>
  );
}

/** Roving selection for the tab strip and the class rail. */
function moveIndex(
  key: string,
  index: number,
  length: number,
  axis: "horizontal" | "both",
): number | null {
  const forward = axis === "both" ? ["ArrowRight", "ArrowDown"] : ["ArrowRight"];
  const back = axis === "both" ? ["ArrowLeft", "ArrowUp"] : ["ArrowLeft"];

  if (forward.includes(key)) return (index + 1) % length;
  if (back.includes(key)) return (index - 1 + length) % length;
  if (key === "Home") return 0;
  if (key === "End") return length - 1;
  return null;
}
