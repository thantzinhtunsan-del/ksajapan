/**
 * MockTest.tsx
 * Mode selection: 科目別練習 | 回別試験 (第31回〜第38回)
 * Pass system: overall ≥ 60% AND no subject with 0 correct.
 */

import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import PAST_QUESTIONS_JSON from '../data/pastQuestions.json';
import { motion, AnimatePresence } from 'motion/react';
import {
  ClipboardCheck, Timer, ArrowRight, CheckCircle2, XCircle,
  Sparkles, RefreshCcw, BookOpen, GraduationCap,
  ChevronLeft, AlertTriangle,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = 'subject' | 'kai';
type Period = 'am' | 'pm' | 'both';

interface Question {
  id: string;
  kai: string;
  subject: string;
  period: 'am' | 'pm';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// ─── Question Bank (681 past exam questions from 第31回～第38回) ────────────────
const ALL_QUESTIONS: Question[] = PAST_QUESTIONS_JSON as Question[];

// ─── Available rounds ─────────────────────────────────────────────────────────
const ALL_KAI = ['第31回', '第32回', '第33回', '第34回', '第35回', '第36回', '第37回', '第38回'];

// ─── Subject list (13 subjects) ───────────────────────────────────────────────
// 午前 8科目（63問 / 100分）
const AM_SUBJECTS = [
  '人間の尊厳と自立', '人間関係とコミュニケーション', '社会の理解',
  'こころとからだのしくみ', '発達と老化の理解', '認知症の理解', '障害の理解', '医療的ケア',
];
// 午後 5科目（62問 / 120分）
const PM_SUBJECTS = [
  '介護の基本', 'コミュニケーション技術', '生活支援技術', '介護過程', '総合問題',
];
const ALL_SUBJECTS = [...AM_SUBJECTS, ...PM_SUBJECTS];

// Round to year label
const KAI_YEAR: Record<string, string> = {
  '第31回': '平成30年度', '第32回': '令和元年度', '第33回': '令和2年度',
  '第34回': '令和3年度', '第35回': '令和4年度', '第36回': '令和5年度',
  '第37回': '令和6年度', '第38回': '令和7年度',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildQuestions(mode: Mode, selectedSubjects: string[], selectedKai: string, period: Period, bank: Question[]): Question[] {
  if (mode === 'subject') {
    return shuffle(bank.filter(q => selectedSubjects.includes(q.subject)));
  }
  // kai mode: filter by round and period, preserve original order (no shuffle)
  return bank.filter(q => {
    if (q.kai !== selectedKai) return false;
    if (period === 'both') return true;
    return q.period === period;
  });
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

// Pass rule: overall ≥ 60% AND every subject has ≥ 1 correct answer
function calcPassFail(questions: Question[], answers: (number | null)[]) {
  const correct = answers.filter((a, i) => a === questions[i].correctAnswer).length;
  const total = questions.length;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  const subjectMap: Record<string, { correct: number; total: number }> = {};
  questions.forEach((q, i) => {
    if (!subjectMap[q.subject]) subjectMap[q.subject] = { correct: 0, total: 0 };
    subjectMap[q.subject].total++;
    if (answers[i] === q.correctAnswer) subjectMap[q.subject].correct++;
  });

  const failedSubjects = Object.entries(subjectMap)
    .filter(([, v]) => v.total > 0 && v.correct === 0)
    .map(([name]) => name);

  const passed = pct >= 60 && failedSubjects.length === 0;
  return { correct, total, pct, subjectMap, failedSubjects, passed };
}

// ─── Subcomponents ────────────────────────────────────────────────────────────

function ModeCard({
  icon, title, subtitle, tag, onClick,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  tag?: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="group relative bg-white/5 border border-metallic-gold/20 rounded-2xl p-6 text-left flex flex-col gap-3 hover:border-metallic-gold hover:shadow-[0_0_24px_rgba(212,175,55,0.15)] transition-all duration-300"
    >
      {tag && (
        <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest text-metallic-gold/60 bg-metallic-gold/10 px-2 py-0.5 rounded-full">
          {tag}
        </span>
      )}
      <div className="w-12 h-12 rounded-xl bg-metallic-gold/10 flex items-center justify-center text-metallic-gold group-hover:bg-metallic-gold/20 transition-colors">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{subtitle}</p>
      </div>
      <div className="mt-auto flex items-center gap-1 text-xs font-bold text-metallic-gold/60 group-hover:text-metallic-gold transition-colors">
        開始する <ArrowRight size={12} />
      </div>
    </motion.button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MockTest() {
  type Screen = 'home' | 'subject-select' | 'kai-select' | 'kai-period-select' | 'exam' | 'results';
  const [screen, setScreen] = useState<Screen>('home');
  const [activeMode, setActiveMode] = useState<Mode>('subject');
  const questionBank = useRef<Question[]>(ALL_QUESTIONS);

  useEffect(() => {
    supabase.from('questions').select('*').order('created_at').then(({ data }) => {
      if (data && data.length > 0) {
        questionBank.current = data.map(q => ({ ...q, correctAnswer: q.correct_answer }));
      }
    });
  }, []);

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedKai, setSelectedKai] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('both');

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);

  // Timer
  useEffect(() => {
    if (screen !== 'exam') return;
    if (timeLeft <= 0) {
      finishExam();
      return;
    }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [screen, timeLeft]);

  // ── Handlers ──────────────────────────────────────────────────────

  function pickMode(mode: Mode) {
    setActiveMode(mode);
    if (mode === 'subject') {
      setSelectedSubjects([]);
      setScreen('subject-select');
    } else {
      setScreen('kai-select');
    }
  }

  function launchExam(mode: Mode, subjects: string[], kai: string, period: Period = 'both') {
    const qs = buildQuestions(mode, subjects, kai, period, questionBank.current);
    if (!qs.length) return;
    setQuestions(qs);
    setCurrentIndex(0);
    setAnswers(new Array(qs.length).fill(null));
    setSelectedAnswer(null);
    // Kai mode: AM=100min, PM=120min, both=220min; subject practice ~90s/q
    const seconds = mode === 'kai'
      ? (period === 'am' ? 100 : period === 'pm' ? 120 : 220) * 60
      : Math.max(qs.length * 90, 300);
    setTimeLeft(seconds);
    setAiFeedback(null);
    setScreen('exam');
  }

  function handleAnswer(idx: number) {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    const updated = [...answers];
    updated[currentIndex] = idx;
    setAnswers(updated);
  }

  function handleNext() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(p => p + 1);
      setSelectedAnswer(null);
    } else {
      finishExam();
    }
  }

  function finishExam() {
    setScreen('results');
    fetchAiFeedback();
  }

  async function fetchAiFeedback() {
    setIsLoadingFeedback(true);
    try {
      const { correct, total } = calcPassFail(questions, answers);
      const res = await fetch('/api/ai-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: correct, total, timeLeft }),
      });
      const data = await res.json();
      setAiFeedback(data.feedback ?? 'Great effort! Keep practicing.');
    } catch {
      setAiFeedback('Great effort! Keep practicing to master the concepts.');
    } finally {
      setIsLoadingFeedback(false);
    }
  }

  function restart() {
    setScreen('home');
    setSelectedSubjects([]);
    setSelectedKai('');
    setSelectedPeriod('both');
    setQuestions([]);
    setAnswers([]);
    setSelectedAnswer(null);
    setAiFeedback(null);
  }

  const result = screen === 'results' ? calcPassFail(questions, answers) : null;

  function toggleSubject(s: string) {
    setSelectedSubjects(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  }

  // Count questions per kai for display
  const kaiCounts: Record<string, number> = {};
  ALL_QUESTIONS.forEach(q => {
    kaiCounts[q.kai] = (kaiCounts[q.kai] ?? 0) + 1;
  });

  const periodLabel = selectedPeriod === 'am' ? '午前' : selectedPeriod === 'pm' ? '午後' : '全問';
  const modeLabel = activeMode === 'subject' ? '科目練習' : selectedKai ? `${selectedKai} ${periodLabel}` : '回別試験';

  return (
    <section id="mocktest" className="py-24 bg-matte-black/50 border-t border-metallic-gold/10">
      <div className="max-w-4xl mx-auto px-4">

        {/* Section header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ClipboardCheck className="text-metallic-gold" size={24} />
            <span className="text-xs font-bold uppercase tracking-widest text-metallic-gold/60">Module 05</span>
          </div>
          <h2 className="text-4xl font-bold mb-4">Strategic <span className="gold-gradient">Mock Test</span></h2>
          <p className="text-gray-400">Simulate the national exam with timed questions, AI insights, and real pass conditions.</p>
        </div>

        <AnimatePresence mode="wait">

          {/* ── HOME ─────────────────────────────────────────────── */}
          {screen === 'home' && (
            <motion.div key="home" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <ModeCard
                  icon={<BookOpen size={24} />}
                  title="科目別練習"
                  subtitle="13科目から選んで重点的に練習。苦手分野を集中攻略。"
                  tag="Practice"
                  onClick={() => pickMode('subject')}
                />
                <ModeCard
                  icon={<GraduationCap size={24} />}
                  title="回別試験"
                  subtitle="第31回〜第38回から受けたい年度を選んで本番形式で挑戦。"
                  tag="Past Exam"
                  onClick={() => pickMode('kai')}
                />
              </div>

              <p className="text-center text-xs text-gray-600 mt-8 uppercase tracking-widest">
                合格条件: 総合正解率 60%以上 かつ 各科目で1問以上正解
              </p>
            </motion.div>
          )}

          {/* ── KAI SELECT ───────────────────────────────────────── */}
          {screen === 'kai-select' && (
            <motion.div key="kai-select" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <button onClick={() => setScreen('home')} className="flex items-center gap-2 text-metallic-gold hover:text-white transition-colors mb-8 text-sm font-bold">
                <ChevronLeft size={16} /> モード選択に戻る
              </button>

              <div className="bg-white/5 border border-metallic-gold/20 rounded-3xl p-8">
                <h3 className="text-xl font-bold text-white mb-2">受験回を選択してください</h3>
                <p className="text-gray-500 text-sm mb-8">第31回〜第38回の介護福祉士国家試験過去問から選べます。</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {ALL_KAI.map(kai => {
                    const count = kaiCounts[kai] ?? 0;
                    const year = KAI_YEAR[kai] ?? '';
                    return (
                      <motion.button
                        key={kai}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          setSelectedKai(kai);
                          setScreen('kai-period-select');
                        }}
                        className="group bg-white/5 border border-metallic-gold/20 rounded-2xl p-5 text-center hover:border-metallic-gold hover:bg-white/10 transition-all"
                      >
                        <div className="text-xl font-bold text-white mb-1">{kai}</div>
                        <div className="text-xs text-gray-500 mb-3">{year}</div>
                        <div className="text-xs font-bold text-metallic-gold/60 group-hover:text-metallic-gold transition-colors">
                          {count}問
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── KAI PERIOD SELECT ────────────────────────────────── */}
          {screen === 'kai-period-select' && selectedKai && (
            <motion.div key="kai-period-select" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <button onClick={() => setScreen('kai-select')} className="flex items-center gap-2 text-metallic-gold hover:text-white transition-colors mb-8 text-sm font-bold">
                <ChevronLeft size={16} /> 年度選択に戻る
              </button>

              <div className="bg-white/5 border border-metallic-gold/20 rounded-3xl p-8">
                <h3 className="text-xl font-bold text-white mb-1">{selectedKai} — 受験区分を選択</h3>
                <p className="text-gray-500 text-sm mb-8">{KAI_YEAR[selectedKai]} の午前・午後・両方から選んでください。</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(
                    [
                      { period: 'am' as Period, label: '午前', labelEn: 'AM', time: '100分', desc: '人間の尊厳・社会の理解・こころとからだ・認知症・障害・医療的ケア など（8科目）' },
                      { period: 'pm' as Period, label: '午後', labelEn: 'PM', time: '120分', desc: '介護の基本・コミュニケーション・生活支援・介護過程・総合問題（5科目）' },
                      { period: 'both' as Period, label: '全問', labelEn: 'AM + PM', time: '220分', desc: '午前・午後すべての問題を通して挑戦（13科目）' },
                    ] as { period: Period; label: string; labelEn: string; time: string; desc: string }[]
                  ).map(({ period, label, labelEn, time, desc }) => {
                    const count = ALL_QUESTIONS.filter(q => q.kai === selectedKai && (period === 'both' || q.period === period)).length;
                    return (
                      <motion.button
                        key={period}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          setSelectedPeriod(period);
                          launchExam('kai', [], selectedKai, period);
                        }}
                        className="group bg-white/5 border border-metallic-gold/20 rounded-2xl p-6 text-left flex flex-col gap-3 hover:border-metallic-gold hover:bg-white/10 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-white">{label}</span>
                          <span className="text-xs font-bold uppercase tracking-widest text-metallic-gold/60 bg-metallic-gold/10 px-2 py-0.5 rounded-full">{labelEn}</span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                        <div className="mt-auto flex items-center justify-between text-xs font-bold text-metallic-gold/60 group-hover:text-metallic-gold transition-colors">
                          <span>{count}問</span>
                          <span>{time}</span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── SUBJECT SELECT ────────────────────────────────────── */}
          {screen === 'subject-select' && (
            <motion.div key="subject-select" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <button onClick={() => setScreen('home')} className="flex items-center gap-2 text-metallic-gold hover:text-white transition-colors mb-8 text-sm font-bold">
                <ChevronLeft size={16} /> モード選択に戻る
              </button>

              <div className="bg-white/5 border border-metallic-gold/20 rounded-3xl p-8">
                <h3 className="text-xl font-bold text-white mb-2">科目を選択してください</h3>
                <p className="text-gray-500 text-sm mb-8">1科目以上選択してスタート。複数選択可。</p>

                <div className="mb-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-metallic-gold/60 mb-3">午前科目</p>
                  <div className="flex flex-wrap gap-2">
                    {AM_SUBJECTS.map(s => (
                      <button
                        key={s}
                        onClick={() => toggleSubject(s)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                          selectedSubjects.includes(s)
                            ? 'bg-metallic-gold text-matte-black border-metallic-gold'
                            : 'bg-white/5 text-gray-400 border-white/10 hover:border-metallic-gold/40'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-xs font-bold uppercase tracking-widest text-metallic-gold/60 mb-3">午後科目</p>
                  <div className="flex flex-wrap gap-2">
                    {PM_SUBJECTS.map(s => (
                      <button
                        key={s}
                        onClick={() => toggleSubject(s)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                          selectedSubjects.includes(s)
                            ? 'bg-metallic-gold text-matte-black border-metallic-gold'
                            : 'bg-white/5 text-gray-400 border-white/10 hover:border-metallic-gold/40'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSelectedSubjects(ALL_SUBJECTS)}
                    className="text-xs font-bold text-metallic-gold/60 hover:text-metallic-gold transition-colors uppercase tracking-widest"
                  >
                    全科目選択
                  </button>
                  <button
                    onClick={() => setSelectedSubjects([])}
                    className="text-xs font-bold text-gray-600 hover:text-gray-400 transition-colors uppercase tracking-widest"
                  >
                    クリア
                  </button>
                  <div className="ml-auto">
                    <button
                      onClick={() => launchExam('subject', selectedSubjects, '')}
                      disabled={selectedSubjects.length === 0}
                      className="gold-button gold-glow-hover disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      開始する <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── EXAM ──────────────────────────────────────────────── */}
          {screen === 'exam' && questions.length > 0 && (
            <motion.div key="exam" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              {/* Header bar */}
              <div className="flex items-center justify-between bg-white/5 px-5 py-3 rounded-2xl border border-white/5 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-metallic-gold/60">{modeLabel}</span>
                  <span className="text-sm font-bold text-gray-500">
                    問題 <span className="text-metallic-gold">{currentIndex + 1}</span> / {questions.length}
                  </span>
                </div>
                <div className={`flex items-center gap-2 font-mono font-bold ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-metallic-gold'}`}>
                  <Timer size={16} />
                  {formatTime(timeLeft)}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1 bg-white/10 rounded-full mb-8 overflow-hidden">
                <motion.div
                  className="h-full bg-metallic-gold rounded-full"
                  initial={false}
                  animate={{ width: `${((currentIndex) / questions.length) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/5 border border-metallic-gold/10 rounded-3xl p-8 md:p-12"
              >
                {/* Subject tag */}
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-metallic-gold/10 text-metallic-gold/80">
                    {questions[currentIndex].subject}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 text-gray-500">
                    {questions[currentIndex].period === 'am' ? '午前' : '午後'}
                  </span>
                </div>

                <h3 className="text-xl md:text-2xl font-bold mb-10 leading-relaxed text-white">
                  {questions[currentIndex].question}
                </h3>

                <div className="space-y-4">
                  {questions[currentIndex].options.map((option, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrect = idx === questions[currentIndex].correctAnswer;
                    const showResult = selectedAnswer !== null;

                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        disabled={showResult}
                        className={`w-full p-5 rounded-2xl text-left transition-all flex items-center justify-between border gold-glow-hover ${
                          showResult
                            ? isCorrect
                              ? 'bg-green-500/10 border-green-500/50 text-green-400'
                              : isSelected
                                ? 'bg-red-500/10 border-red-500/50 text-red-400'
                                : 'bg-white/5 border-white/5 text-gray-600'
                            : 'bg-white/5 border-white/10 text-gray-300 hover:border-metallic-gold/50 hover:bg-white/10'
                        }`}
                      >
                        <span className="font-medium">{option}</span>
                        {showResult && isCorrect && <CheckCircle2 size={18} />}
                        {showResult && isSelected && !isCorrect && <XCircle size={18} />}
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {selectedAnswer !== null && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-8 pt-8 border-t border-white/5"
                    >
                      <div className="bg-white/5 rounded-2xl p-5 mb-6">
                        <p className="text-xs font-bold text-metallic-gold uppercase tracking-widest mb-2">解説</p>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          {questions[currentIndex].explanation}
                        </p>
                      </div>
                      <button
                        onClick={handleNext}
                        className="gold-button w-full flex items-center justify-center gap-2 gold-glow-hover"
                      >
                        {currentIndex === questions.length - 1 ? '採点・結果を見る' : '次の問題'}
                        <ArrowRight size={18} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}

          {/* ── RESULTS ───────────────────────────────────────────── */}
          {screen === 'results' && result && (
            <motion.div key="results" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

              {/* Pass / Fail banner */}
              <div className={`rounded-3xl p-8 mb-8 text-center border ${
                result.passed
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-red-500/10 border-red-500/30'
              }`}>
                <div className={`text-4xl font-bold mb-2 ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                  {result.passed ? '✓ 合格' : '✗ 不合格'}
                </div>
                {!result.passed && result.failedSubjects.length > 0 && (
                  <div className="flex items-center justify-center gap-2 text-sm text-red-400/80 mt-2">
                    <AlertTriangle size={14} />
                    <span>0点科目: {result.failedSubjects.join('、')}</span>
                  </div>
                )}
                {!result.passed && result.pct < 60 && (
                  <p className="text-sm text-red-400/70 mt-1">総合正解率が60%に達していません ({result.pct}%)</p>
                )}
              </div>

              {/* Score cards */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { label: 'SCORE', value: `${result.correct} / ${result.total}` },
                  { label: 'CORRECT', value: `${result.pct}%` },
                  { label: 'TIME LEFT', value: formatTime(timeLeft) },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-matte-black border border-white/5 rounded-2xl p-6 text-center">
                    <p className="text-xs text-gray-600 uppercase tracking-widest mb-2">{label}</p>
                    <p className="text-3xl font-bold text-metallic-gold">{value}</p>
                  </div>
                ))}
              </div>

              {/* Per-subject breakdown */}
              <div className="bg-white/5 border border-white/5 rounded-2xl p-6 mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-metallic-gold/60 mb-4">科目別成績</p>
                <div className="space-y-2">
                  {Object.entries(result.subjectMap).map(([name, { correct: c, total: t }]) => {
                    const pct = Math.round((c / t) * 100);
                    const ok = c > 0;
                    return (
                      <div key={name} className="flex items-center gap-3">
                        <span className="text-sm text-gray-400 w-44 shrink-0 truncate">{name}</span>
                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${ok ? 'bg-metallic-gold' : 'bg-red-500'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className={`text-xs font-bold w-16 text-right ${ok ? 'text-gray-400' : 'text-red-400'}`}>
                          {c}/{t} ({pct}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* AI Feedback */}
              <div className="bg-metallic-gold/5 border border-metallic-gold/20 rounded-2xl p-8 mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="text-metallic-gold" size={18} />
                  <h4 className="font-bold text-metallic-gold uppercase tracking-widest text-xs">AI Performance Feedback</h4>
                </div>
                {isLoadingFeedback ? (
                  <div className="flex items-center gap-3 text-gray-500 italic text-sm">
                    <RefreshCcw className="animate-spin" size={14} />
                    Analyzing your performance...
                  </div>
                ) : (
                  <p className="text-gray-300 leading-relaxed text-sm whitespace-pre-wrap">{aiFeedback}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => launchExam(activeMode, selectedSubjects, selectedKai, selectedPeriod)}
                  className="flex-1 py-4 rounded-full border border-metallic-gold/30 text-metallic-gold font-bold hover:bg-metallic-gold/5 transition-all flex items-center justify-center gap-2 gold-glow-hover"
                >
                  <RefreshCcw size={16} /> 同じモードで再挑戦
                </button>
                <button
                  onClick={restart}
                  className="flex-1 gold-button flex items-center justify-center gap-2 gold-glow-hover"
                >
                  モード選択に戻る <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </section>
  );
}
