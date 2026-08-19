import { DiscordLogo, Globe, Timer } from "@phosphor-icons/react";
import {
  LINKS,
  REALMS,
  SERVER_DETAILS,
  SERVER_STATS,
  type Realm,
} from "../data/content";
import { Button } from "./ui/Button";
import { LiveBadge } from "./ui/LiveBadge";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

export function ServerInfo() {
  const [flagship, ...rest] = REALMS;
  const alone = rest.length === 0;

  return (
    <section
      id="servers"
      className="border-b border-burgundy-900 bg-ember py-20 lg:py-28"
    >
      <div className="mx-auto max-w-shell px-4 sm:px-6 lg:px-10">
        <SectionHeading
          title="Server information"
          lead="One region, one client, one channel. Everybody plays in the same place, so the numbers below are the whole server and not a slice of it."
        />

        <Reveal>
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {SERVER_STATS.map((stat) => (
              <div
                key={stat.id}
                className="notch-sm flex flex-col-reverse gap-2.5 border border-burgundy-900 bg-ink p-5 sm:p-6"
              >
                <dt className="label text-[10px] text-rose">{stat.label}</dt>
                <dd
                  className={`stat-num leading-none ${
                    stat.phrase
                      ? "text-[22px] sm:text-[25px]"
                      : "text-[36px] sm:text-[42px]"
                  }`}
                >
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <Reveal className={alone ? "lg:col-span-12" : "lg:col-span-7"}>
            <RealmTile realm={flagship} featured wide={alone} />
          </Reveal>
          {rest.map((realm, index) => (
            <Reveal key={realm.id} index={index + 1} className="lg:col-span-5">
              <RealmTile realm={realm} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 border-t border-burgundy-900 pt-12">
          <h3 className="display text-[26px] sm:text-[30px]">Server details</h3>
          <dl className="mt-8 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {SERVER_DETAILS.map((row) => (
              <div key={row.label}>
                <dt className="label text-[10px] text-rose">{row.label}</dt>
                <dd className="mt-2 text-[15px] leading-snug text-blush">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

function RealmTile({
  realm,
  featured = false,
  wide = false,
}: {
  realm: Realm;
  featured?: boolean;
  wide?: boolean;
}) {
  const live = realm.status === "live";

  return (
    <article
      className={`notch relative flex h-full flex-col border p-6 sm:p-8 ${
        live
          ? "border-burgundy-700 bg-[linear-gradient(155deg,rgba(78,23,28,0.55)_0%,rgba(12,8,5,1)_58%)]"
          : "border-burgundy-900 bg-ink"
      }`}
    >
      <div className="flex flex-wrap items-center gap-3">
        <LiveBadge label={realm.statusLabel} live={live} />
        <span className="inline-flex items-center gap-1.5 text-[12px] text-rose">
          <Globe size={14} weight="bold" aria-hidden="true" />
          Asia Pacific
        </span>
      </div>

      <h3
        className={`display mt-5 ${
          featured
            ? wide
              ? "text-[56px] sm:text-[76px] lg:text-[88px]"
              : "text-[52px] sm:text-[68px]"
            : "text-[42px] sm:text-[52px]"
        } ${live ? "text-blush" : "text-rose"}`}
      >
        {realm.name}
      </h3>

      <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-rose">
        {realm.blurb}
      </p>

      <dl
        className={`mt-7 grid gap-x-6 gap-y-5 border-t border-burgundy-900 pt-6 ${
          featured
            ? wide
              ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
              : "grid-cols-2 sm:grid-cols-3"
            : "grid-cols-2"
        }`}
      >
        {realm.specs.map((spec) => (
          <div key={spec.label}>
            <dt className="label text-[10px] text-rose">{spec.label}</dt>
            <dd className="stat-num mt-1.5 text-[22px] leading-none">
              {spec.value}
            </dd>
          </div>
        ))}
      </dl>

      {!live ? (
        <div className="mt-7 flex flex-wrap items-center gap-4 border-t border-burgundy-900 pt-6">
          <Button
            as="a"
            href={LINKS.discord}
            target="_blank"
            rel="noreferrer"
            variant="ghost"
            icon={<DiscordLogo size={17} weight="fill" />}
          >
            Discord
          </Button>
          <span className="inline-flex items-center gap-1.5 text-[12px] text-rose">
            <Timer size={14} weight="bold" aria-hidden="true" />
            Launch time posted one week ahead
          </span>
        </div>
      ) : null}

      {live ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 h-[3px] w-24 bg-crimson"
        />
      ) : null}
    </article>
  );
}
