import type { AttemptResultSummary, ExerciseItem, StudentSession } from "@/types/app";

export const STUDENT_SESSION_SNAPSHOT_COOKIE = "student_session_snapshot";
export const STUDENT_ATTEMPT_SNAPSHOT_COOKIE = "student_attempt_snapshot";
export const STUDENT_FLOW_COOKIE_MAX_AGE = 60 * 60 * 12;

type AttemptSnapshotAnswer = {
  exercise_item_id: string;
  student_answer: string;
  is_correct: boolean;
  expected: string;
};

function parseSnapshot<T>(value: string | undefined): T | null {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(decodeURIComponent(value)) as T;
  } catch {
    return null;
  }
}

function serializeSnapshot(value: unknown) {
  return encodeURIComponent(JSON.stringify(value));
}

export function parseStudentSessionSnapshot(value: string | undefined) {
  return parseSnapshot<StudentSession>(value);
}

export function serializeStudentSessionSnapshot(session: StudentSession) {
  return serializeSnapshot(session);
}

export function parseAttemptResultSnapshot(value: string | undefined) {
  return parseSnapshot<AttemptResultSummary>(value);
}

export function serializeAttemptResultSnapshot(result: AttemptResultSummary) {
  return serializeSnapshot(result);
}

export function buildAttemptResultSnapshot({
  attemptId,
  exerciseId,
  exerciseTitle,
  levelName,
  session,
  items,
  answers,
}: {
  attemptId: string;
  exerciseId: string;
  exerciseTitle: string;
  levelName?: string | null;
  session: StudentSession;
  items: ExerciseItem[];
  answers: AttemptSnapshotAnswer[];
}): AttemptResultSummary {
  const createdAt = new Date().toISOString();

  return {
    attempt: {
      id: attemptId,
      student_session_id: session.id,
      exercise_id: exerciseId,
      score: answers.length
        ? Math.round((answers.filter((answer) => answer.is_correct).length / answers.length) * 100)
        : 0,
      total_questions: answers.length,
      correct_answers: answers.filter((answer) => answer.is_correct).length,
      started_at: createdAt,
      finished_at: createdAt,
      created_at: createdAt,
    },
    session,
    exercise: {
      id: exerciseId,
      level_id: session.level_id,
      title: exerciseTitle,
      instruction: null,
      created_at: createdAt,
    },
    level: levelName
      ? {
          id: session.level_id,
          name: levelName,
          order_number: 0,
          created_at: createdAt,
        }
      : null,
    answers: items.map((item, index) => {
      const savedAnswer =
        answers.find((answer) => answer.exercise_item_id === item.id) ?? {
          exercise_item_id: item.id,
          student_answer: "",
          is_correct: false,
          expected: item.sentence_answer,
        };

      return {
        id: `${attemptId}-${index + 1}`,
        attempt_id: attemptId,
        exercise_item_id: item.id,
        student_answer: savedAnswer.student_answer,
        is_correct: savedAnswer.is_correct,
        created_at: createdAt,
        prompt: null,
        expected: savedAnswer.expected,
      };
    }),
  };
}
