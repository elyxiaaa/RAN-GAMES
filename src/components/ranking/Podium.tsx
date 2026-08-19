import type { ReactNode } from "react";
import { Trophy, UsersThree } from "@phosphor-icons/react";
import {
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
  type SchoolId,
} from "../../data/ranking";
import { ClassIcon, GuildTag, SchoolCrest } from "./marks";

type Seat = {
  rank: number;
  name: string;
  /** Short label under the name: class for players, roster size for guilds. */
  detail: string;
  detailIcon: ReactNode;
  levelLabel: string;
  school: SchoolId | null;
  /** `undefined` means the board has no guild column at all. */
  guild?: string | null;
  score: ReactNode;
  scoreTitle?: string;
  /** What the board ranks on, used to measure the gap to first place. */
  value: number;
  /** Reads the headline number once, on the first seat only. */
  metricNote: string;
  /** Singular and plural of the ranked unit, or null when it is gold. */
  unit: [string, string] | null;
};

/** The game's two toned number, sized for the podium. */
function split(gain: number, loss: number) {
  return (
    <>
      <span className="text-win">{formatInt(gain)}</span>
      <span aria-hidden="true" className="px-2 text-rose/70">
        –
      </span>
      <span className="text-crimson-hot">{formatInt(loss)}</span>
    </>
  );
}

function seatOf(row: BoardRow, board: BoardId): Seat {
  if (board === "guild") {
    const guild = row as GuildRow;
    return {
      rank: guild.rank,
      name: guild.guild,
      detail: `${guild.members} members, ${guild.online} online`,
      detailIcon: <UsersThree size={15} weight="fill" />,
      levelLabel: `Lv ${guild.level}`,
      school: null,
      score: split(guild.wins, guild.losses),
      value: guild.wins,
      metricNote: "Wins – Losses",
      unit: ["win", "wins"],
    };
  }

  const player = row as LeagueRow | MmrRow | GoldRow;
  const base = {
    rank: player.rank,
    name: player.name,
    detail: CLASSES[player.classId].label,
    detailIcon: <ClassIcon classId={player.classId} gender={player.gender} />,
    levelLabel: `Lv ${player.level}`,
    school: player.school,
  };

  if (board === "gold") {
    const gold = row as GoldRow;
    return {
      ...base,
      guild: gold.guild,
      score: <span className="text-blush">{formatGold(gold.gold)}</span>,
      scoreTitle: `${formatInt(gold.gold)} gold`,
      value: gold.gold,
      metricNote: "Gold on hand",
      unit: null,
    };
  }

  if (board === "league") {
    const league = row as LeagueRow;
    return {
      ...base,
      guild: league.guild,
      score: split(league.wins, league.losses),
      value: league.wins,
      metricNote: "Wins – Losses",
      unit: ["win", "wins"],
    };
  }

  const mmr = row as MmrRow;
  return {
    ...base,
    guild: mmr.guild,
    score: <span className="text-blush">{formatInt(mmr.rating)}</span>,
    scoreTitle: `${formatInt(mmr.rating)} rating, bracket ${mmr.bracket}`,
    value: mmr.rating,
    metricNote: `Rating · bracket ${mmr.bracket}`,
    unit: ["point", "points"],
  };
}

/**
 * Second and third seats trade the metric label for their distance to first.
 * Repeating "Wins – Losses" three times across one row said nothing.
 */
function noteFor(seat: Seat, leader: Seat): string {
  if (seat.rank === leader.rank) return seat.metricNote;

  const gap = leader.value - seat.value;
  if (gap <= 0) return "Level with first";
  if (!seat.unit) return `${formatGold(gap)} behind first`;

  const [one, many] = seat.unit;
  return `${formatInt(gap)} ${gap === 1 ? one : many} behind first`;
}

export function Podium({ rows, board }: { rows: BoardRow[]; board: BoardId }) {
  if (rows.length < 3) return null;

  const top = rows.slice(0, 3);
  const seats = top.map((row) => seatOf(row, board));
  const [leader] = seats;

  return (
    <div className="mb-6">
      <h3 className="sr-only">Top three</h3>
      <ol className="grid gap-4 lg:grid-cols-[1.3fr_1fr_1fr]">
        {top.map((row, index) => (
          <PodiumCard
            key={rowKey(row)}
            seat={seats[index]}
            note={noteFor(seats[index], leader)}
            lead={index === 0}
            index={index}
          />
        ))}
      </ol>
    </div>
  );
}

function PodiumCard({
  seat,
  note,
  lead,
  index,
}: {
  seat: Seat;
  note: string;
  lead: boolean;
  index: number;
}) {
  return (
    <li
      style={{ animationDelay: `${index * 70}ms` }}
      className={`notch relative flex animate-row-in flex-col overflow-hidden border p-5 sm:p-6 ${
        lead
          ? "border-burgundy-700 bg-[linear-gradient(150deg,rgba(78,23,28,0.6)_0%,rgba(12,8,5,1)_62%)]"
          : "border-burgundy-900 bg-ember"
      }`}
    >
      {seat.school ? (
        <img
          src={SCHOOLS[seat.school].crest}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          // Cropped to the emblem: the crest art ends in a school wordmark,
          // and the card's overflow cut it mid-word, which read as broken text
          // rather than as a watermark.
          className={`pointer-events-none absolute -right-5 -top-5 select-none object-cover object-top ${
            lead ? "opacity-[0.16]" : "opacity-[0.09]"
          }`}
          style={{ width: lead ? 190 : 140, height: lead ? 148 : 109 }}
        />
      ) : null}

      <span
        aria-hidden="true"
        className={`absolute left-0 top-0 h-[3px] ${
          lead ? "w-28 bg-crimson" : "w-16 bg-burgundy-700"
        }`}
      />

      <div className="relative flex items-center gap-3">
        <span
          className={`stat-num leading-none ${
            lead ? "text-[32px] text-crimson-hot" : "text-[24px] text-rose"
          }`}
        >
          {String(seat.rank).padStart(2, "0")}
        </span>
        {lead ? (
          <Trophy
            size={19}
            weight="fill"
            aria-hidden="true"
            className="text-crimson-hot"
          />
        ) : null}
        <span className="label ml-auto text-[10px] text-rose">
          {seat.levelLabel}
        </span>
      </div>

      <h4
        className={`display relative mt-4 normal-case [overflow-wrap:anywhere] ${
          lead ? "text-[34px] sm:text-[42px]" : "text-[25px] sm:text-[29px]"
        }`}
      >
        {seat.name}
      </h4>

      <div className="relative mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[12px] text-rose">
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="shrink-0">
            {seat.detailIcon}
          </span>
          {seat.detail}
        </span>
        {seat.guild !== undefined ? <GuildTag guild={seat.guild} /> : null}
        {seat.school ? (
          <span className="ml-auto">
            <SchoolCrest school={seat.school} size={28} />
          </span>
        ) : null}
      </div>

      <div
        className={`relative border-t border-burgundy-900 pt-4 ${
          lead ? "mt-8" : "mt-6"
        }`}
      >
        <p
          title={seat.scoreTitle}
          className={`stat-num leading-none ${
            lead ? "text-[38px] sm:text-[44px]" : "text-[27px]"
          }`}
        >
          {seat.score}
        </p>
        <p className="label mt-2.5 text-[10px] text-rose">{note}</p>
      </div>
    </li>
  );
}
