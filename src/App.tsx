import { Compatibility } from "./components/Compatibility";
import { DownloadCta } from "./components/DownloadCta";
import { Footer } from "./components/Footer";
import { GameFeatures } from "./components/GameFeatures";
import { Grain } from "./components/Grain";
import { Hero } from "./components/Hero";
import { Nav } from "./components/Nav";
import { ServerFeatures } from "./components/ServerFeatures";
import { ServerInfo } from "./components/ServerInfo";
import { Trailer } from "./components/Trailer";

export default function App() {
  return (
    <>
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:border focus:border-crimson focus:bg-ink focus:px-4 focus:py-2 focus:text-blush"
      >
        Skip to content
      </a>

      <Grain />
      <Nav />

      <main>
        <Hero />
        <Trailer />
        <ServerInfo />
        <ServerFeatures />
        <GameFeatures />
        <Compatibility />
        <DownloadCta />
      </main>

      <Footer />
    </>
  );
}
