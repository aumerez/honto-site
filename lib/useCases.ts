export type UseCase = [area: string, title: string, desc: string];
export type UseCaseGroup = { name: string; items: UseCase[] };

export const USE_CASES: UseCaseGroup[] = [
  {
    name: 'Revenue',
    items: [
      ['Sales', 'Quotes out the same hour.', 'It builds quotes from your price lists, past deals and discount rules, ready to send.'],
      ['Pre-sales / Bids', 'Tenders answered in days, not weeks.', 'It reads the tender documents, pulls answers from past proposals and drafts the reply.'],
      ['Marketing', 'Campaigns in your voice, ready today.', 'It produces posts, emails and landing copy that follow your brand guidelines.'],
      ['Customer success', 'Spot churn before it happens.', 'It flags at-risk accounts from tickets, usage and emails, and suggests the next step.'],
      ['Customer service', 'The right answer, first time, any language.', 'Agents get instant replies grounded in your manuals and policies.'],
      ['E-commerce', 'Product pages that write themselves.', 'It turns supplier data sheets into product listings in several languages, written for search.'],
      ['Pricing', 'Know your margin before you say yes.', 'It simulates the margin on each deal using real costs and discounts.'],
      ['Field sales', 'Visit reports in one minute.', 'It turns notes and voice memos from each visit into CRM updates and next steps.'],
    ],
  },
  {
    name: 'Money & Control',
    items: [
      ['Finance', 'Daily close without the chase.', 'It reconciles sales, cash and bank every day and flags what doesn’t match.'],
      ['Accounts payable', 'Invoices matched, not typed.', 'It reads each invoice, matches it to the PO and delivery note, and flags any mismatch.'],
      ['Collections', 'Get paid faster, politely.', 'It sends payment reminders that adapt to each customer’s history.'],
      ['Treasury', 'Your cash position every morning.', 'It consolidates bank balances and forecasts cash for the weeks ahead.'],
      ['Controlling', 'Variances explained, not just reported.', 'It writes the explanation behind each number for management.'],
      ['Tax & compliance', 'Every deadline, every rule, on time.', 'It tracks filings and regulatory changes that affect your business.'],
      ['Legal', 'Contracts reviewed in minutes.', 'It compares each contract with your standard clauses and highlights the risks.'],
      ['Audit', 'Evidence ready before the auditor asks.', 'It collects and organizes the documents each control needs.'],
    ],
  },
  {
    name: 'Supply Chain',
    items: [
      ['Purchasing', 'Compare offers. Approve faster.', 'It puts supplier offers side by side and sends the approval to the right person.'],
      ['Logistics', 'Every shipment tracked, every delay explained.', 'It brings carrier updates into one view and alerts customers before they call.'],
      ['Warehouse', 'Stock where it should be.', 'It suggests reorder points and slotting based on real demand.'],
      ['Planning / S&OP', 'Forecasts your team actually trusts.', 'It combines sales, history and market signals into one demand plan.'],
      ['Supplier management', 'Know your suppliers before they fail you.', 'It scores suppliers on delivery, quality and risk news.'],
      ['Import / Export', 'Customs paperwork without the headaches.', 'It prepares HS codes, documents and certificates automatically.'],
      ['Returns', 'Returns processed, not piled up.', 'It checks each return against policy, warranty and stock, then triggers the refund or replacement.'],
    ],
  },
  {
    name: 'Operations & Production',
    items: [
      ['Operations', 'Issues solved once, not every week.', 'It turns every solved incident into a procedure your whole team reuses.'],
      ['Maintenance', 'Fix it before it breaks.', 'Technicians get troubleshooting steps from manuals and repair history right on the shop floor.'],
      ['Quality', 'Root cause in hours, not audits.', 'It analyzes non-conformities and drafts 8D reports and corrective actions.'],
      ['Production', 'Shift handovers nothing gets lost in.', 'It summarizes incidents, output and pending tasks between shifts.'],
      ['Health & safety', 'Every procedure one question away.', 'Workers ask about any safety procedure and get the exact answer.'],
      ['Field service', 'The right technician, with the right part.', 'It prepares each visit with the equipment history and the parts the job will need.'],
      ['Projects / PMO', 'Status reports that write themselves.', 'It pulls updates from tasks, emails and meetings, then flags risks early.'],
    ],
  },
  {
    name: 'People',
    items: [
      ['HR', 'The best career path for everyone on your teams.', 'It maps skills, performance and goals into personalized growth plans.'],
      ['Recruiting', 'The right candidate, shortlisted today.', 'It screens CVs against the role and drafts the interview questions.'],
      ['Training', 'Continuous training on everything in your company.', 'It turns your documents into courses, quizzes and an always-on tutor.'],
      ['Onboarding', 'Productive from day one.', 'New hires get a personal assistant that knows every process and every person to ask.'],
      ['Employee questions', 'Answers without the HR queue.', 'Employees get instant answers on leave, payroll and benefits policies.'],
      ['Internal communications', 'Everyone informed, nobody overwhelmed.', 'It sends each team a personalized digest of what matters to them.'],
    ],
  },
  {
    name: 'Technology & Leadership',
    items: [
      ['IT / Helpdesk', 'Tickets solved before they’re opened.', 'It handles self-service fixes for passwords, access and common how-to questions.'],
      ['Reporting', 'Reports nobody has to build.', 'It prepares weekly reports from your systems and delivers them to each manager.'],
      ['Management / CEO', 'The whole company in one question.', 'Instant answers across sales, finance and operations, without waiting for reports.'],
    ],
  },
];

export const USE_CASE_TOTAL = USE_CASES.reduce((n, g) => n + g.items.length, 0);
