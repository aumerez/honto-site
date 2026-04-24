type LogoProps = {
  size?: number;
  className?: string;
  label?: string;
};

export default function Logo({
  size = 24,
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
      viewBox="0 0 36 44"
      aria-hidden="true"
      focusable="false"
    >
      <circle className="satellite" cx="4.8" cy="39.7" r="2.0" opacity="0.55" />
      <circle className="satellite" cx="24.4" cy="38" r="2.5" opacity="0.70" />
      <circle
        className="satellite"
        cx="16.5"
        cy="20.3"
        r="3.0"
        opacity="0.90"
      />
      <circle className="core" cx="14" cy="32" r="7.5" />
    </svg>
  );
}
