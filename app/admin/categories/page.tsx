import { createCategoryAction, deleteCategoryAction, updateCategoryAction } from "@/actions/admin";
import { DeleteButton } from "@/components/ui/delete-button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { requireTeacherProfile } from "@/lib/auth";
import { getCategories } from "@/lib/queries";

export default async function CategoriesPage() {
  await requireTeacherProfile();
  const categories = await getCategories();

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <h2 className="font-heading text-3xl font-semibold">Tambah kategori</h2>
        <form action={createCategoryAction} className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold" htmlFor="category-name">
              Nama kategori
            </label>
            <Input id="category-name" name="name" placeholder="Aktivitas Harian" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold" htmlFor="category-description">
              Deskripsi
            </label>
            <Textarea
              id="category-description"
              name="description"
              placeholder="Kalimat sederhana tentang kegiatan sehari-hari."
            />
          </div>
          <SubmitButton label="Simpan Kategori" />
        </form>
      </Card>

      <div className="space-y-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <form action={updateCategoryAction} className="grid gap-4">
              <input name="id" type="hidden" value={category.id} />
              <div className="space-y-2">
                <label className="text-sm font-bold">Nama kategori</label>
                <Input defaultValue={category.name} name="name" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Deskripsi</label>
                <Textarea defaultValue={category.description ?? ""} name="description" />
              </div>
              <div className="flex flex-wrap gap-3">
                <SubmitButton label="Update" variant="secondary" />
              </div>
            </form>

            <form action={deleteCategoryAction} className="mt-3">
              <input name="id" type="hidden" value={category.id} />
              <DeleteButton>Hapus</DeleteButton>
            </form>
          </Card>
        ))}
      </div>
    </div>
  );
}
