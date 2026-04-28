import { createClient } from '@supabase/supabase-js';

// Environment variables are preferred, but we use fallbacks for the demo/dev environment if not set
// In production, these should ALWAYS be provided via the environment
const supabaseUrl = 'https://sjhvxwlvqbzdfojcabax.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqaHZ4d2x2cWJ6ZGZvamNhYmF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczOTI4NjMsImV4cCI6MjA5Mjk2ODg2M30.RQUMfXiSzTseRFgK_tStLYslAasjpjuduorYmgdI3aE';

// Validate URL format to prevent client creation failure
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const supabase = createClient(
  isValidUrl(supabaseUrl) ? supabaseUrl : 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

/**
 * Checks if the Supabase configuration is likely correct (not using placeholders)
 * Also checks if the key pattern matches expected Supabase JWT format vs common mismatches like Stripe keys
 */
export const isSupabaseConfigured = () => {
  const hasUrl = !!import.meta.env.VITE_SUPABASE_URL || supabaseUrl !== 'https://placeholder.supabase.co';
  const hasKey = !!import.meta.env.VITE_SUPABASE_ANON_KEY || (supabaseAnonKey && supabaseAnonKey !== 'placeholder');
  
  // Detection for common mistake using modern Supabase prefixes
  const isStripeKey = supabaseAnonKey?.startsWith('pk_');
  const isSupabaseKey = supabaseAnonKey?.startsWith('eyJ') || supabaseAnonKey?.startsWith('sb_publishable_') || supabaseAnonKey?.startsWith('yJ'); // Handle user-provided keys

  return {
    configured: hasUrl && hasKey && !isStripeKey && isSupabaseKey,
    hasUrl,
    hasKey,
    isStripeKey,
    isSupabaseKey
  };
};
