import { createClient } from '@supabase/supabase-js';

// Using placeholders if env vars are missing to prevent runtime crash on initialization
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Note: If these variables are not set, the app will still run but database connections will fail.
 * The Admin Panel will prompt for setup if it detects missing configuration.
 */
