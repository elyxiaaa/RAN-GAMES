import { DownloadSimple } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import {
  FACTIONS,
  HERO_ART,
  HERO_COPY,
  HERO_MARK,
  LIVE_STATS,
} from "../data/content";
import { useLiveCount } from "../hooks/useLiveCount";
import { useScrolled } from "../hooks/useScrolled";
import { CyclingMark } from "./hero/CyclingMark";
import { ParallaxLayer, ParallaxScene } from "./hero/parallax";
import { Button } from "./ui/Button";
import { Logo } from "./ui/Logo";

const PLATE_POSITION = "object-[center_10%]";

const BACKDROP_PLATE = "h-full w-full scale-[1.14] object-cover object-center";

const EMBERS = [
  { left: "8%", size: 3, delay: 0, duration: 14, drift: 12 },
  { left: "16%", size: 2, delay: 3.4, duration: 17, drift: -8 },
  { left: "24%", size: 4, delay: 7.1, duration: 12, drift: 16 },
  { left: "33%", size: 2, delay: 1.8, duration: 19, drift: -14 },
  { left: "41%", size: 3, delay: 9.6, duration: 15, drift: 9 },
  { left: "48%", size: 2, delay: 5.2, duration: 13, drift: 18 },
  { left: "56%", size: 4, delay: 11.3, duration: 16, drift: -11 },
  { left: "63%", size: 3, delay: 2.6, duration: 18, drift: 14 },
  { left: "71%", size: 2, delay: 8.4, duration: 12, drift: -6 },
  { left: "79%", size: 3, delay: 4.7, duration: 20, drift: 11 },
  { left: "86%", size: 2, delay: 13.1, duration: 14, drift: -16 },
  { left: "93%", size: 3, delay: 6.3, duration: 17, drift: 7 },
];

