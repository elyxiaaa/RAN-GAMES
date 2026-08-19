# Ran Online E-games

Landing page for the Ran Online E-games Windows PC client. React 19 + Vite +
Tailwind v3 + Motion.

The downloadable client is Windows only, and every spec figure, performance band
and download path on the page describes it. Mobile play goes through GameHub
instead, which the site names under Server details but does not yet document —
there is no GameHub install path, requirement or link anywhere on the page. The
*site* is fully responsive regardless, because visitors browse it on phones.

```bash
npm run dev      # dev server
npm run build    # tsc -b && vite build
npm run lint
```

## Design system

Tokens come from the YG Mobile design system
(`gitreverse.com/designs/ran-mobile-yourgames-com-ph`) and live in
[tailwind.config.js](tailwind.config.js).

| Token | Value | Role |
| --- | --- | --- |
| `ink` | `#0A0707` | Page surface |
| `ember` | `#0C0805` | Deep panel fill, alternating section background |
| `burgundy-900` | `#240A0C` | Structural border, section framing |
| `crimson` | `#E01F2D` | Accent fills, buttons, rules. Large text only |
| `crimson-hot` | `#FF3B47` | Accent text at small sizes, 5.7:1 on ink |
| `rose` | `#A89898` | Body and secondary text |
| `blush` | `#FFE2E2` | Headline and highlight text |

Rules that are locked page-wide:

- **Theme:** dark only. No section inverts.
- **Accent:** crimson, and only crimson.
- **Shape:** structural panels use the `.notch` clip-path, buttons and media
  frames are square, everything else uses the 3px radius token. No pills and no
  circles. The only exception is the 6px live status dot, which is a mark
  rather than a container.
- **Type:** Oswald (self-hosted variable) for display, Arial for body.
- **Motion:** every animation branches on `prefers-reduced-motion`, and there
  is exactly one marquee on the page.

## Things you must replace before launch

### 1. The logo

`BRAND.logoSrc` in [src/data/content.ts](src/data/content.ts) is `null`, so
[Logo.tsx](src/components/ui/Logo.tsx) renders a typographic lockup as a stand-in.
Drop the real wordmark into `src/assets/`, import it, and set `logoSrc`.

The favicon in [index.html](index.html) points at `/images/main-logo.webp`,
the same emblem used in the header and footer lockups. It has a real alpha
channel, so it sits cleanly on a light or dark tab.

One gap: Safari does not load WebP favicons and will fall back to a blank
page icon. If that matters, export the emblem to `public/favicon.png` at
32 x 32 and declare it after the WebP line, so supporting browsers take the
WebP and Safari takes the PNG. `public/favicon.svg` is the leftover Vite
default and is no longer referenced by anything.

### 2. Hero scene art: three layers

The hero is a three-layer parallax scene in [Hero.tsx](src/components/Hero.tsx).
**The art is in place** at `public/images/`, wired through `HERO_ART` in
[content.ts](src/data/content.ts). Generation prompts for replacements are in
the next section.

| # | Slot | File | Alpha | Overscan |
| --- | --- | --- | --- | --- |
| 1 | `backdrop` | `background.webp` | no | `scale-[1.14]` |
| 1 | `backdropVideo` | `videos/background.mp4` | no | `scale-[1.14]` |
| 2 | `campus` | `campus.webp` | **yes** | `scale-[1.06]` |
| 3 | `character` | `character.webp` | **yes** | none |

**The backdrop is a video, and the still is still required.** `background.webp`
does three jobs now: it is the video's `poster`, it is what reduced-motion
users see instead of the video, and it is what stays on screen if the mp4
fails to load. Do not delete it, and keep it as frame one of the loop so the
handover is invisible. Set `backdropVideo` to null to go back to the still
everywhere.

The video must be a locked-off shot — no pan, tilt, zoom or dolly. This layer
already drifts 12px under the cursor and `campus.webp` drifts 28px on top of
it, so any camera move inside the file stacks on that and slides the sky out
of register with the skyline. Ambient motion only: lightning inside the
clouds, slow haze, embers.

