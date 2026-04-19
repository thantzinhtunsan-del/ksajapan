const pdf = require('pdf-parse/lib/pdf-parse.js');
const fs = require('fs');
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

// Fullwidth digit → halfwidth
function fw2hw(ch) {
  const fw = '０１２３４５６７８９';
  const idx = fw.indexOf(ch);
  return idx >= 0 ? String(idx) : ch;
}

// Is this line an option? Starts with 1-5 (half/fullwidth) + space/tab/ideographic-space
function isOption(line) {
  return /^[１-５1-5][\s\u3000\t]/.test(line) ||
         /^[１-５1-5]\s{2}/.test(line);   // "1  text" (2 spaces)
}

function optNum(line) {
  return parseInt(fw2hw(line[0]));
}

function optTxt(line) {
  return line.replace(/^[０-９0-9][\s\u3000\t]+/, '').trim();
}

// Is this line a question start?  "問題NN..." or "問題NNカテゴリ"
function isQuestion(line) {
  return /^問題\s*\d+/.test(line);
}

function qNum(line) {
  const m = line.match(/^問題\s*(\d+)/);
  return m ? parseInt(m[1]) : -1;
}

function qRestText(line) {
  // Remove "問題 NN" prefix (and trailing space if present)
  const after = line.replace(/^問題\s*\d+\s*/, '').trim();
  // If what remains is a short category label (no verb endings, <15 chars) skip it
  // e.g. "救急蘩法" vs "次の記述のうち、..."
  if (after.length <= 15 && !/選びなさい|記述|関する|場合|次の/.test(after)) return '';
  return after;
}

// Skip lines that are page markers, headers, footers
function isSkip(line) {
  return /^[—\-–]\s*\d+\s*[—\-–]$/.test(line) ||  // — 1 —
         /^- \d+ -$/.test(line) ||                    // - 1 -
         /^\d+\s*$/.test(line);                       // bare page number
}

// Is this a year header?  "第37回" or "■ 第37回" or "第37回（令和..."
function isYearHeader(line) {
  return /第(\d+)回/.test(line);
}

function extractYear(line) {
  const m = line.match(/第(\d+)回/);
  return m ? parseInt(m[1]) : 0;
}

// ─── Find answer key split point ─────────────────────────────────────────────
// Returns the index of the first line that belongs to the answer appendix,
// or -1 if no appendix found (answers inline in body).
function findAnswerKeyStart(lines) {
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    // Standalone "解答一覧" heading (with optional spaces between chars)
    if (/^解\s*答\s*一\s*覧$/.test(l)) return i;
    // "解答・解説" heading
    if (/^解答[・.]解説/.test(l) || /^解答と解説/.test(l)) return i;
    // Answer table column header "問題番号　正解　あなた..."
    if (/問題番号.*正解/.test(l)) return i;
  }
  // Look for "■ 第XX回" ONLY if body year headers don't use "■"
  // Check: if body lines 0..bodyGuess use "■ 第" then it's body, not appendix
  const bodyHasSquare = lines.slice(0, Math.min(50, lines.length)).some(l => /^■\s*第\d+回/.test(l));
  if (!bodyHasSquare) {
    const idx = lines.findIndex(l => /^■\s*第\d+回/.test(l));
    if (idx >= 0) return idx;
  }
  return -1;
}

// ─── Parse answer key section ─────────────────────────────────────────────────
// Handles two sub-formats:
//   A) "問題39\n1" (question number on one line, answer on next)
//   B) "問題59　正解：1" (question + answer on same line)
function parseAnswerKey(keyLines) {
  const map = {}; // qNum → 0-indexed correct answer
  let i = 0;
  while (i < keyLines.length) {
    const l = keyLines[i].trim();

    // Format B: "問題59　正解：1" or "問題59 正解：1"
    const inlineM = l.match(/^問題\s*(\d+)[\s\u3000]*正解[：:]\s*([１-５1-5])/);
    if (inlineM) {
      map[parseInt(inlineM[1])] = parseInt(fw2hw(inlineM[2])) - 1;
      i++; continue;
    }

    // Format A: "問題39" on its own line, next non-empty non-header line is the answer
    const qOnlyM = l.match(/^問題\s*(\d+)$/);
    if (qOnlyM) {
      const qn = parseInt(qOnlyM[1]);
      i++;
      while (i < keyLines.length) {
        const ans = keyLines[i].trim();
        if (/^[１-５1-5]$/.test(ans)) {
          map[qn] = parseInt(fw2hw(ans)) - 1;
          i++; break;
        }
        if (/^問題\s*\d+/.test(ans) || /^■/.test(ans) || ans === '') break;
        i++;
      }
      continue;
    }
    i++;
  }
  return map;
}

