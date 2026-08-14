import { CaretRight } from "@phosphor-icons/react";
import { MEDIA } from "../../data/content";
import { RANKING_META } from "../../data/ranking";
import { LiveBadge } from "../ui/LiveBadge";

export function RankingHeader() {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-burgundy-900 bg-ink"
    >
      <img
        src={MEDIA.trailerPoster}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="async"
        className="duotone pointer-events-none absolute inset-0 h-full w-full select-none object-cover opacity-30"
      />
      <span
        aria-hidden="true"
        className="scanlines pointer-events-none absolute inset-0 opacity-40"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(115%_100%_at_18%_0%,rgba(110,13,21,0.55)_0%,rgba(10,7,7,0.86)_46%,rgba(10,7,7,1)_100%)]"
      />

      <div className="relative mx-auto max-w-shell px-4 pb-16 pt-[calc(var(--nav-h)+2.25rem)] sm:px-6 lg:px-10 lg:pb-20 lg:pt-[calc(var(--nav-h)+4rem)]">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-[12px] text-rose">
            <li>
              <a
                href="/"
                className="inline-block py-1 transition-colors hover:text-crimson-hot"
              >
                Home
              </a>
            </li>
            <li aria-hidden="true" className="text-rose/40">
              <CaretRight size={11} weight="bold" />
            </li>
            <li aria-current="page" className="text-blush">
              Rankings
            </li>
          </ol>
        </nav>

        <div className="grid gap-12 lg:grid-cols-[1.5fr_minmax(0,1fr)] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <LiveBadge label="Ladder live" />
              <span className="label border border-burgundy-700 px-2.5 py-1.5 text-[10px] text-rose">
                {RANKING_META.realm} · {RANKING_META.season}
              </span>
            </div>

            <h1 className="display mt-6 text-[54px] sm:text-[74px] lg:text-[92px]">
              Rankings
            </h1>

            <p className="mt-5 max-w-[60ch] text-pretty text-[15px] leading-relaxed text-blush/90 sm:text-[16px]">
              Every board the game keeps, in one place. League standings, the gold
              count, guild power and the PK map, rebuilt from the live database
              every {RANKING_META.interval}.
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {RANKING_META.stats.map((stat) => (
              <div
                key={stat.id}
                className="notch-sm flex flex-col-reverse gap-1.5 border border-burgundy-900 bg-ink/80 p-4 lg:flex-row lg:items-baseline lg:justify-between lg:gap-4"
              >
                <dt className="label text-[10px] text-rose">{stat.label}</dt>
                <dd className="stat-num text-[28px] leading-none lg:text-[30px]">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
