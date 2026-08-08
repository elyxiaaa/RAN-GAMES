export const BRAND = {
  name: "RAN ONLINE",
  suffix: "OFFICIAL",
  episode: "EPISODE 3",
  logoSrc: "/images/main-logo.webp" as string | null,
};

export const LINKS = {
  facebook: "https://www.facebook.com/",
  discord: "https://discord.gg/",
  client: "#download",
  mirror1: "#download",
  mirror2: "#download",
  trailer: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
};

export const MEDIA = {
  trailerPoster: "/images/legend-status.webp",
  featureHunt: "/images/leonine-campus.webp",
  featureFactions: "/images/sg-campus-bg.webp",
  downloadBackdrop: "/images/download-image.webp",
};

export const HERO_ART = {
  backdrop: "/images/background.webp" as string | null,
  backdropVideo: "/videos/background.mp4" as string | null,
  campus: "/images/campus.webp" as string | null,
  character: "/images/character.webp" as string | null,
};

export const HERO_MARK = {
  cycle: ["RAN ONLINE", "EPISODE 3"],
  spoken: "Ran Online Official. Episode 3 is live.",
};

export const HERO_COPY = {
  headline: ["The campus", "war reopens"],
  tagline: "Pure hunt. Player run economy. Zero pay to win.",
};

export const FACTIONS = [
  {
    id: "sacred-gate",
    name: "Sacred Gate",
    value: 69000,
    crest: "/images/SG.webp",
  },
  {
    id: "mystic-peak",
    name: "Mystic Peak",
    value: 67000,
    crest: "/images/MP.webp",
  },
  {
    id: "phoenix",
    name: "Phoenix",
    value: 69000,
    crest: "/images/PHNX.webp",
  },
];

export const LIVE_STATS = [
  { id: "online", label: "Players online", value: 12847, format: "int" },
  { id: "peak", label: "Peak today", value: 18402, format: "int" },
  { id: "parties", label: "Parties hunting", value: 1136, format: "int" },
] as const;

export const SHOWCASE = [
  {
    id: "mystic-peak",
    caption: "Mystic Peak, the founder's statue after dark",
    src: "/images/mp-campus-bg.webp",
  },
  {
    id: "phoenix",
    caption: "Phoenix, the canal approach at last light",
    src: "/images/phnx-campus-bg.webp",
  },
  {
    id: "leonine",
    caption: "Leonine B3, where the deep floor starts",
    src: "/images/leonine-b3.webp",
  },
  {
    id: "trading",
    caption: "The trading hole at peak hours",
    src: "/images/trading-hole.webp",
  },
  {
    id: "prison",
    caption: "Prison grounds, outside the wire",
    src: "/images/prison.webp",
  },
];

export const SERVER_STATS = [
  { id: "max-level", value: "135", label: "Max Level" },
  { id: "last-skill", value: "Lv 127", label: "Last Skill" },
  { id: "exp-rate", value: "Low", label: "EXP Rate" },
  { id: "drop-rate", value: "Low", label: "Drop Rate" },
];

export const SERVER_DETAILS = [
  { label: "Episode", value: "Episode 3 (Classic)" },
  { label: "Gameplay", value: "Party Leveling" },
  { label: "Skill Type", value: "Sphere / Quest Based" },
  { label: "Map Type", value: "Quest Based" },
  { label: "Last Set", value: "Dynamic and Enhanced Series" },
  { label: "Last Weapon", value: "Dragon Sword Series" },
  { label: "Last Map", value: "Hangout 3F, B3" },
  { label: "Platform", value: "PC (Windows)" },
];

export type Realm = {
  id: string;
  name: string;
  status: "live" | "scheduled";
  statusLabel: string;
  blurb: string;
  specs: { label: string; value: string }[];
};

export const REALMS: Realm[] = [
  {
    id: "strife",
    name: "Strife",
    status: "live",
    statusLabel: "Live now",
    blurb:
      "The flagship realm. Full Episode 3 content, all six classes unlocked, sieges every Saturday.",
    specs: [
      { label: "Region", value: "Singapore" },
      { label: "Client", value: "3.0.4" },
      { label: "Rate tier", value: "Classic" },
      { label: "Max level", value: "135" },
      { label: "Avg ping", value: "38 ms" },
      { label: "Uptime, 30 days", value: "99.6%" },
    ],
  },
  {
    id: "fury",
    name: "Fury",
    status: "scheduled",
    statusLabel: "Opens soon",
    blurb:
      "Classic rate realm for players who want the long climb. Fresh economy, no transfers in.",
    specs: [
      { label: "Region", value: "Singapore" },
      { label: "Rate tier", value: "Mid" },
      { label: "Max level", value: "150" },
      { label: "Transfers", value: "Closed" },
    ],
  },
];

