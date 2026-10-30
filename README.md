# honto-site-2

The new honto.ai website: homepage, the **Book a demo** questionnaire (English, Spanish, Portuguese) and the **Prospects** admin page where every submission is stored.

Built with Next.js 14 (App Router) and TypeScript. No UI framework; styles live in `app/globals.css`.

## What's inside

| Route | What it is |
| --- | --- |
| `/` | Homepage with the scroll-driven logo intro, use cases and calls to action |
| `/technical` | Technical overview: benefits, cost and traceability differentiators, the three layers (Honto Ops, WholoGraph, WholoBase) |
| `/book` | Book-a-demo questionnaire → live systems map → AI maturity level → Calendly booking. `?lang=es` or `?lang=pt` opens it in Spanish or Portuguese |
| `/admin` | Prospects: every submission, filters, search, details, CSV export (password protected) |
| `POST /api/submissions` | Saves a questionnaire, emails the team and sends the prospect their report |
| `POST /api/submissions/:id/booking` | Marks a submission as booked when Calendly confirms the meeting |
| `GET /api/admin/export` | CSV of all submissions (password protected) |

### How a submission flows

1. The prospect answers 5 short steps. The map on the right builds as they answer.
2. They see their AI maturity level (1–5), top 3 opportunities and estimated hours/month to free up. The score uses the same formula on the client and the server (`lib/questionnaire.ts → scoreLevel`).
3. They enter name, work email and role. The submission is saved and emailed to everyone in `NOTIFY_EMAILS` (default: fegloff@gmail.com, aumerez@honto.ai). The prospect receives their report by email.
4. Calendly opens inline, already filled in with their name, email, company and processes. When they book, the submission is marked **booked** and the team gets a second email.
5. Everything appears in `/admin`.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in the values below
npm run db:migrate           # creates the submissions table
npm run dev                  # http://localhost:3000
```

### Environment variables

| Variable | Needed for |
| --- | --- |
| `DATABASE_URL` | Postgres connection string (Vercel Postgres, Neon, Supabase…). Without it, submissions are not stored. |
| `DATABASE_SSL` | `true` by default; set `false` for a local Postgres without SSL |
| `RESEND_API_KEY` | Sending emails through [Resend](https://resend.com). Without it, no emails are sent. |
| `EMAIL_FROM` | Sender, on a domain verified in Resend, e.g. `Honto <demo@honto.ai>` |
| `NOTIFY_EMAILS` | Comma-separated team addresses notified on every submission |
| `NEXT_PUBLIC_CALENDLY_URL` | Your Calendly event link, e.g. `https://calendly.com/honto/demo` |
| `CALENDLY_TOKEN` | Optional. Calendly personal access token, used to save the booked time |
| `NEXT_PUBLIC_SITE_URL` | Public URL, used for the "Open in Prospects" link in emails |
| `ADMIN_USER`, `ADMIN_PASSWORD` | Login for `/admin` |

### Calendly

In your Calendly event type, add two custom questions so the invite already explains the demo:

1. **Company** (question 1)
2. **What should we show you?** (question 2)

The page fills them in automatically (`a1`, `a2`). To store the exact meeting time in Prospects, create a personal access token in Calendly (Integrations → API & Webhooks) and set `CALENDLY_TOKEN`.

### Deploy on Vercel

1. Import this repository in Vercel.
2. Add a Postgres database (Storage → Postgres, or connect Neon/Supabase) so `DATABASE_URL` is set.
3. Add the other environment variables.
4. Run `npm run db:migrate` once against the production database (locally with the production `DATABASE_URL`).

## Editing content

- Homepage copy: `app/page.tsx` and `components/HomeTop.tsx` (intro words).
- Use cases (39 cards in 6 groups): `lib/useCases.ts`.
- Questionnaire questions, options, translations and scoring: `lib/questionnaire.ts`.
- Colors and type: CSS variables at the top of `app/globals.css`.

## Still to do

- Replace the customer-story placeholders on the homepage (`[X]%`, `[Company]`) with a verified result.
- The IT questionnaire link in Book a demo points to a page that doesn't exist yet.
- The execution trail on `/technical` uses illustrative example data; replace it with a real trace.
- Spanish and Portuguese versions of the homepage (the booking flow is already translated).
