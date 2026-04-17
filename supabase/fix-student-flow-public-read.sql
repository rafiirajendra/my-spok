alter table public.student_sessions enable row level security;
alter table public.attempts enable row level security;
alter table public.attempt_answers enable row level security;

drop policy if exists "public read student sessions" on public.student_sessions;
create policy "public read student sessions"
on public.student_sessions
for select
to anon, authenticated
using (true);

drop policy if exists "public read attempts" on public.attempts;
create policy "public read attempts"
on public.attempts
for select
to anon, authenticated
using (true);

drop policy if exists "public read attempt answers" on public.attempt_answers;
create policy "public read attempt answers"
on public.attempt_answers
for select
to anon, authenticated
using (true);
