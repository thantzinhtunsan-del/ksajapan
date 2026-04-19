/**
 * extract_by_kai.cjs
 * Improved extraction: properly handles embedded year format 問題 N（第XX回）
 * Outputs pastQuestions.json with correct kai tag per question.
 */

const pdf = require('pdf-parse/lib/pdf-parse.js');
const fs  = require('fs');
const path = require('path');

const PDF_DIR = 'C:/Users/thant/OneDrive/Desktop/過去問題集';

const SUBJECT_PERIOD = {
  '人間の尊厳と自立': 'am', '人間関係とコミュニケーション': 'am',
  '社会の理解': 'am', 'こころとからだのしくみ': 'am',
  '発達と老化の理解': 'am', '認知症の理解': 'am',
  '障害の理解': 'am', '医療的ケア': 'am',
  '介護の基本': 'pm', 'コミュニケーション技術': 'pm',
  '生活支援技術': 'pm', '介護過程': 'pm', '総合問題': 'pm',
};

const SUBJECT_FILES = {
  '人間の尊厳と自立': '人間の尊厳と自立_問題集.pdf',
  '人間関係とコミュニケーション': '人間関係とコミュニケーション_問題集.pdf',
  '社会の理解': '社会の理解_問題集.pdf',
  'こころとからだのしくみ': 'こころとからだのしくみ_問題集-1.pdf',
  '発達と老化の理解': '発達と老化の理解_問題集.pdf',
  '認知症の理解': '認知症の理解_過去問題集.pdf',
  '障害の理解': '障害の理解_過去問題集.pdf',
  '医療的ケア': '医療的ケア過去問題集.pdf',
  '介護の基本': '介護の基本_問題集.pdf',
  'コミュニケーション技術': 'コミュニケーション技術_問題集.pdf',
  '生活支援技術': '生活支援技術_問題集.pdf',
  '介護過程': '介護過程_過去問題集.pdf',
  '総合問題': '総合問題_過去問題集.pdf',
};

// 第38回 question-to-subject mapping (confirmed from 湘南国際アカデミー analysis)
// A booklet Q1-60, B booklet Q61-105, C booklet Q106-125
const KAI38_SUBJECT_RANGE = [
  { from: 1,   to: 2,   subject: '人間の尊厳と自立',        period: 'am' },
  { from: 3,   to: 12,  subject: '介護の基本',              period: 'pm' },
  { from: 13,  to: 24,  subject: '社会の理解',              period: 'am' },
  { from: 25,  to: 28,  subject: '人間関係とコミュニケーション', period: 'am' },
  { from: 29,  to: 34,  subject: 'コミュニケーション技術',   period: 'pm' },
  { from: 35,  to: 60,  subject: '生活支援技術',            period: 'pm' },
  { from: 61,  to: 72,  subject: 'こころとからだのしくみ',   period: 'am' },
  { from: 73,  to: 80,  subject: '発達と老化の理解',        period: 'am' },
  { from: 81,  to: 90,  subject: '認知症の理解',            period: 'am' },
  { from: 91,  to: 100, subject: '障害の理解',              period: 'am' },
  { from: 101, to: 105, subject: '医療的ケア',              period: 'am' },
  { from: 106, to: 113, subject: '介護過程',                period: 'pm' },
  { from: 114, to: 125, subject: '総合問題',                period: 'pm' },
];

function getKai38Subject(qn) {
  for (const r of KAI38_SUBJECT_RANGE) {
    if (qn >= r.from && qn <= r.to) return { subject: r.subject, period: r.period };
  }
  return null;
}

// k_*_38.pdf files — questions for subjects NOT covered in subject PDFs for 第38回
// (Subject PDFs missing 第38回: 人間の尊厳と自立, 認知症の理解, 障害の理解, 医療的ケア, 介護過程, 総合問題)
const K38_FILES = [
  'k_am_01_38.pdf',  // Q1-2:    人間の尊厳と自立
  'k_pm_03_38.pdf',  // Q81-90:  認知症の理解
  'k_pm_04_38.pdf',  // Q91-100: 障害の理解
  'k_pm_05_38.pdf',  // Q101-105: 医療的ケア
  'k_pm_06_38.pdf',  // Q106-113: 介護過程
  'k_pm_07_38.pdf',  // Q114-125: 総合問題
];

