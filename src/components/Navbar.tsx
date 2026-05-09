import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, LogOut, Home, User, ShieldCheck, GraduationCap } from 'lucide-react';
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const location = useLocation();
  const t = T[lang];

  const links = [
    { to: '/', label: t.home, icon: Home },
    { to: '/exam', label: '国試模擬', icon: GraduationCap },
    { to: '/my-page', label: t.myPage, icon: User },
  ];

  const currentLang = LANG_OPTIONS.find((o) => o.lang === lang)!;

  return (
    <nav className="fixed top-0 w-full z-50 bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">

        {/* Logo */}
        <Link to="/" className="font-bold text-gray-900 text-lg tracking-tight">
          KSA
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                location.pathname === to
                  ? 'text-blue-600 font-medium'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm transition-colors ${
                location.pathname === '/admin' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ShieldCheck size={13} />
              Admin
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language */}
          <div className="relative">
            <button
              onClick={() => setShowLang(!showLang)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 px-2 py-1.5 rounded border border-gray-200 hover:border-gray-300 transition-colors"
            >
              {currentLang.flag} {currentLang.label}
            </button>
            {showLang && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-gray-200 rounded shadow-sm z-50">
                {LANG_OPTIONS.map((opt) => (
                  <button
                    key={opt.lang}
                    onClick={() => { setLang(opt.lang); setShowLang(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors ${
                      lang === opt.lang ? 'text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {opt.flag} {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700 truncate max-w-[120px]">{user.name}</span>
              <button
                onClick={onSignOut}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors"
              >
                <LogOut size={13} />
                {t.signOut}
              </button>
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="flex items-center gap-1.5 text-sm font-medium bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 transition-colors"
            >
              <LogIn size={13} />
              {t.signIn}
            </button>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-gray-600 hover:text-gray-900"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors ${
                location.pathname === to ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-50"
            >
              <ShieldCheck size={15} />
              Admin
            </Link>
          )}

          {/* Language */}
          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-2 px-1">Language</p>
            <div className="grid grid-cols-3 gap-1.5">
              {LANG_OPTIONS.map((opt) => (
                <button
                  key={opt.lang}
                  onClick={() => setLang(opt.lang)}
                  className={`text-xs px-2 py-1.5 rounded border transition-colors ${
                    lang === opt.lang ? 'border-blue-300 text-blue-600 bg-blue-50' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {opt.flag} {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100">
            {user ? (
              <div className="flex items-center justify-between px-1">
                <span className="text-sm text-gray-700">{user.name}</span>
                <button
                  onClick={() => { onSignOut(); setMobileOpen(false); }}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
                >
                  <LogOut size={14} />
                  {t.signOut}
                </button>
              </div>
            ) : (
              <button
                onClick={() => { onSignIn(); setMobileOpen(false); }}
                className="w-full flex items-center justify-center gap-1.5 text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                <LogIn size={14} />
                {t.signInRegister}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
