import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isValidUrl = rawUrl.startsWith('http://') || rawUrl.startsWith('https://');

// Helper to check if Supabase is actually configured properly
export const isSupabaseConfigured = () => {
  return isValidUrl && rawKey !== '' && rawKey !== 'your_supabase_anon_key';
};

const supabaseUrl = isValidUrl ? rawUrl : 'https://placeholder.supabase.co';
const supabaseAnonKey = rawKey !== '' ? rawKey : 'placeholder';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
