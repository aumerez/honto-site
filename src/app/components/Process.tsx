"use client";

import { useLocale } from "@/context/LocaleContext";

export default function Process() {
  const { t } = useLocale();
  const p = t.process;
  const steps = [
    { n: "01", label: p.p1Label, t: p.p1Title, d: p.p1Desc },
    { n: "02", label: p.p2Label, t: p.p2Title, d: p.p2Desc },
    { n: "03", label: p.p3Label, t: p.p3Title, d: p.p3Desc },
    { n: "04", label: p.p4Label, t: p.p4Title, d: p.p4Desc },
  ];

  return (
    <section className="sec" id="process">
      <div className="container-x">
        <div className="sec-head">
          <div>
            <div className="eyebrow">{p.eyebrow}</div>
          </div>
          <h2 className="sec-title">
            {p.titlePre}
            <i>{p.titleItalic1}</i>
            {p.titleMid}
            <i>{p.titleItalic2}</i>
            {p.titlePost}
          </h2>
        </div>
        <div className="process">
          {steps.map((s) => (
            <div className="step" key={s.n}>
              <div className="step-num">{s.n}</div>
              <div className="step-label">{s.label}</div>
              <div className="step-title">{s.t}</div>
              <div className="step-desc">{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
