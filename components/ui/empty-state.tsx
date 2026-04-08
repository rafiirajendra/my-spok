import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export function EmptyState({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon?: ReactNode;
}) {
  return (
    <Card
      className="flex min-h-56 flex-col items-center justify-center gap-4 text-center"
      tone="soft"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-primary">
        {icon ?? <span className="text-2xl">♪</span>}
      </div>
      <div className="space-y-2">
        <h3 className="font-heading text-xl font-semibold">{title}</h3>
        <p className="mx-auto max-w-md text-sm text-foreground/75 md:text-base">
          {description}
        </p>
      </div>
    </Card>
  );
}