Because the video lights its own sky, the `z6` CSS storm flash in
[Hero.tsx](src/components/Hero.tsx) only renders when `backdropVideo` is null.
Two storms flashing on unrelated schedules reads as a bug. The
`storm-flash` keyframe stays in [tailwind.config.js](tailwind.config.js) so
the still path keeps working.

Brand art sits alongside it: `main-logo.webp` is the emblem in the header and
footer lockups, and `SG.webp` / `MP.webp` / `PHNX.webp` are the faction crests
in the hero readout.

**Crop behaviour.** The plates are 16:9 and a wide laptop viewport is nearer
2.2:1, so `object-cover` has to lose something. Campus and character share
`object-[center_10%]` (the `PLATE_POSITION` constant in
[Hero.tsx](src/components/Hero.tsx)), which keeps the character's head clear
and pushes the loss down to her boots, where the bottom fade absorbs it. On
16:10 and taller displays nothing crops vertically at all. If you swap in a
figure with more headroom, raise that percentage.

**Replacements must keep two conventions.**

*All three plates share one 2752 x 1536 canvas and are registered to each
other.* They are stacked full bleed at identical positioning, so whatever you
supply must be composed on the same canvas or the character will not stand on
the campus street. The character occupies 39% to 64% of the frame width; the
left third is deliberately empty, because the copy column is sized to land in
that gap. Move the figure and you have to resize the copy column with it.

*The transparent sky on layer 2 is the whole trick.* The backdrop and the
giant brand type show through it, and the rooftops crop the type. Bake a sky
into that file and the depth collapses into a flat picture. Same reason all
three stay separate files.

**How the depth works.** `depthX` climbs toward the viewer (backdrop 12, brand
type 20, campus 28), so nearer layers drift further under the cursor. That
gradient is the illusion. Overscan scales with drift, so no layer can expose
an edge: the campus drifts 28px and carries 3% overscan each side, which is
43px at a 1440px viewport. The campus has `depthY: 0` because it is registered
to the bottom of the plate and vertical drift would lift it off the ground.
The character has no parallax at all, only an idle bob: a still subject inside
a drifting scene reads as depth, a moving one reads as unstable, and a layer
that never drifts needs no overscan.

**Known cost.** The three plates total about 1 MB. That is fine on desktop
broadband, which is where most of this audience lands, and heavy on mobile
data, where the crop shows little more than the character anyway. If mobile
LCP matters, add narrow variants and a `srcset`.

Pointer parallax is gated behind `(pointer: fine)` and
`prefers-reduced-motion`, so touch and reduced-motion users get the still scene.

### 2b. Generation prompts (for replacing the art)

These produced the current plates. Use the same model and seed family for all
three so the rendering style matches, and render them on one shared
2752 x 1536 canvas so they stay registered. **Paste the shared lighting brief
into every one of the three prompts.** Mismatched light direction is the
single thing that makes a layered composite look pasted together.

**Shared lighting brief (append to all three):**

> Lighting: single hard key light from the upper right at roughly 35 degrees,
> cool moonlight rim on the left edge of every form, deep crimson bounce light
> rising from below. Palette strictly black, deep burgundy, oxblood and a
> single hot crimson accent; no blue, teal, purple or green anywhere. Heavy
> atmospheric haze, fine airborne embers, filmic grain, high contrast with
> crushed blacks. Dark fantasy MMORPG key art, painterly digital illustration,
> not photographic, no lens flare.

**Layer 1, backdrop.** 16:9, 2560x1440, no transparency.

> Night sky above an East Asian city, seen from ground level. Towering storm
> clouds lit from within by crimson lightning, a pale bone-white moon low and
> slightly right of centre, distant unlit tower blocks reduced to flat black
> shapes along the bottom third. Sparse embers drifting upward. The frame is
> pure atmosphere with no focal subject and no characters. Composition must
> stay calm and readable across the middle 86% of the frame, with the bottom
> 40% progressively darker so foreground elements can sit on top of it.
> [+ shared lighting brief]

