-- Emergency Rescue Node Communication System schema
-- Run this in Supabase SQL editor.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_text text not null,
  created_at timestamptz not null default now(),
  constraint admin_users_email_lower_chk check (email = lower(email))
);

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  emergency_number text null,
  created_at timestamptz not null default now(),
  normalized_name text generated always as (lower(btrim(name))) stored,
  normalized_emergency_number text generated always as (
    coalesce(nullif(regexp_replace(coalesce(emergency_number, ''), '\\s+', '', 'g'), ''), '__none__')
  ) stored,
  constraint users_name_not_blank_chk check (length(btrim(name)) > 0),
  constraint users_name_emergency_unique unique (normalized_name, normalized_emergency_number)
);

create index if not exists idx_users_created_at_desc on public.users (created_at desc);
create index if not exists idx_users_name on public.users (name);

insert into public.admin_users (email, password_text)
values ('admin@rescue.local', 'admin123456')
on conflict (email)
do update set password_text = excluded.password_text;

insert into public.users (name, emergency_number)
values
  ('John Doe', '+15550001111'),
  ('John Doe', '+15550002222'),
  ('Maria Lopez', null),
  ('Aarav Singh', '9876543210')
on conflict (normalized_name, normalized_emergency_number) do nothing;
