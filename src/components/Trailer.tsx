import { useState } from "react";
import { Play } from "@phosphor-icons/react";
import { LINKS, MEDIA, SHOWCASE } from "../data/content";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

function youTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/,
  );
  return match ? match[1] : null;
}

export function Trailer() {
  const [playing, setPlaying] = useState(false);
  const videoId = youTubeId(LINKS.trailer);

  return (
    <section
      id="footage"
      className="border-b border-burgundy-900 bg-ink py-20 lg:py-28"
    >
      <div className="mx-auto max-w-shell px-4 sm:px-6 lg:px-10">
        <SectionHeading
          title="Live footage"
          lead="Captured on a GTX 1660 at 1440p, at the settings the client ships with. No cutscene edits, no bumped hardware."
        />

        <Reveal className="relative">
          <div className="relative aspect-video w-full overflow-hidden border border-burgundy-700 bg-ember">
            {playing && videoId ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
                title="Ran Online E-games Episode 3 trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            ) : (
              <>
                <img
                  src={MEDIA.trailerPoster}
                  alt="Still frame from the Episode 3 trailer"
                  loading="lazy"
                  decoding="async"
                  className="duotone absolute inset-0 h-full w-full object-cover opacity-70"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_50%,rgba(36,10,12,0.35)_0%,rgba(10,7,7,0.88)_100%)]"
                />

                {videoId ? (
                  <button
                    type="button"
                    onClick={() => setPlaying(true)}
                    className="group absolute inset-0 flex flex-col items-center justify-center gap-5"
                    aria-label="Play the Episode 3 trailer"
                  >
                    <PlayMark />
                    <span className="label text-[11px] text-blush">
                      Episode 3 trailer
                    </span>
                  </button>
                ) : (
                  <a
                    href={LINKS.trailer}
                    target="_blank"
                    rel="noreferrer"
                    className="group absolute inset-0 flex flex-col items-center justify-center gap-5"
                    aria-label="Open the Episode 3 trailer"
                  >
                    <PlayMark />
                    <span className="label text-[11px] text-blush">
                      Episode 3 trailer
                    </span>
                  </a>
                )}
              </>
            )}
          </div>
        </Reveal>

        <div className="mt-12">
          <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
            {SHOWCASE.map((shot, index) => (
              <Reveal
                as="li"
                key={shot.id}
                index={index}
                className="w-[78vw] shrink-0 snap-start sm:w-[46vw] lg:w-[calc((100%-3rem)/4)]"
              >
                <figure>
                  <div className="overflow-hidden border border-burgundy-900 bg-ember">
                    <img
                      src={shot.src}
                      alt={shot.caption}
                      loading="lazy"
                      decoding="async"
                      className="duotone aspect-[3/2] w-full object-cover transition-transform duration-500 ease-out hover:scale-[1.04]"
                    />
                  </div>
                  <figcaption className="mt-3 text-[13px] leading-snug text-rose">
                    {shot.caption}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function PlayMark() {
  return (
    <span
      aria-hidden="true"
      className="flex h-[74px] w-[74px] items-center justify-center bg-crimson text-white shadow-cta transition-all duration-200 ease-out group-hover:scale-105 group-hover:bg-crimson-hot group-hover:shadow-ctaHover"
    >
      <Play size={30} weight="fill" />
    </span>
  );
}
