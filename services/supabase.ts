import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function requireEnv(value: string | undefined, name: string): string {
  if (!value || !value.trim()) {
    throw new Error(
      `Missing ${name}. Copy .env.example to .env.local and set your Supabase project values. See supabase/README.md.`,
    );
  }
  return value.trim();
}

let client: SupabaseClient | null = null;

/** Lazy singleton so the app can render before env is checked (e.g. public pages). */
export function getSupabase(): SupabaseClient {
  if (client) return client;
  client = createClient(requireEnv(supabaseUrl, 'VITE_SUPABASE_URL'), requireEnv(supabaseAnonKey, 'VITE_SUPABASE_ANON_KEY'));
  return client;
}

/** True when Vite env has Supabase credentials configured. */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl?.trim() && supabaseAnonKey?.trim());
}

/** @deprecated Prefer getSupabase() — kept for any existing imports. */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getSupabase(), prop, receiver);
  },
});
