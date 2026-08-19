import {
  CloudArrowDown,
  DiscordLogo,
  FacebookLogo,
  WindowsLogo,
} from "@phosphor-icons/react";
import { DOWNLOAD_META, LINKS, MEDIA } from "../data/content";
import { useLiveCount } from "../hooks/useLiveCount";
import { useServerStats } from "../hooks/useServerStats";
import { Button } from "./ui/Button";
import { LiveBadge } from "./ui/LiveBadge";
import { Reveal } from "./ui/Reveal";

export function DownloadCta() {
  const stats = useServerStats();

  const countRef = useLiveCount(stats.totalOnline, false);

  return (
    <section
      id="download"
      className="relative isolate overflow-hidden border-b border-burgundy-900 bg-ink py-24 lg:py-32"
    >
      <img
        src={MEDIA.downloadBackdrop}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="duotone absolute inset-0 -z-10 h-full w-full object-cover opacity-30"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(100%_80%_at_50%_45%,rgba(78,23,28,0.72)_0%,rgba(10,7,7,0.94)_62%)]"
      />
      <div
        aria-hidden="true"
        className="scanlines absolute inset-0 -z-10 opacity-25"
      />

      <div className="mx-auto max-w-shell px-4 text-center sm:px-6 lg:px-10">
        <Reveal className="flex flex-wrap items-center justify-center gap-3">
          <LiveBadge label="Servers up" />
          <span className="text-[13px] text-rose">
            <span ref={countRef} className="stat-num text-[15px]">
              {stats.totalOnline.toLocaleString("en-US")}
            </span>{" "}
            {stats.totalOnline === 1 ? "player" : "players"} online right now
          </span>
        </Reveal>

        <Reveal index={1}>
          <h2 className="display mx-auto mt-7 max-w-[16ch] text-[52px] leading-[0.9] sm:text-[76px] lg:text-[96px]">
            Play tonight
          </h2>
          <p className="mx-auto mt-6 max-w-[48ch] text-[16px] leading-relaxed text-rose">
            Character creation is open on Channel 0. Download the client, pick
            your school, and be on the field before the next siege.
          </p>
        </Reveal>

        <Reveal
          index={2}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button
            as="a"
            href={LINKS.client}
            target="_blank"
            rel="noreferrer"
            size="lg"
            icon={<WindowsLogo size={20} weight="fill" />}
            className="w-full sm:w-auto"
          >
            Download for Windows
          </Button>
          <Button
            as="a"
            href={LINKS.mirror}
            target="_blank"
            rel="noreferrer"
            variant="ghost"
            size="lg"
            icon={<CloudArrowDown size={19} weight="bold" />}
            className="w-full sm:w-auto"
          >
            MediaFire mirror
          </Button>
        </Reveal>

        <Reveal
          index={3}
          className="mt-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-2"
        >
          <Meta>Client {DOWNLOAD_META.version}</Meta>
          <Divider />
          <Meta>{DOWNLOAD_META.size} download</Meta>
          <Divider />
          <Meta>{DOWNLOAD_META.requirement}</Meta>
        </Reveal>

        <Reveal
          index={4}
          className="mx-auto mt-14 max-w-[560px] border-t border-burgundy-900 pt-10"
        >
          <p className="text-[14px] leading-relaxed text-rose">
            Patch notes, event windows and downtime notices go out on Discord
            first, then Facebook.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Button
              as="a"
              href={LINKS.facebook}
              target="_blank"
              rel="noreferrer"
              variant="ghost"
              icon={<FacebookLogo size={17} weight="fill" />}
            >
              Facebook
            </Button>
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
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Meta({ children }: { children: React.ReactNode }) {
  return <span className="label text-[10px] text-rose">{children}</span>;
}

function Divider() {
  return (
    <span aria-hidden="true" className="hidden h-3 w-px bg-burgundy-700 sm:block" />
  );
}
