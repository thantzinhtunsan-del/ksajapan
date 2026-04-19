/**
 * ExamPage.tsx
 * 介護福祉士 国家試験 本番シミュレーション
 * ・回別選択（第31回〜第38回）
 * ・Free: 第31回のみ  |  Paid: 全回
 * ・AM / PM / 全問 選択
 * ・合格条件: 得点 ≥ 60% AND 11科目群すべて1点以上
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PAST_QUESTIONS_JSON from '../data/pastQuestions.json';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap, Timer, ArrowRight, ArrowLeft,
  CheckCircle2, XCircle, AlertTriangle, Flag, RotateCcw,
  ChevronLeft, Lock,
} from 'lucide-react';
import { useProfile } from '../hooks/useProfile';

// ─── Types ────────────────────────────────────────────────────────────────────

type ExamPeriod = 'am' | 'pm' | 'both';
type Screen = 'select-kai' | 'select-period' | 'exam' | 'results';

interface Question {
  id: string;
  kai: string;
  subject: string;
  period: 'am' | 'pm';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  questionNo?: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ALL_QUESTIONS: Question[] = PAST_QUESTIONS_JSON as Question[];

const ALL_KAI = ['第31回', '第32回', '第33回', '第34回', '第35回', '第36回', '第37回', '第38回'];

const FREE_KAI = ['第31回'];  // accessible without paid plan

const KAI_YEAR: Record<string, string> = {
  '第31回': '平成30年度', '第32回': '令和元年度', '第33回': '令和2年度',
  '第34回': '令和3年度', '第35回': '令和4年度', '第36回': '令和5年度',
  '第37回': '令和6年度', '第38回': '令和7年度',
};

const AM_SUBJECTS = [
  '人間の尊厳と自立', '人間関係とコミュニケーション', '社会の理解',
  'こころとからだのしくみ', '発達と老化の理解', '認知症の理解', '障害の理解', '医療的ケア',
];
const PM_SUBJECTS = [
  '介護の基本', 'コミュニケーション技術', '生活支援技術', '介護過程', '総合問題',
];

// 11 subject groups for zero-score check
const SUBJECT_GROUPS = [
  { id: 1,  name: '人間の尊厳と自立・介護の基本',              subjects: ['人間の尊厳と自立', '介護の基本'] },
  { id: 2,  name: '人間関係とコミュニケーション・コミュニケーション技術', subjects: ['人間関係とコミュニケーション', 'コミュニケーション技術'] },
  { id: 3,  name: '社会の理解',                                subjects: ['社会の理解'] },
  { id: 4,  name: 'こころとからだのしくみ',                    subjects: ['こころとからだのしくみ'] },
  { id: 5,  name: '発達と老化の理解',                          subjects: ['発達と老化の理解'] },
  { id: 6,  name: '認知症の理解',                              subjects: ['認知症の理解'] },
  { id: 7,  name: '障害の理解',                                subjects: ['障害の理解'] },
  { id: 8,  name: '医療的ケア',                                subjects: ['医療的ケア'] },
  { id: 9,  name: '生活支援技術',                              subjects: ['生活支援技術'] },
  { id: 10, name: '介護過程',                                  subjects: ['介護過程'] },
  { id: 11, name: '総合問題',                                  subjects: ['総合問題'] },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(secs: number) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

function buildKaiExam(kai: string, period: ExamPeriod): Question[] {
  return ALL_QUESTIONS
    .filter(q => {
      if (q.kai !== kai) return false;
      if (period === 'both') return true;
      return q.period === period;
    })
    .sort((a, b) => (a.questionNo ?? 0) - (b.questionNo ?? 0));
}

function calcResults(questions: Question[], answers: (number | null)[]) {
  const total = questions.length;
  const correct = answers.filter((a, i) => a === questions[i].correctAnswer).length;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const passedScore = pct >= 60;

  const subjectMap: Record<string, { correct: number; total: number }> = {};
  questions.forEach((q, i) => {
    if (!subjectMap[q.subject]) subjectMap[q.subject] = { correct: 0, total: 0 };
    subjectMap[q.subject].total++;
    if (answers[i] === q.correctAnswer) subjectMap[q.subject].correct++;
  });

  const groupResults = SUBJECT_GROUPS.map(g => {
    const active = g.subjects.filter(s => subjectMap[s]);
    if (active.length === 0) return { ...g, correct: 0, total: 0, passed: true, skip: true };
    const gc = active.reduce((sum, s) => sum + subjectMap[s].correct, 0);
    const gt = active.reduce((sum, s) => sum + subjectMap[s].total, 0);
    return { ...g, correct: gc, total: gt, passed: gc > 0, skip: false };
  }).filter(g => !g.skip);

  const failedGroups = groupResults.filter(g => !g.passed);
  const passed = passedScore && failedGroups.length === 0;

  return { total, correct, pct, passedScore, subjectMap, groupResults, failedGroups, passed };
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface ExamPageProps {
  userId?: string;
  isLoggedIn: boolean;
  onSignIn: () => void;
}

export default function ExamPage({ userId, isLoggedIn, onSignIn }: ExamPageProps) {
  const { isPaid } = useProfile(userId);

  const [screen, setScreen] = useState<Screen>('select-kai');
  const [selectedKai, setSelectedKai] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<ExamPeriod>('both');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  // Timer
  useEffect(() => {
    if (screen !== 'exam' || submitted) return;
    if (timeLeft <= 0) { handleSubmit(); return; }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, timeLeft, submitted]);

  function canAccess(kai: string) {
    if (FREE_KAI.includes(kai)) return true;
    return isPaid;
  }

  function selectKai(kai: string) {
    if (!canAccess(kai)) return;
    setSelectedKai(kai);
    setScreen('select-period');
  }

  function startExam(period: ExamPeriod) {
    const qs = buildKaiExam(selectedKai, period);
    if (!qs.length) return;
    setSelectedPeriod(period);
    setQuestions(qs);
    setAnswers(new Array(qs.length).fill(null));
    setCurrentIndex(0);
    setSubmitted(false);
    // Timer: proportional to actual question count
    const amCount = qs.filter(q => AM_SUBJECTS.includes(q.subject)).length;
    const pmCount = qs.filter(q => PM_SUBJECTS.includes(q.subject)).length;
    const secs = period === 'am' ? 100 * 60 : period === 'pm' ? 120 * 60 : (amCount > 0 ? 100 : 0 + pmCount > 0 ? 120 : 0) * 60 || 220 * 60;
    setTimeLeft(secs);
    setScreen('exam');
  }

  function handleAnswer(idx: number) {
    if (submitted) return;
    const updated = [...answers];
    updated[currentIndex] = idx;
    setAnswers(updated);
  }

  function handleSubmit() {
    setSubmitted(true);
    setScreen('results');
  }

  function restart() {
    setScreen('select-kai');
    setSelectedKai('');
    setQuestions([]);
    setAnswers([]);
    setSubmitted(false);
  }

  const answeredCount = answers.filter(a => a !== null).length;
  const result = screen === 'results' ? calcResults(questions, answers) : null;

  // Count per-kai questions for display
  const kaiCounts: Record<string, number> = {};
  ALL_QUESTIONS.forEach(q => {
    kaiCounts[q.kai] = (kaiCounts[q.kai] ?? 0) + 1;
  });

  const periodAmCount = selectedKai ? ALL_QUESTIONS.filter(q => q.kai === selectedKai && AM_SUBJECTS.includes(q.subject)).length : 0;
  const periodPmCount = selectedKai ? ALL_QUESTIONS.filter(q => q.kai === selectedKai && PM_SUBJECTS.includes(q.subject)).length : 0;

  return (
    <div className="min-h-screen bg-matte-black">
      <div className="max-w-5xl mx-auto px-4 py-12">

        {/* Page header */}
        <div className="mb-10 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-metallic-gold/50 hover:text-metallic-gold text-sm font-bold mb-8 transition-colors"
          >
            <ChevronLeft size={15} /> ホームに戻る
          </Link>
          <div className="flex items-center justify-center gap-3 mb-3">
            <GraduationCap className="text-metallic-gold" size={30} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="gold-gradient">介護福祉士</span> 国家試験
          </h1>
          <p className="text-gray-400">過去問題を回別に本番形式で挑戦。合格条件完全再現。</p>
        </div>

        <AnimatePresence mode="wait">

          {/* ── 回 SELECT ───────────────────────────────────────────────── */}
          {screen === 'select-kai' && (
            <motion.div key="select-kai" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>

              {/* Pass conditions */}
              <div className="bg-white/5 border border-metallic-gold/20 rounded-2xl p-6 mb-8">
                <h3 className="text-xs font-bold uppercase tracking-widest text-metallic-gold/70 mb-4">合格の絶対条件</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-400">
                  <div className="flex items-start gap-3">
                    <span className="text-metallic-gold font-bold text-lg leading-none mt-0.5">①</span>
                    <span>総得点 <strong className="text-white">60%以上</strong>（約75点以上 / 125点満点）</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-metallic-gold font-bold text-lg leading-none mt-0.5">②</span>
                    <span><strong className="text-white">11の科目群</strong>すべてで1点以上（0点は即不合格）</span>
                  </div>
                </div>
              </div>

              {/* Free / Paid notice */}
              {!isPaid && (
                <div className="flex items-center gap-3 bg-metallic-gold/5 border border-metallic-gold/20 rounded-xl px-5 py-3 mb-6 text-sm">
                  <Lock size={15} className="text-metallic-gold/60 shrink-0" />
                  <span className="text-gray-400">
                    無料プランは <strong className="text-metallic-gold">第31回</strong> のみ受験可能。
                    有料プランで <strong className="text-white">第31〜38回</strong> すべてアクセス。
                  </span>
                  {!isLoggedIn && (
                    <button onClick={onSignIn} className="ml-auto text-xs font-bold text-metallic-gold whitespace-nowrap hover:underline">
                      ログイン →
                    </button>
                  )}
                </div>
              )}

              {/* 回 grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {ALL_KAI.map(kai => {
                  const accessible = canAccess(kai);
                  const count = kaiCounts[kai] ?? 0;
                  const isFree = FREE_KAI.includes(kai);
                  return (
                    <motion.button
                      key={kai}
                      whileHover={accessible ? { y: -2 } : {}}
                      whileTap={accessible ? { scale: 0.97 } : {}}
                      onClick={() => accessible ? selectKai(kai) : undefined}
                      className={`relative group rounded-2xl p-5 text-center border transition-all ${
                        accessible
                          ? 'bg-white/5 border-metallic-gold/20 hover:border-metallic-gold hover:shadow-[0_0_20px_rgba(212,175,55,0.12)] cursor-pointer'
                          : 'bg-white/3 border-white/5 cursor-not-allowed opacity-50'
                      }`}
                    >
                      {isFree && (
                        <span className="absolute top-2 right-2 text-[9px] font-bold uppercase tracking-widest text-metallic-gold/70 bg-metallic-gold/10 px-1.5 py-0.5 rounded-full">
                          FREE
                        </span>
                      )}
                      {!accessible && (
                        <Lock size={14} className="absolute top-3 right-3 text-gray-600" />
                      )}
                      <div className="text-2xl font-bold text-white mb-1">{kai}</div>
                      <div className="text-xs text-gray-600 mb-3">{KAI_YEAR[kai]}</div>
                      <div className={`text-xs font-bold ${accessible ? 'text-metallic-gold/60 group-hover:text-metallic-gold' : 'text-gray-700'} transition-colors`}>
                        {count}問収録
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* 11 groups reference */}
              <div className="mt-8 bg-white/5 border border-white/5 rounded-2xl p-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-4">11科目群（0点で即不合格）</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SUBJECT_GROUPS.map(g => (
                    <div key={g.id} className="flex items-start gap-2 text-xs text-gray-500">
                      <span className="text-metallic-gold/40 font-bold w-6 shrink-0">#{g.id}</span>
                      <span>{g.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── PERIOD SELECT ────────────────────────────────────────────── */}
          {screen === 'select-period' && selectedKai && (
            <motion.div key="select-period" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <button onClick={() => setScreen('select-kai')} className="flex items-center gap-2 text-metallic-gold hover:text-white transition-colors mb-8 text-sm font-bold">
                <ChevronLeft size={16} /> 回選択に戻る
              </button>

              <div className="bg-white/5 border border-metallic-gold/20 rounded-3xl p-8">
                <h3 className="text-xl font-bold text-white mb-1">{selectedKai}（{KAI_YEAR[selectedKai]}）</h3>
                <p className="text-gray-500 text-sm mb-8">受験する区分を選択してください。</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { period: 'am' as ExamPeriod, label: '午前', labelEn: 'AM', time: '100分', count: periodAmCount, desc: '人間の尊厳・社会の理解・こころとからだ・認知症・障害・医療的ケア など' },
                    { period: 'pm' as ExamPeriod, label: '午後', labelEn: 'PM', time: '120分', count: periodPmCount, desc: '介護の基本・コミュニケーション・生活支援・介護過程・総合問題' },
                    { period: 'both' as ExamPeriod, label: '全問', labelEn: 'FULL', time: '220分', count: periodAmCount + periodPmCount, desc: '午前・午後すべて通して挑戦（13科目）' },
                  ].map(({ period, label, labelEn, time, count, desc }) => (
                    <motion.button
                      key={period}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => startExam(period)}
                      disabled={count === 0}
                      className="group bg-white/5 border border-metallic-gold/20 rounded-2xl p-6 text-left flex flex-col gap-3 hover:border-metallic-gold hover:bg-white/10 transition-all disabled:opacity-30"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-white">{label}</span>
                        <span className="text-xs font-bold uppercase tracking-widest text-metallic-gold/60 bg-metallic-gold/10 px-2 py-0.5 rounded-full">{labelEn}</span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                      <div className="mt-auto flex items-center justify-between text-xs font-bold">
                        <span className="text-metallic-gold/50 group-hover:text-metallic-gold transition-colors flex items-center gap-1">
                          <Timer size={11} /> {time}
                        </span>
                        <span className="text-gray-500 group-hover:text-metallic-gold/60 transition-colors">{count}問</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── EXAM ────────────────────────────────────────────────────── */}
          {screen === 'exam' && questions.length > 0 && (
            <motion.div key="exam" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

              {/* Header */}
              <div className="flex items-center justify-between bg-white/5 border border-white/5 rounded-2xl px-5 py-3 mb-5">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-metallic-gold/60">
                    {selectedKai} · {selectedPeriod === 'am' ? '午前' : selectedPeriod === 'pm' ? '午後' : '全問'}
                  </span>
                  <span className="text-sm text-gray-500">
                    回答済 <span className="text-metallic-gold font-bold">{answeredCount}</span> / {questions.length}
                  </span>
                </div>
                <div className={`flex items-center gap-2 font-mono font-bold text-lg ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-metallic-gold'}`}>
                  <Timer size={18} />
                  {formatTime(timeLeft)}
                </div>
              </div>

              {/* Question number grid */}
              <div className="bg-white/5 border border-white/5 rounded-2xl p-4 mb-5">
                <p className="text-xs text-gray-600 uppercase tracking-widest mb-3">問題一覧 — タップでジャンプ</p>
                <div className="flex flex-wrap gap-1.5">
                  {questions.map((_, i) => {
                    const answered = answers[i] !== null;
                    const isCurrent = i === currentIndex;
                    return (
                      <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                          isCurrent
                            ? 'bg-metallic-gold text-matte-black'
                            : answered
                              ? 'bg-metallic-gold/20 text-metallic-gold border border-metallic-gold/30'
                              : 'bg-white/5 text-gray-600 hover:bg-white/10 hover:text-gray-400 border border-white/10'
                        }`}
                      >
                        {i + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question card */}
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white/5 border border-metallic-gold/10 rounded-3xl p-8 md:p-10 mb-5"
              >
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-metallic-gold/10 text-metallic-gold/80">
                    {questions[currentIndex].subject}
                  </span>
                  <span className="text-xs text-gray-600">
                    問題 {questions[currentIndex].questionNo ?? currentIndex + 1}
                  </span>
                </div>

                <h3 className="text-lg md:text-xl font-bold mb-8 leading-relaxed text-white">
                  {questions[currentIndex].question}
                </h3>

                <div className="space-y-3">
                  {questions[currentIndex].options.map((option, idx) => {
                    const isSelected = answers[currentIndex] === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        className={`w-full p-4 rounded-xl text-left transition-all border flex items-center gap-3 ${
                          isSelected
                            ? 'bg-metallic-gold/15 border-metallic-gold text-white'
                            : 'bg-white/5 border-white/10 text-gray-300 hover:border-metallic-gold/40 hover:bg-white/10'
                        }`}
                      >
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                          isSelected ? 'bg-metallic-gold text-matte-black' : 'bg-white/10 text-gray-500'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="text-sm leading-relaxed">{option}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>

              {/* Navigation */}
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() => setCurrentIndex(p => Math.max(0, p - 1))}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 text-gray-400 hover:border-metallic-gold/40 hover:text-white transition-all disabled:opacity-30 text-sm font-bold"
                >
                  <ArrowLeft size={15} /> 前へ
                </button>

                {currentIndex === questions.length - 1 ? (
                  <button onClick={handleSubmit} className="gold-button gold-glow-hover flex items-center gap-2">
                    <Flag size={16} /> 採点・提出する
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentIndex(p => Math.min(questions.length - 1, p + 1))}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-metallic-gold/30 text-metallic-gold hover:bg-metallic-gold/5 transition-all text-sm font-bold"
                  >
                    次へ <ArrowRight size={15} />
                  </button>
                )}
              </div>

              {answeredCount === questions.length && currentIndex < questions.length - 1 && (
                <p className="text-center mt-5">
                  <button onClick={handleSubmit} className="text-sm text-metallic-gold/60 hover:text-metallic-gold underline transition-colors">
                    全問回答済み — 今すぐ採点する
                  </button>
                </p>
              )}
            </motion.div>
          )}

          {/* ── RESULTS ─────────────────────────────────────────────────── */}
          {screen === 'results' && result && (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

              {/* Pass/Fail banner */}
              <div className={`rounded-3xl p-10 mb-8 text-center border ${
                result.passed ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'
              }`}>
                <p className="text-sm text-gray-500 mb-2">{selectedKai}（{KAI_YEAR[selectedKai]}）</p>
                <div className={`text-6xl md:text-7xl font-bold mb-3 ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                  {result.passed ? '合格' : '不合格'}
                </div>
                <div className={`text-2xl font-bold mb-5 ${result.passed ? 'text-green-300' : 'text-red-300'}`}>
                  {result.correct} / {result.total} 問正解（{result.pct}%）
                </div>
                {!result.passedScore && (
                  <div className="flex items-center justify-center gap-2 text-sm text-red-400/80 mb-2">
                    <AlertTriangle size={15} />
                    <span>得点率不足（{result.pct}%、合格基準 60%以上）</span>
                  </div>
                )}
                {result.failedGroups.length > 0 && (
                  <div className="mt-4 space-y-1">
                    <p className="text-sm text-red-400 font-bold flex items-center justify-center gap-2 mb-2">
                      <AlertTriangle size={14} /> 0点科目群あり — 自動不合格
                    </p>
                    {result.failedGroups.map(g => (
                      <p key={g.id} className="text-xs text-red-400/60">#{g.id} {g.name}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* Score cards */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { label: '得点', value: `${result.correct}点` },
                  { label: '正解率', value: `${result.pct}%` },
                  { label: '合格基準', value: '60%以上' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-matte-black border border-white/5 rounded-2xl p-5 text-center">
                    <p className="text-xs text-gray-600 uppercase tracking-widest mb-2">{label}</p>
                    <p className="text-2xl md:text-3xl font-bold text-metallic-gold">{value}</p>
                  </div>
                ))}
              </div>

              {/* 11 groups */}
              <div className="bg-white/5 border border-white/5 rounded-2xl p-6 mb-6">
                <p className="text-xs font-bold uppercase tracking-widest text-metallic-gold/60 mb-4">11科目群 判定</p>
                <div className="space-y-3">
                  {result.groupResults.map(g => {
                    const pct = g.total > 0 ? Math.round((g.correct / g.total) * 100) : 0;
                    return (
                      <div key={g.id} className="flex items-center gap-3">
                        <span className={`text-xs font-bold w-5 shrink-0 ${g.passed ? 'text-metallic-gold/40' : 'text-red-500'}`}>#{g.id}</span>
                        <span className="text-xs text-gray-400 flex-1 min-w-0 truncate">{g.name}</span>
                        <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden shrink-0">
                          <div className={`h-full rounded-full ${g.passed ? 'bg-metallic-gold' : 'bg-red-500'}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className={`text-xs font-bold w-14 text-right shrink-0 ${g.passed ? 'text-gray-400' : 'text-red-400'}`}>{g.correct}/{g.total}</span>
                        {g.passed ? <CheckCircle2 size={14} className="text-metallic-gold/30 shrink-0" /> : <XCircle size={14} className="text-red-500 shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Per-subject */}
              <div className="bg-white/5 border border-white/5 rounded-2xl p-6 mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-metallic-gold/60 mb-4">科目別成績</p>
                <div className="space-y-2">
                  {Object.entries(result.subjectMap).map(([name, { correct: c, total: t }]) => {
                    const pct = Math.round((c / t) * 100);
                    return (
                      <div key={name} className="flex items-center gap-3">
                        <span className="text-xs text-gray-400 w-44 shrink-0 truncate">{name}</span>
                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${c > 0 ? 'bg-metallic-gold' : 'bg-red-500'}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-gray-500 w-20 text-right shrink-0">{c}/{t} ({pct}%)</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => startExam(selectedPeriod)}
                  className="flex-1 py-4 rounded-full border border-metallic-gold/30 text-metallic-gold font-bold hover:bg-metallic-gold/5 transition-all flex items-center justify-center gap-2 gold-glow-hover"
                >
                  <RotateCcw size={16} /> 同じ試験を再受験
                </button>
                <button onClick={restart} className="flex-1 gold-button flex items-center justify-center gap-2 gold-glow-hover">
                  回選択に戻る <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
