import { useState } from 'react';
import type { ComponentType } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, ChevronDown, Target, Brain, Clock, Lightbulb, Lock } from 'lucide-react';
import PaywallBanner from '../PaywallBanner';
import { useLang } from '../../context/LanguageContext';

interface ExamHack {
  title: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  color: string;
  items: string[];
  isFree: boolean;
}

// Exam hack content stays in Japanese — it's Japanese exam study material
const EXAM_HACKS: Record<string, ExamHack[]> = {
  'ningen-no-songen': [
    { title: '高頻出ポイント', icon: Target, color: 'text-amber-400', isFree: true, items: ['「利用者中心」が絶対の正解：迷ったら利用者の気持ちを優先する選択肢を選べ。', 'ノーマライゼーション ＝ 障害があっても普通の生活。このキーワードセットだけで1点取れる。', '憲法25条 ＝ 生存権（健康で文化的な最低限度の生活）。', 'QOL ＝ 生活の「量」ではなく「質」。点数は少ないが他科目の基礎になる。'] },
    { title: '試験の引っかけパターン', icon: Brain, color: 'text-red-400', isFree: true, items: ['「危ないからやらせない」「介護者が全部決める」→ すべて×（バツ）', '「自立」の意味を「一人で全部できること」と混同するミス。介護での自立は「自分で選ぶこと」。', 'リハビリテーション ≠ 機能回復だけ。社会復帰・QOL向上も含む。'] },
    { title: '勉強戦略', icon: Clock, color: 'text-green-400', isFree: false, items: ['この科目は2問のみ。難しい法律を覚えるより基本用語だけ押さえて次に進め。', '過去3年分の問題（約6問）を解いて傾向を把握するだけで十分。', 'テキストを読むより過去問を解く時間を優先する。'] },
    { title: '語呂合わせ・記憶術', icon: Lightbulb, color: 'text-yellow-400', isFree: false, items: ['憲法25条 ＝「ニコ（25）ニコ生きる生存権」', 'アドボカシー ＝「アドの声（こえ）を代わりに出す」→ 権利擁護・代弁', 'ICF ＝「生活機能」で考える。マイナス面だけでなくプラス面も見る。'] },
  ],
  'shakai-no-rikai': [
    { title: '高頻出ポイント', icon: Target, color: 'text-amber-400', isFree: true, items: ['介護保険創設：2000年（平成12年）。保険者は市町村・特別区。', '第1号被保険者（65歳以上）：原因問わず給付。第2号（40〜64歳）：特定疾病のみ。', '費用負担：原則1割。財源は保険料50%＋公費50%（国25%・都道府県12.5%・市町村12.5%）。', '地域包括支援センター：市町村設置。総合相談・権利擁護・予防ケアマネが柱。'] },
    { title: '試験の引っかけパターン', icon: Brain, color: 'text-red-400', isFree: true, items: ['「保険者は都道府県」→ × 正しくは市町村', '第2号被保険者の給付条件を「65歳以上と同じ」と思うミス→ × 特定疾病のみ', '「施設サービスは在宅復帰を目的としない」→ × 老健は在宅復帰が目的'] },
    { title: '年号・数字の覚え方', icon: Lightbulb, color: 'text-yellow-400', isFree: false, items: ['介護保険スタート：2000年 ＝「ゼロゼロ（00）スタート」', '障害者総合支援法：2013年（2006年の自立支援法を改称）', '費用負担の割合：国>都道府県>市町村（25:12.5:12.5）の順番で覚える', '要介護1〜5：数字が大きいほど重度（要介護5が最重度）'] },
    { title: '出題パターン別攻略', icon: Clock, color: 'text-green-400', isFree: false, items: ['「〜の保険者は？」→ ほぼ必ず市町村（特養は都道府県が指定権者）', '「サービスの種類を選べ」→ 居宅・施設・地域密着の3分類で整理する', '事例問題：利用者の状態から「要介護度がいくつか」を推測する練習をする'] },
  ],
  'ninchisho-no-rikai': [
    { title: '高頻出ポイント', icon: Target, color: 'text-amber-400', isFree: true, items: ['レビー小体型認知症 ＝「リアルな幻視」＋「パーキンソン症状」。抗精神病薬に過敏。', '前頭側頭型 ＝「人格変化」「常同行動」「脱抑制」が先行。記憶障害は後から。', 'アルツハイマー型 ＝「近時記憶障害から始まる」「ゆっくり進行」。最多（約60〜70%）。', 'BPSDは「適切なケアで軽減できる」→ これが試験の正解になりやすい。'] },
    { title: '4種類の認知症の違い', icon: Brain, color: 'text-purple-400', isFree: true, items: ['アルツハイマー：近時記憶↓・ゆっくり進行', '血管性：まだら認知症・段階的悪化・感情失禁', 'レビー小体：幻視・パーキンソン症状・薬剤過敏', '前頭側頭型：人格変化・脱抑制・常同行動'] },
    { title: 'ケア実践の攻略', icon: Lightbulb, color: 'text-yellow-400', isFree: false, items: ['盗られ妄想→「一緒に探す」「否定しない」が正解。', '徘徊→「なぜ歩くのか目的を理解する」「GPS活用」「安全な環境」。施錠するだけは不十分。', 'ユマニチュード ＝「見る・話す・触れる・立つ」の4柱。試験での出題頻度が増加中。'] },
    { title: '施策・法制度', icon: Clock, color: 'text-green-400', isFree: false, items: ['認知症施策推進大綱（2019）：「共生」と「予防」が2本柱。', '認知症サポーター：地域で認知症の人を支援するボランティア。オレンジリング着用。', '若年性認知症：65歳未満で発症。就労継続支援や障害者手帳なども活用できる。'] },
  ],
};

