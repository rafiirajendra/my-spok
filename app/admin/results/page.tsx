import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { requireTeacherProfile } from "@/lib/auth";
import { getLevels, getResults } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    levelId?: string;
  }>;
}) {
  await requireTeacherProfile();
  const filters = await searchParams;
  const [levels, results] = await Promise.all([getLevels(), getResults(filters)]);

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-3xl font-semibold">Hasil belajar siswa</h2>
          <p className="mt-2 text-sm text-foreground/70">
            Gunakan pencarian dan filter sederhana untuk memantau progres siswa.
          </p>
        </div>
      </div>

      <form className="mt-6 grid gap-4 rounded-[28px] bg-surface-soft p-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-bold">Cari nama / kelas</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/50" />
            <Input className="pl-11" defaultValue={filters.q ?? ""} name="q" placeholder="Maya, 2A, 07..." />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold">Level</label>
          <Select defaultValue={filters.levelId ?? ""} name="levelId">
            <option value="">Semua level</option>
            {levels.map((level) => (
              <option key={level.id} value={level.id}>
                {level.name}
              </option>
            ))}
          </Select>
        </div>
      </form>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="text-sm text-foreground/60">
              <th className="pb-3 pr-4">Nama siswa</th>
              <th className="pb-3 pr-4">Kelas / absen</th>
              <th className="pb-3 pr-4">Level</th>
              <th className="pb-3 pr-4">Skor</th>
              <th className="pb-3">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {results.map((row) => (
              <tr className="border-t border-border/70 text-sm md:text-base" key={row.attempt_id}>
                <td className="py-4 pr-4 font-bold">{row.student_name}</td>
                <td className="py-4 pr-4">{row.student_class ?? "-"}</td>
                <td className="py-4 pr-4">{row.level_name ?? "-"}</td>
                <td className="py-4 pr-4">
                  {row.score} ({row.correct_answers}/{row.total_questions})
                </td>
                <td className="py-4">{formatDate(row.finished_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
