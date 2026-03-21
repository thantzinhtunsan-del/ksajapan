import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ClipboardCheck, Timer, ArrowRight, CheckCircle2, XCircle, Sparkles, RefreshCcw } from 'lucide-react';


interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const MOCK_QUESTIONS: Question[] = [
  {
    id: '1',
    question: '介護保険制度において、保険者は誰ですか？',
    options: ['都道府県', '市町村', '国', '厚生労働省'],
    correctAnswer: 1,
    explanation: '介護保険の保険者は、原則として市町村（および特別区）です。',
  },
  {
    id: '2',
    question: 'ADL（日常生活動作）に含まれないものはどれですか？',
    options: ['食事', '入浴', '料理', '排泄'],
    correctAnswer: 2,
    explanation: 'ADLは「食事」「入浴」「排泄」「移動」などの基本的な動作を指します。「料理」はIADL（手段的日常生活動作）に含まれます。',
  },
  {
    id: '3',
    question: '人間の尊厳を尊重するケアとして、最も適切なものはどれですか？',
    options: [
      '利用者の代わりにすべての決定を行う',
      '利用者の自己決定を支援する',
      '効率を優先してケアを行う',
      '利用者のプライバシーを制限する'
    ],
    correctAnswer: 1,
    explanation: '介護の基本は、利用者の尊厳を守り、自己決定を尊重・支援することです。',
  }
];

