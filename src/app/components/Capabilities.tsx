"use client";

import { useLocale } from "@/context/LocaleContext";
import { parseItalic } from "@/lib/parseItalic";

export default function Capabilities() {
  const { t } = useLocale();
  const c = t.capabilities;
  const caps = [
    { n: "C.01", t: c.c1Title, d: c.c1Desc, m: c.c1Meta },
    { n: "C.02", t: c.c2Title, d: c.c2Desc, m: c.c2Meta },
    { n: "C.03", t: c.c3Title, d: c.c3Desc, m: c.c3Meta },
    { n: "C.04", t: c.c4Title, d: c.c4Desc, m: c.c4Meta },
    { n: "C.05", t: c.c5Title, d: c.c5Desc, m: c.c5Meta },
    { n: "C.06", t: c.c6Title, d: c.c6Desc, m: c.c6Meta },
  ];

  return (
    <section className="sec" id="capabilities">
      <div className="container-x">
        <div className="sec-head">
          <div>
            <div className="eyebrow">{c.eyebrow}</div>
          </div>
          <h2 className="sec-title">
            {c.titlePre}
            <i>{c.titleItalic}</i>
            {c.titlePost}
          </h2>
        </div>
        <div className="caps">
          {caps.map((cap) => (
            <div className="cap" key={cap.n}>
              <div className="cap-num">{cap.n}</div>
              <div>
                <h3>{parseItalic(cap.t)}</h3>
                <p>{cap.d}</p>
                <div className="cap-meta">
                  {cap.m.split("|").map((x) => (
                    <span key={x.trim()}>{x.trim()}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
