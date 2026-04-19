// 13 科目 configuration for 介護福祉士 exam

export interface Subject {
  slug: string;
  nameJa: string;
  period: 'am' | 'pm';
  questionCount: number;
  icon: string;
  color: string;
  description: string;
}

export const SUBJECTS: Subject[] = [
  // ── 午前 8科目 ──────────────────────────────────────────────────────────────
  {
    slug: 'ningen-no-songen',
    nameJa: '人間の尊厳と自立',
    period: 'am',
    questionCount: 2,
    icon: '👑',
    color: 'from-amber-500/20 to-yellow-500/10',
    description: '介護の根本理念。人権・自己決定・QOL',
  },
  {
    slug: 'ningen-kankei',
    nameJa: '人間関係とコミュニケーション',
    period: 'am',
    questionCount: 4,
    icon: '🗣️',
    color: 'from-blue-500/20 to-cyan-500/10',
    description: '傾聴・共感・チームワーク',
  },
  {
    slug: 'shakai-no-rikai',
    nameJa: '社会の理解',
    period: 'am',
    questionCount: 12,
    icon: '🏛️',
    color: 'from-green-500/20 to-emerald-500/10',
    description: '社会保障・介護保険・法制度',
  },
  {
    slug: 'kokoro-to-karada',
    nameJa: 'こころとからだのしくみ',
    period: 'am',
    questionCount: 12,
    icon: '🧠',
    color: 'from-purple-500/20 to-violet-500/10',
    description: '解剖生理・心理・疾患知識',
  },
  {
    slug: 'hattatsu-to-rouka',
    nameJa: '発達と老化の理解',
    period: 'am',
    questionCount: 8,
    icon: '🌱',
    color: 'from-teal-500/20 to-green-500/10',
    description: '発達段階・老化の特徴・高齢者心理',
  },
  {
    slug: 'ninchisho-no-rikai',
    nameJa: '認知症の理解',
    period: 'am',
    questionCount: 10,
    icon: '🔮',
    color: 'from-indigo-500/20 to-blue-500/10',
    description: 'BPSDの対応・種類・支援方法',
  },
  {
    slug: 'shogai-no-rikai',
    nameJa: '障害の理解',
    period: 'am',
    questionCount: 10,
    icon: '♿',
    color: 'from-orange-500/20 to-amber-500/10',
    description: '障害の種類・ICF・社会モデル',
  },
  {
    slug: 'iryoteki-care',
    nameJa: '医療的ケア',
    period: 'am',
    questionCount: 5,
    icon: '🏥',
    color: 'from-red-500/20 to-rose-500/10',
    description: '喀痰吸引・経管栄養・感染予防',
  },
  // ── 午後 5科目 ──────────────────────────────────────────────────────────────
  {
    slug: 'kaigo-no-kihon',
    nameJa: '介護の基本',
    period: 'pm',
    questionCount: 10,
    icon: '🤝',
    color: 'from-pink-500/20 to-rose-500/10',
    description: '介護倫理・チームケア・リスク管理',
  },
  {
    slug: 'communication-gijutsu',
    nameJa: 'コミュニケーション技術',
    period: 'pm',
    questionCount: 8,
    icon: '💬',
    color: 'from-sky-500/20 to-blue-500/10',
    description: '記録・報告・バイステックの原則',
  },
  {
    slug: 'seikatsu-shien',
    nameJa: '生活支援技術',
    period: 'pm',
    questionCount: 20,
    icon: '🏠',
    color: 'from-lime-500/20 to-green-500/10',
    description: '移動・食事・入浴・排泄・環境整備',
  },
  {
    slug: 'kaigo-katei',
    nameJa: '介護過程',
    period: 'pm',
    questionCount: 12,
    icon: '📋',
    color: 'from-violet-500/20 to-purple-500/10',
    description: 'アセスメント・計画・実施・評価',
  },
  {
    slug: 'sogo-mondai',
    nameJa: '総合問題',
    period: 'pm',
    questionCount: 12,
    icon: '🎯',
    color: 'from-yellow-500/20 to-orange-500/10',
    description: '事例問題・総合的な実践力',
  },
];

export function getSubjectBySlug(slug: string): Subject | undefined {
  return SUBJECTS.find((s) => s.slug === slug);
}

// Map Japanese name → slug (for linking from question data)
export const SUBJECT_NAME_TO_SLUG: Record<string, string> = Object.fromEntries(
  SUBJECTS.map((s) => [s.nameJa, s.slug])
);