const DEFAULT_HACKS: ExamHack[] = [
  { title: '高頻出ポイント', icon: Target, color: 'text-amber-400', isFree: true, items: ['過去問を中心に学習する。テキストより過去問が効率的。', '用語の定義を正確に覚える。似た用語の違いを意識する。', 'キーワードと選択肢のパターンをセットで記憶する。'] },
  { title: '試験の引っかけパターン', icon: Brain, color: 'text-red-400', isFree: true, items: ['「最も適切なもの」を選ぶ問題：消去法が有効。明らかに違うものから除外。', '「適切でないもの」を選ぶ問題：問題文の「でないもの」を見落とさない。', '似た用語の混同に注意：数字・年号・固有名詞は正確に。'] },
  { title: '勉強戦略', icon: Clock, color: 'text-green-400', isFree: false, items: ['過去問3年分を繰り返し解く。1問ずつ解説を読む。', '間違えた問題は「なぜ間違えたか」を分析する。', '直前期は弱点科目に集中する（合格には全科目最低1点が必要）。'] },
  { title: '語呂合わせ・記憶術', icon: Lightbulb, color: 'text-yellow-400', isFree: false, items: ['数字の覚え方：年号は「何年に何が変わったか」の変化点で覚える。', '法律名：「〜支援法」「〜促進法」など末尾のパターンに注目。', '図や表で整理：比較表を自分で書くと記憶に残りやすい。'] },
];

interface ExamHacksTabProps {
  subjectSlug: string;
  isPaid: boolean;
  onUpgrade?: () => void;
}

export default function ExamHacksTab({ subjectSlug, isPaid, onUpgrade }: ExamHacksTabProps) {
  const [openSection, setOpenSection] = useState<string | null>('高頻出ポイント');
  const { t } = useLang();

  const hacks = EXAM_HACKS[subjectSlug] ?? DEFAULT_HACKS;
  const freeHacks = hacks.filter((h) => h.isFree);
  const paidHacks = hacks.filter((h) => !h.isFree);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Zap size={18} className="text-metallic-gold" />
        <h3 className="font-semibold text-white">{t.examHacksTitle}</h3>
        <span className="text-xs text-gray-500 ml-auto">{t.examSections(hacks.length)}</span>
      </div>

      {freeHacks.map((hack) => {
        const Icon = hack.icon;
        const isOpen = openSection === hack.title;
        return (
          <div key={hack.title} className="border border-white/8 rounded-2xl overflow-hidden bg-white/2">
            <button
              onClick={() => setOpenSection(isOpen ? null : hack.title)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Icon size={16} className={hack.color} />
                <span className="font-semibold text-white text-sm">{hack.title}</span>
              </div>
              <ChevronDown size={15} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div key="open" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                  <ul className="px-5 pb-5 pt-1 border-t border-white/8 space-y-2.5">
                    {hack.items.map((item, i) => (
                      <li key={i} className="flex gap-2 text-xs text-gray-300 leading-relaxed">
                        <span className="text-metallic-gold font-bold mt-0.5">→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {paidHacks.length > 0 && (
        isPaid ? (
          paidHacks.map((hack) => {
            const Icon = hack.icon;
            const isOpen = openSection === hack.title;
            return (
              <div key={hack.title} className="border border-white/8 rounded-2xl overflow-hidden bg-white/2">
                <button
                  onClick={() => setOpenSection(isOpen ? null : hack.title)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} className={hack.color} />
                    <span className="font-semibold text-white text-sm">{hack.title}</span>
                  </div>
                  <ChevronDown size={15} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div key="open" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                      <ul className="px-5 pb-5 pt-1 border-t border-white/8 space-y-2.5">
                        {hack.items.map((item, i) => (
                          <li key={i} className="flex gap-2 text-xs text-gray-300 leading-relaxed">
                            <span className="text-metallic-gold font-bold mt-0.5">→</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        ) : (
          <>
            <div className="border border-white/5 rounded-2xl p-4 bg-white/1 opacity-40">
              <div className="flex items-center gap-3">
                <Lock size={15} className="text-gray-600" />
                <span className="text-sm text-gray-600">{t.examStudyStrategy}</span>
              </div>
            </div>
            <PaywallBanner onUpgrade={onUpgrade} message={t.examLockedMsg(paidHacks.length)} />
          </>
        )
      )}
    </div>
  );
}
