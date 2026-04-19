import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, Mail } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

export default function Help() {
  const [open, setOpen] = useState<number | null>(null);
  const { t } = useLang();

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-metallic-gold/10 border border-metallic-gold/30 mb-4">
          <HelpCircle size={24} className="text-metallic-gold" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">{t.helpTitle}</h1>
        <p className="text-gray-400 text-sm">{t.helpSub}</p>
      </motion.div>

      {/* FAQ */}
      <div className="space-y-3 mb-10">
        {t.helpFaqs.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="border border-white/8 rounded-2xl overflow-hidden bg-white/2"
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors"
            >
              <span className="font-medium text-white text-sm pr-4">{faq.q}</span>
              <ChevronDown size={15} className={`text-gray-400 shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  key="answer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-sm text-gray-400 border-t border-white/8 pt-3 leading-relaxed">{faq.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Contact */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-2xl border border-metallic-gold/20 bg-metallic-gold/5 p-6 text-center">
        <Mail size={20} className="text-metallic-gold mx-auto mb-3" />
        <h3 className="font-semibold text-white mb-2">{t.helpContact}</h3>
        <p className="text-sm text-gray-400 mb-4">{t.helpContactDesc}</p>
        <a
          href="mailto:support@ksajapan.jp"
          className="inline-flex items-center gap-2 text-sm font-semibold text-matte-black bg-metallic-gold px-6 py-2.5 rounded-full hover:bg-gold-muted transition-all"
        >
          <Mail size={14} />
          {t.helpContactBtn}
        </a>
      </motion.div>
    </div>
  );
}
