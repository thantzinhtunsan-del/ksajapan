import { motion } from 'motion/react';
import { Volume2, Search, BookOpen } from 'lucide-react';
import { useState } from 'react';

interface Vocabulary {
  id: string;
  word: string;
  reading: string;
  burmese: string;
  category: string;
}

const SAMPLE_VOCAB: Vocabulary[] = [
  // 1. 憲法と基本理念
  { id: '1', word: '生存権', reading: 'せいぞんけん', burmese: 'အသက်ရှင်သန်ခွင့် (အနည်းဆုံး လူနေမှုအဆင့်အတန်း)', category: 'Principles' },
  { id: '2', word: '基本的人権', reading: 'きほんてきじんけん', burmese: 'အခြေခံလူ့အခွင့်အရေး', category: 'Principles' },
  { id: '3', word: '公共の福祉', reading: 'こうきょうのふくし', burmese: 'အများပြည်သူအကျိုးစီးပွား', category: 'Principles' },
  { id: '4', word: 'ノーマライゼーション', reading: 'Normalization', burmese: 'မသန်စွမ်းသူများ ပုံမှန်ဘဝအတိုင်း နေထိုင်ခြင်း', category: 'Principles' },
  { id: '5', word: 'リハビリテーション', reading: 'Rehabilitation', burmese: 'ပြန်လည်သန်စွမ်းရေး', category: 'Principles' },
  { id: '6', word: 'インクルージョン', reading: 'Inclusion', burmese: 'အားလုံးပါဝင်နိုင်သော လူ့အဖွဲ့အစည်း', category: 'Principles' },
  { id: '7', word: '自己決定', reading: 'じこけってい', burmese: 'ကိုယ်တိုင်ဆုံးဖြတ်ခြင်း', category: 'Principles' },
  { id: '8', word: 'QOL', reading: 'Quality of Life', burmese: 'ဘဝအရည်အသွေး', category: 'Principles' },
  { id: '9', word: 'ADL', reading: 'Activities of Daily Living', burmese: 'နေ့စဉ်လူမှုဘဝ လှုပ်ရှားဆောင်ရွက်မှု', category: 'Principles' },
  { id: '10', word: 'エンパワメント', reading: 'Empowerment', burmese: 'ကိုယ့်စွမ်းအားကိုယ်ဖော်ထုတ်ခြင်း', category: 'Principles' },

  // 2. 社会保障制度
  { id: '11', word: '社会保障', reading: 'しゃかいほしょう', burmese: 'လူမှုဖေးမမှု (Social Security)', category: 'Social Security' },
  { id: '12', word: '社会保険', reading: 'しゃかいほけん', burmese: 'လူမှုအာမခံ (ကြေးပေးသွင်းရသည်)', category: 'Social Security' },
  { id: '13', word: '社会扶助', reading: 'しゃかいふじょ', burmese: 'လူမှုကူညီပံ့ပိုးမှု (အခွန်ဖြင့်သုံးသည်)', category: 'Social Security' },
  { id: '14', word: '公衆衛生', reading: 'こうしゅうえいせい', burmese: 'အများပြည်သူ ကျန်းမာသန့်ရှင်းရေး', category: 'Social Security' },
  { id: '15', word: '公的扶助', reading: 'こうてきふじょ', burmese: 'အစိုးရ၏ ကူညီထောက်ပံ့မှု', category: 'Social Security' },
  { id: '16', word: '所得再分配', reading: 'しょとくさいぶんぱい', burmese: 'ဝင်ငွေပြန်လည်ခွဲဝေခြင်း', category: 'Social Security' },
  { id: '17', word: '国民皆保険', reading: 'こくみんかいほけん', burmese: 'နိုင်ငံသားတိုင်း အာမခံထားရှိခြင်း', category: 'Social Security' },
  { id: '18', word: '国民皆年金', reading: 'こくみんかいねんきん', burmese: 'နိုင်ငံသားတိုင်း ပင်စင်ထားရှိခြင်း', category: 'Social Security' },
  { id: '19', word: '社会福祉', reading: 'しゃかいふくし', burmese: 'လူမှုဝန်ထမ်းလုပ်ငန်း', category: 'Social Security' },
  { id: '20', word: '措置', reading: 'そち', burmese: 'အစိုးရက စီစဉ်ပေးခြင်း (စနစ်ဟောင်း)', category: 'Social Security' },
  { id: '21', word: '契約', reading: 'けいやく', burmese: 'စာချုပ်ချုပ်ဆိုခြင်း (စနစ်သစ်)', category: 'Social Security' },
  { id: '22', word: '利用者負担', reading: 'りようしゃふたん', burmese: 'အသုံးပြုသူ ကိုယ်တိုင်ကျခံရသောစရိတ်', category: 'Social Security' },
  { id: '23', word: '現物給付', reading: 'げんぶつきゅうふ', burmese: 'ဝန်ဆောင်မှုဖြင့် ပေးအပ်ခြင်း', category: 'Social Security' },
  { id: '24', word: '現金給付', reading: 'げんきんきゅうふ', burmese: 'ငွေသားဖြင့် ပေးအပ်ခြင်း', category: 'Social Security' },
  { id: '25', word: '応能負担', reading: 'おうのうふたん', burmese: 'ဝင်ငွေအလိုက် ပေးဆောင်ခြင်း', category: 'Social Security' },
  { id: '26', word: '応益負担', reading: 'おうえきふたん', burmese: 'ဝန်ဆောင်မှုအလိုက် ပေးဆောင်ခြင်း', category: 'Social Security' },

  // 3. 介護保険制度
  { id: '27', word: '保険者', reading: 'ほけんしゃ', burmese: 'အာမခံထားရှိသူ (市町村 - မြို့နယ်)', category: 'Care Insurance' },
  { id: '28', word: '被保険者', reading: 'ひほけんしゃ', burmese: 'အာမခံထားသူ (ပြည်သူ)', category: 'Care Insurance' },
  { id: '29', word: '第1号被保険者', reading: 'だいいちごう', burmese: 'အသက် ၆၅ နှစ်နှင့်အထက် လူကြီးများ', category: 'Care Insurance' },
  { id: '30', word: '第2号被保険者', reading: 'だいにごう', burmese: 'အသက် ၄၀ မှ ၆၄ နှစ်ရှိသူများ', category: 'Care Insurance' },
  { id: '31', word: '特定疾病', reading: 'とくていしっぺい', burmese: 'သတ်မှတ်ထားသော ရောဂါ ၁၆ မျိုး', category: 'Care Insurance' },
  { id: '32', word: '要介護認定', reading: 'ようかいごにんてい', burmese: 'ဂရုစိုက်မှုလိုအပ်မှုအဆင့် သတ်မှတ်ခြင်း', category: 'Care Insurance' },
  { id: '33', word: '主治医の意見書', reading: 'しゅじいのいけんしょ', burmese: 'တာဝန်ခံဆရာဝန်၏ မှတ်ချက်စာလွှာ', category: 'Care Insurance' },
  { id: '34', word: 'ケアマネジャー', reading: 'Care Manager', burmese: 'ဂရုစိုက်မှု စီမံခန့်ခွဲသူ', category: 'Care Insurance' },
  { id: '35', word: 'ケアプラン', reading: 'Care Plan', burmese: 'ဂရုစိုက်မှုအစီအစဉ်', category: 'Care Insurance' },
  { id: '36', word: '居宅サービス', reading: 'きょたく', burmese: 'အိမ်တိုင်ရာရောက် ဝန်ဆောင်မှု', category: 'Care Insurance' },
  { id: '37', word: '施設サービス', reading: 'しせつ', burmese: 'ဂရုစိုက်ရေးဂေဟာ ဝန်ဆောင်မှု', category: 'Care Insurance' },
  { id: '38', word: '地域密着型', reading: 'ちいきみっちゃくがた', burmese: 'ရပ်ကွက်အခြေပြု ဝန်ဆောင်မှု', category: 'Care Insurance' },
  { id: '39', word: '通所介護', reading: 'つうしょかいご', burmese: 'နေ့ပိုင်းလာရောက်ခြင်း (Day Care)', category: 'Care Insurance' },
  { id: '40', word: '訪問介護', reading: 'ほうもんかいご', burmese: 'အိမ်တိုင်ရာရောက် သွားရောက်ခြင်း (Home Help)', category: 'Care Insurance' },
  { id: '41', word: '短期入所', reading: 'たんきにゅうしょ', burmese: 'ခေတ္တတည်းခိုခြင်း (Short Stay)', category: 'Care Insurance' },
  { id: '42', word: '小規模多機能', reading: 'しょうきぼたきのう', burmese: 'အသေးစား ဘက်စုံသုံး ဝန်ဆောင်မှု', category: 'Care Insurance' },
  { id: '43', word: '区分支給限度額', reading: 'くぶんしきゅう', burmese: 'အာမခံအသုံးပြုနိုင်သော ကန့်သတ်ငွေပမာဏ', category: 'Care Insurance' },
  { id: '44', word: '地域包括支援センター', reading: 'ちいきほうかつ', burmese: 'ရပ်ကွက်အခြေပြု ဘက်စုံကူညီရေးဌာန', category: 'Care Insurance' },
  { id: '45', word: '介護保険料', reading: 'かいごほけんりょう', burmese: 'Care Insurance အာမခံကြေး', category: 'Care Insurance' },

  // 4. 高齢者・障害者福祉
  { id: '46', word: '老人福祉法', reading: 'ろうじんふくしほう', burmese: 'သက်ကြီးရွယ်အို စောင့်ရှောက်ရေးဥပဒေ', category: 'Elderly & Disabled' },
  { id: '47', word: '高齢者虐待', reading: 'こうれいしゃぎゃくたい', burmese: 'လူကြီးများကို နှိပ်စက်ညှဉ်းပန်းခြင်း', category: 'Elderly & Disabled' },
  { id: '48', word: '権利擁護', reading: 'けんりようご', burmese: 'အခွင့်အရေး ကာကွယ်စောင့်ရှောက်ခြင်း', category: 'Elderly & Disabled' },
  { id: '49', word: '成年後見制度', reading: 'せいねんこうけん', burmese: 'အရွယ်ရောက်သူများအတွက် အုပ်ထိန်းသူစနစ်', category: 'Elderly & Disabled' },
  { id: '50', word: '身体障害者', reading: 'しんたいしょうがいしゃ', burmese: 'ခန္ဓာကိုယ်မသန်စွမ်းသူ', category: 'Elderly & Disabled' },
  { id: '51', word: '知的障害者', reading: 'ちてきしょうがいしゃ', burmese: 'ဉာဏ်ရည်မသန်စွမ်းသူ', category: 'Elderly & Disabled' },
  { id: '52', word: '精神障害者', reading: 'せいしんしょうがいしゃ', burmese: 'စိတ်ပိုင်းဆိုင်ရာ မသန်စွမ်းသူ', category: 'Elderly & Disabled' },
  { id: '53', word: '自立支援', reading: 'じりつしえん', burmese: 'ကိုယ်တိုင်ရပ်တည်နိုင်အောင် ကူညီခြင်း', category: 'Elderly & Disabled' },
  { id: '54', word: '障害者差別解消法', reading: 'しょうがいしゃさべつ', burmese: 'မသန်စွမ်းသူ ခွဲခြားဆက်ဆံမှု ပပျောက်ရေးဥပဒေ', category: 'Elderly & Disabled' },
  { id: '55', word: '合理的配慮', reading: 'ごうりてきはいりょ', burmese: 'သင့်တင့်လျောက်ပတ်သော ညှိနှိုင်းမှု', category: 'Elderly & Disabled' },
  { id: '56', word: 'バリアフリー', reading: 'Barrier Free', burmese: 'အတားအဆီးမဲ့ ပတ်ဝန်းကျင်', category: 'Elderly & Disabled' },
  { id: '57', word: 'ユニバーサルデザイン', reading: 'Universal Design', burmese: 'လူတိုင်းအတွက် အဆင်ပြေစေမည့် ဒီဇိုင်း', category: 'Elderly & Disabled' },

  // 5. 生活保護と困窮者
  { id: '58', word: '生活保護', reading: 'せいかつほご', burmese: 'လူမှုဖေးမရေး (Welfare)', category: 'Welfare' },
  { id: '59', word: '世帯単位', reading: 'せたいたんい', burmese: 'အိမ်ထောင်စုအလိုက် (တွက်ချက်ခြင်း)', category: 'Welfare' },
  { id: '60', word: '補足性の原理', reading: 'ほそくせい', burmese: 'အခြားနည်းလမ်းမရှိမှ ကူညီခြင်း', category: 'Welfare' },
  { id: '61', word: '生活扶助', reading: 'せいかつふじょ', burmese: 'နေ့စဉ်စားဝတ်နေရေး ကူညီမှု', category: 'Welfare' },
  { id: '62', word: '住宅扶助', reading: 'じゅうたくふじょ', burmese: 'အိမ်ငှားခ ကူညီမှု', category: 'Welfare' },
  { id: '63', word: '医療扶助', reading: 'いりょうふじょ', burmese: 'ဆေးကုသခ ကူညီမှု (ငွေသားမဟုတ်)', category: 'Welfare' },
  { id: '64', word: '介護扶助', reading: 'かいごふじょ', burmese: 'ဂရုစိုက်ခ ကူညီမှု', category: 'Welfare' },
  { id: '65', word: '最低生活費', reading: 'さいていせいかつひ', burmese: 'အနိမ့်ဆုံး ရှင်သန်စရိတ်', category: 'Welfare' },
  { id: '66', word: '民生委員', reading: 'みんせいいいん', burmese: 'ရပ်ကွက်လူမှုကူညီရေးစေတနာ့ဝန်ထမ်း', category: 'Welfare' },

  // 6. 人口・世帯・家族
  { id: '67', word: '少子高齢化', reading: 'しょうしこうれいか', burmese: 'ကလေးမွေးနှုန်းနည်းပြီး လူကြီးများခြင်း', category: 'Demographics' },
  { id: '68', word: '合計特殊出生率', reading: 'ごうけいとくしゅ', burmese: 'စုစုပေါင်း ကလေးမွေးဖွားနှုန်း', category: 'Demographics' },
  { id: '69', word: '平均寿命', reading: 'へいきんじゅみょう', burmese: 'ပျမ်းမျှသက်တမ်း', category: 'Demographics' },
  { id: '70', word: '健康寿命', reading: 'けんこうじゅみょう', burmese: 'ကျန်းမာစွာ နေနိုင်သောသက်တမ်း', category: 'Demographics' },
  { id: '71', word: '核家族', reading: 'かくかぞく', burmese: 'မိဘနှင့်ကလေးသာရှိသော မိသားစု', category: 'Demographics' },
  { id: '72', word: '単独世帯', reading: 'たんどくせたい', burmese: 'တစ်ဦးတည်းနေ အိမ်ထောင်စု', category: 'Demographics' },
  { id: '73', word: '三世代同居', reading: 'さんせたいどうきょ', burmese: 'မျိုးဆက် ၃ ဆက် အတူနေခြင်း', category: 'Demographics' },
  { id: '74', word: '高齢者世帯', reading: 'こうれいしゃせたい', burmese: 'အသက် ၆၅ နှစ်အထက်သာရှိသော အိမ်ထောင်စု', category: 'Demographics' },
  { id: '75', word: '老老介護', reading: 'ろうろうかいご', burmese: 'လူကြီးအချင်းချင်း ပြန်လည်စောင့်ရှောက်ခြင်း', category: 'Demographics' },

  // 7. 専門職と組織
  { id: '76', word: '介護福祉士', reading: 'かいごふくしし', burmese: 'အသိအမှတ်ပြု Care Worker', category: 'Professionals' },
  { id: '77', word: '社会福祉士', reading: 'しゃかいふくしし', burmese: 'လူမှုဝန်ထမ်း ကျွမ်းကျင်သူ (Social Worker)', category: 'Professionals' },
  { id: '78', word: '精神保健福祉士', reading: 'せいしんほけん', burmese: 'စိတ်ကျန်းမာရေး လူမှုဝန်ထမ်း', category: 'Professionals' },
  { id: '79', word: '看護師', reading: 'かんごし', burmese: 'နာ့စ် (Nurse)', category: 'Professionals' },
  { id: '80', word: '理学療法士', reading: 'PT', burmese: 'ကာယကုထုံးပညာရှင် (Physical Therapist)', category: 'Professionals' },
  { id: '81', word: '作業療法士', reading: 'OT', burmese: 'အလုပ်အကိုင်ကုထုံးပညာရှင် (Occupational Therapist)', category: 'Professionals' },
  { id: '82', word: '言語聴覚士', reading: 'ST', burmese: 'စကားပြောကုထုံးပညာရှင် (Speech Therapist)', category: 'Professionals' },
  { id: '83', word: '医師', reading: 'いし', burmese: 'ဆရာဝန်', category: 'Professionals' },
  { id: '84', word: '薬剤師', reading: 'やくざいし', burmese: 'ဆေးဝါးကျွမ်းကျင်သူ', category: 'Professionals' },
  { id: '85', word: '保健所', reading: 'ほけんじょ', burmese: 'ကျန်းမာရေးဌาန', category: 'Professionals' },

  // 8. 倫理と法規
  { id: '86', word: '守秘義務', reading: 'しゅひぎむ', burmese: 'လျှို့ဝှက်ချက် ထိန်းသိမ်းရမည့်တာဝန်', category: 'Ethics & Law' },
  { id: '87', word: '虐待の防止', reading: 'ぎゃくたいのぼうし', burmese: 'နှိပ်စက်မှု တားဆီးကာကွယ်ခြင်း', category: 'Ethics & Law' },
  { id: '88', word: '身体拘束', reading: 'しんたいこうそく', burmese: 'ကိုယ်ခန္ဓာကို ချည်နှောင်တားဆီးခြင်း', category: 'Ethics & Law' },
  { id: '89', word: 'インフォームド・コンセント', reading: 'Informed Consent', burmese: 'အသိပေးသဘောတူညီချက်ရယူခြင်း', category: 'Ethics & Law' },
  { id: '90', word: 'プライバシー', reading: 'Privacy', burmese: 'ပုဂ္ဂိုလ်ရေး လွတ်လပ်ခွင့်', category: 'Ethics & Law' },
  { id: '91', word: '苦情処理', reading: 'くじょうしょり', burmese: 'တိုင်ကြားချက်များကို ဖြေရှင်းခြင်း', category: 'Ethics & Law' },
  { id: '92', word: 'アドボカシー', reading: 'Advocacy', burmese: 'အခွင့်အရေးကို ကိုယ်စားပြု ပြောဆိုပေးခြင်း', category: 'Ethics & Law' },

  // 9. 制度の動向
  { id: '93', word: '共生社会', reading: 'きょうせいしゃかい', burmese: 'အတူတကွ ယှဉ်တွဲနေထိုင်သော လူ့အဖွဲ့အစည်း', category: 'Trends' },
  { id: '94', word: '地域包括ケアシステム', reading: 'ちいきほうかつ', burmese: 'ရပ်ကွက်အခြေပြု ဘက်စုံဂရုစိုက်မှုစနစ်', category: 'Trends' },
  { id: '95', word: '自助', reading: 'じじょ', burmese: 'မိမိကိုယ်တိုင် ကူညီခြင်း', category: 'Trends' },
  { id: '96', word: '互助', reading: 'ごじょ', burmese: 'အချင်းချင်း ကူညီခြင်း', category: 'Trends' },
  { id: '97', word: '共助', reading: 'きょうじょ', burmese: 'အာမခံစနစ်ဖြင့် ကူညီခြင်း', category: 'Trends' },
  { id: '98', word: '公助', reading: 'こうじょ', burmese: 'အစိုးရက ကူညီခြင်း', category: 'Trends' },
  { id: '99', word: '地域共生社会', reading: 'ちいききょうせい', burmese: 'ရပ်ကွက်အတွင်း အတူတကွ ယှဉ်တွဲနေထိုင်ခြင်း', category: 'Trends' },
  { id: '100', word: 'ICT活用', reading: 'ICTかつよう', burmese: 'နည်းပညာ အသုံးပြုခြင်း', category: 'Trends' },

  // 10. 尊厳と自立 (Dignity & Independence)
  { id: '101', word: '人間の尊厳', reading: 'にんげんのそんげん', burmese: 'လူသားတို့၏ ဂုဏ်သိက္ခာ (လူတိုင်း တန်ဖိုးရှိစွာ ဆက်ဆံခံရခွင့်)', category: 'Dignity & Independence' },
  { id: '102', word: '人権', reading: 'じんけん', burmese: 'လူ့အခွင့်အရေး', category: 'Dignity & Independence' },
  { id: '103', word: 'QOL', reading: 'Quality of Life', burmese: 'ဘဝအရည်အသွေး (စိတ်ချမ်းသာမှုနှင့် ကျေနပ်မှု)', category: 'Dignity & Independence' },
  { id: '104', word: 'ノーマライゼーション', reading: 'Normalization', burmese: 'မသန်စွမ်းသူများ ပုံမှန်လူများနည်းတူ လူ့အဖွဲ့အစည်းတွင် နေထိုင်ခြင်း', category: 'Dignity & Independence' },
  { id: '105', word: 'インクルージョン', reading: 'Inclusion', burmese: 'အားလုံးပါဝင်နိုင်သော လူ့အဖွဲ့အစည်း (ဖယ်ကြဉ်မထားခြင်း)', category: 'Dignity & Independence' },
  { id: '106', word: 'ソーシャルインクルージョン', reading: 'Social Inclusion', burmese: 'လူမှုရေးအရ အားလုံးပါဝင်ယှဉ်တွဲနေထိုင်ခြင်း', category: 'Dignity & Independence' },
  { id: '107', word: '多様性', reading: 'たようせい', burmese: 'ကွဲပြားခြားနားမှုများ (Diversity)', category: 'Dignity & Independence' },
  { id: '108', word: 'アイデンティティ', reading: 'Identity', burmese: 'မိမိကိုယ်ကိုယ် မည်သူမည်ဝါဖြစ်ကြောင်း သိရှိမှု', category: 'Dignity & Independence' },
  { id: '109', word: '自己決定', reading: 'じこけってい', burmese: 'မိမိဘာသာ ဆုံးဖြတ်ခြင်း (User ဆန္ဒကို အလေးထားခြင်း)', category: 'Dignity & Independence' },
  { id: '110', word: '自立支援', reading: 'じりつしえん', burmese: 'ကိုယ်တိုင်ရပ်တည်နိုင်အောင် ကူညီခြင်း (အလုပ်အားလုံးကို လုပ်ပေးခြင်းမဟုတ်)', category: 'Dignity & Independence' },
  { id: '111', word: '自己選択', reading: 'じこせんたく', burmese: 'မိမိဘာသာ ရွေးချယ်ခြင်း', category: 'Dignity & Independence' },
  { id: '112', word: '意思決定支援', reading: 'いしけっていしえん', burmese: 'ဆုံးဖြတ်ချက်ချနိုင်အောင် ကူညီပံ့ပိုးပေးခြင်း', category: 'Dignity & Independence' },
  { id: '113', word: 'インフォームド・コンセント', reading: 'Informed Consent', burmese: 'အကြောင်းစုံရှင်းပြပြီး သဘောတူညီချက်ယူခြင်း', category: 'Dignity & Independence' },
  { id: '114', word: 'パターナリズム', reading: 'Paternalism', burmese: 'ဆရာလုပ်ခြင်း (သို့) အပေါ်စီးမှ ဆုံးဖြတ်ပေးခြင်း (❌ Exam Trap: ဒါကို ရှောင်ရမည်)', category: 'Dignity & Independence' },
  { id: '115', word: 'エンパワメント', reading: 'Empowerment', burmese: 'User ထဲမှာရှိတဲ့ စွမ်းရည်ကို ပြန်လည်ဖော်ထုတ်ပေးခြင်း', category: 'Dignity & Independence' },
  { id: '116', word: '権利擁護', reading: 'けんりようご', burmese: 'အခွင့်အရေးကို ကာကွယ်စောင့်ရှောက်ပေးခြင်း', category: 'Dignity & Independence' },
  { id: '117', word: 'アドボカシー', reading: 'Advocacy', burmese: 'User ကိုယ်စား ပြောဆိုပေးခြင်း (အခွင့်အရေးအတွက် ရပ်တည်ပေးခြင်း)', category: 'Dignity & Independence' },
  { id: '118', word: 'セルフアドボカシー', reading: 'Self Advocacy', burmese: 'မိမိအခွင့်အရေးအတွက် မိမိကိုယ်တိုင် ပြောဆိုခြင်း', category: 'Dignity & Independence' },
  { id: '119', word: 'ピアアドボカシー', reading: 'Peer Advocacy', burmese: 'အလားတူ အခြေအနေရှိသူအချင်းချင်း ကူညီပြောဆိုပေးခြင်း', category: 'Dignity & Independence' },
  { id: '120', word: '成年後見制度', reading: 'せいねんこうけんせいど', burmese: 'အရွယ်ရောက်ပြီးသူများအတွက် အုပ်ထိန်းသူစနစ် (ဉာဏ်ရည်အားနည်းသူများအတွက်)', category: 'Dignity & Independence' },

  // 11. コミュニケーション (Communication)
  { id: '121', word: '言語的コミュニケーション', reading: 'げんごてき', burmese: 'စကားဖြင့် ပြောဆိုဆက်သွယ်ခြင်း (Verbal)', category: 'Communication' },
  { id: '122', word: '非言語的コミュニケーション', reading: 'ひげんごてき', burmese: 'စကားမပါဘဲ ဆက်သွယ်ခြင်း (Non-verbal)', category: 'Communication' },
  { id: '123', word: '共感', reading: 'きょうかん', burmese: 'ကိုယ်ချင်းစာစိတ် (User ရဲ့ ခံစားချက်ကို ထပ်တူနားလည်ပေးခြင်း)', category: 'Communication' },
  { id: '124', word: '傾聴', reading: 'けいちょう', burmese: 'အလေးအနက် နားထောင်ခြင်း (နားရုံတင်မဟုတ်ဘဲ စိတ်ပါဝင်စားစွာ နားထောင်ခြင်း)', category: 'Communication' },
  { id: '125', word: '受容', reading: 'じゅよう', burmese: 'လက်ခံပေးခြင်း (User ရဲ့ အခြေအနေကို ဝေဖန်ခြင်းမရှိဘဲ လက်ခံခြင်း)', category: 'Communication' },
  { id: '126', word: '自己開示', reading: 'じこかいじ', burmese: 'မိမိအကြောင်းကို ဖွင့်ဟပြောဆိုခြင်း (ရင်းနှီးမှုရစေရန်)', category: 'Communication' },
  { id: '127', word: 'ラポール形成', reading: 'Rapport', burmese: 'အပြန်အလှန် ယုံကြည်မှု တည်ဆောက်ခြင်း', category: 'Communication' },
  { id: '128', word: '開かれた質問', reading: 'ひらかれたしつもん', burmese: '"ဘယ်လိုလဲ" "ဘာကြောင့်လဲ" စသဖြင့် အကျယ်ဖြေရသော မေးခွန်း', category: 'Communication' },
  { id: '129', word: '閉じられた質問', reading: 'とじられたしつもん', burmese: '"ဟုတ်ကဲ့/မဟုတ်ဘူး" သာ ဖြေရသော မေးခွန်း', category: 'Communication' },
  { id: '130', word: '励まし', reading: 'はげまし', burmese: 'အားပေးကူညီခြင်း (စကားပြောရန် အားပေးခြင်း)', category: 'Communication' },
  { id: '131', word: '言い換え', reading: 'いいかえ', burmese: 'အဓိပ္ပာယ်တူ အခြားစကားလုံးဖြင့် ပြန်ပြောခြင်း', category: 'Communication' },
  { id: '132', word: '要約', reading: 'ようやく', burmese: 'အနှစ်ချုပ်ပြောဆိုခြင်း', category: 'Communication' },
  { id: '133', word: '沈黙の活用', reading: 'ちんもく', burmese: 'တိတ်ဆိတ်မှုကို အသုံးချခြင်း (User စဉ်းစားချိန်ပေးခြင်း)', category: 'Communication' },
  { id: '134', word: '個別化', reading: 'こべつか', burmese: 'လူတစ်ဦးချင်းစီကို သီးခြားစီ တန်ဖိုးထားဆက်ဆံခြင်း', category: 'Communication' },
  { id: '135', word: '意図的な感情表出', reading: 'いとてきなかんじょう', burmese: 'User ရဲ့ ခံစားချက်တွေကို လွတ်လပ်စွာ ဖော်ပြခွင့်ပေးခြင်း', category: 'Communication' },
  { id: '136', word: '統制された情緒的関与', reading: 'とうせいされた', burmese: 'Care worker က မိမိစိတ်ကို ထိန်းချုပ်ပြီး ကူညီခြင်း', category: 'Communication' },
  { id: '137', word: '非審判的態度', reading: 'ひしんぱんてき', burmese: 'အမှားအမှန် ဝေဖန်ပိုင်းခြားမှု မလုပ်သော စိတ်ထား', category: 'Communication' },
  { id: '138', word: 'クライエントの自己決定', reading: 'じこけってい', burmese: 'User ကိုယ်တိုင် ဆုံးဖြတ်ခွင့်ပေးခြင်း', category: 'Communication' },
  { id: '139', word: 'タクティールケア', reading: 'Taktile Care', burmese: 'ထိတွေ့မှုဖြင့် ဂရုစိုက်ခြင်း (လက်ကို ကိုင်ပေးခြင်း စသည်)', category: 'Communication' },
  { id: '140', word: 'バリデーション', reading: 'Validation', burmese: 'စိတ်ဖောက်ပြန်သူများ၏ ခံစားချက်ကို အသိအမှတ်ပြုပေးခြင်း', category: 'Communication' },
  { id: '141', word: '回想法', reading: 'かいそうほう', burmese: 'အတိတ်ကအကြောင်းများကို ပြန်ပြောပြစေပြီး စိတ်တည်ငြိမ်စေခြင်း', category: 'Communication' },
  { id: '142', word: '筆談', reading: 'ひつだん', burmese: 'စာရေးသားပြီး ဆက်သွယ်ခြင်း (နားမကြားသူများအတွက်)', category: 'Communication' },
  { id: '143', word: '点字', reading: 'てんじ', burmese: 'မျက်မမြင်စာ', category: 'Communication' },
  { id: '144', word: '自己覚知', reading: 'じこかくち', burmese: 'မိမိကိုယ်ကိုယ် ပြန်လည်ဆန်းစစ်ခြင်း (မိမိရဲ့ စိတ်ခံစားချက်နဲ့ အကျင့်စရိုက်ကို သိရှိခြင်း)', category: 'Communication' },
  { id: '145', word: '共感的理解', reading: 'きょうかんてきりかい', burmese: 'ကိုယ်ချင်းစာစိတ်ဖြင့် နားလည်ပေးခြင်း', category: 'Communication' },
  { id: '146', word: '明確化', reading: 'めいかくか', burmese: 'ရှင်းလင်းအောင် ပြုလုပ်ခြင်း (User ပြောတာ မရှင်းရင် ပြန်မေးခြင်း)', category: 'Communication' },
  { id: '147', word: '励ましと促し', reading: 'はげましとうながし', burmese: 'အားပေးခြင်းနှင့် စကားဆက်ပြောရန် တိုက်တွန်းခြင်း', category: 'Communication' },
  { id: '148', word: '非言語的要素', reading: 'ひげんごてきようそ', burmese: 'စကားလုံးမပါသော အချက်များ (မျက်နှာအမူအရာ၊ လက်ဟန်ခြေဟန်)', category: 'Communication' },
  { id: '149', word: 'パラ言語', reading: 'Para-language', burmese: 'စကားလုံးမဟုတ်သော အသံနေအသံထား (လေသံ၊ အနိမ့်အမြင့်၊ အမြန်နှုန်း)', category: 'Communication' },
  { id: '150', word: '視線', reading: 'しせん', burmese: 'မျက်လုံးချင်းဆုံခြင်း (Eye Contact)', category: 'Communication' },
  { id: '151', word: '面接の座り方', reading: 'めんせつのすわりかた', burmese: 'ထိုင်ပုံထိုင်နည်း (မျက်နှာချင်းဆိုင် သို့မဟုတ် L-shape ထိုင်ခြင်း)', category: 'Communication' },
  { id: '152', word: 'パーソナルスペース', reading: 'Personal Space', burmese: 'တစ်ဦးချင်းစီ၏ လုံခြုံစိတ်ချရသော အကွာအဝေး', category: 'Communication' },
  { id: '153', word: '手話', reading: 'しゅわ', burmese: 'လက်ဟန်ခြေဟန်စကား', category: 'Communication' },
  { id: '154', word: '補聴器', reading: 'ほちょうき', burmese: 'နားကြားကိရိယာ', category: 'Communication' },
  { id: '155', word: '構音障害', reading: 'こうおんしょうがい', burmese: 'စကားသံ ပီသစွာ မထွက်နိုင်ခြင်း (Articulating disorder)', category: 'Communication' },
  { id: '156', word: '失語症', reading: 'しつごしょう', burmese: 'စကားပြောစွမ်းရည် ချို့ယွင်းခြင်း (Aphasia)', category: 'Communication' },
  { id: '157', word: 'バイステックの7原則', reading: 'Biestek', burmese: 'ဘိုက်စတက်၏ အခြေခံမူ ၇ ချက် (Professional ဆက်ဆံရေးအတွက် အရေးကြီးဆုံး)', category: 'Communication' },

  // 12. 介護技術 (Caregiving Techniques)
  { id: '158', word: 'ボディメカニクス', reading: 'Body Mechanics', burmese: 'လူနာကို မရာမှာ ကိုယ့်ခါးမနာအောင် အင်အားသုံးနည်း', category: 'Caregiving Techniques' },
  { id: '159', word: '支持基底面', reading: 'しじきていめん', burmese: 'ခန္ဓာကိုယ်ကို ထောက်ကန်ထားသော ဧရိယာ (ခြေထောက်ကို ကျယ်ကျယ်ဖြဲထားခြင်း)', category: 'Caregiving Techniques' },
  { id: '160', word: '重心', reading: 'じゅうしん', burmese: 'ခန္ဓာကိုယ်ရဲ့ ဗဟိုချက် (Gravity center)', category: 'Caregiving Techniques' },
  { id: '161', word: '摩擦', reading: 'まさつ', burmese: 'ပွတ်တိုက်မှု (မရွှေ့ခင် ပွတ်တိုက်မှုကို လျှော့ချရမည်)', category: 'Caregiving Techniques' },
  { id: '162', word: 'てこの原理', reading: 'てこのげんり', burmese: 'မောင်းတံသဘောတရား (Lever principle)', category: 'Caregiving Techniques' },
  { id: '163', word: '垂直', reading: 'すいちょく', burmese: 'ထောင့်မတ်ကျခြင်း (လူနာကို ကိုယ့်ဆီသို့ ကပ်ထားခြင်း)', category: 'Caregiving Techniques' },
  { id: '164', word: '嚥下', reading: 'えんげ', burmese: 'မျိုချခြင်း', category: 'Caregiving Techniques' },
  { id: '165', word: '咀嚼', reading: 'そしゃく', burmese: 'ဝါးခြင်း', category: 'Caregiving Techniques' },
  { id: '166', word: '誤嚥', reading: 'ごえん', burmese: 'အစာမှားဝင်ခြင်း (အသက်ရှူလမ်းကြောင်းထဲ အစာဝင်ခြင်း)', category: 'Caregiving Techniques' },
  { id: '167', word: '誤嚥性肺炎', reading: 'ごえんせいはいえん', burmese: 'အစာမှားဝင်ရာမှ ဖြစ်ပွားသော အဆုတ်ရောင်ရောဂါ', category: 'Caregiving Techniques' },
  { id: '168', word: 'とろみ', reading: 'とろみ', burmese: 'အစာ/ရေကို ပျစ်အောင်ပြုလုပ်ခြင်း (မျိုချရလွယ်စေရန်)', category: 'Caregiving Techniques' },
  { id: '169', word: '自助具', reading: 'じじょぐ', burmese: 'ကိုယ်တိုင်စားသောက်နိုင်အောင် ကူညီပေးသည့် ကိရိယာ (ဇွန်း/ခက်ရင်း အထူးဒီဇိုင်းများ)', category: 'Caregiving Techniques' },
  { id: '170', word: 'ポータブルトイレ', reading: 'Portable Toilet', burmese: 'အိတ်ဆောင်အိမ်သာ (ခုတင်ဘေးတွင် ထားသော အိမ်သာ)', category: 'Caregiving Techniques' },
  { id: '171', word: '差し込み便器', reading: 'さしこみべんき', burmese: 'ခုတင်ပေါ်တွင် အိပ်လျက်သုံးသော အိမ်သာခွက်', category: 'Caregiving Techniques' },
  { id: '172', word: '失禁', reading: 'しっきん', burmese: 'ဆီး/ဝမ်း မထိန်းနိုင်ခြင်း (Incontinence)', category: 'Caregiving Techniques' },
  { id: '173', word: '尿意', reading: 'にょい', burmese: 'ဆီးသွားချင်စိတ်', category: 'Caregiving Techniques' },
  { id: '174', word: '便意', reading: 'べんい', burmese: 'ဝမ်းသွားချင်စိတ်', category: 'Caregiving Techniques' },
  { id: '175', word: '陰部洗浄', reading: 'いんぶせんじょう', burmese: 'အင်္ဂါအစိတ်အပိုင်းများကို ဆေးကြောသန့်စင်ပေးခြင်း', category: 'Caregiving Techniques' },
  { id: '176', word: '整容', reading: 'せいよう', burmese: 'ရုပ်ရည်သန့်ပြန့်အောင် ပြုပြင်ခြင်း (ဆံပင်ဖြီးခြင်း၊ သွားတိုက်ခြင်း)', category: 'Caregiving Techniques' },
  { id: '177', word: '清拭', reading: 'せいしき', burmese: 'ရေပတ်တိုက်ပေးခြင်း (ရေမချိုးနိုင်သူများအတွက်)', category: 'Caregiving Techniques' },
  { id: '178', word: '機械浴', reading: 'きかいよく', burmese: 'စက်ဖြင့် ရေချိုးပေးခြင်း', category: 'Caregiving Techniques' },
  { id: '179', word: 'シャワーチェア', reading: 'Shower Chair', burmese: 'ရေချိုးခန်းသုံး ကုလားထိုင်', category: 'Caregiving Techniques' },
  { id: '180', word: '褥瘡', reading: 'じょくそう', burmese: 'အိပ်ရာနာ (Pressure sore) - 🔴 High Priority', category: 'Caregiving Techniques' },
  { id: '181', word: '脱健着患', reading: 'だっけんちゃっかん', burmese: 'အကောင်းဘက်ကချွတ်၊ အနာဘက်ကဝတ် (အရေးကြီးဆုံး Rule!)', category: 'Caregiving Techniques' },
  { id: '182', word: '麻痺', reading: 'まひ', burmese: 'လေဖြတ်ခြင်း/သေခြင်း (Paralysis)', category: 'Caregiving Techniques' },
  { id: '183', word: '患側', reading: 'かんそく', burmese: 'မသန်စွမ်းသောဘက် (ထိခိုက်ထားသောဘက်)', category: 'Caregiving Techniques' },
  { id: '184', word: '健側', reading: 'けんそく', burmese: 'သန်စွမ်းသောဘက် (ကောင်းသောဘက်)', category: 'Caregiving Techniques' },

  // 13. 身体の構造と機能 (Body Structure & Function)
  { id: '185', word: '骨粗鬆症', reading: 'こつそしょうしょう', burmese: 'အရိုးပွရောဂါ (လူကြီးများတွင် အရိုးကျိုးလွယ်ခြင်း)', category: 'Body Structure & Function' },
  { id: '186', word: '関節可動域', reading: 'かんせつかどういき', burmese: 'အဆစ်အမြစ် လှုပ်ရှားနိုင်သော အတိုင်းအတာ (ROM)', category: 'Body Structure & Function' },
  { id: '187', word: '消化・吸収', reading: 'しょうか・きゅうしゅう', burmese: 'အစာခြေခြင်းနှင့် အာဟာရစုပ်ယူခြင်း', category: 'Body Structure & Function' },
  { id: '188', word: '恒常性', reading: 'こうじょうせい', burmese: 'ခန္ဓာကိုယ်တွင်း မျှခြေကို ထိန်းသိမ်းခြင်း (Homeostasis)', category: 'Body Structure & Function' },
  { id: '189', word: 'バイタルサイン', reading: 'Vital Signs', burmese: 'အသက်ရှင်သန်မှု လက္ခဏာများ (သွေးပေါင်၊ အပူချိန်၊ အသက်ရှူနှုန်း၊ သွေးခုန်နှုန်း)', category: 'Body Structure & Function' },

  // 14. 老化の理解 (Understanding Aging)
  { id: '190', word: '生理的変化', reading: 'せいりてきへんか', burmese: 'သဘာဝအလျောက် ရုပ်ပိုင်းဆိုင်ရာ ပြောင်းလဲမှုများ', category: 'Understanding Aging' },
  { id: '191', word: '予備能力の低下', reading: 'よびのうりょくのていか', burmese: 'အရန်စွမ်းအင် လျော့နည်းလာခြင်း (ဖျားနာလျှင် ပြန်ကောင်းရန် ကြာခြင်း)', category: 'Understanding Aging' },
  { id: '192', word: '流動性知能', reading: 'りゅうどうせいちのう', burmese: 'အသစ်အဆန်းကို မြန်မြန်သင်ယူနိုင်စွမ်း (အသက်ကြီးလျှင် ကျဆင်းသည်)', category: 'Understanding Aging' },
  { id: '193', word: '結晶性知能', reading: 'けっしょうせいちのう', burmese: 'အတွေ့အကြုံနှင့် ဗဟုသုတ (အသက်ကြီးသော်လည်း မကျဆင်းပါ - 🔴 High Priority)', category: 'Understanding Aging' },

  // 15. 症状と疾患 (Symptoms & Diseases)
  { id: '194', word: '脱水', reading: 'だっすい', burmese: 'ရေဓာတ်ခန်းခြောက်ခြင်း (လူကြီးများတွင် ရေငတ်စိတ် နည်းတတ်သည်)', category: 'Symptoms & Diseases' },
  { id: '195', word: '浮腫', reading: 'ふしゅ / むくみ', burmese: 'ဖောရောင်ခြင်း', category: 'Symptoms & Diseases' },
  { id: '196', word: '便秘', reading: 'べんぴ', burmese: 'ဝမ်းချုပ်ခြင်း', category: 'Symptoms & Diseases' },
  { id: '197', word: '不眠', reading: 'ふみん', burmese: 'အိပ်မပျော်ခြင်း (လူကြီးများတွင် အိပ်ချိန်တိုတောင်းပြီး နိုးလွယ်သည်)', category: 'Symptoms & Diseases' },

  // 16. 廃用症候群 (Disuse Syndrome)
  { id: '198', word: '廃用症候群', reading: 'はいようしょうこうぐん', burmese: 'အိပ်ရာထဲ အကြာကြီး လဲနေခြင်းကြောင့် ကြွက်သားနှင့် စိတ်ပိုင်းဆိုင်ရာ အားနည်းလာခြင်း (Disuse Syndrome)', category: 'Disuse Syndrome' },
  { id: '199', word: '筋萎縮', reading: 'きんいしゅく', burmese: 'ကြွက်သား သိမ်လှည်ခြင်း', category: 'Disuse Syndrome' },
  { id: '200', word: '拘縮', reading: 'こうしゅく', burmese: 'အဆစ်အမြစ်များ တောင့်တင်းသွားခြင်း', category: 'Disuse Syndrome' },
  { id: '201', word: '起立性低血圧', reading: 'きりつせいていけいあつ', burmese: 'ရုတ်တရက် ထရပ်လိုက်လျှင် သွေးပေါင်ကျခြင်း (မူးဝေခြင်း)', category: 'Disuse Syndrome' },

  // 17. 終末期 (End of Life)
  { id: '202', word: '終末期', reading: 'しゅうまつき', burmese: 'Terminal stage (ဘဝနေဝင်ချိန်)', category: 'End of Life' },
  { id: '203', word: '死の三徴候', reading: 'しのさんちょうこう', burmese: 'သေဆုံးခြင်း၏ လက္ခဏာ ၃ ပါး (နှလုံးရပ်ခြင်း၊ အသက်ရှူရပ်ခြင်း၊ မျက်သူငယ် ကျယ်လာခြင်း)', category: 'End of Life' },
  { id: '204', word: 'グリーフケア', reading: 'Grief Care', burmese: 'ကျန်ရစ်သူမိသားစု၏ ပူဆွေးမှုကို နှစ်သိမ့်ပေးခြင်း', category: 'End of Life' },

  // 18. 発達の基礎 (Developmental Basics)
  { id: '205', word: '発達勾配', reading: 'はったつこうばい', burmese: 'ဖွံ့ဖြိုးမှု အစဉ်အတိုင်းဖြစ်ခြင်း (ဥပမာ - ခေါင်းပိုင်းမှ ခြေထောက်ပိုင်းသို့ ဖွံ့ဖြိုးခြင်း)', category: 'Developmental Basics' },
  { id: '206', word: '永遠の青年', reading: 'えいえんのせいねん', burmese: 'အမြဲတမ်း လူငယ်ဖြစ်ချင်စိတ် (Erikson ၏ သီအိုရီတွင် ပါလေ့ရှိသည်)', category: 'Developmental Basics' },
  { id: '207', word: 'アイデンティティ', reading: 'Identity', burmese: 'မိမိကိုယ်ကိုယ် မည်သူမည်ဝါဖြစ်ကြောင်း သိရှိမှု (လူပျို/အပျိုဖော်ဝင်ချိန်တွင် အရေးကြီးသည်)', category: 'Developmental Basics' },
  { id: '208', word: 'ライフサイクル', reading: 'Life Cycle', burmese: 'ဘဝစက်ဝန်း (မွေးဖွားခြင်းမှ သေဆုံးခြင်းအထိ အဆင့်ဆင့်)', category: 'Developmental Basics' },
  { id: '209', word: '発達課題', reading: 'はったつかだい', burmese: 'ဖွံ့ဖြိုးမှုဆိုင်ရာ တာဝန်များ (အဆင့်အရွယ်အလိုက် လုပ်ဆောင်ရမည့် အရာများ)', category: 'Developmental Basics' },

  // Refined Aging & Symptoms
  { id: '210', word: '適応能力の低下', reading: 'てきおうのうりょくのていか', burmese: 'ပတ်ဝန်းကျင်နှင့် လိုက်လျောညီထွေဖြစ်မှု လျော့နည်းခြင်း (ဥပမာ - ရာသီဥတုဒဏ် မခံနိုင်ခြင်း)', category: 'Understanding Aging' },
  { id: '211', word: '恒常性維持', reading: 'こうじょうせいいじ', burmese: 'ခန္ဓာကိုယ်တွင်း မျှခြေကို ထိန်းသိမ်းနိုင်စွမ်း (Homeostasis) ကျဆင်းခြင်း', category: 'Understanding Aging' },
  { id: '212', word: '老年期鬱', reading: 'ろうねんきうつ', burmese: 'သက်ကြီးပိုင်း စိတ်ကျရောဂါ', category: 'Understanding Aging' },
  { id: '213', word: 'せん妄', reading: 'せんもう', burmese: 'စိတ်ရှုပ်ထွေးခြင်း (Delirium) - ရုတ်တရက် သတိလစ်သလို ဖြစ်ခြင်း။', category: 'Understanding Aging' },
  { id: '214', word: '短期記憶', reading: 'たんききおく', burmese: 'ရေတိုမှတ်ဉာဏ် (လူကြီးများတွင် ကျဆင်းလွယ်သည်)', category: 'Understanding Aging' },
  { id: '215', word: '長期記憶', reading: 'ちょうききおく', burmese: 'ရေရှည်မှတ်ဉာဏ် (အတိတ်ကအကြောင်းအရာများကို ကောင်းကောင်းမှတ်မိနေခြင်း)', category: 'Understanding Aging' },
  { id: '216', word: '血圧の変動', reading: 'けつあつのへんどう', burmese: 'သွေးပေါင်ချိန် အတက်အကျမြန်ခြင်း', category: 'Symptoms & Diseases' },

  // 19. 認知症の理解 (Understanding Dementia)
  { id: '217', word: '中核症状', reading: 'ちゅうかくしょうじょう', burmese: 'ဦးနှောက်ပျက်စီးမှုကြောင့် တိုက်ရိုက်ဖြစ်သော လက္ခဏာများ (Core Symptoms)', category: 'Dementia' },
  { id: '218', word: '記憶障害', reading: 'きおくしょうがい', burmese: 'မှတ်ဉာဏ်ချို့ယွင်းခြင်း (အထူးသဖြင့် လတ်တလောဖြစ်ရပ်များကို မေ့ခြင်း)', category: 'Dementia' },
  { id: '219', word: '見当識障害', reading: 'けんとうしきしょうがい', burmese: 'ပတ်ဝန်းကျင်ကို ဝေခွဲမရဖြစ်ခြင်း (အချိန်၊ နေရာ၊ လူ ကို မသိတော့ခြင်း)', category: 'Dementia' },
  { id: '220', word: '実行機能障害', reading: 'じっこうきのうしょうがい', burmese: 'စီစဉ်ဆောင်ရွက်နိုင်စွမ်း ပျက်စီးခြင်း (ဟင်းချက်ခြင်းကဲ့သို့ အဆင့်ဆင့်လုပ်ရသော အလုပ်များ မလုပ်နိုင်တော့ခြင်း)', category: 'Dementia' },
  { id: '221', word: '失認', reading: 'しつにん', burmese: 'အသိအမှတ်မပြုနိုင်ခြင်း (မျက်စိနဲ့မြင်ပေမဲ့ ဘာပစ္စည်းလဲဆိုတာ မသိခြင်း)', category: 'Dementia' },
  { id: '222', word: '失行', reading: 'しっこう', burmese: 'လှုပ်ရှားမှု ပျက်ယွင်းခြင်း (ခန္ဓာကိုယ် ကျန်းမာပေမဲ့ အင်္ကျီကြယ်သီးတပ်တာမျိုး မလုပ်တတ်တော့ခြင်း)', category: 'Dementia' },
  { id: '223', word: '失語', reading: 'しつご', burmese: 'စကားပြောစွမ်းရည် ချို့ယွင်းခြင်း (Aphasia)', category: 'Dementia' },
  { id: '224', word: 'BPSD', reading: 'BPSD', burmese: 'စိတ်ပိုင်းဆိုင်ရာနှင့် အမူအကျင့်လက္ခဏာများ (Behavioral and Psychological Symptoms of Dementia)', category: 'Dementia' },
  { id: '225', word: '徘徊', reading: 'はいかい', burmese: 'ရည်ရွယ်ချက်မရှိဘဲ လမ်းလျှောက်သွားလာနေခြင်း (Wandering)', category: 'Dementia' },
  { id: '226', word: '弄便', reading: 'ろうべん', burmese: 'မစင်ကို လက်ဖြင့် ကိုင်တွယ်ဆော့ကစားခြင်း', category: 'Dementia' },
  { id: '227', word: '幻視', reading: 'げんし', burmese: 'မရှိတာကို မြင်ခြင်း (Visual Hallucination) - (Lewy Body တွင် အဖြစ်များ)', category: 'Dementia' },
  { id: '228', word: 'もの取られ妄想', reading: 'ものとられもうそう', burmese: 'ပစ္စည်းအခိုးခံရသည်ဟု ထင်ယောင်ထင်မှားဖြစ်ခြင်း (Alzheimer တွင် အဖြစ်များ)', category: 'Dementia' },
  { id: '229', word: '抑うつ', reading: 'よくうつ', burmese: 'စိတ်ဓာတ်ကျခြင်း (Depression)', category: 'Dementia' },
  { id: '230', word: 'アパシー', reading: 'Apathy', burmese: 'စိတ်ပါဝင်စားမှု လုံးဝမရှိတော့ခြင်း (ဘာမှမလုပ်ချင်တော့ခြင်း)', category: 'Dementia' },
  { id: '231', word: 'アルツハイマー型認知症', reading: 'Alzheimer', burmese: 'ဦးနှောက်ကျုံ့သွားခြင်းကြောင့် ဖြစ်သည်။ (အမျိုးသမီး ပိုဖြစ်သည်)', category: 'Dementia' },
  { id: '232', word: '血管性認知症', reading: 'Vascular Dementia', burmese: 'ဦးနှောက်သွေးကြောရောဂါကြောင့် ဖြစ်သည်။ (သွေးတိုးသမားများ သတိထားရမည်)', category: 'Dementia' },
  { id: '233', word: 'まだら認知症', reading: 'Madara Ninshisho', burmese: '"ကွက်ကြား" စိတ်ဖောက်ပြန်မှု (ကောင်းလိုက်၊ မကောင်းလိုက်ဖြစ်ခြင်း)', category: 'Dementia' },
  { id: '234', word: 'レビー小体型認知症', reading: 'Lewy Body', burmese: 'ထင်ယောင်ထင်မှားမြင်ခြင်းနှင့် Parkinson လက္ခဏာများ ပါဝင်သည်။', category: 'Dementia' },
  { id: '235', word: '前頭側頭型認知症', reading: 'Pick\'s Disease', burmese: 'ရှေ့ဦးနှောက်ပိုင်း ထိခိုက်ခြင်း (ပင်ကိုယ်စရိုက် ပြောင်းလဲသွားခြင်း)', category: 'Dementia' },
  { id: '236', word: 'パーソン・センタード・ケア', reading: 'Person-Centered Care', burmese: 'လူကို ဗဟိုပြုသော ဂရုစိုက်မှု', category: 'Dementia' },
  { id: '237', word: 'バリデーション', reading: 'Validation', burmese: 'User ရဲ့ ခံစားချက်ကို အမှန်အတိုင်း လက်ခံပြီး စကားပြောခြင်း', category: 'Dementia' },
  { id: '238', word: '回想法', reading: 'かいそうほう', burmese: 'အတိတ်က ပျော်စရာမှတ်ဉာဏ်များကို ပြန်ပြောပြစေခြင်း (Reminiscence)', category: 'Dementia' },
  { id: '239', word: 'ユマニチュード', reading: 'Humanitude', burmese: '"ကြည့်ခြင်း" "စကားပြောခြင်း" "ထိတွေ့ခြင်း" "မတ်တပ်ရပ်ခြင်း" စသည့် နည်းစနစ် ၄ မျိုး', category: 'Dementia' },

  // 20. 障害の理解 (Understanding Disabilities)
  { id: '240', word: 'ICIDH', reading: '国際障害分類', burmese: '(စနစ်ဟောင်း) မသန်စွမ်းမှုကို "ရောဂါ/အားနည်းချက်" အဖြစ်သာ ကြည့်ခြင်း။', category: 'Disabilities' },
  { id: '241', word: 'ICF', reading: '国際生活機能分類', burmese: '(စနစ်သစ်) မသန်စွမ်းမှုကို "ပတ်ဝန်းကျင်နှင့် လူ၏လုပ်ဆောင်နိုင်စွမ်း" ကြား ဆက်စပ်မှုအဖြစ် ကြည့်ခြင်း။', category: 'Disabilities' },
  { id: '242', word: '環境因子', reading: 'かんきょういんし', burmese: 'ပတ်ဝန်းကျင်ဆိုင်ရာ အချက်များ (ဥပမာ - ဘီးတပ်ကုလားထိုင်အတွက် လမ်းရှိမရှိ)။', category: 'Disabilities' },
  { id: '243', word: '個人因子', reading: 'こじんいんし', burmese: 'ပုဂ္ဂိုလ်ရေးဆိုင်ရာ အချက်များ (ဥပမာ - အသက်၊ ကျား/မ၊ အလုပ်အကိုင်)။', category: 'Disabilities' },
  { id: '244', word: '心身機能・身体構造', reading: 'しんしんきのう・しんたいこうぞう', burmese: 'ခန္ဓာကိုယ်၏ လုပ်ဆောင်ချက်နှင့် ဖွဲ့စည်းပုံ။', category: 'Disabilities' },
  { id: '245', word: '活動', reading: 'かつどう', burmese: 'လှုပ်ရှားဆောင်ရွက်မှု (ဥပမာ - လမ်းလျှောက်ခြင်း)။', category: 'Disabilities' },
  { id: '246', word: '参加', reading: 'さんか', burmese: 'လူမှုရေးရာများတွင် ပါဝင်ခြင်း (ဥပမာ - အလုပ်လုပ်ခြင်း၊ အသင်းအဖွဲ့ဝင်ခြင်း)။', category: 'Disabilities' },
  { id: '247', word: '視覚障害', reading: 'しかくしょうがい', burmese: 'အမြင်အာရုံ ချို့ယွင်းခြင်း။', category: 'Disabilities' },
  { id: '248', word: '聴覚・言語障害', reading: 'ちょうかく・げんごしょうがい', burmese: 'အကြားအာရုံနှင့် စကားပြောစွမ်းရည် ချို့ယွင်းခြင်း။', category: 'Disabilities' },
  { id: '249', word: '肢体不自由', reading: 'したいふじゆう', burmese: 'ခြေလက်အင်္ဂါ မသန်စွမ်းခြင်း။', category: 'Disabilities' },
  { id: '250', word: '内部障害', reading: 'ないぶしょうがい', burmese: 'ခန္ဓာကိုယ်တွင်း အင်္ဂါများ ချို့ယွင်းခြင်း (ဥပမာ - နှလုံး၊ ကျောက်ကပ်)။', category: 'Disabilities' },
  { id: '251', word: '高次脳機能障害', reading: 'こうじのうきのうしょうがい', burmese: 'ဦးနှောက်ထိခိုက်မှုကြောင့် မှတ်ဉာဏ်၊ အာရုံစူးစိုက်မှု ချို့ယွင်းခြင်း။', category: 'Disabilities' },
  { id: '252', word: '知的障害', reading: 'ちてきしょうがい', burmese: 'ဉာဏ်ရည်မသန်စွမ်းခြင်း (ငယ်စဉ်ကတည်းက ဖြစ်လေ့ရှိသည်)။', category: 'Disabilities' },
  { id: '253', word: '精神障害', reading: 'せいしんしょうがい', burmese: 'စိတ်ကျန်းမာရေး ချို့ယွင်းခြင်း (ဥပမာ - စိတ်ကွဲရောဂါ Schizophrenia)။', category: 'Disabilities' },
  { id: '254', word: '発達障害', reading: 'はったつしょうがい', burmese: 'ဖွံ့ဖြိုးမှုဆိုင်ရာ ချို့ယွင်းခြင်း (ဥပမာ - Autism, ADHD)။', category: 'Disabilities' },
  { id: '255', word: '自閉症スペクトラム', reading: 'ASD', burmese: 'အော်တစ်ဇင် (လူမှုဆက်ဆံရေး ခက်ခဲခြင်း)။', category: 'Disabilities' },
  { id: '256', word: '注意欠如・多動症', reading: 'ADHD', burmese: 'အာရုံစူးစိုက်မှုနည်းပြီး ဂဏာမငြိမ်ဖြစ်ခြင်း။', category: 'Disabilities' },
  { id: '257', word: '合理的配慮', reading: 'ごうりてきはいりょ', burmese: 'သင့်တင့်လျောက်ပတ်သော ညှိနှိုင်းမှု (မသန်စွမ်းသူများအတွက် အတားအဆီးများ ဖယ်ရှားပေးခြင်း)။', category: 'Disabilities' },
  { id: '258', word: '欠格条項', reading: 'けっかくじょうこう', burmese: 'အရည်အချင်း ကန့်သတ်ချက်ဆိုင်ရာ စည်းမျဉ်းများ။', category: 'Disabilities' },
  { id: '259', word: '欠格事由', reading: 'けっかくじゆう', burmese: 'အရည်အချင်းမပြည့်မီသော အကြောင်းရင်းများ။', category: 'Disabilities' },

  // 21. 医療的ケア (Medical Care)
  { id: '260', word: '医療行為', reading: 'いりょうこうい', burmese: 'ဆေးဘက်ဆိုင်ရာ လုပ်ဆောင်မှု (ဆရာဝန်နှင့် နာ့စ်များသာ လုပ်ပိုင်ခွင့်ရှိသည်)', category: 'Medical Care' },
  { id: '261', word: '医務行為の例外', reading: 'いむこういのれいがい', burmese: 'ဆေးဘက်ဆိုင်ရာလုပ်ဆောင်မှုဖြစ်သော်လည်း Care Worker ကို လုပ်ခွင့်ပြုထားသော ချွင်းချက်များ', category: 'Medical Care' },
  { id: '262', word: '喀痰吸引', reading: 'かくたんきゅういん', burmese: 'ချွဲထုတ်ပေးခြင်း (Suction)', category: 'Medical Care' },
  { id: '263', word: '経管栄養', reading: 'けいかんえいよう', burmese: 'ပိုက်ဖြင့် အာဟာရကျွေးခြင်း (Tube Feeding)', category: 'Medical Care' },
  { id: '264', word: '指示書', reading: 'しじしょ', burmese: 'ဆရာဝန်၏ ညွှန်ကြားချက်လွှာ (ဒါရှိမှ လုပ်ဆောင်ခွင့်ရှိသည်)', category: 'Medical Care' },
  { id: '265', word: '同意書', reading: 'どういしょ', burmese: 'သဘောတူညီချက်လက်မှတ် (User သို့မဟုတ် မိသားစုထံမှ ရယူရမည်)', category: 'Medical Care' },
  { id: '266', word: '連携', reading: 'れんけい', burmese: 'ဆရာဝန်၊ နာ့စ်တို့နှင့် ချိတ်ဆက်ဆောင်ရွက်ခြင်း', category: 'Medical Care' },
  { id: '267', word: '口腔内', reading: 'こうくうない', burmese: 'ပါးစပ်အတွင်းပိုင်း', category: 'Medical Care' },
  { id: '268', word: '鼻腔内', reading: 'びくうない', burmese: 'နှာခေါင်းအတွင်းပိုင်း', category: 'Medical Care' },
  { id: '269', word: '気管カニューレ内部', reading: 'きかんかにゅーれないぶ', burmese: 'လည်ပင်းဖောက်ထားသော ပိုက်အတွင်းပိုင်း', category: 'Medical Care' },
  { id: '270', word: '吸引カテーテル', reading: 'きゅういんかてーてる', burmese: 'ချွဲစုပ်ထုတ်သည့် ပိုက်အသေး (Catheter)', category: 'Medical Care' },
  { id: '271', word: '無菌状態', reading: 'むきんじょうたい', burmese: 'ပိုးမွှားကင်းစင်သော အခြေအနေ (Sterile)', category: 'Medical Care' },
  { id: '272', word: '粘膜損傷', reading: 'ねんまくそんしょう', burmese: 'အတွင်းသား နံရံများ ထိခိုက်ရှေခြင်း (⚠️ အထူးသတိထားရမည့်အချက်)', category: 'Medical Care' },
  { id: '273', word: '胃ろう', reading: 'いろう', burmese: 'အစာအိမ်ကို တိုက်ရိုက်ဖောက်၍ ကျွေးခြင်း (Gastrostomy)', category: 'Medical Care' },
  { id: '274', word: '鼻胃管', reading: 'びいかん', burmese: 'နှာခေါင်းမှတစ်ဆင့် အစာအိမ်ထဲ ပိုက်ထည့်ကျွေးခြင်း (Nasogastric tube)', category: 'Medical Care' },
  { id: '275', word: '栄養剤', reading: 'えいようざい', burmese: 'အာဟာရရည်', category: 'Medical Care' },
  { id: '276', word: '注入', reading: 'ちゅうにゅう', burmese: 'အာဟာရရည်ကို ပိုက်ထဲသို့ ထည့်သွင်းခြင်း', category: 'Medical Care' },
  { id: '277', word: '半固形剤', reading: 'はんこけいざい', burmese: 'အနှစ်ကဲ့သို့ ပျစ်သော အာဟာရရည်', category: 'Medical Care' },
  { id: '278', word: '逆流', reading: 'ぎゃくりゅう', burmese: 'အစာများ အပေါ်သို့ ပြန်တက်လာခြင်း (⚠️ အန္တရာယ်ရှိသည်)', category: 'Medical Care' },

  // 22. 介護過程 (Care Process)
  { id: '279', word: 'アセスメント', reading: 'Assessment', burmese: 'User ၏ လိုအပ်ချက်နှင့် ပြဿနာများကို ဆန်းစစ်လေ့လာခြင်း', category: 'Care Process' },
  { id: '280', word: '客観的情報', reading: 'きゃっかんてきじょうほう', burmese: 'မျက်မြင်ကိုယ်တွေ့ အချက်အလက် (ဥပမာ - အဖျားတိုင်းလို့ရသော အပူချိန်)', category: 'Care Process' },
  { id: '281', word: '主観的情報', reading: 'しゅかんてきじょうほう', burmese: 'User ပြောပြသော ขံစားချက် (ဥပမာ - "နေလို့မကောင်းဘူး" ဟု ပြောခြင်း)', category: 'Care Process' },
  { id: '282', word: '生活課題', reading: 'せいかつかだい', burmese: 'လူမှုဘဝပြဿနာ (User ဘာဖြစ်ချင်သလဲ၊ ဘာလိုအပ်နေသလဲ)', category: 'Care Process' },
  { id: '283', word: 'ニーズ', reading: 'Needs', burmese: 'အမှန်တကယ် လိုအပ်ချက် (User က "လမ်းလျှောက်ချင်တယ်" ဆိုလျှင် "ခြေထောက်သန်မာလာရန်" မှာ Needs ဖြစ်သည်)', category: 'Care Process' },
  { id: '284', word: '介護計画', reading: 'かいごけいかく', burmese: 'ဂရုစိုက်မှု အစီအစဉ်', category: 'Care Process' },
  { id: '285', word: '長期目標', reading: 'ちょうきもくひょう', burmese: 'ရေရှည်ပန်းတိုင် (ဥပမာ - ၁ နှစ်အတွင်း ဘီးတပ်ကုလားထိုင်မပါဘဲ သွားနိုင်ရန်)', category: 'Care Process' },
  { id: '286', word: '短期目標', reading: 'たんきもくひょう', burmese: 'ရေတိုပန်းတိုင် (ဥပမာ - ၁ လအတွင်း ကိုယ့်ဘာကိုယ် မတ်တပ်ရပ်နိုင်ရန်)', category: 'Care Process' },
  { id: '287', word: '優先順位', reading: 'ゆうせんじゅんい', burmese: 'ဦးစားပေးအစီအစဉ် (အသက်အန္တရာယ်နှင့် ဘေးကင်းရေးကို အရင်လုပ်ရမည်)', category: 'Care Process' },
  { id: '288', word: '実施', reading: 'じっし', burmese: 'အစီအစဉ်အတိုင်း လက်တွေ့လုပ်ဆောင်ခြင်း', category: 'Care Process' },
  { id: '289', word: '介護記録', reading: 'かいごきろく', burmese: 'ဂရုစိုက်မှု မှတ်တမ်း (အချက်အလက်များကို ချရေးခြင်း)', category: 'Care Process' },
  { id: '290', word: '逐語録', reading: 'ちくごろく', burmese: 'ပြောစကားအတိုင်း တိတိကျကျ မှတ်တမ်းတင်ခြင်း', category: 'Care Process' },
  { id: '291', word: '標準化', reading: 'ひょうじゅんか', burmese: 'စံသတ်မှတ်ခြင်း (ဘယ်သူလုပ်လုပ် တူညီသော အရည်အသွေးရစေရန်)', category: 'Care Process' },
  { id: '292', word: '評価', reading: 'ひょうか', burmese: 'လုပ်ဆောင်ချက် အောင်မြင်မှု ရှိ/မရှိ ပြန်လည်စစ်ဆေးခြင်း', category: 'Care Process' },
  { id: '293', word: 'モニタリング', reading: 'Monitoring', burmese: 'အခြေအနေကို စောင့်ကြည့်လေ့လာခြင်း', category: 'Care Process' },
  { id: '294', word: 'フィードバック', reading: 'Feedback', burmese: 'ရလာဒ်အပေါ်မူတည်ပြီး အကြံပြုချက်ပေးခြင်း', category: 'Care Process' },
  { id: '295', word: '再アセスメント', reading: 'Re-assessment', burmese: 'အစီအစဉ်မအောင်မြင်ပါက တစ်ကျော့ပြန် အချက်အလက်စုဆောင်းခြင်း', category: 'Care Process' },

  // 23. 社会支援と生活環境 (Social Support & Environment)
  { id: '296', word: 'サ高住', reading: 'Sakoju', burmese: 'ဝန်ဆောင်မှုပါသော သက်ကြီးရွယ်အို အိမ်ရာ (Service-provider House)', category: 'Social Support' },
  { id: '297', word: '有料老人ホーム', reading: 'ゆうりょうろうじんほーむ', burmese: 'ပုဂ္ဂလိက လူကြီးဂေဟာ', category: 'Social Support' },
  { id: '298', word: 'グループホーム', reading: 'Group Home', burmese: 'စိတ်ဖောက်ပြန်သူများ စုပေါင်းနေထိုင်သော အိမ်', category: 'Social Support' },
  { id: '299', word: '手すりの設置', reading: 'てすりのせっち', burmese: 'လက်ရန်းတပ်ဆင်ခြင်း (ချော်လဲခြင်း ကာကွယ်ရန်)', category: 'Social Support' },
  { id: '300', word: '段差解消', reading: 'だんしゃかいしょう', burmese: 'အနိမ့်အမြင့် အတားအဆီးများ ဖယ်ရှားခြင်း', category: 'Social Support' },
  { id: '301', word: 'サービス担当者会議', reading: 'さーびすたんとうしゃかいぎ', burmese: 'ဝန်ဆောင်မှုပေးသူများ အစည်းအဝေး (Care Plan အတွက် အရေးကြီးသည်)', category: 'Social Support' },
  { id: '302', word: 'MSW', reading: 'Medical Social Worker', burmese: 'ဆေးရုံနှင့် လူမှုရေးရာ ချိတ်ဆက်ပေးသူ', category: 'Social Support' },
  { id: '303', word: '訪問看護ステーション', reading: 'ほうもんかんごすてーしょん', burmese: 'အိမ်တိုင်ရာရောက် နာ့စ် ဝန်ဆောင်မှုဌာန', category: 'Social Support' },
  { id: '304', word: '主治医', reading: 'しゅじい', burmese: 'တာဝန်ခံ ဆရာဝန် (User ရဲ့ အခြေအနေကို အသိဆုံးသူ)', category: 'Social Support' },
  { id: '305', word: '民生委員', reading: 'みんせいいいん', burmese: 'ရပ်ကွက်လူမှုကူညီရေး စေတနာ့ဝန်ထမ်း (Case Study ထဲမှာ ခဏခဏပါတယ်)', category: 'Social Support' },
  { id: '306', word: '社会福祉協議会', reading: 'しゃきょう', burmese: 'လူမှုဖေးမရေး ကောင်စီ', category: 'Social Support' },
  { id: '307', word: '見守り', reading: 'みまもり', burmese: 'စောင့်ကြည့်ဂရုစိုက်ခြင်း (တစ်ယောက်တည်းနေ လူကြီးများအတွက်)', category: 'Social Support' },
  { id: '308', word: '意欲の低下', reading: 'いよくのていか', burmese: 'စိတ်အားထက်သန်မှု လျော့နည်းခြင်း', category: 'Social Support' },
  { id: '309', word: '見当識', reading: 'けんとうしき', burmese: 'ပတ်ဝန်းကျင်ကို သိရှိနိုင်စွမ်း (အချိန်၊ နေရာ၊ လူ)', category: 'Social Support' },
  { id: '310', word: '孤立', reading: 'こりつ', burmese: 'လူ့အဖွဲ့အစည်းမှ ဖယ်ကြဉ်ခံရခြင်း/တစ်ယောက်တည်းဖြစ်နေခြင်း', category: 'Social Support' },
  { id: '311', word: '喪失感', reading: 'そうしつかん', burmese: 'တစ်ခုခု ဆုံးရှုံးသွားသလို ခံစားရခြင်း (ဥပမာ - အိမ်ထောင်ဖက် သေဆုံးခြင်း)', category: 'Social Support' },
  { id: '312', word: 'インテーク', reading: 'Intake', burmese: 'ပထမဆုံးအကြိမ် တွေ့ဆုံဆွေးနွေးခြင်း', category: 'Social Support' },
  { id: '313', word: 'スクリーニング', reading: 'Screening', burmese: 'လိုအင်များကို စစ်ထုတ်ရွေးချယ်ခြင်း', category: 'Social Support' },
  { id: '314', word: 'インフォーマルサービス', reading: 'Informal Service', burmese: 'အစိုးရမဟုတ်သော အကူအညီများ (မိသားစု၊ အိမ်နီးချင်း၊ စေတနာ့ဝန်ထမ်း)', category: 'Social Support' },
  { id: '315', word: 'フォーマルサービス', reading: 'Formal Service', burmese: 'အစိုးရနှင့် အာမခံစနစ်မှပေးသော အကူအညီများ', category: 'Social Support' },
];

