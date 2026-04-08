"use client";

import { useActionState } from "react";
import {
  updateTeacherProfileAction,
  type ProfileActionState,
} from "@/actions/profile";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import type { Profile } from "@/types/app";

const initialState: ProfileActionState = {
  message: "",
};

export function TeacherProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction] = useActionState(
    updateTeacherProfileAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-bold" htmlFor="full_name">
            Nama lengkap
          </label>
          <Input
            defaultValue={profile.full_name ?? ""}
            id="full_name"
            name="full_name"
            placeholder="Nama guru"
            required
          />
          {state?.errors?.full_name?.length ? (
            <p className="text-sm text-danger">{state.errors.full_name[0]}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold" htmlFor="email">
            Email
          </label>
          <Input
            defaultValue={profile.email}
            disabled
            id="email"
            name="email"
            type="email"
          />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-bold" htmlFor="role">
            Peran
          </label>
          <Input defaultValue={profile.role} disabled id="role" name="role" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold" htmlFor="new_password">
            Password baru
          </label>
          <Input
            id="new_password"
            name="new_password"
            placeholder="Kosongkan jika tidak ingin ganti password"
            type="password"
          />
          {state?.errors?.new_password?.length ? (
            <p className="text-sm text-danger">{state.errors.new_password[0]}</p>
          ) : (
            <p className="text-sm text-foreground/65">
              Isi hanya jika ingin mengganti password akun guru.
            </p>
          )}
        </div>
      </div>

      {state?.message ? (
        <p
          aria-live="polite"
          className="rounded-2xl bg-surface-soft px-4 py-3 text-sm text-foreground/80"
        >
          {state.message}
        </p>
      ) : null}

      <SubmitButton
        label="Simpan Profil"
        pendingLabel="Menyimpan profil..."
      />
    </form>
  );
}