// ─── Parse questions from body lines ─────────────────────────────────────────
function parseBody(bodyLines, answerMap, subject, period) {
  const questions = [];
  let i = 0;
  let year = 0;

  while (i < bodyLines.length) {
    const line = bodyLines[i];

    if (isSkip(line)) { i++; continue; }
    if (isYearHeader(line) && !isQuestion(line)) { year = extractYear(line); i++; continue; }

    if (!isQuestion(line)) { i++; continue; }

    const qn = qNum(line);
    let questionParts = [qRestText(line)].filter(Boolean);
    i++;

    // Collect question text
    while (i < bodyLines.length) {
      const l = bodyLines[i];
      if (isSkip(l)) { i++; continue; }
      if (isOption(l) || isQuestion(l) || isYearHeader(l)) break;
      questionParts.push(l);
      i++;
    }

    // Collect options (up to 5)
    const options = Array(5).fill('');
    let optCount = 0;
    while (i < bodyLines.length && optCount < 5) {
      const l = bodyLines[i];
      if (isSkip(l)) { i++; continue; }
      if (!isOption(l)) {
        if (isQuestion(l) || isYearHeader(l)) break;
        i++; continue;
      }
      const n = optNum(l) - 1;
      let txt = optTxt(l);
      i++;
      // Option may wrap to next line — stop at answer line or next question
      while (i < bodyLines.length) {
        const next = bodyLines[i];
        if (isSkip(next)) { i++; continue; }
        if (isOption(next) || isQuestion(next) || isYearHeader(next)) break;
        if (/【正答[：:]/.test(next)) break;   // ← stop before answer line
        txt += next;
        i++;
      }
      if (n >= 0 && n < 5) { options[n] = txt.replace(/\s+/g, ' ').trim(); optCount++; }
    }

    // Find inline answer (Format A PDFs)
    let correctAnswer = answerMap.hasOwnProperty(qn) ? answerMap[qn] : -1;
    if (correctAnswer < 0) {
      // Check next lines for inline 【正答
      const peek = bodyLines.slice(i, i + 5);
      for (const pl of peek) {
        const am = pl.match(/【正答[：:]\s*([１-５1-5])/);
        if (am) { correctAnswer = parseInt(fw2hw(am[1])) - 1; break; }
      }
      // Consume the 【正答 line
      while (i < bodyLines.length) {
        const l = bodyLines[i];
        if (/【正答[：:]/.test(l)) { i++; break; }
        if (isQuestion(l) || isYearHeader(l)) break;
        if (!isSkip(l) && !isOption(l)) { i++; } else break;
      }
    }

    const question = questionParts.join('').replace(/\s+/g, ' ').trim();
    if (!question || optCount < 2) continue;

    questions.push({
      id: `${period}-${subject.slice(0, 4)}-y${year}-q${qn}`,
      subject, period, year,
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

// ─── Main parse ──────────────────────────────────────────────────────────────
function parseQuestions(text, subject) {
  const period = SUBJECT_PERIOD[subject];
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  const akStart = findAnswerKeyStart(lines);
  const hasInline = lines.some(l => /【正答[：:]/.test(l));

  let bodyLines, keyLines;
  if (akStart >= 0) {
    bodyLines = lines.slice(0, akStart);
    keyLines = lines.slice(akStart);
    console.log(`    → Format B (appendix at line ${akStart})`);
  } else if (hasInline) {
    bodyLines = lines;
    keyLines = [];
    console.log(`    → Format A (inline answers)`);
  } else {
    bodyLines = lines;
    keyLines = [];
    console.log(`    → Format A (inline answers, fallback)`);
  }

  const answerMap = parseAnswerKey(keyLines);
  console.log(`    Answer key entries: ${Object.keys(answerMap).length}`);

  return parseBody(bodyLines, answerMap, subject, period);
}

// ─── Entry point ─────────────────────────────────────────────────────────────
async function main() {
  const allQuestions = [];
  const stats = {};

  const EXPECTED = {
    '人間の尊厳と自立': 2, '人間関係とコミュニケーション': 2, '社会の理解': 12,
    'こころとからだのしくみ': 12, '発達と老化の理解': 8, '認知症の理解': 10,
    '障害の理解': 10, '医療的ケア': 7, '介護の基本': 10,
    'コミュニケーション技術': 8, '生活支援技術': 20, '介護過程': 12, '総合問題': 12,
  };

  for (const [subject, filename] of Object.entries(SUBJECT_FILES)) {
    const filepath = path.join(PDF_DIR, filename);
    if (!fs.existsSync(filepath)) { console.warn(`MISSING: ${filename}`); continue; }

    console.log(`\nExtracting: ${subject}`);
    const data = await pdf(fs.readFileSync(filepath));
    const qs = parseQuestions(data.text, subject);
    const withAnswer = qs.filter(q => q.correctAnswer >= 0).length;
    stats[subject] = qs.length;
    allQuestions.push(...qs);
    console.log(`  → ${qs.length} questions (${withAnswer} with answers, ${data.numpages} pages)`);
  }

  console.log('\n=== SUMMARY vs EXAM STANDARDS (125 questions/exam) ===');
  console.log('Subject'.padEnd(30) + 'Got'.padEnd(8) + 'PerExam'.padEnd(10) + '≈Years');
  console.log('-'.repeat(60));
  for (const [sub, cnt] of Object.entries(stats)) {
    const pe = EXPECTED[sub];
    const yr = (cnt / pe).toFixed(1);
    const flag = cnt >= pe * 6 ? '✓' : '⚠';
    console.log(sub.padEnd(30) + String(cnt).padEnd(8) + String(pe).padEnd(10) + yr + ' ' + flag);
  }
  const total = Object.values(stats).reduce((a, b) => a + b, 0);
  console.log('-'.repeat(60));
  console.log(`TOTAL: ${total} questions`);

  const out = 'C:/Users/thant/ksajapan-public/src/questions_extracted.json';
  fs.writeFileSync(out, JSON.stringify(allQuestions, null, 2), 'utf8');
  console.log(`\nSaved → ${out}`);
}

main().catch(console.error);
