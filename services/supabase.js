import { createClient } from '@supabase/supabase-js';


let supabase;

try {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.log('Missing Supabase environment variables');
  } else {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (error) {
  console.log('Error initializing Supabase client:', error.message);
}

export { supabase };
