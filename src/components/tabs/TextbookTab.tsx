import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, BookOpen, Lock, FileText, Loader2 } from 'lucide-react';
import { TEXTBOOK_DATA, TextbookChapter } from '../../data/textbook';
import PaywallBanner from '../PaywallBanner';
import PdfViewer from '../PdfViewer';
import { useLang } from '../../context/LanguageContext';
import { supabase } from '../../lib/supabase';

interface TextbookTabProps {
  subjectSlug: string;
  isPaid: boolean;
  onUpgrade?: () => void;
}

// ─── PDF state ────────────────────────────────────────────────────────────────
interface PdfMeta { filePath: string; fileName: string }

async function fetchPdfForSubject(slug: string): Promise<{ signedUrl: string; fileName: string } | null> {
  const { data: row } = await supabase
    .from('subject_pdfs')
    .select('file_url, title')
    .eq('subject', slug)
    .single();

  if (!row) return null;

  const { data: signed } = await supabase.storage
    .from('subject-pdfs')
    .createSignedUrl(row.file_url, 3600); // 1-hour signed URL

  if (!signed?.signedUrl) return null;
  return { signedUrl: signed.signedUrl, fileName: row.title };
}

// ─── Chapter accordion ────────────────────────────────────────────────────────
interface ChapterCardProps {
  chapter: TextbookChapter;
  isOpen: boolean;
  onToggle: () => void;
  locked: boolean;
  paidLabel: string;
}

