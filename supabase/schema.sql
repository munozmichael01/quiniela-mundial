-- ============================================================
-- Quiniela Mundial 2026 – Supabase Schema
-- Run this in the Supabase SQL Editor (order matters)
-- ============================================================

-- Extensions
create extension if not exists "pgcrypto";

-- ──────────────────────────────────────────────────────────────
-- Tables
-- ──────────────────────────────────────────────────────────────

create table public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  nombre      text not null,
  alias       text not null unique,
  role        text not null default 'user' check (role in ('admin', 'user')),
  email       text not null unique,
  created_at  timestamptz not null default now()
);

create table public.matches (
  id          serial primary key,
  "group"     text not null,
  home        text not null,
  away        text not null,
  home_flag   text,
  away_flag   text,
  date        timestamptz not null,
  status      text not null default 'scheduled' check (status in ('scheduled', 'live', 'finished')),
  external_id integer unique
);

create table public.predictions (
  id          serial primary key,
  user_id     uuid not null references public.users(id) on delete cascade,
  match_id    integer not null references public.matches(id) on delete cascade,
  home_score  integer not null check (home_score >= 0),
  away_score  integer not null check (away_score >= 0),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, match_id)
);

create table public.results (
  match_id    integer primary key references public.matches(id) on delete cascade,
  home_score  integer not null check (home_score >= 0),
  away_score  integer not null check (away_score >= 0),
  updated_at  timestamptz not null default now()
);

create table public.bonuses (
  id          serial primary key,
  user_id     uuid not null references public.users(id) on delete cascade unique,
  campeon     text,
  subcampeon  text,
  goleador    text,
  mvp         text,
  portero     text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.bonus_results (
  id          serial primary key,
  campeon     text,
  subcampeon  text,
  goleador    text,
  mvp         text,
  portero     text,
  updated_at  timestamptz not null default now()
);

-- ──────────────────────────────────────────────────────────────
-- Row Level Security
-- ──────────────────────────────────────────────────────────────

alter table public.users        enable row level security;
alter table public.matches       enable row level security;
alter table public.predictions   enable row level security;
alter table public.results       enable row level security;
alter table public.bonuses       enable row level security;
alter table public.bonus_results enable row level security;

-- Helper: is the calling user an admin?
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin'
  );
$$;

-- users: admins see all; users see their own row
create policy "users_select_own"   on public.users for select using (id = auth.uid() or is_admin());
create policy "users_insert_admin" on public.users for insert with check (is_admin());
create policy "users_delete_admin" on public.users for delete using (is_admin());

-- matches: all authenticated users can read
create policy "matches_select" on public.matches for select using (auth.uid() is not null);
create policy "matches_admin"  on public.matches for all   using (is_admin());

-- predictions: user reads/writes own; admin reads all
create policy "predictions_own_select" on public.predictions for select using (user_id = auth.uid() or is_admin());
create policy "predictions_own_insert" on public.predictions for insert with check (user_id = auth.uid());
create policy "predictions_own_update" on public.predictions for update using (user_id = auth.uid());
create policy "predictions_own_delete" on public.predictions for delete using (user_id = auth.uid());

-- results: all authenticated users can read; only service role writes (via cron)
create policy "results_select" on public.results for select using (auth.uid() is not null);

-- bonuses: user reads/writes own; admin reads all
create policy "bonuses_own_select" on public.bonuses for select using (user_id = auth.uid() or is_admin());
create policy "bonuses_own_insert" on public.bonuses for insert with check (user_id = auth.uid());
create policy "bonuses_own_update" on public.bonuses for update using (user_id = auth.uid());

-- bonus_results: all authenticated can read; admin writes
create policy "bonus_results_select" on public.bonus_results for select using (auth.uid() is not null);
create policy "bonus_results_admin"  on public.bonus_results for all   using (is_admin());

-- ──────────────────────────────────────────────────────────────
-- Realtime
-- ──────────────────────────────────────────────────────────────

-- Enable realtime for results and bonus_results
-- Run in Supabase dashboard: Realtime > Tables > enable for 'results' and 'bonus_results'
-- Or via SQL:
alter publication supabase_realtime add table public.results;
alter publication supabase_realtime add table public.bonus_results;
