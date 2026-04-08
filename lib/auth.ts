import "server-only";

import { redirect } from "next/navigation";
import { hasSupabaseEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Profile, Role } from "@/types/app";

const allowedRoles: Role[] = ["admin", "teacher"];

export async function getCurrentProfile() {
  if (!hasSupabaseEnv()) {
    return {
      id: "demo-teacher",
      email: "guru@demo.local",
      full_name: "Guru Demo",
      role: "admin",
      created_at: new Date().toISOString(),
    } satisfies Profile;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return null;
  }

  return profile as Profile;
}

export async function requireTeacherProfile() {
  const profile = await getCurrentProfile();

  if (!profile || !allowedRoles.includes(profile.role)) {
    redirect("/login");
  }

  return profile;
}
