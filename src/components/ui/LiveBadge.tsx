type LiveBadgeProps = {
  label?: string;
  live?: boolean;
  className?: string;
};

export function LiveBadge({
  label = "Live now",
  live = true,
  className = "",
}: LiveBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 border px-2.5 py-1.5 ${
        live
          ? "border-crimson/50 bg-ink/90 text-crimson-hot"
          : "border-burgundy-700 bg-ink/90 text-rose"
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className={`block h-1.5 w-1.5 rounded-full ${
          live ? "animate-live-pulse bg-crimson-hot" : "bg-rose"
        }`}
      />
      <span className="label text-[10px]">{label}</span>
    </span>
  );
}
