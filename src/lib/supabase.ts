import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Profile ──────────────────────────────────────────────────────────────────

export interface Profile {
  id: string;
  full_name: string;
}

/** Insert a new row into the profiles table. Called once after sign-up. */
export async function insertProfile(id: string, full_name: string): Promise<void> {
  const { error } = await supabase.from('profiles').insert({ id, full_name });
  if (error) throw error;
}

/**
 * Fetch the profile for the given user id.
 * Returns null if the row doesn't exist or on error.
 */
export async function fetchProfile(id: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name')
    .eq('id', id)
    .single();
  if (error) return null;
  return data as Profile;
}
