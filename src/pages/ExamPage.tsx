import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PAST_QUESTIONS_JSON from '../data/pastQuestions.json';
import {
  GraduationCap, Timer, ArrowRight, ArrowLeft,
  CheckCircle2, XCircle, AlertTriangle, Flag, RotateCcw, ChevronLeft, Clock,
} from 'lucide-react';
import { useProfile } from '../hooks/useProfile';

type ExamPart = 'a' | 'b' | 'c' | 'pm' | 'all';
type Screen = 'select-kai' | 'select-part' | 'exam' | 'results';

interface Question {
  id: string;
  kai: string;
  subject: string;
  period: 'am' | 'pm';
  question: string;
  options: string[];
  correctAnswer: number;
  questionNo?: number;
}

const ALL_QUESTIONS: Question[] = PAST_QUESTIONS_JSON as Question[];

const ALL_KAI = ['第31回', '第32回', '第33回', '第34回', '第35回', '第36回', '第37回', '第38回'];

const KAI_YEAR: Record<string, string> = {
  '第31回': '平成30年度', '第32回': '令和元年度', '第33回': '令和2年度',
  '第34回': '令和3年度', '第35回': '令和4年度', '第36回': '令和5年度',
  '第37回': '令和6年度', '第38回': '令和7年度',
};

// ── Correct part assignments ──────────────────────────────────────────────
const A_SUBJECTS = [
  '人間の尊厳と自立',
  '人間関係とコミュニケーション',
  '社会の理解',
  '介護の基本',
  'コミュニケーション技術',
  '生活支援技術',
];
const B_SUBJECTS = [
  'こころとからだのしくみ',
  '発達と老化の理解',
  '認知症の理解',
  '障害の理解',
  '医療的ケア',
];
const C_SUBJECTS = [
  '介護過程',
  '総合問題',
];

const PART_CONFIGS: { part: ExamPart; label: string; badge: string; time: string; timeSecs: number; subjects: string[]; desc: string }[] = [
  { part: 'a',   label: 'Aパート', badge: '午前', time: '100分', timeSecs: 100 * 60, subjects: A_SUBJECTS, desc: '60問 · 午前' },
  { part: 'b',   label: 'Bパート', badge: '午後',  time: '120分', timeSecs: 120 * 60, subjects: B_SUBJECTS, desc: '45問 · 午後' },
  { part: 'c',   label: 'Cパート', badge: '午後',  time: '120分', timeSecs: 120 * 60, subjects: C_SUBJECTS, desc: '20問 · 午後' },
  { part: 'pm',  label: '午後全部', badge: 'B+C',   time: '120分', timeSecs: 120 * 60, subjects: [...B_SUBJECTS, ...C_SUBJECTS], desc: '65問 · B+C同時' },
  { part: 'all', label: '全パート', badge: 'A+B+C', time: '220分', timeSecs: 220 * 60, subjects: [...A_SUBJECTS, ...B_SUBJECTS, ...C_SUBJECTS], desc: '125問 · 全問' },
];

// ── 11 科目群 for pass/fail ───────────────────────────────────────────────
const SUBJECT_GROUPS = [
  { id: 1,  name: '人間の尊厳と自立・人間関係とコミュニケーション', subjects: ['人間の尊厳と自立', '人間関係とコミュニケーション'] },
  { id: 2,  name: '社会の理解',                                     subjects: ['社会の理解'] },
  { id: 3,  name: '介護の基本',                                     subjects: ['介護の基本'] },
  { id: 4,  name: 'コミュニケーション技術',                         subjects: ['コミュニケーション技術'] },
  { id: 5,  name: '生活支援技術',                                   subjects: ['生活支援技術'] },
  { id: 6,  name: '介護過程',                                       subjects: ['介護過程'] },
  { id: 7,  name: 'こころとからだのしくみ',                         subjects: ['こころとからだのしくみ'] },
  { id: 8,  name: '発達と老化の理解',                               subjects: ['発達と老化の理解'] },
  { id: 9,  name: '認知症の理解',                                   subjects: ['認知症の理解'] },
  { id: 10, name: '障害の理解',                                     subjects: ['障害の理解'] },
  { id: 11, name: '医療的ケア・総合問題',                           subjects: ['医療的ケア', '総合問題'] },
];

