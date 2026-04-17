const STEPS = [
  {
    n: "01",
    label: "Phase / Discovery",
    t: "Map",
    d: "We sit with your experts, shadow workflows, and surface the 20% of decisions that move 80% of outcomes.",
  },
  {
    n: "02",
    label: "Phase / Engineering",
    t: "Build",
    d: "Architecture, skills, retrieval, evals. Every component version-controlled, documented, and reviewed like critical infrastructure.",
  },
  {
    n: "03",
    label: "Phase / Rollout",
    t: "Deploy",
    d: "Shadow-mode → assisted → autonomous, with guardrails and rollback. Observability, SLOs, and audit trails live from day one.",
  },
  {
    n: "04",
    label: "Phase / Continuous",
    t: "Operate",
    d: "We stay on as the SRE layer for your AI — evals on every change, drift monitoring, upgrades, and the runbooks your team owns.",
  },
];

export default function Process() {
  return (
    <section className="sec" id="process">
      <div className="container-x">
        <div className="sec-head">
          <div>
            <div className="eyebrow">[02] Method</div>
          </div>
          <h2 className="sec-title">
            From <i>expert judgment</i> to <i>production system</i>, in four
            deliberate phases.
          </h2>
        </div>
        <div className="process">
          {STEPS.map((s) => (
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
