import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Volume2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Card {
  id: string;
  front: string; // Japanese
  back: string;  // Burmese
  reading: string;
}

const FLASHCARDS_DATA: Card[] = [
  { id: '1', front: '人間の尊厳', reading: 'にんげんのそんげん', back: 'လူသားတို့၏ ဂုဏ်သိက္ခာ' },
  { id: '2', front: '自己決定', reading: 'じこけってい', back: 'မိမိဘာသာ ဆုံးဖြတ်ခြင်း' },
  { id: '3', front: '自立支援', reading: 'じりつしえん', back: 'ကိုယ်တိုင်ရပ်တည်နိုင်အောင် ကူညီခြင်း' },
  { id: '4', front: 'QOL', reading: 'Quality of Life', back: 'ဘဝအရည်အသွေး' },
  { id: '5', front: 'ノーマライゼーション', reading: 'Normalization', back: 'မသန်စွမ်းသူများ ပုံမှန်လူများနည်းတူ နေထိုင်ခြင်း' },
  { id: '6', front: '介護保険', reading: 'かいごほけん', back: 'ဂရုစိုက်မှု အာမခံ' },
  { id: '7', front: '要介護認定', reading: 'ようかいごにんてい', back: 'ဂရုစိုက်မှုလိုအပ်မှုအဆင့် သတ်မှတ်ခြင်း' },
  { id: '8', front: 'ケアマネジャー', reading: 'Care Manager', back: 'ဂရုစိုက်မှု စီမံခန့်ခွဲသူ' },
  { id: '9', front: '共感', reading: 'きょうかん', back: 'ကိုယ်ချင်းစာစိတ် (User ရဲ့ ခံစားချက်ကို ထပ်တူနားလည်ပေးခြင်း)' },
  { id: '10', front: '傾聴', reading: 'けいちょう', back: 'အလေးအနက် နားထောင်ခြင်း' },
  { id: '11', front: '受容', reading: 'じゅよう', back: 'လက်ခံပေးခြင်း (ဝေဖန်ခြင်းမရှိဘဲ လက်ခံခြင်း)' },
  { id: '12', front: 'ラポール', reading: 'Rapport', back: 'ယုံကြည်မှု တည်ဆောက်ခြင်း' },
  { id: '13', front: '個別化', reading: 'こべつか', back: 'လူတစ်ဦးချင်းစီကို သီးခြားစီ တန်ဖိုးထားဆက်ဆံခြင်း' },
  { id: '14', front: '非審判的態度', reading: 'ひしんぱんてき', back: 'အမှားအမှန် ဝေဖန်ပိုင်းခြားမှု မလုပ်သော စိတ်ထား' },
  { id: '15', front: '自己決定', reading: 'じこけってい', back: 'User ကိုယ်တိုင် ဆုံးဖြတ်ခွင့်ပေးခြင်း' },
  { id: '16', front: 'バリデーション', reading: 'Validation', back: 'စိတ်ဖောက်ပြန်သူများ၏ ခံစားချက်ကို အသိအမှတ်ပြုပေးခြင်း' },
  { id: '17', front: '自己覚知', reading: 'じこかくち', back: 'မိမိကိုယ်ကိုယ် ပြန်လည်ဆန်းစစ်ခြင်း' },
  { id: '18', front: '共感的理解', reading: 'きょうかんてきりかい', back: 'ကိုယ်ချင်းစာစိတ်ဖြင့် နားလည်ပေးခြင်း' },
  { id: '19', front: '非言語的要素', reading: 'ひげんごてきようそ', back: 'စကားလုံးမပါသော အချက်များ (မျက်နှာအမူအရာ စသည်)' },
  { id: '20', front: 'パラ言語', reading: 'Para-language', back: 'စကားလုံးမဟုတ်သော အသံနေအသံထား' },
  { id: '21', front: '失語症', reading: 'しつごしょう', back: 'စကားပြောစွမ်းရည် ချို့ယွင်းခြင်း (Aphasia)' },
  { id: '22', front: 'バイステックの7原則', reading: 'Biestek', back: 'ဘိုက်စတက်၏ အခြေခံမူ ၇ ချက်' },
  { id: '23', front: 'ボディメカニクス', reading: 'Body Mechanics', back: 'လူနာကို မရာမှာ ကိုယ့်ခါးမနာအောင် အင်အားသုံးနည်း' },
  { id: '24', front: '支持基底面', reading: 'しじきていめん', back: 'ခန္ဓာကိုယ်ကို ထောက်ကန်ထားသော ဧရိယာ' },
  { id: '25', front: '誤嚥', reading: 'ごえん', back: 'အစာမှားဝင်ခြင်း (အသက်ရှူလမ်းကြောင်းထဲ အစာဝင်ခြင်း)' },
  { id: '26', front: '褥瘡', reading: 'じょくそう', back: 'အိပ်ရာနာ (Pressure sore) 🔴 High Priority' },
  { id: '27', front: '脱健着患', reading: 'だっけんちゃっかん', back: 'အကောင်းဘက်ကချွတ်၊ အနာဘက်ကဝတ် (အရေးကြီးဆုံး Rule!)' },
  { id: '28', front: '結晶性知能', reading: 'けっしょうせいちのう', back: 'အတွေ့အကြုံနှင့် ဗဟုသုတ (အသက်ကြီးသော်လည်း မကျဆင်းပါ) 🔴 High Priority' },
  { id: '29', front: '廃用症候群', reading: 'はいようしょうこうぐん', back: 'အိပ်ရာထဲ အကြာကြီး လဲနေခြင်းကြောင့် ဖြစ်သော ရောဂါစု' },
  { id: '30', front: '死の三徴候', reading: 'しのさんちょうこう', back: 'သေဆုံးခြင်း၏ လက္ခဏာ ၃ ပါး' },
  { id: '31', front: '骨粗鬆症', reading: 'こつそしょうしょう', back: 'အရိုးပွရောဂါ (လူကြီးများတွင် အရိုးကျိုးလွယ်ခြင်း)' },
  { id: '32', front: '恒常性', reading: 'こうじょうせい', back: 'ခန္ဓာကိုယ်တွင်း မျှခြေကို ထိန်းသိမ်းခြင်း (Homeostasis)' },
  { id: '33', front: '発達課題', reading: 'はったつかだい', back: 'အသက်အရွယ်အလိုက် လုပ်ဆောင်ရမည့် ဖွံ့ဖြိုးမှုဆိုင်ရာ တာဝန်များ' },
  { id: '34', front: 'アイデンティティ', reading: 'Identity', back: 'မိမိကိုယ်ကိုယ် မည်သူမည်ဝါဖြစ်ကြောင်း သိရှိမှု' },
  { id: '35', front: 'せん妄', reading: 'せんもう', back: 'ရုတ်တရက် စိတ်ရှုပ်ထွေးခြင်း (Delirium)' },
  { id: '36', front: '短期記憶', reading: 'たんききおく', back: 'ရေတိုမှတ်ဉာဏ် (လူကြီးများတွင် ကျဆင်းလွယ်သည်)' },
  { id: '37', front: '長期記憶', reading: 'ちょうききおく', back: 'ရေရှည်မှတ်ဉာဏ် (အတိတ်ကအကြောင်းများကို မှတ်မိခြင်း)' },
  { id: '38', front: '見当識障害', reading: 'けんとうしきしょうがい', back: 'အချိန်၊ နေရာ၊ လူ ကို ဝေခွဲမရဖြစ်ခြင်း' },
  { id: '39', front: 'BPSD', reading: 'BPSD', back: 'စိတ်ပိုင်းဆိုင်ရာနှင့် အမူအကျင့်လက္ခဏာများ' },
  { id: '40', front: '幻視', reading: 'げんし', back: 'မရှိတာကို မြင်ခြင်း (Lewy Body တွင် အဖြစ်များ)' },
  { id: '41', front: 'まだら認知症', reading: 'Madara Ninshisho', back: '"ကွက်ကြား" စိတ်ဖောက်ပြန်မှု (Vascular တွင် တွေ့ရသည်)' },
  { id: '42', front: 'ユマニチュード', reading: 'Humanitude', back: '"ကြည့်၊ ပြော၊ ထိ၊ ရပ်" နည်းစနစ် ၄ မျိုး' },
  { id: '43', front: 'ICF', reading: '国際生活機能分類', back: 'မသန်စွမ်းမှုကို ပတ်ဝန်းကျင်နှင့် လူ၏လုပ်ဆောင်နိုင်စွမ်းကြား ဆက်စပ်မှုအဖြစ် ကြည့်ခြင်း' },
  { id: '44', front: '環境因子', reading: 'かんきょういんし', back: 'ပတ်ဝန်းကျင်ဆိုင်ရာ အချက်များ (ဥပမာ - ဘီးတပ်ကုလားထိုင်အတွက် လမ်း)' },
  { id: '45', front: '個人因子', reading: 'こじんいんし', back: 'ပုဂ္ဂိုလ်ရေးဆိုင်ရာ အချက်များ (အသက်၊ ကျား/မ၊ အလုပ်)' },
  { id: '46', front: '高次脳機能障害', reading: 'こうじのうきのうしょうがい', back: 'ဦးနှောက်ထိခိုက်မှုကြောင့် မှတ်ဉာဏ်၊ အာရုံစူးစိုက်မှု ချို့ယွင်းခြင်း' },
  { id: '47', front: '合理的配慮', reading: 'ごうりてきはいりょ', back: 'မသန်စွမ်းသူများအတွက် အတားအဆီးများ ဖယ်ရှားပေးခြင်း (သင့်တင့်လျောက်ပတ်သော ညှိနှိုင်းမှု)' },
  { id: '48', front: '喀痰吸引', reading: 'かくたんきゅういん', back: 'ချွဲထုတ်ပေးခြင်း (Suction)' },
  { id: '49', front: '経管栄養', reading: 'けいかんえいよう', back: 'ပိုက်ဖြင့် အာဟာရကျွေးခြင်း (Tube Feeding)' },
  { id: '50', front: '指示書', reading: 'しじしょ', back: 'ဆရာဝန်၏ ညွှန်ကြားချက်လွှာ (ဒါရှိမှ လုပ်ဆောင်ခွင့်ရှိသည်)' },
  { id: '51', front: '胃ろう', reading: 'いろう', back: 'အစာအိမ်ကို တိုက်ရိုက်ဖောက်၍ ကျွေးခြင်း (Gastrostomy)' },
  { id: '52', front: '粘膜損傷', reading: 'ねんまくそんしょう', back: 'အတွင်းသား နံရံများ ထိခိုက်ရှေခြင်း (⚠️ အထူးသတိထားရန်)' },
  { id: '53', front: '客観的情報', reading: 'きゃっかんてきじょうほう', back: 'မျက်မြင်ကိုယ်တွေ့ အချက်အလက် (ဥပမာ - အဖျားတိုင်းလို့ရသော အပူချိန်)' },
  { id: '54', front: '主観的情報', reading: 'しゅかんてきじょうほう', back: 'User ပြောပြသော ခံစားချက် (ဥပမာ - "နေလို့မကောင်းဘူး")' },
  { id: '55', front: '生活課題', reading: 'せいかつかだい', back: 'လူမှုဘဝပြဿနာ (User ဘာဖြစ်ချင်သလဲ၊ ဘာလိုအပ်နေသလဲ)' },
  { id: '56', front: '介護計画', reading: 'かいごけいかく', back: 'ဂရုစိုက်မှု အစီအစဉ် (Care Plan)' },
  { id: '57', front: 'モニタリング', reading: 'Monitoring', back: 'အခြေအနေကို စောင့်ကြည့်လေ့လာခြင်း (Evaluation အဆင့်)' },
  { id: '58', front: 'サ高住', reading: 'Sakoju', back: 'ဝန်ဆောင်မှုပါသော သက်ကြီးရွယ်အို အိမ်ရာ (Service-provider House)' },
  { id: '59', front: 'サービス担当者会議', reading: 'さーびすたんとうしゃかいぎ', back: 'ဝန်ဆောင်မှုပေးသူများ အစည်းအဝေး (Care Plan အတွက် အရေးကြီးသည်)' },
  { id: '60', front: '民生委員', reading: 'みんせいいいん', back: 'ရပ်ကွက်လူမှုကူညီရေး စေတနာ့ဝန်ထမ်း (Case Study ထဲမှာ ခဏခဏပါတယ်)' },
  { id: '61', front: 'インフォーマルサービス', reading: 'Informal Service', back: 'အစိုးရမဟုတ်သော အကူအညီများ (မိသားစု၊ အိမ်နီးချင်း၊ စေတနာ့ဝန်ထမ်း)' },
  { id: '62', front: '喪失感', reading: 'そうしつかん', back: 'တစ်ခုခု ဆုံးရှုံးသွားသလို ခံစားရခြင်း (ဥပမာ - အိမ်ထောင်ဖက် သေဆုံးခြင်း)' },
];

