"use client";

import { useLocale } from "@/context/LocaleContext";

export default function Contact() {
  const { t } = useLocale();
  const c = t.contact;

  return (
    <section className="contact" id="contact">
      <div className="container-x">
        <div className="eyebrow" style={{ marginBottom: 32 }}>
          {c.eyebrow}
        </div>
        <div className="contact-grid">
          <h2>
            {c.titleLine1}
            <br />
            {c.titleLine2Pre}
            <i>{c.titleLine2Italic}</i>
          </h2>
          <div className="contact-right">
            <div className="contact-row">
              <span className="k">{c.emailLabel}</span>
              <span className="v">{c.emailValue}</span>
            </div>
            <div className="contact-row">
              <span className="k">{c.responseLabel}</span>
              <span className="v">{c.responseValue}</span>
            </div>
            <div className="contact-row">
              <span className="k">{c.routingLabel}</span>
              <span className="v">{c.routingValue}</span>
            </div>
            <div className="contact-row">
              <span className="k">{c.ndaLabel}</span>
              <span className="v">{c.ndaValue}</span>
            </div>
            <a
              href={`mailto:${c.emailValue}`}
              className="btn primary"
              style={{ marginTop: 12, alignSelf: "flex-start" }}
            >
              {c.cta}
              <svg
                width="14"
                height="10"
                viewBox="0 0 14 10"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
