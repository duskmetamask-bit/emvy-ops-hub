import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rrjktvvnzjzlfquaghut.supabase.co';
// Use service role key if available, otherwise anon key (RLS is off so both work)
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJya2R0dnZuemp6bGZxdWFnaHV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQwNzM2NTYsImV4cCI6MTk5NTY0OTY1Nn0.7LB窃UK8VfbGWz3hO8t5Wln6RQrjTqrPiLTqR1OsBfk';

export const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});
