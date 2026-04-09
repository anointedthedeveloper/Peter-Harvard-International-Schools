-- Admissions table
create table if not exists public.admissions (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  dob text not null,
  gender text not null,
  class_applying text not null,
  parent_name text not null,
  phone text not null,
  email text,
  address text not null,
  photo_url text,
  photo_path text,
  status text not null default 'pending',
  created_at timestamptz default now()
);

alter table public.admissions enable row level security;

-- Public can submit admissions
create policy "Anon insert admissions" on public.admissions for select using (true);
create policy "Anon submit admissions" on public.admissions for insert with check (true);
-- Only allow update via service role (dashboard uses anon key so we allow it)
create policy "Anon update admissions" on public.admissions for update using (true);
create policy "Anon delete admissions" on public.admissions for delete using (true);

-- Fix gallery & blog_posts: allow anon inserts (dashboard uses custom auth, not Supabase Auth)
drop policy if exists "Auth insert gallery" on public.gallery;
drop policy if exists "Auth delete gallery" on public.gallery;
drop policy if exists "Auth insert blog_posts" on public.blog_posts;
drop policy if exists "Auth delete blog_posts" on public.blog_posts;

create policy "Anon insert gallery" on public.gallery for insert with check (true);
create policy "Anon delete gallery" on public.gallery for delete using (true);
create policy "Anon insert blog_posts" on public.blog_posts for insert with check (true);
create policy "Anon delete blog_posts" on public.blog_posts for delete using (true);

-- Fix storage policies: allow anon uploads/deletes
drop policy if exists "Auth upload phis-media" on storage.objects;
drop policy if exists "Auth delete phis-media" on storage.objects;

create policy "Anon upload phis-media" on storage.objects for insert with check (bucket_id = 'phis-media');
create policy "Anon delete phis-media" on storage.objects for delete using (bucket_id = 'phis-media');
