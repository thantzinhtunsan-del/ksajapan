import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, FileText, ClipboardList, BookOpen, Zap, Volume2, Search, Lock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import PdfViewer, { UpgradePrompt } from './PdfViewer';
import type { PdfDoc } from './PdfViewer';
import { supabase } from '../lib/supabase';
import PAST_QUESTIONS_JSON from '../data/pastQuestions.json';

// ── Types ──────────────────────────────────────────────────────────────────────
type SubjectTab = 'textbook' | 'pastquestions' | 'vocabulary' | 'examhacks';

interface Question {
  id: string;
  kai: string;
  subject: string;
  period: 'am' | 'pm';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface VocabItem {
  id: string;
  word: string;
  reading: string;
  burmese: string;
  nepali?: string;
  vietnamese?: string;
  japanese_meaning?: string;
  category: string;
}

const ALL_QUESTIONS: Question[] = PAST_QUESTIONS_JSON as Question[];

// ── Vocabulary mock data (categories map to subjects) ─────────────────────────
// In production this comes from Supabase; we fall back to the static list filtered by category.
const SUBJECT_CATEGORY_MAP: Record<string, string[]> = {
  '人間の尊厳と自立': ['基本理念'],
  '人間関係とコミュニケーション': ['コミュニケーション', '人間関係'],
  '社会の理解': ['社会保障', '介護保険', '高齢者・障害者', '生活保護', '社会福祉'],
  '介護の基本': ['基本理念', '介護倫理', '介護の基本'],
  'コミュニケーション技術': ['コミュニケーション技術', 'コミュニケーション'],
  '生活支援技術': ['生活支援', '生活支援技術'],
  '介護過程': ['介護過程'],
  '発達と老化の理解': ['老化', '発達', '高齢者・障害者'],
  '認知症の理解': ['認知症'],
  '障害の理解': ['障害', '高齢者・障害者'],
  'こころとからだのしくみ': ['こころとからだ', '医療・身体'],
  '医療的ケア': ['医療的ケア'],
  '総合問題': [], // empty = show all
};

// ── ExamHacks data (subject-specific tips) ────────────────────────────────────
interface SubjectData {
  coreIdea: string;
  highYield: string[];
  traps: string[];
  examHacks: string[];
  studyStrategy: string[];
  memoryTips: string[];
  sigmaMessage: string;
}

// Minimal inline data for subjects not covered in ExamHacks.tsx
const FALLBACK_EXAM_HACKS: Record<string, SubjectData> = {
  '人間関係とコミュニケーション': {
    coreIdea: '介護士として利用者や家族、チームとの良好な人間関係を築くための基礎を学ぶ。',
    highYield: [
      'バイステックの7原則（受容、共感、自己決定など）',
      'ラポール（信頼関係）の形成',
      '傾聴と共感的理解',
    ],
    traps: [
      '「同情」と「共感」の混同',
      '指示的な関わり方を正しいと選ぶミス',
    ],
    examHacks: [
      '「受容」が多くの問題で正解になる',
      '否定・説得・指示は基本的に誤り',
    ],
    studyStrategy: ['バイステックの7原則を確実に暗記する'],
    memoryTips: ['受容＝「そうですね」と受け止める姿勢'],
    sigmaMessage: '「コミュニケーションは技術だ。感情で動くな。原則で動け。」',
  },
};

// ── Main component ─────────────────────────────────────────────────────────────
interface SubjectPageProps {
  subject: string;
  userPlan: 'free' | 'paid';
  onBack: () => void;
}

export default function SubjectPage({ subject, userPlan, onBack }: SubjectPageProps) {
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<SubjectTab>('textbook');
  const [showUpgrade, setShowUpgrade] = useState(false);

  const TABS: { id: SubjectTab; label: string; icon: React.ElementType }[] = [
    { id: 'textbook', label: t('tab_textbook'), icon: FileText },
    { id: 'pastquestions', label: t('tab_past_questions'), icon: ClipboardList },
    { id: 'vocabulary', label: t('tab_vocabulary'), icon: BookOpen },
    { id: 'examhacks', label: t('tab_exam_hacks'), icon: Zap },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={16} />
          {t('back')}
        </button>
        <h1 className="text-2xl font-bold text-white">{subject}</h1>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 border-b border-white/10 pb-2 overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-metallic-gold text-matte-black shadow-lg shadow-metallic-gold/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'textbook' && (
            <TextbookTab
              subject={subject}
              userPlan={userPlan}
              onUpgradeClick={() => setShowUpgrade(true)}
            />
          )}
          {activeTab === 'pastquestions' && (
            <PastQuestionsTab subject={subject} userPlan={userPlan} onUpgradeClick={() => setShowUpgrade(true)} />
          )}
          {activeTab === 'vocabulary' && (
            <VocabularyTab subject={subject} lang={lang} />
          )}
          {activeTab === 'examhacks' && (
            <ExamHacksTab subject={subject} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Upgrade overlay */}
      <AnimatePresence>
        {showUpgrade && <UpgradePrompt onClose={() => setShowUpgrade(false)} />}
      </AnimatePresence>
    </div>
  );
}

// ── Textbook tab ───────────────────────────────────────────────────────────────
function TextbookTab({
  subject,
  userPlan,
  onUpgradeClick,
}: {
  subject: string;
  userPlan: 'free' | 'paid';
  onUpgradeClick: () => void;
}) {
  const { t } = useLanguage();
  const [docs, setDocs] = useState<PdfDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabase
      .from('subject_pdfs')
      .select('*')
      .eq('subject', subject)
      .order('display_order')
      .then(({ data }) => {
        setDocs((data as PdfDoc[]) ?? []);
        setLoading(false);
      });
  }, [subject]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        {t('loading')}
      </div>
    );
  }

  // Free users can only access first (non-premium) PDF
  const visibleDocs: PdfDoc[] =
    userPlan === 'paid'
      ? docs
      : docs.map((d, i) => ({
          ...d,
          is_premium: d.is_premium || i >= 1, // only first doc free
        }));

  return <PdfViewer docs={visibleDocs} userPlan={userPlan} onUpgradeClick={onUpgradeClick} />;
}

