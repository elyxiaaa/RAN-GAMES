const GRAIN_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">
    <filter id="n">
      <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="3" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
    <rect width="180" height="180" filter="url(#n)" opacity="0.55"/>
  </svg>`,
);

export function Grain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] opacity-[0.055] mix-blend-overlay"
      style={{ backgroundImage: `url("data:image/svg+xml,${GRAIN_SVG}")` }}
    />
  );
}
