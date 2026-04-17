import { motion } from 'motion/react';
import { ChevronRight, BookOpen } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

// ── 13 subjects of 介護福祉士国家試験 ──────────────────────────────────────────
export const AM_SUBJECTS = [
  '人間の尊厳と自立',
  '人間関係とコミュニケーション',
  '社会の理解',
  'こころとからだのしくみ',
  '発達と老化の理解',
  '認知症の理解',
  '障害の理解',
  '医療的ケア',
];

export const PM_SUBJECTS = [
  '介護の基本',
  'コミュニケーション技術',
  '生活支援技術',
  '介護過程',
  '総合問題',
];

export const ALL_SUBJECTS = [...AM_SUBJECTS, ...PM_SUBJECTS];

// Official question count per subject
export const SUBJECT_Q_COUNT: Record<string, number> = {
  '人間の尊厳と自立': 2,
  '人間関係とコミュニケーション': 2,
  '社会の理解': 12,
  'こころとからだのしくみ': 12,
  '発達と老化の理解': 8,
  '認知症の理解': 10,
  '障害の理解': 10,
  '医療的ケア': 7,
  '介護の基本': 10,
  'コミュニケーション技術': 8,
  '生活支援技術': 20,
  '介護過程': 12,
  '総合問題': 12,
};

interface SubjectsGridProps {
  onSelectSubject: (subject: string) => void;
}

export default function SubjectsGrid({ onSelectSubject }: SubjectsGridProps) {
  const { t } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">{t('subjects_title')}</h1>
        <p className="text-gray-400">{t('subjects_subtitle')}</p>
      </div>

      {/* AM Subjects */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
            {t('period_am')} — 8{t('questions_count')}科目
          </span>
          <div className="flex-1 h-px bg-white/10" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {AM_SUBJECTS.map((subject, i) => (
            <SubjectCard
              key={subject}
              subject={subject}
              index={i}
              qCount={SUBJECT_Q_COUNT[subject]}
              onClick={() => onSelectSubject(subject)}
            />
          ))}
        </div>
      </div>

      {/* PM Subjects */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            {t('period_pm')} — 5{t('questions_count')}科目
          </span>
          <div className="flex-1 h-px bg-white/10" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {PM_SUBJECTS.map((subject, i) => (
            <SubjectCard
              key={subject}
              subject={subject}
              index={AM_SUBJECTS.length + i}
              qCount={SUBJECT_Q_COUNT[subject]}
              onClick={() => onSelectSubject(subject)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SubjectCard({
  subject,
  index,
  qCount,
  onClick,
}: {
  subject: string;
  index: number;
  qCount: number;
  onClick: () => void;
}) {
  const { t } = useLanguage();
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="flex flex-col gap-2 p-4 rounded-2xl bg-white/3 border border-white/8 hover:border-metallic-gold/40 hover:bg-white/5 text-left transition-all group"
    >
      <div className="flex items-start justify-between">
        <div className="w-8 h-8 rounded-lg bg-metallic-gold/10 flex items-center justify-center shrink-0">
          <BookOpen size={14} className="text-metallic-gold" />
        </div>
        <ChevronRight
          size={16}
          className="text-gray-600 group-hover:text-metallic-gold transition-colors mt-0.5"
        />
      </div>
      <p className="text-sm font-semibold text-white leading-snug">{subject}</p>
      <p className="text-xs text-gray-500">
        {qCount} {t('questions_count')}
      </p>
    </motion.button>
  );
}
