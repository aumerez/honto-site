"use client";

import { useLocale } from "@/context/LocaleContext";

export default function Principles() {
  const { t } = useLocale();
  const p = t.principles;
  const items = [
    { k: "P.01", t: p.p1Title, d: p.p1Desc },
    { k: "P.02", t: p.p2Title, d: p.p2Desc },
    { k: "P.03", t: p.p3Title, d: p.p3Desc },
    { k: "P.04", t: p.p4Title, d: p.p4Desc },
    { k: "P.05", t: p.p5Title, d: p.p5Desc },
    { k: "P.06", t: p.p6Title, d: p.p6Desc },
  ];

  return (
    <section className="sec" id="principles">
      <div className="container-x">
        <div className="sec-head">
          <div>
            <div className="eyebrow">{p.eyebrow}</div>
          </div>
          <h2 className="sec-title">
            {p.titlePre}
            <i>{p.titleItalic}</i>
          </h2>
        </div>
        <div className="principles">
          {items.map((item) => (
            <div className="prin" key={item.k}>
              <div className="prin-k">{item.k}</div>
              <div className="prin-t">{item.t}</div>
              <div className="prin-d">{item.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
