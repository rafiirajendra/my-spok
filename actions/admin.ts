"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireTeacherProfile } from "@/lib/auth";
import { hasSupabaseEnv } from "@/lib/env";
import { uploadGifToStorage } from "@/lib/storage";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const levelSchema = z.object({
  name: z.string().min(2),
  order_number: z.coerce.number().min(1),
});

const wordSchema = z.object({
  level_id: z.string().min(1),
  word: z.string().min(1),
});

const exerciseSchema = z.object({
  level_id: z.string().min(1),
  title: z.string().min(3),
  instruction: z.string().optional(),
});

async function getSupabaseForAdmin() {
  await requireTeacherProfile();
  return hasSupabaseEnv() ? createSupabaseServerClient() : null;
}

export async function createLevelAction(formData: FormData) {
  const parsed = levelSchema.safeParse({
    name: formData.get("name"),
    order_number: formData.get("order_number"),
  });

  if (!parsed.success) return;
  const supabase = await getSupabaseForAdmin();

  if (supabase) {
    await supabase.from("levels").insert(parsed.data);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/levels");
}

export async function updateLevelAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const parsed = levelSchema.safeParse({
    name: formData.get("name"),
    order_number: formData.get("order_number"),
  });

  if (!id || !parsed.success) return;
  const supabase = await getSupabaseForAdmin();

  if (supabase) {
    await supabase.from("levels").update(parsed.data).eq("id", id);
  }

  revalidatePath("/admin/levels");
}

export async function deleteLevelAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await getSupabaseForAdmin();
  if (supabase) {
    await supabase.from("levels").delete().eq("id", id);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/levels");
}

export async function createWordAction(formData: FormData) {
  const parsed = wordSchema.safeParse({
    level_id: formData.get("level_id"),
    word: formData.get("word"),
  });

  if (!parsed.success) return;
  const supabase = await getSupabaseForAdmin();

  if (supabase) {
    const file = formData.get("gif_file");
    const gifUrl =
      file instanceof File && file.size > 0 ? await uploadGifToStorage(file) : null;

    await supabase.from("words").insert({
      level_id: parsed.data.level_id,
      word: parsed.data.word,
      gif_url: gifUrl,
    });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/words");
}

export async function updateWordAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const parsed = wordSchema.safeParse({
    level_id: formData.get("level_id"),
    word: formData.get("word"),
  });

  if (!id || !parsed.success) return;
  const supabase = await getSupabaseForAdmin();

  if (supabase) {
    const file = formData.get("gif_file");
    let gifUrl = String(formData.get("current_gif_url") ?? "") || null;

    if (file instanceof File && file.size > 0) {
      gifUrl = await uploadGifToStorage(file);
    }

    await supabase
      .from("words")
      .update({
        level_id: parsed.data.level_id,
        word: parsed.data.word,
        gif_url: gifUrl,
      })
      .eq("id", id);
  }

  revalidatePath("/admin/words");
}

export async function deleteWordAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await getSupabaseForAdmin();
  if (supabase) {
    await supabase.from("words").delete().eq("id", id);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/words");
}

export async function createExerciseAction(formData: FormData) {
  const parsed = exerciseSchema.safeParse({
    level_id: formData.get("level_id"),
    title: formData.get("title"),
    instruction: formData.get("instruction"),
  });

  if (!parsed.success) return;

  const sentenceAnswers = formData
    .getAll("sentence_answer")
    .map((value) => String(value))
    .filter(Boolean);
  const wordsOptions = formData
    .getAll("words_options")
    .map((value) => String(value))
    .filter(Boolean);
  const orderNumbers = formData
    .getAll("order_number")
    .map((value) => Number(value));

  if (!sentenceAnswers.length || sentenceAnswers.length !== wordsOptions.length) {
    return;
  }

  const supabase = await getSupabaseForAdmin();

  if (supabase) {
    const { data: exercise } = await supabase
      .from("exercises")
      .insert({
        level_id: parsed.data.level_id,
        title: parsed.data.title,
        instruction: parsed.data.instruction || null,
      })
      .select("id")
      .single();

    if (exercise) {
      await supabase.from("exercise_items").insert(
        sentenceAnswers.map((sentence, index) => ({
          exercise_id: exercise.id,
          sentence_answer: sentence,
          order_number: orderNumbers[index] || index + 1,
          words_options: wordsOptions[index]
            .split(",")
            .map((word, wordIndex) => ({
              id: `${exercise.id}-${index + 1}-${wordIndex + 1}`,
              text: word.trim(),
            }))
            .filter((item) => item.text),
        })),
      );
    }
  }

  revalidatePath("/admin");
  revalidatePath("/admin/exercises");
}

export async function deleteExerciseAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await getSupabaseForAdmin();
  if (supabase) {
    await supabase.from("exercise_items").delete().eq("exercise_id", id);
    await supabase.from("exercises").delete().eq("id", id);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/exercises");
}
