import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AdminPanel from './components/AdminPanel';
import Home from './pages/Home';
import SubjectPage from './pages/SubjectPage';
import ExamPage from './pages/ExamPage';
import { LanguageProvider, useLang } from './context/LanguageContext';

const ADMIN_EMAILS = ['admin@ksajapan.com', 'admin@ksa.com', 'thantzinhtunsan@gmail.com'];

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen" style={{ background: '#F0F9FF' }}>
        <AppNavbar />

        <main className="pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/subjects/:slug" element={<SubjectPage />} />
            <Route path="/exam" element={<ExamPage />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <AppFooter />
      </div>
    </BrowserRouter>
  );
}

function AppNavbar() {
  const { lang, setLang } = useLang();
  return <Navbar lang={lang} setLang={setLang} />;
}

function AppFooter() {
  const { t } = useLang();
  return (
    <footer className="py-8 text-center text-sm" style={{ borderTop: '1px solid #BAE6FD', color: '#7CB9D8' }}>
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
