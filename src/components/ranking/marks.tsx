import { Crown, ShieldChevron } from "@phosphor-icons/react";
import {
  CLASSES,
  SCHOOLS,
  classIconSrc,
  formatInt,
  type ClassId,
  type Gender,
  type GuildTier,
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

const TIER_STYLE: Record<GuildTier, string> = {
  S: "border-crimson bg-crimson/15 text-crimson-hot",
  A: "border-burgundy-700 bg-burgundy-800/60 text-blush",
  B: "border-burgundy-700 bg-burgundy-900/70 text-blush/90",
  C: "border-burgundy-900 bg-ink text-rose",
  D: "border-burgundy-900 bg-ink text-rose",
  E: "border-burgundy-900 bg-ink text-rose",
};

export function TierMark({ tier }: { tier: GuildTier }) {
  return (
    <span
      className={`notch-sm inline-flex h-7 w-7 items-center justify-center border ${TIER_STYLE[tier]}`}
      title={`Guild level ${tier}`}
    >
      <span className="stat-num text-[13px] leading-none">{tier}</span>
    </span>
  );
}

/** Guild emblem. Unbadged guilds show the game's own `[?]` placeholder. */
export function BadgeMark({ badge, tier }: { badge: boolean; tier: GuildTier }) {
  if (!badge) {
    return (
      <span
        className="label inline-flex h-7 w-7 items-center justify-center border border-burgundy-900 text-[10px] text-rose"
        title="No badge set"
      >
        ?
      </span>
    );
  }

  return (
    <span
      className={`notch-sm inline-flex h-7 w-7 items-center justify-center border ${
        tier === "S" || tier === "A"
          ? "border-crimson/60 bg-crimson/15 text-crimson-hot"
          : "border-burgundy-700 bg-burgundy-900/70 text-blush/80"
      }`}
      title="Guild badge"
    >
      <ShieldChevron size={15} weight="fill" aria-hidden="true" />
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
    <span className="inline-flex items-baseline gap-1.5" title={label}>
      <span className="stat-num text-[16px] leading-none text-win">
        {formatInt(gain)}
      </span>
      <span aria-hidden="true" className="text-[13px] leading-none text-rose/70">
        –
      </span>
      <span className="stat-num text-[16px] leading-none text-crimson-hot">
        {formatInt(loss)}
      </span>
    </span>
  );
}
