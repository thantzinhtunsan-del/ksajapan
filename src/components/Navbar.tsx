import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, LogIn, LogOut } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  user: { name: string; email: string } | null;
  onSignIn: () => void;
  onSignOut: () => void;
  tabs?: { id: string; label: string; icon: React.ElementType }[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

export default function Navbar({ user, onSignIn, onSignOut, tabs, activeTab, onTabChange }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-matte-black/80 backdrop-blur-md border-b border-metallic-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold tracking-tighter"
          >
            <span className="text-white">KSA</span>
            <span className="text-metallic-gold">.</span>
          </motion.div>

          {/* Auth — desktop */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-metallic-gold font-medium">{user.name}</span>
                <button
                  onClick={onSignOut}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20 transition-all"
                >
                  <LogOut size={13} />
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={onSignIn}
                className="flex items-center gap-2 text-sm font-semibold text-matte-black bg-metallic-gold px-5 py-2 rounded-full hover:bg-gold-muted transition-all hover:scale-105 active:scale-95"
              >
                <LogIn size={15} />
                Sign In
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
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
            className="fixed inset-0 z-[9999] md:hidden flex flex-col p-8"
            style={{ backgroundColor: '#1A1A1A', backdropFilter: 'blur(10px)' }}
          >
            <div className="flex justify-between items-center mb-8">
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

            {/* Nav links */}
            {tabs && tabs.length > 0 && (
              <nav className="flex flex-col gap-3 mt-4">
                {tabs.map((tab) => {
                  const Icon = tab.icon as React.ElementType;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => { onTabChange?.(tab.id); setIsOpen(false); }}
                      className={`flex items-center gap-4 px-5 py-4 rounded-xl text-base font-semibold transition-all text-left ${
                        isActive
                          ? 'bg-metallic-gold text-matte-black shadow-lg shadow-metallic-gold/20'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon size={20} />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            )}

            <div className="mt-auto pt-8 border-t border-white/10">
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
