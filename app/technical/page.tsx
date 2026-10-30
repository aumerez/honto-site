import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/Brand';
import { SiteNav } from '@/components/SiteNav';

export const metadata: Metadata = {
  title: 'Technical overview — Honto',
  description: 'Systems, documents, teams and AI models in one governed workspace. Three layers: Honto Ops, WholoGraph and WholoBase.',
};

const BENEFITS: { title: string; text: string; tags: string[] }[] = [
  { title: 'Production in 2 weeks', text: 'One process. Connected data. Permissions set. Validated with your team.', tags: ['scope', 'connect', 'approve', 'validate'] },
  { title: 'Lower AI cost', text: 'Right model per task. Less context sent. Code for the repeatable work.', tags: ['model routing', 'bounded context', 'reusable results'] },
  { title: 'Traceable execution', text: 'See the plan, the policy, the action and the result. Answers cite their sources.', tags: ['execution records', 'telemetry', 'citations'] },
  { title: 'Data in. Deliverables out.', text: 'Dashboards, KPIs, charts and reports from connected sources. Organized by project.', tags: ['dashboards', 'reports', 'shared projects'] },
  { title: 'Your software becomes skills', text: 'Apps, databases and APIs, packaged as reusable skills agents call safely.', tags: ['APIs', 'databases', 'business logic'] },
  { title: 'Models you choose', text: 'Assign a model per use case. You set the balance of performance, privacy and cost.', tags: ['commercial', 'private endpoint', 'local'] },
];

// Illustrative example — replace with a real trace when available.
const TRACE: [string, string][] = [
  ['Request', 'sales · Ana'],
  ['Plan', '4 steps'],
  ['Policy', 'discount ≤ 10%'],
  ['Approval', 'finance · Luis ✓'],
  ['Action', 'erp.update_quote'],
  ['Result', 'quote.pdf · 2h 10m'],
];

const LAYERS = [
  { name: 'Honto Ops', role: 'WORK & COLLABORATE', parts: ['Projects', 'Documents', 'Agents', 'Integrations', 'Outputs & reviews'], bg: 'var(--mustard)', dark: false },
  { name: 'WholoGraph', role: 'GOVERN & ORCHESTRATE', parts: ['Permissions', 'Policies', 'Validation', 'Approvals', 'Execution evidence'], bg: 'var(--ink)', dark: true },
  { name: 'WholoBase', role: 'HOST', parts: ['Infrastructure', 'Model runtimes', 'Document storage', 'Your deployment'], bg: 'var(--green)', dark: false },
];

const h2: React.CSSProperties = { margin: 0, fontSize: 'clamp(36px, 4.6vw, 52px)', lineHeight: 1.05, fontWeight: 800, letterSpacing: '-0.035em' };

