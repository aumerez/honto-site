"use client";

import { useLocale } from "@/context/LocaleContext";

export default function Marquee() {
  const { t } = useLocale();
  const m = t.marquee;
  const items = [m.i1, m.i2, m.i3, m.i4, m.i5, m.i6, m.i7, m.i8, m.i9];
  const row = <span>{items.join("   ·   ")}</span>;
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {row}
        {row}
        {row}
        {row}
      </div>
    </div>
  );
}
