import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { FileText } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

interface PdfViewerProps {
  signedUrl: string;
  fileName?: string;
}

export default function PdfViewer({ signedUrl, fileName }: PdfViewerProps) {
  const { lang } = useLang();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Block right-click on the overlay to prevent "Save as"
  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    const prevent = (e: MouseEvent) => e.preventDefault();
    el.addEventListener('contextmenu', prevent);
    return () => el.removeEventListener('contextmenu', prevent);
  }, []);

  // Append #toolbar=0&navpanes=0 to hide the browser PDF toolbar (Chrome/Edge)
  const viewerSrc = `${signedUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`;

  const label: Record<string, string> = {
    ja: 'テキスト PDF',
    my: 'PDF သင်ခန်းစာ',
    ne: 'PDF पाठ्यपुस्तक',
    vi: 'PDF Sách giáo khoa',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <FileText size={18} className="text-metallic-gold" />
        <h3 className="font-semibold text-white">{label[lang] ?? label.ja}</h3>
        {fileName && (
          <span className="text-xs text-gray-500 ml-auto truncate max-w-[200px]">{fileName}</span>
        )}
      </div>

      {/* Viewer container */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-white/2" style={{ height: '78vh' }}>
        <iframe
          src={viewerSrc}
          title="PDF Viewer"
          className="w-full h-full border-0"
          referrerPolicy="no-referrer"
        />

        {/* Transparent overlay — intercepts right-click without blocking scroll */}
        <div
          ref={overlayRef}
          className="absolute inset-0 z-10"
          style={{ pointerEvents: 'none' }}
        />
      </div>

      <p className="text-xs text-gray-600 text-center">
        {lang === 'ja' && 'このPDFはダウンロードできません。'}
        {lang === 'my' && 'ဤ PDF ကို ဒေါင်းလုဒ်လုပ်၍မရပါ။'}
        {lang === 'ne' && 'यो PDF डाउनलोड गर्न मिल्दैन।'}
        {lang === 'vi' && 'PDF này không thể tải xuống.'}
      </p>
    </motion.div>
  );
}
