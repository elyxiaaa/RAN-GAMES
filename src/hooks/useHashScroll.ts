import { useEffect } from "react";

const SETTLED = 160;

function scrollToHash() {
  const id = decodeURIComponent(window.location.hash.slice(1));
  if (!id) return;

  const target = document.getElementById(id);
  if (!target) return;

  if (Math.abs(target.getBoundingClientRect().top) < SETTLED) return;

  target.scrollIntoView({ behavior: "auto", block: "start" });
}

export function useHashScroll() {
  useEffect(() => {
    scrollToHash();

    if (document.readyState === "complete") return;

    window.addEventListener("load", scrollToHash, { once: true });
    return () => window.removeEventListener("load", scrollToHash);
  }, []);
}
