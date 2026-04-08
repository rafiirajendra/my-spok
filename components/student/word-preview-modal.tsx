/* eslint-disable @next/next/no-img-element */
"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ExerciseWordOption } from "@/types/app";

export function WordPreviewModal({
  word,
  onClose,
}: {
  word: ExerciseWordOption | null;
  onClose: () => void;
}) {
  if (!word) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/25 px-4 backdrop-blur-sm">
      <div className="animate-pop-in w-full max-w-lg rounded-[32px] bg-white p-6 card-shadow">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-primary-strong">Preview bahasa isyarat</p>
            <h3 className="mt-1 font-heading text-3xl font-semibold">{word.text}</h3>
          </div>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface-soft text-foreground"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-hidden rounded-[28px] bg-linear-to-br from-surface-muted to-sky/45 p-4">
          {word.gifUrl ? (
            <img
              alt={`GIF bahasa isyarat untuk kata ${word.text}`}
              className="h-80 w-full rounded-[24px] object-cover"
              src={word.gifUrl}
            />
          ) : (
            <div className="flex h-80 items-center justify-center rounded-[24px] bg-white text-center">
              <div className="space-y-3">
                <p className="text-5xl">🤟</p>
                <p className="font-bold text-primary-strong">GIF belum tersedia</p>
                <p className="max-w-xs text-sm text-foreground/70">
                  Guru bisa menambahkan GIF bahasa isyarat dari dashboard kata.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-5 flex justify-end">
          <Button onClick={onClose} variant="secondary">
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}