export function Hero() {
  const reduce = useReducedMotion();
  const scrolled = useScrolled();

  const entry = (index: number) => ({
    initial: reduce ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.72,
      delay: reduce ? 0 : 0.1 + index * 0.1,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  });

  return (
    <ParallaxScene
      id="top"
      className="relative isolate flex min-h-svh w-full flex-col overflow-hidden bg-blood-900"
    >
      <ParallaxLayer
        depthX={12}
        depthY={8}
        scroll={-6}
        className="pointer-events-none absolute inset-0 z-0"
      >
        {HERO_ART.backdropVideo && !reduce ? (
          <video
            src={HERO_ART.backdropVideo}
            poster={HERO_ART.backdrop ?? undefined}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            controls={false}
            tabIndex={-1}
            aria-hidden="true"
            className={BACKDROP_PLATE}
          />
        ) : (
          <img
            src={HERO_ART.backdrop ?? ""}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            decoding="async"
            className={BACKDROP_PLATE}
          />
        )}
      </ParallaxLayer>

      <ParallaxLayer
        depthX={8}
        depthY={4}
        scroll={-9}
        className="pointer-events-none absolute inset-0 z-[5]"
      >
        <div
          aria-hidden="true"
          className="absolute left-[54%] top-[40%] h-[58%] w-[76%] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-crimson opacity-[0.18] blur-[130px]"
        />
      </ParallaxLayer>

      {HERO_ART.backdropVideo ? null : (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[6] animate-storm-flash bg-[radial-gradient(70%_55%_at_40%_22%,rgba(255,150,160,0.9)_0%,rgba(255,42,56,0.35)_40%,transparent_75%)] motion-reduce:animate-none motion-reduce:opacity-0"
        />
      )}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-[9] h-[52vh] bg-[radial-gradient(58%_100%_at_50%_26%,rgba(8,3,4,0.6)_0%,rgba(8,3,4,0.28)_46%,transparent_74%)]"
      />

      <ParallaxLayer
        depthX={20}
        depthY={10}
        scroll={-26}
        className="pointer-events-none absolute inset-0 z-10 flex items-start justify-center pt-[7vh]"
      >
        <motion.h1
          className="m-0"
          initial={reduce ? false : { opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="sr-only">{HERO_MARK.spoken}</span>
          <CyclingMark phrases={HERO_MARK.cycle} reduce={reduce} />
        </motion.h1>
      </ParallaxLayer>

      <ParallaxLayer
        depthX={28}
        depthY={0}
        scroll={0}
        className="pointer-events-none absolute inset-0 z-20"
      >
        <img
          src={HERO_ART.campus ?? ""}
          alt=""
          aria-hidden="true"
          decoding="async"
          className={`h-full w-full scale-[1.06] object-cover ${PLATE_POSITION}`}
        />
      </ParallaxLayer>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[51%] top-[52%] z-[25] h-[72%] w-[38%] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-[radial-gradient(closest-side,rgba(255,42,56,0.5)_0%,rgba(161,16,25,0.28)_45%,transparent_78%)] blur-[70px]"
      />

      <motion.div
        className="pointer-events-none absolute inset-0 z-30"
        initial={reduce ? false : { opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <img
          src={HERO_ART.character ?? ""}
          alt="Ran Online Episode 3 key character, a campus fighter in a modified school uniform"
          fetchPriority="high"
          decoding="async"
          className={`h-full w-full animate-idle-bob object-cover ${PLATE_POSITION} motion-reduce:animate-none`}
        />
      </motion.div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[32] overflow-hidden motion-reduce:hidden"
      >
        {EMBERS.map((ember, index) => (
          <span
            key={index}
            className="absolute bottom-[-24px] animate-ember-rise rounded-full bg-crimson-hot"
            style={
              {
                left: ember.left,
                width: `${ember.size}px`,
                height: `${ember.size}px`,
                animationDelay: `${ember.delay}s`,
                animationDuration: `${ember.duration}s`,
                "--ember-drift": `${ember.drift}px`,
                boxShadow: "0 0 8px 1px rgba(255,59,71,0.75)",
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[37] hidden bg-[linear-gradient(100deg,rgba(26,4,6,0.93)_0%,rgba(26,4,6,0.78)_26%,rgba(26,4,6,0.26)_54%,transparent_82%)] lg:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[37] h-[78%] bg-gradient-to-t from-blood-900 via-blood-900/92 to-transparent lg:hidden"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[38] h-72 bg-[linear-gradient(to_top,#0A0707_0%,rgba(10,7,7,0.94)_30%,rgba(26,4,6,0.5)_66%,transparent_100%)]"
      />
      <div
        aria-hidden="true"
        className="scanlines pointer-events-none absolute inset-0 z-[39] opacity-[0.14]"
      />

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 z-40 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
          scrolled ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="mx-auto flex h-[68px] max-w-shell items-center px-4 sm:px-6 lg:px-10">
          <Logo />
        </div>
      </div>

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-4 transition-opacity duration-300 ease-out motion-reduce:transition-none md:flex lg:right-10 ${
          scrolled ? "opacity-0" : "opacity-100"
        }`}
      >
        <span className="label text-[9px] text-rose [writing-mode:vertical-rl]">
          Scroll
        </span>
        <span className="relative block h-14 w-px overflow-hidden bg-burgundy-700">
          <span className="absolute inset-x-0 top-0 h-5 animate-scroll-hint bg-crimson-hot motion-reduce:hidden" />
        </span>
      </div>

      <div className="relative z-40 mx-auto flex w-full max-w-shell flex-1 flex-col justify-end px-4 pb-9 pt-24 sm:px-6 lg:px-10 lg:pb-12">
        <div className="max-w-[34rem] lg:max-w-[min(34rem,calc(39vw_-_3.5rem))]">
          <motion.h2
            {...entry(0)}
            className="display text-[clamp(2.35rem,10.5vw,2.9rem)] leading-[0.88] sm:text-[62px] lg:text-[clamp(3.1rem,5.3vw,4.75rem)]"
          >
            {HERO_COPY.headline[0]}
            <br />
            {HERO_COPY.headline[1]}
          </motion.h2>

          <motion.p
            {...entry(1)}
            className="mt-5 max-w-[46ch] text-[16px] leading-[1.65] text-rose"
          >
            {HERO_COPY.tagline}
          </motion.p>

          <motion.div {...entry(2)} className="mt-8">
            <Button
              as="a"
              href="#download"
              size="lg"
              icon={<DownloadSimple size={20} weight="bold" />}
            >
              Download client
            </Button>
          </motion.div>
        </div>

        <motion.div {...entry(3)}>
          <HeroReadout />
        </motion.div>
      </div>
    </ParallaxScene>
  );
}

function HeroReadout() {
  const online = LIVE_STATS[0];

  return (
    <dl className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-5 border-t border-white/10 pt-6 sm:gap-x-10">
      <ReadoutItem label="Players online" value={online.value} accent drift />
      {FACTIONS.map((faction) => (
        <ReadoutItem
          key={faction.id}
          label={faction.name}
          value={faction.value}
          crest={faction.crest}
        />
      ))}
    </dl>
  );
}

function ReadoutItem({
  label,
  value,
  crest,
  accent = false,
  drift = false,
}: {
  label: string;
  value: number;
  crest?: string;
  accent?: boolean;
  drift?: boolean;
}) {
  const ref = useLiveCount<HTMLElement>(value, drift);

  return (
    <div className="flex items-center gap-2.5">
      {crest ? (
        <img
          src={crest}
          alt=""
          aria-hidden="true"
          decoding="async"
          className="h-9 w-9 shrink-0 object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]"
        />
      ) : null}
      <div>
        <dd
          ref={ref}
          className={`stat-num text-[23px] leading-none sm:text-[28px] ${
            accent ? "text-white" : "text-blush"
          }`}
        >
          {value.toLocaleString("en-US")}
        </dd>
        <dt className="label mt-1.5 text-[9px] text-rose">{label}</dt>
      </div>
    </div>
  );
}
