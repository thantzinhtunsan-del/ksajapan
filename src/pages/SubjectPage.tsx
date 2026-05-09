import { useState } from 'react';
import type { ComponentType } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, BookOpen, ClipboardList, Zap } from 'lucide-react';
import { getSubjectBySlug } from '../lib/subjects';
import { useProfile } from '../hooks/useProfile';
import { useLang } from '../context/LanguageContext';
import TextbookTab from '../components/tabs/TextbookTab';
import PastQuestionsTab from '../components/tabs/PastQuestionsTab';
import ExamHacksTab from '../components/tabs/ExamHacksTab';

type TabId = 'questions' | 'textbook' | 'hacks';

export default function SubjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('questions');
  const { isPaid } = useProfile();
  const { t } = useLang();

  const subject = slug ? getSubjectBySlug(slug) : undefined;

  const TABS: { id: TabId; label: string; icon: ComponentType<{ size?: number }> }[] = [
    { id: 'questions', label: t.tabQuestions, icon: ClipboardList },
    { id: 'textbook',  label: t.tabTextbook,  icon: BookOpen },
    { id: 'hacks',     label: t.tabExamHacks, icon: Zap },
  ];

  if (!subject) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">{t.subjectNotFound}</p>
        <button onClick={() => navigate('/')} className="text-sm" style={{ color: '#4F46E5' }}>
          {t.backHome}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1 text-sm mb-5 transition-colors"
        style={{ color: '#64748B' }}
      >
        <ChevronLeft size={15} />
        {t.backToList}
      </button>

      {/* Subject header */}
      <div
        className="rounded-2xl p-5 mb-5 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)' }}
      >
        <div className="relative z-10 flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
            style={{ background: 'rgba(165,180,252,0.15)', backdropFilter: 'blur(4px)' }}
          >
            {subject.icon}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                style={{ background: 'rgba(165,180,252,0.2)', color: '#A5B4FC' }}
              >
                {subject.period === 'am' ? t.am : t.pm}
              </span>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {subject.questionCount}問
              </span>
            </div>
            <h1 className="text-xl font-bold text-white leading-tight">{subject.nameJa}</h1>
            {subject.description && (
              <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>{subject.description}</p>
            )}
          </div>
        </div>
        {/* deco */}
        <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #818CF8, transparent)' }} />
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 mb-5 overflow-x-auto pb-1 rounded-xl p-1"
        style={{ background: '#fff', border: '1px solid #E2E8F0', scrollbarWidth: 'none' }}
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm whitespace-nowrap font-medium transition-all flex-1 justify-center"
              style={isActive
                ? { background: '#4F46E5', color: '#fff', boxShadow: '0 2px 8px rgba(79,70,229,0.35)' }
                : { color: '#64748B' }
              }
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
{activeTab === 'hacks' && (
          <ExamHacksTab subjectSlug={subject.slug} isPaid={isPaid} />
        )}
      </div>
    </div>
  );
}
