import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import PageTransition from '../components/PageTransition';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-800 p-8 shadow-[12px_12px_0px_#FFD700]"
        >
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-primary mx-auto flex items-center justify-center font-display font-black text-2xl text-black border-2 border-black mb-4">
              AM
            </div>
            <h1 className="text-3xl font-display font-black uppercase tracking-tighter">Admin Portal</h1>
            <p className="text-zinc-500 text-sm font-medium mt-2 uppercase tracking-widest">Restricted Access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm flex items-center gap-3">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest opacity-60">Email</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 p-4 pl-12 outline-none focus:border-primary transition-colors font-mono text-sm"
                  placeholder="admin@ali-mughal.de"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest opacity-60">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 p-4 pl-12 outline-none focus:border-primary transition-colors font-mono text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-4 font-black uppercase tracking-widest hover:bg-primary hover:text-black transition-all flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Authorize Access'}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-zinc-100 dark:border-zinc-800 text-[10px] uppercase tracking-widest text-zinc-400 font-bold text-center">
            Ali-Mughal Security System v1.0.4
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default AdminLogin;
