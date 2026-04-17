export type Language = 'ja' | 'my' | 'ne' | 'vi';

export const LANGUAGE_NAMES: Record<Language, string> = {
  ja: '日本語',
  my: 'မြန်မာဘာသာ',
  ne: 'नेपाली',
  vi: 'Tiếng Việt',
};

export const LANGUAGE_FLAGS: Record<Language, string> = {
  ja: '🇯🇵',
  my: '🇲🇲',
  ne: '🇳🇵',
  vi: '🇻🇳',
};

const T = {
  // ── Navigation ──────────────────────────────────────────────
  nav_home: {
    ja: 'ホーム', my: 'ပင်မ', ne: 'होम', vi: 'Trang chủ',
  },
  nav_help: {
    ja: 'ヘルプ', my: 'အကူအညီ', ne: 'सहायता', vi: 'Trợ giúp',
  },
  nav_mypage: {
    ja: 'マイページ', my: 'ကျွန်ုပ်စာမျက်နှာ', ne: 'मेरो पृष्ठ', vi: 'Trang của tôi',
  },
  nav_subjects: {
    ja: '科目', my: 'ဘာသာရပ်များ', ne: 'विषयहरू', vi: 'Môn học',
  },
  nav_all_subjects: {
    ja: 'すべての科目を見る', my: 'ဘာသာရပ်အားလုံး', ne: 'सबै विषयहरू', vi: 'Tất cả môn học',
  },

  // ── Auth ─────────────────────────────────────────────────────
  auth_signin: {
    ja: 'ログイン', my: 'ဝင်ရောက်ရန်', ne: 'साइन इन', vi: 'Đăng nhập',
  },
  auth_signout: {
    ja: 'ログアウト', my: 'ထွက်ရန်', ne: 'साइन आउट', vi: 'Đăng xuất',
  },
  auth_signup: {
    ja: '新規登録', my: 'မှတ်ပုံတင်ရန်', ne: 'साइन अप', vi: 'Đăng ký',
  },
  auth_signin_signup: {
    ja: 'ログイン / 新規登録', my: 'ဝင်ရောက် / မှတ်ပုံတင်ရန်', ne: 'साइन इन / साइन अप', vi: 'Đăng nhập / Đăng ký',
  },
  members_only: {
    ja: 'メンバー限定コンテンツ', my: 'အဖွဲ့ဝင်များသာ ကြည့်ရှုနိုင်သည်', ne: 'सदस्यहरूका लागि मात्र', vi: 'Chỉ dành cho thành viên',
  },
  members_only_desc: {
    ja: 'すべてのコンテンツにアクセスするには、ログインまたは新規登録してください。',
    my: 'အကြောင်းအရာများကို ကြည့်ရှုရန် ဝင်ရောက်ပါ သို့မဟုတ် မှတ်ပုံတင်ပါ။',
    ne: 'सबै सामग्री पहुँच गर्न साइन इन वा साइन अप गर्नुहोस्।',
    vi: 'Đăng nhập hoặc đăng ký để truy cập tất cả nội dung.',
  },

  // ── Subject tabs ─────────────────────────────────────────────
  tab_textbook: {
    ja: 'テキスト', my: 'စာသင်ကျမ်း', ne: 'पाठ्यपुस्तक', vi: 'Giáo trình',
  },
  tab_past_questions: {
    ja: '過去問リスト', my: 'ယခင်မေးခွန်းများ', ne: 'पुराना प्रश्नहरू', vi: 'Đề thi cũ',
  },
  tab_vocabulary: {
    ja: '言葉', my: 'ဝေါဟာရများ', ne: 'शब्दावली', vi: 'Từ vựng',
  },
  tab_exam_hacks: {
    ja: 'Exam Hacks', my: 'Exam Hacks', ne: 'Exam Hacks', vi: 'Exam Hacks',
  },

  // ── Common ───────────────────────────────────────────────────
  search: {
    ja: '検索', my: 'ရှာဖွေ', ne: 'खोज्नुहोस्', vi: 'Tìm kiếm',
  },
  search_placeholder: {
    ja: 'キーワードで検索...', my: 'စကားလုံးဖြင့် ရှာဖွေရန်...', ne: 'कीवर्डले खोज्नुहोस्...', vi: 'Tìm kiếm theo từ khóa...',
  },
  loading: {
    ja: '読み込み中...', my: 'ဖတ်နေသည်...', ne: 'लोड हुँदैछ...', vi: 'Đang tải...',
  },
  back: {
    ja: '戻る', my: 'နောက်သို့', ne: 'फिर्ता', vi: 'Quay lại',
  },
  all: {
    ja: 'すべて', my: 'အားလုံး', ne: 'सबै', vi: 'Tất cả',
  },
  close: {
    ja: '閉じる', my: 'ပိတ်ရန်', ne: 'बन्द गर्नुहोस्', vi: 'Đóng',
  },
  category: {
    ja: 'カテゴリー', my: 'အမျိုးအစား', ne: 'श्रेणी', vi: 'Danh mục',
  },
  no_results: {
    ja: '結果が見つかりませんでした。', my: 'ရလဒ်မတွေ့ပါ။', ne: 'कुनै नतिजा भेटिएन।', vi: 'Không tìm thấy kết quả.',
  },

  // ── Plan / Upgrade ───────────────────────────────────────────
  free_plan: {
    ja: '無料プラン', my: 'အခမဲ့အစီအစဉ်', ne: 'निःशुल्क योजना', vi: 'Gói miễn phí',
  },
  paid_plan: {
    ja: 'プレミアムプラン', my: 'ပရီမီယံအစီအစဉ်', ne: 'प्रिमियम योजना', vi: 'Gói cao cấp',
  },
  upgrade_now: {
    ja: 'アップグレード', my: 'အဆင့်မြှင့်ရန်', ne: 'अपग्रेड गर्नुहोस्', vi: 'Nâng cấp',
  },
  premium_content: {
    ja: 'プレミアムコンテンツ', my: 'ပရီမီယံအကြောင်းအရာ', ne: 'प्रिमियम सामग्री', vi: 'Nội dung cao cấp',
  },
  premium_desc: {
    ja: 'このコンテンツはプレミアムプランのみ閲覧できます。',
    my: 'ဤအကြောင်းအရာကို ပရီမီယံအစီအစဉ်ဖြင့်သာ ကြည့်ရှုနိုင်သည်။',
    ne: 'यो सामग्री प्रिमियम योजनामा मात्र उपलब्ध छ।',
    vi: 'Nội dung này chỉ dành cho gói cao cấp.',
  },
  current_plan: {
    ja: '現在のプラン', my: 'လက်ရှိအစီအစဉ်', ne: 'हालको योजना', vi: 'Gói hiện tại',
  },

  // ── PDF Viewer ───────────────────────────────────────────────
  pdf_loading: {
    ja: 'PDFを読み込み中...', my: 'PDF ဖတ်နေသည်...', ne: 'PDF लोड हुँदैछ...', vi: 'Đang tải PDF...',
  },
  pdf_select: {
    ja: '左のリストからテキストを選択してください。',
    my: 'ဘယ်ဘက်စာရင်းမှ စာသင်ကျမ်းကို ရွေးချယ်ပါ။',
    ne: 'बाँया सूचीबाट पाठ्यपुस्तक छान्नुहोस्।',
    vi: 'Chọn giáo trình từ danh sách bên trái.',
  },
  pdf_no_download: {
    ja: 'このファイルはダウンロードできません。', my: 'ဤဖိုင်ကို ဒေါင်းလုဒ်မလုပ်နိုင်ပါ။', ne: 'यो फाइल डाउनलोड गर्न सकिँदैन।', vi: 'Không thể tải xuống tệp này.',
  },
  no_pdfs: {
    ja: 'まだテキストがアップロードされていません。',
    my: 'မည်သည့် PDF မျှ မတင်ထားသေးပါ။',
    ne: 'अहिलेसम्म कुनै PDF अपलोड भएको छैन।',
    vi: 'Chưa có tài liệu nào được tải lên.',
  },

  // ── My Page ──────────────────────────────────────────────────
  mypage_title: {
    ja: 'マイページ', my: 'ကျွန်ုပ်စာမျက်နှာ', ne: 'मेरो पृष्ठ', vi: 'Trang của tôi',
  },
  mypage_account: {
    ja: 'アカウント情報', my: 'အကောင့်အချက်အလက်', ne: 'खाता जानकारी', vi: 'Thông tin tài khoản',
  },
  mypage_plan: {
    ja: 'プラン', my: 'အစီအစဉ်', ne: 'योजना', vi: 'Gói',
  },
  mypage_email: {
    ja: 'メールアドレス', my: 'အီးမေးလ်လိပ်စာ', ne: 'इमेल ठेगाना', vi: 'Địa chỉ email',
  },
  mypage_member_since: {
    ja: '登録日', my: 'မှတ်ပုံတင်သောနေ့', ne: 'दर्ता मिति', vi: 'Ngày đăng ký',
  },
  mypage_progress: {
    ja: '学習進捗', my: 'လေ့လာမှုတိုးတက်မှု', ne: 'सिकाइ प्रगति', vi: 'Tiến độ học tập',
  },
  mypage_language: {
    ja: '表示言語', my: 'ပြသသောဘာသာစကား', ne: 'प्रदर्शन भाषा', vi: 'Ngôn ngữ hiển thị',
  },

  // ── Vocabulary ───────────────────────────────────────────────
  vocab_word: {
    ja: '単語', my: 'စကားလုံး', ne: 'शब्द', vi: 'Từ',
  },
  vocab_reading: {
    ja: '読み方', my: 'ဖတ်ပုံ', ne: 'पढाइ', vi: 'Cách đọc',
  },
  vocab_meaning: {
    ja: '意味', my: 'အဓိပ္ပာယ်', ne: 'अर्थ', vi: 'Nghĩa',
  },
  vocab_no_translation: {
    ja: '翻訳なし', my: 'ဘာသာပြန်မရှိ', ne: 'अनुवाद उपलब्ध छैन', vi: 'Chưa có bản dịch',
  },

  // ── Subjects grid ────────────────────────────────────────────
  subjects_title: {
    ja: '介護福祉士　13科目', my: 'ဘာသာရပ် ၁၃ မျိုး', ne: '१३ विषयहरू', vi: '13 Môn học',
  },
  subjects_subtitle: {
    ja: '学習したい科目を選択してください。',
    my: 'လေ့လာလိုသော ဘာသာရပ်ကို ရွေးချယ်ပါ။',
    ne: 'पढ्न चाहनुभएको विषय छान्नुहोस्।',
    vi: 'Chọn môn học bạn muốn ôn tập.',
  },
  select_subject: {
    ja: '科目を選択', my: 'ဘာသာရပ်ရွေးချယ်ရန်', ne: 'विषय छान्नुहोस्', vi: 'Chọn môn học',
  },
  questions_count: {
    ja: '問', my: 'မေးခွန်း', ne: 'प्रश्न', vi: 'câu',
  },

  // ── Past questions ───────────────────────────────────────────
  pq_select_exam: {
    ja: '試験回を選択', my: 'စာမေးပွဲနှစ် ရွေးချယ်ပါ', ne: 'परीक्षा छान्नुहोस्', vi: 'Chọn kỳ thi',
  },
  pq_all_exams: {
    ja: 'すべての回', my: 'ခုနှစ်အားလုံး', ne: 'सबै', vi: 'Tất cả',
  },
  pq_question: {
    ja: '問題', my: 'မေးခွန်း', ne: 'प्रश्न', vi: 'Câu hỏi',
  },
  pq_start_practice: {
    ja: 'この科目で練習する', my: 'ဤဘာသာရပ်ဖြင့် လေ့ကျင့်ရန်', ne: 'यो विषयमा अभ्यास गर्नुहोस्', vi: 'Luyện tập môn này',
  },
  pq_no_questions: {
    ja: 'この科目の過去問はまだありません。',
    my: 'ဤဘာသာရပ်အတွက် ယခင်မေးခွန်းများ မရှိသေးပါ။',
    ne: 'यो विषयको लागि अहिलेसम्म कुनै प्रश्न छैन।',
    vi: 'Chưa có câu hỏi nào cho môn này.',
  },

  // ── Help page ────────────────────────────────────────────────
  help_title: {
    ja: 'ヘルプ', my: 'အကူအညီ', ne: 'सहायता', vi: 'Trợ giúp',
  },
  help_subtitle: {
    ja: 'よくある質問', my: 'မကြာခဏမေးသောမေးခွန်းများ', ne: 'बारम्बार सोधिने प्रश्नहरू', vi: 'Câu hỏi thường gặp',
  },

  // ── Hero ─────────────────────────────────────────────────────
  hero_cta: {
    ja: '今すぐ始める', my: 'ယခုစတင်ရန်', ne: 'अहिले सुरु गर्नुहोस्', vi: 'Bắt đầu ngay',
  },

  // ── AM / PM period ───────────────────────────────────────────
  period_am: {
    ja: '午前科目', my: 'နံနက်ဘာသာရပ်', ne: 'बिहान विषय', vi: 'Môn buổi sáng',
  },
  period_pm: {
    ja: '午後科目', my: 'နေ့ဆန်းဘာသာရပ်', ne: 'दिउँसो विषय', vi: 'Môn buổi chiều',
  },
} as const;

export type TranslationKey = keyof typeof T;

export function t(lang: Language, key: TranslationKey): string {
  return T[key][lang] ?? T[key]['ja'];
}

export default T;
