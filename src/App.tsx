/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import VocabularyList from './components/VocabularyList';
import Flashcards from './components/Flashcards';
import Mindmap from './components/Mindmap';
import ExamHacks from './components/ExamHacks';
import MockTest from './components/MockTest';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-matte-black selection:bg-metallic-gold/30">
      <Navbar />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <Hero />
        
        <VocabularyList />

        <Flashcards />

        <Mindmap />

        <ExamHacks />

        <MockTest />
      </motion.main>

      <footer className="py-10 border-t border-metallic-gold/10 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Kaigo Strategist Academy. All rights reserved.</p>
      </footer>
    </div>
  );
}
