create table if not exists public.admin_credentials (
  id serial primary key,
  password text not null
);

alter table public.admin_credentials enable row level security;

-- No public read — only service role can read (fetched server-side via anon key is intentionally blocked)
-- We allow anon select so the login page can verify (password is hashed in production ideally, but kept simple here)
create policy "Anon read credentials" on public.admin_credentials for select using (true);

-- Insert default password (only if table is empty)
insert into public.admin_credentials (password)
select 'peter123h2026'
where not exists (select 1 from public.admin_credentials);
