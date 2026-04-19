/**
 * AdminPanel.tsx
 * Admin dashboard for managing vocabulary, flashcards, and mock test questions.
 */

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, BookOpen, GraduationCap, ClipboardCheck,
  Plus, Pencil, Trash2, Save, X, Search, ChevronDown, ChevronUp,
  Users, FileQuestion, BookMarked, TrendingUp, FileText, Upload, CheckCircle2, AlertCircle, Crown, UserCheck,
} from 'lucide-react';
import { SUBJECTS } from '../lib/subjects';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Vocabulary {
  id: string;
  word: string;
  reading: string;
  burmese: string;
  category: string;
}

interface Flashcard {
  id: string;
  front: string;
  back: string;
  reading: string;
}

interface Question {
  id: string;
  subject: string;
  period: 'am' | 'pm';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

type AdminTab = 'dashboard' | 'vocabulary' | 'flashcards' | 'questions' | 'pdfs' | 'users';

const ADMIN_TABS: { id: AdminTab; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { id: 'users',      label: 'Users',       icon: Users },
  { id: 'vocabulary', label: 'Vocabulary',  icon: BookOpen },
  { id: 'flashcards', label: 'Flashcards', icon: GraduationCap },
  { id: 'questions',  label: 'Questions',   icon: ClipboardCheck },
  { id: 'pdfs',       label: 'PDFs',        icon: FileText },
];

const VOCAB_CATEGORIES = [
  '人間の尊厳と自立', '人間関係とコミュニケーション', '社会の理解',
  '介護の基本', 'コミュニケーション技術', '生活支援技術',
  '介護過程', '発達と老化の理解', '認知症の理解',
  '障害の理解', 'こころとからだのしくみ', '医療的ケア', '総合問題',
];

const QUESTION_SUBJECTS = [
  '人間の尊厳と自立', '人間関係とコミュニケーション', '社会の理解',
  '介護の基本', 'コミュニケーション技術', '生活支援技術',
  '介護過程', '発達と老化の理解', '認知症の理解',
  '障害の理解', 'こころとからだのしくみ', '医療的ケア',
];

// ─── Initial sample data ──────────────────────────────────────────────────────

const INITIAL_VOCAB: Vocabulary[] = [
  { id: '1', word: '生存権', reading: 'せいぞんけん', burmese: 'အသက်ရှင်သန်ခွင့်', category: '人間の尊厳と自立' },
  { id: '2', word: '基本的人権', reading: 'きほんてきじんけん', burmese: 'အခြေခံလူ့အခွင့်အရေး', category: '人間の尊厳と自立' },
  { id: '3', word: '社会保障', reading: 'しゃかいほしょう', burmese: 'လူမှုဖေးမမှု', category: '社会保障' },
];

const INITIAL_FLASHCARDS: Flashcard[] = [
  { id: '1', front: '人間の尊厳', reading: 'にんげんのそんげん', back: 'လူသားတို့၏ ဂုဏ်သိက္ခာ' },
  { id: '2', front: '自己決定', reading: 'じこけってい', back: 'မိမိဘာသာ ဆုံးဖြတ်ခြင်း' },
];

const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'am-01',
    subject: '人間の尊厳と自立',
    period: 'am',
    question: '介護の基本理念として最も適切なものはどれですか？',
    options: ['効率を最優先にする', '利用者の自己決定を尊重する', '介護者が全てを決定する', '家族の意向を最優先にする'],
    correctAnswer: 1,
    explanation: '介護の基本は利用者の尊厳を守り、自己決定を尊重・支援することです。',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [loading, setLoading] = useState(true);

