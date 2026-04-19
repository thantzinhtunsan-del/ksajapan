import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ClipboardList, ChevronDown, CheckCircle2, XCircle, Lock } from 'lucide-react';
import { SUBJECT_NAME_TO_SLUG } from '../../lib/subjects';
import PaywallBanner from '../PaywallBanner';
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

const FREE_QUESTION_LIMIT = 5;

interface PastQuestionsTabProps {
  subjectSlug: string;
  subjectNameJa: string;
  isPaid: boolean;
  onUpgrade?: () => void;
}

interface QuestionCardProps { q: Question; index: number }

function QuestionCard({ q, index }: QuestionCardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const { t } = useLang();

  const answered = selected !== null;
  const isCorrect = selected === q.correctAnswer;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="border border-white/8 rounded-2xl p-5 bg-white/2 space-y-4"
    >
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs bg-metallic-gold/15 text-metallic-gold px-2 py-0.5 rounded-full border border-metallic-gold/20">
          {q.kai}
        </span>
        <span className="text-xs text-gray-500 uppercase">{q.period === 'am' ? t.am : t.pm}</span>
        {answered && (
          <span className={`ml-auto text-xs font-semibold flex items-center gap-1 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {isCorrect ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
            {isCorrect ? t.correct : t.incorrect}
          </span>
        )}
      </div>

      {/* Question text — content stays in Japanese */}
      <p className="text-sm text-white leading-relaxed">{q.question}</p>

      <div className="space-y-2">
        {q.options.map((opt, i) => {
          let style = 'border-white/10 text-gray-300 hover:border-white/30 hover:bg-white/5';
          if (answered) {
            if (i === q.correctAnswer) style = 'border-green-500/50 bg-green-500/10 text-green-300';
            else if (i === selected) style = 'border-red-500/50 bg-red-500/10 text-red-300';
            else style = 'border-white/5 text-gray-600';
          }
          return (
            <button
              key={i}
              disabled={answered}
              onClick={() => setSelected(i)}
              className={`w-full text-left text-xs px-4 py-2.5 rounded-xl border transition-all ${style}`}
            >
              <span className="font-bold mr-2">{i + 1}.</span>{opt}
            </button>
          );
        })}
      </div>

      {answered && (
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="flex items-center gap-1 text-xs text-metallic-gold hover:text-white transition-colors"
        >
          <ChevronDown size={13} className={`transition-transform ${showExplanation ? 'rotate-180' : ''}`} />
          {showExplanation ? t.hideExplanation : t.showExplanation}
        </button>
      )}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="text-xs text-gray-400 bg-white/3 rounded-xl p-3 border border-white/5">{q.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

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

  const visible = isPaid ? filtered : filtered.slice(0, FREE_QUESTION_LIMIT);
  const locked = !isPaid && filtered.length > FREE_QUESTION_LIMIT;

  if (allForSubject.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-gray-500 gap-3">
        <ClipboardList size={32} className="opacity-40" />
        <p className="text-sm">{t.questionsPreparing}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <ClipboardList size={18} className="text-metallic-gold" />
        <h3 className="font-semibold text-white">{t.questionsTitle}</h3>
        <span className="text-xs text-gray-500 ml-auto">{t.questionsTotal(allForSubject.length)}</span>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedKai('all')}
          className={`text-xs px-3 py-1 rounded-full border transition-all ${selectedKai === 'all' ? 'bg-metallic-gold text-matte-black border-metallic-gold font-semibold' : 'border-white/10 text-gray-400 hover:border-white/30'}`}
        >
          {t.questionsAll}
        </button>
        {kaiList.map((kai) => (
          <button
            key={kai}
            onClick={() => setSelectedKai(kai)}
            className={`text-xs px-3 py-1 rounded-full border transition-all ${selectedKai === kai ? 'bg-metallic-gold text-matte-black border-metallic-gold font-semibold' : 'border-white/10 text-gray-400 hover:border-white/30'}`}
          >
            {kai}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {visible.map((q, i) => <QuestionCard key={q.id} q={q} index={i} />)}
      </div>

      {locked && (
        <div className="relative">
          <div className="blur-sm pointer-events-none opacity-40">
            {filtered.slice(FREE_QUESTION_LIMIT, FREE_QUESTION_LIMIT + 1).map((q) => (
              <div key={q.id} className="border border-white/8 rounded-2xl p-5 bg-white/2">
                <p className="text-sm text-white">{q.question}</p>
              </div>
            ))}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-2 bg-matte-black/80 border border-metallic-gold/30 rounded-full px-4 py-2">
              <Lock size={13} className="text-metallic-gold" />
              <span className="text-xs text-metallic-gold font-medium">
                {t.questionsLocked(filtered.length - FREE_QUESTION_LIMIT)}
              </span>
            </div>
          </div>
        </div>
      )}

      {locked && (
        <PaywallBanner onUpgrade={onUpgrade} message={t.questionsLockedMsg(filtered.length - FREE_QUESTION_LIMIT)} />
      )}
    </div>
  );
}
