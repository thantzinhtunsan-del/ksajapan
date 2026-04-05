import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

function mapSupabaseError(message: string): string {
  if (message.includes('Password should be')) return 'Password must be at least 6 characters.';
  if (message.includes('Auth session missing')) return 'Reset link has expired. Please request a new one.';
  if (message.includes('same password')) return 'New password must be different from your current password.';
  return message;
}

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    // Check for existing session (e.g. after page refresh)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setSessionReady(true);
    });

    // Supabase fires PASSWORD_RECOVERY when the recovery token in the URL is processed
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setSessionReady(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError(mapSupabaseError(error.message));
      } else {
        setSuccess(true);
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-matte-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-metallic-gold/25 rounded-3xl shadow-[0_0_60px_rgba(212,175,55,0.12)] overflow-hidden">
        {/* Gold top accent line */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-metallic-gold to-transparent" />

        <div className="p-8 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-metallic-gold/60 mb-1">Account</p>
          <h2 className="text-2xl font-bold text-white mb-8">Set New Password</h2>

          {success ? (
            <div className="space-y-4 text-center">
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-green-400 text-sm"
              >
                Password updated successfully!
              </motion.p>
              <a
                href="/"
                className="inline-block text-metallic-gold hover:text-white text-sm font-semibold transition-colors"
              >
                ← Back to home
              </a>
            </div>
          ) : !sessionReady ? (
            <p className="text-gray-400 text-sm text-center">Verifying reset link…</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="New Password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-12 py-3.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-metallic-gold/50 focus:bg-white/8 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-400 text-xs px-1"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className="w-full gold-button flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Updating…
                  </span>
                ) : (
                  <>Update Password<ArrowRight size={16} /></>
                )}
              </motion.button>

              <p className="text-center text-sm text-gray-500">
                <a href="/" className="text-metallic-gold hover:text-white font-semibold transition-colors">
                  ← Back to home
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
