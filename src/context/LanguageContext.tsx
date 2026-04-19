import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Lang } from '../lib/i18n';
import { T } from '../lib/i18n';
import type { TDict } from '../lib/i18n';

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: TDict;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'ja',
  setLang: () => {},
  t: T.ja,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem('ksa_lang');
    return (saved as Lang) || 'ja';
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('ksa_lang', l);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: T[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
