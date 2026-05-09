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
    { to: '/exam', label: '模擬試験', icon: GraduationCap },
    { to: '/my-page', label: t.myPage, icon: User },
  ];

  const currentLang = LANG_OPTIONS.find((o) => o.lang === lang)!;

  return (
    <nav className="fixed top-0 w-full z-50" style={{ background: '#1E1B4B', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">

        {/* Logo */}
        <Link to="/" className="font-bold text-white text-lg tracking-tight flex items-center gap-2">
          <span style={{ background: '#4F46E5', padding: '3px 10px', borderRadius: 8, fontSize: 14 }}>KSA</span>
          <span className="text-white/70 text-sm font-normal hidden sm:block">介護福祉士</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="px-3 py-1.5 rounded-md text-sm transition-colors"
              style={{
                color: location.pathname === to ? '#fff' : 'rgba(255,255,255,0.6)',
                background: location.pathname === to ? 'rgba(255,255,255,0.12)' : 'transparent',
                fontWeight: location.pathname === to ? 600 : 400,
              }}
            >
              {label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors"
              style={{ color: 'rgba(255,255,255,0.6)' }}
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
              className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md transition-colors"
              style={{ color: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              {currentLang.flag} {currentLang.label}
            </button>
            {showLang && (
              <div className="absolute right-0 top-full mt-1 w-36 rounded-lg shadow-xl z-50 overflow-hidden"
                style={{ background: '#1E1B4B', border: '1px solid rgba(255,255,255,0.12)' }}>
                {LANG_OPTIONS.map((opt) => (
                  <button
                    key={opt.lang}
                    onClick={() => { setLang(opt.lang); setShowLang(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors"
                    style={{ color: lang === opt.lang ? '#A5B4FC' : 'rgba(255,255,255,0.65)' }}
                  >
                    {opt.flag} {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/70 truncate max-w-[120px]">{user.name}</span>
              <button
                onClick={onSignOut}
                className="flex items-center gap-1 text-xs transition-colors"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                <LogOut size={13} />
                {t.signOut}
              </button>
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="flex items-center gap-1.5 text-sm font-semibold px-4 py-1.5 rounded-lg transition-all"
              style={{ background: '#4F46E5', color: '#fff' }}
            >
              <LogIn size={13} />
              {t.signIn}
            </button>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden"
          style={{ color: 'rgba(255,255,255,0.7)' }}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden px-4 py-4 space-y-1" style={{ background: '#1E1B4B', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors"
              style={{
                color: location.pathname === to ? '#fff' : 'rgba(255,255,255,0.6)',
                background: location.pathname === to ? 'rgba(255,255,255,0.1)' : 'transparent',
              }}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin" onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm"
              style={{ color: 'rgba(255,255,255,0.6)' }}>
              <ShieldCheck size={15} />Admin
            </Link>
          )}

          {/* Language */}
          <div className="pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-xs px-1 mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Language</p>
            <div className="grid grid-cols-3 gap-1.5">
              {LANG_OPTIONS.map((opt) => (
                <button
                  key={opt.lang}
                  onClick={() => setLang(opt.lang)}
                  className="text-xs px-2 py-1.5 rounded-md border transition-colors"
                  style={{
                    borderColor: lang === opt.lang ? '#818CF8' : 'rgba(255,255,255,0.1)',
                    color: lang === opt.lang ? '#A5B4FC' : 'rgba(255,255,255,0.5)',
                    background: lang === opt.lang ? 'rgba(79,70,229,0.2)' : 'transparent',
                  }}
                >
                  {opt.flag} {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            {user ? (
              <div className="flex items-center justify-between px-1">
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{user.name}</span>
                <button onClick={() => { onSignOut(); setMobileOpen(false); }}
                  className="flex items-center gap-1 text-sm"
                  style={{ color: 'rgba(255,255,255,0.5)' }}>
                  <LogOut size={14} />{t.signOut}
                </button>
              </div>
            ) : (
              <button
                onClick={() => { onSignIn(); setMobileOpen(false); }}
                className="w-full flex items-center justify-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg"
                style={{ background: '#4F46E5', color: '#fff' }}
              >
                <LogIn size={14} />{t.signInRegister}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
