"use client";

import { useLocale } from "@/context/LocaleContext";

type CapItem = {
  num: string;
  titlePre: string;
  titleItalic: string;
  titlePost: string;
  desc: string;
  meta: string[];
};

type CapabilitiesCopy = {
  eyebrow: string;
  titlePre: string;
  titleItalic: string;
  titlePost: string;
  titleTail?: string;
  items: CapItem[];
};

export default function Capabilities() {
  const { t } = useLocale();
  const copy = (t.landing as { capabilities: CapabilitiesCopy }).capabilities;

  return (
    <section className="sec" id="capabilities">
      <div className="container-x">
        <div className="sec-head">
          <div>
            <div className="eyebrow">{copy.eyebrow}</div>
          </div>
          <h2 className="sec-title">
            {copy.titlePre}
            <i>{copy.titleItalic}</i>
            {copy.titlePost}
            {copy.titleTail ? (
              <>
                <br />
                {copy.titleTail}
              </>
            ) : null}
          </h2>
        </div>
        <div className="caps">
          {copy.items.map((c) => (
            <div className="cap" key={c.num}>
              <div className="cap-num">{c.num}</div>
              <div>
                <h3>
                  {c.titlePre}
                  <i>{c.titleItalic}</i>
                  {c.titlePost}
                </h3>
                <p>{c.desc}</p>
                <div className="cap-meta">
                  {c.meta.map((x) => (
                    <span key={x}>{x}</span>
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
