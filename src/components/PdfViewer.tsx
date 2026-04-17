import { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, FileText, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export interface PdfDoc {
  id: string;
  title: string;
  file_url: string;
  is_premium: boolean;
  display_order: number;
}

interface PdfViewerProps {
  docs: PdfDoc[];
  userPlan: 'free' | 'paid';
  onUpgradeClick: () => void;
}

export default function PdfViewer({ docs, userPlan, onUpgradeClick }: PdfViewerProps) {
  const { t } = useLanguage();
  const [selectedDoc, setSelectedDoc] = useState<PdfDoc | null>(null);

  if (docs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <FileText size={48} className="text-metallic-gold/30 mb-4" />
        <p className="text-gray-400">{t('no_pdfs')}</p>
      </div>
    );
  }

  const canAccess = (doc: PdfDoc) => !doc.is_premium || userPlan === 'paid';

  return (
    <div className="flex gap-4 h-[70vh] min-h-[500px]">
      {/* Sidebar — document list */}
      <aside className="w-64 shrink-0 flex flex-col gap-1 overflow-y-auto pr-1">
        {docs.map((doc) => {
          const accessible = canAccess(doc);
          const isActive = selectedDoc?.id === doc.id;
          return (
            <button
              key={doc.id}
              onClick={() => {
                if (accessible) setSelectedDoc(doc);
                else onUpgradeClick();
              }}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-left text-sm transition-all ${
                isActive
                  ? 'bg-metallic-gold text-matte-black font-semibold'
                  : accessible
                  ? 'text-gray-300 hover:bg-white/5 hover:text-white'
                  : 'text-gray-600 hover:bg-white/5'
              }`}
            >
              {accessible ? (
                <FileText size={15} className="shrink-0" />
              ) : (
                <Lock size={15} className="shrink-0 text-metallic-gold/60" />
              )}
              <span className="flex-1 leading-snug">{doc.title}</span>
              {!accessible && (
                <span className="text-[10px] bg-metallic-gold/20 text-metallic-gold px-1.5 py-0.5 rounded-full shrink-0">
                  PRO
                </span>
              )}
              {isActive && <ChevronRight size={14} className="shrink-0" />}
            </button>
          );
        })}
      </aside>

      {/* Main — viewer */}
      <div className="flex-1 rounded-2xl overflow-hidden border border-metallic-gold/10 bg-white/2 relative">
        {selectedDoc ? (
          <>
            {/* Overlay — blocks right-click and text selection but allows scrolling */}
            <div
              className="absolute inset-0 z-10 select-none"
              onContextMenu={(e) => e.preventDefault()}
              style={{ pointerEvents: 'none' }}
            />
            {/* Invisible shield that only blocks right-click and drag, not scrolling */}
            <div
              className="absolute inset-0 z-10"
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              style={{ background: 'transparent', pointerEvents: 'auto', userSelect: 'none' }}
            >
              <iframe
                key={selectedDoc.id}
                src={`${selectedDoc.file_url}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
                className="w-full h-full"
                title={selectedDoc.title}
                style={{ pointerEvents: 'auto' }}
                // Sandbox prevents download via iframe actions but still allows reading
                sandbox="allow-same-origin allow-scripts"
              />
            </div>
            <div className="absolute bottom-3 right-3 z-20">
              <span className="text-[11px] text-gray-600 bg-matte-black/80 px-2 py-1 rounded-full">
                {t('pdf_no_download')}
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <FileText size={56} className="text-metallic-gold/20 mb-4" />
            <p className="text-gray-400">{t('pdf_select')}</p>
          </div>
        )}
      </div>

      {/* Upgrade modal — triggered when free user clicks locked doc */}
      {/* (handled by onUpgradeClick callback passed from parent) */}
    </div>
  );
}

// ── Upgrade prompt overlay ─────────────────────────────────────────────────────
export function UpgradePrompt({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#111] border border-metallic-gold/30 rounded-2xl p-8 max-w-sm w-full text-center"
      >
        <div className="w-16 h-16 rounded-full bg-metallic-gold/10 border border-metallic-gold/30 flex items-center justify-center mx-auto mb-5">
          <Lock size={28} className="text-metallic-gold" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{t('premium_content')}</h3>
        <p className="text-gray-400 text-sm mb-6">{t('premium_desc')}</p>
        <button className="gold-button w-full mb-3">{t('upgrade_now')}</button>
        <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-300">
          {t('close')}
        </button>
      </motion.div>
    </motion.div>
  );
}
