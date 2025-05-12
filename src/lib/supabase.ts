
import { createClient } from '@supabase/supabase-js';

// Default values for development (these will be overridden by environment variables when available)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-public-anon-key';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

console.log('Supabase initialized with URL:', supabaseUrl);