export const SERVER_FEATURES = [
  {
    id: "rates",
    heading: "Rates",
    kind: "numbers" as const,
    items: [
      { label: "Base EXP", value: "x5" },
      { label: "Job EXP", value: "x5" },
      { label: "Item drop", value: "x3" },
      { label: "Gold drop", value: "x3" },
    ],
  },
  {
    id: "systems",
    heading: "Live systems",
    kind: "list" as const,
    items: [
      {
        label: "Special PK",
        value: "Sealed map, free for all, school tags off. Every night on the hour",
      },
      {
        label: "Tyranny War",
        value:
          "Three schools, one throne. Saturdays 21:00 PHT, and the winner holds the buff all week",
      },
      {
        label: "Club War",
        value:
          "Club against club on a booked field. Registration closes Friday, brackets go up Saturday morning",
      },
      {
        label: "Red vs Blue",
        value:
          "Teams drawn at the door, so it comes down to your gear and not your roster. Twice nightly",
      },
    ],
  },
  {
    id: "policy",
    heading: "House rules",
    kind: "list" as const,
    items: [
      {
        label: "No pay to win",
        value: "Cash shop carries cosmetics and convenience only",
      },
      {
        label: "No wipes",
        value: "Your characters and your gear stay where you left them",
      },
      {
        label: "Staff cannot spawn gear",
        value: "GM accounts are audited and item creation is disabled",
      },
      {
        label: "Support, 24 hours",
        value: "Ticket queue on Discord with a same day first reply",
      },
    ],
  },
];

export const TIERS = [
  {
    id: "ultra",
    name: "ULTRA",
    fps: "144",
    fpsNote: "frames per second",
    summary: "Every effect on, full crowd density, siege fields uncapped.",
    devices: "RTX 3060 or RX 6600 XT and up, Core i5-12400 or Ryzen 5 5600",
    memory: "16 GB RAM",
    weight: 3,
  },
  {
    id: "balanced",
    name: "BALANCED",
    fps: "60-90",
    fpsNote: "frames per second",
    summary: "High effects, crowd density trimmed during sieges.",
    devices: "GTX 1660 Super or RX 580, Core i5-9400 or Ryzen 5 2600",
    memory: "16 GB RAM",
    weight: 2,
  },
  {
    id: "lite",
    name: "LITE",
    fps: "60",
    fpsNote: "frames per second, locked",
    summary: "Reduced shadows and particles, crowd capped at forty players.",
    devices: "GTX 1050 Ti or Iris Xe integrated, Core i3-8100",
    memory: "8 GB RAM",
    weight: 1,
  },
];

export const MIN_SPECS = [
  {
    id: "minimum",
    heading: "Minimum",
    rows: [
      { label: "OS", value: "Windows 10 64-bit" },
      { label: "Processor", value: "Core i3-8100 or Ryzen 3 1200" },
      { label: "Graphics", value: "GTX 1050 Ti, 4 GB VRAM, DirectX 11" },
      { label: "Memory", value: "8 GB RAM" },
      { label: "Storage", value: "12 GB free after install" },
    ],
  },
  {
    id: "recommended",
    heading: "Recommended",
    rows: [
      { label: "OS", value: "Windows 11 64-bit" },
      { label: "Processor", value: "Core i5-12400 or Ryzen 5 5600" },
      { label: "Graphics", value: "RTX 3060, 8 GB VRAM, DirectX 12" },
      { label: "Memory", value: "16 GB RAM" },
      { label: "Storage", value: "12 GB free on an SSD" },
    ],
  },
  {
    id: "network",
    heading: "Network",
    rows: [
      { label: "Connection", value: "15 Mbps down, stable" },
      { label: "Patch size", value: "6.4 GB first download" },
      { label: "Data per hour", value: "About 90 MB while hunting" },
      { label: "Best ping", value: "Under 80 ms to Singapore" },
    ],
  },
];

export const DOWNLOAD_META = {
  version: "3.0.4",
  size: "6.4 GB",
  requirement: "Windows 10 64-bit or newer",
};
