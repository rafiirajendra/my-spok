"use client";

import { useState, useTransition } from "react";
import {
  closestCorners,
  DndContext,
  DragOverlay,
  PointerActivationConstraint,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useRouter } from "next/navigation";
import { CheckCircle2, RotateCcw, Trophy } from "lucide-react";
import { useExercisePlayer } from "@/hooks/use-exercise-player";
import { scoreToLabel } from "@/lib/utils";
import type { ExerciseItem, StudentSession } from "@/types/app";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DragWordChipPreview,
  SortableWordChip,
} from "@/components/student/sortable-word-chip";
import { WordPreviewModal } from "@/components/student/word-preview-modal";

function DroppableArea({
  id,
  children,
  className,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`${className ?? ""} ${isOver ? "ring-4 ring-primary/20" : ""}`}
      id={id}
    >
      {children}
    </div>
  );
}

type ExercisePlayerProps = {
  session: StudentSession;
  exerciseId: string;
  title: string;
  instruction: string;
  items: ExerciseItem[];
};

export function ExercisePlayer({
  session,
  exerciseId,
  title,
  instruction,
  items,
}: ExercisePlayerProps) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [activeWordId, setActiveWordId] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();
  const {
    currentIndex,
    currentItem,
    progress,
    bankWords,
    answerWords,
    feedback,
    drafts,
    previewWord,
    isLastQuestion,
    setPreviewWord,
    addWordToAnswer,
    removeWordFromAnswer,
    moveBetweenContainers,
    reorderInContainer,
    checkAnswer,
    goToNextQuestion,
    resetCurrent,
  } = useExercisePlayer(items);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      } satisfies PointerActivationConstraint,
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  if (!currentItem) {
    return (
      <Card className="text-center">
        <p className="font-heading text-2xl font-semibold">Belum ada soal di level ini.</p>
      </Card>
    );
  }

  const activeDraggedWord =
    [...bankWords, ...answerWords].find((word) => word.id === activeWordId) ?? null;
  const activeDraggedWordInAnswer = Boolean(
    activeDraggedWord && answerWords.some((word) => word.id === activeDraggedWord.id),
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveWordId(String(event.active.id));
  }

  function handleDragCancel() {
    setActiveWordId(null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) {
      setActiveWordId(null);
      return;
    }

    if (active.id === over.id) {
      setActiveWordId(null);
      return;
    }

    const activeInAnswer = answerWords.some((word) => word.id === active.id);
    const overInAnswer =
      over.id === "answer" || answerWords.some((word) => word.id === over.id);
    const activeInBank = bankWords.some((word) => word.id === active.id);
    const overInBank = over.id === "bank" || bankWords.some((word) => word.id === over.id);

    if ((activeInAnswer && overInAnswer) || (activeInBank && overInBank)) {
      reorderInContainer(String(active.id), String(over.id));
      setActiveWordId(null);
      return;
    }

    moveBetweenContainers(String(active.id), String(over.id));
    setActiveWordId(null);
  }

  async function finishExercise() {
    startSaving(async () => {
      const response = await fetch("/api/student/attempts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_session_id: session.id,
          exercise_id: exerciseId,
          answers: drafts,
        }),
      });

      if (!response.ok) {
        setErrorMessage("Skor belum berhasil disimpan. Coba lagi sebentar ya.");
        return;
      }

      const data = (await response.json()) as { attemptId: string };
      router.push(`/student/results/${data.attemptId}`);
    });
  }

  const score = items.length
    ? Math.round((drafts.filter((draft) => draft.is_correct).length / items.length) * 100)
    : 0;

  return (
    <>
      <DndContext
        collisionDetection={closestCorners}
        onDragCancel={handleDragCancel}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        sensors={sensors}
      >
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <Card className="overflow-hidden" tone="highlight">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-primary-strong">Halo, {session.student_name}</p>
                <h2 className="mt-2 font-heading text-3xl font-semibold">{title}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-foreground/75 md:text-base">
                  {instruction}
                </p>
              </div>
              <div className="rounded-[24px] bg-white px-5 py-4 text-center card-shadow">
                <p className="text-sm font-bold text-primary-strong">Soal</p>
                <p className="font-heading text-3xl font-semibold">
                  {currentIndex + 1}/{items.length}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-sm font-bold">
                <span>Progres latihan</span>
                <span>{progress}%</span>
              </div>
              <div className="h-4 overflow-hidden rounded-full bg-white/80">
                <div
                  className="h-full rounded-full bg-linear-to-r from-primary to-secondary transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary-strong">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold">Kalimat target</p>
                <p className="text-sm text-foreground/70">
                  Susun kata agar menjadi kalimat yang benar.
                </p>
              </div>
            </div>

            <div className="mt-5 min-h-36 rounded-[28px] border border-dashed border-primary/35 bg-surface-soft p-4">
              <DroppableArea className="grid gap-3" id="answer">
                <SortableContext
                  items={answerWords.map((word) => word.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="grid gap-3">
                    {answerWords.length ? (
                      answerWords.map((word) => (
                        <SortableWordChip
                          inAnswer
                          key={word.id}
                          onAction={removeWordFromAnswer}
                          onPreview={setPreviewWord}
                          word={word}
                        />
                      ))
                    ) : (
                        <div className="flex min-h-28 items-center justify-center rounded-[24px] border border-dashed border-primary/25 bg-white text-center text-sm text-foreground/60">
                          Taruh kata di sini dengan drag and drop atau tombol plus.
                        </div>
                    )}
                  </div>
                </SortableContext>
              </DroppableArea>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button className="gap-2" onClick={() => checkAnswer()}>
                <CheckCircle2 className="h-4 w-4" />
                Cek Jawaban
              </Button>
              <Button className="gap-2" onClick={resetCurrent} variant="secondary">
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
              <Button
                onClick={() => {
                  const done = goToNextQuestion();
                  if (done) {
                    void finishExercise();
                  }
                }}
                variant="ghost"
              >
                {isLastQuestion ? "Selesai" : "Soal Berikutnya"}
              </Button>
            </div>

            {feedback ? (
              <div
                className={`mt-5 rounded-[24px] px-4 py-4 text-sm font-bold ${
                  feedback === "correct"
                    ? "bg-success/20 text-success"
                    : "bg-peach/70 text-primary-strong"
                }`}
              >
                {feedback === "correct"
                  ? "Jawabanmu benar. Hebat."
                  : `Masih belum tepat. Coba cek lagi urutannya: ${currentItem.sentence_answer}`}
              </div>
            ) : null}

            {errorMessage ? (
              <div className="mt-4 rounded-[24px] bg-danger/12 px-4 py-4 text-sm text-danger">
                {errorMessage}
              </div>
            ) : null}
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-heading text-2xl font-semibold">Bank kata</h3>
                <p className="text-sm text-foreground/70">
                  Klik tombol plus untuk menambahkan kata, atau seret kartu ke area jawaban.
                </p>
              </div>
              <div className="rounded-full bg-primary/15 px-4 py-2 text-sm font-bold text-primary-strong">
                {bankWords.length} kata
              </div>
            </div>

            <DroppableArea className="grid gap-3" id="bank">
              <SortableContext
                items={bankWords.map((word) => word.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid gap-3">
                  {bankWords.map((word) => (
                    <SortableWordChip
                      key={word.id}
                      onAction={addWordToAnswer}
                      onPreview={setPreviewWord}
                      word={word}
                    />
                  ))}
                </div>
              </SortableContext>
            </DroppableArea>
          </Card>

          <Card tone="soft">
            <h3 className="font-heading text-2xl font-semibold">Ringkasan sementara</h3>
            <p className="mt-3 text-sm leading-7 text-foreground/75 md:text-base">
              Nilai sementara: <span className="font-bold text-primary-strong">{score}</span>{" "}
              ({scoreToLabel(score)})
            </p>
            <p className="mt-2 text-sm leading-7 text-foreground/75 md:text-base">
              Jawaban benar:{" "}
              <span className="font-bold">
                {drafts.filter((draft) => draft.is_correct).length}/{items.length}
              </span>
            </p>
            {isSaving ? (
              <p className="mt-3 text-sm font-bold text-primary-strong">
                Menyimpan hasil latihan...
              </p>
            ) : null}
          </Card>
        </div>
        </div>
        <DragOverlay>
          {activeDraggedWord ? (
            <DragWordChipPreview
              inAnswer={activeDraggedWordInAnswer}
              word={activeDraggedWord}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <WordPreviewModal onClose={() => setPreviewWord(null)} word={previewWord} />
    </>
  );
}
