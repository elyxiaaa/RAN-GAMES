import { DiscordLogo } from "@phosphor-icons/react";
import { LINKS } from "../../data/content";
import { RANKING_META } from "../../data/ranking";
import { Button } from "../ui/Button";
import { Reveal } from "../ui/Reveal";

const NOTES = [
  {
    id: "cadence",
    heading: "Snapshot cadence",
    body: `Boards rebuild from the live database every ${RANKING_META.interval}. A win or a kill can take one cycle to surface.`,
  },
  {
    id: "league",
    heading: "What the league counts",
    body:
      "Ranked matches only. Sparring, duels inside a safe zone and guild scrims are ignored by the standings.",
  },
  {
    id: "gold",
    heading: "Gold on hand",
    body:
      "Only gold carried on the character is ranked. Storage, guild vaults and market escrow sit outside the count.",
  },
  {
    id: "fair-play",
    heading: "Fair play",
    body:
      "Confirmed kill trading, macro use or exploits pull a character off every board for the rest of the season.",
  },
];

export function RankingNotes() {
  return (
    <section
      id="how-it-works"
      className="border-t border-burgundy-900 bg-ember py-16 lg:py-20"
    >
      <div className="mx-auto max-w-shell px-4 sm:px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
          <div>
            <h2 className="display text-[26px] sm:text-[32px]">
              How the boards are built
            </h2>

            <dl className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {NOTES.map((note, index) => (
                <Reveal key={note.id} index={index}>
                  <dt className="label text-[10px] text-crimson-hot">
                    {note.heading}
                  </dt>
                  <dd className="mt-2.5 text-[14px] leading-relaxed text-rose">
                    {note.body}
                  </dd>
                </Reveal>
              ))}
            </dl>
          </div>

          <Reveal className="notch flex flex-col border border-burgundy-900 bg-ink p-6">
            <h3 className="display text-[22px]">Wrong number on your row?</h3>
            <p className="mt-3 text-[14px] leading-relaxed text-rose">
              Post the character name and the board in the Discord ticket channel.
              Staff can force a recount for a single row.
            </p>
            <Button
              as="a"
              href={LINKS.discord}
              target="_blank"
              rel="noreferrer"
              variant="ghost"
              icon={<DiscordLogo size={17} weight="fill" />}
              className="mt-6 w-full"
            >
              Open a ticket
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
