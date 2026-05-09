import { useNavigate } from 'react-router-dom';
import { SUBJECTS } from '../lib/subjects';
import { useLang } from '../context/LanguageContext';
import { ArrowRight } from 'lucide-react';

const CARD_ACCENTS = [
  '#F59E0B', '#EF4444', '#10B981', '#3B82F6',
  '#8B5CF6', '#EC4899', '#14B8A6', '#F97316',
  '#6366F1', '#84CC16', '#06B6D4', '#E879F9',
  '#FB923C',
];

export default function Home() {
  const navigate = useNavigate();
  const { t } = useLang();
  const amSubjects = SUBJECTS.filter((s) => s.period === 'am');
  const pmSubjects = SUBJECTS.filter((s) => s.period === 'pm');

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Hero banner */}
      <div
        className="rounded-2xl p-6 mb-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 60%, #4C1D95 100%)' }}
      >
        <div className="relative z-10">
          <div className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3"
            style={{ background: 'rgba(165,180,252,0.2)', color: '#A5B4FC' }}>
            介護福祉士国家試験 対策
          </div>
          <h1 className="text-2xl font-bold text-white mb-1 leading-snug">
            {t.heroTitle}<span style={{ color: '#A5B4FC' }}>{t.heroHighlight}</span>
          </h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{t.heroSub}</p>
        </div>
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #818CF8, transparent)' }} />
        <div className="absolute right-16 bottom-0 w-24 h-24 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #C4B5FD, transparent)' }} />
      </div>

      <SubjectGroup label={t.amLabel} subjects={amSubjects} onSubjectClick={(s) => navigate(`/subjects/${s}`)} accentOffset={0} />
      <SubjectGroup label={t.pmLabel} subjects={pmSubjects} onSubjectClick={(s) => navigate(`/subjects/${s}`)} accentOffset={amSubjects.length} />
    </div>
  );
}

function SubjectGroup({
  label, subjects, onSubjectClick, accentOffset,
}: {
  label: string;
  subjects: typeof SUBJECTS;
  onSubjectClick: (slug: string) => void;
  accentOffset: number;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
          style={{ background: '#EEF2FF', color: '#4F46E5' }}>
          {label}
        </span>
        <div className="h-px flex-1" style={{ background: '#E2E8F0' }} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {subjects.map((subject, i) => {
          const accent = CARD_ACCENTS[(accentOffset + i) % CARD_ACCENTS.length];
          return (
            <button
              key={subject.slug}
              onClick={() => onSubjectClick(subject.slug)}
              className="text-left rounded-xl transition-all"
              style={{ background: '#fff', border: '1.5px solid #E2E8F0', padding: '14px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = accent;
                el.style.boxShadow = `0 4px 16px ${accent}22`;
                el.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = '#E2E8F0';
                el.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
                el.style.transform = 'none';
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: `${accent}18` }}>
                  {subject.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate leading-tight">{subject.nameJa}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>{subject.questionCount}問</p>
                </div>
                <ArrowRight size={14} style={{ color: accent, opacity: 0.7, flexShrink: 0 }} />
              </div>
              <div className="mt-3 h-0.5 rounded-full"
                style={{ background: `linear-gradient(to right, ${accent}60, transparent)` }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
