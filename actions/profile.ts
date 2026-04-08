"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireTeacherProfile } from "@/lib/auth";
import { hasSupabaseEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const profileSchema = z.object({
  full_name: z.string().trim().min(2, "Nama lengkap minimal 2 karakter."),
  new_password: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || ""),
});

export type ProfileActionState =
  | {
      message?: string;
      errors?: {
        full_name?: string[];
        new_password?: string[];
      };
    }
  | undefined;

export async function updateTeacherProfileAction(
  _state: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const parsed = profileSchema.safeParse({
    full_name: formData.get("full_name"),
    new_password: formData.get("new_password"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Periksa kembali data profil Anda.",
    };
  }

  const password = parsed.data.new_password;
  if (password && password.length < 8) {
    return {
      errors: {
        new_password: ["Password baru minimal 8 karakter."],
      },
      message: "Password baru masih terlalu pendek.",
    };
  }

  const profile = await requireTeacherProfile();

  if (!hasSupabaseEnv()) {
    revalidatePath("/admin");
    revalidatePath("/admin/profile");
    return {
      message: "Profil demo berhasil diperbarui.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const authPayload: {
    password?: string;
    data?: {
      full_name: string;
    };
  } = {
    data: {
      full_name: parsed.data.full_name,
    },
  };

  if (password) {
    authPayload.password = password;
  }

  const [{ error: profileError }, { error: authError }] = await Promise.all([
    supabase
      .from("profiles")
      .update({
        full_name: parsed.data.full_name,
      })
      .eq("id", profile.id),
    supabase.auth.updateUser(authPayload),
  ]);

  if (profileError || authError) {
    return {
      message:
        profileError?.message ||
        authError?.message ||
        "Profil belum berhasil diperbarui.",
    };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/profile");

  return {
    message: password
      ? "Profil dan password berhasil diperbarui."
      : "Profil berhasil diperbarui.",
  };
}
