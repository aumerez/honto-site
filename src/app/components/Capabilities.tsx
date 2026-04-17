import type { ReactNode } from "react";

type Cap = { n: string; t: ReactNode; d: string; m: string[] };

const CAPS: Cap[] = [
  {
    n: "C.01",
    t: (
      <>
        AI <i>Strategy</i>
      </>
    ),
    d: "An assessment of where AI creates real leverage in your ops — and a 90-day plan to get there, not a 200-slide deck.",
    m: ["Roadmap", "ROI model", "Risk register"],
  },
  {
    n: "C.02",
    t: (
      <>
        Autonomous <i>Agents</i>
      </>
    ),
    d: "Multi-step workers that read your systems, make bounded decisions, and hand off to humans when they hit the edge of their authority.",
    m: ["Tool use", "Guardrails", "Handoff protocols"],
  },
  {
    n: "C.03",
    t: (
      <>
        Domain <i>Skills</i>
      </>
    ),
    d: "Reusable AI modules encoded with your methodologies — a skill for cost estimation, another for code review, another for compliance triage.",
    m: ["Skill registry", "Versioned prompts", "Evals"],
  },
  {
    n: "C.04",
    t: (
      <>
        RAG &amp; <i>Knowledge</i>
      </>
    ),
    d: "Retrieval grounded in your real artifacts — code, specs, Slack, Confluence, the 800 PDFs nobody opens — with citations on every answer.",
    m: ["Hybrid retrieval", "Reranking", "Grounding evals"],
  },
  {
    n: "C.05",
    t: (
      <>
        AI <i>Infrastructure</i>
      </>
    ),
    d: "Serving, queues, vector stores, secrets. Kubernetes or serverless, your cloud, your compliance posture. No vendor lock.",
    m: ["Terraform", "Observability", "SOC2-ready"],
  },
  {
    n: "C.06",
    t: (
      <>
        Evals &amp; <i>Ops</i>
      </>
    ),
    d: "The part most teams skip: a test harness that catches regressions before your users do. We run it on every change.",
    m: ["Golden sets", "LLM-as-judge", "Drift monitors"],
  },
];

export default function Capabilities() {
  return (
    <section className="sec" id="capabilities">
      <div className="container-x">
        <div className="sec-head">
          <div>
            <div className="eyebrow">[03] Capabilities</div>
          </div>
          <h2 className="sec-title">
            A full stack. <i>One team.</i> No handoffs.
          </h2>
        </div>
        <div className="caps">
          {CAPS.map((c) => (
            <div className="cap" key={c.n}>
              <div className="cap-num">{c.n}</div>
              <div>
                <h3>{c.t}</h3>
                <p>{c.d}</p>
                <div className="cap-meta">
                  {c.m.map((x) => (
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
