import "server-only";

import { hasSupabaseEnv } from "@/lib/env";
import {
  mockAttemptSummary,
  mockCatalog,
  mockDashboardResults,
  mockDashboardStats,
  mockExerciseItems,
  mockExercises,
  mockLevels,
  mockPracticePayload,
  mockSession,
  mockWords,
} from "@/lib/mock-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  AttemptResultSummary,
  DashboardResultRow,
  DashboardStats,
  Exercise,
  ExerciseItem,
  Level,
  PracticePayload,
  StudentCatalog,
  StudentSession,
  Word,
} from "@/types/app";

function asExerciseItems(data: unknown): ExerciseItem[] {
  return (data as ExerciseItem[]) ?? [];
}

export async function getStudentCatalog(): Promise<StudentCatalog> {
  if (!hasSupabaseEnv()) {
    return mockCatalog;
  }

  const supabase = await createSupabaseServerClient();
  const { data: levels } = await supabase.from("levels").select("*").order("order_number");

  return {
    levels: (levels as Level[]) ?? [],
  };
}

export async function getStudentSession(sessionId: string) {
  if (!hasSupabaseEnv()) {
    return sessionId === mockSession.id ? mockSession : null;
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("student_sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  return (data as StudentSession | null) ?? null;
}

export async function getPracticePayload(sessionId: string): Promise<PracticePayload | null> {
  if (!hasSupabaseEnv()) {
    return sessionId === mockPracticePayload.session.id ? mockPracticePayload : null;
  }

  const session = await getStudentSession(sessionId);

  if (!session) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const [{ data: level }, { data: exercises }, { data: words }] = await Promise.all([
    supabase.from("levels").select("*").eq("id", session.level_id).single(),
    supabase
      .from("exercises")
      .select("*")
      .eq("level_id", session.level_id)
      .order("created_at", { ascending: false }),
    supabase.from("words").select("*").eq("level_id", session.level_id),
  ]);

  const exerciseRows = (exercises as Exercise[]) ?? [];

  if (!exerciseRows.length) {
    return {
      session,
      level: (level as Level | null) ?? null,
      exercise: null,
      items: [],
    };
  }

  const { data: items } = await supabase
    .from("exercise_items")
    .select("*")
    .in(
      "exercise_id",
      exerciseRows.map((exercise) => exercise.id),
    )
    .order("order_number");

  const itemsByExerciseId = new Map<string, ExerciseItem[]>();
  for (const item of asExerciseItems(items)) {
    const currentItems = itemsByExerciseId.get(item.exercise_id) ?? [];
    currentItems.push(item);
    itemsByExerciseId.set(item.exercise_id, currentItems);
  }

  const exercise =
    exerciseRows.find((entry) => (itemsByExerciseId.get(entry.id)?.length ?? 0) > 0) ?? null;

  const wordGifMap = new Map(
    ((words as Word[]) ?? []).map((word) => [word.word.toLowerCase(), word.gif_url]),
  );

  if (!exercise) {
    return {
      session,
      level: (level as Level | null) ?? null,
      exercise: null,
      items: [],
    };
  }

  return {
    session,
    level: (level as Level | null) ?? null,
    exercise,
    items: (itemsByExerciseId.get(exercise.id) ?? []).map((item) => ({
      ...item,
      words_options: Array.isArray(item.words_options)
        ? item.words_options.map((option) => ({
            ...option,
            gifUrl:
              typeof option === "object" &&
              option &&
              "text" in option &&
              typeof option.text === "string"
                ? wordGifMap.get(option.text.toLowerCase()) ?? null
                : null,
          }))
        : [],
    })),
  };
}

export async function getAttemptResult(attemptId: string): Promise<AttemptResultSummary | null> {
  if (!hasSupabaseEnv()) {
    return attemptId === mockAttemptSummary.attempt.id ? mockAttemptSummary : null;
  }

  const supabase = await createSupabaseServerClient();
  const { data: attempt } = await supabase
    .from("attempts")
    .select("*")
    .eq("id", attemptId)
    .single();

  if (!attempt) {
    return null;
  }

  const [{ data: session }, { data: exercise }, { data: answers }] = await Promise.all([
    supabase
      .from("student_sessions")
      .select("*")
      .eq("id", attempt.student_session_id)
      .single(),
    supabase.from("exercises").select("*").eq("id", attempt.exercise_id).single(),
    supabase
      .from("attempt_answers")
      .select("*")
      .eq("attempt_id", attemptId)
      .order("created_at"),
  ]);

  if (!session) {
    return null;
  }

  const { data: level } = await supabase
    .from("levels")
    .select("*")
    .eq("id", session.level_id)
    .single();

  const answerRows = (answers ?? []) as Array<{
    id: string;
    attempt_id: string;
    exercise_item_id: string;
    student_answer: string;
    is_correct: boolean;
    created_at: string;
  }>;

  const itemIds = answerRows.map((row) => row.exercise_item_id);
  const { data: prompts } = await supabase
    .from("exercise_items")
    .select("*")
    .in("id", itemIds);

  const promptMap = new Map(
    asExerciseItems(prompts).map((item) => [
      item.id,
      {
        ...item,
        words_options: Array.isArray(item.words_options) ? item.words_options : [],
      },
    ]),
  );

  return {
    attempt: attempt,
    session: session as StudentSession,
    exercise: (exercise as Exercise | null) ?? null,
    level: (level as Level | null) ?? null,
    answers: answerRows.map((answer) => {
      const prompt = promptMap.get(answer.exercise_item_id) ?? null;

      return {
        ...answer,
        prompt,
        expected: prompt?.sentence_answer ?? "",
      };
    }),
  };
}

export async function getDashboardStats(): Promise<DashboardStats> {
  if (!hasSupabaseEnv()) {
    return mockDashboardStats;
  }

  const supabase = await createSupabaseServerClient();
  const [levels, words, exercises, attempts] = await Promise.all([
    supabase.from("levels").select("*", { count: "exact", head: true }),
    supabase.from("words").select("*", { count: "exact", head: true }),
    supabase.from("exercises").select("*", { count: "exact", head: true }),
    supabase
      .from("attempts")
      .select("*", { count: "exact", head: true })
      .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
  ]);

  return {
    levels: levels.count ?? 0,
    words: words.count ?? 0,
    exercises: exercises.count ?? 0,
    recentAttempts: attempts.count ?? 0,
  };
}

export async function getLevels() {
  if (!hasSupabaseEnv()) return mockLevels;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("levels").select("*").order("order_number");
  return (data as Level[]) ?? [];
}

export async function getWords() {
  if (!hasSupabaseEnv()) return mockWords;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("words").select("*").order("word");
  return (data as Word[]) ?? [];
}

export async function getExercises() {
  if (!hasSupabaseEnv()) return mockExercises;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("exercises").select("*").order("created_at");
  return (data as Exercise[]) ?? [];
}

export async function getExerciseItems() {
  if (!hasSupabaseEnv()) return mockExerciseItems;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("exercise_items")
    .select("*")
    .order("order_number");

  return asExerciseItems(data);
}

export async function getResults(search?: {
  q?: string;
  levelId?: string;
}) {
  if (!hasSupabaseEnv()) {
    return mockDashboardResults.filter((row) => {
      const matchesQuery = search?.q
        ? row.student_name.toLowerCase().includes(search.q.toLowerCase())
        : true;
      const matchesLevel = search?.levelId
        ? mockLevels.find((item) => item.id === search.levelId)?.name === row.level_name
        : true;

      return matchesQuery && matchesLevel;
    });
  }

  const supabase = await createSupabaseServerClient();
  const { data: attempts } = await supabase
    .from("attempts")
    .select("*")
    .order("finished_at", { ascending: false });

  const attemptRows = attempts ?? [];
  const sessionIds = attemptRows.map((row) => row.student_session_id);
  const exerciseIds = attemptRows.map((row) => row.exercise_id);

  const [{ data: sessions }, { data: exercises }] = await Promise.all([
    supabase.from("student_sessions").select("*").in("id", sessionIds),
    supabase.from("exercises").select("*").in("id", exerciseIds),
  ]);

  const levelIds = [...new Set((sessions ?? []).map((session) => session.level_id))];
  const { data: levels } = await supabase.from("levels").select("*").in("id", levelIds);

  const sessionMap = new Map((sessions ?? []).map((item) => [item.id, item]));
  const exerciseMap = new Map((exercises ?? []).map((item) => [item.id, item]));
  const levelMap = new Map((levels ?? []).map((item) => [item.id, item]));

  return attemptRows
    .map((attempt) => {
      const session = sessionMap.get(attempt.student_session_id);
      const exercise = exerciseMap.get(attempt.exercise_id);
      const level = session ? levelMap.get(session.level_id) : null;

      return {
        attempt_id: attempt.id,
        student_name: session?.student_name ?? "Tanpa nama",
        student_class: session?.student_class ?? null,
        level_name: level?.name ?? exercise?.title ?? null,
        score: attempt.score,
        correct_answers: attempt.correct_answers,
        total_questions: attempt.total_questions,
        finished_at: attempt.finished_at,
      } satisfies DashboardResultRow;
    })
    .filter((row) => {
      const matchesQuery = search?.q
        ? `${row.student_name} ${row.student_class ?? ""}`
            .toLowerCase()
            .includes(search.q.toLowerCase())
        : true;

      const matchesLevel = search?.levelId
        ? levels?.find((item) => item.id === search.levelId)?.name === row.level_name
        : true;

      return matchesQuery && matchesLevel;
    });
}
