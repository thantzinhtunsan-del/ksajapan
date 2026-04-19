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

type TabId = 'textbook' | 'questions' | 'vocab' | 'hacks';

interface SubjectPageProps {
  userId?: string;
  userEmail?: string;
  onSignIn: () => void;
}

export default function SubjectPage({ userId, userEmail, onSignIn }: SubjectPageProps) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('textbook');
  const { isPaid } = useProfile(userId, userEmail);
  const { t } = useLang();

  const subject = slug ? getSubjectBySlug(slug) : undefined;

  const TABS: { id: TabId; label: string; icon: ComponentType<{ size?: number }> }[] = [
    { id: 'textbook', label: t.tabTextbook, icon: BookOpen },
    { id: 'questions', label: t.tabQuestions, icon: ClipboardList },
    { id: 'vocab', label: t.tabVocab, icon: BookMarked },
    { id: 'hacks', label: t.tabExamHacks, icon: Zap },
  ];

  if (!subject) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-gray-500 gap-4">
        <p className="text-lg">{t.subjectNotFound}</p>
        <button onClick={() => navigate('/')} className="gold-button text-sm">
          {t.backHome}
        </button>
      </div>
    );
  }

  function handleUpgrade() {
    alert(t.planPreparing);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-6"
      >
        <ChevronLeft size={16} />
        {t.backToList}
      </button>

      {/* Subject header — nameJa intentionally NOT translated */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl border border-white/8 bg-gradient-to-br ${subject.color} p-6 mb-6`}
      >
        <div className="flex items-start gap-4">
          <span className="text-4xl">{subject.icon}</span>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-gray-400 uppercase font-semibold">
                {subject.period === 'am' ? t.am : t.pm}
              </span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-400">{subject.questionCount}問</span>
              {isPaid && (
                <span className="ml-2 text-xs bg-metallic-gold/20 text-metallic-gold px-2 py-0.5 rounded-full border border-metallic-gold/30">
                  {t.paidBadge}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-white">{subject.nameJa}</h1>
            <p className="text-sm text-gray-400 mt-1">{subject.description}</p>
          </div>
        </div>
      </motion.div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 overflow-x-auto scrollbar-hide pb-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-metallic-gold text-matte-black shadow-lg shadow-metallic-gold/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-white/8'
              }`}
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'textbook' && (
            <TextbookTab subjectSlug={subject.slug} isPaid={isPaid} onUpgrade={handleUpgrade} />
          )}
          {activeTab === 'questions' && (
            <PastQuestionsTab
              subjectSlug={subject.slug}
              subjectNameJa={subject.nameJa}
              isPaid={isPaid}
              onUpgrade={handleUpgrade}
            />
          )}
          {activeTab === 'vocab' && (
            <VocabularyTab subjectSlug={subject.slug} isPaid={isPaid} onUpgrade={handleUpgrade} />
          )}
          {activeTab === 'hacks' && (
            <ExamHacksTab subjectSlug={subject.slug} isPaid={isPaid} onUpgrade={handleUpgrade} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
