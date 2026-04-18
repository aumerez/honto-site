"use client";

import { useLocale } from "@/context/LocaleContext";

type ProblemItem = {
  pre: string;
  italic: string;
  post: string;
  answer: string;
};

type ProblemsCopy = {
  eyebrow: string;
  titlePre: string;
  titleItalic: string;
  titlePost: string;
  items: ProblemItem[];
};

export default function Problems() {
  const { t } = useLocale();
  const copy = (t.landing as { problems: ProblemsCopy }).problems;

  return (
    <section className="sec" id="problems">
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

        <div className="problems-list">
          {copy.items.map((p, i) => (
            <div className="problem" key={i}>
              <div className="problem-num">
                P.{String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="problem-q">
                {p.pre}
                <i>{p.italic}</i>
                {p.post}
              </h3>
              <div className="problem-a">{p.answer}</div>
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
