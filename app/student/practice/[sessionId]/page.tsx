import Link from "next/link";
import { ArrowLeft, PartyPopper } from "lucide-react";
import { ExercisePlayer } from "@/components/student/exercise-player";
import { Card } from "@/components/ui/card";
import { getPracticePayload } from "@/lib/queries";

export default async function PracticePage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const payload = await getPracticePayload(sessionId);

  if (!payload || !payload.exercise) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-5 py-10 md:px-8">
        <Card className="w-full rounded-[36px] text-center">
          <PartyPopper className="mx-auto h-14 w-14 text-primary-strong" />
          <h1 className="mt-4 font-heading text-3xl font-semibold">
            Latihan belum tersedia
          </h1>
          <p className="mt-3 text-sm leading-7 text-foreground/75 md:text-base">
            Guru belum menambahkan soal untuk level ini. Silakan kembali dan pilih level lain.
          </p>
          <div className="mt-6">
            <Link
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-bold text-white"
              href="/student"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Link>
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-5 py-8 md:px-8">
      <div className="flex items-center gap-3">
        <Link
          className="inline-flex h-12 items-center justify-center rounded-full bg-white px-5 font-bold text-foreground card-shadow"
          href="/student"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Link>
        <div className="rounded-full bg-white px-4 py-3 text-sm font-bold text-primary-strong card-shadow">
          {payload.level?.name ?? "Level"}
        </div>
      </div>

      <ExercisePlayer
        exerciseId={payload.exercise.id}
        instruction={payload.exercise.instruction ?? "Susun kata menjadi kalimat yang benar."}
        items={payload.items}
        session={payload.session}
        title={payload.exercise.title}
      />
    </main>
  );
}
