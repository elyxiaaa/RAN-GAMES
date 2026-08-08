import type { ReactNode } from "react";
import { GameController, Hammer, Student, Sword } from "@phosphor-icons/react";
import { MEDIA } from "../data/content";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

type Cell = {
  id: string;
  title: string;
  body: string;
  icon: ReactNode;
  span: string;
  image?: string;
  imageAlt?: string;
  tint?: boolean;
};

const CELLS: Cell[] = [
  {
    id: "hunt",
    title: "Hunt your gear",
    body: "Levels come off the field. Party up, pull, and hold a spot for as long as it keeps paying. No stamina meter, no daily cap, and no bundle on sale anywhere that skips the climb for you.",
    icon: <Sword size={26} weight="bold" />,
    span: "lg:col-span-7 lg:row-span-2",
    image: MEDIA.featureHunt,
    imageAlt:
      "Players fighting through a rain soaked Leonine campus lit by fire",
  },
  {
    id: "refine",
    title: "Refine based economy",
    body: "Nothing worth wearing drops finished. Ore, scrolls and sockets pass through player hands first, and the price is whatever the trading hole says it is this week.",
    icon: <Hammer size={26} weight="bold" />,
    span: "lg:col-span-5",
    tint: true,
  },
  {
    id: "school",
    title: "Pick your school",
    body: "Three schools, one campus, no truce. Sacred Gate, Mystic Peak and Phoenix share every hunting map on the server, which is why you will rarely get one to yourself.",
    icon: <Student size={26} weight="bold" />,
    span: "lg:col-span-5",
    image: MEDIA.featureFactions,
    imageAlt: "The dragon monument standing over the Sacred Gate plaza",
  },
  {
    id: "input",
    title: "Keyboard, mouse, controller",
    body: "Twelve slot hotkey bar with every skill rebindable, mouse turn and click to move if you prefer it. Runs windowed, borderless or true fullscreen, ultrawide included.",
    icon: <GameController size={26} weight="bold" />,
    span: "lg:col-span-12",
  },
];

export function GameFeatures() {
  return (
    <section
      id="features"
      className="border-b border-burgundy-900 bg-ember py-20 lg:py-28"
    >
      <div className="mx-auto max-w-shell px-4 sm:px-6 lg:px-10">
        <SectionHeading
          title="Why it plays different"
          lead="Four questions worth asking any server before you sink six months into it. These are our answers."
        />

        <div className="grid gap-4 lg:grid-cols-12 lg:auto-rows-[minmax(220px,auto)]">
          {CELLS.map((cell, index) => (
            <Reveal
              as="article"
              key={cell.id}
              index={index}
              className={`notch-sm group relative flex min-h-[220px] flex-col justify-end overflow-hidden border p-6 sm:p-7 ${
                cell.span
              } ${
                cell.image
                  ? "border-burgundy-700"
                  : cell.tint
                    ? "border-burgundy-700 bg-[linear-gradient(150deg,rgba(78,23,28,0.7)_0%,rgba(10,7,7,1)_72%)]"
                    : "border-burgundy-900 bg-ink"
              }`}
            >
              {cell.image ? (
                <>
                  <img
                    src={cell.image}
                    alt={cell.imageAlt ?? ""}
                    loading="lazy"
                    decoding="async"
                    className="duotone absolute inset-0 h-full w-full object-cover opacity-55 transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,7,7,0.35)_0%,rgba(36,10,12,0.72)_55%,rgba(10,7,7,0.96)_100%)]"
                  />
                </>
              ) : null}

              <div className="relative">
                <span
                  aria-hidden="true"
                  className="mb-5 flex h-11 w-11 items-center justify-center border border-crimson/40 bg-crimson/10 text-crimson-hot"
                >
                  {cell.icon}
                </span>
                <h3 className="display text-[26px] sm:text-[32px]">
                  {cell.title}
                </h3>
                <p className="mt-3 max-w-[52ch] text-[14px] leading-relaxed text-rose">
                  {cell.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