**Layer 2, campus cutout.** 2560x1100, PNG with alpha.

> A dense East Asian high-school and academy campus rendered as a single
> continuous silhouette: a tall ceremonial front gate slightly left of centre,
> tiled academy rooftops, a clock tower, perimeter walls, bare winter trees and
> street lamps. Occupies the lower 60 percent of the frame; the upper 40
> percent is FULLY TRANSPARENT with no sky, no gradient, no haze, no
> background whatsoever. The rooftop line must be uneven and interesting,
> because large type sits behind it and gets cropped by that edge. Windows lit
> in dim crimson. Include the ground and street at the very bottom edge so the
> layer anchors flush to the bottom of the screen. Extend the artwork edge to
> edge horizontally with no vignette and no border.
> [+ shared lighting brief]

**Layer 3, character.** 1400x1900, PNG with alpha, full-body.

> Full body portrait of a Ran Online campus fighter, standing three-quarter
> view facing left, weight on the back foot, chin slightly raised, calm and
> confident rather than aggressive. Modified Asian school uniform: dark blazer
> worn open over a white shirt, loosened tie, reinforced plated forearm guard
> on one arm, tactical belt, scuffed boots. Windblown hair. Cropped out
> completely against FULL TRANSPARENCY, no ground, no shadow on the ground, no
> background elements, no props behind the figure. Feet must touch the very
> bottom edge of the canvas so the figure stands on the campus street when
> composited. Leave roughly 4 percent empty margin on the left, right and top.
> [+ shared lighting brief]

**Negative prompt for all three:** `text, letters, watermark, signature, logo,
UI, HUD, interface, frame, border, vignette, blue tones, teal, purple, neon
green, lens flare, bokeh, photorealistic skin pores, multiple characters`

After generating, check layer 2 and 3 in an editor with a checkerboard
background. Most models return an opaque near-black rectangle instead of true
alpha; if so, key it out and clean the edges before dropping it in.

### 3. Key art for the rest of the page

Real in-game captures now, wired through `MEDIA` and `SHOWCASE` in
[src/data/content.ts](src/data/content.ts). Every one is 1920 x 1080 except the
download backdrop.

| Slot | File | Where it lands |
| --- | --- | --- |
| `trailerPoster` | `legend-status.webp` | Click-to-load trailer plate |
| `featureHunt` | `leonine-campus.webp` | Bento, tall cell |
| `featureFactions` | `sg-campus-bg.webp` | Bento, 5 column cell |
| `downloadBackdrop` | `download-image.webp` | Download section, 2816 x 1536 |
| `SHOWCASE` x5 | mp / phnx campus, leonine-b3, trading-hole, prison | Scroll-snap strip |

Every slot is fed by `object-cover`, so a 16:9 source crops rather than
letterboxes. Nothing here needs a matching aspect; it needs a subject that
survives a centre crop.

**Keep `.duotone` on these.** The note that used to sit here suggested
dropping it once the art was real. Do not: `sg-campus-bg`, `mp-campus-bg` and
`phnx-campus-bg` all have purple or blue-grey skies, and `trading-hole` is
blue-grey throughout. The filter is the only thing holding them inside the
black and crimson palette. If you want the fire and crimson in
`leonine-campus` to survive, tint rather than desaturate — change `.duotone`
in [src/index.css](src/index.css) to a sepia and hue-rotate chain instead of
`grayscale(1)`, so shadows stay black and highlights land on crimson.

Spare captures sitting unused in `public/images/`: `hangout1f`, `hangout2f`,
`hangout3f`, `sg-hole`, `mp-hole`, `phnx-hole`.

### 4. Mock data

The server configuration in [src/data/content.ts](src/data/content.ts) is real:
`SERVER_STATS`, `SERVER_DETAILS` and the Facebook and Discord links in `LINKS`
are the live Episode 6 values. What is still placeholder:

- **Download links.** `client`, `mirror1` and `mirror2` in `LINKS` are all
  anchors to `#download`, so every download button currently scrolls instead of
  downloading. `DOWNLOAD_META` still carries the old `3.0.4` / `6.4 GB` figures.
