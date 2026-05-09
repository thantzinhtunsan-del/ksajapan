import { useNavigate } from 'react-router-dom';
import { User, ChevronRight, LogIn } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { SUBJECTS } from '../lib/subjects';
import { useLang } from '../context/LanguageContext';

interface MyPageProps {
  user: { name: string; email: string } | null;
  userId?: string;
  onSignIn: () => void;
}

export default function MyPage({ user, userId, onSignIn }: MyPageProps) {
  const navigate = useNavigate();
  const { loading } = useProfile(userId, user?.email);
  const { t } = useLang();

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 flex flex-col items-center gap-5 text-center">
        <User size={36} className="text-gray-300" />
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">{t.myPageTitle}</h2>
          <p className="text-sm text-gray-500">{t.myPageSignInPrompt}</p>
        </div>
        <button
          onClick={onSignIn}
          className="flex items-center gap-2 text-sm font-medium bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          <LogIn size={14} />
          {t.signIn}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Profile */}
      <div className="bg-white border border-gray-200 rounded p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-600">{user.name.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Subjects */}
      <div className="bg-white border border-gray-200 rounded">
        <div className="px-5 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">{t.subjectList}</h3>
        </div>
        <div>
          {SUBJECTS.map((s, i) => (
            <button
              key={s.slug}
              onClick={() => navigate(`/subjects/${s.slug}`)}
              className={`w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors text-left ${i < SUBJECTS.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <span className="text-lg">{s.icon}</span>
              <span className="text-sm text-gray-800 flex-1">{s.nameJa}</span>
              <span className="text-xs text-gray-400 mr-1">{s.questionCount}問</span>
              <ChevronRight size={13} className="text-gray-300" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
