import { Reveal } from "./Reveal";

type SectionHeadingProps = {
  title: string;
  lead?: string;
};

export function SectionHeading({ title, lead }: SectionHeadingProps) {
  return (
    <Reveal as="header" className="mb-10 md:mb-14">
      <span aria-hidden="true" className="mb-5 block h-[3px] w-14 bg-crimson" />
      <h2 className="display text-[38px] sm:text-[48px] lg:text-[60px]">
        {title}
      </h2>
      {lead ? (
        <p className="mt-4 max-w-[58ch] text-[15px] leading-relaxed text-rose">
          {lead}
        </p>
      ) : null}
    </Reveal>
  );
}
