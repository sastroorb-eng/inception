-- =============================================================
-- Portal Sekolah - Initial Schema
-- SMK Telekomunikasi Tunas Harapan
-- =============================================================

begin;

create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";

-- -----------------------------
-- Enums
-- -----------------------------
do $$ begin
  create type public.user_role as enum ('admin', 'guru');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.gender as enum ('L', 'P');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.post_status as enum ('draft', 'published', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.student_status as enum ('aktif', 'lulus', 'pindah', 'keluar');
exception when duplicate_object then null; end $$;

-- -----------------------------
-- Shared helpers
-- -----------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------
-- profiles  (1:1 with auth.users)
-- -----------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  user_id     uuid not null unique references auth.users (id) on delete cascade,
  role        public.user_role not null default 'guru',
  full_name   text,
  nip         text unique,
  phone       text,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.profiles is 'Profil pengguna, tertaut 1:1 dengan auth.users';

-- -----------------------------
-- classes (kelas / rombel)
-- -----------------------------
create table if not exists public.classes (
  id                 uuid primary key default gen_random_uuid(),
  name               text not null,
  level              text not null,                       -- 'X' | 'XI' | 'XII'
  major              text,                                -- PPLG, TKJ, DKV, ...
  academic_year      text not null,                       -- '2026/2027'
  homeroom_teacher_id uuid references public.profiles (id) on delete set null,
  capacity           integer check (capacity is null or capacity > 0),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  unique (name, academic_year)
);

-- -----------------------------
-- subjects (mata pelajaran)
-- -----------------------------
create table if not exists public.subjects (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,
  name        text not null unique,
  category    text,                                        -- wajib / pilihan
  credits     integer check (credits is null or credits > 0),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- -----------------------------
-- teachers (guru / tenaga pendidik)
-- -----------------------------
create table if not exists public.teachers (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid unique references auth.users (id) on delete set null,
  nip          text not null unique,
  full_name    text not null,
  gender       public.gender,
  phone        text,
  email        text,
  subject_id   uuid references public.subjects (id) on delete set null,
  title        text,
  is_active    boolean not null default true,
  joined_at    date,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- -----------------------------
-- students (siswa)
-- -----------------------------
create table if not exists public.students (
  id            uuid primary key default gen_random_uuid(),
  nis           text not null unique,
  nisn          text unique,
  full_name     text not null,
  gender        public.gender,
  birth_place   text,
  birth_date    date,
  class_id      uuid references public.classes (id) on delete set null,
  address       text,
  phone         text,
  parent_name   text,
  parent_phone  text,
  status        public.student_status not null default 'aktif',
  photo_url     text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- -----------------------------
-- enrollments (riwayat kelas siswa)
-- -----------------------------
create table if not exists public.enrollments (
  id            uuid primary key default gen_random_uuid(),
  student_id    uuid not null references public.students (id) on delete cascade,
  class_id      uuid not null references public.classes (id) on delete cascade,
  academic_year text not null,
  semester      text not null check (semester in ('ganjil', 'genap')),
  enrolled_at   date not null default current_date,
  created_at    timestamptz not null default now(),
  unique (student_id, class_id, academic_year, semester)
);

-- -----------------------------
-- schedules (jadwal pelajaran)
-- -----------------------------
create table if not exists public.schedules (
  id          uuid primary key default gen_random_uuid(),
  class_id    uuid not null references public.classes (id) on delete cascade,
  subject_id  uuid not null references public.subjects (id) on delete cascade,
  teacher_id  uuid references public.teachers (id) on delete set null,
  day         smallint not null check (day between 1 and 6),   -- 1 = Senin
  start_time  time not null,
  end_time    time not null,
  room        text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint schedules_time_order check (end_time > start_time)
);

-- -----------------------------
-- grades (nilai)
-- -----------------------------
create table if not exists public.grades (
  id                      uuid primary key default gen_random_uuid(),
  student_id              uuid not null references public.students (id) on delete cascade,
  subject_id              uuid not null references public.subjects (id) on delete cascade,
  class_id                uuid not null references public.classes (id) on delete cascade,
  teacher_id              uuid references public.teachers (id) on delete set null,
  academic_year           text not null,
  semester                text not null check (semester in ('ganjil', 'genap')),
  daily_quiz              numeric(5,2) check (daily_quiz     between 0 and 100),
  assignment              numeric(5,2) check (assignment     between 0 and 100),
  mid_exam                numeric(5,2) check (mid_exam       between 0 and 100),
  final_exam              numeric(5,2) check (final_exam     between 0 and 100),
  final_score             numeric(5,2) generated always as (
                            round(
                              coalesce(daily_quiz, 0)   * 0.20 +
                              coalesce(assignment, 0)   * 0.20 +
                              coalesce(mid_exam, 0)     * 0.30 +
                              coalesce(final_exam, 0)   * 0.30
                            , 2)
                          ) stored,
  letter_grade            text generated always as (
                            case
                              when coalesce(daily_quiz,0)*0.20 + coalesce(assignment,0)*0.20
                                 + coalesce(mid_exam,0)*0.30 + coalesce(final_exam,0)*0.30 >= 90 then 'A'
                              when coalesce(daily_quiz,0)*0.20 + coalesce(assignment,0)*0.20
                                 + coalesce(mid_exam,0)*0.30 + coalesce(final_exam,0)*0.30 >= 80 then 'B'
                              when coalesce(daily_quiz,0)*0.20 + coalesce(assignment,0)*0.20
                                 + coalesce(mid_exam,0)*0.30 + coalesce(final_exam,0)*0.30 >= 70 then 'C'
                              when coalesce(daily_quiz,0)*0.20 + coalesce(assignment,0)*0.20
                                 + coalesce(mid_exam,0)*0.30 + coalesce(final_exam,0)*0.30 >= 60 then 'D'
                              else 'E'
                            end
                          ) stored,
  remarks                 text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),
  unique (student_id, subject_id, academic_year, semester)
);

-- -----------------------------
-- news_posts (berita & pengumuman)
-- -----------------------------
create table if not exists public.news_posts (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  slug         text not null unique,
  excerpt      text,
  body         text not null,
  category     text not null default 'Pengumuman',
  cover_url    text,
  status       public.post_status not null default 'draft',
  is_pinned    boolean not null default false,
  author_id    uuid references public.profiles (id) on delete set null,
  published_at timestamptz,
  views        integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- -----------------------------
-- messages (pesan masuk dari formulir kontak)
-- -----------------------------
create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  phone       text,
  subject     text,
  body        text not null,
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);

-- -----------------------------
-- school_settings (pengaturan web, key-value)
-- -----------------------------
create table if not exists public.school_settings (
  key         text primary key,
  value       text,
  updated_at  timestamptz not null default now()
);

-- -----------------------------
-- Indexes
-- -----------------------------
create index if not exists idx_students_class        on public.students (class_id);
create index if not exists idx_students_name         on public.students using gin (full_name gin_trgm_ops);
create index if not exists idx_students_status       on public.students (status);
create index if not exists idx_teachers_active       on public.teachers (is_active);
create index if not exists idx_enrollments_class     on public.enrollments (class_id);
create index if not exists idx_grades_student        on public.grades (student_id);
create index if not exists idx_grades_class_subject  on public.grades (class_id, subject_id);
create index if not exists idx_schedules_class       on public.schedules (class_id, day);
create index if not exists idx_news_status_date      on public.news_posts (status, published_at desc);
create index if not exists idx_news_category         on public.news_posts (category);
create index if not exists idx_messages_unread       on public.messages (is_read, created_at desc);

-- -----------------------------
-- updated_at triggers
-- -----------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'profiles','classes','subjects','teachers','students',
    'enrollments','schedules','grades','news_posts','school_settings'
  ] loop
    execute format('drop trigger if exists trg_%1$s_updated_at on public.%1$I', t);
    execute format(
      'create trigger trg_%1$s_updated_at before update on public.%1$I
         for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

-- -----------------------------
-- Auto-create profile on signup
-- -----------------------------
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

-- -----------------------------
-- Guard: users cannot escalate their own role
-- -----------------------------
create or replace function public.guard_profile_role()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.role is distinct from old.role
     and coalesce(current_setting('request.jwt.claim.role', true), '') <> 'service_role'
     and not exists (
       select 1 from public.profiles p
       where p.user_id = auth.uid() and p.role = 'admin'
     ) then
    raise exception 'Perubahan role hanya dapat dilakukan oleh administrator';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_profiles_guard_role on public.profiles;
create trigger trg_profiles_guard_role
  before update on public.profiles
  for each row execute function public.guard_profile_role();

-- -----------------------------
-- RLS helper functions
-- -----------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid() and p.role = 'admin'
  );
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid() and p.role in ('admin', 'guru')
  );
$$;

revoke all on function public.is_admin()  from public;
revoke all on function public.is_staff()  from public;
grant execute on function public.is_admin() to authenticated, service_role;
grant execute on function public.is_staff() to authenticated, service_role;

-- -----------------------------
-- Enable RLS
-- -----------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'profiles','classes','subjects','teachers','students','enrollments',
    'schedules','grades','news_posts','messages','school_settings'
  ] loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

