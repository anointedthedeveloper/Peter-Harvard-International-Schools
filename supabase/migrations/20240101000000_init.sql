-- Create gallery table
create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'Campus',
  src text not null,
  storage_path text,
  created_at timestamptz default now()
);

-- Create blog_posts table
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text,
  content text,
  category text not null default 'News',
  cover_url text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.gallery enable row level security;
alter table public.blog_posts enable row level security;

-- Public read access
create policy "Public read gallery" on public.gallery for select using (true);
create policy "Public read blog_posts" on public.blog_posts for select using (true);

-- Authenticated write access
create policy "Auth insert gallery" on public.gallery for insert with check (auth.role() = 'authenticated');
create policy "Auth delete gallery" on public.gallery for delete using (auth.role() = 'authenticated');
create policy "Auth insert blog_posts" on public.blog_posts for insert with check (auth.role() = 'authenticated');
create policy "Auth delete blog_posts" on public.blog_posts for delete using (auth.role() = 'authenticated');

-- Create storage bucket (phis-media, public)
insert into storage.buckets (id, name, public)
values ('phis-media', 'phis-media', true)
on conflict (id) do nothing;

-- Storage policies
create policy "Public read phis-media" on storage.objects for select using (bucket_id = 'phis-media');
create policy "Auth upload phis-media" on storage.objects for insert with check (bucket_id = 'phis-media' and auth.role() = 'authenticated');
create policy "Auth delete phis-media" on storage.objects for delete using (bucket_id = 'phis-media' and auth.role() = 'authenticated');
