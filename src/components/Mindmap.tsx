import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { motion } from 'motion/react';
import { Map, ZoomIn, ZoomOut, Maximize2, RefreshCw } from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

interface MindmapData {
  id: string;
  title: string;
  definition: string;
}

const MINDMAPS: MindmapData[] = [
  {
    id: 'principles',
    title: '介護の基本原則',
    definition: `
      mindmap
        root((介護の基本原則))
          人間の尊厳
            尊敬
            プライバシー
          自立支援
            セルフケア
            ADL支援
          自己決定
            選択
            説明と同意
          生活の質 (QOL)
            幸福感
            満足度
    `
  },
  {
    id: 'social-security',
    title: '社会保障制度',
    definition: `
      mindmap
        root((社会保障制度))
          社会保険
            医療保険
            年金保険
            介護保険
          公的扶助
            生活扶助
            住宅扶助
            医療扶助
          社会福祉
            高齢者福祉
            障害者福祉
            児童福祉
          公衆衛生
            環境衛生
            疾病予防
    `
  },
  {
    id: 'communication',
    title: 'コミュニケーションの基本',
    definition: `
      mindmap
        root((コミュニケーション))
          言語的
            言葉
            文字
          非言語的
            表情
            身振り手振り
            姿勢
          技法
            開かれた質問
            閉じられた質問
            傾聴
            共感
          バイステックの7原則
            個別化
            自己決定
            非審判的態度
            秘密保持
    `
  },
  {
    id: 'impairment-comm',
    title: '障害別コミュニケーション',
    definition: `
      mindmap
        root((障害別対応))
          認知症
            バリデーション
            回想法
          聴覚障害
            筆談
            手話
            補聴器
          視覚障害
            点字
            言葉による説明
          言語障害
            失語症
            構音障害
    `
  },
  {
    id: 'care-tech',
    title: '生活支援技術',
    definition: `
      mindmap
        root((生活支援技術))
          ボディメカニクス
            支持基底面積
            重心
            てこの原理
            摩擦の軽減
          食事介助
            嚥下
            咀嚼
            誤嚥
            とろみ
          排泄介助
            ポータブルトイレ
            失禁
            陰部洗浄
          清潔保持
            機械浴
            清拭
            褥瘡
          着脱介助
            脱健着患
            麻痺
    `
  },
  {
    id: 'aging-body',
    title: '老化と身体機能',
    definition: `
      mindmap
        root((老化と身体))
          バイタルサイン
            血圧
            体温
            呼吸
            脈拍
          老化
            結晶性知能
            流動性知能
            予備能力の低下
          廃用症候群
            筋萎縮
            拘縮
            起立性低血圧
          終末期
            ターミナル期
            死の三徴候
            グリーフケア
          一般的症状
            脱水
            浮腫
            不眠
    `
  },
  {
    id: 'dev-aging',
    title: '発達と老化の理解',
    definition: `
      mindmap
        root((発達と老化))
          発達の基礎
            発達課題
            アイデンティティ
            ライフサイクル
            発達勾配
          加齢に伴う変化
            予備能力の低下
            適応能力の低下
            恒常性の低下
          知能
            結晶性知能 (維持)
            流動性知能 (低下)
          記憶
            短期記憶 (低下)
            長期記憶 (維持)
          精神的健康
            老年期うつ
            せん妄
    `
  },
  {
    id: 'dementia',
    title: '認知症の理解',
    definition: `
      mindmap
        root((認知症の理解))
          中核症状
            記憶障害
            見当識障害
            実行機能障害
            失認
            失行
          行動・心理症状 (BPSD)
            徘徊
            幻視
            妄想
            アパシー
          認知症の種類
            アルツハイマー型
            脳血管性
            レビー小体型
            前頭側頭型
          ケア技法
            パーソン・センタード
            バリデーション
            回想法
            ユマニチュード
    `
  },
  {
    id: 'disabilities',
    title: '障害の理解',
    definition: `
      mindmap
        root((障害の理解))
          ICF
            環境因子
            個人因子
            心身機能
            活動
            参加
          身体障害
            視覚障害
            聴覚・言語障害
            肢体不自由
            内部障害
            高次脳機能障害
          発達障害
            知的障害
            精神障害
            自閉症スペクトラム
            ADHD
          支援
            合理的配慮
            欠格条項
    `
  },
  {
    id: 'medical-care',
    title: '医療的ケア',
    definition: `
      mindmap
        root((医療的ケア))
          法律と制度
            医行為
            介護職員の特例
            医師の指示書
            同意書
            連携
          たんの吸引
            口腔内
            鼻腔内
            気管カニューレ内部
            カテーテル
            粘膜損傷 (リスク)
          経管栄養
            胃ろう
            鼻腔経管
            栄養剤
            注入
            逆流 (リスク)
    `
  },
  {
    id: 'care-process',
    title: '介護過程',
    definition: `
      mindmap
        root((介護過程))
          アセスメント
            客観的情報
            主観的情報
            生活課題
            ニーズ
          計画立案
            介護計画
            長期目標
            短期目標
            優先順位
          実施
            実施
            記録
            標準化
          評価
            モニタリング
            フィードバック
            再アセスメント
    `
  },
  {
    id: 'social-support',
    title: '社会支援と生活環境',
    definition: `
      mindmap
        root((社会支援))
          生活環境
            サ高住
            グループホーム
            バリアフリー
            手すり
            段差解消
          多職種連携
            サービス担当者会議
            MSW
            訪問看護
            主治医
          地域福祉
            民生委員
            社会福祉協議会
            見守り
          心理状態
            意欲の低下
            見当識
            孤立
            喪失感
          ケースワーク
            インテーク
            スクリーニング
            インフォーマル
            フォーマル
    `
  }
];

