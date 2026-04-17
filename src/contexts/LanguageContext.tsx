import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { type Language, type TranslationKey, t as translate } from '../i18n/translations';

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'ja',
  setLang: () => {},
  t: (key) => translate('ja', key),
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('ksa_lang');
    return (saved as Language) ?? 'ja';
  });

  useEffect(() => {
    localStorage.setItem('ksa_lang', lang);
  }, [lang]);

  const setLang = (l: Language) => setLangState(l);
  const t = (key: TranslationKey) => translate(lang, key);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