-- -----------------------------
-- Policies
-- -----------------------------

-- profiles
drop policy if exists "profiles_select_own"      on public.profiles;
drop policy if exists "profiles_select_staff"    on public.profiles;
drop policy if exists "profiles_insert_own"      on public.profiles;
drop policy if exists "profiles_update_own"      on public.profiles;
drop policy if exists "profiles_admin_all"       on public.profiles;

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

-- classes
drop policy if exists "classes_select"    on public.classes;
drop policy if exists "classes_insert"    on public.classes;
drop policy if exists "classes_update"    on public.classes;
drop policy if exists "classes_delete"    on public.classes;

create policy "classes_select" on public.classes for select to authenticated
  using (public.is_staff());
create policy "classes_insert" on public.classes for insert to authenticated
  with check (public.is_admin());
create policy "classes_update" on public.classes for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "classes_delete" on public.classes for delete to authenticated
  using (public.is_admin());

-- subjects
drop policy if exists "subjects_select"    on public.subjects;
drop policy if exists "subjects_insert"    on public.subjects;
drop policy if exists "subjects_update"    on public.subjects;
drop policy if exists "subjects_delete"    on public.subjects;

create policy "subjects_select" on public.subjects for select to authenticated
  using (public.is_staff());
create policy "subjects_insert" on public.subjects for insert to authenticated
  with check (public.is_admin());
