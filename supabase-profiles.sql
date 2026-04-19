-- ─────────────────────────────────────────────────────────────────────────────
-- profiles table — free / paid subscription tier
-- Run this in Supabase SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────

-- Drop everything cleanly first
drop trigger if exists profiles_updated_at on public.profiles;
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_updated_at();
drop function if exists public.handle_new_user();
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop table if exists public.profiles cascade;

-- Create profiles table
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  is_paid    boolean      not null default false,
  plan       text         not null default 'free' check (plan in ('free', 'paid')),
  paid_at    timestamptz,
  created_at timestamptz  not null default now(),
  updated_at timestamptz  not null default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- Auto-create a free profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, is_paid, plan)
  values (new.id, false, 'free')
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────────────────
-- To mark a user as paid (run manually or via payment webhook):
-- update public.profiles
--   set is_paid = true, plan = 'paid', paid_at = now()
--   where id = '<user-uuid>';
-- ─────────────────────────────────────────────────────────────────────────────
