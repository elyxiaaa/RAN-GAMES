import { BRAND } from "../../data/content";

type LogoProps = {
  scale?: "nav" | "hero";
  className?: string;
};

export function Logo({ scale = "nav", className = "" }: LogoProps) {
  const isHero = scale === "hero";

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      {BRAND.logoSrc ? (
        <img
          src={BRAND.logoSrc}
          alt=""
          aria-hidden="true"
          width={447}
          height={447}
          decoding="async"
          className={`${isHero ? "h-16 w-16 md:h-20 md:w-20" : "h-9 w-9"} shrink-0 object-contain`}
        />
      ) : (
        <span
          aria-hidden="true"
          className={`block bg-crimson ${isHero ? "h-14 w-[5px] md:h-20" : "h-7 w-[3px]"}`}
        />
      )}

      <span className="flex flex-col justify-center leading-none">
        <span
          className={`display ${
            isHero
              ? "text-[34px] leading-[0.86] md:text-[46px]"
              : "text-[22px] leading-[0.86]"
          }`}
        >
          {BRAND.name}
        </span>
        <span
          className={`label text-crimson-hot ${
            isHero ? "mt-1.5 text-[11px] md:text-[13px]" : "mt-1 text-[9px]"
          }`}
        >
          {BRAND.suffix}
        </span>
      </span>
    </span>
  );
}
