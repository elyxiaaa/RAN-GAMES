import { useEffect, useRef } from "react";
import { animate, useMotionValue, useReducedMotion } from "motion/react";

export function useLiveCount<T extends HTMLElement = HTMLSpanElement>(
  target: number,
  drift = true,
) {
  const ref = useRef<T | null>(null);
  const value = useMotionValue(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const unsubscribe = value.on("change", (v) => {
      node.textContent = Math.round(v).toLocaleString("en-US");
    });

    if (reduce) {
      value.set(target);
      return unsubscribe;
    }

    const controls = animate(value, target, {
      duration: 1.7,
      ease: [0.16, 1, 0.3, 1],
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [value, target, reduce]);

  useEffect(() => {
    if (reduce || !drift) return;

    const swing = Math.max(3, Math.round(target * 0.004));
    const id = window.setInterval(() => {
      const next = Math.max(0, Math.round(value.get() + (Math.random() - 0.42) * swing));
      animate(value, next, { duration: 0.9, ease: "easeOut" });
    }, 4200);

    return () => window.clearInterval(id);
  }, [value, target, reduce, drift]);

  return ref;
}