// Complete answer key for 第38回 (2026/01/25) — source: ユーキャン解答速報
// Converted from 1-indexed to 0-indexed
const KAI38_ANSWERS = {
   1:1,  2:3,  3:2,  4:0,  5:0,  6:4,  7:1,  8:1,  9:4, 10:0,
  11:2, 12:3, 13:3, 14:2, 15:0, 16:1, 17:0, 18:2, 19:4, 20:3,
  21:1, 22:0, 23:3, 24:3, 25:3, 26:4, 27:0, 28:2, 29:3, 30:0,
  31:4, 32:2, 33:4, 34:1, 35:1, 36:0, 37:1, 38:2, 39:4, 40:3,
  41:0, 42:2, 43:4, 44:2, 45:0, 46:1, 47:1, 48:2, 49:1, 50:2,
  51:4, 52:0, 53:3, 54:0, 55:4, 56:2, 57:3, 58:2, 59:4, 60:3,
  61:4, 62:2, 63:1, 64:0, 65:4, 66:3, 67:1, 68:0, 69:2, 70:4,
  71:3, 72:3, 73:1, 74:1, 75:4, 76:2, 77:1, 78:0, 79:3, 80:3,
  81:4, 82:0, 83:2, 84:4, 85:1, 86:3, 87:0, 88:3, 89:2, 90:2,
  91:4, 92:0, 93:0, 94:1, 95:2, 96:2, 97:3, 98:1, 99:4,100:3,
 101:0,102:4,103:2,104:1,105:3,106:1,107:3,108:4,109:0,110:1,
 111:1,112:2,113:4,114:1,115:0,116:3,117:0,118:2,119:2,120:4,
 121:2,122:0,123:1,124:4,125:2,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fw2hw(ch) {
  const fw = '０１２３４５６７８９';
  const idx = fw.indexOf(ch);
  return idx >= 0 ? String(idx) : ch;
}

function isOption(line) {
  return /^[１-５1-5][\s\u3000\t]/.test(line) ||
         /^[１-５1-5]\s{2}/.test(line);
}

function optNum(line) { return parseInt(fw2hw(line[0])); }

function optTxt(line) {
  return line.replace(/^[０-９0-9][\s\u3000\t]+/, '').trim();
}

function isQuestion(line) {
  return /^問題[\s　]*\d+/.test(line);
}

function isSkip(line) {
  return /^[—\-–]\s*\d+\s*[—\-–]$/.test(line) ||
         /^- \d+ -$/.test(line) ||
         /^\d+\s*$/.test(line) ||
         /^\d{4}_\d+_KAI/.test(line);  // skip PDF internal refs like "8033_04_KAIAM..."
}

// Detect year section header. Returns year number or 0.
function detectSectionYear(line) {
  // "第38回（令和7年度）" or "第37回（令和6年度）" (NOT followed by question text)
  // Also handles "■ 第37回（令和6年度）"
  const m = line.match(/第(\d+)回[（(]/);
  if (m && !/^問題/.test(line)) return parseInt(m[1]);
  return 0;
}

// Extract year embedded IN question line: "問題 80（第34回）"
function extractEmbeddedYear(line) {
  const m = line.match(/^問題[\s　]*\d+[（(]第(\d+)回[)）]/);
  return m ? parseInt(m[1]) : null;
}

function qNum(line) {
  // Strip embedded year annotation before extracting number
  const cleaned = line.replace(/[（(]第\d+回[)）]/, '');
  const m = cleaned.match(/^問題[\s　]*(\d+)/);
  return m ? parseInt(m[1]) : -1;
}

function qRestText(line) {
  // Remove "問題 NN（第XX回）" prefix
  const after = line
    .replace(/^問題[\s　]*\d+[（(]第\d+回[)）]?\s*/, '')
    .trim();
  if (!after) return '';
  if (after.length <= 15 && !/選びなさい|記述|関する|場合|次の/.test(after)) return '';
  return after;
}

// ─── Answer key section detection ─────────────────────────────────────────────

function findAnswerKeyStart(lines) {
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (/^解\s*答\s*一\s*覧$/.test(l)) return i;
    if (/^解答[・.]解説/.test(l) || /^解答と解説/.test(l)) return i;
    if (/問題番号.*正解/.test(l)) return i;
  }
  const bodyHasSquare = lines.slice(0, Math.min(50, lines.length)).some(l => /^■\s*第\d+回/.test(l));
  if (!bodyHasSquare) {
    const idx = lines.findIndex(l => /^■\s*第\d+回/.test(l));
    if (idx >= 0) return idx;
  }
  return -1;
}

function parseAnswerKey(keyLines) {
  const map = {};
  let i = 0;
  while (i < keyLines.length) {
    const l = keyLines[i].trim();
    const inlineM = l.match(/^問題[\s　]*(\d+)[\s\u3000]*正解[：:]\s*([１-５1-5])/);
    if (inlineM) {
      map[parseInt(inlineM[1])] = parseInt(fw2hw(inlineM[2])) - 1;
      i++; continue;
    }
    const qOnlyM = l.match(/^問題[\s　]*(\d+)$/);
    if (qOnlyM) {
      const qn = parseInt(qOnlyM[1]);
      i++;
      while (i < keyLines.length) {
        const ans = keyLines[i].trim();
        if (/^[１-５1-5]$/.test(ans)) {
          map[qn] = parseInt(fw2hw(ans)) - 1;
          i++; break;
        }
        if (/^問題[\s　]*\d+/.test(ans) || /^■/.test(ans) || ans === '') break;
        i++;
      }
      continue;
    }
    i++;
  }
  return map;
}

// ─── Body parser ─────────────────────────────────────────────────────────────

function parseBody(bodyLines, answerMap, subject, period) {
  const questions = [];
  let i = 0;
  let currentYear = 0;

  while (i < bodyLines.length) {
    const line = bodyLines[i];

    if (isSkip(line)) { i++; continue; }

    // Section year header (not a question line)
    const secYear = detectSectionYear(line);
    if (secYear > 0 && !isQuestion(line)) {
      currentYear = secYear;
      i++;
      continue;
    }

    if (!isQuestion(line)) { i++; continue; }

    const qn = qNum(line);
    // Check for year embedded in question line: 問題 80（第34回）
    const embeddedYear = extractEmbeddedYear(line);
    const questionYear = embeddedYear !== null ? embeddedYear : currentYear;

    let questionParts = [qRestText(line)].filter(Boolean);
    i++;

    // Collect question text lines
    while (i < bodyLines.length) {
      const l = bodyLines[i];
      if (isSkip(l)) { i++; continue; }
      if (isOption(l) || isQuestion(l) || detectSectionYear(l) > 0) break;
      questionParts.push(l);
      i++;
    }

    // Collect up to 5 options
    const options = Array(5).fill('');
    let optCount = 0;
    while (i < bodyLines.length && optCount < 5) {
      const l = bodyLines[i];
      if (isSkip(l)) { i++; continue; }
      if (!isOption(l)) {
        if (isQuestion(l) || detectSectionYear(l) > 0) break;
        i++; continue;
      }
      const n = optNum(l) - 1;
      let txt = optTxt(l);
      i++;
      while (i < bodyLines.length) {
        const next = bodyLines[i];
        if (isSkip(next)) { i++; continue; }
        if (isOption(next) || isQuestion(next) || detectSectionYear(next) > 0) break;
        if (/【正答[：:]/.test(next)) break;
        txt += next;
        i++;
      }
      if (n >= 0 && n < 5) { options[n] = txt.replace(/\s+/g, ' ').trim(); optCount++; }
    }

    // Get correct answer
    let correctAnswer = answerMap.hasOwnProperty(qn) ? answerMap[qn] : -1;
    if (correctAnswer < 0) {
      const peek = bodyLines.slice(i, i + 5);
      for (const pl of peek) {
        const am = pl.match(/【正答[：:]\s*([１-５1-5])/);
        if (am) { correctAnswer = parseInt(fw2hw(am[1])) - 1; break; }
      }
      while (i < bodyLines.length) {
        const l = bodyLines[i];
        if (/【正答[：:]/.test(l)) { i++; break; }
        if (isQuestion(l) || detectSectionYear(l) > 0) break;
        if (!isSkip(l) && !isOption(l)) { i++; } else break;
      }
    }

    const question = questionParts.join('').replace(/\s+/g, ' ').trim();
    if (!question || optCount < 2 || questionYear === 0) continue;

    questions.push({
      id: `${period}-${subject.slice(0, 4)}-y${questionYear}-q${qn}`,
      kai: `第${questionYear}回`,
      subject, period,
      year: questionYear,
      questionNo: qn,
      question,
      options,
      correctAnswer,
      explanation: correctAnswer >= 0
        ? `正答は選択肢${correctAnswer + 1}です。`
        : '解答は解答一覧を参照してください。',
    });
  }
  return questions;
}

function parseQuestions(text, subject) {
  const period = SUBJECT_PERIOD[subject];
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  const akStart = findAnswerKeyStart(lines);
  const hasInline = lines.some(l => /【正答[：:]/.test(l));

  let bodyLines, keyLines;
  if (akStart >= 0) {
    bodyLines = lines.slice(0, akStart);
    keyLines  = lines.slice(akStart);
    console.log(`    → appendix at line ${akStart}`);
  } else {
    bodyLines = lines;
    keyLines  = [];
    console.log(`    → inline answers`);
  }

  const answerMap = parseAnswerKey(keyLines);
  return parseBody(bodyLines, answerMap, subject, period);
}

// ─── Parse k_*_38.pdf (question paper only, answers from KAI38_ANSWERS) ──────

function parseK38(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const questions = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (isSkip(line)) { i++; continue; }
    if (!isQuestion(line)) { i++; continue; }

    const qn = qNum(line);
    const subjectInfo = getKai38Subject(qn);
    if (!subjectInfo) { i++; continue; }

    let questionParts = [qRestText(line)].filter(Boolean);
    i++;

    while (i < lines.length) {
      const l = lines[i];
      if (isSkip(l)) { i++; continue; }
      if (isOption(l) || isQuestion(l)) break;
      questionParts.push(l);
      i++;
    }

    const options = Array(5).fill('');
    let optCount = 0;
    while (i < lines.length && optCount < 5) {
      const l = lines[i];
      if (isSkip(l)) { i++; continue; }
      if (!isOption(l)) {
        if (isQuestion(l)) break;
        i++; continue;
      }
      const n = optNum(l) - 1;
      let txt = optTxt(l);
      i++;
      while (i < lines.length) {
        const next = lines[i];
        if (isSkip(next)) { i++; continue; }
        if (isOption(next) || isQuestion(next)) break;
        txt += next;
        i++;
      }
      if (n >= 0 && n < 5) { options[n] = txt.replace(/\s+/g, ' ').trim(); optCount++; }
    }

    const question = questionParts.join('').replace(/\s+/g, ' ').trim();
    if (!question || optCount < 2) continue;

    const { subject, period } = subjectInfo;
    const correctAnswer = KAI38_ANSWERS.hasOwnProperty(qn) ? KAI38_ANSWERS[qn] : -1;

    questions.push({
      id: `${period}-${subject.slice(0, 4)}-y38-q${qn}`,
      kai: '第38回',
      subject, period,
      year: 38,
      questionNo: qn,
      question,
      options,
      correctAnswer,
      explanation: correctAnswer >= 0
        ? `正答は選択肢${correctAnswer + 1}です。`
        : '解答は解答一覧を参照してください。',
    });
  }
  return questions;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const allQuestions = [];
  const byKaiSubject = {}; // track what we have

  // 1. Extract from subject PDFs
  for (const [subject, filename] of Object.entries(SUBJECT_FILES)) {
    const filepath = path.join(PDF_DIR, filename);
    if (!fs.existsSync(filepath)) { console.warn(`MISSING: ${filename}`); continue; }

    console.log(`\nExtracting: ${subject}`);
    const data = await pdf(fs.readFileSync(filepath));
    const qs = parseQuestions(data.text, subject);
    const withAns = qs.filter(q => q.correctAnswer >= 0).length;
    console.log(`  → ${qs.length} questions (${withAns} with answers)`);

    // Deduplicate by id
    for (const q of qs) {
      if (!byKaiSubject[q.id]) {
        byKaiSubject[q.id] = q;
        allQuestions.push(q);
      }
    }
  }

  // 2. Extract from k_*_38.pdf files for 第38回 subjects missing from subject PDFs
  console.log('\n--- Extracting 第38回 from exam paper PDFs ---');
  for (const fname of K38_FILES) {
    const filepath = path.join(PDF_DIR, fname);
    if (!fs.existsSync(filepath)) { console.warn(`MISSING: ${fname}`); continue; }

    console.log(`\n${fname}`);
    const data = await pdf(fs.readFileSync(filepath));
    const qs = parseK38(data.text);
    const withAns = qs.filter(q => q.correctAnswer >= 0).length;
    console.log(`  → ${qs.length} questions (${withAns} with answers)`);

    for (const q of qs) {
      if (!byKaiSubject[q.id]) {
        byKaiSubject[q.id] = q;
        allQuestions.push(q);
      }
    }
  }

  // 3. Summary
  const kais = ['第31回','第32回','第33回','第34回','第35回','第36回','第37回','第38回'];
  const subjects = Object.keys(SUBJECT_PERIOD);

  console.log('\n=== PER-回 SUMMARY ===');
  const perKai = {};
  allQuestions.forEach(q => {
    perKai[q.kai] = (perKai[q.kai] || {});
    perKai[q.kai][q.subject] = (perKai[q.kai][q.subject] || 0) + 1;
  });

  for (const kai of kais) {
    const ks = perKai[kai] || {};
    const total = Object.values(ks).reduce((a,b)=>a+b,0);
    console.log(`${kai}: ${total}/125 questions`);
    subjects.forEach(s => {
      const got = ks[s] || 0;
      const exp = {
        '人間の尊厳と自立':2,'人間関係とコミュニケーション':2,'社会の理解':12,
        'こころとからだのしくみ':12,'発達と老化の理解':8,'認知症の理解':10,
        '障害の理解':10,'医療的ケア':7,'介護の基本':10,'コミュニケーション技術':8,
        '生活支援技術':20,'介護過程':12,'総合問題':12
      }[s];
      if (got < exp) console.log(`  ⚠ ${s}: ${got}/${exp}`);
    });
  }

  console.log(`\nTotal: ${allQuestions.length} questions`);

  const out = 'C:/Users/thant/ksajapan-public/src/data/pastQuestions.json';
  fs.writeFileSync(out, JSON.stringify(allQuestions, null, 2), 'utf8');
  console.log(`Saved → ${out}`);
}

main().catch(console.error);
