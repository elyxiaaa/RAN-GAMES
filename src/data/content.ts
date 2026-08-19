export const BRAND = {
  name: "RAN ONLINE",
  suffix: "E-GAMES",
  episode: "EPISODE 6",
  episodeName: "Episode 6",
  logoSrc: "/images/main-logo.webp" as string | null,
};

export const LINKS = {
  facebook: "https://www.facebook.com/RanOnlineEGamesOfficial",
  discord: "https://discord.gg/QJJhF7Mfw",
  client:
    "https://drive.google.com/file/d/1EJ16Gh1XB9v8ogxzEN8MZyFN17hvrmR7/",
  mirror:
    "https://www.mediafire.com/file/zay6mw46gjri99i/RanOnlineEGamesInstaller.exe/file",
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
  cycle: ["RAN ONLINE", BRAND.episode],
  spoken: `Ran Online E-games. ${BRAND.episodeName} is live.`,
};

export const HERO_COPY = {
  headline: ["The campus", "war reopens"],
  tagline: "Pure hunt. Player run economy. Zero pay to win.",
};

export const FACTIONS = [
  {
    id: "sacred-gate",
    name: "Sacred Gate",
    code: "SG",
    crest: "/images/SG.webp",
  },
  {
    id: "mystic-peak",
    name: "Mystic Peak",
    code: "MP",
    crest: "/images/MP.webp",
  },
  {
    id: "phoenix",
    name: "Phoenix",
    code: "PHX",
    crest: "/images/PHNX.webp",
  },
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

export const SERVER_STATS: {
  id: string;
  value: string;
  label: string;
  phrase?: true;
}[] = [
  { id: "cap-level", value: "210", label: "Cap Level" },
  { id: "last-skill", value: "Lv 167", label: "Last Skill" },
  { id: "exp-rate", value: "Mid to high", label: "EXP Rate", phrase: true },
  { id: "drop-rate", value: "Low", label: "Drop Rate" },
  { id: "channels", value: "Channel 0 only", label: "Channels", phrase: true },
];

export const SERVER_DETAILS = [
  { label: "Episode", value: BRAND.episodeName },
  { label: "Gameplay", value: "Sync gaming" },
  { label: "Skill Type", value: "Open skill, no scroll needed" },
  { label: "Map Type", value: "Open map" },
  { label: "Last Set", value: "195 C Set series" },
  { label: "Last Weapon", value: "Level 160 weapon series" },
  { label: "Last Map", value: "Director's Room and Head B Underground" },
  { label: "Platform", value: "Desktop, laptop and mobile via GameHub" },
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
    id: "channel-0",
    name: "Channel 0",
    status: "live",
    statusLabel: "Live now",
    blurb: `The only channel. Full ${BRAND.episodeName} content, all six classes unlocked, sieges every Saturday.`,
    specs: [
      { label: "Region", value: "Singapore" },
      { label: "Client", value: "3.0.4" },
      { label: "Rate tier", value: "Mid to high" },
      { label: "Cap level", value: "210" },
      { label: "Avg ping", value: "38 ms" },
      { label: "Uptime, 30 days", value: "99.6%" },
    ],
  },
];

export type FeatureCluster = {
  id: string;
  heading: string;
  kind: "numbers" | "list";
  items: { label: string; value: string }[];
};

export const SERVER_FEATURES: FeatureCluster[] = [
  {
    id: "systems",
    heading: "Live systems",
    kind: "list",
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
    kind: "list",
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
