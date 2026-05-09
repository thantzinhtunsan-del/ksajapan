import { useState, useMemo } from 'react';
import { Search, Volume2, BookMarked } from 'lucide-react';
import { useLang } from '../../context/LanguageContext';
import { VOCAB_DATA } from '../../lib/i18n';

const SLUG_TO_CATEGORY: Record<string, string> = {
  'ningen-no-songen': '人間の尊厳と自立',
  'ningen-kankei': '人間関係とコミュニケーション',
  'shakai-no-rikai': '社会の理解',
  'kokoro-to-karada': 'こころとからだのしくみ',
  'hattatsu-to-rouka': '発達と老化の理解',
  'ninchisho-no-rikai': '認知症の理解',
  'shogai-no-rikai': '障害の理解',
  'iryoteki-care': '医療的ケア',
  'kaigo-no-kihon': '介護の基本',
  'communication-gijutsu': 'コミュニケーション技術',
  'seikatsu-shien': '生活支援技術',
  'kaigo-katei': '介護過程',
  'sogo-mondai': '総合問題',
};

interface VocabularyTabProps {
  subjectSlug: string;
  isPaid: boolean;
  onUpgrade?: () => void;
}

export default function VocabularyTab({ subjectSlug, isPaid, onUpgrade }: VocabularyTabProps) {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const { lang, t } = useLang();

  const category = SLUG_TO_CATEGORY[subjectSlug];
  const allVocab = useMemo(() => VOCAB_DATA.filter((v) => v.category === category), [category]);

  const filtered = useMemo(() => {
    if (!search) return allVocab;
    const q = search.toLowerCase();
    return allVocab.filter(
      (v) =>
        v.word.toLowerCase().includes(q) ||
        v.reading.toLowerCase().includes(q) ||
        v.meaning[lang].toLowerCase().includes(q)
    );
  }, [allVocab, search, lang]);

  function speak(word: string) {
    if ('speechSynthesis' in window) {
      const utt = new SpeechSynthesisUtterance(word);
      utt.lang = 'ja-JP';
      window.speechSynthesis.speak(utt);
    }
  }

  if (allVocab.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 gap-2 text-gray-400">
        <BookMarked size={28} className="opacity-40" />
        <p className="text-sm">{t.vocabPreparing}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <p className="text-xs text-gray-400">{t.vocabWords(allVocab.length)}</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t.vocabSearch}
          className="w-full border border-gray-200 rounded pl-8 pr-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
        />
      </div>

      {/* Vocab list */}
      <div className="space-y-1.5">
        {filtered.map((v) => (
          <div
            key={v.id}
            onClick={() => setExpanded(expanded === v.id ? null : v.id)}
            className="cursor-pointer border border-gray-200 rounded px-4 py-3 bg-white hover:border-blue-300 transition-colors"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">{v.word}</span>
                <span className="text-xs text-gray-400">{v.reading}</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); speak(v.word); }}
                className="text-gray-300 hover:text-blue-500 transition-colors"
              >
                <Volume2 size={13} />
              </button>
            </div>
            {expanded === v.id && (
              <p className="text-xs text-blue-700 mt-2 pt-2 border-t border-gray-100">
                {v.meaning[lang]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
