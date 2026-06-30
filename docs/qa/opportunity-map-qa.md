**Status:** Active
**Created:** 2026-06-29
**Last reviewed:** 2026-06-29

# AI Readiness Map — QA Script

Manual QA for the AI Readiness Map (Opportunity Map). The repository has no
browser E2E framework (no Playwright/Cypress), so the V1 journey is verified
manually using the steps below, backed by automated unit/component/API tests.

Route under test: `/en/opportunity-map` (also spot-check `/es/opportunity-map`
and `/pt/opportunity-map`).

## Preflight (run before manual QA)

```sh
npm run lint
npm run typecheck
npm test
npm run verify   # full gate: lint, format, typecheck, test, dead-code, docs, build
npm run dev      # serve at http://localhost:3000
```

Local development needs no email credentials — lead delivery is stubbed when
`RESEND_API_KEY` / `CONTACT_FROM_EMAIL` / `OPPORTUNITY_MAP_TO_EMAIL` are unset.

## Scenario 1 — Main conversion path

1. Open `/en/opportunity-map`.
   - Expected: the landing hero renders with the time-to-complete and
     privacy-safe notes, and a **Start the map** button.
2. Click **Start the map**.
   - Expected: the **Business context** section appears; the progress meter and
     the system-map board show.
3. Fill Company name, Industry, Company size, Stage, Main business pressure.
   Click **Continue**.
   - Expected: advances to **Business goals**.
4. Select at least one priority outcome, a most-urgent area, and a timeframe.
   Click **Continue**.
   - Expected: advances to **Process drag**.
5. Set the manual-work level. Click **Continue**.
   - Expected: advances to **Expert leverage**.
6. Select at least one overloaded function. Click **Continue**.
   - Expected: the **Your directional signal** teaser appears, showing a
     directional band and the strongest leverage signal. The full report is not
     shown yet.
7. Click **Continue**.
   - Expected: advances to **System landscape**, with a note that the inventory
     is directional and does not connect to any systems.
8. Optionally select tools and readiness answers. Click **Continue**.
   - Expected: advances to **Unlock your readiness map** (contact gate).
9. Enter Your name, Work email, Your role, and check the consent box.
   Click **See my readiness map**.
   - Expected: the report appears under the heading **Your AI readiness map**.
   - Note: the contact step does not re-ask for the company name.
10. Confirm the report includes all ten sections `[01]`–`[10]`:
    - `[01]` Executive readout
    - `[02]` AI opportunity signal (numeric score, band, explanation, drivers)
    - `[03]` Business leverage map
    - `[04]` Process drag map
    - `[05]` Expert leverage map
    - `[06]` System readiness
    - `[07]` Implementation path (complexity is Simple, Structured, or Advanced
      — never "Medium")
    - `[08]` First three moves (exactly three)
    - `[09]` 30-day operating plan (Week 1 through Week 4)
    - `[10]` Review with Honto (CTA present)

## Scenario 2 — Skip-tech path

1. Complete Business context, Business goals, Process drag, Expert leverage, and
   pass the teaser (steps 1–7 above).
2. On **System landscape**, click **Skip this section**.
   - Expected: advances directly to the contact gate.
3. Submit valid contact details and continue.
   - Expected: a complete report renders. `[06]` System readiness shows the
     directional/validate-in-a-technical-review note. The report does not error
     from missing tech data.

## Scenario 3 — Resume after reload

1. Start the map and complete at least Business context.
2. Reload the page.
   - Expected: the landing screen shows **Resume diagnostic** and **Start over**.
3. Click **Resume diagnostic**.
   - Expected: returns to the in-progress section with prior answers preserved.

## Scenario 4 — Start over

1. From an in-progress state, reload to the landing screen (or use **Start over**
   shown on the report/closing screens).
2. Click **Start over**.
   - Expected: saved progress is cleared and the landing screen shows the plain
     **Start the map** button again.

## Scenario 5 — Mobile viewport

1. Open browser dev tools and switch to a mobile viewport (e.g. 375px wide).
2. Walk the core journey.
   - Expected: no horizontal overflow. The start CTA, question cards, progress
     UI, teaser, contact form, and report are all usable; the system-map board
     stacks below the flow.

## Scenario 6 — Privacy banned-copy check

1. Inspect every section and the contact gate.
   - Expected: the UI never asks for a password, API key, private document,
     private chat, private repository, or an employee's LinkedIn profile.
2. On the contact gate, confirm the privacy notice is shown above submission,
   stating that none of the above are requested and to use public company
   information only.
   - Note: the notice naming these items in the negative is expected; it is a
     reassurance, not a request. (Automated: see the privacy tests.)

## Scenario 7 — Contact gate requirement

1. Reach the contact gate and click **See my readiness map** with empty fields.
   - Expected: required-field errors appear and the report is not shown.
2. Enter an invalid email and submit.
   - Expected: an invalid-email error appears; the report is not shown.
3. Complete the required fields and submit.
   - Expected: the report appears.

## Scenario 8 — Lead endpoint (where manually testable)

The contact step submits to `POST /api/opportunity-map` best-effort; the report
renders locally regardless of delivery.

1. Valid submission, no email configured (default local dev):
   - Expected: HTTP 200 with `{ ok: true, delivery: "stub" }`; the dev server
     logs that a lead notification was stubbed (company name + signal only).
2. Valid submission with email configured (set the three env vars):
   - Expected: HTTP 200 with `{ ok: true, delivery: "sent" }`; an internal lead
     email arrives with subject
     `New Honto AI Readiness Lead — {Company Name} — Signal {Score}/100`.
3. Invalid submission (e.g. missing email) posted directly:
   - Expected: HTTP 400 with `{ ok: false, error: "Invalid submission", issues }`.
4. Delivery failure (e.g. unverified sending domain):
   - Expected: a safe response with no provider name, env value, or raw error;
     the user flow is not broken.

## Regression checklist

- The contact gate blocks the report until required fields are valid.
- The skip-tech path still produces a complete report.
- The final report always includes the AI opportunity signal, implementation
  complexity, top three first moves, the 30-day operating plan (Weeks 1–4), and
  the Review with Honto CTA.
- Complexity renders only Simple, Structured, or Advanced.
- No banned/private data is requested anywhere in the UI.
- The lead endpoint never returns stack traces, secrets, provider names, env
  values, or raw adapter/database errors.
- The route stays available at `/[locale]/opportunity-map` in all locales.

## Automated coverage backing this script

- Flow and gate behavior: component tests for the flow, sections, and report.
- Report sections, exactly-three moves, Weeks 1–4, CTA, no "Medium": report
  component tests.
- Scoring/complexity band boundaries and determinism: scoring tests.
- Endpoint success, validation, banned-field rejection, stub vs send, fail-safe
  delivery: API route tests.
- Privacy (no banned data requested) and locale parity: privacy and i18n tests.

## Follow-up

- Automated browser E2E (Playwright) is not set up. If added later, port
  Scenarios 1–5 directly; selectors here are role/label/text based and stable.
