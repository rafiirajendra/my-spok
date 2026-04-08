import type { HTMLAttributes, PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

type CardProps = PropsWithChildren<
  HTMLAttributes<HTMLDivElement> & {
    tone?: "default" | "soft" | "highlight";
  }
>;

const toneClasses: Record<NonNullable<CardProps["tone"]>, string> = {
  default: "bg-surface",
  soft: "bg-surface-muted",
  highlight: "bg-linear-to-br from-white via-surface-soft to-sky/45",
};

export function Card({
  children,
  className,
  tone = "default",
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "card-shadow rounded-[28px] border border-white/60 p-6",
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
