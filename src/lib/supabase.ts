import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rrjktvvnzjzlfquaghut.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyamt0dnZuemp6bGZxdWFnaHV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1OTE5NDUsImV4cCI6MjA5MjE2Nzk0NX0.1dVeAqxIyV6pKz67iEIKx4_BgcR0mWyI0PbqzQue3mg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const isSupabaseConfigured = true;