- **Channel figures.** Region, client version, ping and uptime under `REALMS`.
  There is one channel, `channel-0`, and no second one planned.
- **Player counts.** `LIVE_STATS`, animated by `useLiveCount`.
- **Trailer.** `LINKS.trailer` is a placeholder YouTube URL.

`BRAND.episode` and `BRAND.episodeName` are the only places the episode number
is written. Alt text, media titles and the hero mark all read from them, so
bumping to Episode 7 is a two-line change.

The hardware figures are plausible placeholders, not measurements. `TIERS` are
1440p bands, `MIN_SPECS` holds the Minimum / Recommended / Network columns, and
each group's `id` selects its icon in
[Compatibility.tsx](src/components/Compatibility.tsx) — rename one and you must
rename the matching key there.

### 4b. Ranking data

[src/data/ranking.ts](src/data/ranking.ts) fills all four boards with
`Dummy{n}` handles and `DummyGuild{n}` names. Rows are generated from a fixed
seed rather than `Math.random`, so the prerendered HTML and the hydrated markup
agree; keep it that way or hydration will warn.

Going live means replacing the four `build*` helpers with a fetch and leaving
`LeagueRow`, `GoldRow`, `GuildRow` and `PkRow` alone — the table and podium read
those types, nothing else. The endpoints the shapes assume are listed at the top
of the file. `RANKING_META.synced` is a static string for the same hydration
reason, so swap it for a real timestamp only once the data arrives client side.

### 5. Live player counts

[useLiveCount](src/hooks/useLiveCount.ts) counts up on mount, then simulates
drift on a 4.2s interval. The value is written straight to `textContent`
through a motion value, so React never re-renders per frame. To wire real data,
poll your status endpoint and call `animate(value, next)` with the response
instead of the random walk.

## Pages

Two routes, two HTML entries, no client router. [src/routes.ts](src/routes.ts)
maps a pathname to a page, [App.tsx](src/App.tsx) picks the page, and links
between them are plain anchors so each one is served as a prerendered document.

| Route | Entry HTML | Page |
| --- | --- | --- |
| `/` | [index.html](index.html) | [HomePage.tsx](src/pages/HomePage.tsx) |
| `/ranking` | [ranking.html](ranking.html) | [RankingPage.tsx](src/pages/RankingPage.tsx) |

Shared chrome takes a `route` prop: `Nav` and `Footer` prefix their hash links
with `/` when read from anywhere but home, and the nav bar stops hiding at scroll
top on pages that have no hero to reveal.

Adding a third route means four edits: a flat `<name>.html` at the repo root, an input in
[vite.config.ts](vite.config.ts), an entry in `ROUTES` in
[scripts/prerender.mjs](scripts/prerender.mjs), and one in `PAGES` plus
`SEO_ROUTES` in [src/data/seo.ts](src/data/seo.ts).

## Section map

Each section uses a different layout family, so the page never repeats itself.

| Section | id | Layout |
| --- | --- | --- |
| Nav | | Sticky bar, 68px, one line at desktop |
| Hero | `#top` | Three layer parallax scene, left anchored copy, live readout row |
| Ticker | | Marquee, the only one on the page |
| Trailer | `#footage` | Click-to-load media plate plus scroll-snap strip |
| Server information | `#servers` | Unequal two tile split |
| Server features | `#server-features` | Stacked clusters, sparse dividers |
| Game features | `#features` | Five cell bento |
| Compatibility | `#compatibility` | Tier ladder plus grouped spec columns |
| Download | `#download` | Centred full bleed launch moment |
| Footer | | Link columns |

The ranking page reuses the same families in a different order:

| Section | id | Layout |
| --- | --- | --- |
| Header | `#top` | Duotone plate, breadcrumb, headline plus stat rail |
| Board | `#board` | Sticky tab strip, class rail, podium, data table |
| Notes | `#how-it-works` | Definition pairs plus a support card |

The board's view lives in the query string, not in component state, so a row can
be linked to and a refresh lands back on the same table:

