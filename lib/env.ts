const publicSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publicSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const env = {
  publicSupabaseUrl,
  publicSupabaseAnonKey,
};

export function hasSupabaseEnv() {
  return Boolean(publicSupabaseUrl && publicSupabaseAnonKey);
}

export function assertSupabaseEnv() {
  if (!hasSupabaseEnv()) {
    throw new Error(
      "Supabase environment variables are missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  return {
    url: publicSupabaseUrl as string,
    anonKey: publicSupabaseAnonKey as string,
  };
}
