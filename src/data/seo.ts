/**
 * SEO single source of truth.
 *
 * This is the ONLY file you edit when you clone this template for a new
 * server. Everything downstream is generated from it at build time by
 * [plugins/vite-plugin-seo.ts](../../plugins/vite-plugin-seo.ts):
 *
 *   - the entire <head> of index.html (title, canonical, OG, Twitter, JSON-LD)
 *   - public-facing /robots.txt
 *   - public-facing /sitemap.xml
 *   - public-facing /llms.txt
 *
 * Facts that also appear on the page (rates, specs, realms, download size)
 * are imported from [content.ts](content.ts) rather than retyped here, so the
 * structured data can never drift out of sync with what a visitor reads.
 */

import {
  BRAND,
  DOWNLOAD_META,
  LINKS,
  MIN_SPECS,
  REALMS,
  SERVER_DETAILS,
  SERVER_FEATURES,
  SERVER_STATS,
  SHOWCASE,
  TIERS,
} from "./content.ts";

/* -------------------------------------------------------------------------- */
/* 1. Site identity — change these                                            */
/* -------------------------------------------------------------------------- */

export const SITE = {
  /** Canonical origin. No trailing slash. Change this first. */
  url: "https://ranreturns.com",

  /** Full brand name, used in og:site_name and Organization schema. */
  name: "Ran Online Official",

  /** Short form, used where space is tight. */
  shortName: "Ran Online",

  lang: "en",
  locale: "en_US",
  themeColor: "#0A0707",

  /** Keep under 60 characters or Google truncates it in the SERP. */
  title: "Ran Online Official | Episode 3 Server, Free PC MMORPG",

  /** Keep between 120 and 158 characters. */
  description:
    "Episode 3 is live on Strife. Pure hunt progression, a player run economy, campus factions and zero pay to win. Free Ran Online client for Windows PC.",

  /**
   * Social share card. Ideal is a purpose-built 1200x630 JPG or PNG at
   * /images/og-cover.jpg. The 16:9 in-game still below is a working stand-in;
   * the build warns if this file is missing from public/.
   */
  ogImage: "/images/legend-status.webp",
  ogImageType: "image/webp",
  ogImageWidth: 1920,
  ogImageHeight: 1080,
  ogImageAlt:
    "Ran Online Episode 3, campus fighters massed on the field after dark",

  /** "@handle" if the server has an X account, otherwise leave empty. */
  twitterSite: "",

  /** Where the client actually downloads from. Used in VideoGame schema. */
  downloadUrl: "/#download",

  /**
   * Set this once you have a real trailer, and a VideoObject node is added to
   * the JSON-LD graph. Leave null while LINKS.trailer is a placeholder —
   * marking up a video that is not on the page is a structured-data violation.
   */
  trailer: null as null | {
    name: string;
    description: string;
    /** ISO 8601, e.g. "2026-01-14" */
    uploadDate: string;
    thumbnailUrl: string;
    embedUrl: string;
  },
} as const;

/**
 * Every indexable URL. A single-page site has one entry; add more as the
 * template grows real routes. Anchors (#download) never belong in a sitemap.
 */
export const SEO_ROUTES: {
  path: string;
  priority?: number;
  /** Surfaced to Google Images via the sitemap image extension. */
  images?: { loc: string; caption: string }[];
}[] = [
  {
    path: "/",
    priority: 1.0,
    images: [
      { loc: "/images/character.webp", caption: SITE.ogImageAlt },
      ...SHOWCASE.map((shot) => ({ loc: shot.src, caption: shot.caption })),
    ],
  },
];

/**
 * AI and search crawlers granted explicit access in robots.txt.
 *
 * A bot that matches its own User-agent group ignores the wildcard group
 * entirely, so listing them here is what keeps the grant unambiguous. Move a
 * name out of this array and into BLOCKED_CRAWLERS to shut it out.
 */
export const ALLOWED_CRAWLERS = [
  // Search
  "Googlebot",
  "Google-Extended",
  "Bingbot",
  "DuckDuckBot",
  "Applebot",
  "Applebot-Extended",
  // OpenAI
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Anthropic
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Others
  "Meta-ExternalAgent",
  "Amazonbot",
  "DuckAssistBot",
  "cohere-ai",
  "YouBot",
];

/** Crawlers denied in robots.txt. Empty by default. */
export const BLOCKED_CRAWLERS: string[] = [];

/* -------------------------------------------------------------------------- */
/* 2. Derived values — you should not need to touch anything below            */
/* -------------------------------------------------------------------------- */

const ORIGIN = SITE.url.replace(/\/+$/, "");

/** Turns "/images/x.webp" into "https://example.com/images/x.webp". */
export function abs(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return ORIGIN + (path.startsWith("/") ? path : `/${path}`);
}

