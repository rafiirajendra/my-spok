"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import { assertSupabaseEnv } from "@/lib/env";

let browserClient: SupabaseClient<Database> | undefined;

export function createSupabaseBrowserClient() {
  if (browserClient) {
    return browserClient;
  }

  const { url, anonKey } = assertSupabaseEnv();

  browserClient = createBrowserClient<Database>(url, anonKey);
  return browserClient;
}
