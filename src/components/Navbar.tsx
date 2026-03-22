/**
 * Navbar.tsx — updated
 * Shows "Sign In" button when logged out, user name + sign out when logged in.
 */

import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, GraduationCap, Map, ClipboardCheck, Menu, X, Zap, LogIn, LogOut } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  user: { name: string; email: string } | null;
  onSignIn: () => void;
  onSignOut: () => void;
}

export default function Navbar({ user, onSignIn, onSignOut }: NavbarProps) {
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
          
          <div className="hidden md:flex items-center gap-8">
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

            {/* Auth button */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-metallic-gold font-medium">
                    {user.name}
                  </span>
                  <button
                    onClick={onSignOut}
                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20 transition-all"
                  >
                    <LogOut size={13} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={onSignIn}
                  className="flex items-center gap-2 text-sm font-semibold text-matte-black bg-metallic-gold px-5 py-2 rounded-full hover:bg-gold-muted transition-all hover:scale-105 active:scale-95"
                >
                  <LogIn size={15} />
                  Sign In
                </button>
              )}
            </motion.div>
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
              {user ? (
                <div className="flex items-center justify-between">
                  <p className="text-metallic-gold font-bold">{user.name}</p>
                  <button
                    onClick={() => { onSignOut(); setIsOpen(false); }}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { onSignIn(); setIsOpen(false); }}
                  className="w-full gold-button flex items-center justify-center gap-2"
                >
                  <LogIn size={18} />
                  Sign In / Sign Up
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
