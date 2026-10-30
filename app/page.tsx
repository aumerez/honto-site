import Link from 'next/link';
import { Logo } from '@/components/Brand';
import { HomeTop } from '@/components/HomeTop';
import { SHOW_SIGN_IN } from '@/lib/site';
import { UseCases } from '@/components/UseCases';

const OUTCOMES = [
  ['Faster answers', 'Respond to clients in hours, not days.'],
  ['Fewer handoffs', 'Every team works on the same case.'],
  ['Full control', 'You approve what matters.'],
  ['Room to grow', 'Take on more business, same team.'],
];

const SILOS = ['Sales · email', 'Finance · ERP', 'Operations · spreadsheets', 'Purchasing · PDFs', 'Know-how · in people’s heads'];
const TEAMS = ['Sales', 'Finance', 'Operations', 'Purchasing'];

const FLOW: [string, string][] = [
  ['Request arrives', 'Sales'],
  ['Context gathered', 'Agent'],
  ['Gaps assigned', 'Operations'],
  ['Quote drafted', 'Agent'],
  ['Owners approve', 'Finance'],
  ['Sent & measured', 'Done'],
];

const PILLARS = [
  {
    title: 'Connect',
    text: 'Bring your information and systems into the work.',
    bg: 'var(--mustard)',
    stroke: 'var(--ink)',
    icon: (
      <>
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="12" r="3" />
        <path d="M9 12h6" />
      </>
    ),
  },
  {
    title: 'Coordinate',
    text: 'People and agents share the case, the owners and the next step.',
    bg: 'var(--ink)',
    stroke: '#fff',
    icon: (
      <>
        <circle cx="8" cy="8" r="3" />
        <circle cx="16" cy="16" r="3" />
        <path d="M14 6h4v4M10 18H6v-4" />
      </>
    ),
  },
  {
    title: 'Improve',
    text: 'Measure results. Repeat what works across teams.',
    bg: 'var(--green)',
    stroke: 'var(--ink)',
    icon: (
      <>
        <path d="M4 18l6-6 4 4 6-8" />
        <path d="M15 8h5v5" />
      </>
    ),
  },
];

