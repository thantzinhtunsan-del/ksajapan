import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, LogIn, LogOut, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { LANGUAGE_FLAGS, LANGUAGE_NAMES, type Language } from '../i18n/translations';
import { ALL_SUBJECTS } from './SubjectsGrid';

type Page = 'home' | 'subjects' | 'subject' | 'help' | 'mypage';

interface NavbarProps {
  user: { name: string; email: string } | null;
  activePage: Page;
  onNavigate: (page: Page, subject?: string) => void;
  onSignIn: () => void;
  onSignOut: () => void;
}

export default function Navbar({
  user,
  activePage,
  onNavigate,
  onSignIn,
  onSignOut,
}: NavbarProps) {
  const { t, lang, setLang } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [subjectDropOpen, setSubjectDropOpen] = useState(false);
  const [langDropOpen, setLangDropOpen] = useState(false);
  const subjectRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (subjectRef.current && !subjectRef.current.contains(e.target as Node)) {
        setSubjectDropOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangDropOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLink = (page: Page, label: string) => (
    <button
      onClick={() => onNavigate(page)}
      className={`text-sm font-medium transition-colors ${
        activePage === page
          ? 'text-metallic-gold'
          : 'text-gray-400 hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  return (
    <nav className="fixed top-0 w-full z-50 bg-matte-black/80 backdrop-blur-md border-b border-metallic-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => onNavigate('home')}
            className="text-2xl font-bold tracking-tighter"
          >
            <span className="text-white">KSA</span>
            <span className="text-metallic-gold">.</span>
          </motion.button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLink('home', t('nav_home'))}

            {/* 科目 dropdown */}
            <div ref={subjectRef} className="relative">
              <button
                onClick={() => setSubjectDropOpen(!subjectDropOpen)}
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                  activePage === 'subjects' || activePage === 'subject'
                    ? 'text-metallic-gold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {t('nav_subjects')}
                <motion.span animate={{ rotate: subjectDropOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={14} />
                </motion.span>
              </button>

              <AnimatePresence>
                {subjectDropOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                  >
                    <button
                      onClick={() => { onNavigate('subjects'); setSubjectDropOpen(false); }}
                      className="w-full px-4 py-3 text-left text-sm text-metallic-gold font-semibold hover:bg-white/5 border-b border-white/8 transition-colors"
                    >
                      {t('nav_all_subjects')}
                    </button>
                    <div className="max-h-72 overflow-y-auto">
                      {ALL_SUBJECTS.map((subject) => (
                        <button
                          key={subject}
                          onClick={() => { onNavigate('subject', subject); setSubjectDropOpen(false); }}
                          className="w-full px-4 py-2.5 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                        >
                          {subject}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLink('help', t('nav_help'))}
            {user && navLink('mypage', t('nav_mypage'))}
          </div>

          {/* Right side: language switcher + auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language switcher */}
            <div ref={langRef} className="relative">
              <button
                onClick={() => setLangDropOpen(!langDropOpen)}
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20 transition-all"
              >
                <span>{LANGUAGE_FLAGS[lang]}</span>
                <span className="text-xs">{lang.toUpperCase()}</span>
                <ChevronDown size={12} />
              </button>

              <AnimatePresence>
                {langDropOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-2 w-48 bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                  >
                    {(['ja', 'my', 'ne', 'vi'] as Language[]).map((l) => (
                      <button
                        key={l}
                        onClick={() => { setLang(l); setLangDropOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                          lang === l
                            ? 'text-metallic-gold bg-metallic-gold/10'
                            : 'text-gray-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span className="text-lg">{LANGUAGE_FLAGS[l]}</span>
                        <span>{LANGUAGE_NAMES[l]}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Auth */}
            {user ? (
              <>
                <span className="text-sm text-metallic-gold font-medium">{user.name}</span>
                <button
                  onClick={onSignOut}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20 transition-all"
                >
                  <LogOut size={13} />
                  {t('auth_signout')}
                </button>
              </>
            ) : (
              <button
                onClick={onSignIn}
                className="flex items-center gap-2 text-sm font-semibold text-matte-black bg-metallic-gold px-5 py-2 rounded-full hover:bg-gold-muted transition-all hover:scale-105 active:scale-95"
              >
                <LogIn size={15} />
                {t('auth_signin')}
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-gray-400 hover:text-white focus:outline-none"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 md:hidden bg-matte-black flex flex-col p-8 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-8">
              <div className="text-2xl font-bold tracking-tighter">
                <span className="text-white">KSA</span>
                <span className="text-metallic-gold">.</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white transition-colors"
              >
                <X size={28} />
              </button>
            </div>

            {/* Mobile nav links */}
            <div className="flex flex-col gap-2">
              {[
                { page: 'home' as Page, label: t('nav_home') },
                { page: 'subjects' as Page, label: t('nav_subjects') },
                { page: 'help' as Page, label: t('nav_help') },
                ...(user ? [{ page: 'mypage' as Page, label: t('nav_mypage') }] : []),
              ].map(({ page, label }) => (
                <button
                  key={page}
                  onClick={() => { onNavigate(page); setMobileOpen(false); }}
                  className={`text-left px-4 py-3 rounded-xl text-lg font-semibold transition-colors ${
                    activePage === page
                      ? 'text-metallic-gold bg-metallic-gold/10'
                      : 'text-white hover:bg-white/5'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Mobile subject list */}
            <div className="mt-6">
              <p className="text-xs text-gray-500 uppercase tracking-wider px-4 mb-2">
                {t('nav_subjects')}
              </p>
              <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                {ALL_SUBJECTS.map((subject) => (
                  <button
                    key={subject}
                    onClick={() => { onNavigate('subject', subject); setMobileOpen(false); }}
                    className="text-left px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            {/* Language switcher mobile */}
            <div className="mt-6">
              <p className="text-xs text-gray-500 uppercase tracking-wider px-4 mb-2">
                {t('mypage_language')}
              </p>
              <div className="flex flex-wrap gap-2 px-1">
                {(['ja', 'my', 'ne', 'vi'] as Language[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      lang === l
                        ? 'bg-metallic-gold text-matte-black'
                        : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    <span>{LANGUAGE_FLAGS[l]}</span>
                    <span>{LANGUAGE_NAMES[l]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Auth mobile */}
            <div className="mt-auto pt-8 border-t border-white/10">
              {user ? (
                <div className="flex items-center justify-between">
                  <p className="text-metallic-gold font-bold">{user.name}</p>
                  <button
                    onClick={() => { onSignOut(); setMobileOpen(false); }}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    <LogOut size={16} />
                    {t('auth_signout')}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { onSignIn(); setMobileOpen(false); }}
                  className="w-full gold-button flex items-center justify-center gap-2"
                >
                  <LogIn size={18} />
                  {t('auth_signin_signup')}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
