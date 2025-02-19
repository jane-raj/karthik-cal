import { createClient } from '@supabase/supabase-js';

// Hardcode your Supabase URL and Anon Key here
const supabaseUrl = 'https://vwsgtspvztdmoafwschx.supabase.co';
const supabaseAnonKey = 'your_supabase_anon_key_here'; // Replace with your actual Anon Key

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabase }; // Export the single instance
