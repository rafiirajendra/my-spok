import { deleteExerciseAction } from "@/actions/admin";
import { ExerciseForm } from "@/components/admin/exercise-form";
import { Card } from "@/components/ui/card";
import { DeleteButton } from "@/components/ui/delete-button";
import { requireTeacherProfile } from "@/lib/auth";
import { getExerciseItems, getExercises, getLevels } from "@/lib/queries";

export default async function ExercisesPage() {
  await requireTeacherProfile();
  const [levels, exercises, items] = await Promise.all([
    getLevels(),
    getExercises(),
    getExerciseItems(),
  ]);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <Card>
        <h2 className="font-heading text-3xl font-semibold">Buat latihan baru</h2>
        <div className="mt-6">
          <ExerciseForm levels={levels} />
        </div>
      </Card>

      <div className="space-y-4">
        {exercises.map((exercise) => {
          const questionCount = items.filter((item) => item.exercise_id === exercise.id).length;
          const level = levels.find((entry) => entry.id === exercise.level_id);

          return (
            <Card key={exercise.id} tone="soft">
              <p className="text-sm font-bold text-primary-strong">{level?.name ?? "Level"}</p>
              <h3 className="mt-2 font-heading text-2xl font-semibold">{exercise.title}</h3>
              <p className="mt-3 text-sm leading-7 text-foreground/75">
                {exercise.instruction ?? "Susun kata sesuai urutan yang benar."}
              </p>
              <p className="mt-4 rounded-full bg-white px-4 py-2 text-sm font-bold text-foreground w-fit">
                {questionCount} soal
              </p>

              <form action={deleteExerciseAction} className="mt-5">
                <input name="id" type="hidden" value={exercise.id} />
                <DeleteButton>Hapus Latihan</DeleteButton>
              </form>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
