import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import VocabularyList from './components/VocabularyList';
import Flashcards from './components/Flashcards';
import Mindmap from './components/Mindmap';
import ExamHacks from './components/ExamHacks';
import MockTest from './components/MockTest';
import AuthModal from './components/AuthModal';
import { motion } from 'motion/react';

interface User {
  name: string;
  email: string;
}

export default function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    setShowAuthModal(false);
    setTimeout(() => {
      document.getElementById('vocab')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  return (
    <div className="min-h-screen bg-matte-black selection:bg-metallic-gold/30">
      <Navbar user={user} onSignIn={() => setShowAuthModal(true)} onSignOut={() => setUser(null)} />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        {user ? (
          /* ✅ Logged in — show only learning components, no Hero */
          <>
            <VocabularyList />
            <Flashcards />
            <Mindmap />
            <ExamHacks />
            <MockTest />
          </>
        ) : (
          /* 🔒 Not logged in — show Hero + locked section */
          <>
            <Hero onStartLearning={() => setShowAuthModal(true)} />
            <div className="py-32 flex flex-col items-center justify-center text-center px-4 border-t border-metallic-gold/10">
              <div className="w-20 h-20 rounded-full bg-metallic-gold/10 border border-metallic-gold/30 flex items-center justify-center mb-6">
                <span className="text-4xl">🔒</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Members Only Content
              </h2>
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
      </motion.main>

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
