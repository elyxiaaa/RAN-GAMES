import { UPSTREAM_TIMEOUT_MS, type Route } from "./routes.ts";

const CACHE_FAIL = "no-store";

const EXPECTED_TYPE = "application/json";

export type ProxyOptions = {
  route: Route;
  origin: string;
  token?: string;
};

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

function tag(response: Response, state: "HIT" | "MISS"): Response {
  const tagged = new Response(response.body, response);
  tagged.headers.set("x-cache", state);
  return tagged;
}

export async function proxyJson(
  context: ProxyContext,
  options: ProxyOptions,
): Promise<Response> {
  const { route } = options;
  const incoming = new URL(context.request.url);
  const upstream = new URL(route.path, options.origin);

  const key = new URL(route.path, incoming.origin);

  for (const [name, allowed] of Object.entries(route.forward)) {
    const value = incoming.searchParams.get(name);
    if (value === null) continue;

    if (!allowed.includes(value)) {
      return fail(400, `Unsupported ${name}.`);
    }

    key.searchParams.set(name, value);
    upstream.searchParams.set(name, value);
  }

  for (const [name, value] of Object.entries(route.pinned)) {
    upstream.searchParams.set(name, value);
  }

  if (options.token) upstream.searchParams.set("apiToken", options.token);

  const cache = caches.default;
  const cacheKey = new Request(key.toString(), { method: "GET" });

  const cached = await cache.match(cacheKey);
  if (cached) return tag(cached, "HIT");

  let response: Response;

  try {
    response = await fetch(upstream.toString(), {
      headers: { accept: EXPECTED_TYPE },
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      redirect: "manual",
    });
  } catch {
    return fail(504, "Upstream did not answer.");
  }

  if (response.status >= 300 && response.status < 400) {
    return fail(502, "Upstream redirected, which usually means it wants a login.");
  }

  if (!response.ok) {
    return fail(502, `Upstream responded ${response.status}.`);
  }

  const type = response.headers.get("content-type") ?? "";
  if (!type.startsWith(EXPECTED_TYPE)) {
    return fail(502, `Upstream returned ${type || "no content type"}.`);
  }

  const fresh = new Response(await response.text(), {
    status: 200,
    headers: {
      "content-type": type,
      "cache-control": `public, max-age=${route.ttl}, s-maxage=${route.ttl}`,
    },
  });

  context.waitUntil(cache.put(cacheKey, fresh.clone()));

  return tag(fresh, "MISS");
}
