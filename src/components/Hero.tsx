/**
 * Hero.tsx — updated
 * "Start Learning" now opens the AuthModal.
 */

import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onStartLearning: () => void;
}

export default function Hero({ onStartLearning }: HeroProps) {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-metallic-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-metallic-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Your Strategic Path to <br />
            <span className="gold-gradient">Kaigo Success</span>
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Master the Japanese National Care Worker Exam with our elite learning platform. 
            Designed for excellence, built for your future in Japan.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* ← This button now triggers the auth modal */}
            <motion.button
              onClick={onStartLearning}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="gold-button flex items-center gap-2"
            >
              Start Learning
              <ArrowRight size={20} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-full border border-metallic-gold/30 text-metallic-gold font-medium hover:bg-metallic-gold/5 transition-all"
            >
              View Curriculum
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-metallic-gold/10 pt-10"
        >
          <div>
            <p className="text-2xl font-bold text-metallic-gold">98%</p>
            <p className="text-xs text-gray-500 uppercase tracking-widest">Pass Rate</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-metallic-gold">5000+</p>
            <p className="text-xs text-gray-500 uppercase tracking-widest">Vocab Words</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-metallic-gold">24/7</p>
            <p className="text-xs text-gray-500 uppercase tracking-widest">AI Support</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-metallic-gold">Bilingual</p>
            <p className="text-xs text-gray-500 uppercase tracking-widest">JP & MM Support</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