export default function MockTest() {
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isStarted && !isFinished && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsFinished(true);
    }
    return () => clearInterval(timer);
  }, [isStarted, isFinished, timeLeft]);

  const handleStart = () => {
    setIsStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsFinished(false);
    setTimeLeft(300);
    setAiFeedback(null);
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    if (index === MOCK_QUESTIONS[currentQuestionIndex].correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < MOCK_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      setIsFinished(true);
      generateAiFeedback();
    }
  };

  const generateAiFeedback = async () => {
    setIsLoadingFeedback(true);
    try {
      const response = await fetch('/api/ai-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score,
          total: MOCK_QUESTIONS.length,
          timeLeft,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setAiFeedback(data.feedback ?? "Great effort! Keep practicing to master the concepts.");
    } catch (error) {
      console.error('Failed to generate AI feedback:', error);
      setAiFeedback("Great effort! Keep practicing to master the concepts.");
    } finally {
      setIsLoadingFeedback(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <section id="mocktest" className="py-24 bg-matte-black/50 border-t border-metallic-gold/10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ClipboardCheck className="text-metallic-gold" size={24} />
            <span className="text-xs font-bold uppercase tracking-widest text-metallic-gold/60">Module 04</span>
          </div>
          <h2 className="text-4xl font-bold mb-4">Strategic <span className="gold-gradient">Mock Test</span></h2>
          <p className="text-gray-400">Simulate the national exam environment with timed questions and AI insights.</p>
        </div>

        {!isStarted ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 border border-metallic-gold/20 rounded-3xl p-12 text-center"
          >
            <div className="w-20 h-20 bg-metallic-gold/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <Timer className="text-metallic-gold" size={40} />
            </div>
            <h3 className="text-2xl font-bold mb-4">Ready to begin?</h3>
            <ul className="text-gray-400 mb-10 space-y-2 text-sm max-w-xs mx-auto text-left">
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-metallic-gold" /> 3 Questions (Sample)</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-metallic-gold" /> 5 Minutes Timer</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-metallic-gold" /> Instant AI Feedback</li>
            </ul>
            <button onClick={handleStart} className="gold-button w-full sm:w-auto gold-glow-hover">
              Start Examination
            </button>
          </motion.div>
        ) : isFinished ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-metallic-gold/20 rounded-3xl p-12"
          >
            <div className="text-center mb-10">
              <h3 className="text-3xl font-bold mb-2">Examination Complete</h3>
              <p className="text-gray-500">Your results have been processed.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="bg-matte-black p-8 rounded-2xl border border-white/5 text-center">
                <p className="text-sm text-gray-500 uppercase tracking-widest mb-2">Final Score</p>
                <p className="text-6xl font-bold text-metallic-gold">{score} / {MOCK_QUESTIONS.length}</p>
              </div>
              <div className="bg-matte-black p-8 rounded-2xl border border-white/5 text-center">
                <p className="text-sm text-gray-500 uppercase tracking-widest mb-2">Time Remaining</p>
                <p className="text-6xl font-bold text-white">{formatTime(timeLeft)}</p>
              </div>
            </div>

            <div className="bg-metallic-gold/5 border border-metallic-gold/20 rounded-2xl p-8 mb-10">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="text-metallic-gold" size={20} />
                <h4 className="font-bold text-metallic-gold uppercase tracking-widest text-sm">AI Performance Feedback</h4>
              </div>
              {isLoadingFeedback ? (
                <div className="flex items-center gap-3 text-gray-500 italic">
                  <RefreshCcw className="animate-spin" size={16} />
                  Analyzing your performance...
                </div>
              ) : (
                <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {aiFeedback}
                </div>
              )}
            </div>

            <button onClick={handleStart} className="w-full py-4 rounded-full border border-metallic-gold/30 text-metallic-gold font-bold hover:bg-metallic-gold/5 transition-all flex items-center justify-center gap-2 gold-glow-hover">
              <RefreshCcw size={18} />
              Retake Examination
            </button>
          </motion.div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
              <div className="text-sm font-bold text-gray-500">
                QUESTION <span className="text-metallic-gold">{currentQuestionIndex + 1}</span> / {MOCK_QUESTIONS.length}
              </div>
              <div className={`flex items-center gap-2 font-mono font-bold ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-metallic-gold'}`}>
                <Timer size={18} />
                {formatTime(timeLeft)}
              </div>
            </div>

            <motion.div 
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 border border-metallic-gold/10 rounded-3xl p-8 md:p-12"
            >
              <h3 className="text-2xl md:text-3xl font-bold mb-10 leading-tight">
                {MOCK_QUESTIONS[currentQuestionIndex].question}
              </h3>

              <div className="space-y-4">
                {MOCK_QUESTIONS[currentQuestionIndex].options.map((option, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isCorrect = idx === MOCK_QUESTIONS[currentQuestionIndex].correctAnswer;
                  const showResult = selectedAnswer !== null;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      disabled={showResult}
                      className={`w-full p-6 rounded-2xl text-left transition-all flex items-center justify-between border gold-glow-hover ${
                        showResult
                          ? isCorrect
                            ? 'bg-green-500/10 border-green-500/50 text-green-500'
                            : isSelected
                              ? 'bg-red-500/10 border-red-500/50 text-red-500'
                              : 'bg-white/5 border-white/5 text-gray-600'
                          : 'bg-white/5 border-white/10 text-gray-300 hover:border-metallic-gold/50 hover:bg-white/10'
                      }`}
                    >
                      <span className="font-medium">{option}</span>
                      {showResult && isCorrect && <CheckCircle2 size={20} />}
                      {showResult && isSelected && !isCorrect && <XCircle size={20} />}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {selectedAnswer !== null && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-10 pt-10 border-t border-white/5"
                  >
                    <div className="bg-white/5 rounded-2xl p-6">
                      <p className="text-xs font-bold text-metallic-gold uppercase tracking-widest mb-2">Explanation</p>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {MOCK_QUESTIONS[currentQuestionIndex].explanation}
                      </p>
                    </div>
                    
                    <button 
                      onClick={handleNext}
                      className="mt-8 gold-button w-full flex items-center justify-center gap-2 gold-glow-hover"
                    >
                      {currentQuestionIndex === MOCK_QUESTIONS.length - 1 ? 'Finish Test' : 'Next Question'}
                      <ArrowRight size={20} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
