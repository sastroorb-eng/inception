-- =============================================================
-- Bootstrap akun admin pertama
-- Jalankan sekali. GANTI PASSWORD setelah login pertama.
-- =============================================================
begin;

do $$
declare
  v_uid  uuid := gen_random_uuid();
  v_email text := 'admin@tth.sch.id';
  v_pass text := 'Ganti123!';
begin
  if exists (select 1 from auth.users where email = v_email) then
    raise exception 'User % sudah ada, tidak perlu bootstrap lagi.', v_email;
  end if;

  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change
  ) values (
    '00000000-0000-0000-0000-000000000000',
    v_uid,
    'authenticated',
    'authenticated',
    v_email,
    crypt(v_pass, gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Administrator Sekolah"}',
    now(),
    now(),
    '',
    '',
    '',
    ''
  );

  insert into auth.identities (
    id,
    user_id,
    provider_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) values (
    gen_random_uuid(),
    v_uid,
    v_email,
    jsonb_build_object('sub', v_uid, 'email', v_email, 'email_verified', true),
    'email',
    now(),
    now(),
    now()
  );
end $$;

-- Naikkan role menjadi admin
update public.profiles
   set role = 'admin', full_name = 'Administrator Sekolah'
 where user_id = (select id from auth.users where email = 'admin@tth.sch.id');

commit;

select u.email, p.role, p.full_name
  from auth.users u
  join public.profiles p on p.user_id = u.id
 where u.email = 'admin@tth.sch.id';
