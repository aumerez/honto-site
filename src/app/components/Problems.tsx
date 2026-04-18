"use client";

import { useLocale } from "@/context/LocaleContext";
import { parseItalic } from "@/lib/parseItalic";

export default function Problems() {
  const { t } = useLocale();
  const p = t.problems;
  const items = [
    { q: p.q1, a: p.a1 },
    { q: p.q2, a: p.a2 },
    { q: p.q3, a: p.a3 },
    { q: p.q4, a: p.a4 },
    { q: p.q5, a: p.a5 },
    { q: p.q6, a: p.a6 },
  ];

  return (
    <section className="sec" id="problems">
      <div className="container-x">
        <div className="sec-head">
          <div>
            <div className="eyebrow">{p.eyebrow}</div>
          </div>
          <h2 className="sec-title">
            {p.titlePre}
            <i>{p.titleItalic}</i>
            {p.titlePost}
          </h2>
        </div>

        <div className="problems-list">
          {items.map((item, i) => (
            <div className="problem" key={i}>
              <div className="problem-num">
                P.{String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="problem-q">{parseItalic(item.q)}</h3>
              <div className="problem-a">{item.a}</div>
              <div className="problem-arrow" aria-hidden="true">
                ↗
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
