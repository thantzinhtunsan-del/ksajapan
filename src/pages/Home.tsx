import { motion } from 'motion/react';
import type { ComponentType } from 'react';
import { useNavigate } from 'react-router-dom';
import { SUBJECTS } from '../lib/subjects';
import { GraduationCap, ArrowRight } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

interface HomeProps {
  onSignIn: () => void;
  isLoggedIn: boolean;
}

export default function Home({ onSignIn, isLoggedIn }: HomeProps) {
  const navigate = useNavigate();
  const { t } = useLang();
  const amSubjects = SUBJECTS.filter((s) => s.period === 'am');
  const pmSubjects = SUBJECTS.filter((s) => s.period === 'pm');

  function handleSubjectClick(slug: string) {
    if (!isLoggedIn) { onSignIn(); return; }
    navigate(`/subjects/${slug}`);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-14"
      >
        <div className="inline-flex items-center gap-2 bg-metallic-gold/10 border border-metallic-gold/30 rounded-full px-4 py-1.5 text-xs text-metallic-gold font-medium mb-6">
          <GraduationCap size={13} />
          {t.heroTag}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
          {t.heroTitle}<span className="gold-gradient">{t.heroHighlight}</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">{t.heroSub}</p>
        {!isLoggedIn && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSignIn}
            className="mt-8 gold-button"
          >
            {t.startFree}
          </motion.button>
        )}
      </motion.div>

      <SubjectGroup label={t.amLabel} subjects={amSubjects} onSubjectClick={handleSubjectClick} isLoggedIn={isLoggedIn} delay={0} signInToStudy={t.signInToStudy} />
      <SubjectGroup label={t.pmLabel} subjects={pmSubjects} onSubjectClick={handleSubjectClick} isLoggedIn={isLoggedIn} delay={0.15} signInToStudy={t.signInToStudy} />
    </div>
  );
}

function SubjectGroup({
  label, subjects, onSubjectClick, isLoggedIn, delay, signInToStudy,
}: {
  label: string;
  subjects: typeof SUBJECTS;
  onSubjectClick: (slug: string) => void;
  isLoggedIn: boolean;
  delay: number;
  signInToStudy: string;
}) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest whitespace-nowrap">{label}</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {subjects.map((subject, i) => (
          <motion.button
            key={subject.slug}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + i * 0.06 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSubjectClick(subject.slug)}
            className={`relative text-left p-5 rounded-2xl border border-white/8 bg-gradient-to-br ${subject.color} hover:border-metallic-gold/30 transition-all group`}
          >
            <div className="text-3xl mb-3">{subject.icon}</div>
            {/* Subject name intentionally NOT translated */}
            <h3 className="font-bold text-white text-sm mb-1 leading-snug">{subject.nameJa}</h3>
            <p className="text-xs text-gray-400 mb-3 line-clamp-2">{subject.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{subject.questionCount}問</span>
              {isLoggedIn ? (
                <ArrowRight size={14} className="text-metallic-gold opacity-0 group-hover:opacity-100 transition-opacity" />
              ) : (
                <span className="text-xs text-metallic-gold opacity-60">{signInToStudy}</span>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
