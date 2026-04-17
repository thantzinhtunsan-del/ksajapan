import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Calendar, Crown, Zap, Globe } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { LANGUAGE_NAMES, LANGUAGE_FLAGS, type Language } from '../i18n/translations';

interface UserProfile {
  email: string;
  name: string;
  created_at: string;
  plan: 'free' | 'paid';
}

interface MyPageProps {
  user: { name: string; email: string };
}

export default function MyPage({ user }: MyPageProps) {
  const { t, lang, setLang } = useLanguage();
  const [profile, setProfile] = useState<UserProfile>({
    email: user.email,
    name: user.name,
    created_at: '',
    plan: 'free',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: authUser } }) => {
      if (!authUser) return;

      // Fetch plan from profiles table (create if missing)
      supabase
        .from('profiles')
        .select('plan, created_at')
        .eq('id', authUser.id)
        .single()
        .then(({ data }) => {
          setProfile({
            email: authUser.email ?? '',
            name: authUser.user_metadata?.full_name ?? authUser.email?.split('@')[0] ?? '',
            created_at: data?.created_at ?? authUser.created_at ?? '',
            plan: data?.plan ?? 'free',
          });
          setLoading(false);
        });
    });
  }, []);

  const memberSince = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-gray-400">{t('loading')}</div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-white"
      >
        {t('mypage_title')}
      </motion.h1>

      {/* Account info card */}
      <Card title={t('mypage_account')} delay={0.05}>
        <InfoRow icon={User} label={t('mypage_account')} value={profile.name} />
        <InfoRow icon={Mail} label={t('mypage_email')} value={profile.email} />
        <InfoRow icon={Calendar} label={t('mypage_member_since')} value={memberSince} />
      </Card>

      {/* Plan card */}
      <Card title={t('mypage_plan')} delay={0.1}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {profile.plan === 'paid' ? (
              <Crown size={24} className="text-metallic-gold" />
            ) : (
              <Zap size={24} className="text-gray-400" />
            )}
            <div>
              <p className="font-semibold text-white">
                {profile.plan === 'paid' ? t('paid_plan') : t('free_plan')}
              </p>
              <p className="text-xs text-gray-500">{t('current_plan')}</p>
            </div>
          </div>
          {profile.plan === 'free' && (
            <button className="gold-button text-sm px-5 py-2">{t('upgrade_now')}</button>
          )}
        </div>

        {profile.plan === 'free' && (
          <div className="mt-4 p-3 rounded-xl bg-metallic-gold/5 border border-metallic-gold/20 text-sm text-gray-400">
            <p className="font-semibold text-metallic-gold mb-1">{t('paid_plan')}の特典:</p>
            <ul className="space-y-1 text-xs">
              <li>▸ 全テキスト・PDFへのフルアクセス</li>
              <li>▸ 過去問8回分すべて</li>
              <li>▸ 全言葉・単語集</li>
              <li>▸ AIフィードバック付きモック試験</li>
            </ul>
          </div>
        )}
      </Card>

      {/* Language setting card */}
      <Card title={t('mypage_language')} delay={0.15}>
        <div className="flex items-center gap-2 flex-wrap">
          <Globe size={16} className="text-gray-400" />
          {(['ja', 'my', 'ne', 'vi'] as Language[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                lang === l
                  ? 'bg-metallic-gold text-matte-black'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{LANGUAGE_FLAGS[l]}</span>
              <span>{LANGUAGE_NAMES[l]}</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          ※ UIの表示言語が変わります。科目名・内容は日本語のままです。
        </p>
      </Card>
    </div>
  );
}

function Card({
  title,
  children,
  delay = 0,
}: {
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white/3 border border-white/8 rounded-2xl p-6 space-y-4"
    >
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{title}</h2>
      {children}
    </motion.div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon size={16} className="text-gray-500 shrink-0" />
      <span className="text-xs text-gray-500 w-28 shrink-0">{label}</span>
      <span className="text-sm text-white">{value}</span>
    </div>
  );
}
