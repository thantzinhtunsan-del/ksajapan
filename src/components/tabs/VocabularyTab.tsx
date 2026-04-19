import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookMarked, Search, Volume2, Lock } from 'lucide-react';
import PaywallBanner from '../PaywallBanner';
import { useLang } from '../../context/LanguageContext';
import { VOCAB_DATA } from '../../lib/i18n';

const FREE_VOCAB_LIMIT = 20;

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
  const [flipped, setFlipped] = useState<string | null>(null);
  const { lang, t } = useLang();

  const category = SLUG_TO_CATEGORY[subjectSlug];
  const allVocab = useMemo(
    () => VOCAB_DATA.filter((v) => v.category === category),
    [category]
  );

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

  const visible = isPaid ? filtered : filtered.slice(0, FREE_VOCAB_LIMIT);
  const locked = !isPaid && filtered.length > FREE_VOCAB_LIMIT;

  function speak(word: string) {
    if ('speechSynthesis' in window) {
      const utt = new SpeechSynthesisUtterance(word);
      utt.lang = 'ja-JP';
      window.speechSynthesis.speak(utt);
    }
  }

  if (allVocab.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-gray-500 gap-3">
        <BookMarked size={32} className="opacity-40" />
        <p className="text-sm">{t.vocabPreparing}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <BookMarked size={18} className="text-metallic-gold" />
        <h3 className="font-semibold text-white">{t.vocabTitle}</h3>
        <span className="text-xs text-gray-500 ml-auto">{t.vocabWords(allVocab.length)}</span>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t.vocabSearch}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-metallic-gold/40 transition-all"
        />
      </div>

      {/* Vocab cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {visible.map((v, i) => (
          <motion.div
            key={v.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => setFlipped(flipped === v.id ? null : v.id)}
            className="cursor-pointer border border-white/8 rounded-2xl p-4 bg-white/2 hover:bg-white/5 hover:border-metallic-gold/20 transition-all select-none"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  {/* Word — never translated, always Japanese */}
                  <span className="text-base font-bold text-white">{v.word}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); speak(v.word); }}
                    className="text-gray-500 hover:text-metallic-gold transition-colors"
                  >
                    <Volume2 size={13} />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{v.reading}</p>
              </div>
            </div>

            <AnimatePresence>
              {flipped === v.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  {/* Meaning shown in current UI language */}
                  <p className="text-xs text-metallic-gold mt-3 pt-3 border-t border-white/8 leading-relaxed">
                    {v.meaning[lang]}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {locked && !search && (
        <div className="flex items-center gap-2 justify-center py-2">
          <Lock size={13} className="text-gray-600" />
          <span className="text-xs text-gray-500">{t.vocabLocked(allVocab.length - FREE_VOCAB_LIMIT)}</span>
        </div>
      )}

      {locked && (
        <PaywallBanner onUpgrade={onUpgrade} message={t.vocabPaidOnly(allVocab.length - FREE_VOCAB_LIMIT)} />
      )}
    </div>
  );
}
