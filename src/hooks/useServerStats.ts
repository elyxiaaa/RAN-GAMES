import { useEffect, useState } from "react";
import {
  parseStats,
  SNAPSHOT,
  STATS_ENDPOINT,
  type ServerStats,
} from "../data/stats";

/** Counts move slowly, so a minute is frequent enough to read as live. */
const POLL_MS = 60_000;

/**
 * Live server stats, starting from the baked-in snapshot.
 *
 * The first render always returns SNAPSHOT, which is what keeps the prerendered
 * markup and the hydrated markup identical. Live figures arrive after mount and
 * every minute after that, skipped while the tab is hidden and caught up as
 * soon as it comes back. A failed poll is deliberately silent: the readout
 * keeps the last numbers it had rather than flashing an error into the hero.
 */
export function useServerStats(): ServerStats {
  const [stats, setStats] = useState<ServerStats>(SNAPSHOT);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const response = await fetch(STATS_ENDPOINT, {
          headers: { accept: "application/json" },
          signal: controller.signal,
        });

        if (!response.ok) return;

        const next = parseStats(await response.json());
        if (next && !controller.signal.aborted) setStats(next);
      } catch {
        // Unreachable, timed out, or aborted on unmount. Nothing to say.
      }
    };

    void load();

    const timer = window.setInterval(() => {
      if (!document.hidden) void load();
    }, POLL_MS);

    const onVisibility = () => {
      if (!document.hidden) void load();
    };

    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      controller.abort();
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return stats;
}
