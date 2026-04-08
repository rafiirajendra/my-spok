"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { createExerciseAction } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import type { Level } from "@/types/app";

type DraftItem = {
  id: string;
  sentenceAnswer: string;
  wordsOptions: string;
  orderNumber: number;
};

const initialItems: DraftItem[] = [
  {
    id: crypto.randomUUID(),
    sentenceAnswer: "",
    wordsOptions: "",
    orderNumber: 1,
  },
];

export function ExerciseForm({ levels }: { levels: Level[] }) {
  const [items, setItems] = useState<DraftItem[]>(initialItems);

  return (
    <form action={createExerciseAction} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-bold" htmlFor="exercise-title">
            Judul latihan
          </label>
          <Input id="exercise-title" name="title" placeholder="Susun kalimat makanan" required />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold" htmlFor="exercise-level">
            Level
          </label>
          <Select id="exercise-level" name="level_id" required>
            {levels.map((level) => (
              <option key={level.id} value={level.id}>
                {level.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold" htmlFor="exercise-instruction">
          Instruksi singkat
        </label>
        <Textarea
          id="exercise-instruction"
          name="instruction"
          placeholder="Susun kata menjadi kalimat yang benar."
        />
      </div>

      <div className="space-y-4 rounded-[24px] bg-surface-soft p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-heading text-2xl font-semibold">Daftar soal</h3>
            <p className="text-sm text-foreground/70">
              Isi kalimat jawaban dan pilihan kata dipisah dengan koma.
            </p>
          </div>
          <Button
            className="gap-2"
            onClick={() =>
              setItems((current) => [
                ...current,
                {
                  id: crypto.randomUUID(),
                  sentenceAnswer: "",
                  wordsOptions: "",
                  orderNumber: current.length + 1,
                },
              ])
            }
            type="button"
            variant="secondary"
          >
            <Plus className="h-4 w-4" />
            Tambah Soal
          </Button>
        </div>

        {items.map((item, index) => (
          <div className="rounded-[24px] bg-white p-4 card-shadow" key={item.id}>
            <div className="mb-4 flex items-center justify-between">
              <p className="font-bold text-primary-strong">Soal {index + 1}</p>
              {items.length > 1 ? (
                <button
                  className="rounded-full bg-danger/12 p-2 text-danger"
                  onClick={() =>
                    setItems((current) => current.filter((entry) => entry.id !== item.id))
                  }
                  type="button"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              ) : null}
            </div>

            <div className="grid gap-4">
              <input name="order_number" type="hidden" value={item.orderNumber} />
              <div className="space-y-2">
                <label className="text-sm font-bold">Kalimat jawaban benar</label>
                <Input
                  name="sentence_answer"
                  onChange={(event) =>
                    setItems((current) =>
                      current.map((entry) =>
                        entry.id === item.id
                          ? { ...entry, sentenceAnswer: event.target.value }
                          : entry,
                      ),
                    )
                  }
                  placeholder="Contoh: Saya makan nasi"
                  required
                  value={item.sentenceAnswer}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">Pilihan kata</label>
                <Input
                  name="words_options"
                  onChange={(event) =>
                    setItems((current) =>
                      current.map((entry) =>
                        entry.id === item.id
                          ? { ...entry, wordsOptions: event.target.value }
                          : entry,
                      ),
                    )
                  }
                  placeholder="Contoh: makan, Saya, nasi"
                  required
                  value={item.wordsOptions}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <SubmitButton label="Simpan Latihan" pendingLabel="Menyimpan latihan..." />
    </form>
  );
}
