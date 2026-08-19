/**
 * Shared JSON proxy for the game server's API.
 *
 * Deliberately outside functions/: that directory is Cloudflare's file-based
 * router, every file in it becomes a public route, and there is no documented
 * opt-out. A helper placed there could quietly ship as an endpoint of its own.
 *
 * It exists to solve two problems the browser cannot:
 *
 *   Scheme. The game server answers on plain HTTP only, and a page served over
 *   HTTPS is not allowed to call it -- the browser blocks mixed content before
 *   any of our code runs. Making the request here, server-side, is the only way
 *   the page can reach it at all.
 *
 *   Load. Cloudflare does not cache a response a Function builds itself, so
 *   without the Cache API use below, every visitor's poll would land on the
 *   game database. The cache collapses all of them into one upstream call per
 *   TTL per datacenter.
 */

/** Long enough for a cold game server, short enough not to hold the edge open. */
const TIMEOUT_MS = 6000;

/** A failure must never be cached, or one bad minute outlives the outage. */
const CACHE_FAIL = "no-store";

export type ProxyConfig = {
  /** Upstream endpoint, absolute. Any query string it carries is kept. */
  upstream: string;
  /** Appended as `apiToken`. Never reaches the cache key or the client. */
  token?: string;
  /** Seconds an answer stays fresh at the edge. */
  ttl: number;
  /**
   * Query parameters copied from the caller onto both the upstream request and
   * the cache key. An allowlist, not a passthrough: anything unnamed is
   * dropped, so a caller can neither steer the upstream request nor split the
   * cache into unlimited entries by inventing parameters.
   */
  forward?: readonly string[];
};

/** The slice of a Pages Function context this needs. */
export type ProxyContext = {
  request: Request;
  waitUntil: (promise: Promise<unknown>) => void;
};

function fail(status: number, error: string): Response {
  return new Response(JSON.stringify({ success: false, error }), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": CACHE_FAIL,
    },
  });
}

/**
 * Marks where the answer came from. Headers on a response read back out of the
 * cache are immutable, so this rebuilds it rather than mutating in place.
 */
function tag(response: Response, state: "HIT" | "MISS"): Response {
  const tagged = new Response(response.body, response);
  tagged.headers.set("x-cache", state);
  return tagged;
}

export async function proxyJson(
  context: ProxyContext,
  config: ProxyConfig,
): Promise<Response> {
  const incoming = new URL(context.request.url);
  const upstream = new URL(config.upstream);

  // The cache key is this site's own path plus the forwarded parameters, built
  // in the fixed order of `forward` so it is deterministic. Never the upstream
  // URL: that one carries the token, which must not end up in a cache key.
  const key = new URL(incoming.pathname, incoming.origin);

  for (const name of config.forward ?? []) {
    const value = incoming.searchParams.get(name);
    if (value === null) continue;

    key.searchParams.set(name, value);
    upstream.searchParams.set(name, value);
  }

  if (config.token) upstream.searchParams.set("apiToken", config.token);

  const cache = caches.default;
  const cacheKey = new Request(key.toString(), { method: "GET" });

  const cached = await cache.match(cacheKey);
  if (cached) return tag(cached, "HIT");

  let response: Response;

  try {
    response = await fetch(upstream.toString(), {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    return fail(504, "Upstream did not answer.");
  }

  if (!response.ok) {
    return fail(502, `Upstream responded ${response.status}.`);
  }

  // Passed through verbatim rather than reparsed, so this proxy can never
  // disagree with the game server about the shape of its own payload.
  const fresh = new Response(await response.text(), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": `public, max-age=${config.ttl}, s-maxage=${config.ttl}`,
    },
  });

  // Stored without the x-cache header, so the next reader sees a clean HIT.
  context.waitUntil(cache.put(cacheKey, fresh.clone()));

  return tag(fresh, "MISS");
}
