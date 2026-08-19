import { useEffect, useState } from "react";
import {
  parseStats,
  SNAPSHOT,
  STATS_ENDPOINT,
  type ServerStats,
} from "../data/stats";

const POLL_MS = 60_000;

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
        return;
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
