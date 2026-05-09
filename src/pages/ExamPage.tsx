import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PAST_QUESTIONS_JSON from '../data/pastQuestions.json';
import {
  GraduationCap, Timer, ArrowRight, ArrowLeft,
  CheckCircle2, XCircle, AlertTriangle, Flag, RotateCcw, ChevronLeft,
} from 'lucide-react';
import { useProfile } from '../hooks/useProfile';

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

const ALL_QUESTIONS: Question[] = PAST_QUESTIONS_JSON as Question[];

const ALL_KAI = ['第31回', '第32回', '第33回', '第34回', '第35回', '第36回', '第37回', '第38回'];

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

function formatTime(secs: number) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

function buildKaiExam(kai: string, period: ExamPeriod): Question[] {
  return ALL_QUESTIONS
    .filter(q => q.kai === kai && (period === 'both' || q.period === period))
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

  useEffect(() => {
    if (screen !== 'exam' || submitted) return;
    if (timeLeft <= 0) { handleSubmit(); return; }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, timeLeft, submitted]);

  function selectKai(kai: string) {
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
  const periodAmCount = selectedKai ? ALL_QUESTIONS.filter(q => q.kai === selectedKai && AM_SUBJECTS.includes(q.subject)).length : 0;
  const periodPmCount = selectedKai ? ALL_QUESTIONS.filter(q => q.kai === selectedKai && PM_SUBJECTS.includes(q.subject)).length : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4">
          <ChevronLeft size={14} /> ホームに戻る
        </Link>
        <div className="flex items-center gap-2 mb-1">
          <GraduationCap size={20} className="text-gray-500" />
          <h1 className="text-xl font-bold text-gray-900">介護福祉士 国家試験</h1>
        </div>
        <p className="text-sm text-gray-500">過去問題を回別に本番形式で挑戦。合格条件完全再現。</p>
      </div>

      {/* ── 回 SELECT ─────────────────────────────────────────────────────── */}
      {screen === 'select-kai' && (
        <div>
          <div className="bg-white border border-gray-200 rounded p-4 mb-5">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">合格の絶対条件</h3>
            <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-600">
              <p>① 総得点 <strong className="text-gray-900">60%以上</strong>（約75点以上 / 125点）</p>
              <p>② <strong className="text-gray-900">11の科目群</strong>すべてで1点以上（0点は即不合格）</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {ALL_KAI.map(kai => (
              <button
                key={kai}
                onClick={() => selectKai(kai)}
                className="border border-gray-200 rounded p-4 text-center bg-white hover:border-blue-400 hover:bg-blue-50 transition-colors"
              >
                <p className="text-base font-bold text-gray-900 mb-1">{kai}</p>
                <p className="text-xs text-gray-400 mb-2">{KAI_YEAR[kai]}</p>
                <p className="text-xs text-gray-500">{kaiCounts[kai] ?? 0}問</p>
              </button>
            ))}
          </div>

          <div className="bg-white border border-gray-200 rounded p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">11科目群（0点で即不合格）</h3>
            <div className="grid sm:grid-cols-2 gap-1.5">
              {SUBJECT_GROUPS.map(g => (
                <p key={g.id} className="text-xs text-gray-500">
                  <span className="text-gray-300 mr-1.5">#{g.id}</span>{g.name}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── PERIOD SELECT ─────────────────────────────────────────────────── */}
      {screen === 'select-period' && selectedKai && (
        <div>
          <button onClick={() => setScreen('select-kai')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4">
            <ChevronLeft size={14} /> 回選択に戻る
          </button>
          <div className="bg-white border border-gray-200 rounded p-5">
            <h3 className="text-base font-bold text-gray-900 mb-1">{selectedKai}（{KAI_YEAR[selectedKai]}）</h3>
            <p className="text-sm text-gray-500 mb-5">受験する区分を選択してください。</p>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { period: 'am' as ExamPeriod, label: '午前', time: '100分', count: periodAmCount },
                { period: 'pm' as ExamPeriod, label: '午後', time: '120分', count: periodPmCount },
                { period: 'both' as ExamPeriod, label: '全問', time: '220分', count: periodAmCount + periodPmCount },
              ].map(({ period, label, time, count }) => (
                <button
                  key={period}
                  onClick={() => startExam(period)}
                  disabled={count === 0}
                  className="border border-gray-200 rounded p-4 text-left bg-white hover:border-blue-400 hover:bg-blue-50 transition-colors disabled:opacity-40"
                >
                  <p className="text-lg font-bold text-gray-900 mb-1">{label}</p>
                  <p className="text-xs text-gray-400">{time} · {count}問</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── EXAM ─────────────────────────────────────────────────────────── */}
      {screen === 'exam' && questions.length > 0 && (
        <div>
          {/* Header bar */}
          <div className="flex items-center justify-between bg-white border border-gray-200 rounded px-4 py-2.5 mb-4">
            <span className="text-xs text-gray-500">
              {selectedKai} · 回答済 <strong className="text-gray-900">{answeredCount}</strong> / {questions.length}
            </span>
            <span className={`flex items-center gap-1 font-mono text-sm font-bold ${timeLeft < 300 ? 'text-red-500' : 'text-gray-700'}`}>
              <Timer size={15} />
              {formatTime(timeLeft)}
            </span>
          </div>

          {/* Number grid */}
          <div className="bg-white border border-gray-200 rounded p-3 mb-4">
            <p className="text-xs text-gray-400 mb-2">問題一覧</p>
            <div className="flex flex-wrap gap-1">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                    i === currentIndex ? 'bg-blue-600 text-white' :
                    answers[i] !== null ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                    'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Question */}
          <div className="bg-white border border-gray-200 rounded p-5 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{questions[currentIndex].subject}</span>
              <span className="text-xs text-gray-400">問題 {questions[currentIndex].questionNo ?? currentIndex + 1}</span>
            </div>
            <p className="text-sm font-medium text-gray-900 leading-relaxed mb-5">{questions[currentIndex].question}</p>
            <div className="space-y-2">
              {questions[currentIndex].options.map((option, idx) => {
                const isSelected = answers[currentIndex] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className={`w-full p-3 rounded border text-left text-sm transition-colors flex items-center gap-3 ${
                      isSelected ? 'border-blue-500 bg-blue-50 text-blue-900' : 'border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
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
            <button
              onClick={() => setCurrentIndex(p => Math.max(0, p - 1))}
              disabled={currentIndex === 0}
              className="flex items-center gap-1.5 px-4 py-2 text-sm border border-gray-200 rounded text-gray-600 hover:border-gray-400 transition-colors disabled:opacity-30"
            >
              <ArrowLeft size={14} /> 前へ
            </button>
            {currentIndex === questions.length - 1 ? (
              <button onClick={handleSubmit} className="flex items-center gap-1.5 px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                <Flag size={14} /> 採点・提出
              </button>
            ) : (
              <button
                onClick={() => setCurrentIndex(p => Math.min(questions.length - 1, p + 1))}
                className="flex items-center gap-1.5 px-4 py-2 text-sm border border-gray-200 rounded text-gray-600 hover:border-gray-400 transition-colors"
              >
                次へ <ArrowRight size={14} />
              </button>
            )}
          </div>

          {answeredCount === questions.length && currentIndex < questions.length - 1 && (
            <p className="text-center mt-4">
              <button onClick={handleSubmit} className="text-sm text-blue-600 hover:underline">
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
          <div className={`rounded p-8 text-center border ${result.passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <p className="text-xs text-gray-500 mb-1">{selectedKai}（{KAI_YEAR[selectedKai]}）</p>
            <p className={`text-5xl font-bold mb-2 ${result.passed ? 'text-green-600' : 'text-red-500'}`}>
              {result.passed ? '合格' : '不合格'}
            </p>
            <p className={`text-lg font-semibold ${result.passed ? 'text-green-700' : 'text-red-600'}`}>
              {result.correct} / {result.total} 問正解（{result.pct}%）
            </p>
            {!result.passedScore && (
              <p className="flex items-center justify-center gap-1 text-sm text-red-500 mt-2">
                <AlertTriangle size={14} /> 得点率不足（合格基準 60%以上）
              </p>
            )}
            {result.failedGroups.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-red-500 font-semibold flex items-center justify-center gap-1 mb-1">
                  <AlertTriangle size={13} /> 0点科目群あり — 自動不合格
                </p>
                {result.failedGroups.map(g => (
                  <p key={g.id} className="text-xs text-red-400">#{g.id} {g.name}</p>
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
              <div key={label} className="bg-white border border-gray-200 rounded p-4 text-center">
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <p className="text-xl font-bold text-gray-900">{value}</p>
              </div>
            ))}
          </div>

          {/* Subject groups */}
          <div className="bg-white border border-gray-200 rounded p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">11科目群 判定</p>
            <div className="space-y-2">
              {result.groupResults.map(g => (
                <div key={g.id} className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-4">#{g.id}</span>
                  <span className="text-xs text-gray-600 flex-1 min-w-0 truncate">{g.name}</span>
                  <span className="text-xs text-gray-500">{g.correct}/{g.total}</span>
                  {g.passed ? <CheckCircle2 size={13} className="text-green-500 shrink-0" /> : <XCircle size={13} className="text-red-500 shrink-0" />}
                </div>
              ))}
            </div>
          </div>

          {/* Per-subject */}
          <div className="bg-white border border-gray-200 rounded p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">科目別成績</p>
            <div className="space-y-2">
              {Object.entries(result.subjectMap).map(([name, { correct: c, total: tot }]) => {
                const pct = Math.round((c / tot) * 100);
                return (
                  <div key={name} className="flex items-center gap-3">
                    <span className="text-xs text-gray-600 w-44 shrink-0 truncate">{name}</span>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${c > 0 ? 'bg-blue-400' : 'bg-red-400'}`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-gray-400 w-16 text-right shrink-0">{c}/{tot} ({pct}%)</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => startExam(selectedPeriod)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm border border-gray-200 rounded text-gray-700 hover:border-gray-400 transition-colors"
            >
              <RotateCcw size={14} /> 再受験
            </button>
            <button
              onClick={restart}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              回選択に戻る <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
