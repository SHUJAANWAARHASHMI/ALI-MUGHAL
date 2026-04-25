import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, User, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
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
    const init = async () => {
      try {
        // Test connection by fetching public settings
        const { error: dbError } = await supabase.from('settings').select('key').limit(1);
        setDbStatus(dbError && !dbError.message.includes('relation "settings" does not exist') ? 'error' : 'connected');

        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          navigate('/admin/dashboard', { replace: true });
        }
      } catch (err) {
        console.error('Initialization failed:', err);
        setDbStatus('error');
      } finally {
        setCheckingSession(false);
      }
    };
    init();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // 1. Attempt login
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (loginError) {
        console.error('Supabase Auth Error:', loginError);
        // Specific error handling based on Supabase error codes or messages
        if (loginError.message.includes('Invalid login credentials')) {
          throw new Error('Wrong email or password. Please try again.');
        }
        if (loginError.message.includes('Email not confirmed')) {
          throw new Error('Your email is not verified yet. Please check your inbox or disable verification in Supabase Auth settings.');
        }
        throw loginError;
      }

      if (!data.user) {
        throw new Error('Login succeeded but no user data returned.');
      }

      // 2. Success state
      setSuccess(true);
      
      // 3. Small delay for UX feedback then redirect
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1500);

    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'An unexpected error occurred during login.');
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
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
