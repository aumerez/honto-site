"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Line = { c: string; t: string };

const LINES: Line[] = [
  { c: "t-sys", t: "honto / opsai · v2.3.1 · session #8a42fe" },
  { c: "t-sys", t: "───────────────────────────────────────" },
  { c: "t-user", t: "» Reviewing pipeline change #4412." },
  { c: "t-user", t: "» Is the new retry policy safe for prod?" },
  { c: "t-prompt", t: "opsai ▸ checking against 3 skills…" },
  { c: "t-ai", t: "  ├─ [reliability.retry_semantics]" },
  { c: "t-ai", t: "  ├─ [runbook.incident_2024_q3_3]" },
  { c: "t-ai", t: "  └─ [standards.idempotency]" },
  { c: "t-prompt", t: "  → found 1 conflict" },
  { c: "t-ai", t: "" },
  { c: "t-ai", t: "Retry with exponential backoff ✓" },
  { c: "t-ai", t: "Idempotency key on POST /charges ✗" },
  { c: "t-ai", t: "  ⤷ see INC-2024-337 — duplicate charges" },
  { c: "t-ai", t: "     under retry storm, 11m outage." },
  { c: "t-ai", t: "" },
  { c: "t-tag", t: "Recommendation: require Idempotency-" },
  { c: "t-tag", t: "Key header before merge. Confidence 0.94." },
  { c: "t-sys", t: "" },
  { c: "t-sys", t: "Traced · 3 sources · auditable" },
];

function Terminal() {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setShown(i);
      if (i >= LINES.length) window.clearInterval(id);
    }, 260);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="term">
      <div className="term-head">
        <div className="dots">
          <span />
          <span />
          <span />
        </div>
        <div>opsai · live</div>
        <div style={{ color: "var(--accent)" }}>● rec</div>
      </div>
      <div className="term-body">
        {LINES.slice(0, shown).map((l, i) => (
          <span className={`term-line ${l.c}`} key={i}>
            {l.t || "\u00A0"}
          </span>
        ))}
        {shown < LINES.length && <span className="cursor-blink" />}
      </div>
    </div>
  );
}

export default function OpsAISection() {
  return (
    <section className="sec opsai" id="opsai">
      <div className="container-x">
        <div className="opsai-inner">
          <div className="opsai-left">
            <div className="eyebrow">[04] Product · OpsAI</div>
            <h2>
              The expert <i>second brain</i> for your engineering org.
            </h2>
            <p>
              OpsAI watches your systems, reads your docs, and answers the
              questions your senior engineers field fifty times a week — with
              the same judgment, at 2am, in every timezone.
            </p>
            <div className="opsai-feat">
              <div className="f">
                <div className="k">Capture</div>
                <div className="v">Every decision, indexed.</div>
              </div>
              <div className="f">
                <div className="k">Scale</div>
                <div className="v">One expert, whole org.</div>
              </div>
              <div className="f">
                <div className="k">Ground</div>
                <div className="v">Cites every answer.</div>
              </div>
              <div className="f">
                <div className="k">Audit</div>
                <div className="v">Logged, replayable.</div>
              </div>
            </div>
            <Link href="/opsai" className="btn primary">
              Explore OpsAI
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
            </Link>
          </div>
          <div className="opsai-right">
            <Terminal />
          </div>
        </div>
      </div>
    </section>
  );
}
