/* eslint-disable @next/next/no-img-element */
import { createWordAction, deleteWordAction, updateWordAction } from "@/actions/admin";
import { Card } from "@/components/ui/card";
import { DeleteButton } from "@/components/ui/delete-button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { requireTeacherProfile } from "@/lib/auth";
import { getLevels, getWords } from "@/lib/queries";

export default async function WordsPage() {
  await requireTeacherProfile();
  const [levels, words] = await Promise.all([getLevels(), getWords()]);

  return (
    <div className="grid gap-6">
      <Card>
        <h2 className="font-heading text-3xl font-semibold">Tambah kata baru</h2>
        <form action={createWordAction} className="mt-6 grid gap-4 xl:grid-cols-4">
          <div className="space-y-2">
            <label className="text-sm font-bold">Level</label>
            <Select name="level_id" required>
              {levels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold">Kata</label>
            <Input name="word" placeholder="makan" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold">Upload GIF</label>
            <Input accept="image/gif" name="gif_file" type="file" />
          </div>
          <div className="self-end">
            <SubmitButton className="w-full" label="Simpan Kata" />
          </div>
        </form>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        {words.map((word) => (
          <Card key={word.id}>
            <form action={updateWordAction} className="grid gap-4">
              <input name="id" type="hidden" value={word.id} />
              <input name="current_gif_url" type="hidden" value={word.gif_url ?? ""} />
              <div className="grid gap-4 md:grid-cols-[120px_1fr]">
                <div className="overflow-hidden rounded-[24px] bg-surface-soft">
                  {word.gif_url ? (
                    <img alt={word.word} className="h-28 w-full object-cover" src={word.gif_url} />
                  ) : (
                    <div className="flex h-28 items-center justify-center text-3xl">🤟</div>
                  )}
                </div>

                <div className="grid gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Level</label>
                    <Select defaultValue={word.level_id} name="level_id" required>
                      {levels.map((level) => (
                        <option key={level.id} value={level.id}>
                          {level.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Kata</label>
                    <Input defaultValue={word.word} name="word" required />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">Ganti GIF</label>
                <Input accept="image/gif" name="gif_file" type="file" />
              </div>

              <div className="flex flex-wrap gap-3">
                <SubmitButton label="Update Kata" variant="secondary" />
              </div>
            </form>

            <form action={deleteWordAction} className="mt-3">
              <input name="id" type="hidden" value={word.id} />
              <DeleteButton>Hapus</DeleteButton>
            </form>
          </Card>
        ))}
      </div>
    </div>
  );
}
