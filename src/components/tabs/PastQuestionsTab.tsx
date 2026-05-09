import React, { useState, useMemo, useEffect } from 'react';
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

  function optionStyle(i: number): React.CSSProperties {
    if (!answered) return { borderColor: '#E2E8F0', background: '#fff', color: '#334155' };
    if (i === q.correctAnswer) return { borderColor: '#10B981', background: '#ECFDF5', color: '#065F46' };
    if (i === selected) return { borderColor: '#F87171', background: '#FEF2F2', color: '#991B1B' };
    return { borderColor: '#F1F5F9', background: '#F8FAFC', color: '#94A3B8' };
  }

  return (
    <div
      className="rounded-xl p-4 space-y-3"
      style={{ background: '#fff', border: '1.5px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 text-xs">
        <span
          className="font-bold px-2 py-0.5 rounded-md"
          style={{ background: '#E0F2FE', color: '#0284C7' }}
        >
          Q{index + 1}
        </span>
        <span
          className="px-2 py-0.5 rounded-md"
          style={{ background: '#F1F5F9', color: '#64748B' }}
        >
          {q.kai}
        </span>
        <span style={{ color: '#94A3B8' }}>{q.period === 'am' ? t.am : t.pm}</span>
        {answered && (
          <span
            className="ml-auto flex items-center gap-1 font-semibold text-xs px-2 py-0.5 rounded-full"
            style={isCorrect
              ? { background: '#ECFDF5', color: '#059669' }
              : { background: '#FEF2F2', color: '#DC2626' }
            }
          >
            {isCorrect ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
            {isCorrect ? t.correct : t.incorrect}
          </span>
        )}
      </div>

      {/* Question */}
      <p className="text-sm font-medium leading-relaxed" style={{ color: '#0F172A' }}>{q.question}</p>

      {/* Options */}
      <div className="space-y-1.5">
        {q.options.map((opt, i) => (
          <button
            key={i}
            disabled={answered}
            onClick={() => setSelected(i)}
            className="w-full text-left text-xs px-3 py-2.5 rounded-lg border transition-all"
            style={optionStyle(i)}
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
            className="flex items-center gap-1 text-xs transition-colors"
            style={{ color: '#94A3B8' }}
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
              className="text-xs px-3 py-1 rounded-lg border transition-all"
              style={selectedKai === kai
                ? { background: '#0284C7', color: '#fff', borderColor: '#0284C7' }
                : { borderColor: '#E2E8F0', color: '#64748B', background: '#fff' }
              }
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
