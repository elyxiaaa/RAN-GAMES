import type { ReactNode } from "react";
import { Coins } from "@phosphor-icons/react";
import {
  CAP_LEVEL,
  CLASSES,
  SCHOOLS,
  formatGold,
  formatInt,
  rowKey,
  type BoardId,
  type BoardRow,
  type GoldRow,
  type GuildRow,
  type LeagueRow,
  type MmrRow,
} from "../../data/ranking";
import {
  ClassMark,
  GuildLevelMark,
  GuildTag,
  RankMark,
  SchoolCrest,
  ScoreSplit,
} from "./marks";

type Align = "left" | "center" | "right";

type From = "sm" | "md" | "lg";

type Cell<T> = {
  label: string;
  align?: Align;
  from?: From;
  hint?: string;
  rowHeader?: boolean;
  render: (row: T) => ReactNode;
};

const ALIGN: Record<Align, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const VISIBLE: Record<From, string> = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
};

const PAD =
  "px-2 py-3.5 align-middle first:pl-3 last:pr-3 sm:px-3 sm:first:pl-5 sm:last:pr-5";

function Name({
  name,
  rank,
  children,
}: {
  name: string;
  rank: number;
  children?: ReactNode;
}) {
  return (
    <>
      <span
        className={`block [overflow-wrap:anywhere] text-[15px] transition-colors ${
          rank <= 3
            ? "display normal-case text-[17px] text-blush"
            : "text-blush/90 group-hover:text-blush"
        }`}
      >
        {name}
      </span>
      {children ? (
        <span className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] leading-none text-rose lg:hidden">
          {children}
        </span>
      ) : null}
    </>
  );
}

function Folded({ until, children }: { until: From; children: ReactNode }) {
  const hide = { sm: "sm:hidden", md: "md:hidden", lg: "lg:hidden" }[until];
  return <span className={hide}>{children}</span>;
}

function Level({ level }: { level: number }) {
  return (
    <span
      className={`stat-num text-[15px] ${
        level === CAP_LEVEL ? "text-blush" : "text-rose"
      }`}
    >
      {level}
    </span>
  );
}

function Count({
  value,
  tone = "quiet",
}: {
  value: number;
  tone?: "quiet" | "loud" | "win" | "loss";
}) {
  const tones = {
    quiet: "text-rose",
    loud: "text-blush",
    win: "text-win",
    loss: "text-crimson-hot",
  } as const;

  return (
    <span className={`stat-num text-[15px] ${tones[tone]}`}>
      {formatInt(value)}
    </span>
  );
}

function Centred({ children }: { children: ReactNode }) {
  return <span className="flex justify-center">{children}</span>;
}

function playerCells<T extends LeagueRow | MmrRow | GoldRow>(
  fold: (row: T) => ReactNode,
): Cell<T>[] {
  return [
    { label: "Rank", render: (row) => <RankMark rank={row.rank} /> },
    {
      label: "Player Name",
      rowHeader: true,
      render: (row) => (
        <Name name={row.name} rank={row.rank}>
          {fold(row)}
        </Name>
      ),
    },
    {
      label: "Level",
      align: "center",
      from: "sm",
      render: (row) => <Level level={row.level} />,
    },
    {
      label: "Class",
      from: "md",
      render: (row) => <ClassMark classId={row.classId} gender={row.gender} />,
    },
    {
      label: "School",
      align: "center",
      from: "lg",
      render: (row) => (
        <Centred>
          <SchoolCrest school={row.school} />
        </Centred>
      ),
    },
  ];
}

const foldPlayer = (row: LeagueRow | MmrRow | GoldRow, withGuild: boolean) => (
  <>
    <Folded until="sm">Lv {row.level}</Folded>
    <Folded until="md">{CLASSES[row.classId].label}</Folded>
    <Folded until="lg">{SCHOOLS[row.school].short}</Folded>
    {withGuild ? (
      <Folded until="md">
        {row.guild ? `[${row.guild}]` : "No guild"}
      </Folded>
    ) : null}
  </>
);

const guildColumn = <T extends LeagueRow | MmrRow | GoldRow>(): Cell<T> => ({
  label: "Guild",
  from: "md",
  render: (row) => <GuildTag guild={row.guild} />,
});

