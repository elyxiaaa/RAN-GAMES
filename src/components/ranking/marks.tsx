import { useState } from "react";
import { Crown, ShieldChevron } from "@phosphor-icons/react";
import { guildIconUrl } from "../../data/boards";
import {
  CLASSES,
  GUILD_LEVEL_MAX,
  SCHOOLS,
  classIconSrc,
  formatInt,
  type ClassId,
  type Gender,
  type SchoolId,
} from "../../data/ranking";

/** Rank number. The first three seats carry the crimson, everything else reads quiet. */
export function RankMark({ rank }: { rank: number }) {
  const podium = rank <= 3;

  return (
    <span className="flex items-center gap-2">
      {rank === 1 ? (
        <Crown
          size={14}
          weight="fill"
          aria-hidden="true"
          className="shrink-0 text-crimson-hot"
        />
      ) : null}
      <span
        className={`stat-num text-[17px] leading-none ${
          podium ? "text-crimson-hot" : "text-rose"
        }`}
      >
        {rank}
      </span>
    </span>
  );
}

/**
 * The game's own class portrait, one per class and body. Decorative: every
 * place it appears sits next to the class name in text.
 */
export function ClassIcon({
  classId,
  gender,
  size = 20,
}: {
  classId: ClassId;
  gender: Gender;
  size?: number;
}) {
  return (
    <img
      src={classIconSrc(classId, gender)}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      className="block shrink-0 object-contain"
      style={{ width: size, height: size }}
    />
  );
}

export function ClassMark({
  classId,
  gender,
}: {
  classId: ClassId;
  gender: Gender;
}) {
  return (
    <span className="inline-flex items-center gap-2 text-rose transition-colors group-hover:text-blush">
      <ClassIcon classId={classId} gender={gender} />
      <span className="label whitespace-nowrap text-[10px]">
        {CLASSES[classId].label}
      </span>
    </span>
  );
}

export function SchoolCrest({
  school,
  size = 26,
}: {
  school: SchoolId;
  size?: number;
}) {
  const meta = SCHOOLS[school];

  return (
    <img
      src={meta.crest}
      alt={meta.name}
      title={meta.name}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      className="block shrink-0 object-contain"
      style={{ width: size, height: size }}
    />
  );
}

export function GuildTag({ guild }: { guild: string | null }) {
  if (!guild) {
    return (
      <span className="text-[13px] text-rose" title="No guild">
        —
      </span>
    );
  }

  return (
    <span className="inline-flex max-w-full items-center gap-1 text-[13px] text-blush/85">
      <span aria-hidden="true" className="text-crimson-hot/80">
        [
      </span>
      <span className="truncate">{guild}</span>
      <span aria-hidden="true" className="text-crimson-hot/80">
        ]
      </span>
    </span>
  );
}

/**
 * Guild level styling. The server reports a plain 0 to 5 in `guRank`, so that
 * is what is shown: the letter grades this once carried were invented by the
 * placeholder data and match nothing a player sees in game.
 */
function levelStyle(level: number): string {
  if (level >= GUILD_LEVEL_MAX) {
    return "border-crimson bg-crimson/15 text-crimson-hot";
  }
  if (level >= 4) return "border-burgundy-700 bg-burgundy-800/60 text-blush";
  if (level >= 2) return "border-burgundy-700 bg-burgundy-900/70 text-blush/90";
  return "border-burgundy-900 bg-ink text-rose";
}

export function GuildLevelMark({ level }: { level: number }) {
  return (
    <span
      className={`notch-sm inline-flex h-7 w-7 items-center justify-center border ${levelStyle(level)}`}
      title={`Guild level ${level} of ${GUILD_LEVEL_MAX}`}
    >
      <span className="stat-num text-[13px] leading-none">{level}</span>
    </span>
  );
}

/**
 * Guild emblem: the bitmap the guild drew in game, fetched by guild number.
 *
 * Unbadged guilds show the game's own `[?]` placeholder. A badged guild whose
 * emblem will not load falls back to the generic mark rather than a broken
 * image, so the board stays readable while that one endpoint is unreachable.
 */
export function BadgeMark({
  badge,
  level,
  guNum,
  guild,
}: {
  badge: boolean;
  level: number;
  guNum: number;
  guild: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!badge) {
    return (
      <span
        className="label inline-flex h-7 w-7 items-center justify-center border border-burgundy-900 text-[10px] text-rose"
        title="No emblem set"
      >
        ?
      </span>
    );
  }

  const frame = `notch-sm inline-flex h-7 w-7 items-center justify-center border ${
    level >= 4
      ? "border-crimson/60 bg-crimson/15 text-crimson-hot"
      : "border-burgundy-700 bg-burgundy-900/70 text-blush/80"
  }`;

  return (
    <span className={frame} title={`${guild} emblem`}>
      {failed ? (
        <ShieldChevron size={15} weight="fill" aria-hidden="true" />
      ) : (
        <img
          src={guildIconUrl(guNum)}
          alt=""
          aria-hidden="true"
          width={18}
          height={18}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          // Emblems are tiny bitmaps drawn pixel by pixel in game. Letting the
          // browser smooth one on the way up turns pixel art into mush.
          className="block h-[18px] w-[18px] [image-rendering:pixelated]"
        />
      )}
    </span>
  );
}

/**
 * The game's two toned score: gains in green, losses in red, split by a dash.
 * Used for league wins/losses and PK kills/deaths.
 */
export function ScoreSplit({
  gain,
  loss,
  label,
}: {
  gain: number;
  loss: number;
  label: string;
}) {
  return (
    <span className="inline-flex items-baseline gap-1 sm:gap-1.5" title={label}>
      <span className="stat-num text-[15px] leading-none text-win sm:text-[16px]">
        {formatInt(gain)}
      </span>
      <span aria-hidden="true" className="text-[12px] leading-none text-rose/70">
        –
      </span>
      <span className="stat-num text-[15px] leading-none text-crimson-hot sm:text-[16px]">
        {formatInt(loss)}
      </span>
    </span>
  );
}
