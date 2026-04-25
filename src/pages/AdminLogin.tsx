import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, User, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import PageTransition from '../components/PageTransition';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const navigate = useNavigate();

  // Check for existing session and DB connection on mount
  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      try {
        console.log('AdminPortal: Initializing...');
        
        // Timeout for DB check to prevent infinite loading
        const dbCheckPromise = supabase.from('projects').select('id').limit(1).maybeSingle();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database connection timed out')), 8000)
        );

        try {
          const { error: dbError } = await Promise.race([dbCheckPromise, timeoutPromise]) as any;
          if (isMounted) {
            const configStatus = isSupabaseConfigured();
            
            // Check if connection is successful even if table is missing or empty
            const isConnected = !dbError || 
                              dbError.message?.includes('relation "projects" does not exist') || 
                              dbError.code === 'PGRST116' ||
                              dbError.code === '42P01'; // Undefined table
            
            setDbStatus(isConnected ? 'connected' : 'error');

            if (!configStatus.configured && isMounted) {
              setDbStatus('error');
              if (configStatus.isStripeKey) {
                setError('CRITICAL: The key provided looks like a Stripe key, not a Supabase key. Please use the "anon public" key from your Supabase Dashboard.');
              } else if (!configStatus.isSupabaseKey && configStatus.hasKey) {
                setError('Notice: The API key does not look like a standard Supabase JWT. Please double-check your credentials.');
              }
            }
            
            if (dbError && !isConnected) {
              console.warn('DB Connection problem:', dbError.message);
            }
          }
        } catch (dbErr: any) {
          console.warn('DB check delayed or timed out:', dbErr);
          if (isMounted) {
            setDbStatus('error');
          }
        }

        // Session check with timeout
        const sessionPromise = supabase.auth.getSession();
        const sessionTimeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Auth timeout')), 5000));
        
        const { data: { session } } = await Promise.race([sessionPromise, sessionTimeout]) as any;
        
        if (session && isMounted) {
          console.log('Valid session found, redirecting to dashboard...');
          navigate('/admin/dashboard', { replace: true });
          return;
        }
      } catch (err) {
        console.error('Initialization failed:', err);
        if (isMounted) setDbStatus('error');
      } finally {
        if (isMounted) setCheckingSession(false);
      }
    };
    init();
    return () => { isMounted = false; };
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!email.includes('@')) {
        throw new Error('Please enter a valid email address.');
      }

      console.log('Attempting login for:', email);

      // Attempt login with timeout
      const loginPromise = supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Login request timed out. Please check your internet connection or Supabase settings.')), 15000)
      );

      const { data, error: loginError } = await Promise.race([loginPromise, timeoutPromise]) as any;

      if (loginError) {
        console.error('Supabase Auth Error:', loginError);
        
        if (loginError.message.includes('Invalid login credentials')) {
          throw new Error('Verification failed: Incorrect email or security key.');
        }
        if (loginError.message.includes('Email not confirmed')) {
          throw new Error('Access denied: Email address not confirmed in Supabase.');
        }
        if (loginError.message.includes('rate limit')) {
          throw new Error('Too many attempts. Please wait a few minutes before trying again.');
        }
        throw loginError;
      }

      if (!data.user) {
        throw new Error('Authentication failed: No user identity returned.');
      }

      console.log('Login successful, user:', data.user.id);

      // 2. Success state
      setSuccess(true);
      
      // 3. Small delay for UX feedback then redirect
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1000);

    } catch (err: any) {
      console.error('Login processing error:', err);
      setError(err.message || 'A secure connection could not be established.');
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-20 h-20 bg-primary mb-8 flex items-center justify-center font-display font-black text-3xl border-4 border-black"
        >
          AM
        </motion.div>
        <div className="flex flex-col items-center gap-4 max-w-sm text-center">
          <Loader2 className="animate-spin text-primary w-10 h-10" />
          <div className="space-y-1">
            <h2 className="text-sm font-black uppercase tracking-widest">Initializing Control Panel</h2>
            <p className="text-xs text-zinc-500 font-mono">Establishing secure connection to Supabase...</p>
          </div>
          
          {/* Fallback button if stuck */}
          <button 
            onClick={() => setCheckingSession(false)}
            className="mt-8 text-[10px] uppercase tracking-widest font-bold text-zinc-400 hover:text-primary transition-colors underline underline-offset-4"
          >
            Force Load Interface
          </button>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-800 p-8 shadow-[12px_12px_0px_#FFD700] rounded-sm"
        >
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-primary mx-auto flex items-center justify-center font-display font-black text-2xl text-black border-2 border-black mb-4 rounded-sm">
              AM
            </div>
            <h1 className="text-3xl font-display font-black uppercase tracking-tighter">Admin Portal</h1>
            <p className="text-zinc-500 text-sm font-medium mt-2 uppercase tracking-widest">Restricted Access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm flex items-center gap-3 overflow-hidden"
                >
                  <AlertCircle size={18} className="shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              {success && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-sm flex items-center gap-3 overflow-hidden"
                >
                  <CheckCircle2 size={18} className="shrink-0" />
                  <span>Login successful! Redirecting to dashboard...</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest opacity-60">Email Address</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                  type="email"
                  required
                  disabled={loading || success}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 p-4 pl-12 shadow-inner outline-none focus:border-primary transition-all font-mono text-sm disabled:opacity-50"
                  placeholder="admin@ali-mughal.de"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest opacity-60">Security Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                  type="password"
                  required
                  disabled={loading || success}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 p-4 pl-12 shadow-inner outline-none focus:border-primary transition-all font-mono text-sm disabled:opacity-50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-4 font-black uppercase tracking-widest hover:bg-primary hover:text-black active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Processing...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle2 size={20} />
                  <span>Authorized</span>
                </>
              ) : (
                <>
                  <span>Authorize Access</span>
                  <motion.span 
                    animate={{ x: [0, 5, 0] }} 
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    →
                  </motion.span>
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-zinc-400">
            Forgot your password? <span className="text-primary cursor-pointer hover:underline">Contact Support</span>
          </p>

          <div className="mt-12 pt-8 border-t border-zinc-100 dark:border-zinc-800 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                dbStatus === 'connected' ? 'bg-green-500 animate-pulse' : 
                dbStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'
              }`} />
              <span className="text-[10px] uppercase tracking-widest font-black">
                {dbStatus === 'connected' ? 'Database: Live' : 
                 dbStatus === 'error' ? 'Database: Error' : 'Database: Checking...'}
              </span>
            </div>

            {dbStatus === 'error' && (
              <div className="w-full bg-zinc-50 dark:bg-black/50 p-4 border border-zinc-200 dark:border-zinc-800 rounded-sm">
                <p className="text-[10px] font-black uppercase mb-2 text-zinc-400">Connection Guide</p>
                <ul className="text-[9px] text-zinc-500 space-y-1 list-disc pl-4 font-medium uppercase tracking-wider">
                  <li>Visit <a href="https://supabase.com/dashboard" target="_blank" className="text-primary hover:underline">Supabase Dashboard</a></li>
                  <li>Go to <span className="text-white">Project Settings &gt; API</span></li>
                  <li>Ensure URL matches <code className="text-white">https://[id].supabase.co</code></li>
                  <li>Ensure the key used is <span className="text-white">anon public</span> (starts with <code className="text-white">eyJ...</code>)</li>
                  <li>Verify Email Auth is enabled in <span className="text-white">Authentication &gt; Providers</span></li>
                </ul>
              </div>
            )}

            <div className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
              Ali-Mughal Security Cloud v1.2.0
            </div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default AdminLogin;
