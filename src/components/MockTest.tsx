/**
 * MockTest.tsx — updated
 * Mode selection: Subject Practice | AM Exam | PM Exam | Full Exam
 * Pass system: overall ≥ 60% AND no subject with 0 correct.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ClipboardCheck, Timer, ArrowRight, CheckCircle2, XCircle,
  Sparkles, RefreshCcw, BookOpen, Sun, Moon, GraduationCap,
  ChevronLeft, AlertTriangle,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = 'subject' | 'am' | 'pm' | 'full';

interface Question {
  id: string;
  subject: string;
  period: 'am' | 'pm';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// ─── Question Bank ─────────────────────────────────────────────────────────────
// Replace / extend this array with your full question set.
// Fields: subject, period ('am' | 'pm'), question, options[4], correctAnswer (0-based), explanation

const ALL_QUESTIONS: Question[] = [
  // ── AM subjects ──────────────────────────────────────────────────
  {
    id: 'am-01',
    subject: '人間の尊厳と自立',
    period: 'am',
    question: '介護の基本理念として最も適切なものはどれですか？',
    options: ['効率を最優先にする', '利用者の自己決定を尊重する', '介護者が全てを決定する', '家族の意向を最優先にする'],
    correctAnswer: 1,
    explanation: '介護の基本は利用者の尊厳を守り、自己決定を尊重・支援することです。',
  },
  {
    id: 'am-02',
    subject: '人間関係とコミュニケーション',
    period: 'am',
    question: 'バイステックの7原則のうち「意図的な感情の表出」が意味するものはどれですか？',
    options: [
      '介護者が感情を表現すること',
      '利用者が感情を自由に表現できるよう支援すること',
      '感情を抑制すること',
      '家族に感情を伝えること',
    ],
    correctAnswer: 1,
    explanation: '「意図的な感情の表出」とは、利用者が否定的な感情も含めて自由に表現できるよう意図的に援助することです。',
  },
  {
    id: 'am-03',
    subject: '社会の理解',
    period: 'am',
    question: '介護保険制度において、保険者は誰ですか？',
    options: ['都道府県', '市町村・特別区', '国', '厚生労働省'],
    correctAnswer: 1,
    explanation: '介護保険の保険者は原則として市町村（および特別区）です。国と都道府県は財政支援を行います。',
  },
  {
    id: 'am-04',
    subject: '介護の基本',
    period: 'am',
    question: 'ICF（国際生活機能分類）の構成要素に含まれないものはどれですか？',
    options: ['心身機能・身体構造', '活動', 'QOL（生活の質）', '参加'],
    correctAnswer: 2,
    explanation: 'ICFの構成要素は「心身機能・身体構造」「活動」「参加」「環境因子」「個人因子」です。QOLはICFの構成要素ではありません。',
  },
  {
    id: 'am-05',
    subject: 'コミュニケーション技術',
    period: 'am',
    question: '傾聴の技法として正しいものはどれですか？',
    options: ['解決策をすぐに提案する', '相手の言葉を否定する', '相手の感情を反映させて返す', '自分の意見を積極的に述べる'],
    correctAnswer: 2,
    explanation: '傾聴では相手の感情を受け止め、共感的に返すこと（感情の反映）が重要です。',
  },
  {
    id: 'am-06',
    subject: '人間の尊厳と自立',
    period: 'am',
    question: '「ノーマライゼーション」の理念として最も適切なものはどれですか？',
    options: [
      '障害者を施設に隔離して保護する',
      '障害のある人も地域で普通の生活を送れるようにする',
      '障害者と健常者を区別して支援する',
      '家族だけで障害者を支援する',
    ],
    correctAnswer: 1,
    explanation: 'ノーマライゼーションとは、障害のある人もない人も同様に地域社会で普通の生活を営めるようにするという理念です。',
  },
  {
    id: 'am-07',
    subject: '社会の理解',
    period: 'am',
    question: '地域包括支援センターの設置主体はどれですか？',
    options: ['国', '都道府県', '市町村', '社会福祉法人'],
    correctAnswer: 2,
    explanation: '地域包括支援センターは市町村が設置します。高齢者の総合相談・権利擁護・ケアマネジメント支援を行います。',
  },
  {
    id: 'am-08',
    subject: '介護の基本',
    period: 'am',
    question: 'ADL（日常生活動作）に含まれないものはどれですか？',
    options: ['食事', '入浴', '料理', '排泄'],
    correctAnswer: 2,
    explanation: 'ADLは食事・入浴・排泄・移動などの基本動作です。「料理」はIADL（手段的日常生活動作）に分類されます。',
  },

  // ── PM subjects ──────────────────────────────────────────────────
  {
    id: 'pm-01',
    subject: '生活支援技術',
    period: 'pm',
    question: '片麻痺のある利用者の更衣介助で正しいものはどれですか？',
    options: ['健側から脱いで患側から着る', '患側から脱いで健側から着る', '健側から脱いで健側から着る', '患側から脱いで患側から着る'],
    correctAnswer: 0,
    explanation: '更衣介助の原則は「脱健着患」——脱ぐときは健側から、着るときは患側から行います。',
  },
  {
    id: 'pm-02',
    subject: '介護過程',
    period: 'pm',
    question: '介護過程の展開として正しい順序はどれですか？',
    options: [
      '計画→アセスメント→実施→評価',
      'アセスメント→計画→実施→評価',
      '実施→アセスメント→計画→評価',
      '評価→計画→実施→アセスメント',
    ],
    correctAnswer: 1,
    explanation: '介護過程はアセスメント→計画立案→実施→評価のPDCAサイクルで展開します。',
  },
  {
    id: 'pm-03',
    subject: '発達と老化の理解',
    period: 'pm',
    question: 'エリクソンの発達理論において老年期の課題はどれですか？',
    options: ['自我同一性の確立', '親密性の獲得', '自我の統合 vs 絶望', '生殖性の獲得'],
    correctAnswer: 2,
    explanation: 'エリクソンは老年期の発達課題を「自我の統合（対）絶望」としています。人生を振り返り意味を見出すことが課題です。',
  },
  {
    id: 'pm-04',
    subject: '認知症の理解',
    period: 'pm',
    question: '認知症の中核症状に含まれるものはどれですか？',
    options: ['幻覚', '記憶障害', 'うつ状態', '徘徊'],
    correctAnswer: 1,
    explanation: '記憶障害は認知症の中核症状です。幻覚・うつ・徘徊は周辺症状（BPSD）に分類されます。',
  },
  {
    id: 'pm-05',
    subject: '障害の理解',
    period: 'pm',
    question: '聴覚障害者とのコミュニケーション方法として適切でないものはどれですか？',
    options: ['手話', '口話（読唇術）', '筆談', '大声でゆっくり話す'],
    correctAnswer: 3,
    explanation: '大声で話しても聴覚障害者には伝わりません。手話・口話・筆談・補聴器の活用が適切です。',
  },
  {
    id: 'pm-06',
    subject: 'こころとからだのしくみ',
    period: 'pm',
    question: 'マズローの欲求の階層で最上位に位置するものはどれですか？',
    options: ['安全の欲求', '所属と愛の欲求', '自己実現の欲求', '承認の欲求'],
    correctAnswer: 2,
    explanation: 'マズローの欲求階層の最上位は「自己実現の欲求」です。生理的欲求→安全→所属→承認→自己実現の順です。',
  },
  {
    id: 'pm-07',
    subject: '医療的ケア',
    period: 'pm',
    question: '経管栄養を実施する際、介護福祉士が行える行為はどれですか？',
    options: ['胃ろうチューブの交換', '栄養剤の注入速度の調整（医師指示範囲内）', '栄養剤の注入', '経鼻胃管の挿入'],
    correctAnswer: 2,
    explanation: '一定の研修を修了した介護福祉士は、医師の指示のもと経管栄養（栄養剤の注入）を行えます。チューブの交換・挿入は医師・看護師の業務です。',
  },
  {
    id: 'pm-08',
    subject: '総合問題',
    period: 'pm',
    question: '利用者の「尊厳の保持」に基づく介護として最も適切なものはどれですか？',
    options: [
      '利用者の意思より効率を優先する',
      '利用者が選択・決定できるよう支援する',
      '介護者の判断でケアを進める',
      '家族の要望を最優先にする',
    ],
    correctAnswer: 1,
    explanation: '尊厳の保持とは利用者一人ひとりの個性・価値観・自己決定を尊重することです。',
  },
];

// ─── Subject list (13 subjects) ───────────────────────────────────────────────

const AM_SUBJECTS = ['人間の尊厳と自立', '人間関係とコミュニケーション', '社会の理解', '介護の基本', 'コミュニケーション技術'];
const PM_SUBJECTS = ['生活支援技術', '介護過程', '発達と老化の理解', '認知症の理解', '障害の理解', 'こころとからだのしくみ', '医療的ケア', '総合問題'];
const ALL_SUBJECTS = [...AM_SUBJECTS, ...PM_SUBJECTS];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildQuestions(mode: Mode, selectedSubjects: string[]): Question[] {
  if (mode === 'subject') {
    return shuffle(ALL_QUESTIONS.filter(q => selectedSubjects.includes(q.subject)));
  }
  if (mode === 'am') return shuffle(ALL_QUESTIONS.filter(q => q.period === 'am'));
  if (mode === 'pm') return shuffle(ALL_QUESTIONS.filter(q => q.period === 'pm'));
  return shuffle(ALL_QUESTIONS); // full
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

  // per-subject breakdown
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
  // Screen state
  type Screen = 'home' | 'subject-select' | 'exam' | 'results';
  const [screen, setScreen] = useState<Screen>('home');
  const [activeMode, setActiveMode] = useState<Mode>('subject');

  // Subject selection
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  // Exam state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  // Results
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
      launchExam(mode, []);
    }
  }

  function launchExam(mode: Mode, subjects: string[]) {
    const qs = buildQuestions(mode, subjects);
    if (!qs.length) return;
    setQuestions(qs);
    setCurrentIndex(0);
    setAnswers(new Array(qs.length).fill(null));
    setSelectedAnswer(null);
    const seconds = mode === 'full' ? 120 * 60 : mode === 'am' || mode === 'pm' ? 60 * 60 : Math.max(qs.length * 90, 300);
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
    setQuestions([]);
    setAnswers([]);
    setSelectedAnswer(null);
    setAiFeedback(null);
  }

  // ── Results calc ──────────────────────────────────────────────────
  const result = screen === 'results' ? calcPassFail(questions, answers) : null;

  // ── Subject select toggle ─────────────────────────────────────────
  function toggleSubject(s: string) {
    setSelectedSubjects(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  }

  // ─── Render ───────────────────────────────────────────────────────

  const modeLabel: Record<Mode, string> = {
    subject: '科目練習',
    am: '午前 (AM)',
    pm: '午後 (PM)',
    full: '本試験',
  };

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

          {/* ── HOME: mode selection ──────────────────────────────── */}
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
                  icon={<Sun size={24} />}
                  title="午前試験 (AM)"
                  subtitle="午前の出題科目をまとめて模擬受験。時間を計って本番に備える。"
                  tag="AM Exam"
                  onClick={() => pickMode('am')}
                />
                <ModeCard
                  icon={<Moon size={24} />}
                  title="午後試験 (PM)"
                  subtitle="午後の出題科目を集中的に模擬受験。解説付きで理解を深める。"
                  tag="PM Exam"
                  onClick={() => pickMode('pm')}
                />
                <ModeCard
                  icon={<GraduationCap size={24} />}
                  title="本試験モード (Full)"
                  subtitle="午前＋午後の全科目を通し受験。合否判定付きの完全シミュレーション。"
                  tag="🔥 Full Exam"
                  onClick={() => pickMode('full')}
                />
              </div>

              <p className="text-center text-xs text-gray-600 mt-8 uppercase tracking-widest">
                合格条件: 総合正解率 60%以上 かつ 各科目で1問以上正解
              </p>
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
                      onClick={() => launchExam('subject', selectedSubjects)}
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
                  <span className="text-xs font-bold uppercase tracking-widest text-metallic-gold/60">{modeLabel[activeMode]}</span>
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
                  onClick={() => launchExam(activeMode, selectedSubjects)}
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
