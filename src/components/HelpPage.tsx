import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface FAQ {
  q: { ja: string; my: string; ne: string; vi: string };
  a: { ja: string; my: string; ne: string; vi: string };
}

const FAQS: FAQ[] = [
  {
    q: {
      ja: 'このサイトは何のためのサービスですか？',
      my: 'ဤဝဘ်ဆိုက်သည် မည်သည့်အတွက်ဖြစ်သနည်း？',
      ne: 'यो साइट कसका लागि हो?',
      vi: 'Trang web này dành cho ai?',
    },
    a: {
      ja: '介護福祉士国家試験の合格を目指す外国人介護士のための学習プラットフォームです。テキスト・過去問・単語学習・Exam Hacksをご利用いただけます。',
      my: 'ဤဝဘ်ဆိုက်သည် ဂျပန်နိုင်ငံ၌ Kaigo Fukushishi (介護福祉士) အမျိုးသားစာမေးပွဲ အောင်မြင်ရန် ရည်ရွယ်သော နိုင်ငံခြားသား ကြည့်ရှုစောင့်ရှောက်ရေးဝန်ထမ်းများအတွက် ဖြစ်သည်။',
      ne: 'यो साइट जापानमा काम गर्ने विदेशी हेरचाह कामदारहरूका लागि介護福祉士 राष्ट्रिय परीक्षा पास गर्न सहयोग गर्छ।',
      vi: 'Trang web này dành cho các nhân viên chăm sóc nước ngoài ở Nhật Bản muốn vượt qua kỳ thi quốc gia 介護福祉士.',
    },
  },
  {
    q: {
      ja: '無料プランとプレミアムプランの違いは何ですか？',
      my: 'အခမဲ့နှင့် ပရီမီယံအစီအစဉ် ကွာခြားချက်သည် ဘာလဲ?',
      ne: 'निःशुल्क र प्रिमियम योजनाको फरक के हो?',
      vi: 'Sự khác biệt giữa gói miễn phí và gói cao cấp là gì?',
    },
    a: {
      ja: '無料プランでは一部のテキスト・過去問（最新3回分）・単語にアクセスできます。プレミアムプランでは全コンテンツ（全テキスト・過去問8回分・全単語集・AIフィードバック）にアクセスできます。',
      my: 'အခမဲ့အစီအစဉ်တွင် ပထမ PDF တစ်ခု၊ နောက်ဆုံး ၃ ကြိမ်မေးခွန်းနှင့် အချို့ကိုသာ ကြည့်ရှုနိုင်သည်။ ပရီမီယံဆိုလျှင် အကြောင်းအရာအားလုံးကို ကြည့်ရှုနိုင်သည်။',
      ne: 'निःशुल्क योजनामा केही सामग्री मात्र उपलब्ध छ। प्रिमियममा सबै कुरा खुल्छ।',
      vi: 'Gói miễn phí cho phép truy cập một phần nội dung. Gói cao cấp mở khóa tất cả.',
    },
  },
  {
    q: {
      ja: 'PDFはダウンロードできますか？',
      my: 'PDF ကို ဒေါင်းလုဒ်လုပ်နိုင်ပါသလား?',
      ne: 'PDF डाउनलोड गर्न सकिन्छ?',
      vi: 'Có thể tải xuống PDF không?',
    },
    a: {
      ja: 'いいえ。PDFはオンラインでのみ閲覧可能です。著作権保護のため、ダウンロードはできません。',
      my: 'မဟုတ်ပါ။ PDF ကို ဆိုက်ပေါ်တွင်သာ ကြည့်ရှုနိုင်ပြီး ဒေါင်းလုဒ်မလုပ်နိုင်ပါ။',
      ne: 'होइन। PDF अनलाइनमा मात्र हेर्न सकिन्छ, डाउनलोड गर्न मिल्दैन।',
      vi: 'Không. PDF chỉ có thể xem trực tuyến, không thể tải xuống.',
    },
  },
  {
    q: {
      ja: '表示言語はどこで変えられますか？',
      my: 'ဘာသာစကားကို မည်သည့်နေရာတွင် ပြောင်းနိုင်သနည်း?',
      ne: 'भाषा कहाँ परिवर्तन गर्न सकिन्छ?',
      vi: 'Có thể thay đổi ngôn ngữ ở đâu?',
    },
    a: {
      ja: 'ナビゲーションバーの右上にある国旗アイコン、またはマイページの「表示言語」セクションから変更できます。',
      my: 'နေဗီဂေးရှင်းဘားရှိ အလံပုံ သို့မဟုတ် မိမိစာမျက်နှာ > "ပြသသောဘာသာစကား" မှ ပြောင်းနိုင်သည်။',
      ne: 'नेभिगेशन बारमा झण्डाको आइकन वा मेरो पृष्ठ > "भाषा" बाट परिवर्तन गर्न सकिन्छ।',
      vi: 'Thay đổi ở biểu tượng cờ trên thanh điều hướng hoặc Trang của tôi > "Ngôn ngữ hiển thị".',
    },
  },
  {
    q: {
      ja: '介護福祉士国家試験とはどんな試験ですか？',
      my: ' 介護福祉士国家試験 ဆိုသည်မှာ မည်သည့်စာမေးပွဲဖြစ်သနည်း?',
      ne: '介護福祉士国家試験 भनेको के हो?',
      vi: '介護福祉士国家試験 là kỳ thi gì?',
    },
    a: {
      ja: '日本の介護職に必要な国家資格試験です。年1回1月に実施され、13科目125問（午前・午後）から構成されます。合格基準は全体60%以上かつ全科目1問以上正解です。',
      my: 'ဂျပန်နိုင်ငံ၌ ပြုစုစောင့်ရှောက်ရေးဝန်ထမ်းများအတွက် နိုင်ငံတော်သတ်မှတ်ချက် စစ်ဆေးမှုဖြစ်သည်။ နှစ်ပတ်ကြိမ် ဇန်နဝါရီလတွင် ကျင်းပသည်။ ဘာသာရပ် ၁၃ ခု၊ မေးခွန်း ၁၂၅ ခုပါဝင်သည်။',
      ne: 'जापानमा हेरचाह पेशाका लागि आवश्यक राष्ट्रिय लाइसेन्स परीक्षा हो। वर्षमा एकपटक जनवरीमा हुन्छ। १३ विषय, १२५ प्रश्न।',
      vi: 'Đây là kỳ thi cấp phép quốc gia cho nghề chăm sóc tại Nhật Bản. Tổ chức một lần mỗi năm vào tháng 1. Gồm 13 môn, 125 câu hỏi.',
    },
  },
];

export default function HelpPage() {
  const { t, lang } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-8"
      >
        <HelpCircle size={28} className="text-metallic-gold" />
        <div>
          <h1 className="text-3xl font-bold text-white">{t('help_title')}</h1>
          <p className="text-gray-400 text-sm mt-0.5">{t('help_subtitle')}</p>
        </div>
      </motion.div>

      <div className="space-y-3">
        {FAQS.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/3 transition-all"
            >
              <span className="font-semibold text-white text-sm leading-snug pr-4">
                {faq.q[lang]}
              </span>
              <motion.div
                animate={{ rotate: openIndex === i ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="shrink-0"
              >
                <ChevronDown size={18} className="text-gray-400" />
              </motion.div>
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-sm text-gray-400 leading-relaxed border-t border-white/8 pt-4">
                    {faq.a[lang]}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Contact */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-10 p-6 rounded-2xl bg-metallic-gold/5 border border-metallic-gold/20 text-center"
      >
        <p className="text-sm text-gray-400">
          その他のご質問は{' '}
          <a
            href="mailto:info@ksajapan.jp"
            className="text-metallic-gold hover:underline"
          >
            info@ksajapan.jp
          </a>{' '}
          までお問い合わせください。
        </p>
      </motion.div>
    </div>
  );
}
