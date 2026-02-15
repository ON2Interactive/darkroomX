-- DarkroomX core schema for signup, credits, and session-based projects.
-- Run in Supabase SQL Editor.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  username text not null,
  credits_balance integer not null default 0,
  last_sign_in_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null default 'New Session',
  status text not null default 'active' check (status in ('active', 'completed', 'archived')),
  started_at timestamptz not null default now(),
  last_opened_at timestamptz not null default now(),
  ended_at timestamptz null,
  cover_image_url text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_projects_user_status on public.projects(user_id, status, started_at desc);

create table if not exists public.project_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null check (kind in ('original', 'edit', 'variation', 'export')),
  file_url text not null,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_project_items_project_created on public.project_items(project_id, created_at desc);
create index if not exists idx_project_items_user_created on public.project_items(user_id, created_at desc);

create table if not exists public.credit_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  project_id uuid null references public.projects(id) on delete set null,
  delta integer not null,
  reason text not null,
  source text null,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_credit_ledger_user_created on public.credit_ledger(user_id, created_at desc);
create unique index if not exists ux_credit_ledger_signup_bonus on public.credit_ledger(user_id, reason) where reason = 'signup_bonus';

create or replace function public.tg_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row
execute function public.tg_set_updated_at();

drop trigger if exists trg_projects_updated_at on public.projects;
create trigger trg_projects_updated_at
before update on public.projects
for each row
execute function public.tg_set_updated_at();

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_items enable row level security;
alter table public.credit_ledger enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "projects_all_own" on public.projects;
create policy "projects_all_own"
on public.projects for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "project_items_all_own" on public.project_items;
create policy "project_items_all_own"
on public.project_items for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "credit_ledger_select_own" on public.credit_ledger;
create policy "credit_ledger_select_own"
on public.credit_ledger for select
to authenticated
using (auth.uid() = user_id);

