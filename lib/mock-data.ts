import type {
  Attempt,
  AttemptAnswer,
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

const now = new Date().toISOString();

export const mockLevels: Level[] = [
  {
    id: "lvl-1",
    name: "Level 1",
    order_number: 1,
    created_at: now,
  },
  {
    id: "lvl-2",
    name: "Level 2",
    order_number: 2,
    created_at: now,
  },
  {
    id: "lvl-3",
    name: "Level 3",
    order_number: 3,
    created_at: now,
  },
];

export const mockWords: Word[] = [
  { id: "w-1", level_id: "lvl-1", word: "Saya", gif_url: null, created_at: now },
  { id: "w-2", level_id: "lvl-1", word: "makan", gif_url: null, created_at: now },
  { id: "w-3", level_id: "lvl-1", word: "nasi", gif_url: null, created_at: now },
  { id: "w-4", level_id: "lvl-1", word: "Ibu", gif_url: null, created_at: now },
  { id: "w-5", level_id: "lvl-1", word: "memasak", gif_url: null, created_at: now },
  { id: "w-6", level_id: "lvl-1", word: "sup", gif_url: null, created_at: now },
];

export const mockExercises: Exercise[] = [
  {
    id: "ex-1",
    level_id: "lvl-1",
    title: "Susun Kalimat Mudah",
    instruction: "Seret atau klik kata sesuai urutan yang benar.",
    created_at: now,
  },
];

export const mockExerciseItems: ExerciseItem[] = [
  {
    id: "item-1",
    exercise_id: "ex-1",
    sentence_answer: "Saya makan nasi",
    words_options: [
      { id: "item-1-a", text: "makan" },
      { id: "item-1-b", text: "Saya" },
      { id: "item-1-c", text: "nasi" },
    ],
    order_number: 1,
    created_at: now,
  },
  {
    id: "item-2",
    exercise_id: "ex-1",
    sentence_answer: "Ibu memasak sup",
    words_options: [
      { id: "item-2-a", text: "sup" },
      { id: "item-2-b", text: "Ibu" },
      { id: "item-2-c", text: "memasak" },
    ],
    order_number: 2,
    created_at: now,
  },
];

export const mockCatalog: StudentCatalog = {
  levels: mockLevels,
};

export const mockSession: StudentSession = {
  id: "session-demo",
  student_name: "Maya",
  student_class: "2A",
  level_id: "lvl-1",
  created_at: now,
};

export const mockPracticePayload: PracticePayload = {
  session: mockSession,
  level: mockLevels[0],
  exercise: mockExercises[0],
  items: mockExerciseItems,
};

const mockAttempt: Attempt = {
  id: "attempt-demo",
  student_session_id: mockSession.id,
  exercise_id: mockExercises[0].id,
  score: 80,
  total_questions: 2,
  correct_answers: 1,
  started_at: now,
  finished_at: now,
  created_at: now,
};

const mockAnswers: Array<
  AttemptAnswer & { prompt: ExerciseItem | null; expected: string }
> = [
  {
    id: "answer-1",
    attempt_id: mockAttempt.id,
    exercise_item_id: mockExerciseItems[0].id,
    student_answer: "Saya makan nasi",
    is_correct: true,
    created_at: now,
    prompt: mockExerciseItems[0],
    expected: "Saya makan nasi",
  },
  {
    id: "answer-2",
    attempt_id: mockAttempt.id,
    exercise_item_id: mockExerciseItems[1].id,
    student_answer: "Ibu sup memasak",
    is_correct: false,
    created_at: now,
    prompt: mockExerciseItems[1],
    expected: "Ibu memasak sup",
  },
];

export const mockAttemptSummary: AttemptResultSummary = {
  attempt: mockAttempt,
  session: mockSession,
  exercise: mockExercises[0],
  level: mockLevels[0],
  answers: mockAnswers,
};

export const mockDashboardStats: DashboardStats = {
  levels: mockLevels.length,
  words: mockWords.length,
  exercises: mockExercises.length,
  recentAttempts: 12,
};

export const mockDashboardResults: DashboardResultRow[] = [
  {
    attempt_id: "attempt-1",
    student_name: "Maya",
    student_class: "2A",
    level_name: "Level 1",
    score: 100,
    correct_answers: 2,
    total_questions: 2,
    finished_at: now,
  },
  {
    attempt_id: "attempt-2",
    student_name: "Rafi",
    student_class: "1B",
    level_name: "Level 3",
    score: 75,
    correct_answers: 3,
    total_questions: 4,
    finished_at: now,
  },
];
