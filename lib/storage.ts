import "server-only";

import { STORAGE_BUCKET } from "@/lib/constants";
import { slugify } from "@/lib/utils";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function uploadGifToStorage(file: File) {
  const supabase = await createSupabaseServerClient();
  const extension = file.name.split(".").pop() ?? "gif";
  const filePath = `words/${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}.${extension}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      contentType: file.type || "image/gif",
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}
