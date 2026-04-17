import type { ReactNode } from "react";

type Problem = { q: ReactNode; a: string };

const PROBLEMS: Problem[] = [
  {
    q: (
      <>
        Your people use AI every day. <i>Your company</i> still works the old
        way.
      </>
    ),
    a: "Individual productivity isn't an operating model. We identify the workflows where AI rewrites the dynamic of your business and build the systems that make the shift real.",
  },
  {
    q: (
      <>
        Your senior experts are <i>still the bottleneck.</i> The tools
        don&apos;t know what they know.
      </>
    ),
    a: "We extract the judgement your experts carry — standards, heuristics, edge cases — and encode it into AI skills the rest of the team can consult without interrupting them.",
  },
  {
    q: (
      <>
        Your data lives in <i>fifteen systems.</i> Only a few are available to
        the AI.
      </>
    ),
    a: "We build the connective layer — adapters, extractors, and retrieval — that lets AI reason across your IoT platforms, ERPs, design files, and PDFs. From oilfield telemetry to accounting ledgers, every source becomes a first-class input to your business intelligence.",
  },
  {
    q: (
      <>
        Generic models give <i>confident answers</i> that are wrong for your
        business.
      </>
    ),
    a: "Grounded in your documents, your data, your decisions. The system cites its sources, refuses when it shouldn't guess, and defers to the people who should decide.",
  },
  {
    q: (
      <>
        Legal and risk said <i>no</i> to the interesting use cases.
      </>
    ),
    a: "Every prompt, retrieval, and tool call is traced and policy-checked in-line. Exportable audit trails for SOC 2, HIPAA, the EU AI Act — whatever you're accountable to.",
  },
  {
    q: (
      <>
        You need an <i>AI operating model</i>, not another license.
      </>
    ),
    a: "Architecture, team shape, data contracts, review loops. We build it with your engineers so that when we leave, the method — not just the system — stays.",
  },
];

export default function Problems() {
  return (
    <section className="sec" id="problems">
      <div className="container-x">
        <div className="sec-head">
          <div>
            <div className="eyebrow">[01] Problems we solve</div>
          </div>
          <h2 className="sec-title">
            Six signs your <i>AI strategy</i> is not the right one.
          </h2>
        </div>

        <div className="problems-list">
          {PROBLEMS.map((p, i) => (
            <div className="problem" key={i}>
              <div className="problem-num">
                P.{String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="problem-q">{p.q}</h3>
              <div className="problem-a">{p.a}</div>
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
