import { LockKeyhole, Sparkles } from "lucide-react";
import { LoginForm } from "@/components/forms/login-form";
import { SiteHeader } from "@/components/layout/site-header";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-6xl items-center gap-8 px-5 py-10 md:px-8 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="rounded-[36px] bg-linear-to-br from-white via-surface-muted to-sky/35">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-[24px] bg-primary/15 text-primary-strong">
            <LockKeyhole className="h-7 w-7" />
          </div>
          <h1 className="mt-6 font-heading text-4xl font-semibold text-primary-strong">
            Login guru dan admin
          </h1>
          <p className="mt-4 max-w-xl text-base leading-8 text-foreground/75">
            Masuk untuk mengelola level, kata, GIF bahasa isyarat, dan memantau
            hasil belajar siswa.
          </p>
          <div className="mt-8 rounded-[28px] bg-white/75 p-5">
            <p className="flex items-center gap-2 text-sm font-bold text-primary-strong">
              <Sparkles className="h-4 w-4" />
              Tema tetap lembut dan mudah dibaca
            </p>
            <p className="mt-3 text-sm leading-7 text-foreground/70">
              Halaman admin menggunakan layout pastel yang konsisten agar nyaman
              dipakai guru setiap hari.
            </p>
          </div>
        </Card>

        <Card className="rounded-[36px]">
          <h2 className="font-heading text-3xl font-semibold">Masuk ke dashboard</h2>
          <p className="mt-3 text-sm leading-7 text-foreground/75 md:text-base">
            Gunakan akun Supabase Auth dengan peran <strong>teacher</strong> atau{" "}
            <strong>admin</strong>.
          </p>
          <div className="mt-8">
            <LoginForm />
          </div>
        </Card>
      </main>
    </div>
  );
}
