import { Crown } from "@phosphor-icons/react";
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
    <span
      className="inline-flex max-w-full items-center gap-1 text-[13px] text-blush/85"
      title={guild}
    >
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
