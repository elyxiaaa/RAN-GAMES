import { SERVER_FEATURES } from "../data/content";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

export function ServerFeatures() {
  return (
    <section
      id="server-features"
      className="border-b border-burgundy-900 bg-ink py-20 lg:py-28"
    >
      <div className="mx-auto max-w-shell px-4 sm:px-6 lg:px-10">
        <SectionHeading
          title="Server features"
          lead="The full configuration, published up front. Nothing here changes without a notice on Discord first."
        />

        <div className="flex flex-col gap-14">
          {SERVER_FEATURES.map((cluster, clusterIndex) => (
            <Reveal key={cluster.id} index={clusterIndex}>
              <div className="flex items-center gap-5">
                <h3 className="display text-[24px] sm:text-[28px]">
                  {cluster.heading}
                </h3>
                <span
                  aria-hidden="true"
                  className="h-px flex-1 bg-burgundy-900"
                />
              </div>

              {cluster.kind === "numbers" ? (
                <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
                  {cluster.items.map((item) => (
                    <div key={item.label}>
                      <dd className="stat-num text-[46px] leading-none text-crimson-hot sm:text-[58px]">
                        {item.value}
                      </dd>
                      <dt className="label mt-3 text-[10px] text-rose">
                        {item.label}
                      </dt>
                    </div>
                  ))}
                </dl>
              ) : (
                <dl className="mt-7 grid gap-x-10 gap-y-7 sm:grid-cols-2">
                  {cluster.items.map((item) => (
                    <div key={item.label}>
                      <dt className="display text-[19px] text-blush">
                        {item.label}
                      </dt>
                      <dd className="mt-1.5 max-w-[46ch] text-[14px] leading-relaxed text-rose">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