```
/ranking?board=pk&class=archer&page=3&q=dummy1
```

[useBoardState.ts](src/components/ranking/useBoardState.ts) reads it through
`useSyncExternalStore` with an empty server snapshot, which is what keeps the
prerendered default view from fighting hydration. Unknown or out-of-range values
fall back to the default rather than erroring, so a mangled link still renders.

Secondary table columns fold into the name cell below `lg`
([RankingTable.tsx](src/components/ranking/RankingTable.tsx)): each column
carries the breakpoint it appears at, and the matching folded chip carries the
breakpoint it disappears at, so the two can't drift apart. That is why the guild
board shows ten columns on a desktop and no horizontal scroll on a phone.

## SEO

### One file

[src/data/seo.ts](src/data/seo.ts) is the only place SEO values are written.
[plugins/vite-plugin-seo.ts](plugins/vite-plugin-seo.ts) reads it at build time
and generates:

| Surface | How |
| --- | --- |
| `<title>`, description, canonical, robots | Injected into `index.html` |
| Open Graph and Twitter cards | Injected into `index.html` |
| JSON-LD `@graph` | Injected into `index.html` |
| `<html lang>` | Rewritten from `SITE.lang` |
| `/robots.txt` | Emitted to `dist/` |
| `/sitemap.xml` | Emitted to `dist/`, with the image extension |
| `/llms.txt` | Emitted to `dist/` |

All three generated files are also served by `npm run dev`, so `/robots.txt`
resolves locally instead of only appearing after a production build.

Facts that appear on the page — rates, realms, specs, download size — are read
from [content.ts](src/data/content.ts) rather than retyped, so the structured
data cannot drift away from what a visitor reads.

The build warns if `SITE.url` is not a bare https origin, or if `SITE.ogImage`
is missing from `public/`.

### Prerendering

The pages are client rendered, which means the served HTML would be an empty
`<div id="root">`. Googlebot runs JavaScript and would still index it, but
GPTBot, ClaudeBot, PerplexityBot and OAI-SearchBot do not — to every AI search
surface the site would be a blank page.

So `npm run build` has four steps:

```
tsc -b
vite build                                          # client → dist/
vite build --ssr src/entry-server.tsx --outDir …    # server → dist-ssr/
node scripts/prerender.mjs                          # inject, then delete dist-ssr/
```

[scripts/prerender.mjs](scripts/prerender.mjs) walks every route, rendering each
into its own HTML file, and refuses to write a result under 500 characters, so a
broken render fails the build instead of silently shipping a stub.
`dist/index.html` carries about 65 kB of markup and `dist/ranking.html` about
74 kB. Use `npm run build:client` to skip the prerender while debugging.

## Deploying to Cloudflare

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version | pinned to 22.16.0 by [.node-version](.node-version) |

The Node pin matters: `vite.config.ts` and `scripts/prerender.mjs` both use
`import.meta.dirname`, which needs Node 20.11 or newer. Cloudflare's current
build image already defaults to 22, but an older project can still be on the
image that ships Node 18, where the build would fail at config load.

**Page entries are flat files, not folders.** Cloudflare serves `ranking.html`
at the extension-less `/ranking`, and would only serve a `ranking/index.html` at
`/ranking/`, with a 308 from the URL without the slash. Since `/ranking` is the
canonical URL everywhere in [seo.ts](src/data/seo.ts), the sitemap and every
internal link, a flat file is what keeps all of them free of a redirect hop. Any
new route follows the same rule: `about.html`, never `about/index.html`. The dev
server has no such convention, so a middleware in
[vite-plugin-seo.ts](plugins/vite-plugin-seo.ts) maps `/ranking` onto the file
and both environments answer the same URL.

[public/_headers](public/_headers) and [public/_redirects](public/_redirects)
are copied to the site root by the build and read by Cloudflare. They replace
what `.htaccess` used to do, minus three rules that are no longer needed:
compression and MIME types are automatic, and HTTP upgrades to HTTPS on its own.

