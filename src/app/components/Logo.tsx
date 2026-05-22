type LogoProps = {
  size?: number;
  className?: string;
  label?: string;
};

export default function Logo({
  size = 36,
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

function Nucleus() {
  return (
    <svg
      className="brand-logo__nucleus"
      viewBox="0 0 100 100"
      aria-hidden="true"
      focusable="false"
    >
      <g className="brand-logo__nucleus-orbit">
        <circle className="satellite" cx="50" cy="8" r="6" opacity="0.9" />
        <circle className="satellite" cx="90" cy="68" r="5" opacity="0.7" />
        <circle className="satellite" cx="14" cy="74" r="4" opacity="0.55" />
      </g>
      <circle className="core" cx="50" cy="50" r="28" />
    </svg>
  );
}
