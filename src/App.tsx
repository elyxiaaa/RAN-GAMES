import { Footer } from "./components/Footer";
import { Grain } from "./components/Grain";
import { Nav } from "./components/Nav";
import { HomePage } from "./pages/HomePage";
import { RankingPage } from "./pages/RankingPage";
import { useHashScroll } from "./hooks/useHashScroll";
import { type Route } from "./routes";

export default function App({ route = "home" }: { route?: Route }) {
  useHashScroll();

  return (
    <>
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:border focus:border-crimson focus:bg-ink focus:px-4 focus:py-2 focus:text-blush"
      >
        Skip to content
      </a>

      <Grain />
      <Nav route={route} />

      <main>{route === "ranking" ? <RankingPage /> : <HomePage />}</main>

      <Footer route={route} />
    </>
  );
}