const SCHEDULE_ROWS = [
  { part: 'A', time: '午前', duration: '100分', subjects: A_SUBJECTS, total: 60 },
  { part: 'B', time: '午後', duration: '120分', subjects: B_SUBJECTS, total: 45 },
  { part: 'C', time: '午後', duration: '120分（同時）', subjects: C_SUBJECTS, total: 20 },
];

const SUBJECT_COUNTS: Record<string, number> = {
  '人間の尊厳と自立': 2, '人間関係とコミュニケーション': 4, '社会の理解': 12,
  '介護の基本': 10, 'コミュニケーション技術': 6, '生活支援技術': 26,
  'こころとからだのしくみ': 12, '発達と老化の理解': 8, '認知症の理解': 10,
  '障害の理解': 10, '医療的ケア': 5, '介護過程': 8, '総合問題': 12,
};

function formatTime(secs: number) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

function buildPartExam(kai: string, subjects: string[]): Question[] {
  return ALL_QUESTIONS
    .filter(q => q.kai === kai && subjects.includes(q.subject))
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

const SKY = '#0284C7';
const OCEAN = '#0C4A6E';

export default function ExamPage() {
  useProfile();
  const [screen, setScreen] = useState<Screen>('select-kai');
  const [selectedKai, setSelectedKai] = useState('');
  const [selectedPart, setSelectedPart] = useState<ExamPart>('all');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (screen !== 'exam' || submitted) return;
    if (timeLeft <= 0) { handleSubmit(); return; }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, timeLeft, submitted]);

  function selectKai(kai: string) {
    setSelectedKai(kai);
    setScreen('select-part');
  }

  function startExam(part: ExamPart) {
    const cfg = PART_CONFIGS.find(p => p.part === part)!;
    const qs = buildPartExam(selectedKai, cfg.subjects);
    if (!qs.length) return;
    setSelectedPart(part);
    setQuestions(qs);
    setAnswers(new Array(qs.length).fill(null));
    setCurrentIndex(0);
    setSubmitted(false);
    setTimeLeft(cfg.timeSecs);
    setScreen('exam');
  }

  function handleAnswer(idx: number) {
    if (submitted) return;
    const updated = [...answers];
    updated[currentIndex] = idx;
    setAnswers(updated);
  }

  function handleSubmit() { setSubmitted(true); setScreen('results'); }

  function restart() {
    setScreen('select-kai');
    setSelectedKai('');
    setQuestions([]);
    setAnswers([]);
    setSubmitted(false);
  }

  const answeredCount = answers.filter(a => a !== null).length;
  const result = screen === 'results' ? calcResults(questions, answers) : null;
  const kaiCounts: Record<string, number> = {};
  ALL_QUESTIONS.forEach(q => { kaiCounts[q.kai] = (kaiCounts[q.kai] ?? 0) + 1; });

  function partCountForKai(kai: string, subjects: string[]) {
    return ALL_QUESTIONS.filter(q => q.kai === kai && subjects.includes(q.subject)).length;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/" className="flex items-center gap-1 text-sm mb-4 transition-colors"
          style={{ color: '#64748B' }}>
          <ChevronLeft size={14} /> ホームに戻る
        </Link>
        <div className="flex items-center gap-2 mb-1">
          <GraduationCap size={20} style={{ color: SKY }} />
          <h1 className="text-xl font-bold" style={{ color: OCEAN }}>介護福祉士 国家試験 模擬試験</h1>
        </div>
        <p className="text-sm" style={{ color: '#64748B' }}>過去問題を回別に本番形式で挑戦。合格条件完全再現。</p>
      </div>

      {/* ── 回 SELECT ─────────────────────────────────────────────────────── */}
      {screen === 'select-kai' && (
        <div className="space-y-5">
          {/* Schedule info */}
          <div className="rounded-xl overflow-hidden" style={{ border: `1.5px solid #BAE6FD` }}>
            <div className="px-4 py-3 flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #0C4A6E, #0369A1)' }}>
              <Clock size={15} className="text-white/70" />
              <span className="text-sm font-semibold text-white">試験のスケジュール（合計125問）</span>
            </div>
            <div className="bg-white divide-y" style={{ borderColor: '#E2E8F0' }}>
              {SCHEDULE_ROWS.map(row => (
                <div key={row.part} className="px-4 py-3 flex items-start gap-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0 mt-0.5"
                    style={{ background: '#E0F2FE', color: SKY }}>
                    {row.part}パート
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs font-semibold" style={{ color: OCEAN }}>{row.time} · {row.duration}</span>
                      <span className="text-xs font-bold" style={{ color: SKY }}>{row.total}問</span>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                      {row.subjects.map(s => (
                        <span key={s} className="text-xs" style={{ color: '#64748B' }}>
                          {s}
                          <span className="ml-1 font-medium" style={{ color: '#94A3B8' }}>
                            {SUBJECT_COUNTS[s]}問{s === '生活支援技術' ? ' ★' : ''}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              <div className="px-4 py-2 flex items-center gap-2"
                style={{ background: '#F0F9FF' }}>
                <span className="text-xs" style={{ color: '#64748B' }}>
                  ※ BパートとCパートは午後に同時スタート。一部合格制度によりパートごとに合格を持ち越せる。
                </span>
              </div>
            </div>
          </div>

          {/* Pass conditions */}
          <div className="rounded-xl bg-white p-4" style={{ border: '1.5px solid #BAE6FD' }}>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#64748B' }}>合格の絶対条件</h3>
            <div className="grid sm:grid-cols-2 gap-2 text-sm">
              <div className="flex items-start gap-2 p-2 rounded-lg" style={{ background: '#F0F9FF' }}>
                <span className="text-base shrink-0">①</span>
                <span style={{ color: '#334155' }}>総得点 <strong style={{ color: OCEAN }}>60%以上</strong>（約75点以上 / 125点）</span>
              </div>
              <div className="flex items-start gap-2 p-2 rounded-lg" style={{ background: '#F0F9FF' }}>
                <span className="text-base shrink-0">②</span>
                <span style={{ color: '#334155' }}><strong style={{ color: OCEAN }}>11の科目群</strong>すべてで1点以上（0点は即不合格）</span>
              </div>
            </div>
          </div>

          {/* Kai grid */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#94A3B8' }}>受験回を選択</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {ALL_KAI.map(kai => (
                <button key={kai} onClick={() => selectKai(kai)}
                  className="rounded-xl p-4 text-center bg-white transition-all"
                  style={{ border: '1.5px solid #BAE6FD', boxShadow: '0 1px 4px rgba(12,74,110,0.05)' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = SKY;
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 12px rgba(2,132,199,0.18)`;
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = '#BAE6FD';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(12,74,110,0.05)';
                    (e.currentTarget as HTMLElement).style.transform = 'none';
                  }}
                >
                  <p className="text-sm font-bold mb-0.5" style={{ color: OCEAN }}>{kai}</p>
                  <p className="text-xs mb-1" style={{ color: '#94A3B8' }}>{KAI_YEAR[kai]}</p>
                  <p className="text-xs font-semibold" style={{ color: SKY }}>{kaiCounts[kai] ?? 0}問</p>
                </button>
              ))}
            </div>
          </div>

          {/* 11 subject groups */}
          <div className="rounded-xl bg-white p-4" style={{ border: '1.5px solid #BAE6FD' }}>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#64748B' }}>11科目群（各群0点で即不合格）</h3>
            <div className="grid sm:grid-cols-2 gap-1.5">
              {SUBJECT_GROUPS.map(g => (
                <p key={g.id} className="text-xs" style={{ color: '#64748B' }}>
                  <span className="font-bold mr-1.5" style={{ color: '#BAE6FD' }}>#{g.id}</span>{g.name}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── PART SELECT ───────────────────────────────────────────────────── */}
      {screen === 'select-part' && selectedKai && (
        <div>
          <button onClick={() => setScreen('select-kai')}
            className="flex items-center gap-1 text-sm mb-4" style={{ color: '#64748B' }}>
            <ChevronLeft size={14} /> 回選択に戻る
          </button>
          <div className="rounded-xl bg-white p-5" style={{ border: '1.5px solid #BAE6FD' }}>
            <div className="mb-5">
              <h3 className="text-base font-bold mb-0.5" style={{ color: OCEAN }}>
                {selectedKai}（{KAI_YEAR[selectedKai]}）
              </h3>
              <p className="text-sm" style={{ color: '#64748B' }}>受験するパートを選択してください。</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-3 mb-4">
              {PART_CONFIGS.filter(c => ['a','b','c'].includes(c.part)).map(cfg => {
                const count = partCountForKai(selectedKai, cfg.subjects);
                return (
                  <button key={cfg.part} onClick={() => startExam(cfg.part)}
                    disabled={count === 0}
                    className="rounded-xl p-4 text-left transition-all disabled:opacity-40"
                    style={{ border: '1.5px solid #BAE6FD', background: '#fff' }}
                    onMouseEnter={e => {
                      if (count > 0) {
                        (e.currentTarget as HTMLElement).style.borderColor = SKY;
                        (e.currentTarget as HTMLElement).style.background = '#F0F9FF';
                      }
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = '#BAE6FD';
                      (e.currentTarget as HTMLElement).style.background = '#fff';
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base font-bold" style={{ color: OCEAN }}>{cfg.label}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: '#E0F2FE', color: SKY }}>{cfg.badge}</span>
                    </div>
                    <p className="text-xs" style={{ color: '#94A3B8' }}>{cfg.time} · {count}問</p>
                    <div className="mt-2 space-y-0.5">
                      {cfg.subjects.map(s => (
                        <p key={s} className="text-xs" style={{ color: '#94A3B8' }}>· {s}</p>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="grid sm:grid-cols-2 gap-3 pt-3" style={{ borderTop: '1px solid #E2E8F0' }}>
              {PART_CONFIGS.filter(c => ['pm','all'].includes(c.part)).map(cfg => {
                const count = partCountForKai(selectedKai, cfg.subjects);
                return (
                  <button key={cfg.part} onClick={() => startExam(cfg.part)}
                    disabled={count === 0}
                    className="rounded-xl p-4 text-left transition-all disabled:opacity-40"
                    style={{ border: '1.5px solid #BAE6FD', background: '#fff' }}
                    onMouseEnter={e => {
                      if (count > 0) {
                        (e.currentTarget as HTMLElement).style.borderColor = SKY;
                        (e.currentTarget as HTMLElement).style.background = '#F0F9FF';
                      }
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = '#BAE6FD';
                      (e.currentTarget as HTMLElement).style.background = '#fff';
                    }}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-bold" style={{ color: OCEAN }}>{cfg.label}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: '#E0F2FE', color: SKY }}>{cfg.badge}</span>
                    </div>
                    <p className="text-xs" style={{ color: '#94A3B8' }}>{cfg.time} · {count}問</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── EXAM ─────────────────────────────────────────────────────────── */}
      {screen === 'exam' && questions.length > 0 && (
        <div>
          {/* Header bar */}
          <div className="flex items-center justify-between rounded-xl px-4 py-2.5 mb-4 bg-white"
            style={{ border: '1.5px solid #BAE6FD' }}>
            <span className="text-xs" style={{ color: '#64748B' }}>
              {selectedKai} · 回答済 <strong style={{ color: OCEAN }}>{answeredCount}</strong> / {questions.length}
            </span>
            <span className={`flex items-center gap-1 font-mono text-sm font-bold`}
              style={{ color: timeLeft < 300 ? '#DC2626' : OCEAN }}>
              <Timer size={14} />
              {formatTime(timeLeft)}
            </span>
          </div>

          {/* Number grid */}
          <div className="rounded-xl bg-white p-3 mb-4" style={{ border: '1.5px solid #BAE6FD' }}>
            <p className="text-xs mb-2" style={{ color: '#94A3B8' }}>問題一覧</p>
            <div className="flex flex-wrap gap-1">
              {questions.map((_, i) => (
                <button key={i} onClick={() => setCurrentIndex(i)}
                  className="w-7 h-7 rounded text-xs font-medium transition-colors"
                  style={
                    i === currentIndex
                      ? { background: SKY, color: '#fff' }
                      : answers[i] !== null
                        ? { background: '#E0F2FE', color: SKY, border: `1px solid #BAE6FD` }
                        : { background: '#F1F5F9', color: '#64748B' }
                  }
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Question */}
          <div className="rounded-xl bg-white p-5 mb-4" style={{ border: '1.5px solid #BAE6FD' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs px-2 py-0.5 rounded-md font-medium"
                style={{ background: '#E0F2FE', color: SKY }}>
                {questions[currentIndex].subject}
              </span>
              <span className="text-xs" style={{ color: '#94A3B8' }}>
                問題 {questions[currentIndex].questionNo ?? currentIndex + 1}
              </span>
            </div>
            <p className="text-sm font-medium leading-relaxed mb-5" style={{ color: '#0F172A' }}>
              {questions[currentIndex].question}
            </p>
            <div className="space-y-2">
              {questions[currentIndex].options.map((option, idx) => {
                const isSelected = answers[currentIndex] === idx;
                return (
                  <button key={idx} onClick={() => handleAnswer(idx)}
                    className="w-full p-3 rounded-xl border text-left text-sm transition-all flex items-center gap-3"
                    style={isSelected
                      ? { borderColor: SKY, background: '#E0F2FE', color: OCEAN }
                      : { borderColor: '#BAE6FD', color: '#334155', background: '#fff' }
                    }
                    onMouseEnter={e => {
                      if (!isSelected) {
                        (e.currentTarget as HTMLElement).style.borderColor = SKY;
                        (e.currentTarget as HTMLElement).style.background = '#F0F9FF';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) {
                        (e.currentTarget as HTMLElement).style.borderColor = '#BAE6FD';
                        (e.currentTarget as HTMLElement).style.background = '#fff';
                      }
                    }}
                  >
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={isSelected
                        ? { background: SKY, color: '#fff' }
                        : { background: '#F1F5F9', color: '#64748B' }
                      }>
                      {idx + 1}
                    </span>
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nav */}
          <div className="flex items-center justify-between">
            <button onClick={() => setCurrentIndex(p => Math.max(0, p - 1))}
              disabled={currentIndex === 0}
              className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-xl transition-colors disabled:opacity-30"
              style={{ border: '1.5px solid #BAE6FD', color: '#64748B', background: '#fff' }}>
              <ArrowLeft size={14} /> 前へ
            </button>
            {currentIndex === questions.length - 1 ? (
              <button onClick={handleSubmit}
                className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold rounded-xl transition-colors"
                style={{ background: SKY, color: '#fff' }}>
                <Flag size={14} /> 採点・提出
              </button>
            ) : (
              <button onClick={() => setCurrentIndex(p => Math.min(questions.length - 1, p + 1))}
                className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-xl transition-colors"
                style={{ border: '1.5px solid #BAE6FD', color: '#64748B', background: '#fff' }}>
                次へ <ArrowRight size={14} />
              </button>
            )}
          </div>

          {answeredCount === questions.length && currentIndex < questions.length - 1 && (
            <p className="text-center mt-4">
              <button onClick={handleSubmit} className="text-sm font-medium hover:underline" style={{ color: SKY }}>
                全問回答済み — 今すぐ採点する
              </button>
            </p>
          )}
        </div>
      )}

      {/* ── RESULTS ──────────────────────────────────────────────────────── */}
      {screen === 'results' && result && (
        <div className="space-y-4">
          {/* Pass/fail */}
          <div className={`rounded-2xl p-8 text-center`}
            style={{
              border: `1.5px solid ${result.passed ? '#6EE7B7' : '#FCA5A5'}`,
              background: result.passed ? '#F0FDF4' : '#FEF2F2',
            }}>
            <p className="text-xs mb-1" style={{ color: '#94A3B8' }}>{selectedKai}（{KAI_YEAR[selectedKai]}）</p>
            <p className="text-5xl font-bold mb-2" style={{ color: result.passed ? '#059669' : '#DC2626' }}>
              {result.passed ? '合格' : '不合格'}
            </p>
            <p className="text-lg font-semibold" style={{ color: result.passed ? '#065F46' : '#991B1B' }}>
              {result.correct} / {result.total} 問正解（{result.pct}%）
            </p>
            {!result.passedScore && (
              <p className="flex items-center justify-center gap-1 text-sm mt-2" style={{ color: '#DC2626' }}>
                <AlertTriangle size={14} /> 得点率不足（合格基準 60%以上）
              </p>
            )}
            {result.failedGroups.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-semibold flex items-center justify-center gap-1 mb-1" style={{ color: '#DC2626' }}>
                  <AlertTriangle size={13} /> 0点科目群あり — 自動不合格
                </p>
                {result.failedGroups.map(g => (
                  <p key={g.id} className="text-xs" style={{ color: '#F87171' }}>#{g.id} {g.name}</p>
                ))}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: '得点', value: `${result.correct}点` },
              { label: '正解率', value: `${result.pct}%` },
              { label: '合格基準', value: '60%以上' },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl bg-white p-4 text-center"
                style={{ border: '1.5px solid #BAE6FD' }}>
                <p className="text-xs mb-1" style={{ color: '#94A3B8' }}>{label}</p>
                <p className="text-xl font-bold" style={{ color: OCEAN }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Subject groups */}
          <div className="rounded-xl bg-white p-4" style={{ border: '1.5px solid #BAE6FD' }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#64748B' }}>11科目群 判定</p>
            <div className="space-y-2">
              {result.groupResults.map(g => (
                <div key={g.id} className="flex items-center gap-3">
                  <span className="text-xs w-5 font-bold" style={{ color: '#BAE6FD' }}>#{g.id}</span>
                  <span className="text-xs flex-1 min-w-0 truncate" style={{ color: '#64748B' }}>{g.name}</span>
                  <span className="text-xs" style={{ color: '#94A3B8' }}>{g.correct}/{g.total}</span>
                  {g.passed
                    ? <CheckCircle2 size={13} style={{ color: '#10B981', flexShrink: 0 }} />
                    : <XCircle size={13} style={{ color: '#EF4444', flexShrink: 0 }} />}
                </div>
              ))}
            </div>
          </div>

          {/* Per-subject */}
          <div className="rounded-xl bg-white p-4" style={{ border: '1.5px solid #BAE6FD' }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#64748B' }}>科目別成績</p>
            <div className="space-y-2">
              {Object.entries(result.subjectMap).map(([name, { correct: c, total: tot }]) => {
                const pct = Math.round((c / tot) * 100);
                return (
                  <div key={name} className="flex items-center gap-3">
                    <span className="text-xs w-44 shrink-0 truncate" style={{ color: '#64748B' }}>{name}</span>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#E0F2FE' }}>
                      <div className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: c > 0 ? SKY : '#F87171' }} />
                    </div>
                    <span className="text-xs w-16 text-right shrink-0" style={{ color: '#94A3B8' }}>
                      {c}/{tot} ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={() => startExam(selectedPart)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm rounded-xl transition-colors"
              style={{ border: '1.5px solid #BAE6FD', color: '#64748B', background: '#fff' }}>
              <RotateCcw size={14} /> 再受験
            </button>
            <button onClick={restart}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold rounded-xl"
              style={{ background: SKY, color: '#fff' }}>
              回選択に戻る <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