function ChapterCard({ chapter, isOpen, onToggle, locked, paidLabel }: ChapterCardProps) {
  return (
    <div className="border border-white/8 rounded-2xl overflow-hidden bg-white/2">
      <button
        onClick={locked ? undefined : onToggle}
        className={`w-full flex items-center justify-between px-5 py-4 text-left transition-colors ${locked ? 'cursor-default' : 'hover:bg-white/5 cursor-pointer'}`}
      >
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-metallic-gold/15 border border-metallic-gold/30 flex items-center justify-center text-xs font-bold text-metallic-gold">
            {chapter.chapter}
          </span>
          <span className="font-semibold text-white text-sm">{chapter.title}</span>
          {!chapter.isFree && (
            <span className="text-xs bg-metallic-gold/15 text-metallic-gold px-2 py-0.5 rounded-full border border-metallic-gold/30">
              {paidLabel}
            </span>
          )}
        </div>
        {locked ? (
          <Lock size={16} className="text-gray-600 shrink-0" />
        ) : (
          <ChevronDown size={16} className={`text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && !locked && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-6 border-t border-white/8">
              <div className="prose prose-invert prose-sm max-w-none pt-4">
                {chapter.content.split('\n').map((line, i) => {
                  if (line.startsWith('## ')) return <h2 key={i} className="text-metallic-gold font-bold text-base mt-4 mb-2">{line.slice(3)}</h2>;
                  if (line.startsWith('### ')) return <h3 key={i} className="text-white font-semibold text-sm mt-3 mb-1">{line.slice(4)}</h3>;
                  if (line.startsWith('| ')) {
                    const cells = line.split('|').filter(c => c.trim() !== '');
                    if (cells.every(c => c.trim().match(/^[-\s]+$/))) return null;
                    return (
                      <div key={i} className="flex gap-0 border-b border-white/5">
                        {cells.map((cell, j) => <div key={j} className="flex-1 px-2 py-1 text-xs text-gray-300">{cell.trim()}</div>)}
                      </div>
                    );
                  }
                  if (line.startsWith('- **')) {
                    const match = line.match(/^- \*\*(.+?)\*\*(.*)$/);
                    if (match) return <p key={i} className="text-xs text-gray-300 my-0.5 pl-3">• <strong className="text-white">{match[1]}</strong>{match[2]}</p>;
                  }
                  if (line.startsWith('- ')) return <p key={i} className="text-xs text-gray-300 my-0.5 pl-3">• {line.slice(2)}</p>;
                  if (line.startsWith('1. ') || line.match(/^\d\. /)) return <p key={i} className="text-xs text-gray-300 my-0.5 pl-3">{line}</p>;
                  if (line.trim() === '' || line.trim() === '---') return <div key={i} className="my-2" />;
                  if (line.startsWith('```')) return null;
                  return <p key={i} className="text-xs text-gray-400 my-0.5">{line}</p>;
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Subjects whose PDF is visible to free users
const FREE_PDF_SLUGS = ['ningen-no-songen', 'ningen-kankei', 'shakai-no-rikai'];

// ─── Main component ───────────────────────────────────────────────────────────
export default function TextbookTab({ subjectSlug, isPaid, onUpgrade }: TextbookTabProps) {
  const { t } = useLang();
  const chapters = TEXTBOOK_DATA[subjectSlug] ?? [];
  const [openChapter, setOpenChapter] = useState<number | null>(chapters[0]?.chapter ?? null);

  // PDF state
  const [pdfState, setPdfState] = useState<'loading' | 'found' | 'none'>('loading');
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [pdfFileName, setPdfFileName] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    setPdfState('loading');
    fetchPdfForSubject(subjectSlug).then((result) => {
      if (cancelled) return;
      if (result) {
        setPdfUrl(result.signedUrl);
        setPdfFileName(result.fileName);
        setPdfState('found');
      } else {
        setPdfState('none');
      }
    });
    return () => { cancelled = true; };
  }, [subjectSlug]);

  // Loading state
  if (pdfState === 'loading') {
    return (
      <div className="flex items-center justify-center py-20 gap-3 text-gray-500">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm">{t.preparing}...</span>
      </div>
    );
  }

  // PDF found — check access
  if (pdfState === 'found') {
    const isFreeSubject = FREE_PDF_SLUGS.includes(subjectSlug);
    if (!isFreeSubject && !isPaid) {
      // Paid-only PDF — show paywall
      return (
        <div className="space-y-3">
          <div className="flex flex-col items-center py-10 gap-3 text-gray-500">
            <BookOpen size={32} className="opacity-40" />
            <p className="text-sm text-center">{t.textbookPreparing}</p>
          </div>
          <PaywallBanner onUpgrade={onUpgrade} message={t.vocabPaidOnly(1)} />
        </div>
      );
    }
    return <PdfViewer signedUrl={pdfUrl} fileName={pdfFileName} />;
  }

  // No PDF — fall back to chapter accordion
  if (chapters.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-gray-500 gap-3">
        <BookOpen size={32} className="opacity-40" />
        <p className="text-sm">{t.textbookPreparing}</p>
      </div>
    );
  }

  const freeChapters = chapters.filter((c) => c.isFree);
  const paidChapters = chapters.filter((c) => !c.isFree);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen size={18} className="text-metallic-gold" />
        <h3 className="font-semibold text-white">{t.tabTextbook}</h3>
        <span className="text-xs text-gray-500 ml-auto">{t.chapters(chapters.length)}</span>
      </div>

      {freeChapters.map((ch) => (
        <ChapterCard
          key={ch.chapter}
          chapter={ch}
          isOpen={openChapter === ch.chapter}
          onToggle={() => setOpenChapter(openChapter === ch.chapter ? null : ch.chapter)}
          locked={false}
          paidLabel={t.paidLabel}
        />
      ))}

      {paidChapters.length > 0 && (
        isPaid ? (
          paidChapters.map((ch) => (
            <ChapterCard
              key={ch.chapter}
              chapter={ch}
              isOpen={openChapter === ch.chapter}
              onToggle={() => setOpenChapter(openChapter === ch.chapter ? null : ch.chapter)}
              locked={false}
              paidLabel={t.paidLabel}
            />
          ))
        ) : (
          <>
            {paidChapters.slice(0, 1).map((ch) => (
              <ChapterCard key={ch.chapter} chapter={ch} isOpen={false} onToggle={() => {}} locked={true} paidLabel={t.paidLabel} />
            ))}
            <PaywallBanner onUpgrade={onUpgrade} message={t.vocabPaidOnly(paidChapters.length)} />
          </>
        )
      )}
    </div>
  );
}