export default function Flashcards() {
  const [cards, setCards] = useState<Card[]>(FLASHCARDS_DATA);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    supabase.from('flashcards_content').select('*').order('created_at').then(({ data }) => {
      if (data && data.length > 0) setCards(data);
    });
  }, []);

  const handleNext = () => {
    setDirection(1);
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      window.speechSynthesis.speak(utterance);
    }
  };

  const currentCard = cards[currentIndex] ?? cards[0];

  return (
    <section id="flashcards" className="py-24 bg-matte-black/50 border-t border-metallic-gold/10">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-4">Interactive <span className="gold-gradient">Flashcards</span></h2>
          <p className="text-gray-400">Test your knowledge and master key concepts through active recall.</p>
        </div>

        <div className="relative h-[400px] w-full max-w-md mx-auto perspective-1000">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction * 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 100 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 cursor-pointer"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
                className="w-full h-full relative preserve-3d"
              >
                {/* Front Side */}
                <div className="absolute inset-0 backface-hidden bg-white/5 border-2 border-metallic-gold/20 rounded-3xl flex flex-col items-center justify-center p-8 shadow-2xl">
                  <span className="absolute top-6 right-6 text-xs font-bold text-metallic-gold/40 uppercase tracking-widest">Front</span>
                  <h3 className="text-4xl font-bold text-white mb-4 text-center">{currentCard.front}</h3>
                  <p className="text-lg text-gray-500 font-mono mb-8">{currentCard.reading}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speak(currentCard.front);
                    }}
                    className="p-3 rounded-full bg-metallic-gold/10 text-metallic-gold hover:bg-metallic-gold hover:text-matte-black transition-all"
                  >
                    <Volume2 size={24} />
                  </button>
                  <p className="mt-12 text-xs text-gray-500 uppercase tracking-widest animate-pulse">Click to flip</p>
                </div>

                {/* Back Side */}
                <div 
                  className="absolute inset-0 backface-hidden bg-metallic-gold rounded-3xl flex flex-col items-center justify-center p-8 shadow-2xl"
                  style={{ transform: 'rotateY(180deg)' }}
                >
                  <span className="absolute top-6 right-6 text-xs font-bold text-matte-black/40 uppercase tracking-widest">Back</span>
                  <h3 className="text-3xl font-bold text-matte-black text-center leading-relaxed">
                    {currentCard.back}
                  </h3>
                  <p className="mt-12 text-xs text-matte-black/60 uppercase tracking-widest">Click to see front</p>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-12 flex items-center justify-center gap-8">
          <button
            onClick={handlePrev}
            className="p-4 rounded-full border border-metallic-gold/20 text-metallic-gold hover:bg-metallic-gold/10 transition-all gold-glow-hover"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="text-sm font-bold text-gray-500 tracking-widest">
            <span className="text-metallic-gold">{currentIndex + 1}</span> / {cards.length}
          </div>

          <button
            onClick={handleNext}
            className="p-4 rounded-full border border-metallic-gold/20 text-metallic-gold hover:bg-metallic-gold/10 transition-all gold-glow-hover"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <button
          onClick={() => {
            setCurrentIndex(0);
            setIsFlipped(false);
          }}
          className="mt-8 text-xs font-bold text-gray-500 hover:text-metallic-gold flex items-center gap-2 mx-auto transition-colors"
        >
          <RotateCcw size={14} />
          RESET DECK
        </button>
      </div>
    </section>
  );
}
