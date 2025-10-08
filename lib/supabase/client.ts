// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eynyndvtuilnwdikefvl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bnluZHZ0dWlsbndkaWtlZnZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3MTczOTQsImV4cCI6MjA3NTI5MzM5NH0.J9I_ZinrOFOSYiz-bGvDogq40C0jn5i2VCFl_YMz8R0';

export const supabase = createClient(supabaseUrl, supabaseKey);