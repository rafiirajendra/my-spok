import Link from "next/link";
import { Home, RotateCcw, Sparkles, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getAttemptResult } from "@/lib/queries";
import { scoreToLabel } from "@/lib/utils";

export default async function ResultPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = await params;
  const result = await getAttemptResult(attemptId);

  if (!result) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-5 py-10 md:px-8">
        <div className="w-full">
          <EmptyState
            description="Hasil latihan belum ditemukan. Coba ulangi latihan dari awal."
            title="Data hasil belum tersedia"
          />
        </div>
      </main>
    );
  }

  const weakWords = result.answers
    .filter((answer) => !answer.is_correct)
    .flatMap((answer) => answer.expected.split(" "));

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-5 py-8 md:px-8">
      <Card className="rounded-[36px] bg-linear-to-br from-white via-surface-muted to-sky/30">
        <Badge className="bg-white/80">Hasil latihan</Badge>
        <h1 className="mt-5 font-heading text-4xl font-semibold text-primary-strong">
          Kerja bagus, {result.session.student_name}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-8 text-foreground/75">
          Kamu sudah menyelesaikan latihan{" "}
          <strong>{result.exercise?.title ?? "menyusun kalimat"}</strong>.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-[28px] bg-white/85 p-5 card-shadow">
            <p className="text-sm font-bold text-primary-strong">Skor akhir</p>
            <p className="mt-2 font-heading text-5xl font-semibold">{result.attempt.score}</p>
            <p className="mt-2 text-sm text-foreground/70">
              {scoreToLabel(result.attempt.score)}
            </p>
          </div>
          <div className="rounded-[28px] bg-white/85 p-5 card-shadow">
            <p className="text-sm font-bold text-primary-strong">Jawaban benar</p>
            <p className="mt-2 font-heading text-5xl font-semibold">
              {result.attempt.correct_answers}
            </p>
            <p className="mt-2 text-sm text-foreground/70">
              dari {result.attempt.total_questions} soal
            </p>
          </div>
          <div className="rounded-[28px] bg-white/85 p-5 card-shadow">
            <p className="text-sm font-bold text-primary-strong">Level</p>
            <p className="mt-2 font-heading text-4xl font-semibold">
              {result.level?.name ?? "-"}
            </p>
            <p className="mt-2 text-sm text-foreground/70">
              {result.category?.name ?? "Kategori pilihan"}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary-strong">
              <Target className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-heading text-3xl font-semibold">Ringkasan hasil</h2>
              <p className="text-sm text-foreground/70">
                Lihat bagian yang sudah bagus dan yang perlu dilatih lagi.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {result.answers.map((answer) => (
              <div
                className={`rounded-[24px] px-4 py-4 ${
                  answer.is_correct ? "bg-success/15" : "bg-peach/55"
                }`}
                key={answer.id}
              >
                <p className="font-bold">
                  {answer.is_correct ? "Benar" : "Perlu latihan lagi"}
                </p>
                <p className="mt-2 text-sm text-foreground/75">
                  Jawabanmu: <strong>{answer.student_answer || "(kosong)"}</strong>
                </p>
                {!answer.is_correct ? (
                  <p className="mt-1 text-sm text-foreground/75">
                    Jawaban yang benar: <strong>{answer.expected}</strong>
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </Card>

        <Card tone="soft">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary-strong">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-heading text-3xl font-semibold">Kata yang perlu diulang</h2>
              <p className="text-sm text-foreground/70">
                Fokus latihan berikutnya bisa dimulai dari kata-kata ini.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {weakWords.length ? (
              weakWords.map((word, index) => (
                <span
                  className="rounded-full bg-white px-4 py-2 text-sm font-bold text-primary-strong"
                  key={`${word}-${index}`}
                >
                  {word}
                </span>
              ))
            ) : (
              <p className="text-sm text-foreground/75">
                Tidak ada kata yang tertinggal. Semua sudah bagus.
              </p>
            )}
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 font-bold text-white"
              href="/student"
            >
              <RotateCcw className="h-4 w-4" />
              Ulangi Latihan
            </Link>
            <Link
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 font-bold text-foreground card-shadow"
              href="/"
            >
              <Home className="h-4 w-4" />
              Kembali ke Beranda
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}
