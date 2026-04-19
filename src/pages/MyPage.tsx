import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { User, Crown, BookOpen, ClipboardList, Sparkles, ChevronRight } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { SUBJECTS } from '../lib/subjects';
import { useLang } from '../context/LanguageContext';

interface MyPageProps {
  user: { name: string; email: string } | null;
  userId?: string;
  onSignIn: () => void;
}

export default function MyPage({ user, userId, onSignIn }: MyPageProps) {
  const navigate = useNavigate();
  const { profile, isPaid, loading } = useProfile(userId, user?.email);
  const { t } = useLang();

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-32 flex flex-col items-center gap-6 text-center">
        <div className="w-20 h-20 rounded-full bg-metallic-gold/10 border border-metallic-gold/30 flex items-center justify-center">
          <User size={32} className="text-metallic-gold" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">{t.myPageTitle}</h2>
          <p className="text-gray-400 text-sm">{t.myPageSignInPrompt}</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onSignIn} className="gold-button">
          {t.signIn}
        </motion.button>
      </div>
    );
  }

  const planItems = [
    { icon: BookOpen, label: t.planTextbook, free: t.freeTextbook, paid: t.paidTextbook },
    { icon: ClipboardList, label: t.planQuestions, free: t.freeQuestions, paid: t.paidQuestions },
    { icon: BookOpen, label: t.planVocab, free: t.freeVocab, paid: t.paidVocab },
    { icon: Sparkles, label: t.planExamHacks, free: t.freeHacks, paid: t.paidHacks },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      {/* Profile card */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/8 bg-white/2 p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-metallic-gold/15 border border-metallic-gold/30 flex items-center justify-center">
            <span className="text-xl font-bold text-metallic-gold">{user.name.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-white truncate">{user.name}</h2>
            <p className="text-sm text-gray-400 truncate">{user.email}</p>
          </div>
          {!loading && (
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${isPaid ? 'bg-metallic-gold/15 text-metallic-gold border-metallic-gold/30' : 'bg-white/5 text-gray-400 border-white/10'}`}>
              {isPaid ? <Crown size={12} /> : <User size={12} />}
              {isPaid ? t.paidPlan : t.freePlan}
            </div>
          )}
        </div>

        {!loading && !isPaid && (
          <div className="mt-5 pt-5 border-t border-white/8">
            <div className="flex items-start gap-3">
              <Sparkles size={16} className="text-metallic-gold mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-white font-medium mb-1">{t.upgradeToPaid}</p>
                <p className="text-xs text-gray-400 mb-3">{t.upgradeDesc}</p>
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => alert(t.planPreparing)}
                  className="text-xs bg-metallic-gold text-matte-black font-bold px-5 py-2 rounded-full hover:bg-gold-muted transition-all"
                >
                  {t.upgradeBtn}
                </motion.button>
              </div>
            </div>
          </div>
        )}

        {!loading && isPaid && (
          <div className="mt-4 flex items-center gap-2 text-xs text-green-400">
            <Crown size={13} />
            <span>{t.fullAccess}</span>
          </div>
        )}
      </motion.div>

      {/* Plan details */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-2xl border border-white/8 bg-white/2 p-6">
        <h3 className="font-semibold text-white mb-4 text-sm">{t.planTitle}</h3>
        <div className="space-y-3">
          {planItems.map(({ icon: Icon, label, free, paid }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon size={14} className="text-metallic-gold shrink-0" />
              <span className="text-xs text-gray-400 flex-1">{label}</span>
              <span className={`text-xs font-medium ${isPaid ? 'text-green-400' : 'text-gray-500'}`}>
                {isPaid ? paid : free}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Subject quick access — names intentionally NOT translated */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-white/8 bg-white/2 p-6">
        <h3 className="font-semibold text-white mb-4 text-sm">{t.subjectList}</h3>
        <div className="space-y-1">
          {SUBJECTS.map((s) => (
            <button key={s.slug} onClick={() => navigate(`/subjects/${s.slug}`)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group text-left">
              <span className="text-lg">{s.icon}</span>
              <span className="text-sm text-gray-300 flex-1">{s.nameJa}</span>
              <ChevronRight size={13} className="text-gray-600 group-hover:text-metallic-gold transition-colors" />
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
