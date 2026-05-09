import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, LogIn, LogOut, Home, HelpCircle, User, ShieldCheck, GraduationCap, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { Lang } from '../lib/i18n';
import { LANG_OPTIONS, T } from '../lib/i18n';

interface NavbarProps {
  user: { name: string; email: string } | null;
  onSignIn: () => void;
  onSignOut: () => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  isAdmin?: boolean;
}

export default function Navbar({ user, onSignIn, onSignOut, lang, setLang, isAdmin }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const location = useLocation();
  const t = T[lang];

  const NAV_LINKS = [
    { to: '/', label: t.home, icon: Home },
    { to: '/exam', label: '国試模擬', icon: GraduationCap },
    { to: '/help', label: t.help, icon: HelpCircle },
    { to: '/my-page', label: t.myPage, icon: User },
  ];

  const currentLang = LANG_OPTIONS.find((o) => o.lang === lang)!;

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-white/6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-violet flex items-center justify-center shadow-lg shadow-violet/30">
                <BookOpen size={15} className="text-white" />
              </div>
              <span className="text-lg font-bold text-ink tracking-tight">
                KSA<span className="text-violet">.</span>
              </span>
            </motion.div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? 'text-violet bg-violet/12 shadow-sm'
                      : 'text-ink-2 hover:text-ink hover:bg-white/5'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  location.pathname === '/admin'
                    ? 'text-violet bg-violet/12'
                    : 'text-ink-2 hover:text-ink hover:bg-white/5'
                }`}
              >
                <ShieldCheck size={14} />
                Admin
              </Link>
            )}
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-2">
            {/* Language */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1.5 text-xs text-ink-2 hover:text-ink px-3 py-1.5 rounded-full border border-white/8 hover:border-white/16 transition-all"
              >
                <span>{currentLang.flag}</span>
                <span>{currentLang.label}</span>
              </button>
              <AnimatePresence>
                {showLangMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-40 bg-surface-2 border border-white/8 rounded-xl shadow-xl overflow-hidden z-50"
                  >
                    {LANG_OPTIONS.map((opt) => (
                      <button
                        key={opt.lang}
                        onClick={() => { setLang(opt.lang); setShowLangMenu(false); }}
                        className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${
                          lang === opt.lang
                            ? 'bg-violet/15 text-violet'
                            : 'text-ink-2 hover:bg-white/5 hover:text-ink'
                        }`}
                      >
                        <span>{opt.flag}</span>
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {user ? (
              <>
                <span className="text-sm text-ink font-medium truncate max-w-[120px]">
                  {user.name}
                </span>
                <button
                  onClick={onSignOut}
                  className="flex items-center gap-1.5 text-xs text-ink-2 hover:text-rose px-3 py-1.5 rounded-full border border-white/8 hover:border-rose/30 transition-all"
                >
                  <LogOut size={13} />
                  {t.signOut}
                </button>
              </>
            ) : (
              <button
                onClick={onSignIn}
                className="violet-btn text-sm"
              >
                <LogIn size={14} />
                {t.signIn}
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-ink-2 hover:text-ink focus:outline-none"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed inset-0 z-[9999] md:hidden flex flex-col p-7 bg-navy"
          >
            <div className="flex justify-between items-center mb-8">
              <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-violet flex items-center justify-center">
                  <BookOpen size={15} className="text-white" />
                </div>
                <span className="text-lg font-bold text-ink tracking-tight">KSA<span className="text-violet">.</span></span>
              </Link>
              <button onClick={() => setIsOpen(false)} className="p-2 rounded-full bg-white/5 text-ink-2 hover:text-ink">
                <X size={22} />
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map(({ to, label, icon: Icon }) => {
                const isActive = location.pathname === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                      isActive
                        ? 'text-violet bg-violet/12'
                        : 'text-ink-2 hover:text-ink hover:bg-white/5'
                    }`}
                  >
                    <Icon size={18} />
                    {label}
                  </Link>
                );
              })}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    location.pathname === '/admin' ? 'text-violet bg-violet/12' : 'text-ink-2 hover:text-ink hover:bg-white/5'
                  }`}
                >
                  <ShieldCheck size={18} />
                  Admin
                </Link>
              )}
            </nav>

            <div className="mt-6 pt-6 border-t border-white/8">
              <p className="text-xs text-ink-2 uppercase tracking-wider mb-3 px-1">Language / 言語</p>
              <div className="grid grid-cols-2 gap-2">
                {LANG_OPTIONS.map((opt) => (
                  <button
                    key={opt.lang}
                    onClick={() => setLang(opt.lang)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm border transition-all ${
                      lang === opt.lang
                        ? 'bg-violet/15 text-violet border-violet/30'
                        : 'text-ink-2 border-white/8 hover:bg-white/5 hover:text-ink'
                    }`}
                  >
                    <span>{opt.flag}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-white/8">
              {user ? (
                <div className="flex items-center justify-between">
                  <p className="text-ink font-semibold truncate max-w-[180px]">{user.name}</p>
                  <button
                    onClick={() => { onSignOut(); setIsOpen(false); }}
                    className="flex items-center gap-2 text-sm text-ink-2 hover:text-rose transition-colors"
                  >
                    <LogOut size={16} />
                    {t.signOut}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { onSignIn(); setIsOpen(false); }}
                  className="w-full violet-btn justify-center text-sm"
                >
                  <LogIn size={16} />
                  {t.signInRegister}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
