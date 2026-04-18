"use client";

import { useLocale } from "@/context/LocaleContext";

type Principle = { k: string; title: string; desc: string };

type PrinciplesCopy = {
  eyebrow: string;
  titlePre: string;
  titleItalic: string;
  titlePost: string;
  items: Principle[];
};

export default function Principles() {
  const { t } = useLocale();
  const copy = (t.landing as { principles: PrinciplesCopy }).principles;

  return (
    <section className="sec" id="principles">
      <div className="container-x">
        <div className="sec-head">
          <div>
            <div className="eyebrow">{copy.eyebrow}</div>
          </div>
          <h2 className="sec-title">
            {copy.titlePre}
            <i>{copy.titleItalic}</i>
            {copy.titlePost}
          </h2>
        </div>
        <div className="principles">
          {copy.items.map((p) => (
            <div className="prin" key={p.k}>
              <div className="prin-k">{p.k}</div>
              <div className="prin-t">{p.title}</div>
              <div className="prin-d">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
