# Spok Belajar

Aplikasi web edukasi interaktif untuk membantu siswa tunarungu belajar menyusun kalimat sederhana. Project ini memakai Next.js 16 App Router, TypeScript strict, Tailwind CSS v4, Supabase Auth/Database/Storage, dan `dnd-kit`.

## Fitur utama

- Landing page ceria dengan alur masuk siswa dan guru
- Input identitas siswa tanpa akun
- Latihan menyusun kalimat dengan drag and drop + mode klik
- Preview GIF bahasa isyarat per kata
- Penyimpanan hasil latihan siswa ke database
- Login guru/admin dengan Supabase Auth
- Dashboard admin untuk kategori, level, kata, latihan, dan hasil belajar
- SQL schema dan RLS dasar untuk Supabase

## Struktur folder

```text
app/
  admin/
  api/
  login/
  student/
actions/
components/
  admin/
  forms/
  layout/
  student/
  ui/
hooks/
lib/
  supabase/
supabase/
types/
```

## Environment variables

Salin `.env.example` menjadi `.env.local`, lalu isi:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Catatan:

- Repo ini tetap bisa menampilkan UI demo dasar walau env belum diisi.
- Fitur auth, penyimpanan hasil, CRUD nyata, dan upload storage membutuhkan env Supabase yang valid.

## Setup Supabase

1. Buat project baru di Supabase.
2. Jalankan isi [schema.sql](/d:/Coolyeah-Mengoding/my-spok/supabase/schema.sql).
3. Jalankan isi [rls.sql](/d:/Coolyeah-Mengoding/my-spok/supabase/rls.sql).
4. Jalankan [seed.sql](/d:/Coolyeah-Mengoding/my-spok/supabase/seed.sql) jika ingin data contoh awal.
5. Pastikan bucket `sign-language-gifs` tersedia.
6. Buat user guru/admin lewat Supabase Auth.
7. Saat user dibuat, trigger akan otomatis membuat data `profiles`.

## Menjalankan lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Deploy gratis dengan Vercel + Supabase

1. Push project ke GitHub.
2. Import repo ke Vercel.
3. Tambahkan env `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Deploy.
5. Pastikan project Supabase production sudah berisi schema, policy, dan bucket storage.

## Catatan implementasi

- Proteksi route admin dibantu `proxy.ts` dan guard server di halaman/action.
- Upload GIF dilakukan melalui server action dan disimpan ke Supabase Storage.
- Halaman latihan memakai `dnd-kit` dan tetap menyediakan tombol klik agar lebih aksesibel.
- Hasil belajar disimpan lewat Route Handler di `app/api/student/attempts/route.ts`.
