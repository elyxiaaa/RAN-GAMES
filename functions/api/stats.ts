/**
 * Live server stats, proxied.
 *
 * The game server answers on plain HTTP only, so a browser on this HTTPS site
 * would refuse to call it directly: mixed content is blocked outright, with no
 * way for the page to recover. This Cloudflare Pages Function sits on the
 * site's own origin, makes the call server-side where the scheme does not
 * matter, and keeps `STATS_API_TOKEN` out of the client bundle.
 *
 * `npm run dev` and `npm run preview` reach the same `/api/stats` path through
 * the proxy in vite.config.ts, so the frontend never learns which is serving it.
 *
 * Set STATS_API_URL and STATS_API_TOKEN as environment variables on the
 * Cloudflare Pages project (Settings -> Environment variables).
 */

type Env = {
  STATS_API_URL?: string;
  STATS_API_TOKEN?: string;
};

const DEFAULT_UPSTREAM = "http://egames.ran-services.com/api/stats";

/** Long enough for a cold game server, short enough not to hold the edge open. */
const TIMEOUT_MS = 6000;

/**
 * Character counts move slowly and the hero polls once a minute, so a short
 * shared cache absorbs a traffic spike without the readout ever looking frozen.
 */
const CACHE_OK =
  "public, max-age=30, s-maxage=30, stale-while-revalidate=120";

/** A failure must never be cached, or one bad minute outlives the outage. */
const CACHE_FAIL = "no-store";

function fail(status: number, error: string): Response {
  return new Response(JSON.stringify({ success: false, error }), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": CACHE_FAIL,
    },
  });
}

export async function onRequestGet(context: { env: Env }): Promise<Response> {
  const upstream = new URL(context.env.STATS_API_URL || DEFAULT_UPSTREAM);

  if (context.env.STATS_API_TOKEN) {
    upstream.searchParams.set("apiToken", context.env.STATS_API_TOKEN);
  }

  let response: Response;

  try {
    response = await fetch(upstream.toString(), {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    return fail(504, "Stats upstream did not answer.");
  }

  if (!response.ok) {
    return fail(502, `Stats upstream responded ${response.status}.`);
  }

  // Passed through verbatim rather than reparsed, so this proxy can never
  // disagree with the game server about the shape of its own payload.
  return new Response(await response.text(), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": CACHE_OK,
    },
  });
}
