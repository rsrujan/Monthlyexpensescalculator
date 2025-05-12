
import { createClient } from '@supabase/supabase-js';

// Default values for development (these will be overridden by environment variables when available)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-public-anon-key';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

// Check if Supabase is properly configured
const isSuapabaseConfigured = supabaseUrl !== 'https://your-project-url.supabase.co' && 
  supabaseAnonKey !== 'your-public-anon-key';

console.log('Supabase initialized with URL:', supabaseUrl);
console.log('Supabase properly configured:', isSuapabaseConfigured);

// Utility function to get user session
export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) console.error("Error getting session:", error.message);
  return { session, error };
};

// Utility function to get current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) console.error("Error getting user:", error.message);
  return { user, error };
};

// Check if user is an admin
export const isUserAdmin = async () => {
  const { user } = await getCurrentUser();
  if (!user) return false;
  
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
    
  if (error || !data) return false;
  return data.role === 'admin';
};
