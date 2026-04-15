create or replace function public.is_teacher()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin', 'teacher')
  );
$$;

alter table public.levels enable row level security;
alter table public.words enable row level security;
alter table public.exercises enable row level security;
alter table public.exercise_items enable row level security;
alter table public.student_sessions enable row level security;
alter table public.attempts enable row level security;
alter table public.attempt_answers enable row level security;
alter table public.profiles enable row level security;

drop policy if exists "public read levels" on public.levels;
create policy "public read levels"
on public.levels
for select
to anon, authenticated
using (true);

drop policy if exists "teacher manage levels" on public.levels;
create policy "teacher manage levels"
on public.levels
for all
to authenticated
using (public.is_teacher())
with check (public.is_teacher());

drop policy if exists "public read words" on public.words;
create policy "public read words"
on public.words
for select
to anon, authenticated
using (true);

drop policy if exists "teacher manage words" on public.words;
create policy "teacher manage words"
on public.words
for all
to authenticated
using (public.is_teacher())
with check (public.is_teacher());

drop policy if exists "public read exercises" on public.exercises;
create policy "public read exercises"
on public.exercises
for select
to anon, authenticated
using (true);

drop policy if exists "teacher manage exercises" on public.exercises;
create policy "teacher manage exercises"
on public.exercises
for all
to authenticated
using (public.is_teacher())
with check (public.is_teacher());

drop policy if exists "public read exercise items" on public.exercise_items;
create policy "public read exercise items"
on public.exercise_items
for select
to anon, authenticated
using (true);

drop policy if exists "teacher manage exercise items" on public.exercise_items;
create policy "teacher manage exercise items"
on public.exercise_items
for all
to authenticated
using (public.is_teacher())
with check (public.is_teacher());

drop policy if exists "students insert student sessions" on public.student_sessions;
create policy "students insert student sessions"
on public.student_sessions
for insert
to anon, authenticated
with check (true);

drop policy if exists "teacher read student sessions" on public.student_sessions;
create policy "teacher read student sessions"
on public.student_sessions
for select
to authenticated
using (public.is_teacher());

drop policy if exists "public read student sessions" on public.student_sessions;
create policy "public read student sessions"
on public.student_sessions
for select
to anon, authenticated
using (true);

drop policy if exists "students insert attempts" on public.attempts;
create policy "students insert attempts"
on public.attempts
for insert
to anon, authenticated
with check (true);

drop policy if exists "teacher read attempts" on public.attempts;
create policy "teacher read attempts"
on public.attempts
for select
to authenticated
using (public.is_teacher());

drop policy if exists "public read attempts" on public.attempts;
create policy "public read attempts"
on public.attempts
for select
to anon, authenticated
using (true);

drop policy if exists "students insert attempt answers" on public.attempt_answers;
create policy "students insert attempt answers"
on public.attempt_answers
for insert
to anon, authenticated
with check (true);

drop policy if exists "teacher read attempt answers" on public.attempt_answers;
create policy "teacher read attempt answers"
on public.attempt_answers
for select
to authenticated
using (public.is_teacher());

drop policy if exists "public read attempt answers" on public.attempt_answers;
create policy "public read attempt answers"
on public.attempt_answers
for select
to anon, authenticated
using (true);

drop policy if exists "users read own profile" on public.profiles;
create policy "users read own profile"
on public.profiles
for select
to authenticated
using (id = auth.uid());

drop policy if exists "teacher read all profiles" on public.profiles;
create policy "teacher read all profiles"
on public.profiles
for select
to authenticated
using (public.is_teacher());

drop policy if exists "users update own profile" on public.profiles;
create policy "users update own profile"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "public read sign gifs" on storage.objects;
create policy "public read sign gifs"
on storage.objects
for select
to public
using (bucket_id = 'sign-language-gifs');

drop policy if exists "teacher upload sign gifs" on storage.objects;
create policy "teacher upload sign gifs"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'sign-language-gifs'
  and public.is_teacher()
);

drop policy if exists "teacher update sign gifs" on storage.objects;
create policy "teacher update sign gifs"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'sign-language-gifs'
  and public.is_teacher()
)
with check (
  bucket_id = 'sign-language-gifs'
  and public.is_teacher()
);

drop policy if exists "teacher delete sign gifs" on storage.objects;
create policy "teacher delete sign gifs"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'sign-language-gifs'
  and public.is_teacher()
);
