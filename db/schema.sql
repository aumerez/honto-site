-- Book-a-demo submissions
create extension if not exists pgcrypto;

create table if not exists submissions (
  id                    uuid primary key default gen_random_uuid(),
  created_at            timestamptz not null default now(),
  lang                  text not null,
  company               text not null,
  contact_name          text not null,
  email                 text not null,
  phone                 text,
  role                  text not null,
  industry              text not null,
  size                  text not null,
  level                 int  not null,
  est_hours             int  not null,
  answers               jsonb not null,
  status                text not null default 'report',  -- 'report' | 'booked'
  demo_at               timestamptz,
  calendly_event_uri    text,
  calendly_invitee_uri  text
);

create index if not exists submissions_created_at_idx on submissions (created_at desc);
