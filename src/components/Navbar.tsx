import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, LogIn, LogOut, Home, HelpCircle, User, ShieldCheck, GraduationCap } from 'lucide-react';
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
    <nav className="fixed top-0 w-full z-50 bg-matte-black/80 backdrop-blur-md border-b border-metallic-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link to="/">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold tracking-tighter"
            >
              <span className="text-white">KSA</span>
              <span className="text-metallic-gold">.</span>
            </motion.div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? 'text-metallic-gold bg-metallic-gold/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
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
                    ? 'text-metallic-gold bg-metallic-gold/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <ShieldCheck size={14} />
                Admin
              </Link>
            )}
          </div>

          {/* Desktop right side: language switcher + auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20 transition-all"
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
                    className="absolute right-0 top-full mt-2 w-40 bg-matte-black border border-white/10 rounded-xl shadow-xl overflow-hidden z-50"
                  >
                    {LANG_OPTIONS.map((opt) => (
                      <button
                        key={opt.lang}
                        onClick={() => { setLang(opt.lang); setShowLangMenu(false); }}
                        className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${
                          lang === opt.lang
                            ? 'bg-metallic-gold/15 text-metallic-gold'
                            : 'text-gray-300 hover:bg-white/5'
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
                <span className="text-sm text-metallic-gold font-medium truncate max-w-[120px]">
                  {user.name}
                </span>
                <button
                  onClick={onSignOut}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20 transition-all"
                >
                  <LogOut size={13} />
                  {t.signOut}
                </button>
              </>
            ) : (
              <button
                onClick={onSignIn}
                className="flex items-center gap-2 text-sm font-semibold text-matte-black bg-metallic-gold px-5 py-2 rounded-full hover:bg-gold-muted transition-all hover:scale-105 active:scale-95"
              >
                <LogIn size={15} />
                {t.signIn}
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[9999] md:hidden flex flex-col p-8"
            style={{ backgroundColor: '#050505', backdropFilter: 'blur(0px)' }}
          >
            <div className="flex justify-between items-center mb-10">
              <Link to="/" onClick={() => setIsOpen(false)}>
                <div className="text-2xl font-bold tracking-tighter">
                  <span className="text-white">KSA</span>
                  <span className="text-metallic-gold">.</span>
                </div>
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white transition-colors"
              >
                <X size={28} />
              </button>
            </div>

            {/* Mobile nav links */}
            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map(({ to, label, icon: Icon }) => {
                const isActive = location.pathname === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                      isActive
                        ? 'text-metallic-gold bg-metallic-gold/10'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
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
                    location.pathname === '/admin'
                      ? 'text-metallic-gold bg-metallic-gold/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <ShieldCheck size={18} />
                  Admin
                </Link>
              )}
            </nav>

            {/* Mobile language switcher */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 px-1">Language / 言語</p>
              <div className="grid grid-cols-2 gap-2">
                {LANG_OPTIONS.map((opt) => (
                  <button
                    key={opt.lang}
                    onClick={() => setLang(opt.lang)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm border transition-all ${
                      lang === opt.lang
                        ? 'bg-metallic-gold/15 text-metallic-gold border-metallic-gold/30'
                        : 'text-gray-400 border-white/10 hover:bg-white/5'
                    }`}
                  >
                    <span>{opt.flag}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-8 border-t border-white/10">
              {user ? (
                <div className="flex items-center justify-between">
                  <p className="text-metallic-gold font-bold truncate max-w-[180px]">{user.name}</p>
                  <button
                    onClick={() => { onSignOut(); setIsOpen(false); }}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    <LogOut size={16} />
                    {t.signOut}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { onSignIn(); setIsOpen(false); }}
                  className="w-full gold-button flex items-center justify-center gap-2"
                >
                  <LogIn size={18} />
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
