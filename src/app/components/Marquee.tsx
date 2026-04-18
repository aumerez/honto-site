"use client";

import { useLocale } from "@/context/LocaleContext";

type MarqueeCopy = { items: string[] };

export default function Marquee() {
  const { t } = useLocale();
  const items = (t.landing as { marquee: MarqueeCopy }).marquee.items;
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
