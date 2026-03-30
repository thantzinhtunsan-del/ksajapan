import { useState, useCallback } from "react";

// ─── Question Data ───────────────────────────────────────────────
interface Question {
  id: string;
  year: string;
  label: string;
  category: string;
  q: string;
  choices: string[];
  answer: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  // ===== 第37回（令和6年度）=====
  {
    id: "37-59", year: "第37回", label: "問題59",
    category: "救急蘇生法",
    q: "次の記述のうち、成人に対する救急蘇生法での胸骨圧迫の方法として、最も適切なものを1つ選びなさい。",
    choices: [
      "呼吸が確認できない場合は、すぐに圧迫を始める。",
      "圧迫する部位は、胸骨の左側である。",
      "実施者の両手を重ねて、指先で圧迫する。",
      "圧迫の深さは、胸が10cm沈むようにする。",
      "1分間に60回を目安に圧迫する。"
    ],
    answer: 0,
    explanation: "呼吸が確認できない場合は、直ちに胸骨圧迫を開始する。圧迫部位は胸骨の下半分、手のひらの付け根で圧迫し、深さは約5cm、1分間に100〜120回のテンポで行う。"
  },
  {
    id: "37-60", year: "第37回", label: "問題60",
    category: "喀痰吸引",
    q: "次の記述のうち、痰を喀出する仕組みに関するものとして、正しいものを1つ選びなさい。",
    choices: [
      "呼吸器官の内部は乾燥した状態になっている。",
      "気管の内部の表面には絨毛があり、分泌物の侵入を防いでいる。",
      "分泌物は、肺胞で吸収される。",
      "痰は、咳や咳払いによって排出される。",
      "咳は、下垂体にある咳中枢によっておこる反射運動である。"
    ],
    answer: 3,
    explanation: "痰は咳や咳払いによって排出される。呼吸器官の内部は湿った状態であり、気管内部の繊毛（せんもう）運動によって痰を口腔の方へ移動させている。咳中枢は延髄にある。"
  },
  {
    id: "37-61", year: "第37回", label: "問題61",
    category: "喀痰吸引",
    q: "次の記述のうち、介護福祉士が行う口腔内の喀痰吸引の方法として、最も適切なものを1つ選びなさい。",
    choices: [
      "吸引圧は、利用者の体調によって介護福祉士が決める。",
      "吸引圧をかけた状態で、吸引チューブを挿入する。",
      "口蓋垂まで吸引チューブを挿入する。",
      "吸引チューブを回転させながら痰を吸引する。",
      "吸引後は洗浄水を吸引し、清浄綿でチューブを拭く。"
    ],
    answer: 3,
    explanation: "吸引チューブを回転させると、吸引圧が一カ所に集中することによる粘膜への吸着を防ぐことができる。吸引後は清浄綿でチューブを拭いてから洗浄水を吸引する。口蓋垂は刺激すると嘔吐反応が起きるため触れない。"
  },
  {
    id: "37-62", year: "第37回", label: "問題62",
    category: "経管栄養",
    q: "次の記述のうち、消化器症状の説明として、正しいものを1つ選びなさい。",
    choices: [
      "腹部膨満感は、胃が張る感覚のことである。",
      "しゃっくり（吃逆）は、胸膜の刺激で起こる現象である。",
      "胸やけは、飲食物による食道の熱傷のことである。",
      "げっぷ（曖気）は、咽頭にたまった空気が排出されることである。",
      "嘔気は、胃や腸の内容物が、食道を逆流して口外に吐き出されることである。"
    ],
    answer: 0,
    explanation: "腹部膨満感は腹部が張る感覚のことで、胃の運動機能の低下や消化管内のガスの貯留などで起こる。しゃっくりは横隔膜の刺激で起こる。嘔気は吐き出したいという不快感であり、実際に吐き出されるのは嘔吐である。"
  },
  {
    id: "37-63", year: "第37回", label: "問題63",
    category: "経管栄養",
    q: "Aさん（68歳、女性）は、脳梗塞の後遺症で左片麻痺があり、経鼻経管栄養による栄養摂取をしている。経管栄養中に介護福祉士が訪室すると、チューブを触りながら「このチューブを抜いてほしい」と訴えがあった。このときの介護福祉士の対応として、最も適切なものを1つ選びなさい。",
    choices: [
      "チューブを抜かないようにAさんの右手を固定する。",
      "経管栄養が早く終わるように滴下速度を調節する。",
      "医師や看護師にAさんの思いを伝える。",
      "Aさんに胃ろうの造設を提案する。",
      "Aさんに経口摂取を提案する。"
    ],
    answer: 2,
    explanation: "医療職（医師や看護師）にAさんの思いを伝えることが介護福祉士の対応として最も適切。手の固定は身体拘束、滴下速度の変更は医療職の判断事項、胃ろう造設や経口摂取の提案は医師が行うものである。"
  },

