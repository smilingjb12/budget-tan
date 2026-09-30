/**
 * SVG filters for the ink theme, rendered once per page and referenced from
 * CSS (`filter: url(#ink-brush)`). The brush filter wobbles a stroke's edges
 * with fractal noise, then blurs and re-thresholds the alpha so line ends and
 * corners pool slightly, like sumi soaking into paper.
 */
export function InkFilters() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      className="pointer-events-none absolute"
    >
      <defs>
        <filter
          id="ink-brush"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="2"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="1.4"
            xChannelSelector="R"
            yChannelSelector="G"
            result="rough"
          />
          <feGaussianBlur in="rough" stdDeviation="0.35" result="bled" />
          <feComponentTransfer in="bled">
            <feFuncA type="table" tableValues="0 0 0.9 1 1" />
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>
  );
}
