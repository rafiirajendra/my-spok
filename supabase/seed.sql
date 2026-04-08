insert into public.categories (id, name, description)
values
  (
    '11111111-1111-1111-1111-111111111111',
    'Aktivitas Harian',
    'Kalimat sederhana tentang kegiatan sehari-hari.'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Sekolah',
    'Kosakata ringan seputar kegiatan belajar di sekolah.'
  )
on conflict (id) do nothing;

insert into public.levels (id, category_id, name, order_number)
values
  (
    '33333333-3333-3333-3333-333333333331',
    '11111111-1111-1111-1111-111111111111',
    'Level 1',
    1
  ),
  (
    '33333333-3333-3333-3333-333333333332',
    '22222222-2222-2222-2222-222222222222',
    'Level 1',
    1
  )
on conflict (id) do nothing;

insert into public.words (id, level_id, word, gif_url)
values
  (
    '44444444-4444-4444-4444-444444444441',
    '33333333-3333-3333-3333-333333333331',
    'Saya',
    null
  ),
  (
    '44444444-4444-4444-4444-444444444442',
    '33333333-3333-3333-3333-333333333331',
    'makan',
    null
  ),
  (
    '44444444-4444-4444-4444-444444444443',
    '33333333-3333-3333-3333-333333333331',
    'nasi',
    null
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    '33333333-3333-3333-3333-333333333331',
    'Ibu',
    null
  ),
  (
    '44444444-4444-4444-4444-444444444445',
    '33333333-3333-3333-3333-333333333331',
    'memasak',
    null
  ),
  (
    '44444444-4444-4444-4444-444444444446',
    '33333333-3333-3333-3333-333333333331',
    'sup',
    null
  )
on conflict (id) do nothing;

insert into public.exercises (id, level_id, title, instruction)
values
  (
    '55555555-5555-5555-5555-555555555551',
    '33333333-3333-3333-3333-333333333331',
    'Susun Kalimat Mudah',
    'Seret atau klik kata sesuai urutan yang benar.'
  )
on conflict (id) do nothing;

insert into public.exercise_items (id, exercise_id, sentence_answer, words_options, order_number)
values
  (
    '66666666-6666-6666-6666-666666666661',
    '55555555-5555-5555-5555-555555555551',
    'Saya makan nasi',
    '[
      {"id":"opt-1","text":"makan"},
      {"id":"opt-2","text":"Saya"},
      {"id":"opt-3","text":"nasi"}
    ]'::jsonb,
    1
  ),
  (
    '66666666-6666-6666-6666-666666666662',
    '55555555-5555-5555-5555-555555555551',
    'Ibu memasak sup',
    '[
      {"id":"opt-4","text":"sup"},
      {"id":"opt-5","text":"Ibu"},
      {"id":"opt-6","text":"memasak"}
    ]'::jsonb,
    2
  )
on conflict (id) do nothing;