  // ===== 第36回（令和5年度）=====
  {
    id: "36-59", year: "第36回", label: "問題59",
    category: "制度・法律",
    q: "喀痰吸引等を実施する訪問介護事業所の登録に関する次の記述のうち、正しいものを1つ選びなさい。",
    choices: [
      "登録研修機関として登録する。",
      "医師が安全委員会を設置する。",
      "喀痰吸引等計画書は、介護支援専門員が作成する。",
      "介護支援専門員が事業所に対して指示を行う。",
      "介護福祉士が業務を行うために、事業所が都道府県に登録する。"
    ],
    answer: 4,
    explanation: "喀痰吸引等を実施する訪問介護事業所は、都道府県に登録する必要がある。安全委員会は施設の管理者が委員長となり設置し、喀痰吸引等計画書は医師の指示のもとに看護職員または介護職員が作成する。"
  },
  {
    id: "36-60", year: "第36回", label: "問題60",
    category: "呼吸器",
    q: "呼吸器官についての次の記述のうち、正しいものを1つ選びなさい。",
    choices: [
      "肺は左右ともに3つの肺葉に分かれている。",
      "咽頭は上咽頭、中咽頭の2つに分かれている。",
      "食べ物は口腔から中咽頭に送られ食道から胃に入る。",
      "息を吸うと空気は鼻腔・口腔から気管を通って肺に入る。",
      "肺や心臓は腹腔におさまっている。"
    ],
    answer: 3,
    explanation: "息を吸うと空気は鼻腔と口腔から中咽頭、喉頭を通って気管から肺に入る。右肺は3葉、左肺は2葉。咽頭は上咽頭・中咽頭・下咽頭の3つに分かれる。肺や心臓は胸腔におさまっている。"
  },
  {
    id: "36-61", year: "第36回", label: "問題61",
    category: "喀痰吸引",
    q: "喀痰吸引の準備に関する次の記述のうち、最も適切なものを1つ選びなさい。",
    choices: [
      "吸引器が陰圧になっていることの確認は不要である。",
      "吸引びんの再使用時は中身を空にして消毒する。",
      "吸引チューブのサイズは担当者の判断で選択する。",
      "洗浄水には薬液を用いる。",
      "清浄綿には次亜塩素酸ナトリウムを用いる。"
    ],
    answer: 1,
    explanation: "吸引びんを再使用する場合には中身を空にして消毒する必要がある。吸引器の陰圧確認は必ず行う。チューブサイズは医師の指示に基づく。洗浄水は精製水または水道水を用い、薬液は用いない。"
  },
  {
    id: "36-62", year: "第36回", label: "問題62",
    category: "経管栄養",
    q: "経管栄養で起こるトラブルに関する記述として、最も適切なものを1つ選びなさい。",
    choices: [
      "チューブの誤挿入は、下痢を起こす可能性がある。",
      "注入速度が速いときは、嘔吐を起こす可能性がある。",
      "注入物の温度の調整不良は、脱水を起こす可能性がある。",
      "注入物の濃度の間違いは、感染を起こす可能性がある。",
      "注入中の姿勢の不良は、便秘を起こす可能性がある。"
    ],
    answer: 1,
    explanation: "注入速度が速すぎると嘔吐や下痢を引き起こす可能性がある。低温の栄養剤は腹痛や下痢、高濃度の栄養剤は下痢、姿勢不良は逆流を起こす可能性がある。"
  },
  {
    id: "36-63", year: "第36回", label: "問題63",
    category: "経管栄養",
    q: "Eさん（75歳、女性）は胃ろうによる経管栄養を行っている。半分程度注入したところで「少しお腹が張ってきたような気がする」と答えた。意識レベルや顔色に変化はなく、腹痛や嘔気はない。介護福祉士が看護職員に相談する前に行う対応として、最も適切なものを1つ選びなさい。",
    choices: [
      "嘔吐していないので、そのまま様子をみる。",
      "仰臥位（背臥位）にする。",
      "腹部が圧迫されていないかを確認する。",
      "注入速度を速める。",
      "栄養剤の注入を終了する。"
    ],
    answer: 2,
    explanation: "まず腹部の圧迫を確認し、栄養剤の注入速度は医師の指示通りか、姿勢が曲がっていないか、ベッドが適切に挙上されているかなどを確認する。異常があれば直ちに医療職に連絡する。"
  },

