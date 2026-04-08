"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Hand, Info, Plus, Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ExerciseWordOption } from "@/types/app";

export function SortableWordChip({
  word,
  inAnswer,
  onPreview,
  onAction,
}: {
  word: ExerciseWordOption;
  inAnswer?: boolean;
  onPreview: (word: ExerciseWordOption) => void;
  onAction: (word: ExerciseWordOption) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: word.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        "rounded-[24px] border border-white/70 bg-white p-3 card-shadow transition",
        isDragging && "scale-[1.02] opacity-80",
      )}
    >
      <div className="flex items-center gap-3">
        <button
          className="flex flex-1 items-center gap-3 rounded-2xl bg-surface-muted px-3 py-3 text-left font-bold text-foreground transition hover:bg-surface-soft"
          onClick={() => onPreview(word)}
          type="button"
        >
          <span
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-primary-strong"
            {...attributes}
            {...listeners}
          >
            <Hand className="h-4 w-4" />
          </span>
          <span className="line-clamp-1">{word.text}</span>
          <Info className="ml-auto h-4 w-4 text-primary-strong" />
        </button>

        <button
          className={cn(
            "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-bold text-white transition",
            inAnswer ? "bg-secondary" : "bg-primary",
          )}
          onClick={() => onAction(word)}
          type="button"
        >
          {inAnswer ? <Undo2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
