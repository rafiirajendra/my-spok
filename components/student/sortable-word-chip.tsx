"use client";

import type { DraggableAttributes, DraggableSyntheticListeners } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Hand, Info, Plus, Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ExerciseWordOption } from "@/types/app";

function WordChipFrame({
  word,
  inAnswer,
  onPreview,
  onAction,
  dragging,
  listeners,
  attributes,
}: {
  word: ExerciseWordOption;
  inAnswer?: boolean;
  onPreview?: (word: ExerciseWordOption) => void;
  onAction?: (word: ExerciseWordOption) => void;
  dragging?: boolean;
  listeners?: DraggableSyntheticListeners;
  attributes?: DraggableAttributes;
}) {
  return (
    <div
      className={cn(
        "rounded-[24px] border border-white/70 bg-white p-3 card-shadow transition select-none",
        dragging
          ? "scale-[0.98] opacity-50 shadow-[0_10px_24px_rgba(93,75,132,0.10)]"
          : "hover:-translate-y-0.5",
      )}
    >
      <div className="flex items-center gap-3">
        <button
          className="flex flex-1 items-center gap-3 rounded-2xl bg-surface-muted px-3 py-3 text-left font-bold text-foreground transition hover:bg-surface-soft"
          onClick={() => onPreview?.(word)}
          type="button"
        >
          <span
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-primary-strong",
              dragging ? "cursor-grabbing" : "cursor-grab active:cursor-grabbing",
            )}
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
          onClick={() => onAction?.(word)}
          type="button"
        >
          {inAnswer ? <Undo2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

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
      className="touch-none"
    >
      <WordChipFrame
        attributes={attributes}
        dragging={isDragging}
        inAnswer={inAnswer}
        listeners={listeners}
        onAction={onAction}
        onPreview={onPreview}
        word={word}
      />
    </div>
  );
}

export function DragWordChipPreview({
  word,
  inAnswer,
}: {
  word: ExerciseWordOption;
  inAnswer?: boolean;
}) {
  return (
    <div className="w-[280px] max-w-[80vw] rotate-1 scale-[1.02] opacity-90">
      <WordChipFrame dragging inAnswer={inAnswer} word={word} />
    </div>
  );
}
