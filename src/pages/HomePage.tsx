import { Compatibility } from "../components/Compatibility";
import { DownloadCta } from "../components/DownloadCta";
import { GameFeatures } from "../components/GameFeatures";
import { Hero } from "../components/Hero";
import { ServerFeatures } from "../components/ServerFeatures";
import { ServerInfo } from "../components/ServerInfo";

export function HomePage() {
  return (
    <>
      <Hero />
      <ServerInfo />
      <ServerFeatures />
      <GameFeatures />
      <Compatibility />
      <DownloadCta />
    </>
  );
}