const ID = {
  website: `${ORIGIN}/#website`,
  webpage: `${ORIGIN}/#webpage`,
  organization: `${ORIGIN}/#organization`,
  game: `${ORIGIN}/#game`,
  image: `${ORIGIN}/#primaryimage`,
};

/**
 * A bare origin like "https://discord.gg/" is the template's unfilled
 * placeholder. Publishing it as an Organization sameAs would claim a profile
 * that is not ours, so only URLs with a real path survive.
 */
function isRealProfile(href: string): boolean {
  try {
    return new URL(href).pathname.replace(/\/+$/, "").length > 0;
  } catch {
    return false;
  }
}

const SAME_AS = [LINKS.facebook, LINKS.discord].filter(isRealProfile);

const detail = (label: string) =>
  SERVER_DETAILS.find((row) => row.label === label)?.value;

const minimum = MIN_SPECS.find((group) => group.id === "minimum");
const specValue = (label: string) =>
  minimum?.rows.find((row) => row.label === label)?.value;

/* -------------------------------------------------------------------------- */
/* 3. Structured data (JSON-LD)                                               */
/* -------------------------------------------------------------------------- */

/**
 * One @graph rather than several loose <script> blocks, so every node can
 * reference the others by @id and search engines resolve a single entity map.
 */
