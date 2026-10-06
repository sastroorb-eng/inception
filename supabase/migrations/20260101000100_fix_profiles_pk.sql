-- =============================================================
-- Fix: profiles memakai user_id sebagai primary key
-- Sebelumnya ada kolom `id` DAN `user_id` yang keduanya
-- menunjuk ke auth.users.id. Trigger handle_new_user() hanya
-- mengisi user_id sehingga kolom `id` bernilai NULL.
-- =============================================================

begin;

alter table public.classes   drop constraint if exists classes_homeroom_teacher_id_fkey;
alter table public.news_posts drop constraint if exists news_posts_author_id_fkey;

drop table if exists public.profiles;

create table public.profiles (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  role        public.user_role not null default 'guru',
  full_name   text,
  nip         text unique,
  phone       text,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.profiles is 'Profil pengguna, tertaut 1:1 dengan auth.users (user_id = auth.users.id)';

alter table public.classes
  add constraint classes_homeroom_teacher_id_fkey
  foreign key (homeroom_teacher_id) references public.profiles (user_id) on delete set null;

alter table public.news_posts
  add constraint news_posts_author_id_fkey
  foreign key (author_id) references public.profiles (user_id) on delete set null;

-- trigger updated_at
drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- trigger auto-create profile
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (user_id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(coalesce(new.email, ''), '@', 1)),
    'guru'
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- guard role
-- Perubahan role dicegah hanya untuk sesi yang terautentikasi sebagai
-- pengguna biasa. Jalur admin tingkat database (SQL Editor / psql langsung)
-- tetap dapat mengubah role karena session_user bukan 'postgres'.
create or replace function public.guard_profile_role()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.role is distinct from old.role
     and coalesce(current_setting('request.jwt.claim.role', true), '') <> 'service_role'
     and session_user not in ('postgres', 'service_role')
     and exists (select 1 from public.profiles p where p.user_id = auth.uid()) then
    if not exists (
      select 1 from public.profiles p
      where p.user_id = auth.uid() and p.role = 'admin'
    ) then
      raise exception 'Perubahan role hanya dapat dilakukan oleh administrator';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_profiles_guard_role on public.profiles;
create trigger trg_profiles_guard_role
  before update on public.profiles
  for each row execute function public.guard_profile_role();

-- RLS
alter table public.profiles enable row level security;

create policy "profiles_select_own"   on public.profiles for select to authenticated
  using (user_id = auth.uid());
create policy "profiles_select_staff" on public.profiles for select to authenticated
  using (public.is_staff());
create policy "profiles_insert_own"   on public.profiles for insert to authenticated
  with check (user_id = auth.uid());
create policy "profiles_update_own"   on public.profiles for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "profiles_admin_all"    on public.profiles for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

grant select, insert, update, delete on public.profiles to authenticated, service_role;

commit;
