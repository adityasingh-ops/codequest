// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eynyndvtuilnwdikefvl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bnluZHZ0dWlsbndkaWtlZnZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3MTczOTQsImV4cCI6MjA3NTI5MzM5NH0.J9I_ZinrOFOSYiz-bGvDogq40C0jn5i2VCFl_YMz8R0';

// Validation
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Singleton instance
let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  }
  return supabaseInstance;
};

// For backwards compatibility
export const supabase = getSupabase();