export function buildStructuredData(): Record<string, unknown> {
  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebSite",
      "@id": ID.website,
      url: `${ORIGIN}/`,
      name: SITE.name,
      description: SITE.description,
      inLanguage: SITE.lang,
      publisher: { "@id": ID.organization },
    },
    {
      "@type": "Organization",
      "@id": ID.organization,
      name: SITE.name,
      url: `${ORIGIN}/`,
      logo: {
        "@type": "ImageObject",
        url: abs(BRAND.logoSrc ?? SITE.ogImage),
        width: 447,
        height: 447,
      },
      ...(SAME_AS.length ? { sameAs: SAME_AS } : {}),
    },
    {
      "@type": "ImageObject",
      "@id": ID.image,
      url: abs(SITE.ogImage),
      contentUrl: abs(SITE.ogImage),
      width: SITE.ogImageWidth,
      height: SITE.ogImageHeight,
      caption: SITE.ogImageAlt,
    },
    {
      "@type": "WebPage",
      "@id": ID.webpage,
      url: `${ORIGIN}/`,
      name: SITE.title,
      description: SITE.description,
      inLanguage: SITE.lang,
      isPartOf: { "@id": ID.website },
      about: { "@id": ID.game },
      primaryImageOfPage: { "@id": ID.image },
    },
    {
      // VideoGame extends both SoftwareApplication and CreativeWork, so the
      // client download details belong on this node rather than a second one.
      "@type": "VideoGame",
      "@id": ID.game,
      name: `${BRAND.name} ${BRAND.suffix}`,
      alternateName: BRAND.name,
      description: SITE.description,
      url: `${ORIGIN}/`,
      image: { "@id": ID.image },
      inLanguage: SITE.lang,
      genre: ["MMORPG", "Action RPG", "Campus MMO"],
      gamePlatform: ["PC", "Microsoft Windows"],
      playMode: "MultiPlayer",
      applicationCategory: "GameApplication",
      operatingSystem: specValue("OS") ?? DOWNLOAD_META.requirement,
      softwareVersion: DOWNLOAD_META.version,
      fileSize: DOWNLOAD_META.size,
      downloadUrl: abs(SITE.downloadUrl),
      installUrl: abs(SITE.downloadUrl),
      softwareRequirements: minimum?.rows
        .map((row) => `${row.label}: ${row.value}`)
        .join("; "),
      gameEdition: detail("Episode"),
      publisher: { "@id": ID.organization },
      author: { "@id": ID.organization },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: abs(SITE.downloadUrl),
      },
      gameServer: REALMS.map((realm) => ({ "@id": `${ORIGIN}/#realm-${realm.id}` })),
    },
    ...REALMS.map((realm) => ({
      "@type": "GameServer",
      "@id": `${ORIGIN}/#realm-${realm.id}`,
      name: realm.name,
      description: realm.blurb,
      serverStatus:
        realm.status === "live"
          ? "https://schema.org/Online"
          : "https://schema.org/Offline",
      game: { "@id": ID.game },
    })),
  ];

  if (SITE.trailer) {
    graph.push({
      "@type": "VideoObject",
      "@id": `${ORIGIN}/#trailer`,
      name: SITE.trailer.name,
      description: SITE.trailer.description,
      uploadDate: SITE.trailer.uploadDate,
      thumbnailUrl: abs(SITE.trailer.thumbnailUrl),
      embedUrl: SITE.trailer.embedUrl,
      contentUrl: LINKS.trailer,
      publisher: { "@id": ID.organization },
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

/* -------------------------------------------------------------------------- */
/* 4. <head> tags                                                             */
/* -------------------------------------------------------------------------- */

/** Structurally compatible with Vite's HtmlTagDescriptor. */
export type HeadTag = {
  tag: string;
  attrs?: Record<string, string | boolean>;
  children?: string;
  injectTo?: "head" | "head-prepend";
};

export function buildHeadTags(): HeadTag[] {
  const ogImage = abs(SITE.ogImage);

  const tags: HeadTag[] = [
    { tag: "title", children: SITE.title },
    { tag: "meta", attrs: { name: "description", content: SITE.description } },
    { tag: "link", attrs: { rel: "canonical", href: `${ORIGIN}/` } },

    // max-snippet:-1 and max-image-preview:large are what let Google show a
    // full-length snippet and a large thumbnail, and what most AI Overview
    // surfaces check before quoting a page at length.
    {
      tag: "meta",
      attrs: {
        name: "robots",
        content:
          "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      },
    },

    { tag: "meta", attrs: { name: "theme-color", content: SITE.themeColor } },
    { tag: "meta", attrs: { name: "color-scheme", content: "dark" } },
    { tag: "meta", attrs: { name: "application-name", content: SITE.name } },
    { tag: "meta", attrs: { name: "generator", content: "Vite" } },

    { tag: "meta", attrs: { property: "og:type", content: "website" } },
    { tag: "meta", attrs: { property: "og:site_name", content: SITE.name } },
    { tag: "meta", attrs: { property: "og:url", content: `${ORIGIN}/` } },
    { tag: "meta", attrs: { property: "og:title", content: SITE.title } },
    {
      tag: "meta",
      attrs: { property: "og:description", content: SITE.description },
    },
    { tag: "meta", attrs: { property: "og:locale", content: SITE.locale } },
    { tag: "meta", attrs: { property: "og:image", content: ogImage } },
    {
      tag: "meta",
      attrs: { property: "og:image:secure_url", content: ogImage },
    },
    {
      tag: "meta",
      attrs: { property: "og:image:type", content: SITE.ogImageType },
    },
    {
      tag: "meta",
      attrs: { property: "og:image:width", content: String(SITE.ogImageWidth) },
    },
    {
      tag: "meta",
      attrs: {
        property: "og:image:height",
        content: String(SITE.ogImageHeight),
      },
    },
    {
      tag: "meta",
      attrs: { property: "og:image:alt", content: SITE.ogImageAlt },
    },

    {
      tag: "meta",
      attrs: { name: "twitter:card", content: "summary_large_image" },
    },
    { tag: "meta", attrs: { name: "twitter:title", content: SITE.title } },
    {
      tag: "meta",
      attrs: { name: "twitter:description", content: SITE.description },
    },
    { tag: "meta", attrs: { name: "twitter:image", content: ogImage } },
    {
      tag: "meta",
      attrs: { name: "twitter:image:alt", content: SITE.ogImageAlt },
    },

    // The trailer iframe is only created on click, so a full preconnect would
    // hold an unused socket. DNS resolution is the cheap half of the win.
    {
      tag: "link",
      attrs: { rel: "dns-prefetch", href: "https://www.youtube-nocookie.com" },
    },
    { tag: "link", attrs: { rel: "dns-prefetch", href: "https://i.ytimg.com" } },

    {
      tag: "script",
      attrs: { type: "application/ld+json" },
      children: JSON.stringify(buildStructuredData()),
    },
  ];

  if (SITE.twitterSite) {
    tags.push({
      tag: "meta",
      attrs: { name: "twitter:site", content: SITE.twitterSite },
    });
  }

  return tags;
}

/* -------------------------------------------------------------------------- */
/* 5. robots.txt                                                              */
/* -------------------------------------------------------------------------- */

export function buildRobotsTxt(): string {
  const lines = [
    `# ${SITE.name} — ${ORIGIN}`,
    "",
    "User-agent: *",
    "Allow: /",
    "",
    "# Search and AI crawlers, granted explicitly. A crawler that matches its",
    "# own group ignores the wildcard group above, so these repeat the grant.",
  ];

  for (const agent of ALLOWED_CRAWLERS) {
    lines.push("", `User-agent: ${agent}`, "Allow: /");
  }

  if (BLOCKED_CRAWLERS.length) {
    lines.push("", "# Denied");
    for (const agent of BLOCKED_CRAWLERS) {
      lines.push("", `User-agent: ${agent}`, "Disallow: /");
    }
  }

  lines.push("", `Sitemap: ${ORIGIN}/sitemap.xml`, "");
  return lines.join("\n");
}

/* -------------------------------------------------------------------------- */
/* 6. sitemap.xml                                                             */
/* -------------------------------------------------------------------------- */

const xmlEscape = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export function buildSitemap(lastmod = new Date().toISOString().slice(0, 10)): string {
  const entries = SEO_ROUTES.map((route) => {
    const loc = abs(route.path);
    const images = (route.images ?? [])
      .map(
        (image) =>
          `    <image:image>\n` +
          `      <image:loc>${xmlEscape(abs(image.loc))}</image:loc>\n` +
          `      <image:caption>${xmlEscape(image.caption)}</image:caption>\n` +
          `    </image:image>`,
      )
      .join("\n");

    return (
      `  <url>\n` +
      `    <loc>${xmlEscape(loc)}</loc>\n` +
      `    <lastmod>${lastmod}</lastmod>\n` +
      (route.priority ? `    <priority>${route.priority.toFixed(1)}</priority>\n` : "") +
      (images ? `${images}\n` : "") +
      `  </url>`
    );
  }).join("\n");

  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n` +
    `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n` +
    `${entries}\n` +
    `</urlset>\n`
  );
}

/* -------------------------------------------------------------------------- */
/* 7. llms.txt                                                                */
/* -------------------------------------------------------------------------- */

/**
 * A plain-text brief for language models, per llmstxt.org.
 *
 * The prerendered HTML already carries this information, but llms.txt gives an
 * assistant the facts with no markup to wade through, which measurably raises
 * the odds of being quoted accurately rather than paraphrased wrong.
 */
export function buildLlmsTxt(): string {
  const live = REALMS.filter((realm) => realm.status === "live");
  const rates = SERVER_FEATURES.find((group) => group.id === "rates");
  const systems = SERVER_FEATURES.find((group) => group.id === "systems");
  const policy = SERVER_FEATURES.find((group) => group.id === "policy");

  const out: string[] = [];
  const push = (...lines: string[]) => out.push(...lines);

  push(`# ${SITE.name}`, "");
  push(`> ${SITE.description}`, "");
  push(
    `${SITE.name} runs ${detail("Episode") ?? "classic episode"} content for Windows PC.`,
    `The client is a free ${DOWNLOAD_META.size} download and the game is played at ${ORIGIN}.`,
    "",
  );

  push("## Server facts", "");
  for (const stat of SERVER_STATS) push(`- ${stat.label}: ${stat.value}`);
  for (const row of SERVER_DETAILS) push(`- ${row.label}: ${row.value}`);
  push("");

  if (rates) {
    push(`## ${rates.heading}`, "");
    for (const item of rates.items) push(`- ${item.label}: ${item.value}`);
    push("");
  }

  push("## Realms", "");
  for (const realm of REALMS) {
    push(`### ${realm.name} (${realm.statusLabel})`, "", realm.blurb, "");
    for (const spec of realm.specs) push(`- ${spec.label}: ${spec.value}`);
    push("");
  }

  if (systems) {
    push(`## ${systems.heading}`, "");
    for (const item of systems.items) push(`- ${item.label}: ${item.value}`);
    push("");
  }

  if (policy) {
    push(`## ${policy.heading}`, "");
    for (const item of policy.items) push(`- ${item.label}: ${item.value}`);
    push("");
  }

  push("## System requirements", "");
  for (const group of MIN_SPECS) {
    push(`### ${group.heading}`, "");
    for (const row of group.rows) push(`- ${row.label}: ${row.value}`);
    push("");
  }

  push("## Expected performance", "");
  for (const tier of TIERS) {
    push(
      `- ${tier.name}: ${tier.fps} ${tier.fpsNote}. ${tier.summary} Needs ${tier.devices}, ${tier.memory}.`,
    );
  }
  push("");

  push("## Download", "");
  push(
    `- Client version: ${DOWNLOAD_META.version}`,
    `- Download size: ${DOWNLOAD_META.size}`,
    `- Requires: ${DOWNLOAD_META.requirement}`,
    `- Download page: ${abs(SITE.downloadUrl)}`,
    "",
  );

  push("## Links", "");
  push(`- [Home](${ORIGIN}/): ${SITE.description}`);
  push(
    `- [Download the client](${abs(SITE.downloadUrl)}): ${DOWNLOAD_META.size} Windows installer, version ${DOWNLOAD_META.version}.`,
  );
  if (live.length) {
    push(
      `- [Server information](${ORIGIN}/#servers): live realms and their regions, rate tiers and uptime.`,
    );
  }
  push(
    `- [Compatibility](${ORIGIN}/#compatibility): minimum, recommended and network requirements.`,
  );
  for (const href of SAME_AS) push(`- [Community](${href})`);
  push("");

  return out.join("\n");
}
