/**
 * App.tsx — updated
 * Manages global auth state + AuthModal.
 */

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
    // Scroll to vocab section after login
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
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <Hero onStartLearning={() => setShowAuthModal(true)} />
        <VocabularyList />
        <Flashcards />
        <Mindmap />
        <ExamHacks />
        <MockTest />
      </motion.main>

      <footer className="py-10 border-t border-metallic-gold/10 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Kaigo Strategist Academy. All rights reserved.</p>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
