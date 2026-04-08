"use client";

import { useActionState } from "react";
import { loginAction, type AuthActionState } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

const initialState: AuthActionState = {
  message: "",
};

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-bold" htmlFor="email">
          Email
        </label>
        <Input id="email" name="email" placeholder="guru@sekolah.id" required type="email" />
        {state?.errors?.email?.length ? (
          <p className="text-sm text-danger">{state.errors.email[0]}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold" htmlFor="password">
          Password
        </label>
        <Input id="password" name="password" placeholder="Minimal 6 karakter" required type="password" />
        {state?.errors?.password?.length ? (
          <p className="text-sm text-danger">{state.errors.password[0]}</p>
        ) : null}
      </div>

      {state?.message ? (
        <p aria-live="polite" className="rounded-2xl bg-peach/50 px-4 py-3 text-sm text-foreground/80">
          {state.message}
        </p>
      ) : null}

      <SubmitButton className="w-full" label="Masuk ke Dashboard" pendingLabel="Sedang masuk..." />
    </form>
  );
}