  // ===== 第35回（令和4年度）=====
  {
    id: "35-59", year: "第35回", label: "問題59",
    category: "消毒・滅菌",
    q: "消毒と滅菌に関する次の記述のうち、正しいものを1つ選びなさい。",
    choices: [
      "消毒は、すべての微生物を死滅させることである。",
      "複数の消毒液を混ぜると効果的である。",
      "滅菌物には、有効期限がある。",
      "家庭では、熱水で滅菌する。",
      "手指消毒は、次亜塩素酸ナトリウムを用いる。"
    ],
    answer: 2,
    explanation: "滅菌物には有効期限があり、期限を過ぎたものは使用してはならない。消毒はすべてではなく特定の微生物を死滅させること。消毒液を混ぜてはならない。家庭では滅菌は困難。手指消毒にはアルコール等を用いる。"
  },
  {
    id: "35-60", year: "第35回", label: "問題60",
    category: "呼吸器",
    q: "次の記述のうち、成人の正常な呼吸状態として、最も適切なものを1つ選びなさい。",
    choices: [
      "胸腹部が一定のリズムで膨らんだり縮んだりしている。",
      "ゴロゴロとした音がする。",
      "爪の色が紫色になっている。",
      "呼吸数が1分間に40回である。",
      "下顎を上下させて呼吸している。"
    ],
    answer: 0,
    explanation: "正常な呼吸は胸腹部が一定のリズムで膨らんだり縮んだりしている状態。ゴロゴロ音は痰の貯留、爪の紫色はチアノーゼ、40回/分は頻呼吸、下顎呼吸は死期が近い兆候である。"
  },
  {
    id: "35-61", year: "第35回", label: "問題61",
    category: "喀痰吸引",
    q: "喀痰吸引を行う前の準備に関する次の記述のうち、最も適切なものを1つ選びなさい。",
    choices: [
      "医師の指示書の確認は、初回に一度行う。",
      "利用者への吸引の説明は、吸引のたびに行う。",
      "腹臥位の姿勢にする。",
      "同室の利用者から見える状態にする。",
      "利用者に手指消毒をしてもらう。"
    ],
    answer: 1,
    explanation: "利用者への吸引の説明は、吸引のたびに行う必要がある。医師の指示書は毎回確認する。吸引は仰臥位等で行い、同室の利用者から見えない状態で行うなど配慮が必要。利用者の手指消毒までは必要ない。"
  },
  {
    id: "35-62", year: "第35回", label: "問題62",
    category: "経管栄養",
    q: "胃ろうによる経管栄養での生活上の留意点の説明として、最も適切なものを1つ選びなさい。",
    choices: [
      "日中は、ベッド上で過ごします",
      "夜寝るときは、上半身を起こした姿勢で寝ます",
      "便秘の心配はなくなります",
      "口から食べなくても口腔ケアは必要です",
      "入浴は清拭に変更します"
    ],
    answer: 3,
    explanation: "胃ろうを造設しても口腔ケアは必要。口から食事をとらないと唾液分泌が減少し、口腔内が不衛生になりやすく誤嚥性肺炎のリスクもある。入浴も可能で、日中もベッド上で過ごす必要はない。"
  },
  {
    id: "35-63", year: "第35回", label: "問題63",
    category: "経管栄養",
    q: "Fさん（87歳、女性）は胃ろうによる経管栄養を行っている。経管栄養開始後15分で嘔吐し、意識はあるが苦しそうな表情。介護福祉士は経管栄養を中止して看護職員を呼んだ。看護職員が来るまでの対応として、最も優先すべきものを1つ選びなさい。",
    choices: [
      "室内の換気をした。",
      "ベッド上の嘔吐物を片付けた。",
      "酸素吸入を行った。",
      "心臓マッサージを行った。",
      "誤嚥を防ぐために顔を横に向けた。"
    ],
    answer: 4,
    explanation: "嘔吐している場合、誤嚥を防ぐために顔を横に向けることが最優先。嘔吐物があるため酸素吸入や心臓マッサージは行ってはならない。換気や片付けは後で行うべきこと。"
  },

  // ===== 第34回（令和3年度）=====
  {
    id: "34-109", year: "第34回", label: "問題109",
    category: "経管栄養",
    q: "介護福祉職が経管栄養を実施するときに、注入量を指示する者として、適切なものを1つ選びなさい。",
    choices: [
      "医師",
      "看護師",
      "訪問看護事業所の管理者",
      "訪問介護事業所の管理者",
      "介護支援専門員（ケアマネジャー）"
    ],
    answer: 0,
    explanation: "経管栄養の注入量は医師の指示に従って行わなければならない。看護師やケアマネジャーなどが注入量を指示することはできない。"
  },
  {
    id: "34-110", year: "第34回", label: "問題110",
    category: "喀痰吸引",
    q: "気管粘膜のせん毛運動に関する次の記述のうち、最も適切なものを1つ選びなさい。",
    choices: [
      "痰の粘度が高いほうが動きがよい。",
      "空気中の異物をとらえる運動である。",
      "反射的に咳を誘発する。",
      "気管内部が乾燥しているほうが動きがよい。",
      "痰を口腔の方へ移動させる。"
    ],
    answer: 4,
    explanation: "せん毛は口腔の方へ向かって運動することで痰を移動させている。痰の粘度が高いと動きが悪くなる。異物を排除する運動であり、気管内部は加湿されているほうが動きがよい。"
  },
  {
    id: "34-111", year: "第34回", label: "問題111",
    category: "喀痰吸引",
    q: "介護福祉職が実施する喀痰吸引で、口腔内と気管カニューレ内部の吸引に関する次の記述のうち、最も適切なものを1つ選びなさい。",
    choices: [
      "気管カニューレ内部の吸引では、カニューレの内径の3分の2程度の太さの吸引チューブを使用する。",
      "気管カニューレ内部の吸引では、滅菌された洗浄水を使用する。",
      "気管カニューレ内部の吸引では、頸部を前屈した姿勢にして行う。",
      "吸引時間は、口腔内より気管カニューレ内部のほうを長くする。",
      "吸引圧は、口腔内より気管カニューレ内部のほうを高くする。"
    ],
    answer: 1,
    explanation: "気管カニューレ内部の吸引では滅菌された洗浄水を使用する。チューブは内径の2分の1以下の太さを使用。吸引時間・吸引圧は口腔内より気管カニューレ内部のほうを短く・低くする。"
  },
  {
    id: "34-112", year: "第34回", label: "問題112",
    category: "経管栄養",
    q: "Hさん（80歳、男性）は胃ろうを造設して自宅に退院した。経管栄養を始めてから下肢の筋力が低下している。「便が硬くて出にくい」との訴えがある。Hさんに対して介護福祉職が行う日常生活支援として、最も適切なものを1つ選びなさい。",
    choices: [
      "入浴時は、胃ろう部を湯につけないように注意する。",
      "排泄時は、胃ろう部を圧迫するように促す。",
      "排便はベッド上で行うように勧める。",
      "経管栄養を行っていないときの歩行運動を勧める。",
      "栄養剤の注入量を増やすように促す。"
    ],
    answer: 3,
    explanation: "下肢の筋力低下が見られるため、経管栄養を行っていないときの歩行運動を勧めることが適切。胃ろうがあっても入浴は可能で、注入量の変更は医師の指示が必要。"
  },
  {
    id: "34-113", year: "第34回", label: "問題113",
    category: "経管栄養",
    q: "経管栄養の実施に関する次の記述のうち、最も適切なものを1つ選びなさい。",
    choices: [
      "経管栄養の準備は、石鹸と流水で丁寧に手を洗ってから行う。",
      "栄養剤は、消費期限の新しいものから使用する。",
      "胃ろうや腸ろう周囲の皮膚は、注入開始前にアルコール消毒を行う。",
      "カテーテルチップシリンジは、1回使用したら廃棄する。",
      "口腔ケアは、数日に1回行う。"
    ],
    answer: 0,
    explanation: "経管栄養の準備は石鹸と流水で丁寧に手を洗ってから行う。栄養剤は消費期限の近いものから使用。胃ろう周囲はアルコール消毒不要。口腔ケアは1日に数回行う。"
  },

