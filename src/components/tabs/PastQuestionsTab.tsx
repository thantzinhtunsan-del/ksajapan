import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ClipboardList, ChevronDown, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { SUBJECT_NAME_TO_SLUG } from '../../lib/subjects';
import { useLang } from '../../context/LanguageContext';

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

interface PastQuestionsTabProps {
  subjectSlug: string;
  subjectNameJa: string;
  isPaid: boolean;
  onUpgrade?: () => void;
}

/* ── Single question card ──────────────────────────────────────────────── */
function QuestionCard({ q, index }: { q: Question; index: number }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const { t } = useLang();

  const answered = selected !== null;
  const isCorrect = selected === q.correctAnswer;

  function reset() {
    setSelected(null);
    setShowExplanation(false);
  }

  function optClass(i: number): string {
    if (!answered) return '';
    if (i === q.correctAnswer) return 'correct';
    if (i === selected)        return 'wrong';
    return 'faded';
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: '#0D1326',
        border: answered
          ? `1.5px solid ${isCorrect ? 'rgba(16,185,129,0.35)' : 'rgba(239,68,68,0.3)'}`
          : '1px solid rgba(255,255,255,0.07)',
        transition: 'border-color 0.25s',
      }}
    >
      {/* Card header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-0 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-bold px-2.5 py-0.5 rounded-full"
            style={{ background: 'rgba(124,58,237,0.14)', color: '#A78BFA' }}
          >
            {q.kai}
          </span>
          <span className="text-xs text-ink-2 uppercase">{q.period === 'am' ? t.am : t.pm}</span>
          <span className="text-xs text-ink-2">Q{index + 1}</span>
        </div>

        {answered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex items-center gap-1 text-xs font-bold ${isCorrect ? 'text-emerald' : 'text-rose'}`}
          >
            {isCorrect
              ? <><CheckCircle2 size={14} />{t.correct}</>
              : <><XCircle size={14} />{t.incorrect}</>
            }
          </motion.div>
        )}
      </div>

      {/* Question text */}
      <p className="text-sm text-ink leading-relaxed px-4 pt-3 pb-4">{q.question}</p>

      {/* Options */}
      <div className="flex flex-col gap-2 px-4 pb-4">
        {q.options.map((opt, i) => (
          <button
            key={i}
            disabled={answered}
            onClick={() => setSelected(i)}
            className={`option-btn ${optClass(i)}`}
          >
            <span
              className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold mr-2.5 shrink-0"
              style={{
                background: answered && i === q.correctAnswer
                  ? 'rgba(16,185,129,0.2)'
                  : answered && i === selected
                  ? 'rgba(239,68,68,0.2)'
                  : 'rgba(255,255,255,0.06)',
              }}
            >
              {i + 1}
            </span>
            {opt}
          </button>
        ))}
      </div>

      {/* Explanation & reset */}
      {answered && (
        <div className="px-4 pb-4 space-y-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="flex items-center gap-1.5 text-xs font-medium text-violet hover:text-ink transition-colors"
            >
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${showExplanation ? 'rotate-180' : ''}`}
              />
              {showExplanation ? t.hideExplanation : t.showExplanation}
            </button>
            <button
              onClick={reset}
              className="flex items-center gap-1 text-xs text-ink-2 hover:text-ink transition-colors ml-auto"
            >
              <RotateCcw size={12} />
              もう一度
            </button>
          </div>

          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div
                  className="text-xs text-ink-2 leading-relaxed rounded-xl p-3 mt-1"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  {q.explanation || '解説はまだ準備中です。'}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

/* ── Tab container ─────────────────────────────────────────────────────── */
export default function PastQuestionsTab({ subjectSlug, subjectNameJa, isPaid, onUpgrade }: PastQuestionsTabProps) {
  const [selectedKai, setSelectedKai] = useState<string>('all');
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const { t } = useLang();

  useEffect(() => {
    import('../../data/pastQuestions.json').then((mod) => {
      setAllQuestions(mod.default as Question[]);
    });
  }, []);

  const slugToName = useMemo(() => {
    const map: Record<string, string> = {};
    Object.entries(SUBJECT_NAME_TO_SLUG).forEach(([name, slug]) => { map[slug] = name; });
    return map;
  }, []);

  const jaName = slugToName[subjectSlug] ?? subjectNameJa;
  const allForSubject = useMemo(() => allQuestions.filter((q) => q.subject === jaName), [allQuestions, jaName]);
  const kaiList = useMemo(() => [...new Set(allForSubject.map((q) => q.kai))].sort(), [allForSubject]);
  const filtered = useMemo(
    () => selectedKai === 'all' ? allForSubject : allForSubject.filter((q) => q.kai === selectedKai),
    [allForSubject, selectedKai]
  );

  if (allQuestions.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 gap-3">
        <div className="w-12 h-12 rounded-full bg-violet/10 flex items-center justify-center">
          <ClipboardList size={22} className="text-violet opacity-60 animate-pulse" />
        </div>
        <p className="text-sm text-ink-2">{t.questionsPreparing}</p>
      </div>
    );
  }

  if (allForSubject.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 gap-3">
        <div className="w-12 h-12 rounded-full bg-surface-2 flex items-center justify-center">
          <ClipboardList size={22} className="text-ink-2 opacity-40" />
        </div>
        <p className="text-sm text-ink-2">{t.questionsPreparing}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 flex-wrap">
        <ClipboardList size={17} className="text-violet" />
        <h3 className="font-bold text-ink text-sm">{t.questionsTitle}</h3>
        <span
          className="text-xs font-semibold ml-auto px-2.5 py-0.5 rounded-full"
          style={{ background: 'rgba(124,58,237,0.12)', color: '#A78BFA' }}
        >
          {t.questionsTotal(allForSubject.length)}
        </span>
      </div>

      {/* Kai filter chips */}
      <div className="flex gap-2 flex-wrap">
        {(['all', ...kaiList] as string[]).map((kai) => (
          <button
            key={kai}
            onClick={() => setSelectedKai(kai)}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
              selectedKai === kai
                ? 'text-white border-transparent'
                : 'border-white/8 text-ink-2 hover:border-violet/35 hover:text-ink'
            }`}
            style={selectedKai === kai ? { background: '#7C3AED' } : {}}
          >
            {kai === 'all' ? t.questionsAll : kai}
          </button>
        ))}
      </div>

      {/* Progress bar when all answered */}
      <QuestionList questions={filtered} />
    </div>
  );
}

function QuestionList({ questions }: { questions: Question[] }) {
  return (
    <div className="space-y-3">
      {questions.map((q, i) => (
        <QuestionCard key={q.id} q={q} index={i} />
      ))}
    </div>
  );
}
