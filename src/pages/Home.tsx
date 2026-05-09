import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { SUBJECTS } from '../lib/subjects';
import { ArrowRight, ClipboardList, BookOpen, Zap, LogIn } from 'lucide-react';
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
  const totalQ = SUBJECTS.reduce((n, s) => n + s.questionCount, 0);

  function handleSubjectClick(slug: string) {
    if (!isLoggedIn) { onSignIn(); return; }
    navigate(`/subjects/${slug}`);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-3xl overflow-hidden mb-12 px-8 py-14 text-center"
        style={{
          background: 'linear-gradient(135deg, #0D1326 0%, #141C35 50%, #1C2045 100%)',
          border: '1px solid rgba(124,58,237,0.2)',
          boxShadow: '0 0 60px rgba(124,58,237,0.08)',
        }}
      >
        {/* Glow blobs */}
        <div className="pointer-events-none absolute -top-20 left-1/4 w-64 h-64 rounded-full bg-violet/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-1/4 w-48 h-48 rounded-full bg-emerald/8 blur-3xl" />

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-violet/12 border border-violet/25 rounded-full px-4 py-1.5 text-xs text-violet font-semibold mb-5"
          >
            <ClipboardList size={12} />
            {t.heroTag}
          </motion.div>

          <h1 className="text-3xl md:text-5xl font-bold text-ink mb-4 leading-tight">
            {t.heroTitle}
            <span
              style={{
                background: 'linear-gradient(90deg, #7C3AED, #A78BFA)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t.heroHighlight}
            </span>
          </h1>
          <p className="text-ink-2 text-base md:text-lg max-w-xl mx-auto mb-8">{t.heroSub}</p>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-6 mb-8">
            {[
              { icon: ClipboardList, value: `${totalQ}+`, label: '過去問' },
              { icon: BookOpen, value: '13', label: '科目' },
              { icon: Zap, value: '8', label: '回分' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5">
                  <Icon size={14} className="text-violet" />
                  <span className="text-xl font-bold text-ink">{value}</span>
                </div>
                <span className="text-xs text-ink-2">{label}</span>
              </div>
            ))}
          </div>

          {!isLoggedIn && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={onSignIn}
              className="violet-btn text-sm px-7 py-3"
            >
              <LogIn size={15} />
              {t.startFree}
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* ── Subject grids ─────────────────────────────────────────────── */}
      <SubjectGroup
        label={t.amLabel}
        subjects={amSubjects}
        onSubjectClick={handleSubjectClick}
        isLoggedIn={isLoggedIn}
        delay={0}
        signInToStudy={t.signInToStudy}
      />
      <SubjectGroup
        label={t.pmLabel}
        subjects={pmSubjects}
        onSubjectClick={handleSubjectClick}
        isLoggedIn={isLoggedIn}
        delay={0.08}
        signInToStudy={t.signInToStudy}
      />
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
    <div className="mb-10">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="h-px flex-1 bg-white/6" />
        <span className="text-xs font-bold text-ink-2 uppercase tracking-widest whitespace-nowrap px-1">
          {label}
        </span>
        <div className="h-px flex-1 bg-white/6" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {subjects.map((subject, i) => (
          <motion.button
            key={subject.slug}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + i * 0.05 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSubjectClick(subject.slug)}
            className="relative text-left p-5 rounded-2xl group transition-all duration-200"
            style={{
              background: '#0D1326',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.38)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(124,58,237,0.12)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
          >
            {/* Icon circle */}
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl mb-3 bg-gradient-to-br ${subject.color}`}
            >
              {subject.icon}
            </div>

            <h3 className="font-bold text-ink text-sm mb-1 leading-snug">{subject.nameJa}</h3>
            <p className="text-xs text-ink-2 mb-3 line-clamp-2 leading-relaxed">{subject.description}</p>

            <div className="flex items-center justify-between">
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(124,58,237,0.12)', color: '#A78BFA' }}
              >
                {subject.questionCount}問
              </span>
              {isLoggedIn ? (
                <ArrowRight
                  size={15}
                  className="text-violet opacity-0 group-hover:opacity-100 transition-opacity"
                />
              ) : (
                <span className="text-xs text-ink-2 opacity-70">{signInToStudy}</span>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