  // ===== 第33回（令和2年度）=====
  {
    id: "33-109", year: "第33回", label: "問題109",
    category: "経管栄養",
    q: "社会福祉士及び介護福祉士法で規定されている介護福祉士が実施できる経管栄養の行為として、正しいものを1つ選びなさい。",
    choices: [
      "栄養剤の種類の変更",
      "栄養剤の注入速度の決定",
      "経鼻経管栄養チューブの胃内への留置",
      "栄養剤の注入",
      "胃ろうカテーテルの定期交換"
    ],
    answer: 3,
    explanation: "介護福祉士が実施できるのは栄養剤の注入。栄養剤の種類変更、注入速度の決定、チューブの胃内への留置、カテーテルの定期交換はいずれも医療職が行う。"
  },
  {
    id: "33-110", year: "第33回", label: "問題110",
    category: "喀痰吸引",
    q: "気管カニューレ内部の喀痰吸引で、指示された吸引時間よりも長くなった場合、吸引後に注意すべき項目として、最も適切なものを1つ選びなさい。",
    choices: [
      "体温",
      "血糖値",
      "動脈血酸素飽和度",
      "痰の色",
      "唾液の量"
    ],
    answer: 2,
    explanation: "吸引時間が長くなると呼吸器を外している時間も長くなり、酸素不足の状態になる。パルスオキシメーターにより動脈血酸素飽和度の低下がないかを注意する。"
  },
  {
    id: "33-111", year: "第33回", label: "問題111",
    category: "呼吸器",
    q: "呼吸器官の換気とガス交換に関する次の記述のうち、最も適切なものを1つ選びなさい。",
    choices: [
      "換気とは、体外から二酸化炭素を取り込み、体外に酸素を排出する働きをいう。",
      "呼吸運動は、主として大胸筋によって行われる。",
      "1回に吸い込める空気の量は、年齢とともに増加する。",
      "ガス交換は、肺胞内の空気と血液の間で行われる。",
      "筋萎縮性側索硬化症（ALS）では、主にガス交換の働きが低下する。"
    ],
    answer: 3,
    explanation: "ガス交換は肺胞内の空気と血液の間で行われ、二酸化炭素と酸素が交換される。換気は酸素を取り込み二酸化炭素を排出すること。呼吸運動は横隔膜と外肋間筋。ALSでは換気が低下する。"
  },
  {
    id: "33-112", year: "第33回", label: "問題112",
    category: "経管栄養",
    q: "経管栄養で用いる半固形タイプの栄養剤の特徴に関する次の記述のうち、最も適切なものを1つ選びなさい。",
    choices: [
      "経鼻経管栄養法に適している。",
      "液状タイプと同じ粘稠度である。",
      "胃食道逆流を改善することが期待できる。",
      "仰臥位（背臥位）で注入する。",
      "注入時間は、液状タイプより長い。"
    ],
    answer: 2,
    explanation: "半固形タイプの栄養剤は粘度があるため逆流しにくく、胃食道逆流の改善が期待できる。経鼻経管栄養ではなく胃ろう等で使用。注入は半座位で行い、注入時間は液状タイプより短い。"
  },
  {
    id: "33-113", year: "第33回", label: "問題113",
    category: "経管栄養",
    q: "経管栄養で、栄養剤の注入後に白湯を経管栄養チューブに注入する理由として、最も適切なものを1つ選びなさい。",
    choices: [
      "チューブ内を消毒する。",
      "チューブ内の栄養剤を洗い流す。",
      "水分を補給する。",
      "胃内を温める。",
      "栄養剤の濃度を調節する。"
    ],
    answer: 1,
    explanation: "栄養剤の注入後に白湯を注入するのは、チューブ内に栄養剤が残らないように洗い流すためである。"
  },

