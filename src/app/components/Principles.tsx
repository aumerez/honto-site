const PRINCIPLES = [
  {
    k: "P.01",
    t: "Engineering, not prompting.",
    d: "Version-controlled, reviewed, tested. We treat AI systems like any critical service — because they are.",
  },
  {
    k: "P.02",
    t: "Grounded or silent.",
    d: "If the system isn't sure, it says so. If it can't cite, it refuses. We engineer for calibrated answers, not confident ones.",
  },
  {
    k: "P.03",
    t: "Traceable by default.",
    d: "Every prompt, retrieval, tool call, and decision is logged. Exportable for any audit.",
  },
  {
    k: "P.04",
    t: "Your data, your cloud.",
    d: "We deploy into your environment. Your secrets stay where they are. No vendor lock-in.",
  },
  {
    k: "P.05",
    t: "Production or don't ship.",
    d: "We don't do demos. First milestone is a system serving real traffic with SLOs attached.",
  },
  {
    k: "P.06",
    t: "Handoff is part of the build.",
    d: "Every engagement ends with your team owning what we built — docs, runbooks, on-call trained.",
  },
];

export default function Principles() {
  return (
    <section className="sec" id="principles">
      <div className="container-x">
        <div className="sec-head">
          <div>
            <div className="eyebrow">[05] Principles</div>
          </div>
          <h2 className="sec-title">
            Six commitments. <i>Non-negotiable.</i>
          </h2>
        </div>
        <div className="principles">
          {PRINCIPLES.map((p) => (
            <div className="prin" key={p.k}>
              <div className="prin-k">{p.k}</div>
              <div className="prin-t">{p.t}</div>
              <div className="prin-d">{p.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
