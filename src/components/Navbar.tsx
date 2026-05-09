import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, GraduationCap, Home } from 'lucide-react';
import type { Lang } from '../lib/i18n';
import { LANG_OPTIONS, T } from '../lib/i18n';

interface NavbarProps {
  lang: Lang;
  setLang: (l: Lang) => void;
  isAdmin?: boolean;
}

export default function Navbar({ lang, setLang, isAdmin }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const location = useLocation();
  const t = T[lang];

  const links = [
    { to: '/', label: t.home, icon: Home },
    { to: '/exam', label: '模擬試験', icon: GraduationCap },
  ];

  const currentLang = LANG_OPTIONS.find((o) => o.lang === lang)!;

  return (
    <nav className="fixed top-0 w-full z-50"
      style={{ background: '#0C4A6E', borderBottom: '1px solid #075985' }}>
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">

        {/* Logo */}
        <Link to="/" className="font-bold text-white text-lg tracking-tight flex items-center gap-2">
          <span style={{ background: '#0284C7', padding: '3px 10px', borderRadius: 8, fontSize: 14, fontWeight: 700 }}>KSA</span>
          <span className="hidden sm:block text-sm font-normal" style={{ color: 'rgba(186,230,253,0.85)' }}>介護福祉士</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(({ to, label }) => (
            <Link key={to} to={to}
              className="px-3 py-1.5 rounded-lg text-sm transition-colors"
              style={{
                color: location.pathname === to ? '#fff' : 'rgba(186,230,253,0.8)',
                background: location.pathname === to ? 'rgba(255,255,255,0.15)' : 'transparent',
                fontWeight: location.pathname === to ? 600 : 400,
              }}>
              {label}
            </Link>
          ))}
        </div>

        {/* Language picker */}
        <div className="hidden md:block relative">
          <button
            onClick={() => setShowLang(!showLang)}
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-colors"
            style={{ color: 'rgba(186,230,253,0.8)', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(186,230,253,0.2)' }}
          >
            {currentLang.flag} {currentLang.label}
          </button>
          {showLang && (
            <div className="absolute right-0 top-full mt-1 w-36 rounded-xl shadow-xl z-50 overflow-hidden"
              style={{ background: '#075985', border: '1px solid rgba(186,230,253,0.15)' }}>
              {LANG_OPTIONS.map((opt) => (
                <button key={opt.lang}
                  onClick={() => { setLang(opt.lang); setShowLang(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors"
                  style={{ color: lang === opt.lang ? '#7DD3FC' : 'rgba(186,230,253,0.75)' }}>
                  {opt.flag} {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden"
          style={{ color: 'rgba(186,230,253,0.8)' }}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden px-4 py-4 space-y-1"
          style={{ background: '#075985', borderTop: '1px solid rgba(186,230,253,0.1)' }}>
          {links.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm"
              style={{
                color: location.pathname === to ? '#fff' : 'rgba(186,230,253,0.75)',
                background: location.pathname === to ? 'rgba(255,255,255,0.12)' : 'transparent',
              }}>
              <Icon size={15} />{label}
            </Link>
          ))}
          <div className="pt-3" style={{ borderTop: '1px solid rgba(186,230,253,0.1)' }}>
            <p className="text-xs px-1 mb-2" style={{ color: 'rgba(186,230,253,0.4)' }}>Language</p>
            <div className="grid grid-cols-3 gap-1.5">
              {LANG_OPTIONS.map((opt) => (
                <button key={opt.lang} onClick={() => setLang(opt.lang)}
                  className="text-xs px-2 py-1.5 rounded-lg border"
                  style={{
                    borderColor: lang === opt.lang ? '#38BDF8' : 'rgba(186,230,253,0.15)',
                    color: lang === opt.lang ? '#7DD3FC' : 'rgba(186,230,253,0.6)',
                    background: lang === opt.lang ? 'rgba(2,132,199,0.25)' : 'transparent',
                  }}>
                  {opt.flag} {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
