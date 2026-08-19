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

export const SITE = {
  url: "https://ranonline-egames.com",

  name: "Ran Online E-games",

  shortName: "Ran Online",

  lang: "en",
  locale: "en_US",
  themeColor: "#0A0707",

  title: "Ran Online E-games | Episode 6 Server, Free PC MMORPG",

  description:
    "Ran Online E-games runs Episode 6 on one channel: cap level 210, open skills, open maps and zero pay to win. Free client for Windows PC, or play on mobile through GameHub.",

  ogImage: "/images/legend-status.webp",
  ogImageType: "image/webp",
  ogImageWidth: 1920,
  ogImageHeight: 1080,
  ogImageAlt:
    "Ran Online Episode 6, campus fighters massed on the field after dark",

  twitterSite: "",

  downloadUrl: "/#download",

  trailer: null as null | {
    name: string;
    description: string;
    uploadDate: string;
    thumbnailUrl: string;
    embedUrl: string;
  },
} as const;

/**
 * Per page head copy. Every route that ships its own HTML file needs an entry
 * here, or it inherits the home page title and canonical.
 */
export const PAGES: Record<
  string,
  { name: string; title: string; description: string }
> = {
  "/": {
    name: "Home",
    title: SITE.title,
    description: SITE.description,
  },
  "/ranking": {
    name: "Rankings",
    title: "Rankings | Ran Online E-games League, Gold, Guild and PK Map",
    description:
      "Live Ran Online E-games rankings on Channel 0. League standings by class, top gold, guild power and the PK map kill boards, rebuilt every 10 minutes.",
  },
};

export function pageMeta(path: string) {
  return PAGES[path] ?? PAGES["/"];
}

export const SEO_ROUTES: {
  path: string;
  priority?: number;
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
  { path: "/ranking", priority: 0.8 },
];

export const ALLOWED_CRAWLERS = [
  "Googlebot",
  "Google-Extended",
  "Bingbot",
  "DuckDuckBot",
  "Applebot",
  "Applebot-Extended",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Meta-ExternalAgent",
  "Amazonbot",
  "DuckAssistBot",
  "cohere-ai",
  "YouBot",
];

export const BLOCKED_CRAWLERS: string[] = [];

const ORIGIN = SITE.url.replace(/\/+$/, "");

export function abs(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return ORIGIN + (path.startsWith("/") ? path : `/${path}`);
}

const ID = {
  website: `${ORIGIN}/#website`,
  organization: `${ORIGIN}/#organization`,
  game: `${ORIGIN}/#game`,
  image: `${ORIGIN}/#primaryimage`,
};

/** Canonical URL for a route. Only the home page carries a trailing slash. */
export function canonical(path: string): string {
  return path === "/" ? `${ORIGIN}/` : `${ORIGIN}${path}`;
}

const webpageId = (path: string) => `${canonical(path)}#webpage`;

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

export function buildStructuredData(path = "/"): Record<string, unknown> {
  const page = pageMeta(path);
  const url = canonical(path);

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
      "@id": webpageId(path),
      url,
      name: page.title,
      description: page.description,
      inLanguage: SITE.lang,
      isPartOf: { "@id": ID.website },
      about: { "@id": ID.game },
      primaryImageOfPage: { "@id": ID.image },
      ...(path === "/"
        ? {}
        : { breadcrumb: { "@id": `${url}#breadcrumb` } }),
    },
    {
      "@type": "VideoGame",
      "@id": ID.game,
      name: SITE.name,
      alternateName: SITE.shortName,
      description: SITE.description,
      url: `${ORIGIN}/`,
      image: { "@id": ID.image },
      inLanguage: SITE.lang,
      genre: ["MMORPG", "Action RPG", "Campus MMO"],
      // Mobile is played through GameHub, so the platform list carries it while
      // operatingSystem stays the Windows requirement of the downloadable client.
      gamePlatform: ["PC", "Microsoft Windows", "Mobile"],
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

  if (path !== "/") {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: PAGES["/"].name,
          item: `${ORIGIN}/`,
        },
        { "@type": "ListItem", position: 2, name: page.name },
      ],
    });
  }

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

export type HeadTag = {
  tag: string;
  attrs?: Record<string, string | boolean>;
  children?: string;
  injectTo?: "head" | "head-prepend";
};

export function buildHeadTags(path = "/"): HeadTag[] {
  const ogImage = abs(SITE.ogImage);
  const page = pageMeta(path);
  const url = canonical(path);

  const tags: HeadTag[] = [
    { tag: "title", children: page.title },
    { tag: "meta", attrs: { name: "description", content: page.description } },
    { tag: "link", attrs: { rel: "canonical", href: url } },

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
    { tag: "meta", attrs: { property: "og:url", content: url } },
    { tag: "meta", attrs: { property: "og:title", content: page.title } },
    {
      tag: "meta",
      attrs: { property: "og:description", content: page.description },
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
    { tag: "meta", attrs: { name: "twitter:title", content: page.title } },
    {
      tag: "meta",
      attrs: { name: "twitter:description", content: page.description },
    },
    { tag: "meta", attrs: { name: "twitter:image", content: ogImage } },
    {
      tag: "meta",
      attrs: { name: "twitter:image:alt", content: SITE.ogImageAlt },
    },

    {
      tag: "link",
      attrs: { rel: "dns-prefetch", href: "https://www.youtube-nocookie.com" },
    },
    { tag: "link", attrs: { rel: "dns-prefetch", href: "https://i.ytimg.com" } },

    {
      tag: "script",
      attrs: { type: "application/ld+json" },
      children: JSON.stringify(buildStructuredData(path)),
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

  push("## Channel", "");
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
  push(`- [Rankings](${canonical("/ranking")}): ${PAGES["/ranking"].description}`);
  for (const href of SAME_AS) push(`- [Community](${href})`);
  push("");

  return out.join("\n");
}
