"use client";

import { useMemo, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { normalizeSentence } from "@/lib/utils";
import type { ExerciseItem, ExerciseWordOption } from "@/types/app";

type AnswerDraft = {
  exercise_item_id: string;
  student_answer: string;
  is_correct: boolean;
};

export function useExercisePlayer(items: ExerciseItem[]) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bankWords, setBankWords] = useState<ExerciseWordOption[]>(
    items[0]?.words_options ?? [],
  );
  const [answerWords, setAnswerWords] = useState<ExerciseWordOption[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [drafts, setDrafts] = useState<AnswerDraft[]>([]);
  const [previewWord, setPreviewWord] = useState<ExerciseWordOption | null>(null);

  const currentItem = items[currentIndex];
  const isLastQuestion = currentIndex === items.length - 1;

  const progress = useMemo(
    () => (items.length ? Math.round(((currentIndex + 1) / items.length) * 100) : 0),
    [currentIndex, items.length],
  );

  function findContainer(id: string) {
    if (id === "bank" || bankWords.some((word) => word.id === id)) {
      return "bank";
    }
    if (id === "answer" || answerWords.some((word) => word.id === id)) {
      return "answer";
    }
    return null;
  }

  function moveBetweenContainers(activeId: string, overId: string) {
    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    if (activeContainer === "bank") {
      const activeItem = bankWords.find((word) => word.id === activeId);
      if (!activeItem) return;

      setBankWords((current) => current.filter((word) => word.id !== activeId));
      setAnswerWords((current) => {
        const overIndex = current.findIndex((word) => word.id === overId);
        const next = [...current];
        const insertAt = overId === "answer" || overIndex < 0 ? current.length : overIndex;
        next.splice(insertAt, 0, activeItem);
        return next;
      });
      return;
    }

    const activeItem = answerWords.find((word) => word.id === activeId);
    if (!activeItem) return;

    setAnswerWords((current) => current.filter((word) => word.id !== activeId));
    setBankWords((current) => {
      const overIndex = current.findIndex((word) => word.id === overId);
      const next = [...current];
      const insertAt = overId === "bank" || overIndex < 0 ? current.length : overIndex;
      next.splice(insertAt, 0, activeItem);
      return next;
    });
  }

  function reorderInContainer(activeId: string, overId: string) {
    const container = findContainer(activeId);
    if (!container || container !== findContainer(overId)) {
      return;
    }

    const values = container === "bank" ? bankWords : answerWords;
    const oldIndex = values.findIndex((word) => word.id === activeId);
    const newIndex = values.findIndex((word) => word.id === overId);

    if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) {
      return;
    }

    const nextValues = arrayMove(values, oldIndex, newIndex);

    if (container === "bank") {
      setBankWords(nextValues);
      return;
    }

    setAnswerWords(nextValues);
  }

  function addWordToAnswer(word: ExerciseWordOption) {
    setBankWords((current) => current.filter((entry) => entry.id !== word.id));
    setAnswerWords((current) => [...current, word]);
  }

  function removeWordFromAnswer(word: ExerciseWordOption) {
    setAnswerWords((current) => current.filter((entry) => entry.id !== word.id));
    setBankWords((current) => [...current, word]);
  }

  function resetCurrent() {
    if (!currentItem) return;
    setBankWords(currentItem.words_options);
    setAnswerWords([]);
    setFeedback(null);
  }

  function loadQuestion(nextIndex: number) {
    const nextItem = items[nextIndex];
    setCurrentIndex(nextIndex);
    setBankWords(nextItem?.words_options ?? []);
    setAnswerWords([]);
    setFeedback(null);
  }

  function checkAnswer() {
    if (!currentItem) return false;

    const studentAnswer = answerWords.map((word) => word.text).join(" ");
    const isCorrect =
      normalizeSentence(studentAnswer) ===
      normalizeSentence(currentItem.sentence_answer);

    setFeedback(isCorrect ? "correct" : "incorrect");
    setDrafts((current) => {
      const next = current.filter((entry) => entry.exercise_item_id !== currentItem.id);
      next.push({
        exercise_item_id: currentItem.id,
        student_answer: studentAnswer,
        is_correct: isCorrect,
      });
      return next;
    });

    return isCorrect;
  }

  function goToNextQuestion() {
    if (!feedback) return false;
    if (isLastQuestion) return true;
    loadQuestion(currentIndex + 1);
    return false;
  }

  return {
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
  };
}
