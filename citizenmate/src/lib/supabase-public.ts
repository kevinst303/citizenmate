import { createClient } from '@supabase/supabase-js';

let _supabasePublic: ReturnType<typeof createClient> | null = null;

export const getSupabasePublic = () => {
  if (!_supabasePublic) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set');
    }
    _supabasePublic = createClient(supabaseUrl, supabaseAnonKey);
  }
  return _supabasePublic;
};