  // Data state
  const [vocabList, setVocabList] = useState<Vocabulary[]>([]);
  const [flashcardList, setFlashcardList] = useState<Flashcard[]>([]);
  const [questionList, setQuestionList] = useState<Question[]>([]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [{ data: vocab }, { data: cards }, { data: questions }] = await Promise.all([
        supabase.from('vocabulary').select('*').order('created_at'),
        supabase.from('flashcards').select('*').order('created_at'),
        supabase.from('lessons').select('*').order('created_at'),
      ]);
      setVocabList(vocab ?? INITIAL_VOCAB);
      setFlashcardList(cards ?? INITIAL_FLASHCARDS);
      setQuestionList(questions?.map(q => ({ ...q, correctAnswer: q.correct_answer })) ?? INITIAL_QUESTIONS);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 flex items-center justify-center min-h-64">
        <p className="text-gray-400 animate-pulse">Loading content...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
        <p className="text-gray-400 mt-1">Manage your educational content</p>
      </div>

      {/* Tab navigation */}
      <div className="flex flex-wrap gap-2 mb-8">
        {ADMIN_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-metallic-gold text-matte-black shadow-lg shadow-metallic-gold/20'
                  : 'text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'dashboard'  && <Dashboard vocabCount={vocabList.length} flashcardCount={flashcardList.length} questionCount={questionList.length} />}
          {activeTab === 'users'      && <UserManager />}
          {activeTab === 'vocabulary' && <VocabularyManager items={vocabList} setItems={setVocabList} />}
          {activeTab === 'flashcards' && <FlashcardManager items={flashcardList} setItems={setFlashcardList} />}
          {activeTab === 'questions'  && <QuestionManager items={questionList} setItems={setQuestionList} />}
          {activeTab === 'pdfs'       && <PdfManager />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard({ vocabCount, flashcardCount, questionCount }: { vocabCount: number; flashcardCount: number; questionCount: number }) {
  const stats = [
    { label: 'Vocabulary Words', value: vocabCount, icon: BookMarked, color: 'from-blue-500/20 to-blue-600/5 border-blue-500/30' },
    { label: 'Flashcards', value: flashcardCount, icon: GraduationCap, color: 'from-purple-500/20 to-purple-600/5 border-purple-500/30' },
    { label: 'Questions', value: questionCount, icon: FileQuestion, color: 'from-green-500/20 to-green-600/5 border-green-500/30' },
    { label: 'Total Content', value: vocabCount + flashcardCount + questionCount, icon: TrendingUp, color: 'from-metallic-gold/20 to-metallic-gold/5 border-metallic-gold/30' },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.02 }}
              className={`bg-gradient-to-br ${stat.color} border rounded-2xl p-6`}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon size={20} className="text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <QuickAction icon={BookOpen} label="Add Vocabulary" description="Add new Japanese-Burmese words" />
          <QuickAction icon={GraduationCap} label="Add Flashcard" description="Create new study cards" />
          <QuickAction icon={ClipboardCheck} label="Add Question" description="Add mock test questions" />
        </div>
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, label, description }: { icon: React.ElementType; label: string; description: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-metallic-gold/30 transition-all cursor-pointer group">
      <Icon size={20} className="text-metallic-gold mb-2 group-hover:scale-110 transition-transform" />
      <p className="text-sm font-semibold text-white">{label}</p>
      <p className="text-xs text-gray-500 mt-0.5">{description}</p>
    </div>
  );
}

// ─── Vocabulary Manager ───────────────────────────────────────────────────────

function VocabularyManager({ items, setItems }: { items: Vocabulary[]; setItems: React.Dispatch<React.SetStateAction<Vocabulary[]>> }) {
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<Vocabulary, 'id'>>({ word: '', reading: '', burmese: '', category: '人間の尊厳と自立' });

  const filtered = items.filter((v) =>
    v.word.includes(search) || v.reading.includes(search) || v.burmese.includes(search) || v.category.includes(search)
  );

  const handleAdd = async () => {
    if (!form.word || !form.reading || !form.burmese) return;
    const { data, error } = await supabase.from('vocabulary').insert(form).select().single();
    if (!error && data) setItems([...items, data]);
    setForm({ word: '', reading: '', burmese: '', category: '人間の尊厳と自立' });
    setShowForm(false);
  };

  const handleUpdate = async (id: string) => {
    const { error } = await supabase.from('vocabulary').update(form).eq('id', id);
    if (!error) setItems(items.map((v) => (v.id === id ? { ...form, id } : v)));
    setEditingId(null);
    setForm({ word: '', reading: '', burmese: '', category: '人間の尊厳と自立' });
  };

  const handleEdit = (item: Vocabulary) => {
    setEditingId(item.id);
    setForm({ word: item.word, reading: item.reading, burmese: item.burmese, category: item.category });
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('vocabulary').delete().eq('id', id);
    setItems(items.filter((v) => v.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm({ word: '', reading: '', burmese: '', category: '人間の尊厳と自立' });
    }
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vocabulary..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-metallic-gold/50 transition-all"
          />
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); }} className="gold-button flex items-center gap-2 text-sm !px-5 !py-2.5">
          <Plus size={16} /> Add Word
        </button>
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {(showForm || editingId) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="bg-white/5 border border-metallic-gold/20 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-metallic-gold mb-4">{editingId ? 'Edit Word' : 'Add New Word'}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input value={form.word} onChange={(e) => setForm({ ...form, word: e.target.value })} placeholder="Japanese Word" className="admin-input" />
                <input value={form.reading} onChange={(e) => setForm({ ...form, reading: e.target.value })} placeholder="Reading" className="admin-input" />
                <input value={form.burmese} onChange={(e) => setForm({ ...form, burmese: e.target.value })} placeholder="Burmese Translation" className="admin-input" />
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="admin-input">
                  {VOCAB_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => editingId ? handleUpdate(editingId) : handleAdd()} className="gold-button flex items-center gap-2 text-sm !px-5 !py-2">
                  <Save size={14} /> {editingId ? 'Update' : 'Save'}
                </button>
                <button onClick={() => { setShowForm(false); setEditingId(null); setForm({ word: '', reading: '', burmese: '', category: '人間の尊厳と自立' }); }} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white px-5 py-2 rounded-full border border-white/10 hover:border-white/20 transition-all">
                  <X size={14} /> Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">Word</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">Reading</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">Burmese</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">Category</th>
                <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3 text-white font-medium">{item.word}</td>
                  <td className="px-5 py-3 text-gray-400">{item.reading}</td>
                  <td className="px-5 py-3 text-gray-400">{item.burmese}</td>
                  <td className="px-5 py-3"><span className="text-xs px-2.5 py-1 rounded-full bg-metallic-gold/10 text-metallic-gold border border-metallic-gold/20">{item.category}</span></td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => handleEdit(item)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-metallic-gold transition-all mr-1"><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-500">No vocabulary found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-white/10 text-xs text-gray-500">
          {filtered.length} of {items.length} items
        </div>
      </div>
    </div>
  );
}

// ─── Flashcard Manager ────────────────────────────────────────────────────────

function FlashcardManager({ items, setItems }: { items: Flashcard[]; setItems: React.Dispatch<React.SetStateAction<Flashcard[]>> }) {
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<Flashcard, 'id'>>({ front: '', back: '', reading: '' });

  const filtered = items.filter((c) =>
    c.front.includes(search) || c.back.includes(search) || c.reading.includes(search)
  );

  const handleAdd = async () => {
    if (!form.front || !form.back || !form.reading) return;
    const { data, error } = await supabase.from('flashcards').insert(form).select().single();
    if (!error && data) setItems([...items, data]);
    setForm({ front: '', back: '', reading: '' });
    setShowForm(false);
  };

  const handleUpdate = async (id: string) => {
    const { error } = await supabase.from('flashcards').update(form).eq('id', id);
    if (!error) setItems(items.map((c) => (c.id === id ? { ...form, id } : c)));
    setEditingId(null);
    setForm({ front: '', back: '', reading: '' });
  };

  const handleEdit = (item: Flashcard) => {
    setEditingId(item.id);
    setForm({ front: item.front, back: item.back, reading: item.reading });
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('flashcards').delete().eq('id', id);
    setItems(items.filter((c) => c.id !== id));
    if (editingId === id) { setEditingId(null); setForm({ front: '', back: '', reading: '' }); }
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search flashcards..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-metallic-gold/50 transition-all"
          />
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); }} className="gold-button flex items-center gap-2 text-sm !px-5 !py-2.5">
          <Plus size={16} /> Add Card
        </button>
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {(showForm || editingId) && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 overflow-hidden">
            <div className="bg-white/5 border border-metallic-gold/20 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-metallic-gold mb-4">{editingId ? 'Edit Card' : 'Add New Card'}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input value={form.front} onChange={(e) => setForm({ ...form, front: e.target.value })} placeholder="Front (Japanese)" className="admin-input" />
                <input value={form.reading} onChange={(e) => setForm({ ...form, reading: e.target.value })} placeholder="Reading" className="admin-input" />
                <input value={form.back} onChange={(e) => setForm({ ...form, back: e.target.value })} placeholder="Back (Burmese)" className="admin-input" />
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => editingId ? handleUpdate(editingId) : handleAdd()} className="gold-button flex items-center gap-2 text-sm !px-5 !py-2">
                  <Save size={14} /> {editingId ? 'Update' : 'Save'}
                </button>
                <button onClick={() => { setShowForm(false); setEditingId(null); setForm({ front: '', back: '', reading: '' }); }} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white px-5 py-2 rounded-full border border-white/10 hover:border-white/20 transition-all">
                  <X size={14} /> Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((card) => (
          <motion.div key={card.id} whileHover={{ scale: 1.01 }} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-metallic-gold/20 transition-all">
            <p className="text-lg font-bold text-white mb-1">{card.front}</p>
            <p className="text-sm text-metallic-gold mb-2">{card.reading}</p>
            <p className="text-sm text-gray-400">{card.back}</p>
            <div className="flex gap-1 mt-4 pt-3 border-t border-white/10">
              <button onClick={() => handleEdit(card)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-metallic-gold transition-all"><Pencil size={14} /></button>
              <button onClick={() => handleDelete(card.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all"><Trash2 size={14} /></button>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500">No flashcards found.</div>
        )}
      </div>
      <div className="mt-4 text-xs text-gray-500">{filtered.length} of {items.length} cards</div>
    </div>
  );
}

// ─── Question Manager ─────────────────────────────────────────────────────────

function QuestionManager({ items, setItems }: { items: Question[]; setItems: React.Dispatch<React.SetStateAction<Question[]>> }) {
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Question, 'id'>>({
    subject: '人間の尊厳と自立', period: 'am', question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '',
  });

  const filtered = items.filter((q) =>
    q.question.includes(search) || q.subject.includes(search) || q.explanation.includes(search)
  );

  const handleAdd = async () => {
    if (!form.question || form.options.some((o) => !o)) return;
    const row = { ...form, id: Date.now().toString(), correct_answer: form.correctAnswer };
    const { data, error } = await supabase.from('lessons').insert(row).select().single();
    if (!error && data) setItems([...items, { ...data, correctAnswer: data.correct_answer }]);
    resetForm();
    setShowForm(false);
  };

  const handleUpdate = async (id: string) => {
    const { error } = await supabase.from('lessons').update({ ...form, correct_answer: form.correctAnswer }).eq('id', id);
    if (!error) setItems(items.map((q) => (q.id === id ? { ...form, id } : q)));
    setEditingId(null);
    resetForm();
  };

  const handleEdit = (item: Question) => {
    setEditingId(item.id);
    setForm({ subject: item.subject, period: item.period, question: item.question, options: [...item.options], correctAnswer: item.correctAnswer, explanation: item.explanation });
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('lessons').delete().eq('id', id);
    setItems(items.filter((q) => q.id !== id));
    if (editingId === id) { setEditingId(null); resetForm(); }
  };

  const resetForm = () => setForm({ subject: '人間の尊厳と自立', period: 'am', question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' });

  const updateOption = (idx: number, value: string) => {
    const opts = [...form.options];
    opts[idx] = value;
    setForm({ ...form, options: opts });
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-metallic-gold/50 transition-all"
          />
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); }} className="gold-button flex items-center gap-2 text-sm !px-5 !py-2.5">
          <Plus size={16} /> Add Question
        </button>
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {(showForm || editingId) && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 overflow-hidden">
            <div className="bg-white/5 border border-metallic-gold/20 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-metallic-gold mb-4">{editingId ? 'Edit Question' : 'Add New Question'}</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="admin-input">
                  {QUESTION_SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value as 'am' | 'pm' })} className="admin-input">
                  <option value="am">AM (Morning)</option>
                  <option value="pm">PM (Afternoon)</option>
                </select>
              </div>

              <textarea
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
                placeholder="Question text..."
                rows={2}
                className="admin-input w-full mb-3 resize-none"
              />

              <p className="text-xs text-gray-400 mb-2">Options (mark the correct one):</p>
              <div className="space-y-2 mb-3">
                {form.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, correctAnswer: idx })}
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                        form.correctAnswer === idx
                          ? 'border-green-400 bg-green-400/20 text-green-400'
                          : 'border-white/20 text-gray-500 hover:border-white/40'
                      }`}
                    >
                      {idx + 1}
                    </button>
                    <input
                      value={opt}
                      onChange={(e) => updateOption(idx, e.target.value)}
                      placeholder={`Option ${idx + 1}`}
                      className="admin-input flex-1"
                    />
                  </div>
                ))}
              </div>

              <textarea
                value={form.explanation}
                onChange={(e) => setForm({ ...form, explanation: e.target.value })}
                placeholder="Explanation..."
                rows={2}
                className="admin-input w-full mb-4 resize-none"
              />

              <div className="flex gap-2">
                <button onClick={() => editingId ? handleUpdate(editingId) : handleAdd()} className="gold-button flex items-center gap-2 text-sm !px-5 !py-2">
                  <Save size={14} /> {editingId ? 'Update' : 'Save'}
                </button>
                <button onClick={() => { setShowForm(false); setEditingId(null); resetForm(); }} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white px-5 py-2 rounded-full border border-white/10 hover:border-white/20 transition-all">
                  <X size={14} /> Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question List */}
      <div className="space-y-3">
        {filtered.map((q) => (
          <div key={q.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all">
            <div className="flex items-start gap-3 p-5 cursor-pointer" onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-metallic-gold/10 text-metallic-gold border border-metallic-gold/20">{q.subject}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full border ${q.period === 'am' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-purple-500/10 text-purple-400 border-purple-500/20'}`}>
                    {q.period.toUpperCase()}
                  </span>
                </div>
                <p className="text-white text-sm">{q.question}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={(e) => { e.stopPropagation(); handleEdit(q); }} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-metallic-gold transition-all"><Pencil size={14} /></button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(q.id); }} className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all"><Trash2 size={14} /></button>
                {expandedId === q.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              </div>
            </div>
            <AnimatePresence>
              {expandedId === q.id && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                  <div className="px-5 pb-5 pt-0 border-t border-white/5">
                    <div className="space-y-1.5 mt-3">
                      {q.options.map((opt, idx) => (
                        <div key={idx} className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${idx === q.correctAnswer ? 'bg-green-500/10 text-green-400' : 'text-gray-400'}`}>
                          <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${idx === q.correctAnswer ? 'border-green-400 bg-green-400/20' : 'border-white/20'}`}>{idx + 1}</span>
                          {opt}
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                      <p className="text-xs text-blue-400 font-semibold mb-1">Explanation</p>
                      <p className="text-sm text-gray-400">{q.explanation}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-10 text-gray-500">No questions found.</div>
        )}
      </div>
      <div className="mt-4 text-xs text-gray-500">{filtered.length} of {items.length} questions</div>
    </div>
  );
}

