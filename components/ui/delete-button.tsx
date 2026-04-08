"use client";

import type { PropsWithChildren } from "react";

export function DeleteButton({
  children,
  message = "Apakah Anda yakin ingin menghapus data ini?",
}: PropsWithChildren<{ message?: string }>) {
  return (
    <button
      className="inline-flex h-10 items-center justify-center rounded-full bg-danger px-4 text-sm font-bold text-white transition hover:opacity-90"
      onClick={(event) => {
        if (!window.confirm(message)) {
          event.preventDefault();
        }
      }}
      type="submit"
    >
      {children}
    </button>
  );
}