const CELLS: {
  league: Cell<LeagueRow>[];
  mmr: Cell<MmrRow>[];
  gold: Cell<GoldRow>[];
  guild: Cell<GuildRow>[];
} = {
  league: [
    ...playerCells<LeagueRow>((row) => foldPlayer(row, true)),
    guildColumn<LeagueRow>(),
    {
      label: "League",
      align: "right",
      hint: "Ranked wins and losses this season",
      render: (row) => (
        <ScoreSplit
          gain={row.wins}
          loss={row.losses}
          label={`${row.wins} wins, ${row.losses} losses`}
        />
      ),
    },
  ],

  gold: [
    ...playerCells<GoldRow>((row) => foldPlayer(row, true)),
    guildColumn<GoldRow>(),
    {
      label: "Gold",
      align: "right",
      hint: "Gold carried on the character",
      render: (row) => (
        <span
          className="inline-flex items-center gap-0 text-crimson-hot sm:gap-2"
          title={`${formatInt(row.gold)} gold`}
        >
          <Coins
            size={15}
            weight="fill"
            aria-hidden="true"
            className="hidden shrink-0 sm:block"
          />
          <span className="stat-num text-[15px] leading-none text-blush sm:text-[16px]">
            {formatGold(row.gold)}
          </span>
        </span>
      ),
    },
  ],

  mmr: [
    ...playerCells<MmrRow>((row) => foldPlayer(row, true)),
    guildColumn<MmrRow>(),
    {
      label: "Rating",
      align: "right",
      hint: "Matchmaking rating, and the bracket it falls in",
      render: (row) => (
        <span
          className="inline-flex flex-col items-end gap-1"
          title={`${formatInt(row.rating)} rating, bracket ${row.bracket}`}
        >
          <span className="stat-num text-[15px] leading-none text-blush sm:text-[16px]">
            {formatInt(row.rating)}
          </span>
          <span className="label text-[9px] leading-none text-rose">
            Bracket {row.bracket}
          </span>
        </span>
      ),
    },
  ],

  guild: [
    { label: "Rank", render: (row) => <RankMark rank={row.rank} /> },
    {
      label: "Guild Name",
      rowHeader: true,
      render: (row) => (
        <Name name={row.guild} rank={row.rank}>
          <Folded until="md">Lv {row.level}</Folded>
          <Folded until="sm">{row.members} members</Folded>
          <Folded until="md">{row.online} online</Folded>
          <Folded until="lg">
            {row.alliance ? `${row.alliance} alliance` : "No alliance"}
          </Folded>
          <Folded until="lg">{formatInt(row.draws)} drawn</Folded>
        </Name>
      ),
    },
    {
      label: "Level",
      align: "center",
      from: "md",
      hint: "Guild level, 0 to 5",
      render: (row) => (
        <Centred>
          <GuildLevelMark level={row.level} />
        </Centred>
      ),
    },
    {
      label: "Alliance",
      align: "center",
      from: "lg",
      hint: "Guilds allied with this one",
      render: (row) => (
        <span
          className={`stat-num text-[15px] ${row.alliance ? "text-blush" : "text-rose"}`}
        >
          {row.alliance}
        </span>
      ),
    },
    {
      label: "Online",
      align: "center",
      from: "md",
      render: (row) => <OnlineShare online={row.online} members={row.members} />,
    },
    {
      label: "Members",
      align: "center",
      from: "sm",
      render: (row) => (
        <span className="stat-num text-[15px] text-blush">{row.members}</span>
      ),
    },
    {
      label: "Won",
      align: "right",
      render: (row) => (
        <>
          <span className="md:hidden">
            <ScoreSplit
              gain={row.wins}
              loss={row.losses}
              label={`${row.wins} won, ${row.losses} lost`}
            />
          </span>
          <span className="hidden md:inline">
            <Count value={row.wins} tone="win" />
          </span>
        </>
      ),
    },
    {
      label: "Lost",
      align: "right",
      from: "md",
      render: (row) => <Count value={row.losses} tone="loss" />,
    },
    {
      label: "Drawn",
      align: "right",
      from: "lg",
      hint: "Sieges that ended level",
      render: (row) => <Count value={row.draws} tone="loud" />,
    },
  ],
};

function OnlineShare({ online, members }: { online: number; members: number }) {
  const share = members ? Math.round((online / members) * 100) : 0;

  return (
    <span className="inline-flex flex-col items-center gap-1.5">
      <span className={`stat-num text-[15px] ${online ? "text-win" : "text-rose"}`}>
        {online}
      </span>
      <span
        aria-hidden="true"
        title={`${share}% of the roster online`}
        className="block h-[3px] w-10 bg-burgundy-900"
      >
        <span className="block h-full bg-win/80" style={{ width: `${share}%` }} />
      </span>
    </span>
  );
}

export function RankingTable({ board, rows }: { board: BoardId; rows: BoardRow[] }) {
  if (board === "gold") {
    return <Board cells={CELLS.gold} rows={rows as GoldRow[]} caption="Top players by gold" />;
  }
  if (board === "guild") {
    return <Board cells={CELLS.guild} rows={rows as GuildRow[]} caption="Top guilds" />;
  }
  if (board === "mmr") {
    return (
      <Board
        cells={CELLS.mmr}
        rows={rows as MmrRow[]}
        caption="Top players by matchmaking rating"
      />
    );
  }
  return (
    <Board cells={CELLS.league} rows={rows as LeagueRow[]} caption="Top players in the league" />
  );
}

function Board<T extends BoardRow>({
  cells,
  rows,
  caption,
}: {
  cells: Cell<T>[];
  rows: T[];
  caption: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">{caption}, ranked from first place</caption>

        <thead>
          <tr className="border-y border-burgundy-700 bg-ink/60">
            {cells.map((cell) => (
              <th
                key={cell.label}
                scope="col"
                title={cell.hint}
                className={`label whitespace-nowrap px-2 py-3 text-[10px] text-rose first:pl-3 last:pr-3 sm:px-3 sm:first:pl-5 sm:last:pr-5 ${
                  ALIGN[cell.align ?? "left"]
                } ${cell.from ? VISIBLE[cell.from] : ""}`}
              >
                {cell.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr
              key={rowKey(row)}
              style={{ animationDelay: `${index * 26}ms` }}
              className={`group animate-row-in border-b border-burgundy-900/70 transition-colors duration-150 last:border-b-0 hover:bg-burgundy-900/45 ${
                row.rank <= 3 ? "bg-burgundy-900/25" : ""
              }`}
            >
              {cells.map((cell) => {
                const className = `${PAD} ${ALIGN[cell.align ?? "left"]} ${
                  cell.from ? VISIBLE[cell.from] : ""
                }`;

                return cell.rowHeader ? (
                  <th
                    key={cell.label}
                    scope="row"
                    className={`${className} min-w-[7rem] font-normal sm:min-w-[9rem]`}
                  >
                    {cell.render(row)}
                  </th>
                ) : (
                  <td key={cell.label} className={`${className} whitespace-nowrap`}>
                    {cell.render(row)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