  // ===== 第32回（令和元年度）=====
  {
    id: "32-109", year: "第32回", label: "問題109",
    category: "喀痰吸引",
    q: "介護福祉士が医師の下で行う喀痰吸引の範囲として、正しいものを1つ選びなさい。",
    choices: [
      "咽頭の手前まで",
      "咽頭まで",
      "喉頭まで",
      "気管の手前まで",
      "気管分岐部まで"
    ],
    answer: 0,
    explanation: "介護福祉士が行う口腔内・鼻腔内の喀痰吸引の範囲は、咽頭の手前までを限度とされている。"
  },
  {
    id: "32-110", year: "第32回", label: "問題110",
    category: "制度・法律",
    q: "2011年（平成23年）の社会福祉士及び介護福祉士法の改正に基づく喀痰吸引等の制度に関する次の記述のうち、正しいものを1つ選びなさい。",
    choices: [
      "喀痰吸引・経管栄養は医行為から除外された。",
      "喀痰吸引等を行うためには、実地研修を修了する必要がある。",
      "介護福祉士は、病院で喀痰吸引を実施できる。",
      "介護福祉士は、この制度の基本研修の講師ができる。",
      "実施できる行為の一つとして、インスリン注射がある。"
    ],
    answer: 1,
    explanation: "喀痰吸引等を行うためには基本研修及び実地研修を修了する必要がある。喀痰吸引等は医行為だが一定の条件で介護福祉士が実施可能。病院では実施不可。講師は医師・看護師等。インスリン注射は含まれない。"
  },
  {
    id: "32-111", year: "第32回", label: "問題111",
    category: "喀痰吸引",
    q: "Kさん（79歳）は鼻腔内吸引を実施したところ、吸引物に血液が少量混じっていた。Kさんは「痰は取り切れたようだ」と言っており、呼吸は落ち着いている。このときの介護福祉士の対応として、最も適切なものを1つ選びなさい。",
    choices: [
      "出血していそうなところに吸引チューブをとどめる。",
      "吸引圧を弱くして再度吸引する。",
      "血液の混じりがなくなるまで繰り返し吸引をする。",
      "鼻腔と口腔の中を観察する。",
      "鼻腔内を消毒する。"
    ],
    answer: 3,
    explanation: "吸引物に血液を発見した場合は、吸引を中断して吸引チューブを抜き、鼻腔と口腔の中を観察して出血場所を確認する。その後速やかに医師に連絡して状況を報告する。"
  },
  {
    id: "32-112", year: "第32回", label: "問題112",
    category: "喀痰吸引",
    q: "口腔内・鼻腔内の喀痰吸引に必要な物品の管理に関する次の記述のうち、最も適切なものを1つ選びなさい。",
    choices: [
      "吸引チューブの保管方法のうち、乾燥法では、浸漬法に比べて短時間で細菌が死滅する。",
      "浸漬法で用いる消毒液は、72時間を目安に交換する。",
      "吸引チューブの洗浄には、アルコール消毒液を用いる。",
      "吸引チューブの洗浄水は、24時間を目安に交換する。",
      "吸引物は、吸引びんの70〜80%になる前に廃棄する。"
    ],
    answer: 4,
    explanation: "吸引物は吸引びんの70〜80%になる前に廃棄する。浸漬法のほうが乾燥法より短時間で細菌が死滅する。消毒液は約1日を目安に交換。洗浄にはアルコールではなく洗浄水を用いる。"
  },

