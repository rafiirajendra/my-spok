"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { hasSupabaseEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const studentSessionSchema = z.object({
  student_name: z.string().min(2, "Nama minimal 2 karakter."),
  student_class: z.string().optional(),
  level_id: z.string().min(1, "Level wajib dipilih."),
});

export type StudentSessionActionState = {
  errorMessage: string | null;
};

export const initialStudentSessionState: StudentSessionActionState = {
  errorMessage: null,
};

export async function createStudentSessionAction(
  _previousState: StudentSessionActionState,
  formData: FormData,
): Promise<StudentSessionActionState> {
  const parsed = studentSessionSchema.safeParse({
    student_name: formData.get("student_name"),
    student_class: formData.get("student_class"),
    level_id: formData.get("level_id"),
  });

  if (!parsed.success) {
    return {
      errorMessage: parsed.error.issues[0]?.message ?? "Data siswa belum lengkap.",
    };
  }

  if (!hasSupabaseEnv()) {
    redirect("/student/practice/session-demo");
  }

  const supabase = await createSupabaseServerClient();
  const sessionId = crypto.randomUUID();
  const { error } = await supabase
    .from("student_sessions")
    .insert({
      id: sessionId,
      student_name: parsed.data.student_name,
      student_class: parsed.data.student_class || null,
      level_id: parsed.data.level_id,
    });

  if (error) {
    console.error("createStudentSessionAction failed", error);
    return {
      errorMessage: "Latihan belum berhasil dimulai. Coba lagi sebentar ya.",
    };
  }

  redirect(`/student/practice/${sessionId}`);
}
