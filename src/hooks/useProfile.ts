import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface Profile {
  id: string;
  is_paid: boolean;
  plan: 'free' | 'paid';
  created_at: string;
}

export function useProfile(userId: string | undefined, userEmail?: string) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchOrCreate() {
      setLoading(true);

      // Try to fetch existing profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (cancelled) return;

      if (error && error.code === 'PGRST116') {
        // Row not found — create it (free by default)
        const { data: created } = await supabase
          .from('profiles')
          .insert({ id: userId, is_paid: false, plan: 'free', email: userEmail ?? null })
          .select()
          .single();
        if (!cancelled) setProfile(created ?? null);
      } else {
        // Update email if missing
        if (data && !data.email && userEmail) {
          await supabase.from('profiles').update({ email: userEmail }).eq('id', userId);
          data.email = userEmail;
        }
        setProfile(data ?? null);
      }

      setLoading(false);
    }

    fetchOrCreate();
    return () => { cancelled = true; };
  }, [userId]);

  const isPaid = profile?.is_paid ?? false;

  return { profile, isPaid, loading };
}