// ── Past questions tab ─────────────────────────────────────────────────────────
function PastQuestionsTab({
  subject,
  userPlan,
  onUpgradeClick,
}: {
  subject: string;
  userPlan: 'free' | 'paid';
  onUpgradeClick: () => void;
}) {
  const { t } = useLanguage();
  const [selectedKai, setSelectedKai] = useState<string>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const allKai = ['第31回', '第32回', '第33回', '第34回', '第35回', '第36回', '第37回', '第38回'];
  const freeKai = ['第36回', '第37回', '第38回']; // free users: only latest 3

  const subjectQuestions = ALL_QUESTIONS.filter((q) => q.subject === subject);
  const filteredByKai =
    selectedKai === 'all'
      ? subjectQuestions
      : subjectQuestions.filter((q) => q.kai === selectedKai);

  // Free users see only questions from free rounds
  const visibleQuestions =
    userPlan === 'paid'
      ? filteredByKai
      : filteredByKai.filter((q) => freeKai.includes(q.kai));

  const lockedCount =
    userPlan === 'free'
      ? filteredByKai.filter((q) => !freeKai.includes(q.kai)).length
      : 0;

  if (subjectQuestions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ClipboardList size={48} className="text-metallic-gold/30 mb-4" />
        <p className="text-gray-400">{t('pq_no_questions')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Kai selector */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedKai('all')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            selectedKai === 'all'
              ? 'bg-metallic-gold text-matte-black'
              : 'bg-white/5 text-gray-400 hover:text-white'
          }`}
        >
          {t('pq_all_exams')} ({subjectQuestions.length})
        </button>
        {allKai.map((kai) => {
          const count = subjectQuestions.filter((q) => q.kai === kai).length;
          const isLocked = userPlan === 'free' && !freeKai.includes(kai);
          return (
            <button
              key={kai}
              onClick={() => {
                if (isLocked) onUpgradeClick();
                else setSelectedKai(kai);
              }}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedKai === kai
                  ? 'bg-metallic-gold text-matte-black'
                  : isLocked
                  ? 'bg-white/3 text-gray-600'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              {isLocked && <Lock size={11} />}
              {kai} ({count})
            </button>
          );
        })}
      </div>

      {/* Locked banner for free users */}
      {lockedCount > 0 && (
        <div
          onClick={onUpgradeClick}
          className="flex items-center gap-3 p-4 rounded-xl bg-metallic-gold/5 border border-metallic-gold/20 cursor-pointer hover:bg-metallic-gold/10 transition-all"
        >
          <Lock size={16} className="text-metallic-gold shrink-0" />
          <p className="text-sm text-gray-300">
            {lockedCount}問が{t('premium_content')}です。
          </p>
          <button className="ml-auto text-xs font-bold text-metallic-gold shrink-0">
            {t('upgrade_now')} →
          </button>
        </div>
      )}

      {/* Questions list */}
      <div className="space-y-3">
        {visibleQuestions.map((q, idx) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
            className="rounded-xl border border-white/8 bg-white/2 overflow-hidden"
          >
            <button
              onClick={() => setExpanded(expanded === q.id ? null : q.id)}
              className="w-full text-left p-4 hover:bg-white/3 transition-all"
            >
              <div className="flex items-start gap-3">
                <span className="text-xs font-bold text-metallic-gold/70 mt-0.5 shrink-0">
                  {q.kai}
                </span>
                <p className="text-sm text-gray-200 leading-relaxed">{q.question}</p>
              </div>
            </button>

            <AnimatePresence>
              {expanded === q.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-white/8 overflow-hidden"
                >
                  <div className="p-4 space-y-2">
                    {q.options.map((opt, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-2 px-3 py-2 rounded-lg text-sm ${
                          i + 1 === q.correctAnswer
                            ? 'bg-green-500/10 border border-green-500/30 text-green-300'
                            : 'bg-white/3 text-gray-400'
                        }`}
                      >
                        <span className="font-bold shrink-0">{i + 1}.</span>
                        <span>{opt}</span>
                      </div>
                    ))}
                    {q.explanation && (
                      <div className="mt-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20 text-xs text-gray-400 leading-relaxed">
                        {q.explanation}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Vocabulary tab ─────────────────────────────────────────────────────────────
function VocabularyTab({ subject, lang }: { subject: string; lang: string }) {
  const { t } = useLanguage();
  const [items, setItems] = useState<VocabItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = SUBJECT_CATEGORY_MAP[subject] ?? [];

  useEffect(() => {
    setLoading(true);
    const query =
      categories.length > 0
        ? supabase.from('vocabulary').select('*').in('category', categories)
        : supabase.from('vocabulary').select('*');

    query.then(({ data }) => {
      setItems((data as VocabItem[]) ?? []);
      setLoading(false);
    });
  }, [subject]);

  const filtered = items.filter(
    (v) =>
      v.word.includes(search) ||
      v.reading.toLowerCase().includes(search.toLowerCase()) ||
      v.burmese?.includes(search) ||
      v.nepali?.includes(search) ||
      v.vietnamese?.toLowerCase().includes(search.toLowerCase())
  );

  const getMeaning = (v: VocabItem) => {
    if (lang === 'my') return v.burmese || t('vocab_no_translation');
    if (lang === 'ne') return v.nepali || t('vocab_no_translation');
    if (lang === 'vi') return v.vietnamese || t('vocab_no_translation');
    return v.japanese_meaning || v.burmese || '—';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">{t('loading')}</div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('search_placeholder')}
          className="w-full bg-white/5 border border-white/10 rounded-full pl-11 pr-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-metallic-gold/40"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">{t('no_results')}</div>
      ) : (
        <div className="grid gap-2">
          {/* Header row */}
          <div className="grid grid-cols-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <span>{t('vocab_word')}</span>
            <span>{t('vocab_reading')}</span>
            <span>{t('vocab_meaning')}</span>
          </div>
          {filtered.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.02 }}
              className="grid grid-cols-3 items-start gap-2 px-4 py-3 rounded-xl bg-white/3 border border-white/6 hover:border-metallic-gold/20 group"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white text-sm">{v.word}</span>
                <button
                  onClick={() => {
                    const u = new SpeechSynthesisUtterance(v.word);
                    u.lang = 'ja-JP';
                    speechSynthesis.speak(u);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Volume2 size={13} className="text-metallic-gold/70" />
                </button>
              </div>
              <span className="text-gray-400 text-sm">{v.reading}</span>
              <span className="text-gray-300 text-sm leading-snug">{getMeaning(v)}</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Exam Hacks tab ─────────────────────────────────────────────────────────────
// Dynamically imports the subject data from ExamHacks to avoid duplication.
function ExamHacksTab({ subject }: { subject: string }) {
  const [data, setData] = useState<SubjectData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import('./ExamHacks').then((mod) => {
      const d = (mod.SUBJECT_DATA as Record<string, SubjectData>)[subject];
      setData(d ?? FALLBACK_EXAM_HACKS[subject] ?? null);
      setLoading(false);
    });
  }, [subject]);

  if (loading) {
    return <div className="text-gray-400 py-10 text-center">Loading...</div>;
  }

  if (!data) {
    return (
      <div className="text-gray-400 py-10 text-center">
        この科目のExam Hacksはまだ準備中です。
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Section title="💡 コアアイデア" content={data.coreIdea} isText />
      <Section title="🎯 高頻度出題ポイント" items={data.highYield} />
      <Section title="⚠️ よくある落とし穴" items={data.traps} />
      <Section title="⚡ Exam Hacks" items={data.examHacks} accent />
      <Section title="📚 学習戦略" items={data.studyStrategy} />
      <Section title="🧠 記憶のコツ" items={data.memoryTips} />
      <div className="p-4 rounded-xl bg-metallic-gold/5 border border-metallic-gold/20 italic text-sm text-metallic-gold leading-relaxed">
        {data.sigmaMessage}
      </div>
    </div>
  );
}

function Section({
  title,
  content,
  items,
  isText,
  accent,
}: {
  title: string;
  content?: string;
  items?: string[];
  isText?: boolean;
  accent?: boolean;
}) {
  return (
    <div>
      <h3 className="text-base font-bold text-white mb-3">{title}</h3>
      {isText && content && (
        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{content}</p>
      )}
      {items && (
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li
              key={i}
              className={`flex items-start gap-2.5 text-sm leading-relaxed ${
                accent ? 'text-metallic-gold' : 'text-gray-300'
              }`}
            >
              <span className="text-metallic-gold/60 mt-0.5 shrink-0">▸</span>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
