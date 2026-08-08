import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

type RevealProps = {
  children: ReactNode;
  index?: number;
  distance?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article" | "header";
};

export function Reveal({
  children,
  index = 0,
  distance = 22,
  className,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as] as typeof motion.div;

  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.62,
        delay: reduce ? 0 : index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </Tag>
  );
}
