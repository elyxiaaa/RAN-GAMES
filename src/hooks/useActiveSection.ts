import { useEffect, useState } from "react";

export function useActiveSection(ids: readonly string[], offset = 76) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      let current: string | null = null;
      for (const id of ids) {
        const element = document.getElementById(id);
        if (!element) continue;
        const { top, bottom } = element.getBoundingClientRect();
        if (top <= offset && bottom > offset) {
          current = id;
          break;
        }
      }
      setActive(current);
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ids, offset]);

  return active;
}
