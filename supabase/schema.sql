-- Tables the backend expects in Supabase (Postgres).
-- Reconstructed from backend/models/user.js and backend/controllers/profileController.js.
create extension if not exists pgcrypto;

create table if not exists public.users (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  email          text not null unique,
  password_hash  text not null,
  is_verified    boolean not null default false,
  otp            text,
  otp_expires_at timestamptz,
  created_at     timestamptz not null default now()
);

create table if not exists public.profiles (
  user_id             uuid primary key references public.users(id) on delete cascade,
  university          text default '',
  degree              text default '',
  cgpa                text default '',
  graduation_year     text default '',
  ielts               text default '',
  gre                 text default '',
  target_degree       text default 'Master''s (MSc)',
  preferred_countries text default '',
  field_of_interest   text default '',
  budget_range        text default 'Fully funded only',
  short_bio           text default '',
  updated_at          timestamptz not null default now()
);

-- Only enable row level security if SUPABASE_KEY is the service role key.
-- With the anon key and no policies, these two lines would block the backend.
-- alter table public.users enable row level security;
-- alter table public.profiles enable row level security;
