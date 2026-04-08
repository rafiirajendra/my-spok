import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Select({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm outline-none transition focus:border-primary focus:shadow-[0_0_0_6px_var(--ring)] md:text-base",
        className,
      )}
      {...props}
    />
  );
}
