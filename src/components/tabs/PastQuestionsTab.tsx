import { useState, useMemo, useEffect } from 'react';
import { CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
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
}

interface PastQuestionsTabProps {
  subjectSlug: string;
  subjectNameJa: string;
  isPaid: boolean;
  onUpgrade?: () => void;
}

function QuestionCard({ q, index }: { q: Question; index: number }) {
  const [selected, setSelected] = useState<number | null>(null);
  const { t } = useLang();

  const answered = selected !== null;
  const isCorrect = selected === q.correctAnswer;

  function optStyle(i: number) {
    if (!answered) return 'border-gray-200 text-gray-700 hover:border-blue-400 hover:bg-blue-50';
    if (i === q.correctAnswer) return 'border-green-500 bg-green-50 text-green-800';
    if (i === selected) return 'border-red-400 bg-red-50 text-red-700';
    return 'border-gray-100 text-gray-400';
  }

  return (
    <div className="bg-white border border-gray-200 rounded p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <span>Q{index + 1}</span>
        <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-500">{q.kai}</span>
        <span className="uppercase">{q.period === 'am' ? t.am : t.pm}</span>
        {answered && (
          <span className={`ml-auto flex items-center gap-1 font-semibold ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
            {isCorrect ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
            {isCorrect ? t.correct : t.incorrect}
          </span>
        )}
      </div>

      {/* Question */}
      <p className="text-sm text-gray-900 leading-relaxed">{q.question}</p>

      {/* Options */}
      <div className="space-y-1.5">
        {q.options.map((opt, i) => (
          <button
            key={i}
            disabled={answered}
            onClick={() => setSelected(i)}
            className={`w-full text-left text-xs px-3 py-2.5 rounded border transition-colors ${optStyle(i)}`}
          >
            <span className="font-bold mr-2">{i + 1}.</span>{opt}
          </button>
        ))}
      </div>

      {/* Reset */}
      {answered && (
        <div className="flex justify-end pt-1">
          <button
            onClick={() => setSelected(null)}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700"
          >
            <RotateCcw size={11} />
            もう一度
          </button>
        </div>
      )}
    </div>
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

  if (allQuestions.length === 0) {
    return <p className="py-12 text-center text-sm text-gray-400">{t.questionsPreparing}</p>;
  }

  if (allForSubject.length === 0) {
    return <p className="py-12 text-center text-sm text-gray-400">{t.questionsPreparing}</p>;
  }

  return (
    <div className="space-y-4">
      {/* Kai filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-500">{t.questionsTotal(allForSubject.length)}</span>
        <div className="flex gap-1.5 flex-wrap ml-auto">
          {(['all', ...kaiList] as string[]).map((kai) => (
            <button
              key={kai}
              onClick={() => setSelectedKai(kai)}
              className={`text-xs px-3 py-1 rounded border transition-colors ${
                selectedKai === kai
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-200 text-gray-600 hover:border-gray-400'
              }`}
            >
              {kai === 'all' ? t.questionsAll : kai}
            </button>
          ))}
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-3">
        {filtered.map((q, i) => (
          <QuestionCard key={q.id} q={q} index={i} />
        ))}
      </div>
    </div>
  );
}
