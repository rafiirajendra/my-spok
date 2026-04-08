"use client";

import { useMemo, useState } from "react";
import { createStudentSessionAction } from "@/actions/student";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { type StudentCatalog } from "@/types/app";

export function StudentSessionForm({ catalog }: { catalog: StudentCatalog }) {
  const [categoryId, setCategoryId] = useState(catalog.categories[0]?.id ?? "");
  const levels = useMemo(
    () => catalog.levels.filter((level) => level.category_id === categoryId),
    [catalog.levels, categoryId],
  );

  return (
    <form action={createStudentSessionAction} className="grid gap-5">
      <div className="grid gap-2">
        <label className="text-sm font-bold" htmlFor="student_name">
          Nama siswa
        </label>
        <Input id="student_name" name="student_name" placeholder="Contoh: Maya" required />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-bold" htmlFor="student_class">
          Kelas / nomor absen
        </label>
        <Input id="student_class" name="student_class" placeholder="Contoh: 2A / 07" />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-bold" htmlFor="category_id">
          Pilih kategori
        </label>
        <Select
          id="category_id"
          name="category_id"
          onChange={(event) => setCategoryId(event.target.value)}
          required
          value={categoryId}
        >
          {catalog.categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-bold" htmlFor="level_id">
          Pilih level
        </label>
        <Select id="level_id" key={categoryId} name="level_id" required>
          {levels.map((level) => (
            <option key={level.id} value={level.id}>
              {level.name}
            </option>
          ))}
        </Select>
      </div>

      <Button className="w-full" size="lg" type="submit">
        Mulai Latihan
      </Button>
    </form>
  );
}
