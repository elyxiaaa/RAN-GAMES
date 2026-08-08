import type { ReactNode } from "react";
import { Lightning, WifiHigh, WindowsLogo } from "@phosphor-icons/react";
import { MIN_SPECS, TIERS } from "../data/content";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

const GROUP_ICONS: Record<string, ReactNode> = {
  minimum: <WindowsLogo size={20} weight="fill" />,
  recommended: <Lightning size={20} weight="fill" />,
  network: <WifiHigh size={20} weight="bold" />,
};

const RAIL: Record<number, string> = {
  3: "border-crimson",
  2: "border-burgundy-700",
  1: "border-burgundy-900",
};

const TIER_TYPE: Record<number, string> = {
  3: "text-[40px] sm:text-[52px] text-blush",
  2: "text-[34px] sm:text-[44px] text-blush",
  1: "text-[30px] sm:text-[38px] text-rose",
};

export function Compatibility() {
  return (
    <section
      id="compatibility"
      className="border-b border-burgundy-900 bg-ink py-20 lg:py-28"
    >
      <div className="mx-auto max-w-shell px-4 sm:px-6 lg:px-10">
        <SectionHeading
          title="Will it run"
          lead="Three performance bands, measured on retail desktop hardware at 1440p and shipped settings. Find your band, then check the floor below it."
        />

        <div className="flex flex-col">
          {TIERS.map((tier, index) => (
            <Reveal
              as="article"
              key={tier.id}
              index={index}
              className={`grid gap-x-8 gap-y-4 border-l-2 py-8 pl-5 sm:pl-7 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)_auto] lg:items-center ${
                RAIL[tier.weight]
              } ${index > 0 ? "border-t border-t-burgundy-900" : ""}`}
            >
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1.5 lg:block">
                <h3 className={`display leading-none ${TIER_TYPE[tier.weight]}`}>
                  {tier.name}
                </h3>
                <p className="lg:mt-3">
                  <span className="stat-num text-[22px] leading-none text-crimson-hot">
                    {tier.fps}
                  </span>
                  <span className="label ml-2 text-[10px] text-rose">
                    {tier.fpsNote}
                  </span>
                </p>
              </div>

              <div>
                <p className="text-[15px] leading-relaxed text-blush">
                  {tier.summary}
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-rose">
                  {tier.devices}
                </p>
              </div>

              <p className="label justify-self-start border border-burgundy-700 px-3 py-2 text-[10px] text-rose lg:justify-self-end">
                {tier.memory}
              </p>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 border-t border-burgundy-900 pt-12">
          <h3 className="display text-[26px] sm:text-[30px]">System requirements</h3>
          <div className="mt-8 grid gap-x-10 gap-y-12 md:grid-cols-3">
            {MIN_SPECS.map((group, index) => (
              <Reveal key={group.id} index={index}>
                <div className="flex items-center gap-3 text-crimson-hot">
                  <span aria-hidden="true">{GROUP_ICONS[group.id]}</span>
                  <h4 className="display text-[19px] text-blush">
                    {group.heading}
                  </h4>
                </div>
                <dl className="mt-5 flex flex-col gap-4">
                  {group.rows.map((row) => (
                    <div key={row.label}>
                      <dt className="label text-[10px] text-rose">
                        {row.label}
                      </dt>
                      <dd className="mt-1 text-[14px] leading-snug text-blush">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
