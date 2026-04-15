import { z } from "zod";
import { hasSupabaseEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const answerSchema = z.object({
  exercise_item_id: z.string().min(1),
  student_answer: z.string(),
  is_correct: z.boolean(),
});

const payloadSchema = z.object({
  student_session_id: z.string().min(1),
  exercise_id: z.string().min(1),
  answers: z.array(answerSchema).min(1),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = payloadSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ message: "Payload tidak valid." }, { status: 400 });
  }

  if (!hasSupabaseEnv()) {
    return Response.json({ attemptId: "attempt-demo" });
  }

  const supabase = await createSupabaseServerClient();
  const totalQuestions = parsed.data.answers.length;
  const correctAnswers = parsed.data.answers.filter((answer) => answer.is_correct).length;
  const score = Math.round((correctAnswers / totalQuestions) * 100);
  const startedAt = new Date().toISOString();
  const finishedAt = new Date().toISOString();
  const attemptId = crypto.randomUUID();

  const { error: attemptError } = await supabase
    .from("attempts")
    .insert({
      id: attemptId,
      student_session_id: parsed.data.student_session_id,
      exercise_id: parsed.data.exercise_id,
      score,
      total_questions: totalQuestions,
      correct_answers: correctAnswers,
      started_at: startedAt,
      finished_at: finishedAt,
    });

  if (attemptError) {
    return Response.json({ message: "Gagal menyimpan attempt." }, { status: 500 });
  }

  const { error: answersError } = await supabase.from("attempt_answers").insert(
    parsed.data.answers.map((answer) => ({
      attempt_id: attemptId,
      exercise_item_id: answer.exercise_item_id,
      student_answer: answer.student_answer,
      is_correct: answer.is_correct,
    })),
  );

  if (answersError) {
    return Response.json({ message: "Gagal menyimpan detail jawaban." }, { status: 500 });
  }

  return Response.json({ attemptId });
}
