import { useNavigate } from 'react-router-dom';
import { SUBJECTS } from '../lib/subjects';
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
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{t.heroTitle}{t.heroHighlight}</h1>
        <p className="text-gray-500 text-sm">{t.heroSub}</p>
        {!isLoggedIn && (
          <button
            onClick={onSignIn}
            className="mt-4 text-sm font-medium bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            {t.startFree}
          </button>
        )}
      </div>

      <SubjectGroup label={t.amLabel} subjects={amSubjects} onSubjectClick={handleSubjectClick} isLoggedIn={isLoggedIn} signInToStudy={t.signInToStudy} />
      <SubjectGroup label={t.pmLabel} subjects={pmSubjects} onSubjectClick={handleSubjectClick} isLoggedIn={isLoggedIn} signInToStudy={t.signInToStudy} />
    </div>
  );
}

function SubjectGroup({
  label, subjects, onSubjectClick, isLoggedIn, signInToStudy,
}: {
  label: string;
  subjects: typeof SUBJECTS;
  onSubjectClick: (slug: string) => void;
  isLoggedIn: boolean;
  signInToStudy: string;
}) {
  return (
    <div className="mb-8">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{label}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {subjects.map((subject) => (
          <button
            key={subject.slug}
            onClick={() => onSubjectClick(subject.slug)}
            className="text-left px-4 py-3 bg-white border border-gray-200 rounded hover:border-blue-400 hover:bg-blue-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{subject.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{subject.nameJa}</p>
                <p className="text-xs text-gray-400">{subject.questionCount}問</p>
              </div>
              {!isLoggedIn && (
                <span className="text-xs text-blue-500 shrink-0">{signInToStudy}</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
