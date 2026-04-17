import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SubjectsGrid from './components/SubjectsGrid';
import SubjectPage from './components/SubjectPage';
import MyPage from './components/MyPage';
import HelpPage from './components/HelpPage';
import AdminPanel from './components/AdminPanel';
import AuthModal from './components/AuthModal';
import ResetPassword from './components/ResetPassword';
import { supabase } from './lib/supabase';
import { LanguageProvider } from './contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

interface User {
  name: string;
  email: string;
}

const ADMIN_EMAILS = ['admin@ksajapan.com', 'admin@ksa.com'];

type Page = 'home' | 'subjects' | 'subject' | 'help' | 'mypage' | 'admin';

export default function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [activePage, setActivePage] = useState<Page>('home');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState<'free' | 'paid'>('free');

  if (window.location.pathname === '/reset-password') {
    return (
      <LanguageProvider>
        <ResetPassword />
      </LanguageProvider>
    );
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const u = {
          name: session.user.user_metadata?.full_name ?? session.user.email?.split('@')[0] ?? '',
          email: session.user.email ?? '',
        };
        setUser(u);
        fetchUserPlan(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          name: session.user.user_metadata?.full_name ?? session.user.email?.split('@')[0] ?? '',
          email: session.user.email ?? '',
        });
        fetchUserPlan(session.user.id);
      } else {
        setUser(null);
        setUserPlan('free');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserPlan = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', userId)
      .single();
    if (data?.plan) setUserPlan(data.plan as 'free' | 'paid');
  };

  const isAdmin = user ? ADMIN_EMAILS.includes(user.email.toLowerCase()) : false;

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    setShowAuthModal(false);
    setActivePage('subjects');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setActivePage('home');
    setSelectedSubject(null);
  };

  const handleNavigate = (page: Page, subject?: string) => {
    if (!user && page !== 'home' && page !== 'help') {
      setShowAuthModal(true);
      return;
    }
    setActivePage(page);
    if (subject) setSelectedSubject(subject);
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-matte-black selection:bg-metallic-gold/30">
        <Navbar
          user={user}
          activePage={activePage}
          onNavigate={handleNavigate}
          onSignIn={() => setShowAuthModal(true)}
          onSignOut={handleSignOut}
        />

        <main className="pt-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage === 'subject' ? `subject-${selectedSubject}` : activePage}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
            >
              {/* Home */}
              {activePage === 'home' && (
                <Hero
                  onStartLearning={() =>
                    user ? handleNavigate('subjects') : setShowAuthModal(true)
                  }
                />
              )}

              {/* Subjects grid */}
              {activePage === 'subjects' && user && (
                <SubjectsGrid
                  onSelectSubject={(subject) => handleNavigate('subject', subject)}
                />
              )}

              {/* Subject detail */}
              {activePage === 'subject' && user && selectedSubject && (
                <SubjectPage
                  subject={selectedSubject}
                  userPlan={userPlan}
                  onBack={() => setActivePage('subjects')}
                />
              )}

              {/* Help */}
              {activePage === 'help' && <HelpPage />}

              {/* My Page */}
              {activePage === 'mypage' && user && <MyPage user={user} />}

              {/* Admin */}
              {activePage === 'admin' && isAdmin && <AdminPanel />}

              {/* Not logged in on protected page */}
              {!user && activePage !== 'home' && activePage !== 'help' && (
                <MembersOnlyPlaceholder onSignIn={() => setShowAuthModal(true)} />
              )}
            </motion.div>
          </AnimatePresence>
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
    </LanguageProvider>
  );
}

function MembersOnlyPlaceholder({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div className="py-32 flex flex-col items-center justify-center text-center px-4 border-t border-metallic-gold/10">
      <div className="w-20 h-20 rounded-full bg-metallic-gold/10 border border-metallic-gold/30 flex items-center justify-center mb-6">
        <span className="text-4xl">🔒</span>
      </div>
      <h2 className="text-3xl font-bold text-white mb-4">Members Only Content</h2>
      <p className="text-gray-400 max-w-md mb-8 leading-relaxed">
        Sign up or sign in to access all study content.
      </p>
      <motion.button
        onClick={onSignIn}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="gold-button"
      >
        Sign Up / Sign In
      </motion.button>
    </div>
  );
}