**One redirect cannot live in the repo.** `_redirects` matches paths, never
hostnames, so www to apex has to be a Redirect Rule in the dashboard: Rules →
Redirect Rules → Create, matching `hostname eq "www.ranonline-egames.com"`, with
a dynamic target of `concat("https://ranonline-egames.com", http.request.uri)`
and status 301. Without it, the site answers on both hostnames and splits its
own ranking signals. Also switch on SSL/TLS → Edge Certificates → Always Use
HTTPS.

Unknown paths get Cloudflare's default 404. Adding `public/404.html` would
replace it with a branded page; nothing else in the build needs to change.

## Live game server data

The hero readout (total characters, overall and per school) and four of the
five ranking boards are live from the game server. PK Map has no endpoint
yet and its tab is marked `soon`: not selectable, by URL either.

**The game server speaks plain HTTP only.** A page served over HTTPS cannot call
an `http://` endpoint at all: the browser blocks it as mixed content, before any
code of ours runs, and there is no error a fetch can recover from. So the
browser never calls the game server. It calls this site's own origin at
`/api/stats`, and two interchangeable pieces of plumbing answer it:

| Environment | Answered by |
| --- | --- |
| Cloudflare Pages | the Functions under [functions/api/](functions/api/), over [server/proxy.ts](server/proxy.ts) |
| `npm run dev`, `npm run preview` | the dev proxy in [vite.config.ts](vite.config.ts) |

Both build their requests from one table, [server/routes.ts](server/routes.ts),
so what is pinned, forwarded and refused cannot drift between them:

| Board | Endpoint | Caller may set | Edge TTL |
| --- | --- | --- | --- |
| — | `/api/stats` | nothing | 30s |
| League | `/api/ranking/league` | `category`: all, resu, br, sw, ar, sh, heal | 300s |
| Top MMR | `/api/ranking/mmr` | `category`: the same **minus `heal`** | 300s |
| Top Gold | `/api/ranking/currency` | nothing | 300s |
| Top Guild | `/api/ranking/guild` | nothing | 300s |

Every board pins `page=1` and `pageSize=50`. Top Gold also pins `type=gold`, the
only currency the server accepts today; its 400 mentions epoint and gpoint
"if SP provides them".

**The category lists are not the same.** MMR answers 400 for `heal` where League
answers 200, so the filter rail is per board (`BOARDS[].categories`). A stale
`?class=heal` in the URL falls back to `all` on MMR rather than requesting a
category that can only fail.

### The boards

The game server caps `pageSize` at 50 on every board and never reports a total
above it, so one request is always the entire board. That is why `page` is
pinned and the search term is never sent:
[RankingBoard](src/components/ranking/RankingBoard.tsx) pages and searches
those rows locally, which keeps the cache to one entry per board and category
instead of one per board, category, page and search string.

Class and body come from `classLabel` (`"Archer [F]"`), never from the numeric
`chaClass`. The live board returns 1, 2, 4, 8, 64 and 256 for six
combinations, which is not one consistent bit pattern, so the number cannot
be decoded without guessing. Icons resolve to
`public/images/class-icons/{br,sm,ar,sh}_{m,w}.webp`.

Guild names arrive padded to a fixed database width and are trimmed on parse;
an empty one means no guild. A row missing a name, rank, school or readable
class is dropped rather than rendered with a placeholder standing in for real
data.

**Guild level is the server's `guRank`, 0 to 5.** The S/A/B/C/D/E grades this
board used to show were invented by the placeholder data and match nothing a
player sees in game. The guild board also reports `win` / `loss` / `draw`,
not the kills and resurrections the placeholder had.

Nothing fetches during the prerender. The shipped HTML carries the `SNAPSHOT`
figures in [src/data/stats.ts](src/data/stats.ts), and
[useServerStats](src/hooks/useServerStats.ts) replaces them after mount, then
once a minute while the tab is visible. The league board has no snapshot at
all and prerenders as a skeleton, on purpose: a generated stand-in would put
invented player names into the HTML that crawlers read. A failed poll is silent by design: the
readout keeps the numbers already on screen, so an outage upstream costs freshness
and never shows a broken hero. Refresh `SNAPSHOT` if it ever drifts far enough
from reality to read as wrong to a crawler.

