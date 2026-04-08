import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm outline-none ring-0 transition focus:border-primary focus:shadow-[0_0_0_6px_var(--ring)] md:text-base",
        className,
      )}
      {...props}
    />
  );
}
