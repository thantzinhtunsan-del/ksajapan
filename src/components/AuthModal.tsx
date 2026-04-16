/**
 * AuthModal.tsx
 * Drop this into: src/components/AuthModal.tsx
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, ArrowRight, Eye, EyeOff, FlaskConical } from 'lucide-react';
import { supabase, insertProfile, DEMO_MODE } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: { name: string; email: string }) => void;
}

// ─── Demo mode in-memory store ────────────────────────────────────────────────
// Pre-seeded accounts so the admin panel is accessible immediately.
const demoUsers = new Map<string, { name: string; password: string }>([
  ['admin@ksajapan.com', { name: 'Admin',     password: 'admin123' }],
  ['admin@ksa.com',      { name: 'KSA Admin', password: 'admin123' }],
]);

function demoSignUp(email: string, password: string, name: string): string | null {
  const key = email.toLowerCase();
  if (demoUsers.has(key)) return 'An account with this email already exists.';
  demoUsers.set(key, { name, password });
  return null; // null = success
}

function demoSignIn(email: string, password: string): { name: string; email: string } | string {
  const user = demoUsers.get(email.toLowerCase());
  if (!user || user.password !== password) return 'Invalid email or password.';
  return { name: user.name, email: email.toLowerCase() };
}

// ─── Supabase error map ───────────────────────────────────────────────────────

function mapSupabaseError(message: string): string {
  if (message.includes('Invalid login credentials')) return 'Invalid email or password.';
  if (message.includes('Email not confirmed'))       return 'Please confirm your email before signing in.';
  if (message.includes('User already registered'))   return 'An account with this email already exists.';
  if (message.includes('Password should be'))        return 'Password must be at least 6 characters.';
  return message;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side pre-validation
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    if (mode === 'signup' && !form.name) {
      setError('Please enter your name.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      // ── Demo mode (no Supabase configured) ───────────────────────────────
      if (DEMO_MODE) {
        await new Promise((r) => setTimeout(r, 400)); // feel like a real network call
        if (mode === 'signup') {
          const err = demoSignUp(form.email, form.password, form.name);
          if (err) { setError(err); return; }
          onAuthSuccess({ name: form.name, email: form.email.toLowerCase() });
        } else {
          const result = demoSignIn(form.email, form.password);
          if (typeof result === 'string') { setError(result); return; }
          onAuthSuccess(result);
        }
        return;
      }

      // ── Real Supabase auth ────────────────────────────────────────────────
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: { data: { full_name: form.name } },
        });
        if (error) { setError(mapSupabaseError(error.message)); return; }
        const user = data.user;
        if (!user) { setError('Sign up failed. Please try again.'); return; }
        try { await insertProfile(user.id, form.name); } catch { /* non-fatal */ }
        onAuthSuccess({
          name: user.user_metadata?.full_name ?? form.name,
          email: user.email ?? form.email,
        });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) { setError(mapSupabaseError(error.message)); return; }
        const user = data.user;
        onAuthSuccess({
          name: user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? '',
          email: user.email ?? form.email,
        });
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError('');
    setForm({ name: '', email: '', password: '' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-md bg-[#0a0a0a] border border-metallic-gold/25 rounded-3xl shadow-[0_0_60px_rgba(212,175,55,0.12)] overflow-hidden">

              {/* Gold top accent line */}
              <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-metallic-gold to-transparent" />

              <div className="p-8 sm:p-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-metallic-gold/60 mb-1">
                      {mode === 'signin' ? 'Welcome back' : 'Join the academy'}
                    </p>
                    <h2 className="text-2xl font-bold text-white">
                      {mode === 'signin' ? 'Sign In' : 'Create Account'}
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Demo mode notice */}
                {DEMO_MODE && (
                  <div className="mb-6 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-center gap-2 mb-1.5">
                      <FlaskConical size={13} className="text-amber-400 shrink-0" />
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Demo Mode</span>
                    </div>
                    <p className="text-xs text-amber-300/80 leading-relaxed">
                      Supabase is not configured. Use the pre-seeded admin account or sign up with any email.
                    </p>
                    <div className="mt-2 text-xs text-amber-400/70 font-mono space-y-0.5">
                      <div>Email: <span className="text-amber-300">admin@ksajapan.com</span></div>
                      <div>Password: <span className="text-amber-300">admin123</span></div>
                    </div>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <AnimatePresence>
                    {mode === 'signup' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="relative">
                          <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                          <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Full Name"
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-metallic-gold/50 focus:bg-white/8 transition-all"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-metallic-gold/50 focus:bg-white/8 transition-all"
                    />
                  </div>

                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Password"
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

                  {/* Error */}
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

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    className="w-full gold-button flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        {mode === 'signin' ? 'Signing In...' : 'Creating Account...'}
                      </span>
                    ) : (
                      <>
                        {mode === 'signin' ? 'Sign In' : 'Create Account'}
                        <ArrowRight size={16} />
                      </>
                    )}
                  </motion.button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-xs text-gray-600 uppercase tracking-widest">or</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* Switch mode */}
                <p className="text-center text-sm text-gray-500">
                  {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
                  <button
                    onClick={switchMode}
                    className="text-metallic-gold hover:text-white font-semibold transition-colors"
                  >
                    {mode === 'signin' ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
