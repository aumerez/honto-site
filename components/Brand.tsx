import Link from 'next/link';

/** Brand gold (brand manual 06 · Color palette). */
export const GOLD = '#D4A24C';

/**
 * The Nucleus mark (brand manual 03 · Logo anatomy):
 * a gold core whose diameter equals the x-height of the "o", sitting on the baseline,
 * with three satellites at 12°, 120° and 230° and opacities 90 / 70 / 55 %.
 * Units: core diameter = 1. Sized in `em` so it scales with the wordmark.
 */
export function NucleusMark({ color = GOLD, style }: { color?: string; style?: React.CSSProperties }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="-0.68 -0.88 1.45 1.38"
      style={{ width: '0.77em', height: '0.73em', overflow: 'visible', marginLeft: '0.07em', verticalAlign: 'baseline', flexShrink: 0, ...style }}
    >
      <circle cx="0" cy="0" r="0.5" fill={color} />
      <circle cx="0.16" cy="-0.753" r="0.115" fill={color} fillOpacity="0.9" />
      <circle cx="0.667" cy="0.385" r="0.085" fill={color} fillOpacity="0.7" />
      <circle cx="-0.59" cy="0.495" r="0.07" fill={color} fillOpacity="0.55" />
    </svg>
  );
}

/** Wordmark lockup: "honto" in Manrope 700, −0.045em tracking, followed by the Nucleus mark. */
export function Logo({ size = 26, color = 'currentColor', markColor = GOLD }: { size?: number; color?: string; markColor?: string }) {
  return (
    <span className="logo" style={{ fontSize: size, color }}>
      <span className="logo-word">honto</span>
      <NucleusMark color={markColor} />
    </span>
  );
}

export function Wordmark({ href = '/', size = 26 }: { href?: string; size?: number }) {
  return (
    <Link href={href} className="wordmark" aria-label="Honto home">
      <Logo size={size} />
    </Link>
  );
}

/** Large animated Nucleus for the homepage intro (core 112px; satellites per the anatomy spec). */
export function OrbitLogo() {
  return (
    <div className="orbit-logo" role="img" aria-label="Honto logo">
      <div className="ring">
        <span className="sat" style={{ left: 130, top: 28, width: 26, height: 26, background: GOLD, opacity: 0.9 }} />
        <span className="sat" style={{ left: 190, top: 159, width: 19, height: 19, background: GOLD, opacity: 0.7 }} />
        <span className="sat" style={{ left: 51, top: 172, width: 16, height: 16, background: GOLD, opacity: 0.55 }} />
      </div>
      <div className="core" />
    </div>
  );
}
