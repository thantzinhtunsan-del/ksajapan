import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import ResetPassword from './components/ResetPassword';
import AdminPanel from './components/AdminPanel';
import Home from './pages/Home';
import SubjectPage from './pages/SubjectPage';
import MyPage from './pages/MyPage';
import Help from './pages/Help';
import ExamPage from './pages/ExamPage';
import { supabase } from './lib/supabase';
import { LanguageProvider, useLang } from './context/LanguageContext';

interface User {
  id: string;
  name: string;
  email: string;
}

const ADMIN_EMAILS = ['admin@ksajapan.com', 'admin@ksa.com', 'thantzinhtunsan@gmail.com'];

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Restore session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.full_name ?? session.user.email?.split('@')[0] ?? '',
          email: session.user.email ?? '',
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
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

  const handleAuthSuccess = (userData: { name: string; email: string }) => {
    setShowAuthModal(false);
    // user state is updated via onAuthStateChange
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-matte-black selection:bg-metallic-gold/30">
        <AppNavbar
          user={user ? { name: user.name, email: user.email } : null}
          onSignIn={() => setShowAuthModal(true)}
          onSignOut={handleSignOut}
          isAdmin={isAdmin}
        />

        <main className="pt-20">
          <Routes>
            {/* Reset password — standalone, no navbar needed */}
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Home */}
            <Route
              path="/"
              element={
                <Home
                  isLoggedIn={!!user}
                  onSignIn={() => setShowAuthModal(true)}
                />
              }
            />

            {/* Subject page */}
            <Route
              path="/subjects/:slug"
              element={
                user ? (
                  <SubjectPage userId={user.id} userEmail={user.email} onSignIn={() => setShowAuthModal(true)} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />

            {/* My Page */}
            <Route
              path="/my-page"
              element={
                <MyPage
                  user={user ? { name: user.name, email: user.email } : null}
                  userId={user?.id}
                  onSignIn={() => setShowAuthModal(true)}
                />
              }
            />

            {/* National exam simulation */}
            <Route path="/exam" element={<ExamPage userId={user?.id} isLoggedIn={!!user} onSignIn={() => setShowAuthModal(true)} />} />

            {/* Help */}
            <Route path="/help" element={<Help />} />

            {/* Admin */}
            <Route
              path="/admin"
              element={isAdmin ? <AdminPanel /> : <Navigate to="/" replace />}
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <AppFooter />

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      </div>
    </BrowserRouter>
  );
}

function AppNavbar(props: { user: { name: string; email: string } | null; onSignIn: () => void; onSignOut: () => void; isAdmin?: boolean }) {
  const { lang, setLang } = useLang();
  return <Navbar {...props} lang={lang} setLang={setLang} />;
}

function AppFooter() {
  const { t } = useLang();
  return (
    <footer className="py-10 border-t border-metallic-gold/10 text-center text-gray-500 text-sm">
      <p>{t.footer(new Date().getFullYear())}</p>
    </footer>
  );
}

export default function AppWithProvider() {
  return (
    <LanguageProvider>
      <App />
    </LanguageProvider>
  );
}
