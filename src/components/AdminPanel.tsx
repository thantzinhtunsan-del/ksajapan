/**
 * AdminPanel.tsx — Admin dashboard for managing vocab, flashcards, and questions.
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, BookOpen, GraduationCap, ClipboardCheck,
  Plus, Pencil, Trash2, Save, X, Search, ChevronDown, ChevronUp,
  FileQuestion, BookMarked, TrendingUp,
} from 'lucide-react';

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

type AdminTab = 'dashboard' | 'vocabulary' | 'flashcards' | 'questions';

const ADMIN_TABS: { id: AdminTab; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { id: 'vocabulary', label: 'Vocabulary',  icon: BookOpen },
  { id: 'flashcards', label: 'Flashcards', icon: GraduationCap },
  { id: 'questions',  label: 'Questions',   icon: ClipboardCheck },
];

const VOCAB_CATEGORIES = [
  '基本理念', '社会保障', '介護保険', '高齢者・障害者', '生活保護',
  'コミュニケーション', '介護技術', '医療知識', 'その他',
];

const QUESTION_SUBJECTS = [
  '人間の尊厳と自立', '人間関係とコミュニケーション', '社会の理解',
  '介護の基本', 'コミュニケーション技術', '生活支援技術',
  '介護過程', '発達と老化の理解', '認知症の理解',
  '障害の理解', 'こころとからだのしくみ', '医療的ケア',
];

// ─── Seed data ────────────────────────────────────────────────────────────────

const INITIAL_VOCAB: Vocabulary[] = [
  { id: '1', word: '生存権', reading: 'せいぞんけん', burmese: 'အသက်ရှင်သန်ခွင့်', category: '基本理念' },
  { id: '2', word: '基本的人権', reading: 'きほんてきじんけん', burmese: 'အခြေခံလူ့အခွင့်အရေး', category: '基本理念' },
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

// ─── Shared sub-components ────────────────────────────────────────────────────

function SearchInput({ value, onChange, placeholder }: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative flex-1">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-metallic-gold/50 transition-all"
      />
    </div>
  );
}

function ActionButtons({ onEdit, onDelete, stopPropagation = false }: {
  onEdit: () => void;
  onDelete: () => void;
  stopPropagation?: boolean;
}) {
  const wrap = (fn: () => void) => (e: React.MouseEvent) => {
    if (stopPropagation) e.stopPropagation();
    fn();
  };
  return (
    <>
      <button onClick={wrap(onEdit)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-metallic-gold transition-all">
        <Pencil size={14} />
      </button>
      <button onClick={wrap(onDelete)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all">
        <Trash2 size={14} />
      </button>
    </>
  );
}

function FormWrapper({ visible, children }: { visible: boolean; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6 overflow-hidden"
        >
          <div className="bg-white/5 border border-metallic-gold/20 rounded-2xl p-5">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [vocabList, setVocabList] = useState<Vocabulary[]>(INITIAL_VOCAB);
  const [flashcardList, setFlashcardList] = useState<Flashcard[]>(INITIAL_FLASHCARDS);
  const [questionList, setQuestionList] = useState<Question[]>(INITIAL_QUESTIONS);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
        <p className="text-gray-400 mt-1">Manage your educational content</p>
      </div>

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

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'dashboard' && (
            <Dashboard
              vocabCount={vocabList.length}
              flashcardCount={flashcardList.length}
              questionCount={questionList.length}
              onNavigate={setActiveTab}
            />
          )}
          {activeTab === 'vocabulary' && <VocabularyManager items={vocabList} setItems={setVocabList} />}
          {activeTab === 'flashcards' && <FlashcardManager items={flashcardList} setItems={setFlashcardList} />}
          {activeTab === 'questions'  && <QuestionManager items={questionList} setItems={setQuestionList} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard({ vocabCount, flashcardCount, questionCount, onNavigate }: {
  vocabCount: number;
  flashcardCount: number;
  questionCount: number;
  onNavigate: (tab: AdminTab) => void;
}) {
  const stats = useMemo(() => [
    { label: 'Vocabulary Words', value: vocabCount,  icon: BookMarked,  color: 'from-blue-500/20 to-blue-600/5 border-blue-500/30' },
    { label: 'Flashcards',       value: flashcardCount, icon: GraduationCap, color: 'from-purple-500/20 to-purple-600/5 border-purple-500/30' },
    { label: 'Questions',        value: questionCount,  icon: FileQuestion,  color: 'from-green-500/20 to-green-600/5 border-green-500/30' },
    { label: 'Total Content',    value: vocabCount + flashcardCount + questionCount, icon: TrendingUp, color: 'from-metallic-gold/20 to-metallic-gold/5 border-metallic-gold/30' },
  ], [vocabCount, flashcardCount, questionCount]);

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
              <Icon size={20} className="text-gray-400 mb-3" />
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <QuickAction icon={BookOpen}      label="Add Vocabulary" description="Add new Japanese-Burmese words" onClick={() => onNavigate('vocabulary')} />
          <QuickAction icon={GraduationCap} label="Add Flashcard"  description="Create new study cards"        onClick={() => onNavigate('flashcards')} />
          <QuickAction icon={ClipboardCheck} label="Add Question"  description="Add mock test questions"       onClick={() => onNavigate('questions')} />
        </div>
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, label, description, onClick }: {
  icon: React.ElementType;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white/5 border border-white/10 rounded-xl p-4 hover:border-metallic-gold/30 transition-all group"
    >
      <Icon size={20} className="text-metallic-gold mb-2 group-hover:scale-110 transition-transform" />
      <p className="text-sm font-semibold text-white">{label}</p>
      <p className="text-xs text-gray-500 mt-0.5">{description}</p>
    </button>
  );
}

// ─── Vocabulary Manager ───────────────────────────────────────────────────────

const EMPTY_VOCAB: Omit<Vocabulary, 'id'> = { word: '', reading: '', burmese: '', category: '基本理念' };

function VocabularyManager({ items, setItems }: {
  items: Vocabulary[];
  setItems: React.Dispatch<React.SetStateAction<Vocabulary[]>>;
}) {
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<Vocabulary, 'id'>>(EMPTY_VOCAB);
  const [formError, setFormError] = useState('');

  const filtered = useMemo(
    () => items.filter((v) =>
      v.word.includes(search) || v.reading.includes(search) ||
      v.burmese.includes(search) || v.category.includes(search)
    ),
    [items, search],
  );

  const resetForm = () => { setForm(EMPTY_VOCAB); setFormError(''); };
  const openAdd   = () => { resetForm(); setEditingId(null); setShowForm(true); };
  const closeForm = () => { resetForm(); setEditingId(null); setShowForm(false); };

  const validate = () => {
    if (!form.word || !form.reading || !form.burmese) {
      setFormError('Please fill in all fields.');
      return false;
    }
    return true;
  };

  const handleAdd = () => {
    if (!validate()) return;
    setItems([...items, { ...form, id: Date.now().toString() }]);
    closeForm();
  };

  const handleUpdate = (id: string) => {
    if (!validate()) return;
    setItems(items.map((v) => (v.id === id ? { ...form, id } : v)));
    closeForm();
  };

  const handleEdit = (item: Vocabulary) => {
    setForm({ word: item.word, reading: item.reading, burmese: item.burmese, category: item.category });
    setFormError('');
    setEditingId(item.id);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this vocabulary word? This cannot be undone.')) return;
    setItems(items.filter((v) => v.id !== id));
    if (editingId === id) closeForm();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <SearchInput value={search} onChange={setSearch} placeholder="Search vocabulary..." />
        <button onClick={openAdd} className="gold-button flex items-center gap-2 text-sm !px-5 !py-2.5">
          <Plus size={16} /> Add Word
        </button>
      </div>

      <FormWrapper visible={showForm || !!editingId}>
        <h3 className="text-sm font-semibold text-metallic-gold mb-4">{editingId ? 'Edit Word' : 'Add New Word'}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input value={form.word}    onChange={(e) => setForm({ ...form, word: e.target.value })}    placeholder="Japanese Word"        className="admin-input" />
          <input value={form.reading} onChange={(e) => setForm({ ...form, reading: e.target.value })} placeholder="Reading"              className="admin-input" />
          <input value={form.burmese} onChange={(e) => setForm({ ...form, burmese: e.target.value })} placeholder="Burmese Translation"  className="admin-input" />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="admin-input">
            {VOCAB_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        {formError && <p className="text-red-400 text-xs mt-3">{formError}</p>}
        <div className="flex gap-2 mt-4">
          <button onClick={() => editingId ? handleUpdate(editingId) : handleAdd()} className="gold-button flex items-center gap-2 text-sm !px-5 !py-2">
            <Save size={14} /> {editingId ? 'Update' : 'Save'}
          </button>
          <button onClick={closeForm} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white px-5 py-2 rounded-full border border-white/10 hover:border-white/20 transition-all">
            <X size={14} /> Cancel
          </button>
        </div>
      </FormWrapper>

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
                  <td className="px-5 py-3">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-metallic-gold/10 text-metallic-gold border border-metallic-gold/20">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <ActionButtons onEdit={() => handleEdit(item)} onDelete={() => handleDelete(item.id)} />
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

const EMPTY_FLASHCARD: Omit<Flashcard, 'id'> = { front: '', back: '', reading: '' };

function FlashcardManager({ items, setItems }: {
  items: Flashcard[];
  setItems: React.Dispatch<React.SetStateAction<Flashcard[]>>;
}) {
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<Flashcard, 'id'>>(EMPTY_FLASHCARD);
  const [formError, setFormError] = useState('');

  const filtered = useMemo(
    () => items.filter((c) =>
      c.front.includes(search) || c.back.includes(search) || c.reading.includes(search)
    ),
    [items, search],
  );

  const resetForm = () => { setForm(EMPTY_FLASHCARD); setFormError(''); };
  const openAdd   = () => { resetForm(); setEditingId(null); setShowForm(true); };
  const closeForm = () => { resetForm(); setEditingId(null); setShowForm(false); };

  const validate = () => {
    if (!form.front || !form.back || !form.reading) {
      setFormError('Please fill in all fields.');
      return false;
    }
    return true;
  };

  const handleAdd = () => {
    if (!validate()) return;
    setItems([...items, { ...form, id: Date.now().toString() }]);
    closeForm();
  };

  const handleUpdate = (id: string) => {
    if (!validate()) return;
    setItems(items.map((c) => (c.id === id ? { ...form, id } : c)));
    closeForm();
  };

  const handleEdit = (item: Flashcard) => {
    setForm({ front: item.front, back: item.back, reading: item.reading });
    setFormError('');
    setEditingId(item.id);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this flashcard? This cannot be undone.')) return;
    setItems(items.filter((c) => c.id !== id));
    if (editingId === id) closeForm();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <SearchInput value={search} onChange={setSearch} placeholder="Search flashcards..." />
        <button onClick={openAdd} className="gold-button flex items-center gap-2 text-sm !px-5 !py-2.5">
          <Plus size={16} /> Add Card
        </button>
      </div>

      <FormWrapper visible={showForm || !!editingId}>
        <h3 className="text-sm font-semibold text-metallic-gold mb-4">{editingId ? 'Edit Card' : 'Add New Card'}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input value={form.front}   onChange={(e) => setForm({ ...form, front: e.target.value })}   placeholder="Front (Japanese)" className="admin-input" />
          <input value={form.reading} onChange={(e) => setForm({ ...form, reading: e.target.value })} placeholder="Reading"          className="admin-input" />
          <input value={form.back}    onChange={(e) => setForm({ ...form, back: e.target.value })}    placeholder="Back (Burmese)"   className="admin-input" />
        </div>
        {formError && <p className="text-red-400 text-xs mt-3">{formError}</p>}
        <div className="flex gap-2 mt-4">
          <button onClick={() => editingId ? handleUpdate(editingId) : handleAdd()} className="gold-button flex items-center gap-2 text-sm !px-5 !py-2">
            <Save size={14} /> {editingId ? 'Update' : 'Save'}
          </button>
          <button onClick={closeForm} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white px-5 py-2 rounded-full border border-white/10 hover:border-white/20 transition-all">
            <X size={14} /> Cancel
          </button>
        </div>
      </FormWrapper>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((card) => (
          <motion.div key={card.id} whileHover={{ scale: 1.01 }} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-metallic-gold/20 transition-all">
            <p className="text-lg font-bold text-white mb-1">{card.front}</p>
            <p className="text-sm text-metallic-gold mb-2">{card.reading}</p>
            <p className="text-sm text-gray-400">{card.back}</p>
            <div className="flex gap-1 mt-4 pt-3 border-t border-white/10">
              <ActionButtons onEdit={() => handleEdit(card)} onDelete={() => handleDelete(card.id)} />
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

const EMPTY_QUESTION: Omit<Question, 'id'> = {
  subject: '人間の尊厳と自立', period: 'am', question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '',
};

function QuestionManager({ items, setItems }: {
  items: Question[];
  setItems: React.Dispatch<React.SetStateAction<Question[]>>;
}) {
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Question, 'id'>>(EMPTY_QUESTION);
  const [formError, setFormError] = useState('');

  const filtered = useMemo(
    () => items.filter((q) =>
      q.question.includes(search) || q.subject.includes(search) || q.explanation.includes(search)
    ),
    [items, search],
  );

  const resetForm = () => { setForm({ ...EMPTY_QUESTION, options: ['', '', '', ''] }); setFormError(''); };
  const openAdd   = () => { resetForm(); setEditingId(null); setShowForm(true); };
  const closeForm = () => { resetForm(); setEditingId(null); setShowForm(false); };

  const validate = () => {
    if (!form.question || form.options.some((o) => !o)) {
      setFormError('Please fill in the question and all 4 options.');
      return false;
    }
    return true;
  };

  const handleAdd = () => {
    if (!validate()) return;
    setItems([...items, { ...form, id: Date.now().toString() }]);
    closeForm();
  };

  const handleUpdate = (id: string) => {
    if (!validate()) return;
    setItems(items.map((q) => (q.id === id ? { ...form, id } : q)));
    closeForm();
  };

  const handleEdit = (item: Question) => {
    setForm({
      subject: item.subject, period: item.period, question: item.question,
      options: [...item.options], correctAnswer: item.correctAnswer, explanation: item.explanation,
    });
    setFormError('');
    setEditingId(item.id);
    setExpandedId(null); // collapse expanded view when opening edit form
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this question? This cannot be undone.')) return;
    setItems(items.filter((q) => q.id !== id));
    if (editingId === id) closeForm();
    if (expandedId === id) setExpandedId(null);
  };

  const updateOption = (idx: number, value: string) => {
    const opts = [...form.options];
    opts[idx] = value;
    setForm({ ...form, options: opts });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <SearchInput value={search} onChange={setSearch} placeholder="Search questions..." />
        <button onClick={openAdd} className="gold-button flex items-center gap-2 text-sm !px-5 !py-2.5">
          <Plus size={16} /> Add Question
        </button>
      </div>

      <FormWrapper visible={showForm || !!editingId}>
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

        <p className="text-xs text-gray-400 mb-2">Options — click the number to mark correct answer:</p>
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

        {formError && <p className="text-red-400 text-xs mb-3">{formError}</p>}

        <div className="flex gap-2">
          <button onClick={() => editingId ? handleUpdate(editingId) : handleAdd()} className="gold-button flex items-center gap-2 text-sm !px-5 !py-2">
            <Save size={14} /> {editingId ? 'Update' : 'Save'}
          </button>
          <button onClick={closeForm} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white px-5 py-2 rounded-full border border-white/10 hover:border-white/20 transition-all">
            <X size={14} /> Cancel
          </button>
        </div>
      </FormWrapper>

      <div className="space-y-3">
        {filtered.map((q) => (
          <div key={q.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all">
            <div
              className="flex items-start gap-3 p-5 cursor-pointer"
              onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-metallic-gold/10 text-metallic-gold border border-metallic-gold/20">
                    {q.subject}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full border ${
                    q.period === 'am'
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                  }`}>
                    {q.period.toUpperCase()}
                  </span>
                </div>
                <p className="text-white text-sm">{q.question}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <ActionButtons onEdit={() => handleEdit(q)} onDelete={() => handleDelete(q.id)} stopPropagation />
                {expandedId === q.id
                  ? <ChevronUp size={16} className="text-gray-400" />
                  : <ChevronDown size={16} className="text-gray-400" />
                }
              </div>
            </div>

            <AnimatePresence>
              {expandedId === q.id && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                  <div className="px-5 pb-5 pt-0 border-t border-white/5">
                    <div className="space-y-1.5 mt-3">
                      {q.options.map((opt, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${
                            idx === q.correctAnswer ? 'bg-green-500/10 text-green-400' : 'text-gray-400'
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
                            idx === q.correctAnswer ? 'border-green-400 bg-green-400/20' : 'border-white/20'
                          }`}>
                            {idx + 1}
                          </span>
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