  // ===== 第31回（平成30年度）=====
  {
    id: "31-109", year: "第31回", label: "問題109",
    category: "感染予防",
    q: "次のうち、スタンダードプリコーション（標準予防策）において、感染する危険性のあるものとして取り扱う対象を1つ選びなさい。",
    choices: [
      "汗",
      "唾液",
      "経管栄養剤",
      "傷のない皮膚",
      "未使用の吸引チューブ"
    ],
    answer: 1,
    explanation: "スタンダードプリコーションでは、汗を除く分泌物（唾液、体液等）、排泄物、傷のある皮膚、粘膜などを感染源と見なす。汗、経管栄養剤、傷のない皮膚、未使用の吸引チューブは感染源とみなされない。"
  },
  {
    id: "31-110", year: "第31回", label: "問題110",
    category: "喀痰吸引",
    q: "喀痰吸引の実施が必要と判断された利用者に対して、喀痰吸引を行うことに関する次の記述のうち、最も適切なものを1つ選びなさい。",
    choices: [
      "日中は、1時間おきに吸引を行う。",
      "食後の吸引は避ける。",
      "入浴時は、その前後に吸引を行う。",
      "就寝後は吸引を控える。",
      "仰臥位を2時間保ってから行う。"
    ],
    answer: 2,
    explanation: "入浴及び喀痰吸引は体力を消耗するため、入浴前後に吸引を行うのが適切。吸引は1時間おきではなく必要に応じて行う。就寝後も必要に応じて行う。仰臥位を2時間保つ必要はない。"
  },
  {
    id: "31-111", year: "第31回", label: "問題111",
    category: "喀痰吸引",
    q: "気管切開をして人工呼吸器を使用している人の喀痰吸引に関する次の記述のうち、正しいものを1つ選びなさい。",
    choices: [
      "気管カニューレを抜いて、吸引を行う。",
      "頸部を前屈した姿勢にして、吸引を行う。",
      "1回の吸引時間は、20〜30秒とする。",
      "吸引チューブの挿入の深さは、気管分岐部の手前までである。",
      "吸引を終了した後は、人工呼吸器の作動状況を確認する。"
    ],
    answer: 4,
    explanation: "吸引終了後は利用者の様子とともに人工呼吸器の作動状況を必ず確認する。吸引は気管カニューレを通して行い、1回の吸引時間は15秒以内。挿入の深さはカニューレ内腔の長さ程度。"
  },
  {
    id: "31-112", year: "第31回", label: "問題112",
    category: "経管栄養",
    q: "胃ろうによる経管栄養の実施手順として、栄養剤を利用者のところに運んだ後の最初の行為として、最も適切なものを1つ選びなさい。",
    choices: [
      "体位の確認",
      "物品の劣化状況の確認",
      "栄養剤の指示内容の確認",
      "本人であることの確認",
      "経管栄養チューブの固定状況の確認"
    ],
    answer: 3,
    explanation: "栄養剤を利用者のところに運んだ後、最初に利用者本人の確認を行い、体調を聞く。物品確認や指示内容の確認は栄養剤を運ぶ前に行う。"
  },
  {
    id: "31-113", year: "第31回", label: "問題113",
    category: "経管栄養",
    q: "イルリガートル（注入ボトル）を用いた経鼻経管栄養に関する次の記述のうち、最も適切なものを1つ選びなさい。",
    choices: [
      "栄養剤は、半固形化栄養剤を用いる。",
      "嘔気があるときは、注入速度を遅くして滴下する。",
      "イルリガートルに栄養剤を入れてから、2時間後に滴下する。",
      "栄養剤の液面は、胃から50cm程度高くする。",
      "使用した物品は、消毒用エタノールにつけて消毒をする。"
    ],
    answer: 3,
    explanation: "栄養剤の液面は胃から50cm程度高くする。経鼻経管栄養では液体栄養剤を使用（半固形化は不可）。嘔気があるときは中止して医療職に報告する。使用物品は次亜塩素酸ナトリウム液で消毒する。"
  },
];

const CATEGORIES = [...new Set(QUESTIONS.map((q) => q.category))];
const YEARS = [...new Set(QUESTIONS.map((q) => q.year))];

