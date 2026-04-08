import { createLevelAction, deleteLevelAction, updateLevelAction } from "@/actions/admin";
import { Card } from "@/components/ui/card";
import { DeleteButton } from "@/components/ui/delete-button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { requireTeacherProfile } from "@/lib/auth";
import { getCategories, getLevels } from "@/lib/queries";

export default async function LevelsPage() {
  await requireTeacherProfile();
  const [categories, levels] = await Promise.all([getCategories(), getLevels()]);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <Card>
        <h2 className="font-heading text-3xl font-semibold">Tambah level</h2>
        <form action={createLevelAction} className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold">Kategori</label>
            <Select name="category_id" required>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold">Nama level</label>
            <Input name="name" placeholder="Level 1" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold">Urutan</label>
            <Input defaultValue={1} min={1} name="order_number" required type="number" />
          </div>
          <SubmitButton label="Simpan Level" />
        </form>
      </Card>

      <div className="space-y-4">
        {levels.map((level) => (
          <Card key={level.id}>
            <form action={updateLevelAction} className="grid gap-4">
              <input name="id" type="hidden" value={level.id} />
              <div className="space-y-2">
                <label className="text-sm font-bold">Kategori</label>
                <Select defaultValue={level.category_id} name="category_id" required>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Nama level</label>
                <Input defaultValue={level.name} name="name" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Urutan</label>
                <Input defaultValue={level.order_number} min={1} name="order_number" required type="number" />
              </div>
              <SubmitButton label="Update" variant="secondary" />
            </form>

            <form action={deleteLevelAction} className="mt-3">
              <input name="id" type="hidden" value={level.id} />
              <DeleteButton>Hapus</DeleteButton>
            </form>
          </Card>
        ))}
      </div>
    </div>
  );
}
