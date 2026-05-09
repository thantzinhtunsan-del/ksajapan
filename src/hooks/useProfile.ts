import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface Profile {
  id: string;
  is_paid: boolean;
  plan: 'free' | 'paid';
  created_at: string;
}

export function useProfile() {
  return { profile: null, isPaid: true, loading: false };
}
