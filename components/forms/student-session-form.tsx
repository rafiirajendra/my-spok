"use client";

import { useActionState } from "react";
import { createStudentSessionAction } from "@/actions/student";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { type StudentCatalog } from "@/types/app";

const initialStudentSessionState = {
  errorMessage: null,
};

export function StudentSessionForm({ catalog }: { catalog: StudentCatalog }) {
  const [state, formAction] = useActionState(
    createStudentSessionAction,
    initialStudentSessionState,
  );

  return (
    <form action={formAction} className="grid gap-5">
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
        <label className="text-sm font-bold" htmlFor="level_id">
          Pilih level
        </label>
        <Select id="level_id" name="level_id" required>
          {catalog.levels.map((level) => (
            <option key={level.id} value={level.id}>
              {level.name}
            </option>
          ))}
        </Select>
      </div>

      {state.errorMessage ? (
        <div className="rounded-[24px] bg-danger/12 px-4 py-4 text-sm text-danger">
          {state.errorMessage}
        </div>
      ) : null}

      <SubmitButton className="w-full" label="Mulai Latihan" pendingLabel="Menyiapkan..." />
    </form>
  );
}
