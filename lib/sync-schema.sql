-- CyberDollar sync table: one row per user holding their full tracker state.
-- Run this in Supabase > SQL Editor > New query > Run.

create table if not exists finance_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz default now()
);

alter table finance_data enable row level security;

drop policy if exists "own data" on finance_data;
create policy "own data" on finance_data
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
