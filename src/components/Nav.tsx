import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  DiscordLogo,
  DownloadSimple,
  FacebookLogo,
  List,
  X,
} from "@phosphor-icons/react";
import { LINKS } from "../data/content";
import { useActiveSection } from "../hooks/useActiveSection";
import { useScrolled } from "../hooks/useScrolled";
import { ROUTE_PATH, anchorBase, type Route } from "../routes";
import { Button } from "./ui/Button";
import { Logo } from "./ui/Logo";

type NavItem = {
  href: string;
  label: string;
  /** Home page sections this item spies on. Empty for links to another route. */
  sections: string[];
  /** Set when the item leads to a whole page rather than an anchor. */
  route?: Route;
};

const NAV_ITEMS: NavItem[] = [
  { href: "#footage", label: "Footage", sections: ["footage"] },
  {
    href: "#servers",
    label: "Servers",
    sections: ["servers", "server-features"],
  },
  { href: "#features", label: "Features", sections: ["features"] },
  { href: "#compatibility", label: "Compatibility", sections: ["compatibility"] },
  {
    href: ROUTE_PATH.ranking,
    label: "Ranking",
    sections: [],
    route: "ranking",
  },
];

const SPY_IDS = NAV_ITEMS.flatMap((item) => item.sections);

export function Nav({ route = "home" }: { route?: Route }) {
  const [open, setOpen] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const reduce = useReducedMotion();
  const activeSection = useActiveSection(SPY_IDS);
  const scrolled = useScrolled();

  const base = anchorBase(route);
  /** Section spying only means something on the page that owns those sections. */
  const onHome = route === "home";
  const visible = !onHome || scrolled || open || focusWithin;

  /** Hash items point back at the home page when read from another route. */
  const hrefOf = (item: NavItem) =>
    item.route ? item.href : `${base}${item.href}`;

  const isCurrent = (item: NavItem) =>
    item.route
      ? item.route === route
      : onHome && item.sections.includes(activeSection ?? "");

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      onFocusCapture={() => setFocusWithin(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setFocusWithin(false);
        }
      }}
      className={`fixed inset-x-0 top-0 z-50 border-b border-burgundy-900 bg-ink/95 backdrop-blur-md transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* gap tightens at lg: the nav appears there, and logo + links + actions
          only just fit 1024px. It relaxes again once xl has room to spare. */}
      <div className="mx-auto flex h-[var(--nav-h)] max-w-shell items-center justify-between gap-3 px-4 sm:px-6 lg:gap-4 lg:px-10 xl:gap-6">
        <a
          href={onHome ? "#top" : "/"}
          className="shrink-0 py-1 transition-opacity hover:opacity-80"
          aria-label={
            onHome ? "Ran Online E-games, back to top" : "Ran Online E-games, home"
          }
        >
          <Logo />
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const current = isCurrent(item);

              return (
                <li key={item.href}>
                  <a
                    href={hrefOf(item)}
                    aria-current={
                      current ? (item.route ? "page" : "location") : undefined
                    }
                    className={`label group relative block px-3 py-2.5 text-[11px] transition-colors xl:px-4 ${
                      current ? "text-blush" : "text-rose hover:text-blush"
                    }`}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-3 bottom-1 h-[2px] origin-left bg-crimson transition-transform duration-200 ease-out xl:inset-x-4 ${
                        current ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1 sm:flex">
            <SocialIcon
              href={LINKS.facebook}
              label="Ran Online E-games on Facebook"
            >
              <FacebookLogo size={18} weight="fill" />
            </SocialIcon>
            <SocialIcon href={LINKS.discord} label="Join the Discord server">
              <DiscordLogo size={18} weight="fill" />
            </SocialIcon>
          </div>

          <Button
            as="a"
            href={`${base}#download`}
            size="md"
            icon={<DownloadSimple size={17} weight="bold" />}
            className="hidden sm:inline-flex"
          >
            Download client
          </Button>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-11 w-11 items-center justify-center border border-burgundy-700 text-blush transition-colors hover:border-crimson lg:hidden"
          >
            {open ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            initial={reduce ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-[var(--nav-h)] max-h-[calc(100dvh-var(--nav-h))] overflow-y-auto border-b border-burgundy-900 bg-ink/95 backdrop-blur-md lg:hidden"
          >
            <nav aria-label="Mobile" className="px-4 py-5 sm:px-6">
              <ul className="flex flex-col">
                {NAV_ITEMS.map((item) => {
                  const current = isCurrent(item);

                  return (
                    <li
                      key={item.href}
                      className="border-b border-burgundy-900/80"
                    >
                      <a
                        href={hrefOf(item)}
                        onClick={() => setOpen(false)}
                        aria-current={
                          current ? (item.route ? "page" : "location") : undefined
                        }
                        className={`display block border-l-2 py-4 pl-4 text-[26px] transition-colors ${
                          current
                            ? "border-crimson text-crimson-hot"
                            : "border-transparent text-blush hover:text-crimson-hot"
                        }`}
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-6 flex flex-col gap-3">
                <Button
                  as="a"
                  href={`${base}#download`}
                  size="lg"
                  onClick={() => setOpen(false)}
                  icon={<DownloadSimple size={18} weight="bold" />}
                  className="w-full"
                >
                  Download client
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    as="a"
                    href={LINKS.facebook}
                    target="_blank"
                    rel="noreferrer"
                    variant="ghost"
                    icon={<FacebookLogo size={17} weight="fill" />}
                  >
                    Facebook
                  </Button>
                  <Button
                    as="a"
                    href={LINKS.discord}
                    target="_blank"
                    rel="noreferrer"
                    variant="ghost"
                    icon={<DiscordLogo size={17} weight="fill" />}
                  >
                    Discord
                  </Button>
                </div>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center border border-transparent text-rose transition-colors hover:border-burgundy-700 hover:text-crimson-hot"
    >
      {children}
    </a>
  );
}
