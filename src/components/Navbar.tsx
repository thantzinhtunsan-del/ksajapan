import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, GraduationCap, Map, ClipboardCheck, Menu, X, Zap } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Vocab', icon: BookOpen, href: '#vocab' },
    { name: 'Flashcards', icon: GraduationCap, href: '#flashcards' },
    { name: 'Mindmap', icon: Map, href: '#mindmap' },
    { name: 'Exam Hacks', icon: Zap, href: '#examhacks' },
    { name: 'Mock Test', icon: ClipboardCheck, href: '#mocktest' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-matte-black/80 backdrop-blur-md border-b border-metallic-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold tracking-tighter"
            >
              <span className="text-white">KSA</span>
              <span className="text-metallic-gold">.</span>
            </motion.div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-gray-300 hover:text-metallic-gold px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <item.icon size={16} />
                  {item.name}
                </motion.a>
              ))}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 md:hidden bg-matte-black flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-12">
              <div className="text-2xl font-bold tracking-tighter">
                <span className="text-white">KSA</span>
                <span className="text-metallic-gold">.</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white transition-colors"
              >
                <X size={28} />
              </button>
            </div>

            <div className="flex flex-col space-y-6">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-3xl font-bold text-gray-300 hover:text-metallic-gold flex items-center gap-4 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon size={24} className="text-metallic-gold" />
                  {item.name}
                </motion.a>
              ))}
            </div>

            <div className="mt-auto pt-12 border-t border-white/10">
              <p className="text-gray-500 text-sm mb-4 uppercase tracking-widest font-bold">Kaigo Strategist Academy</p>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-metallic-gold">
                  <Zap size={20} />
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-metallic-gold">
                  <GraduationCap size={20} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
