import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'defaultSupabaseUrl'; // Replace with a valid default if necessary
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'defaultSupabaseAnonKey'; // Replace with a valid default if necessary

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 