create policy "subjects_update" on public.subjects for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "subjects_delete" on public.subjects for delete to authenticated
  using (public.is_admin());

-- teachers
drop policy if exists "teachers_select"    on public.teachers;
drop policy if exists "teachers_insert"    on public.teachers;
drop policy if exists "teachers_update"    on public.teachers;
drop policy if exists "teachers_delete"    on public.teachers;

create policy "teachers_select" on public.teachers for select to authenticated
  using (public.is_staff());
create policy "teachers_insert" on public.teachers for insert to authenticated
  with check (public.is_admin());
create policy "teachers_update" on public.teachers for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "teachers_delete" on public.teachers for delete to authenticated
  using (public.is_admin());

-- students
drop policy if exists "students_select"    on public.students;
drop policy if exists "students_insert"    on public.students;
drop policy if exists "students_update"    on public.students;
drop policy if exists "students_delete"    on public.students;

create policy "students_select" on public.students for select to authenticated
  using (public.is_staff());
create policy "students_insert" on public.students for insert to authenticated
  with check (public.is_admin());
create policy "students_update" on public.students for update to authenticated
  using (public.is_staff()) with check (public.is_staff());
create policy "students_delete" on public.students for delete to authenticated
  using (public.is_admin());

-- enrollments
drop policy if exists "enrollments_select"    on public.enrollments;
drop policy if exists "enrollments_insert"    on public.enrollments;
drop policy if exists "enrollments_update"    on public.enrollments;
drop policy if exists "enrollments_delete"    on public.enrollments;