export default function VocabularyList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(SAMPLE_VOCAB.map(v => v.category)))];

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const filteredVocab = SAMPLE_VOCAB.filter(v => {
    const matchesSearch = v.word.includes(searchTerm) || 
                         v.reading.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         v.burmese.includes(searchTerm);
    const matchesCategory = selectedCategory === 'All' || v.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="vocab" className="py-24 bg-matte-black border-t border-metallic-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col mb-12 gap-8">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="text-metallic-gold" size={24} />
              <span className="text-xs font-bold uppercase tracking-widest text-metallic-gold/60">Module 01</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">Essential <span className="gold-gradient">Vocabulary</span></h2>
            <p className="text-gray-400">Master the terminology required for the National Care Worker Exam with bilingual support and native audio.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all gold-glow-hover ${
                    selectedCategory === cat 
                    ? 'bg-metallic-gold text-matte-black' 
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Search words..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-metallic-gold/20 rounded-full py-3 pl-12 pr-6 text-white focus:outline-none focus:border-metallic-gold transition-all"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVocab.map((vocab, index) => (
            <motion.div
              key={vocab.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.02 }}
              className="group bg-white/5 border border-metallic-gold/10 rounded-2xl p-6 hover:border-metallic-gold/40 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-metallic-gold/10 text-metallic-gold mb-2 inline-block">
                    {vocab.category}
                  </span>
                  <h3 className="text-2xl font-bold text-white group-hover:text-metallic-gold transition-colors leading-tight">
                    {vocab.word}
                  </h3>
                  <p className="text-sm text-gray-500 font-mono tracking-wider mt-1">
                    {vocab.reading}
                  </p>
                </div>
                <button
                  onClick={() => speak(vocab.word)}
                  className="p-3 rounded-full bg-metallic-gold/5 text-metallic-gold hover:bg-metallic-gold hover:text-matte-black transition-all shrink-0 ml-4 gold-glow-hover"
                  title="Play Audio"
                >
                  <Volume2 size={20} />
                </button>
              </div>
              
              <div className="pt-4 border-t border-white/5">
                <p className="text-gray-300 leading-relaxed font-medium text-sm">
                  {vocab.burmese}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredVocab.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 italic">No vocabulary found matching your criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
}
