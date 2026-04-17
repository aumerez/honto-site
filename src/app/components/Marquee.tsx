const ITEMS = [
  "Knowledge capture",
  "Autonomous agents",
  "Retrieval pipelines",
  "DevSecOps for AI",
  "Model evaluation",
  "Domain skills",
  "Decision support",
  "Observability",
  "Safe rollouts",
];

export default function Marquee() {
  const row = <span>{ITEMS.join("   ·   ")}</span>;
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {row}
        {row}
        {row}
        {row}
      </div>
    </div>
  );
}
