import { DiscordLogo, FacebookLogo } from "@phosphor-icons/react";
import { LINKS } from "../data/content";
import { ROUTE_PATH, anchorBase, type Route } from "../routes";
import { Logo } from "./ui/Logo";

const COLUMNS = [
  {
    heading: "Game",
    links: [
      { label: "Live footage", href: "#footage" },
      { label: "Features", href: "#features" },
      { label: "Compatibility", href: "#compatibility" },
      { label: "Download", href: "#download" },
    ],
  },
  {
    heading: "Servers",
    links: [
      { label: "Server information", href: "#servers" },
      { label: "Server features", href: "#server-features" },
      { label: "Rankings", href: ROUTE_PATH.ranking },
      { label: "Rates and rules", href: "#server-features" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Patch notes", href: LINKS.discord },
      { label: "Report a player", href: LINKS.discord },
      { label: "Account recovery", href: LINKS.discord },
      { label: "Contact staff", href: LINKS.discord },
    ],
  },
];

export function Footer({ route = "home" }: { route?: Route }) {
  const base = anchorBase(route);

  return (
    <footer className="bg-ember">
      <div className="mx-auto max-w-shell px-4 py-16 sm:px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))]">
          <div>
            <Logo />
            <p className="mt-5 max-w-[38ch] text-[14px] leading-relaxed text-rose">
              A campus MMORPG built for PC, run by people who still play it.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={LINKS.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Ran Online E-games on Facebook"
                className="flex h-11 w-11 items-center justify-center border border-burgundy-700 text-rose transition-colors hover:border-crimson hover:text-crimson-hot"
              >
                <FacebookLogo size={19} weight="fill" />
              </a>
              <a
                href={LINKS.discord}
                target="_blank"
                rel="noreferrer"
                aria-label="Join the Ran Online E-games Discord server"
                className="flex h-11 w-11 items-center justify-center border border-burgundy-700 text-rose transition-colors hover:border-crimson hover:text-crimson-hot"
              >
                <DiscordLogo size={19} weight="fill" />
              </a>
            </div>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <span className="label block text-[10px] text-blush">
                {column.heading}
              </span>
              <ul className="mt-4 flex flex-col gap-1">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={
                        link.href.startsWith("#")
                          ? `${base}${link.href}`
                          : link.href
                      }
                      className="inline-flex min-h-11 items-center py-2 text-[14px] text-rose transition-colors hover:text-crimson-hot"
                      {...(link.href.startsWith("http")
                        ? { target: "_blank", rel: "noreferrer" }
                        : {})}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-burgundy-900 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-rose">
            Copyright 2026 Ran Online E-games. All rights reserved.
          </p>
          <p className="max-w-[52ch] text-[12px] leading-relaxed text-rose/80">
            Ran Online and all related marks belong to their respective owners.
            This site is operated by the server team.
          </p>
        </div>
      </div>
    </footer>
  );
}