export default function Mindmap() {
  const [selectedId, setSelectedId] = useState(MINDMAPS[0].id);
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'dark',
      fontFamily: '"Hiragino Kaku Gothic ProN", "Hiragino Kaku Gothic Pro", "Yu Gothic", "Meiryo", "Inter", sans-serif',
      themeVariables: {
        primaryColor: '#0A0A0A',
        primaryTextColor: '#FFFFFF',
        primaryBorderColor: '#D4AF37',
        lineColor: '#D4AF37',
        secondaryColor: '#0A0A0A',
        tertiaryColor: '#0A0A0A',
        fontSize: '18px',
      },
      securityLevel: 'loose',
    });
  }, []);

  useEffect(() => {
    const renderMermaid = async () => {
      if (mermaidRef.current) {
        mermaidRef.current.innerHTML = '';
        const currentMap = MINDMAPS.find(m => m.id === selectedId);
        if (currentMap) {
          try {
            const { svg } = await mermaid.render(`mermaid-svg-${selectedId}`, currentMap.definition);
            mermaidRef.current.innerHTML = svg;
          } catch (error) {
            console.error('Mermaid rendering failed:', error);
          }
        }
      }
    };
    renderMermaid();
  }, [selectedId]);

  return (
    <section id="mindmap" className="py-24 bg-matte-black border-t border-metallic-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Map className="text-metallic-gold" size={24} />
            <span className="text-xs font-bold uppercase tracking-widest text-metallic-gold/60">Module 03</span>
          </div>
          <h2 className="text-4xl font-bold mb-4">Visual <span className="gold-gradient">Mindmaps</span></h2>
          <p className="text-gray-400">Visualize complex caregiving concepts and their relationships for better retention.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0">
            {MINDMAPS.map((map) => (
              <button
                key={map.id}
                onClick={() => setSelectedId(map.id)}
                className={`whitespace-nowrap px-6 py-4 rounded-xl text-sm font-bold transition-all text-left border ${
                  selectedId === map.id
                  ? 'bg-metallic-gold text-matte-black border-metallic-gold shadow-lg shadow-metallic-gold/20'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                }`}
              >
                {map.title}
              </button>
            ))}
          </div>

          {/* Mindmap Canvas */}
          <div className="flex-1 bg-white/5 border border-metallic-gold/10 rounded-3xl p-4 sm:p-8 relative min-h-[500px] sm:min-h-[600px] flex flex-col items-center justify-center overflow-hidden">
            <TransformWrapper
              initialScale={1}
              initialPositionX={0}
              initialPositionY={0}
              centerOnInit={true}
              minScale={0.5}
              maxScale={4}
            >
              {({ zoomIn, zoomOut, resetTransform }) => (
                <>
                  <div className="absolute top-6 right-6 flex gap-2 z-20">
                    <button 
                      onClick={() => zoomIn()}
                      className="p-2 rounded-lg bg-black/40 border border-white/10 text-gray-400 hover:text-metallic-gold transition-colors gold-glow-hover"
                      title="Zoom In"
                    >
                      <ZoomIn size={18} />
                    </button>
                    <button 
                      onClick={() => zoomOut()}
                      className="p-2 rounded-lg bg-black/40 border border-white/10 text-gray-400 hover:text-metallic-gold transition-colors gold-glow-hover"
                      title="Zoom Out"
                    >
                      <ZoomOut size={18} />
                    </button>
                    <button 
                      onClick={() => resetTransform()}
                      className="p-2 rounded-lg bg-black/40 border border-white/10 text-gray-400 hover:text-metallic-gold transition-colors gold-glow-hover"
                      title="Reset"
                    >
                      <RefreshCw size={18} />
                    </button>
                  </div>

                  <div className="w-full h-full cursor-grab active:cursor-grabbing">
                    <TransformComponent
                      wrapperStyle={{
                        width: "100%",
                        height: "100%",
                      }}
                      contentStyle={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <motion.div
                        key={selectedId}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        ref={mermaidRef}
                        className="w-full h-full flex items-center justify-center mermaid-container p-4"
                      />
                    </TransformComponent>
                  </div>
                  
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 font-bold uppercase tracking-widest pointer-events-none bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
                    Pinch to zoom • Drag to pan
                  </div>
                </>
              )}
            </TransformWrapper>
          </div>
        </div>
      </div>

      <style>{`
        .mermaid-container svg {
          max-width: 100%;
          height: auto;
        }
        .mermaid-container .node rect,
        .mermaid-container .node circle,
        .mermaid-container .node ellipse,
        .mermaid-container .node polygon,
        .mermaid-container .node path {
          fill: #0A0A0A !important;
          stroke: #D4AF37 !important;
          stroke-width: 2px !important;
        }
        .mermaid-container .node .label {
          color: #FFFFFF !important;
          font-weight: 800 !important;
          font-family: "Hiragino Kaku Gothic ProN", "Hiragino Kaku Gothic Pro", "Yu Gothic", "Meiryo", sans-serif !important;
          font-size: 16px !important;
        }
        .mermaid-container .edgePath .path {
          stroke: #D4AF37 !important;
          stroke-width: 2.5px !important;
          opacity: 0.8;
        }
        /* Root Node Styling */
        .mermaid-container .mindmap-node.root rect,
        .mermaid-container .mindmap-node.root circle {
          fill: #1A1A1A !important;
          stroke: #D4AF37 !important;
          stroke-width: 4px !important;
          filter: drop-shadow(0 0 12px rgba(212, 175, 55, 0.5));
        }
        .mermaid-container .mindmap-node.root .label {
          color: #FFFFFF !important;
          font-size: 22px !important;
          font-weight: 900 !important;
        }
      `}</style>
    </section>
  );
}