// ─── Component ───────────────────────────────────────────────────
export default function MedicalCareQuiz() {
  const [mode, setMode] = useState<"menu" | "study" | "random" | "result">("menu");
  const [filterYear, setFilterYear] = useState("all");
  const [filterCat, setFilterCat] = useState("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [wrongList, setWrongList] = useState<Question[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [animating, setAnimating] = useState(false);

  const filtered = QUESTIONS.filter((q) => {
    if (filterYear !== "all" && q.year !== filterYear) return false;
    if (filterCat !== "all" && q.category !== filterCat) return false;
    return true;
  });

  const startStudy = () => {
    setQuizQuestions([...filtered]);
    setCurrentIndex(0); setSelected(null); setShowAnswer(false);
    setScore(0); setAnswered(0); setWrongList([]); setMode("study");
  };

  const startRandom = () => {
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setQuizQuestions(shuffled);
    setCurrentIndex(0); setSelected(null); setShowAnswer(false);
    setScore(0); setAnswered(0); setWrongList([]); setMode("random");
  };

  const handleSelect = (idx: number) => {
    if (!showAnswer) setSelected(idx);
  };

  const handleConfirm = () => {
    if (selected === null) return;
    setShowAnswer(true);
    setAnswered((a) => a + 1);
    const cur = quizQuestions[currentIndex];
    if (selected === cur.answer) setScore((s) => s + 1);
    else setWrongList((w) => [...w, cur]);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= quizQuestions.length) {
      setMode("result");
      return;
    }
    setAnimating(true);
    setTimeout(() => {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setShowAnswer(false);
      setAnimating(false);
    }, 200);
  };

  const cur = quizQuestions[currentIndex];

  // ─── MENU ────────────────────────────────────────────────
  if (mode === "menu") {
    return (
      <div className="max-w-[640px] mx-auto px-4 pb-8 min-h-screen font-['Hiragino_Kaku_Gothic_ProN','Noto_Sans_JP',sans-serif]">
        {/* Hero */}
        <div className="text-center pt-12 pb-6">
          <div className="text-[56px] mb-2">🏥</div>
          <h1 className="text-[32px] font-extrabold text-[#1a365d] tracking-wider mb-1">
            医療的ケア
          </h1>
          <p className="text-sm text-[#4a5568] font-medium mb-1">
            介護福祉士国家試験 過去問集
          </p>
          <p className="text-[13px] text-[#718096]">
            第31回〜第37回 全{QUESTIONS.length}問収録
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-5 mt-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <label className="block text-xs font-bold text-[#4a5568] mb-2 uppercase tracking-widest">
            回を選択
          </label>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setFilterYear("all")}
              className={`px-3 py-1.5 rounded-full border-[1.5px] text-xs font-semibold cursor-pointer transition-all duration-150 ${
                filterYear === "all"
                  ? "bg-[#2b6cb0] text-white border-[#2b6cb0]"
                  : "bg-white text-[#4a5568] border-[#cbd5e0]"
              }`}
            >
              全回
            </button>
            {YEARS.map((y) => (
              <button
                key={y}
                onClick={() => setFilterYear(y)}
                className={`px-3 py-1.5 rounded-full border-[1.5px] text-xs font-semibold cursor-pointer transition-all duration-150 ${
                  filterYear === y
                    ? "bg-[#2b6cb0] text-white border-[#2b6cb0]"
                    : "bg-white text-[#4a5568] border-[#cbd5e0]"
                }`}
              >
                {y}
              </button>
            ))}
          </div>

          <label className="block text-xs font-bold text-[#4a5568] mb-2 mt-4 uppercase tracking-widest">
            カテゴリを選択
          </label>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setFilterCat("all")}
              className={`px-3 py-1.5 rounded-full border-[1.5px] text-xs font-semibold cursor-pointer transition-all duration-150 ${
                filterCat === "all"
                  ? "bg-[#2b6cb0] text-white border-[#2b6cb0]"
                  : "bg-white text-[#4a5568] border-[#cbd5e0]"
              }`}
            >
              全て
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setFilterCat(c)}
                className={`px-3 py-1.5 rounded-full border-[1.5px] text-xs font-semibold cursor-pointer transition-all duration-150 ${
                  filterCat === c
                    ? "bg-[#2b6cb0] text-white border-[#2b6cb0]"
                    : "bg-white text-[#4a5568] border-[#cbd5e0]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-[#4a5568] font-semibold mt-5 mb-1">
          対象問題数：{filtered.length}問
        </p>

        <div className="flex flex-col gap-3 mt-4">
          <button
            onClick={startStudy}
            className="w-full py-4 rounded-[14px] border-none bg-gradient-to-br from-[#2b6cb0] to-[#2c5282] text-white text-base font-bold cursor-pointer tracking-wider shadow-[0_4px_12px_rgba(43,108,176,0.3)]"
          >
            📖 順番に解く
          </button>
          <button
            onClick={startRandom}
            className="w-full py-4 rounded-[14px] border-2 border-[#2b6cb0] bg-white text-[#2b6cb0] text-base font-bold cursor-pointer tracking-wider"
          >
            🔀 ランダムに解く
          </button>
        </div>
      </div>
    );
  }

  // ─── RESULT ──────────────────────────────────────────────
  if (mode === "result") {
    const pct = Math.round((score / answered) * 100);
    const emoji = pct >= 90 ? "🎉" : pct >= 70 ? "👏" : pct >= 50 ? "💪" : "📚";

    return (
      <div className="max-w-[640px] mx-auto px-4 pb-8 min-h-screen font-['Hiragino_Kaku_Gothic_ProN','Noto_Sans_JP',sans-serif]">
        <div className="bg-white rounded-3xl px-6 py-10 mt-10 text-center shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
          <div className="text-[56px]">{emoji}</div>
          <h2 className="text-2xl font-extrabold text-[#1a365d] my-3">結果発表</h2>

          <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-[#2b6cb0] to-[#4299e1] flex items-center justify-center mx-auto my-5 shadow-[0_4px_20px_rgba(43,108,176,0.3)]">
            <span className="text-4xl font-extrabold text-white">{pct}%</span>
          </div>

          <p className="text-base text-[#4a5568] font-semibold mb-6">
            {answered}問中 {score}問正解
          </p>

          {wrongList.length > 0 && (
            <div className="text-left mt-6 mb-6">
              <h3 className="text-sm font-bold text-[#c53030] mb-3 pb-2 border-b-2 border-[#fed7d7]">
                間違えた問題（{wrongList.length}問）
              </h3>
              {wrongList.map((w, i) => (
                <div
                  key={i}
                  className="p-3 rounded-[10px] bg-[#fff5f5] mb-2 border border-[#fed7d7]"
                >
                  <span className="text-[11px] font-bold text-[#c53030] bg-[#fed7d7] px-2 py-0.5 rounded-lg">
                    {w.year} {w.label}
                  </span>
                  <p className="text-xs text-[#4a5568] mt-1.5 mb-1 leading-relaxed">
                    {w.q.slice(0, 60)}…
                  </p>
                  <p className="text-xs text-[#276749] font-semibold m-0">
                    正解：{w.choices[w.answer]}
                  </p>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => setMode("menu")}
            className="w-full py-4 rounded-[14px] border-none bg-gradient-to-br from-[#2b6cb0] to-[#2c5282] text-white text-base font-bold cursor-pointer tracking-wider shadow-[0_4px_12px_rgba(43,108,176,0.3)]"
          >
            メニューに戻る
          </button>
        </div>
      </div>
    );
  }

  // ─── QUIZ ────────────────────────────────────────────────
  return (
    <div className="max-w-[640px] mx-auto px-4 pb-8 min-h-screen font-['Hiragino_Kaku_Gothic_ProN','Noto_Sans_JP',sans-serif]">
      {/* Top bar */}
      <div className="flex items-center gap-3 pt-4 pb-2">
        <button
          onClick={() => setMode("menu")}
          className="w-9 h-9 rounded-full border-none bg-[#e2e8f0] text-base cursor-pointer flex items-center justify-center text-[#4a5568] font-bold"
        >
          ✕
        </button>
        <div className="flex-1 h-1.5 bg-[#e2e8f0] rounded-sm overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#2b6cb0] to-[#4299e1] rounded-sm transition-[width] duration-300 ease-out"
            style={{ width: `${((currentIndex + 1) / quizQuestions.length) * 100}%` }}
          />
        </div>
        <span className="text-[13px] font-bold text-[#4a5568] min-w-[48px] text-right">
          {currentIndex + 1}/{quizQuestions.length}
        </span>
      </div>

      {/* Score bar */}
      <div className="flex gap-2 mb-3">
        <span className="px-3 py-1 rounded-full text-[13px] font-bold bg-[#e6ffed] text-[#276749]">
          ⭕ {score}
        </span>
        <span className="px-3 py-1 rounded-full text-[13px] font-bold bg-[#fde8e8] text-[#c53030]">
          ❌ {answered - score}
        </span>
      </div>

      {/* Question card */}
      <div
        className="bg-white rounded-[20px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-200"
        style={{
          opacity: animating ? 0 : 1,
          transform: animating ? "translateX(40px)" : "translateX(0)",
        }}
      >
        {/* Meta badges */}
        <div className="flex gap-1.5 mb-4 flex-wrap">
          <span className="px-2.5 py-0.5 rounded-xl bg-[#ebf4ff] text-[#2b6cb0] text-[11px] font-bold">
            {cur.year}
          </span>
          <span className="px-2.5 py-0.5 rounded-xl bg-[#fef3c7] text-[#92400e] text-[11px] font-bold">
            {cur.label}
          </span>
          <span className="px-2.5 py-0.5 rounded-xl bg-[#f0fff4] text-[#276749] text-[11px] font-bold">
            {cur.category}
          </span>
        </div>

        {/* Question text */}
        <p className="text-[15px] leading-[1.7] text-[#1a202c] mb-5 font-medium">
          {cur.q}
        </p>

        {/* Choices */}
        <div className="flex flex-col gap-2">
          {cur.choices.map((c, i) => {
            let borderColor = "#e2e8f0";
            let bgColor = "#fff";
            let opacity = 1;

            if (showAnswer) {
              if (i === cur.answer) {
                borderColor = "#38a169";
                bgColor = "#f0fff4";
              } else if (i === selected) {
                borderColor = "#e53e3e";
                bgColor = "#fff5f5";
              } else {
                opacity = 0.5;
              }
            } else if (i === selected) {
              borderColor = "#2b6cb0";
              bgColor = "#ebf8ff";
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                className="flex items-start gap-2.5 p-3.5 rounded-xl cursor-pointer transition-all duration-150 text-left w-full"
                style={{
                  border: `2px solid ${borderColor}`,
                  background: bgColor,
                  opacity,
                }}
              >
                <span className="w-6 h-6 rounded-full bg-[#e2e8f0] flex items-center justify-center text-xs font-bold text-[#4a5568] shrink-0 mt-px">
                  {i + 1}
                </span>
                <span className="text-sm leading-relaxed text-[#2d3748]">{c}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showAnswer && (
          <div className="mt-5 p-4 rounded-[14px] bg-[#f7fafc] border border-[#e2e8f0]">
            <div className="mb-2">
              {selected === cur.answer ? (
                <span className="text-base font-extrabold text-[#276749]">⭕ 正解！</span>
              ) : (
                <span className="text-base font-extrabold text-[#c53030]">❌ 不正解</span>
              )}
            </div>
            <p className="text-[13px] leading-[1.7] text-[#4a5568] m-0">
              {cur.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Action bar */}
      <div className="mt-5 pb-5">
        {!showAnswer ? (
          <button
            disabled={selected === null}
            onClick={handleConfirm}
            className="w-full py-4 rounded-[14px] border-none bg-gradient-to-br from-[#2b6cb0] to-[#2c5282] text-white text-base font-bold cursor-pointer tracking-wider shadow-[0_4px_12px_rgba(43,108,176,0.3)] disabled:opacity-40"
          >
            解答する
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full py-4 rounded-[14px] border-none bg-gradient-to-br from-[#2b6cb0] to-[#2c5282] text-white text-base font-bold cursor-pointer tracking-wider shadow-[0_4px_12px_rgba(43,108,176,0.3)]"
          >
            {currentIndex + 1 >= quizQuestions.length ? "結果を見る" : "次の問題へ →"}
          </button>
        )}
      </div>
    </div>
  );
}
