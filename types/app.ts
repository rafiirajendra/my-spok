export type Role = "admin" | "teacher";

export type Category = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
};

export type Level = {
  id: string;
  category_id: string;
  name: string;
  order_number: number;
  created_at: string;
};

export type Word = {
  id: string;
  level_id: string;
  word: string;
  gif_url: string | null;
  created_at: string;
};

export type Exercise = {
  id: string;
  level_id: string;
  title: string;
  instruction: string | null;
  created_at: string;
};

export type ExerciseWordOption = {
  id: string;
  text: string;
  gifUrl?: string | null;
};

export type ExerciseItem = {
  id: string;
  exercise_id: string;
  sentence_answer: string;
  words_options: ExerciseWordOption[];
  order_number: number;
  created_at: string;
};

export type StudentSession = {
  id: string;
  student_name: string;
  student_class: string | null;
  category_id: string;
  level_id: string;
  created_at: string;
};

export type Attempt = {
  id: string;
  student_session_id: string;
  exercise_id: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  started_at: string;
  finished_at: string | null;
  created_at: string;
};

export type AttemptAnswer = {
  id: string;
  attempt_id: string;
  exercise_item_id: string;
  student_answer: string;
  is_correct: boolean;
  created_at: string;
};

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: Role;
  created_at: string;
};

export type StudentCatalog = {
  categories: Category[];
  levels: Level[];
};

export type PracticePayload = {
  session: StudentSession;
  category: Category | null;
  level: Level | null;
  exercise: Exercise | null;
  items: ExerciseItem[];
};

export type AttemptResultSummary = {
  attempt: Attempt;
  session: StudentSession;
  exercise: Exercise | null;
  category: Category | null;
  level: Level | null;
  answers: Array<
    AttemptAnswer & {
      prompt: ExerciseItem | null;
      expected: string;
    }
  >;
};

export type DashboardStats = {
  categories: number;
  levels: number;
  words: number;
  exercises: number;
  recentAttempts: number;
};

export type DashboardResultRow = {
  attempt_id: string;
  student_name: string;
  student_class: string | null;
  category_name: string | null;
  level_name: string | null;
  score: number;
  correct_answers: number;
  total_questions: number;
  finished_at: string | null;
};
