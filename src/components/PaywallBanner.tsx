import { motion } from 'motion/react';
import { Lock, Sparkles } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

interface PaywallBannerProps {
  onUpgrade?: () => void;
  message?: string;
}

export default function PaywallBanner({ onUpgrade, message }: PaywallBannerProps) {
  const { t } = useLang();
  const displayMessage = message ?? t.paywallDefault;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative my-6 rounded-2xl overflow-hidden border border-metallic-gold/30"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-matte-black/60 to-matte-black/95 backdrop-blur-sm z-10" />
      <div className="relative z-20 flex flex-col items-center justify-center py-14 px-6 text-center gap-5">
        <div className="w-16 h-16 rounded-full bg-metallic-gold/10 border border-metallic-gold/40 flex items-center justify-center">
          <Lock size={28} className="text-metallic-gold" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-2">{displayMessage}</h3>
          <p className="text-gray-400 text-sm max-w-sm">{t.paywallDesc}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onUpgrade}
          className="flex items-center gap-2 bg-metallic-gold text-matte-black font-bold px-8 py-3 rounded-full text-sm hover:bg-gold-muted transition-all"
        >
          <Sparkles size={16} />
          {t.paywallBtn}
        </motion.button>
      </div>
    </motion.div>
  );
}