create policy "enrollments_select" on public.enrollments for select to authenticated
  using (public.is_staff());
create policy "enrollments_insert" on public.enrollments for insert to authenticated
  with check (public.is_admin());
create policy "enrollments_update" on public.enrollments for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "enrollments_delete" on public.enrollments for delete to authenticated
  using (public.is_admin());

-- schedules
drop policy if exists "schedules_select"    on public.schedules;
drop policy if exists "schedules_insert"    on public.schedules;
drop policy if exists "schedules_update"    on public.schedules;
drop policy if exists "schedules_delete"    on public.schedules;

create policy "schedules_select" on public.schedules for select to authenticated
  using (public.is_staff());
create policy "schedules_insert" on public.schedules for insert to authenticated
  with check (public.is_admin());
create policy "schedules_update" on public.schedules for update to authenticated
  using (public.is_staff()) with check (public.is_staff());
create policy "schedules_delete" on public.schedules for delete to authenticated
  using (public.is_admin());

-- grades
drop policy if exists "grades_select"    on public.grades;
drop policy if exists "grades_insert"    on public.grades;
drop policy if exists "grades_update"    on public.grades;
drop policy if exists "grades_delete"    on public.grades;

create policy "grades_select" on public.grades for select to authenticated
  using (public.is_staff());
create policy "grades_insert" on public.grades for insert to authenticated
  with check (public.is_staff());
create policy "grades_update" on public.grades for update to authenticated
  using (public.is_staff()) with check (public.is_staff());
create policy "grades_delete" on public.grades for delete to authenticated
  using (public.is_admin());

-- news_posts
drop policy if exists "news_public_read"   on public.news_posts;
drop policy if exists "news_insert"        on public.news_posts;
drop policy if exists "news_update"        on public.news_posts;
drop policy if exists "news_delete"        on public.news_posts;

create policy "news_public_read" on public.news_posts for select to anon, authenticated
  using (status = 'published' or public.is_admin());
create policy "news_insert" on public.news_posts for insert to authenticated
  with check (public.is_staff());
create policy "news_update" on public.news_posts for update to authenticated
  using (public.is_staff()) with check (public.is_staff());
create policy "news_delete" on public.news_posts for delete to authenticated
  using (public.is_admin());

-- messages
drop policy if exists "messages_public_insert" on public.messages;
drop policy if exists "messages_admin_read"   on public.messages;
drop policy if exists "messages_admin_update" on public.messages;
drop policy if exists "messages_admin_delete" on public.messages;

create policy "messages_public_insert" on public.messages for insert to anon, authenticated
  with check (true);
create policy "messages_admin_read"   on public.messages for select to authenticated
  using (public.is_admin());
create policy "messages_admin_update" on public.messages for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "messages_admin_delete" on public.messages for delete to authenticated
  using (public.is_admin());

-- school_settings
drop policy if exists "settings_read"      on public.school_settings;
drop policy if exists "settings_insert"    on public.school_settings;
drop policy if exists "settings_update"    on public.school_settings;
drop policy if exists "settings_delete"    on public.school_settings;

create policy "settings_read"   on public.school_settings for select to authenticated
  using (true);
create policy "settings_insert" on public.school_settings for insert to authenticated
  with check (public.is_admin());
create policy "settings_update" on public.school_settings for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "settings_delete" on public.school_settings for delete to authenticated
  using (public.is_admin());

-- -----------------------------
-- Grants (RLS is the security boundary; these allow PostgREST access)
-- -----------------------------
grant usage on schema public to anon, authenticated, service_role;

