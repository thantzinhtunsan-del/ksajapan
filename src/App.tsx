import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import VocabularyList from './components/VocabularyList';
import Flashcards from './components/Flashcards';
import Mindmap from './components/Mindmap';
import ExamHacks from './components/ExamHacks';
import MockTest from './components/MockTest';
import AdminPanel from './components/AdminPanel';
import AuthModal from './components/AuthModal';
import ResetPassword from './components/ResetPassword';
import { supabase } from './lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, GraduationCap, Map, Zap, ClipboardCheck, Shield } from 'lucide-react';

interface User {
  name: string;
  email: string;
}

// Admin emails — add your admin emails here
const ADMIN_EMAILS = ['admin@ksajapan.com', 'admin@ksa.com'];

type Tab = 'vocab' | 'flashcards' | 'mindmap' | 'examhacks' | 'mocktest' | 'admin';

const TABS: { id: Tab; label: string; icon: React.ElementType; adminOnly?: boolean }[] = [
  { id: 'vocab',      label: 'Vocab',      icon: BookOpen },
  { id: 'flashcards', label: 'Flashcards', icon: GraduationCap },
  { id: 'mindmap',    label: 'Mindmap',    icon: Map },
  { id: 'examhacks',  label: 'Exam Hacks', icon: Zap },
  { id: 'mocktest',   label: 'Mock Test',  icon: ClipboardCheck },
  { id: 'admin',      label: 'Admin',      icon: Shield, adminOnly: true },
];

export default function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('vocab');

  // Handle /reset-password route without a router
  if (window.location.pathname === '/reset-password') {
    return <ResetPassword />;
  }

  // Restore session on mount and subscribe to auth state changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          name: session.user.user_metadata?.full_name ?? session.user.email?.split('@')[0] ?? '',
          email: session.user.email ?? '',
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          name: session.user.user_metadata?.full_name ?? session.user.email?.split('@')[0] ?? '',
          email: session.user.email ?? '',
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const isAdmin = user ? ADMIN_EMAILS.includes(user.email.toLowerCase()) : false;

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    setShowAuthModal(false);
    setActiveTab('vocab');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setActiveTab('vocab');
  };

  const visibleTabs = TABS.filter((tab) => !tab.adminOnly || isAdmin);

  return (
    <div className="min-h-screen bg-matte-black selection:bg-metallic-gold/30">
      <Navbar user={user} onSignIn={() => setShowAuthModal(true)} onSignOut={handleSignOut} />

      <main className="pt-20">
        {user ? (
          <>
            {/* Tab Bar */}
            <div className="sticky top-20 z-40 bg-matte-black/90 backdrop-blur-md border-b border-metallic-gold/10">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex overflow-x-auto scrollbar-hide gap-1 py-2">
                  {visibleTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                          isActive
                            ? 'bg-metallic-gold text-matte-black shadow-lg shadow-metallic-gold/20'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon size={15} />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.25 }}
              >
                {activeTab === 'vocab'      && <VocabularyList />}
                {activeTab === 'flashcards' && <Flashcards />}
                {activeTab === 'mindmap'    && <Mindmap />}
                {activeTab === 'examhacks'  && <ExamHacks />}
                {activeTab === 'mocktest'   && <MockTest />}
                {activeTab === 'admin' && isAdmin && <AdminPanel />}
              </motion.div>
            </AnimatePresence>
          </>
        ) : (
          <>
            {/* Not logged in — Hero + locked */}
            <Hero onStartLearning={() => setShowAuthModal(true)} />
            <div className="py-32 flex flex-col items-center justify-center text-center px-4 border-t border-metallic-gold/10">
              <div className="w-20 h-20 rounded-full bg-metallic-gold/10 border border-metallic-gold/30 flex items-center justify-center mb-6">
                <span className="text-4xl">🔒</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Members Only Content</h2>
              <p className="text-gray-400 max-w-md mb-8 leading-relaxed">
                Sign up or sign in to access Vocabulary, Flashcards, Mindmaps, Exam Hacks, and Mock Tests.
              </p>
              <motion.button
                onClick={() => setShowAuthModal(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="gold-button"
              >
                Sign Up / Sign In
              </motion.button>
            </div>
          </>
        )}
      </main>

      <footer className="py-10 border-t border-metallic-gold/10 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Kaigo Strategist Academy. All rights reserved.</p>
      </footer>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
