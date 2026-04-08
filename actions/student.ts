"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { hasSupabaseEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const studentSessionSchema = z.object({
  student_name: z.string().min(2, "Nama minimal 2 karakter."),
  student_class: z.string().optional(),
  category_id: z.string().min(1, "Kategori wajib dipilih."),
  level_id: z.string().min(1, "Level wajib dipilih."),
});

export async function createStudentSessionAction(formData: FormData) {
  const parsed = studentSessionSchema.safeParse({
    student_name: formData.get("student_name"),
    student_class: formData.get("student_class"),
    category_id: formData.get("category_id"),
    level_id: formData.get("level_id"),
  });

  if (!parsed.success) {
    redirect("/student");
  }

  if (!hasSupabaseEnv()) {
    redirect("/student/practice/session-demo");
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("student_sessions")
    .insert({
      student_name: parsed.data.student_name,
      student_class: parsed.data.student_class || null,
      category_id: parsed.data.category_id,
      level_id: parsed.data.level_id,
    })
    .select("id")
    .single();

  if (error || !data) {
    redirect("/student");
  }

  redirect(`/student/practice/${data.id}`);
}
