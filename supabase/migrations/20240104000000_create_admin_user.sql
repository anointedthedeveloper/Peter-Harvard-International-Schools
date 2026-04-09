-- Enable pgcrypto for password hashing
create extension if not exists pgcrypto schema extensions;

-- Create admin user in Supabase Auth
insert into auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  role,
  aud,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
)
select
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@peterharvard.sch.ng',
  extensions.crypt('peter123h2026', extensions.gen_salt('bf')),
  now(),
  'authenticated',
  'authenticated',
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"admin"}',
  false,
  '',
  '',
  '',
  ''
where not exists (
  select 1 from auth.users where email = 'admin@peterharvard.sch.ng'
);

-- Also insert into auth.identities (required for email login)
insert into auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
)
select
  gen_random_uuid(),
  u.id,
  json_build_object('sub', u.id::text, 'email', u.email),
  'email',
  u.email,
  now(),
  now(),
  now()
from auth.users u
where u.email = 'admin@peterharvard.sch.ng'
  and not exists (
    select 1 from auth.identities i where i.provider_id = u.email and i.provider = 'email'
  );
