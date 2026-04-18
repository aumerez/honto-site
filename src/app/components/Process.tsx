"use client";

import { useLocale } from "@/context/LocaleContext";

type ProcessStep = { num: string; label: string; title: string; desc: string };

type ProcessCopy = {
  eyebrow: string;
  titlePre: string;
  titleItalic1: string;
  titleMid: string;
  titleItalic2: string;
  titlePost: string;
  steps: ProcessStep[];
};

export default function Process() {
  const { t } = useLocale();
  const copy = (t.landing as { process: ProcessCopy }).process;

  return (
    <section className="sec" id="process">
      <div className="container-x">
        <div className="sec-head">
          <div>
            <div className="eyebrow">{copy.eyebrow}</div>
          </div>
          <h2 className="sec-title">
            {copy.titlePre}
            <i>{copy.titleItalic1}</i>
            {copy.titleMid}
            <i>{copy.titleItalic2}</i>
            {copy.titlePost}
          </h2>
        </div>
        <div className="process">
          {copy.steps.map((s) => (
            <div className="step" key={s.num}>
              <div className="step-num">{s.num}</div>
              <div className="step-label">{s.label}</div>
              <div className="step-title">{s.title}</div>
              <div className="step-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
