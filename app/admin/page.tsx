import { BookOpenText, Shapes, Sparkles, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { requireTeacherProfile } from "@/lib/auth";
import { getDashboardStats, getResults } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

const iconMap = [Sparkles, Shapes, BookOpenText, Users];

export default async function AdminOverviewPage() {
  await requireTeacherProfile();
  const stats = await getDashboardStats();
  const results = await getResults();

  const cards = [
    { label: "Level", value: stats.levels },
    { label: "Kata", value: stats.words },
    { label: "Latihan", value: stats.exercises },
    { label: "Hasil terbaru", value: stats.recentAttempts },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {cards.map((item, index) => {
          const Icon = iconMap[index];

          return (
            <Card className="rounded-[28px]" key={item.label}>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary-strong">
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-5 text-sm font-bold text-foreground/75">{item.label}</p>
              <p className="mt-2 font-heading text-4xl font-semibold">{item.value}</p>
            </Card>
          );
        })}
      </div>

      <Card>
        <h2 className="font-heading text-3xl font-semibold">Hasil siswa terbaru</h2>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="text-sm text-foreground/60">
                <th className="pb-3 pr-4">Nama</th>
                <th className="pb-3 pr-4">Level</th>
                <th className="pb-3 pr-4">Skor</th>
                <th className="pb-3">Selesai</th>
              </tr>
            </thead>
            <tbody>
              {results.slice(0, 5).map((row) => (
                <tr className="border-t border-border/70 text-sm md:text-base" key={row.attempt_id}>
                  <td className="py-4 pr-4 font-bold">{row.student_name}</td>
                  <td className="py-4 pr-4">{row.level_name ?? "-"}</td>
                  <td className="py-4 pr-4">{row.score}</td>
                  <td className="py-4">{formatDate(row.finished_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
