type LogoProps = {
  size?: number;
  className?: string;
  label?: string;
};

export default function Logo({
  size = 30,
  className = "",
  label = "honto.",
}: LogoProps) {
  const cls = ["brand-logo", className].filter(Boolean).join(" ");
  return (
    <span
      className={cls}
      style={{ fontSize: `${size}px` }}
      role="img"
      aria-label={label}
    >
      <span className="brand-logo__wordmark" aria-hidden="true">
        honto
      </span>
      <Nucleus />
    </span>
  );
}

// Core sits at viewBox center (50,50) so the satellite ring rotates around it.
// Brand-spec angles: satellites at 12°, 120°, 230° measured clockwise from 12
// o'clock. Orbital radius = 42 places the satellite OUTER edges just past
// cap-height when the SVG is sized to 0.8em.
function Nucleus() {
  return (
    <svg
      className="brand-logo__nucleus"
      viewBox="0 0 100 100"
      aria-hidden="true"
      focusable="false"
    >
      <g className="brand-logo__nucleus-orbit">
        <circle
          className="satellite"
          cx="58.73"
          cy="8.92"
          r="3.5"
          opacity="0.9"
        />
        <circle
          className="satellite"
          cx="86.37"
          cy="71.0"
          r="2.75"
          opacity="0.7"
        />
        <circle
          className="satellite"
          cx="17.83"
          cy="77.0"
          r="2.0"
          opacity="0.55"
        />
      </g>
      <circle className="core" cx="50" cy="50" r="32" />
    </svg>
  );
}