do $$
declare t text;
begin
  foreach t in array array[
    'profiles','classes','subjects','teachers','students','enrollments',
    'schedules','grades','news_posts','messages','school_settings'
  ] loop
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('grant select, insert, update, delete on public.%I to service_role', t);
  end loop;
end $$;

grant select on public.news_posts to anon;

-- -----------------------------
-- Seed data
-- -----------------------------
insert into public.school_settings (key, value) values
  ('school_name',        'SMK Telekomunikasi Tunas Harapan'),
  ('school_tagline',     'Berprestasi Berbagi Kemitraan'),
  ('school_npsn',        '68345678'),
  ('school_address',     'Jl. Raya Telekomunikasi No. 1, Indonesia'),
  ('school_email',       'info@tth.sch.id'),
  ('school_phone',       '021-1234567'),
  ('principal_name',     'Drs. Sutarno, M.Pd'),
  ('academic_year',      '2026/2027'),
  ('current_semester',   'ganjil'),
  ('site_title',         'Portal Sekolah SMK TTH'),
  ('site_description',   'Portal informasi dan akademik SMK Telekomunikasi Tunas Harapan')
on conflict (key) do nothing;

insert into public.subjects (code, name, category, credits) values
  ('IND', 'Bahasa Indonesia',            'wajib',   2),
  ('MAT', 'Matematika',                  'wajib',   3),
  ('BIN', 'Bahasa Inggris',              'wajib',   2),
  ('IPA', 'IPAS',                        'wajib',   2),
  ('PAB', 'Pendidikan Agama dan Budi Pekerti', 'wajib', 2),
  ('PKn', 'Pendidikan Pancasila',        'wajib',   2),
  ('INF', 'Informatika',                 'wajib',   3),
  ('PPLG', 'Pemrograman Pretty Lane Art (PPLG)', 'jurusan', 6),
  ('TKJ',  'Teknik Komputer dan Jaringan', 'jurusan', 6),
  ('DKV',  'Desain Komunikasi Visual',    'jurusan', 6),
  ('BD',   'Bisnis Digital',              'jurusan', 4),
  ('MUL',  'Muatan Lokal',                'pilihan', 2)
on conflict (code) do nothing;

insert into public.classes (name, level, major, academic_year, capacity) values
  ('X-PPLG-1',  'X',  'PPLG', '2026/2027', 32),
  ('XII-PPLG-1', 'XII', 'PPLG', '2026/2027', 32),
  ('X-TKJ-1',   'X',  'TKJ',  '2026/2027', 32),
  ('XII-TKJ-1', 'XII', 'TKJ',  '2026/2027', 32),
  ('XI-DKV-1',  'XI',  'DKV',  '2026/2027', 30)
on conflict (name, academic_year) do nothing;

insert into public.news_posts (title, slug, excerpt, body, category, status, published_at)
values
  ('Jadwal Ujian Akhir Semester Gasal',
   'jadwal-ujian-akhir-semester-gasal',
   'Informasi jadwal UAS semester gasal 2026/2027 untuk seluruh jenjang.',
   'Diberitahukan kepada seluruh peserta didik bahwa Ujian Akhir Semester Gasal akan dimulai tanggal 30 November 2026. Enrollment dan pembagian soal dilakukan oleh wali kelas. Persiapkan diri dengan baik.',
   'Akademik', 'published', now() - interval '3 days'),
  ('Pendaftaran Ekstrakurikuler PPLG & Game Dev',
   'pendaftaran-ekstrakurikuler-pplg-game-dev',
   'Pendaftaran学员 ekstrakurikuler telah dibuka.',
   'Pendaftaran ekstrakurikuler PPLG dan Game Dev dibuka sampai akhir bulan. Datang langsung ke ruang 软件 pada jam istirahat. Kuota terbatas 40 peserta.',
   'Kesiswaan', 'published', now() - interval '5 days')
on conflict (slug) do nothing;

commit;
