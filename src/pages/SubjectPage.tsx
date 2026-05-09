import { useState } from 'react';
import type { ComponentType } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
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

  const TABS: { id: TabId; label: string; icon: ComponentType<{ size?: number; className?: string }> }[] = [
    { id: 'questions', label: t.tabQuestions, icon: ClipboardList },
    { id: 'textbook',  label: t.tabTextbook,  icon: BookOpen },
    { id: 'vocab',     label: t.tabVocab,     icon: BookMarked },
    { id: 'hacks',     label: t.tabExamHacks, icon: Zap },
  ];

  if (!subject) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-ink-2 gap-4">
        <p className="text-lg">{t.subjectNotFound}</p>
        <button onClick={() => navigate('/')} className="violet-btn text-sm">
          {t.backHome}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1.5 text-sm text-ink-2 hover:text-ink transition-colors mb-5"
      >
        <ChevronLeft size={16} />
        {t.backToList}
      </button>

      {/* Subject header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5 mb-5 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0D1326, #141C35)',
          border: '1px solid rgba(124,58,237,0.2)',
        }}
      >
        {/* subtle glow */}
        <div className="pointer-events-none absolute -top-8 -right-8 w-32 h-32 rounded-full bg-violet/10 blur-2xl" />
        <div className="relative z-10 flex items-start gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 bg-gradient-to-br ${subject.color}`}>
            {subject.icon}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span
                className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                style={{ background: 'rgba(124,58,237,0.15)', color: '#A78BFA' }}
              >
                {subject.period === 'am' ? t.am : t.pm}
              </span>
              <span className="text-xs text-ink-2">{subject.questionCount}問</span>
            </div>
            <h1 className="text-xl font-bold text-ink leading-tight">{subject.nameJa}</h1>
            <p className="text-sm text-ink-2 mt-0.5">{subject.description}</p>
          </div>
        </div>
      </motion.div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                isActive
                  ? 'text-white border-transparent'
                  : 'text-ink-2 border-white/8 hover:text-ink hover:bg-white/4'
              }`}
              style={isActive ? { background: '#7C3AED', boxShadow: '0 2px 12px rgba(124,58,237,0.35)' } : {}}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
        >
          {activeTab === 'questions' && (
            <PastQuestionsTab
              subjectSlug={subject.slug}
              subjectNameJa={subject.nameJa}
              isPaid={isPaid}
              onUpgrade={() => {}}
            />
          )}
          {activeTab === 'textbook' && (
            <TextbookTab subjectSlug={subject.slug} isPaid={isPaid} onUpgrade={() => {}} />
          )}
          {activeTab === 'vocab' && (
            <VocabularyTab subjectSlug={subject.slug} isPaid={isPaid} onUpgrade={() => {}} />
          )}
          {activeTab === 'hacks' && (
            <ExamHacksTab subjectSlug={subject.slug} isPaid={isPaid} onUpgrade={() => {}} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
