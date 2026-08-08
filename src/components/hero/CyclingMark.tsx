import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const TYPE_CLASSES =
  "display brand-outline block whitespace-nowrap text-[clamp(2.75rem,11.5vw,10.5rem)] leading-none";

const CHAR = {
  initial: { opacity: 0, y: "0.42em" },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: {
    opacity: 0,
    y: "-0.34em",
    transition: { duration: 0.3, ease: [0.4, 0, 1, 1] as const },
  },
};

const WORD = {
  animate: { transition: { staggerChildren: 0.042 } },
  exit: { transition: { staggerChildren: 0.024, staggerDirection: -1 } },
};

export function CyclingMark({
  phrases,
  reduce,
  intervalMs = 5000,
}: {
  phrases: string[];
  reduce: boolean | null;
  intervalMs?: number;
}) {
  const [index, setIndex] = useState(0);

  const longest = useMemo(
    () => phrases.reduce((a, b) => (b.length > a.length ? b : a), ""),
    [phrases],
  );

  useEffect(() => {
    if (reduce || phrases.length < 2) return;
    const id = window.setInterval(
      () => setIndex((current) => (current + 1) % phrases.length),
      intervalMs,
    );
    return () => window.clearInterval(id);
  }, [reduce, phrases.length, intervalMs]);

  const phrase = reduce ? phrases[0] : phrases[index];

  return (
    <span className="relative flex items-center justify-center">
      <span aria-hidden="true" className={`${TYPE_CLASSES} invisible`}>
        {longest}
      </span>

      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={phrase}
          aria-hidden="true"
          variants={WORD}
          initial="initial"
          animate="animate"
          exit="exit"
          className={`${TYPE_CLASSES} absolute inset-0 flex items-center justify-center`}
        >
          {Array.from(phrase).map((character, position) => (
            <motion.span
              key={`${phrase}-${position}`}
              variants={CHAR}
              className="inline-block"
            >
              {character === " " ? " " : character}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
