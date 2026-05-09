import { useState, useEffect } from 'react';
import { ChevronDown, BookOpen, Loader2 } from 'lucide-react';
import { TEXTBOOK_DATA, TextbookChapter } from '../../data/textbook';
import PdfViewer from '../PdfViewer';
import { useLang } from '../../context/LanguageContext';
import { supabase } from '../../lib/supabase';

interface TextbookTabProps {
  subjectSlug: string;
  isPaid: boolean;
  onUpgrade?: () => void;
}

async function fetchPdfForSubject(slug: string): Promise<{ signedUrl: string; fileName: string } | null> {
  const { data: row } = await supabase
    .from('subject_pdfs')
    .select('file_url, title')
    .eq('subject', slug)
    .single();

  if (!row) return null;

  const { data: signed } = await supabase.storage
    .from('subject-pdfs')
    .createSignedUrl(row.file_url, 3600);

  if (!signed?.signedUrl) return null;
  return { signedUrl: signed.signedUrl, fileName: row.title };
}

function ChapterCard({ chapter, isOpen, onToggle }: { chapter: TextbookChapter; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-gray-200 rounded overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
            {chapter.chapter}
          </span>
          <span className="text-sm font-medium text-gray-800">{chapter.title}</span>
        </div>
        <ChevronDown size={15} className={`text-gray-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="px-4 pb-5 pt-3 border-t border-gray-100 bg-gray-50 space-y-1">
          {chapter.content.split('\n').map((line, i) => {
            if (line.startsWith('## ')) return <h2 key={i} className="text-sm font-bold text-gray-900 mt-3 mb-1">{line.slice(3)}</h2>;
            if (line.startsWith('### ')) return <h3 key={i} className="text-xs font-semibold text-gray-700 mt-2">{line.slice(4)}</h3>;
            if (line.startsWith('| ')) {
              const cells = line.split('|').filter(c => c.trim() !== '');
              if (cells.every(c => c.trim().match(/^[-\s]+$/))) return null;
              return (
                <div key={i} className="flex border-b border-gray-200">
                  {cells.map((cell, j) => <div key={j} className="flex-1 px-2 py-1 text-xs text-gray-600">{cell.trim()}</div>)}
                </div>
              );
            }
            if (line.startsWith('- ')) return <p key={i} className="text-xs text-gray-600 pl-3">• {line.slice(2)}</p>;
            if (line.trim() === '' || line.trim() === '---') return <div key={i} className="my-1" />;
            if (line.startsWith('```')) return null;
            return <p key={i} className="text-xs text-gray-600">{line}</p>;
          })}
        </div>
      )}
    </div>
  );
}

export default function TextbookTab({ subjectSlug, isPaid, onUpgrade }: TextbookTabProps) {
  const { t } = useLang();
  const chapters = TEXTBOOK_DATA[subjectSlug] ?? [];
  const [openChapter, setOpenChapter] = useState<number | null>(chapters[0]?.chapter ?? null);
  const [pdfState, setPdfState] = useState<'loading' | 'found' | 'none'>('loading');
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');

  useEffect(() => {
    let cancelled = false;
    setPdfState('loading');
    fetchPdfForSubject(subjectSlug).then((result) => {
      if (cancelled) return;
      if (result) { setPdfUrl(result.signedUrl); setPdfFileName(result.fileName); setPdfState('found'); }
      else setPdfState('none');
    });
    return () => { cancelled = true; };
  }, [subjectSlug]);

  if (pdfState === 'loading') {
    return (
      <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
        <Loader2 size={18} className="animate-spin" />
        <span className="text-sm">{t.preparing}...</span>
      </div>
    );
  }

  if (pdfState === 'found') {
    return <PdfViewer signedUrl={pdfUrl} fileName={pdfFileName} />;
  }

  if (chapters.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 gap-2 text-gray-400">
        <BookOpen size={28} className="opacity-40" />
        <p className="text-sm">{t.textbookPreparing}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-400 mb-3">{t.chapters(chapters.length)}</p>
      {chapters.map((ch) => (
        <ChapterCard
          key={ch.chapter}
          chapter={ch}
          isOpen={openChapter === ch.chapter}
          onToggle={() => setOpenChapter(openChapter === ch.chapter ? null : ch.chapter)}
        />
      ))}
    </div>
  );
}