export default function TechnicalPage() {
  return (
    <>
      <header className="site-header">
        <SiteNav active="technical" cta="Book a technical demo" />
      </header>

      <main>
        {/* HERO */}
        <section className="section-dark">
          <div className="container row" style={{ padding: '104px 24px', gap: 64, alignItems: 'center' }}>
            <div className="stack" style={{ flex: '1 1 440px', minWidth: 0, gap: 28 }}>
              <span className="mono" style={{ fontSize: 13, letterSpacing: '0.08em', color: 'var(--mustard)' }}>
                TECHNICAL OVERVIEW
              </span>
              <h1 style={{ margin: 0, fontSize: 'clamp(42px, 5.4vw, 64px)', lineHeight: 1, fontWeight: 800, letterSpacing: '-0.045em' }}>
                AI for connected business operations. <span style={{ color: 'var(--mustard)' }}>Break silos.</span>
              </h1>
              <p style={{ margin: 0, fontSize: 20, lineHeight: 1.45, color: '#C9CDD2', maxWidth: 480 }}>Systems, documents, teams and AI models. One governed workspace.</p>
              <div className="row" style={{ gap: 12 }}>
                <Link href="/book" className="btn btn-mustard">
                  Book a technical demo
                </Link>
                <a href="#architecture" className="btn btn-outline" style={{ borderColor: '#fff', color: '#fff' }}>
                  See the architecture ↓
                </a>
              </div>
            </div>
            <div
              role="img"
              aria-label="Three layers: Honto Ops for work, WholoGraph for governance and orchestration, WholoBase for hosting"
              className="stack"
              style={{ flex: '1 1 440px', minWidth: 0, gap: 14 }}
            >
              {[
                ['Honto Ops', 'WORK', 'var(--mustard)', '0 48px 0 0'],
                ['WholoGraph', 'GOVERN', '#fff', '0 24px'],
                ['WholoBase', 'HOST', 'var(--green)', '0 0 0 48px'],
              ].map(([name, role, bg, margin]) => (
                <div key={name} className="row" style={{ background: bg, color: 'var(--ink)', borderRadius: 18, padding: '26px 28px', justifyContent: 'space-between', alignItems: 'center', gap: 16, margin }}>
                  <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em' }}>{name}</span>
                  <span className="mono" style={{ fontSize: 12 }}>
                    {role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROOF STRIP */}
        <section style={{ borderBottom: '1px solid var(--line)' }}>
          <div className="container grid-auto" style={{ padding: '56px 24px', gap: 32, ['--min' as string]: '260px' }}>
            {[
              ['2 weeks', 'First use case in production.', undefined],
              ['Any model', 'Commercial, private or local.', undefined],
              ['Every step', 'Recorded, approved, traceable.', 'var(--green-text)'],
            ].map(([big, small, color]) => (
              <div key={big} className="stack" style={{ gap: 6 }}>
                <span style={{ fontSize: 52, fontWeight: 800, letterSpacing: '-0.04em', color }}>{big}</span>
                <span style={{ fontSize: 17, color: 'var(--muted)' }}>{small}</span>
              </div>
            ))}
          </div>
        </section>

        {/* SIX BENEFITS */}
        <section className="section section-soft">
          <div className="container stack" style={{ gap: 48 }}>
            <h2 style={h2}>What you get.</h2>
            <div className="grid-auto" style={{ gap: 20, ['--min' as string]: '320px' }}>
              {BENEFITS.map((b, i) => (
                <div key={b.title} className="card stack" style={{ gap: 14 }}>
                  <span className="label-mustard" style={{ fontSize: 13 }}>
                    0{i + 1}
                  </span>
                  <h3 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>{b.title}</h3>
                  <p style={{ margin: 0, fontSize: 16, lineHeight: 1.5, color: 'var(--muted)' }}>{b.text}</p>
                  <div className="row" style={{ gap: 6, marginTop: 'auto' }}>
                    {b.tags.map((tag) => (
                      <span key={tag} className="mono" style={{ fontSize: 12, background: 'var(--chip)', padding: '5px 10px', borderRadius: 6 }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COST DIFFERENTIATOR */}
        <section className="section">
          <div className="container row" style={{ gap: 64, alignItems: 'center' }}>
            <div className="stack" style={{ flex: '1 1 380px', minWidth: 0, gap: 18 }}>
              <span className="label-mustard" style={{ fontSize: 13 }}>
                COST
              </span>
              <h2 style={h2}>
                AI reasons.
                <br />
                Software calculates.
              </h2>
              <p className="lead">Pay for reasoning, not for arithmetic.</p>
            </div>
            <div
              role="img"
              aria-label="A request splits: language work goes to the AI model, calculations and repeatable operations go to deterministic tools"
              className="stack"
              style={{ flex: '1 1 480px', minWidth: 0, gap: 14 }}
            >
              <div style={{ alignSelf: 'center', background: 'var(--ink)', color: '#fff', borderRadius: 999, padding: '12px 22px', fontSize: 16, fontWeight: 700 }}>Business request</div>
              <div aria-hidden="true" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14 }}>
                <div style={{ height: 28, borderRight: '2px solid var(--line-2)' }} />
                <div style={{ height: 28, borderLeft: '2px solid var(--line-2)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14 }}>
                <div className="stack" style={{ background: 'var(--mustard-soft)', borderRadius: 18, padding: 24, gap: 10 }}>
                  <span className="label-mustard">AI MODEL</span>
                  <span style={{ fontSize: 20, fontWeight: 700 }}>Understand · Draft · Decide</span>
                  <span style={{ fontSize: 14, color: 'var(--muted)' }}>Only the context it needs.</span>
                </div>
                <div className="stack" style={{ background: 'var(--green-soft)', borderRadius: 18, padding: 24, gap: 10 }}>
                  <span className="mono" style={{ fontSize: 12, color: 'var(--green-text)' }}>
                    DETERMINISTIC TOOLS
                  </span>
                  <span style={{ fontSize: 20, fontWeight: 700 }}>Calculate · Process · Report</span>
                  <span style={{ fontSize: 14, color: 'var(--muted)' }}>Exact, repeatable, cheap.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRACE DIFFERENTIATOR */}
        <section className="section section-soft">
          <div className="container stack" style={{ gap: 48 }}>
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-end', gap: 24 }}>
              <div className="stack" style={{ gap: 18 }}>
                <span className="label-mustard" style={{ fontSize: 13 }}>
                  ACCOUNTABILITY
                </span>
                <h2 style={h2}>Every request leaves a trail.</h2>
              </div>
              <span className="mono" style={{ fontSize: 12, color: 'var(--muted-2)' }}>
                EXAMPLE · QUOTE REQUEST
              </span>
            </div>
            <ol className="grid-auto" style={{ listStyle: 'none', margin: 0, padding: 0, gap: 12, ['--min' as string]: '160px' }}>
              {TRACE.map(([step, evidence], i) => {
                const last = i === TRACE.length - 1;
                return (
                  <li key={step} className="stack" style={{ background: '#fff', borderRadius: 16, padding: 20, gap: 10, borderTop: `4px solid ${last ? 'var(--green)' : 'var(--mustard)'}` }}>
                    <span style={{ fontSize: 18, fontWeight: 700 }}>{step}</span>
                    <span className="mono" style={{ fontSize: 12, color: last ? 'var(--green-text)' : 'var(--muted-2)' }}>
                      {evidence}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* ARCHITECTURE */}
        <section id="architecture" className="section">
          <div className="container stack" style={{ gap: 48 }}>
            <h2 style={{ ...h2, maxWidth: 760 }}>
              Three layers.
              <br />
              One operating environment.
            </h2>
            <div className="stack">
              {LAYERS.map((l, i) => (
                <div key={l.name} className="stack">
                  {i > 0 && <div aria-hidden="true" style={{ height: 28, width: 2, background: 'var(--ink)', marginLeft: 64 }} />}
                  <div className="row" style={{ gap: 24, alignItems: 'center', background: l.bg, color: l.dark ? '#fff' : 'var(--ink)', borderRadius: 20, padding: '28px 32px' }}>
                    <div className="stack" style={{ flex: '0 1 280px', gap: 4 }}>
                      <span className="mono" style={{ fontSize: 12, color: l.dark ? 'var(--mustard)' : undefined }}>
                        {l.role}
                      </span>
                      <span style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em' }}>{l.name}</span>
                    </div>
                    <div className="row" style={{ flex: '1 1 400px', gap: 8 }}>
                      {l.parts.map((p) => (
                        <span key={p} className="pill" style={{ fontWeight: 600, background: l.dark ? 'transparent' : '#fff', border: l.dark ? '1px solid #4a4f56' : 'none' }}>
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: 'var(--mustard)' }}>
          <div className="container row" style={{ padding: '104px 24px', gap: 32, alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="stack" style={{ gap: 14, maxWidth: 720 }}>
              <h2 style={{ margin: 0, fontSize: 'clamp(40px, 5.5vw, 60px)', lineHeight: 1, fontWeight: 800, letterSpacing: '-0.04em' }}>Start with one process.</h2>
              <p style={{ margin: 0, fontSize: 19 }}>We define the integrations, controls and outcomes with you.</p>
            </div>
            <Link href="/book" className="btn btn-dark" style={{ fontSize: 18, fontWeight: 700, padding: '20px 34px' }}>
              Book a technical demo
            </Link>
          </div>
        </section>
      </main>

      <footer className="footer section-dark">
        <div className="container row" style={{ padding: '40px 24px', justifyContent: 'space-between', gap: 16, fontSize: 14, color: 'var(--muted-3)' }}>
          <Link href="/" aria-label="Honto home" style={{ color: '#fff' }}>
            <Logo size={22} />
          </Link>
          <span>© {new Date().getFullYear()} Honto</span>
        </div>
      </footer>
    </>
  );
}
