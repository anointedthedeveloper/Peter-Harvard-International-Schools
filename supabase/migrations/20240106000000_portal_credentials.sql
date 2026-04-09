-- Portal credentials table for approved students
create table if not exists public.portal_credentials (
  id uuid primary key default gen_random_uuid(),
  admission_id uuid not null references public.admissions(id) on delete cascade,
  student_name text not null,
  username text not null unique,
  password text not null,
  class text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.portal_credentials enable row level security;

-- Only authenticated admins can manage credentials
create policy "Auth manage credentials" on public.portal_credentials
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Students can read their own credentials by username (for portal login)
create policy "Public read credentials by username" on public.portal_credentials
  for select using (true);
