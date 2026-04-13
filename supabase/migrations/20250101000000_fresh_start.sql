-- ── Extensions ──────────────────────────────────────────────
create extension if not exists pgcrypto schema extensions;

-- ── Tables ───────────────────────────────────────────────────
create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'Campus',
  src text not null,
  storage_path text,
  created_at timestamptz default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text,
  content text,
  category text not null default 'News',
  cover_url text,
  created_at timestamptz default now()
);

create table if not exists public.admissions (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  dob text,
  gender text,
  class_applying text,
  parent_name text,
  phone text,
  email text,
  address text,
  photo_url text,
  photo_path text,
  status text not null default 'pending',
  notes text,
  created_at timestamptz default now()
);

-- ── Row Level Security ────────────────────────────────────────
alter table public.gallery enable row level security;
alter table public.blog_posts enable row level security;
alter table public.admissions enable row level security;

-- Public read
create policy "Public read gallery" on public.gallery for select using (true);
create policy "Public read blog_posts" on public.blog_posts for select using (true);

-- Authenticated write
create policy "Auth insert gallery" on public.gallery for insert with check (auth.role() = 'authenticated');
create policy "Auth delete gallery" on public.gallery for delete using (auth.role() = 'authenticated');

create policy "Auth insert blog_posts" on public.blog_posts for insert with check (auth.role() = 'authenticated');
create policy "Auth delete blog_posts" on public.blog_posts for delete using (auth.role() = 'authenticated');
create policy "Auth update blog_posts" on public.blog_posts for update using (auth.role() = 'authenticated');

-- Admissions: public insert (form submissions), authenticated read/update/delete
create policy "Public insert admissions" on public.admissions for insert with check (true);
create policy "Auth read admissions" on public.admissions for select using (auth.role() = 'authenticated');
create policy "Auth update admissions" on public.admissions for update using (auth.role() = 'authenticated');
create policy "Auth delete admissions" on public.admissions for delete using (auth.role() = 'authenticated');

-- ── Storage ───────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('phis-media', 'phis-media', true)
on conflict (id) do nothing;

create policy "Public read phis-media" on storage.objects for select using (bucket_id = 'phis-media');
create policy "Auth upload phis-media" on storage.objects for insert with check (bucket_id = 'phis-media' and auth.role() = 'authenticated');
create policy "Auth delete phis-media" on storage.objects for delete using (bucket_id = 'phis-media' and auth.role() = 'authenticated');

-- ── Admin Auth User ───────────────────────────────────────────
-- Creates the admin login: admin@peterharvard.sch.ng / peter123h2026
insert into auth.users (
  id, instance_id, email, encrypted_password,
  email_confirmed_at, role, aud,
  created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data,
  is_super_admin, confirmation_token, recovery_token,
  email_change_token_new, email_change
)
select
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@peterharvard.sch.ng',
  extensions.crypt('peter123h2026', extensions.gen_salt('bf')),
  now(), 'authenticated', 'authenticated',
  now(), now(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"admin"}',
  false, '', '', '', ''
where not exists (
  select 1 from auth.users where email = 'admin@peterharvard.sch.ng'
);

insert into auth.identities (
  id, user_id, identity_data, provider, provider_id,
  last_sign_in_at, created_at, updated_at
)
select
  gen_random_uuid(), u.id,
  json_build_object('sub', u.id::text, 'email', u.email),
  'email', u.email,
  now(), now(), now()
from auth.users u
where u.email = 'admin@peterharvard.sch.ng'
  and not exists (
    select 1 from auth.identities i
    where i.provider_id = u.email and i.provider = 'email'
  );
