import { useState } from 'react';
import type { ComponentType } from 'react';
import { ChevronDown, Target, Brain, Clock, Lightbulb, Zap } from 'lucide-react';
import { useLang } from '../../context/LanguageContext';

interface ExamHack {
  title: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  items: string[];
  isFree: boolean;
}

const EXAM_HACKS: Record<string, ExamHack[]> = {
  'ningen-no-songen': [
    { title: '高頻出ポイント', icon: Target, isFree: true, items: ['「利用者中心」が絶対の正解：迷ったら利用者の気持ちを優先する選択肢を選べ。', 'ノーマライゼーション ＝ 障害があっても普通の生活。', '憲法25条 ＝ 生存権（健康で文化的な最低限度の生活）。', 'QOL ＝ 生活の「量」ではなく「質」。'] },
    { title: '試験の引っかけパターン', icon: Brain, isFree: true, items: ['「危ないからやらせない」「介護者が全部決める」→ すべて×（バツ）', '「自立」の意味を「一人で全部できること」と混同するミス。介護での自立は「自分で選ぶこと」。', 'リハビリテーション ≠ 機能回復だけ。社会復帰・QOL向上も含む。'] },
    { title: '勉強戦略', icon: Clock, isFree: false, items: ['この科目は2問のみ。難しい法律を覚えるより基本用語だけ押さえて次に進め。', '過去3年分の問題（約6問）を解いて傾向を把握するだけで十分。', 'テキストを読むより過去問を解く時間を優先する。'] },
    { title: '語呂合わせ・記憶術', icon: Lightbulb, isFree: false, items: ['憲法25条 ＝「ニコ（25）ニコ生きる生存権」', 'アドボカシー ＝「アドの声（こえ）を代わりに出す」→ 権利擁護・代弁', 'ICF ＝「生活機能」で考える。マイナス面だけでなくプラス面も見る。'] },
  ],
  'shakai-no-rikai': [
    { title: '高頻出ポイント', icon: Target, isFree: true, items: ['介護保険創設：2000年（平成12年）。保険者は市町村・特別区。', '第1号被保険者（65歳以上）：原因問わず給付。第2号（40〜64歳）：特定疾病のみ。', '費用負担：原則1割。財源は保険料50%＋公費50%。', '地域包括支援センター：市町村設置。'] },
    { title: '試験の引っかけパターン', icon: Brain, isFree: true, items: ['「保険者は都道府県」→ × 正しくは市町村', '第2号被保険者の給付条件を「65歳以上と同じ」と思うミス→ × 特定疾病のみ', '「施設サービスは在宅復帰を目的としない」→ × 老健は在宅復帰が目的'] },
    { title: '年号・数字の覚え方', icon: Lightbulb, isFree: false, items: ['介護保険スタート：2000年 ＝「ゼロゼロ（00）スタート」', '障害者総合支援法：2013年（2006年の自立支援法を改称）', '費用負担の割合：国>都道府県>市町村（25:12.5:12.5）'] },
    { title: '出題パターン別攻略', icon: Clock, isFree: false, items: ['「〜の保険者は？」→ ほぼ必ず市町村', '「サービスの種類を選べ」→ 居宅・施設・地域密着の3分類で整理する', '事例問題：利用者の状態から「要介護度がいくつか」を推測する練習をする'] },
  ],
  'ninchisho-no-rikai': [
    { title: '高頻出ポイント', icon: Target, isFree: true, items: ['レビー小体型 ＝「リアルな幻視」＋「パーキンソン症状」。抗精神病薬に過敏。', '前頭側頭型 ＝「人格変化」「常同行動」「脱抑制」が先行。', 'アルツハイマー型 ＝「近時記憶障害から始まる」「ゆっくり進行」。最多（約60〜70%）。', 'BPSDは「適切なケアで軽減できる」→ これが試験の正解になりやすい。'] },
    { title: '4種類の認知症の違い', icon: Brain, isFree: true, items: ['アルツハイマー：近時記憶↓・ゆっくり進行', '血管性：まだら認知症・段階的悪化・感情失禁', 'レビー小体：幻視・パーキンソン症状・薬剤過敏', '前頭側頭型：人格変化・脱抑制・常同行動'] },
    { title: 'ケア実践の攻略', icon: Lightbulb, isFree: false, items: ['盗られ妄想→「一緒に探す」「否定しない」が正解。', '徘徊→「なぜ歩くのか目的を理解する」「安全な環境」。施錠するだけは不十分。', 'ユマニチュード ＝「見る・話す・触れる・立つ」の4柱。'] },
    { title: '施策・法制度', icon: Clock, isFree: false, items: ['認知症施策推進大綱（2019）：「共生」と「予防」が2本柱。', '認知症サポーター：地域で認知症の人を支援するボランティア。オレンジリング着用。', '若年性認知症：65歳未満で発症。就労継続支援や障害者手帳なども活用できる。'] },
  ],
};

const DEFAULT_HACKS: ExamHack[] = [
  { title: '高頻出ポイント', icon: Target, isFree: true, items: ['過去問を中心に学習する。テキストより過去問が効率的。', '用語の定義を正確に覚える。似た用語の違いを意識する。', 'キーワードと選択肢のパターンをセットで記憶する。'] },
  { title: '試験の引っかけパターン', icon: Brain, isFree: true, items: ['「最も適切なもの」を選ぶ問題：消去法が有効。明らかに違うものから除外。', '「適切でないもの」を選ぶ問題：問題文の「でないもの」を見落とさない。', '似た用語の混同に注意：数字・年号・固有名詞は正確に。'] },
  { title: '勉強戦略', icon: Clock, isFree: false, items: ['過去問3年分を繰り返し解く。1問ずつ解説を読む。', '間違えた問題は「なぜ間違えたか」を分析する。', '直前期は弱点科目に集中する（合格には全科目最低1点が必要）。'] },
  { title: '語呂合わせ・記憶術', icon: Lightbulb, isFree: false, items: ['数字の覚え方：年号は「何年に何が変わったか」の変化点で覚える。', '法律名：「〜支援法」「〜促進法」など末尾のパターンに注目。', '図や表で整理：比較表を自分で書くと記憶に残りやすい。'] },
];

interface ExamHacksTabProps {
  subjectSlug: string;
  isPaid: boolean;
  onUpgrade?: () => void;
}

export default function ExamHacksTab({ subjectSlug, isPaid, onUpgrade }: ExamHacksTabProps) {
  const [open, setOpen] = useState<string | null>('高頻出ポイント');
  const { t } = useLang();

  const hacks = EXAM_HACKS[subjectSlug] ?? DEFAULT_HACKS;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <Zap size={14} className="text-gray-400" />
        <p className="text-xs text-gray-400">{t.examSections(hacks.length)}</p>
      </div>

      {hacks.map((hack) => {
        const Icon = hack.icon;
        const isOpen = open === hack.title;
        return (
          <div key={hack.title} className="border border-gray-200 rounded overflow-hidden">
            <button
              onClick={() => setOpen(isOpen ? null : hack.title)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <Icon size={14} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-800">{hack.title}</span>
              </div>
              <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <ul className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50 space-y-2">
                {hack.items.map((item, i) => (
                  <li key={i} className="flex gap-2 text-xs text-gray-600 leading-relaxed">
                    <span className="text-blue-500 font-bold mt-0.5 shrink-0">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
