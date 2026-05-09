import { useState } from 'react';
import type { ComponentType } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, BookOpen, ClipboardList, BookMarked, Zap } from 'lucide-react';
import { getSubjectBySlug } from '../lib/subjects';
import { useProfile } from '../hooks/useProfile';
import { useLang } from '../context/LanguageContext';
import TextbookTab from '../components/tabs/TextbookTab';
import PastQuestionsTab from '../components/tabs/PastQuestionsTab';
import VocabularyTab from '../components/tabs/VocabularyTab';
import ExamHacksTab from '../components/tabs/ExamHacksTab';

type TabId = 'questions' | 'textbook' | 'vocab' | 'hacks';

interface SubjectPageProps {
  userId?: string;
  userEmail?: string;
  onSignIn: () => void;
}

export default function SubjectPage({ userId, userEmail, onSignIn }: SubjectPageProps) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('questions');
  const { isPaid } = useProfile(userId, userEmail);
  const { t } = useLang();

  const subject = slug ? getSubjectBySlug(slug) : undefined;

  const TABS: { id: TabId; label: string; icon: ComponentType<{ size?: number }> }[] = [
    { id: 'questions', label: t.tabQuestions, icon: ClipboardList },
    { id: 'textbook',  label: t.tabTextbook,  icon: BookOpen },
    { id: 'vocab',     label: t.tabVocab,     icon: BookMarked },
    { id: 'hacks',     label: t.tabExamHacks, icon: Zap },
  ];

  if (!subject) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">{t.subjectNotFound}</p>
        <button onClick={() => navigate('/')} className="text-sm text-blue-600 hover:underline">
          {t.backHome}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-5"
      >
        <ChevronLeft size={15} />
        {t.backToList}
      </button>

      {/* Subject header */}
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-200">
        <span className="text-3xl">{subject.icon}</span>
        <div>
          <h1 className="text-lg font-bold text-gray-900">{subject.nameJa}</h1>
          <p className="text-xs text-gray-400">{subject.period === 'am' ? t.am : t.pm} · {subject.questionCount}問</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-5 overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm whitespace-nowrap border-b-2 transition-colors -mb-px ${
                isActive
                  ? 'border-blue-600 text-blue-600 font-medium'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Icon size={13} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'questions' && (
          <PastQuestionsTab subjectSlug={subject.slug} subjectNameJa={subject.nameJa} isPaid={isPaid} />
        )}
        {activeTab === 'textbook' && (
          <TextbookTab subjectSlug={subject.slug} isPaid={isPaid} />
        )}
        {activeTab === 'vocab' && (
          <VocabularyTab subjectSlug={subject.slug} isPaid={isPaid} />
        )}
        {activeTab === 'hacks' && (
          <ExamHacksTab subjectSlug={subject.slug} isPaid={isPaid} />
        )}
      </div>
    </div>
  );
}