export default function Home() {
  return (
    <>
      <HomeTop />
      <main>
        {/* PRODUCT */}
        <section id="platform" style={{ borderTop: '1px solid var(--line)' }}>
          <div className="container row" style={{ padding: '96px 24px 80px', gap: 64, alignItems: 'center' }}>
            <div className="stack" style={{ flex: '1 1 420px', minWidth: 0, gap: 28 }}>
              <div className="eyebrow row" style={{ alignItems: 'center', gap: 10 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--green)' }} />
                Honto.ops
              </div>
              <h2 style={{ margin: 0, fontSize: 'clamp(44px, 6vw, 68px)', lineHeight: 0.98, fontWeight: 800, letterSpacing: '-0.045em' }}>
                Break silos.
                <br />
                Connect work.
              </h2>
              <p style={{ margin: 0, fontSize: 21, lineHeight: 1.45, color: 'var(--muted)', maxWidth: 460 }}>
                Your teams, data and AI agents in one place. Less waiting. More done.
              </p>
              <div className="row" style={{ gap: 12 }}>
                <Link href="/book" className="btn btn-mustard">
                  Book a demo
                </Link>
                <a href="#flow" className="btn btn-outline">
                  See it in action
                </a>
              </div>
            </div>
            <div style={{ flex: '1 1 520px', minWidth: 0, position: 'relative' }}>
              <div aria-hidden="true" style={{ position: 'absolute', right: -16, top: -24, width: '70%', height: '80%', background: 'var(--green)', borderRadius: 28, opacity: 0.9 }} />
              <ProductMock />
            </div>
          </div>
        </section>

        {/* OUTCOMES */}
        <section className="section-dark">
          <div className="container grid-auto" style={{ padding: '56px 24px', gap: 32, ['--min' as string]: '220px' }}>
            {OUTCOMES.map(([title, text], i) => (
              <div key={title} className="stack" style={{ gap: 8 }}>
                <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', color: i === 3 ? 'var(--green)' : undefined }}>{title}</div>
                <div style={{ color: 'var(--on-dark)', fontSize: 16 }}>{text}</div>
              </div>
            ))}
          </div>
        </section>

        {/* PROBLEM -> SOLUTION */}
        <section className="section">
          <div className="container stack" style={{ gap: 56 }}>
            <h2 className="h2" style={{ maxWidth: 760 }}>
              Your business is connected.
              <br />
              <span style={{ color: 'var(--mustard-text)' }}>Your work should be too.</span>
            </h2>
            <div className="row" style={{ gap: 32, alignItems: 'center' }}>
              <div className="row" style={{ flex: '1 1 380px', minWidth: 0, gap: 14, padding: 32, border: '1.5px dashed var(--line-2)', borderRadius: 20 }}>
                <div className="mono" style={{ fontSize: 12, color: 'var(--muted-2)', width: '100%' }}>TODAY</div>
                {SILOS.map((s, i) => (
                  <span
                    key={s}
                    className="pill"
                    style={{ border: '1px solid var(--line-2)', fontSize: 15, padding: '10px 16px', transform: `rotate(${[-3, 0, 2, 0, -2][i]}deg)`, marginTop: i === 1 ? 18 : 0 }}
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div aria-hidden="true" style={{ fontSize: 40, color: 'var(--mustard)', fontWeight: 700 }}>
                →
              </div>
              <div className="stack" style={{ flex: '1 1 380px', minWidth: 0, background: 'var(--mustard-soft)', borderRadius: 20, padding: 32, gap: 16 }}>
                <div className="label-mustard">WITH HONTO</div>
                <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em' }}>One workspace. One case. Everyone on it.</div>
                <div className="row" style={{ gap: 8 }}>
                  {TEAMS.map((t) => (
                    <span key={t} className="pill" style={{ background: 'var(--ink)', color: '#fff' }}>
                      {t}
                    </span>
                  ))}
                  <span className="pill" style={{ background: 'var(--green)', fontWeight: 600 }}>
                    + AI agents
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PILLARS */}
        <section className="section section-soft">
          <div className="container grid-auto" style={{ gap: 24, ['--min' as string]: '280px' }}>
            {PILLARS.map((p) => (
              <div key={p.title} className="card stack" style={{ gap: 14, padding: 36 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={p.stroke} strokeWidth="2" strokeLinecap="round">
                    {p.icon}
                  </svg>
                </div>
                <h3 style={{ margin: 0, fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em' }}>{p.title}</h3>
                <p style={{ margin: 0, fontSize: 17, lineHeight: 1.5, color: 'var(--muted)' }}>{p.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FLOW */}
        <section id="flow" className="section">
          <div className="container stack" style={{ gap: 56 }}>
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-end', gap: 24 }}>
              <h2 className="h2" style={{ maxWidth: 640 }}>From request to result.</h2>
              <p className="lead" style={{ maxWidth: 360 }}>A client asks for a quote. Here’s what happens next.</p>
            </div>
            <ol className="grid-auto" style={{ listStyle: 'none', margin: 0, padding: 0, gap: 12, ['--min' as string]: '170px' }}>
              {FLOW.map(([title, who], i) => {
                const done = i === FLOW.length - 1;
                return (
                  <li key={title} className="stack" style={{ borderTop: `4px solid ${done ? 'var(--green)' : 'var(--mustard)'}`, paddingTop: 18, gap: 10 }}>
                    <span className="mono" style={{ fontSize: 13, color: done ? 'var(--green-text)' : 'var(--mustard-text)' }}>
                      0{i + 1}
                    </span>
                    <span style={{ fontSize: 20, fontWeight: 700 }}>{title}</span>
                    <span
                      className="pill"
                      style={{ alignSelf: 'flex-start', fontSize: 13, padding: '5px 10px', background: done ? 'var(--green-soft)' : 'var(--chip)', color: done ? 'var(--green-text)' : undefined, fontWeight: done ? 600 : 400 }}
                    >
                      {who}
                    </span>
                  </li>
                );
              })}
            </ol>
            <div className="row" style={{ background: 'var(--ink)', color: '#fff', borderRadius: 20, padding: '28px 32px', gap: 24, alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 22, fontWeight: 600 }}>Five teams. One flow. No chasing.</div>
              <Link href="/book" style={{ textDecoration: 'none', color: 'var(--mustard)', fontWeight: 700, fontSize: 16 }}>
                See it with your process →
              </Link>
            </div>
          </div>
        </section>

        <UseCases />

        {/* CONTROL */}
        <section className="section">
          <div className="container row" style={{ gap: 64, alignItems: 'center' }}>
            <div className="stack" style={{ flex: '1 1 380px', minWidth: 0, gap: 20 }}>
              <h2 className="h2">
                AI does the work.
                <br />
                You keep the decision.
              </h2>
              <p className="lead" style={{ maxWidth: 420 }}>Every step has an owner. Every action, your OK.</p>
              <a href="/technical" style={{ fontSize: 15, fontWeight: 600, color: 'var(--mustard-text)' }}>
                Security &amp; governance →
              </a>
            </div>
            <div className="stack" style={{ flex: '1 1 460px', minWidth: 0, gap: 14 }}>
              <ControlRow k="SEE" text="Where every number comes from" tag={<span className="mono" style={{ background: 'var(--chip)', fontSize: 12, padding: '5px 10px', borderRadius: 6 }}>price_list.xlsx</span>} />
              <ControlRow
                k="APPROVE"
                text="Nothing goes out without you"
                highlight
                tag={<span style={{ background: 'var(--mustard)', fontSize: 13, fontWeight: 700, padding: '7px 14px', borderRadius: 6 }}>Approve</span>}
              />
              <ControlRow
                k="MEASURE"
                text="Results you can show"
                green
                tag={<span className="mono" style={{ background: 'var(--green-soft)', color: 'var(--green-text)', fontSize: 12, padding: '5px 10px', borderRadius: 6, fontWeight: 500 }}>Completed ✓</span>}
              />
            </div>
          </div>
        </section>

        {/* HOW WE START */}
        <section id="how-we-work" className="section section-dark">
          <div className="container stack" style={{ gap: 56 }}>
            <h2 className="h2">
              Start small. <span style={{ color: 'var(--green)' }}>Grow fast.</span>
            </h2>
            <div className="grid-auto" style={{ gap: 40, ['--min' as string]: '260px' }}>
              {[
                ['1', 'Pick one process', 'The one that always gets stuck.', 'var(--mustard)'],
                ['2', 'Run it in weeks', 'With your team, your rules.', 'var(--mustard)'],
                ['3', 'Measure and expand', 'Take what works to the next team.', 'var(--green)'],
              ].map(([n, title, text, color]) => (
                <div key={n} className="stack" style={{ gap: 12 }}>
                  <span style={{ fontSize: 64, fontWeight: 800, color, lineHeight: 1 }}>{n}</span>
                  <div style={{ fontSize: 24, fontWeight: 700 }}>{title}</div>
                  <div style={{ color: 'var(--on-dark)', fontSize: 16 }}>{text}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROOF — replace placeholders with a verified customer story */}
        <section>
          <div className="container" style={{ padding: '112px 24px 56px' }}>
            <div className="row" style={{ background: 'var(--soft)', borderRadius: 24, padding: 'clamp(28px, 5vw, 56px)', gap: 40, alignItems: 'center' }}>
              <div className="stack" style={{ flex: '1 1 480px', minWidth: 0, gap: 20 }}>
                <span className="eyebrow">Customer story</span>
                <p style={{ margin: 0, fontSize: 'clamp(24px, 3vw, 32px)', lineHeight: 1.25, fontWeight: 600, letterSpacing: '-0.02em' }}>
                  “[Short quote from a client about the result they got.]”
                </p>
                <div style={{ fontSize: 15, color: 'var(--muted-2)' }}>[Name], [Role] · [Company]</div>
              </div>
              <div className="stack" style={{ flex: '0 1 280px', gap: 8, borderLeft: '4px solid var(--green)', paddingLeft: 24 }}>
                <div style={{ fontSize: 56, fontWeight: 800, letterSpacing: '-0.03em' }}>[X]%</div>
                <div style={{ fontSize: 16, color: 'var(--muted)' }}>[Verified result, e.g. faster daily close]</div>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT YOU GET */}
        <section id="what-you-get">
          <div className="container stack" style={{ padding: '56px 24px 120px', gap: 40 }}>
            <h2 style={{ margin: 0, fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em' }}>What you get.</h2>
            <div className="grid-auto" style={{ gap: 0, borderTop: '1px solid var(--ink)', ['--min' as string]: '260px' }}>
              {[
                ['The platform', 'Workspace, agents and your connections.'],
                ['Implementation', 'We set up your first process with you.'],
                ['Ongoing support', 'We help you improve and expand.'],
              ].map(([title, text]) => (
                <div key={title} className="stack" style={{ padding: '28px 28px 28px 0', gap: 10 }}>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>{title}</div>
                  <div style={{ fontSize: 16, color: 'var(--muted)' }}>{text}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section style={{ background: 'var(--mustard)' }}>
          <div className="container row" style={{ padding: '104px 24px', gap: 32, alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ margin: 0, fontSize: 'clamp(40px, 5.5vw, 60px)', lineHeight: 1, fontWeight: 800, letterSpacing: '-0.04em', maxWidth: 720 }}>
              Bring us a process that gets stuck.
            </h2>
            <Link href="/book" className="btn btn-dark" style={{ fontSize: 18, fontWeight: 700, padding: '20px 34px' }}>
              Book a demo
            </Link>
          </div>
        </section>
      </main>

      <footer className="footer section-dark">
        <div className="container stack" style={{ padding: '72px 24px 40px', gap: 56 }}>
          <div className="grid-auto" style={{ gap: 32, ['--min' as string]: '180px' }}>
            <div className="stack" style={{ gap: 12 }}>
              <Logo size={26} />
              <div style={{ color: 'var(--on-dark)', fontSize: 15 }}>Break silos. Connect work.</div>
            </div>
            <FooterCol title="PRODUCT" links={[['Honto.ops', '#platform'], ['Use cases', '#use-cases'], ['Pricing', '#what-you-get']]} />
            <FooterCol title="FOR IT TEAMS" links={[['Technical overview', '/technical'], ['Architecture', '/technical#architecture'], ['Integrations & skills', '/technical'], ['Security & governance', '/technical']]} />
            <FooterCol title="COMPANY" links={[['How we work', '#how-we-work'], ['Book a demo', '/book'], ...(SHOW_SIGN_IN ? ([['Sign in', 'https://app.honto.ai']] as [string, string][]) : [])]} />
          </div>
          <div style={{ borderTop: '1px solid #33363b', paddingTop: 24, fontSize: 13, color: 'var(--muted-3)' }}>© {new Date().getFullYear()} Honto</div>
        </div>
      </footer>
    </>
  );
}

function ControlRow({ k, text, tag, highlight, green }: { k: string; text: string; tag: React.ReactNode; highlight?: boolean; green?: boolean }) {
  return (
    <div className="row" style={{ border: highlight ? '1.5px solid var(--mustard)' : '1px solid var(--line)', borderRadius: 16, padding: '20px 24px', alignItems: 'center', gap: 16 }}>
      <span className="mono" style={{ fontSize: 12, width: 64, color: highlight ? 'var(--mustard-text)' : green ? 'var(--green-text)' : '#6b7078' }}>
        {k}
      </span>
      <div style={{ flex: 1, minWidth: 160, fontSize: 17, fontWeight: 600 }}>{text}</div>
      {tag}
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div className="stack" style={{ gap: 10, fontSize: 15 }}>
      <div className="mono" style={{ fontSize: 12, color: 'var(--muted-3)' }}>
        {title}
      </div>
      {links.map(([label, href]) => (
        <a key={label} href={href}>
          {label}
        </a>
      ))}
    </div>
  );
}

function ProductMock() {
  return (
    <div className="mock" role="img" aria-label="Honto.ops workspace showing a quote request with sources, assigned tasks and a pending approval">
      <div className="mock-top" aria-hidden="true">
        <span className="light" style={{ background: '#FF5F57' }} />
        <span className="light" style={{ background: '#FEBC2E' }} />
        <span className="light" style={{ background: '#28C840' }} />
        <span style={{ marginLeft: 12, color: '#fff', fontWeight: 600, fontSize: 14 }}>
          <Logo size={14} />ops
        </span>
        <span className="mono" style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--on-dark)', border: '1px solid #3a3e43', padding: '3px 10px', borderRadius: 999 }}>
          ● Agent mode
        </span>
      </div>
      <div style={{ display: 'flex' }} aria-hidden="true">
        <div className="mock-side">
          <div style={{ fontWeight: 600, color: '#fff', fontSize: 13, marginBottom: 8 }}>Workspace</div>
          <div className="item on">Quotes</div>
          <div className="item">Purchasing</div>
          <div className="item">Daily close</div>
          <div className="item">Agents</div>
          <div className="item">Documents</div>
        </div>
        <div className="stack" style={{ flex: 1, minWidth: 0, padding: 18, gap: 12 }}>
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Quote request · Northwind</div>
            <span className="mono" style={{ fontSize: 10, background: '#E6F2D6', color: 'var(--green-text)', padding: '3px 8px', borderRadius: 4 }}>
              IN PROGRESS
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
            {[
              ['PRICING', 'Price list Q4'],
              ['STOCK', 'Available · 3 sites'],
              ['CLIENT', 'Terms · 30 days'],
            ].map(([k, v]) => (
              <div key={k} className="mock-card">
                <div className="mock-k">{k}</div>
                <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4 }}>{v}</div>
              </div>
            ))}
          </div>
          <div className="mock-card" style={{ padding: '4px 12px' }}>
            <div className="mock-task">
              <span className="check" />
              <span style={{ flex: 1 }}>Confirm delivery date</span>
              <span style={{ color: '#6b7078' }}>Operations · Ana</span>
            </div>
            <div className="mock-task">
              <span className="check" />
              <span style={{ flex: 1 }}>Draft quotation</span>
              <span style={{ color: '#6b7078' }}>Agent</span>
            </div>
            <div className="mock-task">
              <span className="check open" />
              <span style={{ flex: 1 }}>Approve discount</span>
              <span style={{ color: '#6b7078' }}>Finance · Luis</span>
            </div>
          </div>
          <div className="row" style={{ background: '#fff', border: '1.5px solid var(--mustard)', borderRadius: 10, padding: 12, alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700 }}>Ready to send quote</div>
              <div style={{ fontSize: 11, color: '#6b7078' }}>Waiting for your approval</div>
            </div>
            <span style={{ background: 'var(--mustard)', fontSize: 12, fontWeight: 700, padding: '8px 14px', borderRadius: 6 }}>Approve</span>
          </div>
        </div>
      </div>
    </div>
  );
}
