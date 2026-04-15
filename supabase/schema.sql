create extension if not exists "pgcrypto";

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'user_role'
  ) then
    create type public.user_role as enum ('admin', 'teacher');
  end if;
end $$;

create table if not exists public.levels (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  order_number integer not null check (order_number > 0),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.words (
  id uuid primary key default gen_random_uuid(),
  level_id uuid not null references public.levels(id) on delete cascade,
  word text not null,
  gif_url text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  level_id uuid not null references public.levels(id) on delete cascade,
  title text not null,
  instruction text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.exercise_items (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  sentence_answer text not null,
  words_options jsonb not null default '[]'::jsonb,
  order_number integer not null check (order_number > 0),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.student_sessions (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  student_class text,
  level_id uuid not null references public.levels(id) on delete restrict,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  student_session_id uuid not null references public.student_sessions(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete restrict,
  score integer not null check (score >= 0 and score <= 100),
  total_questions integer not null check (total_questions > 0),
  correct_answers integer not null check (correct_answers >= 0),
  started_at timestamptz not null default timezone('utc', now()),
  finished_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.attempt_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.attempts(id) on delete cascade,
  exercise_item_id uuid not null references public.exercise_items(id) on delete restrict,
  student_answer text not null,
  is_correct boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role public.user_role not null default 'teacher',
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists words_level_id_idx on public.words(level_id);
create index if not exists exercises_level_id_idx on public.exercises(level_id);
create index if not exists exercise_items_exercise_id_idx on public.exercise_items(exercise_id);
create index if not exists student_sessions_level_id_idx on public.student_sessions(level_id);
create index if not exists attempts_student_session_id_idx on public.attempts(student_session_id);
create index if not exists attempts_exercise_id_idx on public.attempts(exercise_id);
create index if not exists attempt_answers_attempt_id_idx on public.attempt_answers(attempt_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  next_role public.user_role;
begin
  next_role :=
    case
      when coalesce(new.raw_user_meta_data ->> 'role', '') in ('admin', 'teacher')
        then (new.raw_user_meta_data ->> 'role')::public.user_role
      else 'teacher'::public.user_role
    end;

  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    next_role
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = excluded.full_name;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();

insert into storage.buckets (id, name, public)
values ('sign-language-gifs', 'sign-language-gifs', true)
on conflict (id) do nothing;
