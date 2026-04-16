import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const PLACEHOLDER = ['your-project-id', 'your-anon-public-key', 'MY_', undefined, ''];
const isMissing = (v: string) => !v || PLACEHOLDER.some((p) => p && v.includes(p));

/** True when real Supabase credentials are not configured. */
export const DEMO_MODE = isMissing(supabaseUrl) || isMissing(supabaseAnonKey);

// In demo mode create a dummy client that is never actually called.
export const supabase: SupabaseClient = DEMO_MODE
  ? ({} as SupabaseClient)
  : createClient(supabaseUrl, supabaseAnonKey);

// ─── Profile ──────────────────────────────────────────────────────────────────

export interface Profile {
  id: string;
  full_name: string;
}

/** Insert a new row into the profiles table. Called once after sign-up. */
export async function insertProfile(id: string, full_name: string): Promise<void> {
  if (DEMO_MODE) return;
  const { error } = await supabase.from('profiles').insert({ id, full_name });
  if (error) throw error;
}

/**
 * Fetch the profile for the given user id.
 * Returns null if the row doesn't exist or on error.
 */
export async function fetchProfile(id: string): Promise<Profile | null> {
  if (DEMO_MODE) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name')
    .eq('id', id)
    .single();
  if (error) return null;
  return data as Profile;
}
