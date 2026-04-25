import { createClient } from '@supabase/supabase-js';

// Environment variables are preferred, but we use fallbacks for the demo/dev environment if not set
// In production, these should ALWAYS be provided via the environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://frzubfmwigxfpueducqp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyenViZm13aWd4ZnB1ZWR1Y3FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMTUxNzMsImV4cCI6MjA5MjY5MTE3M30.ASTzOEBW2NCJprx8iClm-B-L9aQiwd5RjP7qHDwI4w4';

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
  
  // Detection for common mistake: providing a Stripe key instead of a Supabase key
  const isStripeKey = supabaseAnonKey?.startsWith('sb_publishable_') || supabaseAnonKey?.startsWith('pk_');
  const isSupabaseKey = supabaseAnonKey?.startsWith('eyJ'); // Supabase keys are JWTs

  return {
    configured: hasUrl && hasKey && !isStripeKey && isSupabaseKey,
    hasUrl,
    hasKey,
    isStripeKey,
    isSupabaseKey
  };
};
