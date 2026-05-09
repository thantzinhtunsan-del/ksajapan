import { useNavigate } from 'react-router-dom';
import { SUBJECTS } from '../lib/subjects';
import { useLang } from '../context/LanguageContext';
import { ArrowRight } from 'lucide-react';

const CARD_ACCENTS = [
  '#0284C7', '#0891B2', '#059669', '#7C3AED',
  '#D97706', '#DC2626', '#0D9488', '#2563EB',
  '#9333EA', '#16A34A', '#EA580C', '#0284C7',
  '#0891B2',
];

export default function Home() {
  const navigate = useNavigate();
  const { t } = useLang();
  const amSubjects = SUBJECTS.filter((s) => s.period === 'am');
  const pmSubjects = SUBJECTS.filter((s) => s.period === 'pm');

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
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
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
          style={{ background: '#E0F2FE', color: '#0284C7' }}>
          {label}
        </span>
        <div className="h-px flex-1" style={{ background: '#BAE6FD' }} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {subjects.map((subject, i) => {
          const accent = CARD_ACCENTS[(accentOffset + i) % CARD_ACCENTS.length];
          return (
            <button
              key={subject.slug}
              onClick={() => onSubjectClick(subject.slug)}
              className="text-left rounded-xl transition-all"
              style={{
                background: '#fff',
                border: `1.5px solid #BAE6FD`,
                padding: '14px 16px',
                boxShadow: '0 1px 4px rgba(12,74,110,0.06)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = accent;
                el.style.boxShadow = `0 4px 16px ${accent}28`;
                el.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = '#BAE6FD';
                el.style.boxShadow = '0 1px 4px rgba(12,74,110,0.06)';
                el.style.transform = 'none';
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: `${accent}15` }}>
                  {subject.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate leading-tight" style={{ color: '#0C4A6E' }}>{subject.nameJa}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#7CB9D8' }}>{subject.questionCount}問</p>
                </div>
                <ArrowRight size={14} style={{ color: accent, opacity: 0.6, flexShrink: 0 }} />
              </div>
              <div className="mt-3 h-0.5 rounded-full"
                style={{ background: `linear-gradient(to right, ${accent}50, transparent)` }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