Nothing in the tree touches the DOM during render — every `window` and
`document` access already sits inside a `useEffect` — which is what makes this
work without an SSR-safety refactor. Two consequences worth knowing:

- **Live counters render their settled figure**, not `0`
  ([Hero.tsx](src/components/Hero.tsx),
  [DownloadCta.tsx](src/components/DownloadCta.tsx)). `useLiveCount` overwrites
  it on mount and animates up, so nothing changes visually, but the HTML a
  crawler reads no longer claims that nobody is online.
- **Reduced-motion visitors skip hydration.** Motion reads the preference
  during render and reports `null` on the server, so the client's first pass
  genuinely differs — the hero swaps its background video for a still.
  [main.tsx](src/main.tsx) detects this up front and mounts a fresh root
  instead of letting React surface it as a hydration error. Correct UI either
  way; that group just does not get the hydration saving.

### Before you launch

1. Set `SITE.url` to the real domain.
2. Export a purpose-built **1200×630 JPG or PNG** to `public/images/og-cover.jpg`
   and point `SITE.ogImage` at it. The current value is a 16:9 in-game still —
   it works, but it is a stand-in.
3. Fill in `LINKS.facebook` and `LINKS.discord`. Bare origins are treated as
   unfilled placeholders and are dropped from `Organization.sameAs`, because
   publishing them would claim a profile that is not yours.
4. Set `SITE.trailer` once a real trailer exists. It stays `null` while
   `LINKS.trailer` is a placeholder — marking up a video that is not on the
   page is a structured-data violation.
5. Add a 32×32 `public/favicon.png`. Safari does not load the WebP favicon.
6. Submit `sitemap.xml` in Google Search Console and Bing Webmaster Tools.

## Cloning this template for a new server

The site-specific surface is deliberately small. A new server is four files and
one deploy setting:

| What changes | Where |
| --- | --- |
| Domain, title, description, share card, schema | [src/data/seo.ts](src/data/seo.ts) |
| Brand, links, realms, rates, specs, copy | [src/data/content.ts](src/data/content.ts) |
| Ranking rows, until the API is wired | [src/data/ranking.ts](src/data/ranking.ts) |
| Stats snapshot, and the API origin | [src/data/stats.ts](src/data/stats.ts), `GAME_API_ORIGIN` |
| Colour tokens, if the new server is not crimson | [tailwind.config.js](tailwind.config.js) |
| Art, video, logo, favicon | `public/` and `src/assets/` |
| Package name | [package.json](package.json) |

Nothing under `src/components/`, `plugins/` or `scripts/` should need editing
to launch a clone. If it does, that is a signal the value belongs in a data
file.

```bash
git clone --depth 1 <template-url> new-server
cd new-server
rm -rf .git && git init
gh repo create <org>/<new-server> --private --source . --remote origin
```

Cloning with `--depth 1` and reinitialising gives the new repo a clean history
rather than the template's. The trade-off is that the clone is then detached:
template fixes will not flow into it.

If you expect to keep improving the template and want those fixes downstream,
keep the history and add the template as a remote instead:

```bash
git clone <template-url> new-server
cd new-server
git remote rename origin template
git remote add origin <new-repo-url>
git push -u origin main
```

Then `git fetch template && git merge template/main` pulls later template work
into the clone. Conflicts land almost entirely in the data files, which is
exactly where you want them — the components merge cleanly because they hold no
server-specific values.

## Accessibility notes

- Skip link, focus-visible ring on the crimson accent, one `h1` and a clean
  heading outline.
- Every text-on-background pair was checked against WCAG AA. Crimson `#E01F2D`
  is 4.2:1 on ink, so it is only used for fills and large display type. Small
  accent text uses `crimson-hot`.
- The mobile sheet traps body scroll, closes on Escape, and scrolls internally
  on short viewports.
- The grain veil is fixed and `pointer-events-none`, never inside a scrolling
  container.