// ─── User Manager ─────────────────────────────────────────────────────────────

interface UserProfile {
  id: string;
  email: string | null;
  is_paid: boolean;
  plan: string;
  created_at: string;
}

function UserManager() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => { loadUsers(); }, []);

  async function loadUsers() {
    setLoading(true);
    const { data } = await supabase
      .from('profiles')
      .select('id, email, is_paid, plan, created_at')
      .order('created_at', { ascending: false });
    setUsers(data ?? []);
    setLoading(false);
  }

  async function togglePaid(user: UserProfile) {
    setToggling(user.id);
    const newPaid = !user.is_paid;
    const { error } = await supabase
      .from('profiles')
      .update({ is_paid: newPaid, plan: newPaid ? 'paid' : 'free', paid_at: newPaid ? new Date().toISOString() : null })
      .eq('id', user.id);
    if (!error) {
      setUsers(users.map(u => u.id === user.id ? { ...u, is_paid: newPaid, plan: newPaid ? 'paid' : 'free' } : u));
    }
    setToggling(null);
  }

  const paidCount = users.filter(u => u.is_paid).length;

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-3xl font-bold text-white">{users.length}</p>
          <p className="text-sm text-gray-400 mt-1">Total Users</p>
        </div>
        <div className="bg-gradient-to-br from-metallic-gold/20 to-metallic-gold/5 border border-metallic-gold/30 rounded-2xl p-5">
          <p className="text-3xl font-bold text-white">{paidCount}</p>
          <p className="text-sm text-gray-400 mt-1">Paid Users</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-3xl font-bold text-white">{users.length - paidCount}</p>
          <p className="text-sm text-gray-400 mt-1">Free Users</p>
        </div>
      </div>

      {/* User list */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-white/10 flex items-center gap-2">
          <Users size={15} className="text-metallic-gold" />
          <span className="text-sm font-semibold text-white">All Users</span>
          <span className="text-xs text-gray-500 ml-auto">Toggle to grant / revoke paid access</span>
        </div>

        {loading ? (
          <div className="px-5 py-10 text-center text-gray-500 text-sm animate-pulse">Loading...</div>
        ) : users.length === 0 ? (
          <div className="px-5 py-10 text-center text-gray-500 text-sm">No users yet.</div>
        ) : (
          <div className="divide-y divide-white/5">
            {users.map((user) => (
              <div key={user.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <UserCheck size={16} className="text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {user.email ?? <span className="text-gray-500 italic">No email (old account)</span>}
                  </p>
                  <p className="text-xs text-gray-500">Joined {new Date(user.created_at).toLocaleDateString('ja-JP')}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {user.is_paid && (
                    <span className="flex items-center gap-1 text-xs text-metallic-gold bg-metallic-gold/10 border border-metallic-gold/20 px-2.5 py-1 rounded-full">
                      <Crown size={11} /> Paid
                    </span>
                  )}
                  <button
                    onClick={() => togglePaid(user)}
                    disabled={toggling === user.id}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50 ${
                      user.is_paid ? 'bg-metallic-gold' : 'bg-white/20'
                    }`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                      user.is_paid ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-600 mt-3 text-center">
        Toggle ON = paid access. Changes take effect immediately on next page load.
      </p>
    </div>
  );
}

// ─── PDF Manager ──────────────────────────────────────────────────────────────

interface SubjectPdf {
  id: string;
  subject: string;
  file_url: string;
  title: string;
  created_at: string;
}

function PdfManager() {
  const [pdfs, setPdfs] = useState<SubjectPdf[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlug, setSelectedSlug] = useState(SUBJECTS[0].slug);
  const [file, setFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadPdfs();
  }, []);

  async function loadPdfs() {
    setLoading(true);
    const { data } = await supabase
      .from('subject_pdfs')
      .select('*')
      .order('uploaded_at', { ascending: false });
    setPdfs(data ?? []);
    setLoading(false);
  }

  async function handleUpload() {
    if (!file) return;
    setUploadState('uploading');
    setUploadProgress(0);
    setErrorMsg('');

    const ext = file.name.split('.').pop() ?? 'pdf';
    const filePath = `${selectedSlug}/${Date.now()}.${ext}`;

    // Upload to storage
    const { error: storageError } = await supabase.storage
      .from('subject-pdfs')
      .upload(filePath, file, { upsert: false });

    if (storageError) {
      setUploadState('error');
      setErrorMsg(storageError.message);
      return;
    }

    setUploadProgress(70);

    // Upsert metadata into subject_pdfs table
    const { error: dbError } = await supabase
      .from('subject_pdfs')
      .upsert({ subject: selectedSlug, file_url: filePath, title: file.name }, { onConflict: 'subject' });

    if (dbError) {
      setUploadState('error');
      setErrorMsg(dbError.message);
      return;
    }

    setUploadProgress(100);
    setUploadState('success');
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    await loadPdfs();

    setTimeout(() => setUploadState('idle'), 3000);
  }

  async function handleDelete(pdf: SubjectPdf) {
    // Remove from storage
    await supabase.storage.from('subject-pdfs').remove([pdf.file_url]);
    // Remove from table
    await supabase.from('subject_pdfs').delete().eq('id', pdf.id);
    setPdfs(pdfs.filter((p) => p.id !== pdf.id));
  }

  const subjectName = (subject: string) => SUBJECTS.find((s) => s.slug === subject)?.nameJa ?? subject;

  return (
    <div>
      {/* Upload Form */}
      <div className="bg-white/5 border border-metallic-gold/20 rounded-2xl p-6 mb-6">
        <h3 className="text-sm font-semibold text-metallic-gold mb-4 flex items-center gap-2">
          <Upload size={15} /> Upload Textbook PDF
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {/* Subject picker */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Subject</label>
            <select
              value={selectedSlug}
              onChange={(e) => setSelectedSlug(e.target.value)}
              className="admin-input w-full"
            >
              {SUBJECTS.map((s) => (
                <option key={s.slug} value={s.slug}>{s.nameJa}</option>
              ))}
            </select>
          </div>

          {/* File picker */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">PDF File</label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-gray-400 file:mr-3 file:py-1.5 file:px-4 file:rounded-full file:border file:border-white/10 file:text-xs file:font-semibold file:bg-white/5 file:text-gray-300 hover:file:bg-white/10 file:cursor-pointer cursor-pointer"
            />
          </div>
        </div>

        {/* Progress bar */}
        {uploadState === 'uploading' && (
          <div className="mb-4">
            <div className="w-full bg-white/10 rounded-full h-1.5">
              <motion.div
                className="bg-metallic-gold h-1.5 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Uploading...</p>
          </div>
        )}

        {/* Status messages */}
        {uploadState === 'success' && (
          <div className="flex items-center gap-2 text-green-400 text-sm mb-4">
            <CheckCircle2 size={16} /> Uploaded successfully
          </div>
        )}
        {uploadState === 'error' && (
          <div className="flex items-center gap-2 text-red-400 text-sm mb-4">
            <AlertCircle size={16} /> {errorMsg || 'Upload failed'}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || uploadState === 'uploading'}
          className="gold-button flex items-center gap-2 text-sm !px-5 !py-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Upload size={14} /> Upload PDF
        </button>

        <p className="text-xs text-gray-600 mt-3">
          Uploading a PDF for a subject that already has one will replace it.
        </p>
      </div>

      {/* Existing PDFs */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-white/10 flex items-center gap-2">
          <FileText size={15} className="text-metallic-gold" />
          <span className="text-sm font-semibold text-white">Uploaded PDFs</span>
          <span className="text-xs text-gray-500 ml-auto">{pdfs.length} / 13 subjects</span>
        </div>

        {loading ? (
          <div className="px-5 py-10 text-center text-gray-500 text-sm animate-pulse">Loading...</div>
        ) : pdfs.length === 0 ? (
          <div className="px-5 py-10 text-center text-gray-500 text-sm">No PDFs uploaded yet.</div>
        ) : (
          <div className="divide-y divide-white/5">
            {pdfs.map((pdf) => (
              <div key={pdf.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors">
                <FileText size={18} className="text-metallic-gold shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{subjectName(pdf.subject)}</p>
                  <p className="text-xs text-gray-500 truncate">{pdf.title}</p>
                  <p className="text-xs text-gray-600">{new Date(pdf.created_at).toLocaleString('ja-JP')}</p>
                </div>
                <button
                  onClick={() => handleDelete(pdf)}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-all shrink-0"
                  title="Delete PDF"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
