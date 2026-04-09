-- Drop old overly-permissive policies
drop policy if exists "Anon insert admissions" on public.admissions;
drop policy if exists "Anon submit admissions" on public.admissions;
drop policy if exists "Anon update admissions" on public.admissions;
drop policy if exists "Anon delete admissions" on public.admissions;

-- Anyone (public) can submit an admission
create policy "Public submit admissions" on public.admissions
  for insert with check (true);

-- Only authenticated admins can read, update, delete
create policy "Auth read admissions" on public.admissions
  for select using (auth.role() = 'authenticated');

create policy "Auth update admissions" on public.admissions
  for update using (auth.role() = 'authenticated');

create policy "Auth delete admissions" on public.admissions
  for delete using (auth.role() = 'authenticated');

-- Add notes column for admin edits if not exists
alter table public.admissions add column if not exists notes text;

-- Fix gallery/blog/storage to require authenticated (Supabase Auth is now used)
drop policy if exists "Anon insert gallery" on public.gallery;
drop policy if exists "Anon delete gallery" on public.gallery;
drop policy if exists "Anon insert blog_posts" on public.blog_posts;
drop policy if exists "Anon delete blog_posts" on public.blog_posts;
drop policy if exists "Anon upload phis-media" on storage.objects;
drop policy if exists "Anon delete phis-media" on storage.objects;

create policy "Auth insert gallery" on public.gallery for insert with check (auth.role() = 'authenticated');
create policy "Auth delete gallery" on public.gallery for delete using (auth.role() = 'authenticated');
create policy "Auth insert blog_posts" on public.blog_posts for insert with check (auth.role() = 'authenticated');
create policy "Auth delete blog_posts" on public.blog_posts for delete using (auth.role() = 'authenticated');

create policy "Auth upload phis-media" on storage.objects for insert with check (bucket_id = 'phis-media' and auth.role() = 'authenticated');
create policy "Auth delete phis-media" on storage.objects for delete using (bucket_id = 'phis-media' and auth.role() = 'authenticated');

-- Admissions photo upload: allow anon to upload to admissions/ folder only
create policy "Anon upload admissions photos" on storage.objects
  for insert with check (bucket_id = 'phis-media' and (storage.foldername(name))[1] = 'admissions');
