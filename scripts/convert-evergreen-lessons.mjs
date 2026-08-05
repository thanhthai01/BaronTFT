// Converter một lần: docs/evergreen/*.md → src/content/*.generated.ts
// Chạy: pnpm content:sync
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { marked } from 'marked';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEBSITE_ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(WEBSITE_ROOT, 'src/content');

const GENERATED_HEADER = `// AUTO-GENERATED bởi scripts/convert-evergreen-lessons.mjs — KHÔNG sửa tay.
// Sửa nội dung ở docs/evergreen rồi chạy lại \`pnpm content:sync\`.`;

const EXCLUDED_FILES = new Set([
  '00-lo-trinh/03-cach-dung-giao-trinh.md',
  'references/source-map.md',
  'references/tftacademy-guide-map.md',
  'references/video-library.md',
  'README.md',
]);
const ROADMAP_FILES = ['00-lo-trinh/01-ban-do-ky-nang.md', '00-lo-trinh/02-lo-trinh-8-tuan.md'];
const PRACTICE_FORM_FILE = '06-luyen-tap-va-review/04-bieu-mau-thuc-hanh.md';
const GLOSSARY_FILE = 'references/glossary.md';

const CATEGORY_LABELS = {
  'ra-quyet-dinh': { module: 'Ra quyết định', skill: 'Ra quyết định' },
  'van-hanh-kinh-te': { module: 'Vận hành kinh tế', skill: 'Kinh tế / Tempo' },
  'xay-dung-doi-hinh': { module: 'Xây dựng đội hình', skill: 'Đội hình / Item' },
  'doc-lobby-va-giao-tranh': { module: 'Đọc lobby và giao tranh', skill: 'Lobby / Combat' },
  'du-lieu-va-thich-nghi': { module: 'Dữ liệu và thích nghi', skill: 'Dữ liệu / Patch' },
  'luyen-tap-va-review': { module: 'Luyện tập và review', skill: 'Luyện tập / Review' },
  'chuyen-de': { module: 'Chuyên đề nâng cao', skill: 'Chuyên đề' },
};

const frontMatterByPath = new Map();

function findEvergreenDir(start) {
  let dir = start;
  for (let i = 0; i < 8; i++) {
    const candidate = path.join(dir, 'docs', 'evergreen');
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error(`Không tìm thấy docs/evergreen từ ${start}`);
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    if (entry.name === 'legacy') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files = files.concat(walk(full));
    else files.push(full);
  }
  return files;
}

function toRel(evergreenDir, absPath) {
  return path.relative(evergreenDir, absPath).split(path.sep).join('/');
}

function stripInlineMarkdown(text) {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    .trim();
}

function firstSentenceOf(text) {
  const plain = stripInlineMarkdown((text.split('\n')[0] || '').trim());
  const match = plain.match(/^(.+?[.!?])(\s|$)/);
  return (match ? match[1] : plain).trim();
}

function extractBulletItems(markdown) {
  return markdown
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^-\s+/.test(line))
    .map((line) => stripInlineMarkdown(line.replace(/^-\s+(\[[ xX]\]\s*)?/, '')))
    .filter(Boolean);
}

function extractOrderedItems(markdown) {
  return markdown
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^\d+\.\s+/.test(line))
    .map((line) => stripInlineMarkdown(line.replace(/^\d+\.\s+/, '')))
    .filter(Boolean);
}

function extractLinks(markdown) {
  const links = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let m = re.exec(markdown);
  while (m) {
    links.push({ label: m[1], target: m[2] });
    m = re.exec(markdown);
  }
  return links;
}

function demoteHeadings(markdown) {
  return markdown.replace(/^###\s+/gm, '#### ');
}

function mdToHtml(markdown) {
  let html = marked.parse(markdown, { gfm: true }).trim();
  html = html.replace(/<blockquote>\s*\n?<p>\s*(?:<strong>)?Case study/gi, (match) =>
    match.replace('<blockquote>', '<blockquote class="case-study">'),
  );
  return html;
}

function splitSections(markdown) {
  const lines = markdown.split('\n');
  const headingIdx = [];
  lines.forEach((line, i) => {
    if (/^## /.test(line)) headingIdx.push(i);
  });
  const intro = lines.slice(0, headingIdx[0] ?? lines.length).join('\n').trim();
  const sections = [];
  for (let i = 0; i < headingIdx.length; i++) {
    const start = headingIdx[i];
    const end = i + 1 < headingIdx.length ? headingIdx[i + 1] : lines.length;
    const heading = lines[start].replace(/^##\s+/, '').trim();
    const body = lines.slice(start + 1, end).join('\n').trim();
    sections.push({ heading, body });
  }
  return { intro, sections };
}

function stripLeadingH1(content) {
  const trimmed = content.replace(/^\s+/, '');
  return trimmed.replace(/^#\s+.*(\r?\n)*/, '');
}

function parseMarkdownTable(body) {
  const lines = body
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('|'));
  const rows = lines.slice(2);
  return rows.map((line) => line.slice(1, -1).split('|').map((c) => c.trim()));
}

function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function resolveRelated(fromRelPath, target, fileMap) {
  if (/^https?:\/\//.test(target)) {
    throw new Error(`Link ngoài không hỗ trợ trong "Bài liên quan" (${fromRelPath}): ${target}`);
  }
  const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(fromRelPath), target));
  const href = fileMap.get(resolved);
  if (!href) {
    throw new Error(`Không resolve được "Bài liên quan" trong ${fromRelPath}: "${target}" → ${resolved}`);
  }
  return href;
}

function buildExerciseBlock(heading, body) {
  const hasH3 = /^###\s+/m.test(body);
  if (!hasH3) {
    const orderedItems = extractOrderedItems(body);
    const bulletItems = extractBulletItems(body);
    const steps = orderedItems.length > 0 ? orderedItems : bulletItems;
    if (steps.length > 0) {
      const listStartIdx = body.search(/^(-|\d+\.)\s+/m);
      const goalRaw = listStartIdx > 0 ? body.slice(0, listStartIdx).trim() : '';
      return { type: 'drill', title: heading, goal: goalRaw ? stripInlineMarkdown(goalRaw) : '', steps };
    }
  }
  return { type: 'concept', title: heading, html: mdToHtml(demoteHeadings(body)) };
}

function deriveExerciseSummary(exerciseSection, warnings, relPath) {
  if (!exerciseSection) {
    warnings.push(`exercise rỗng (không có mục "Bài tập") ở ${relPath}`);
    return '';
  }
  const { body } = exerciseSection;
  const h3Match = body.match(/^###\s+(.+)$/m);
  if (h3Match) {
    const idx = body.indexOf(h3Match[0]);
    const after = body.slice(idx + h3Match[0].length);
    const nextH3Idx = after.search(/^###\s+/m);
    const subBody = nextH3Idx === -1 ? after : after.slice(0, nextH3Idx);
    const sentence = firstSentenceOf(subBody.trim());
    if (sentence) return sentence;
  }
  const items = extractOrderedItems(body).concat(extractBulletItems(body));
  if (items.length > 0) return items[0];
  warnings.push(`exercise rỗng (không trích được câu nào) ở ${relPath}`);
  return '';
}

function computeDuration(content) {
  const lineCount = content.split('\n').filter((l) => l.trim().length > 0).length;
  const minutes = Math.max(5, Math.round(lineCount / 4 / 5) * 5);
  return `~${minutes} phút`;
}

function computeShortTitle(title, relPath, warnings) {
  if (title.length > 28) {
    warnings.push(`shortTitle: tiêu đề dài ${title.length} ký tự ở ${relPath}: "${title}" — cần rút gọn tay.`);
  }
  return title;
}

function buildLesson(relPath, fileMap, warnings) {
  const { data, content } = frontMatterByPath.get(relPath);
  const body = stripLeadingH1(content);
  const { intro, sections } = splitSections(body);
  const blocks = [];
  let principlesItems = [];
  let pitfallsItems = [];
  let checklistItems = [];
  let exerciseSection = null;
  let relatedRaw = null;

  if (intro) blocks.push({ type: 'concept', title: 'Giới thiệu', html: mdToHtml(intro) });

  for (const section of sections) {
    const { heading, body: sectionBody } = section;
    if (heading === 'Mục tiêu') {
      principlesItems = extractBulletItems(sectionBody);
      blocks.push({ type: 'principles', title: heading, items: principlesItems });
    } else if (heading === 'Lỗi thường gặp') {
      pitfallsItems = extractBulletItems(sectionBody);
      blocks.push({ type: 'pitfalls', title: heading, items: pitfallsItems });
    } else if (heading.startsWith('Checklist')) {
      checklistItems = extractBulletItems(sectionBody);
      blocks.push({ type: 'checklist', title: heading, items: checklistItems });
    } else if (heading === 'Bài tập') {
      exerciseSection = section;
      blocks.push(buildExerciseBlock(heading, sectionBody));
    } else if (heading === 'Bài liên quan') {
      relatedRaw = sectionBody;
    } else if (heading === 'Nguồn nền') {
      // bỏ hoàn toàn, không lên web
    } else {
      blocks.push({ type: 'concept', title: heading, html: mdToHtml(demoteHeadings(sectionBody)) });
    }
  }

  if (!checklistItems.length) warnings.push(`applyQuestions rỗng (thiếu Checklist) ở ${relPath}`);
  if (!pitfallsItems.length) warnings.push(`commonMistake rỗng (thiếu Lỗi thường gặp) ở ${relPath}`);

  const exerciseSummary = deriveExerciseSummary(exerciseSection, warnings, relPath);
  const categoryInfo = CATEGORY_LABELS[data.category];
  if (!categoryInfo) throw new Error(`Category "${data.category}" không có trong bảng tra (${relPath})`);
  if (!data.slug) throw new Error(`Thiếu slug trong front matter: ${relPath}`);

  const related = relatedRaw
    ? extractLinks(relatedRaw).map(({ label, target }) => ({
        label: stripInlineMarkdown(label),
        href: resolveRelated(relPath, target, fileMap),
      }))
    : [];

  return {
    slug: data.slug,
    title: data.title,
    module: categoryInfo.module,
    shortTitle: computeShortTitle(data.title, relPath, warnings),
    summary: principlesItems[0] || (intro ? firstSentenceOf(intro) : data.title),
    skill: categoryInfo.skill,
    duration: computeDuration(content),
    exercise: exerciseSummary,
    commonMistake: pitfallsItems[0] || '',
    applyQuestions: checklistItems.slice(0, 3),
    related,
    blocks,
  };
}

function buildWeek({ heading, body }, fromFile, fileMap) {
  const read = [];
  const readMatch = body.match(/\*\*Đọc:\*\*([\s\S]*?)(?=\n\*\*|\n##|$)/);
  if (readMatch) {
    for (const { label, target } of extractLinks(readMatch[1])) {
      read.push({ label: stripInlineMarkdown(label), href: resolveRelated(fromFile, target, fileMap) });
    }
  }

  const exerciseMatch = body.match(/\*\*Bài tập:\*\*([\s\S]*?)(?=\n\*\*|\n##|$)/);
  let exercises;
  if (exerciseMatch) {
    exercises = extractBulletItems(exerciseMatch[1]);
  } else {
    const firstBoldIdx = body.search(/\*\*[^*]+:\*\*/);
    const leading = firstBoldIdx === -1 ? body : body.slice(0, firstBoldIdx);
    exercises = extractBulletItems(leading);
  }

  const outcomeMatch = body.match(/\*\*(?:Qua tuần khi|Đầu ra):\*\*\s*(.+)/);
  const outcome = outcomeMatch ? stripInlineMarkdown(outcomeMatch[1]) : '';

  return { title: heading, read, exercises, outcome };
}

function buildRoadmap(fileMap) {
  const mapFile = ROADMAP_FILES[0];
  const weeksFile = ROADMAP_FILES[1];
  const { content: mapContent } = frontMatterByPath.get(mapFile);
  const { content: weeksContent } = frontMatterByPath.get(weeksFile);

  const { sections: mapSections } = splitSections(stripLeadingH1(mapContent));

  const tiersSection = mapSections.find((s) => s.heading === 'Sáu tầng năng lực');
  if (!tiersSection) throw new Error(`Không tìm thấy mục "Sáu tầng năng lực" trong ${mapFile}`);
  const tiers = parseMarkdownTable(tiersSection.body).map(([tier, question, skill]) => ({
    tier: stripInlineMarkdown(tier),
    question: stripInlineMarkdown(question),
    skill: stripInlineMarkdown(skill),
  }));

  const symptomSection = mapSections.find((s) => s.heading === 'Bản đồ lỗi → bài học');
  if (!symptomSection) throw new Error(`Không tìm thấy mục "Bản đồ lỗi → bài học" trong ${mapFile}`);
  const symptomMap = parseMarkdownTable(symptomSection.body).map(([symptom, lessonCell]) => {
    const [link] = extractLinks(lessonCell);
    if (!link) throw new Error(`Bảng chẩn đoán thiếu link ở ô: ${lessonCell}`);
    return {
      symptom: stripInlineMarkdown(symptom),
      label: stripInlineMarkdown(link.label),
      href: resolveRelated(mapFile, link.target, fileMap),
    };
  });

  const { sections: weekSections } = splitSections(stripLeadingH1(weeksContent));
  const weeks = weekSections.filter((s) => s.heading !== 'Sau 8 tuần').map((s) => buildWeek(s, weeksFile, fileMap));
  const afterSection = weekSections.find((s) => s.heading === 'Sau 8 tuần');
  const afterSteps = afterSection ? extractOrderedItems(afterSection.body) : [];

  return { tiers, symptomMap, weeks, afterSteps };
}

function buildPracticeForms() {
  const relPath = PRACTICE_FORM_FILE;
  const { content } = frontMatterByPath.get(relPath);
  const { sections } = splitSections(stripLeadingH1(content));
  const forms = [];
  let reviewQuestions = [];
  for (const { heading, body } of sections) {
    const numMatch = heading.match(/^(\d+)\.\s+(.+)$/);
    if (!numMatch) throw new Error(`Heading biểu mẫu không đúng dạng "N. Tên": "${heading}" (${relPath})`);
    const [, num, title] = numMatch;
    if (num === '7') {
      reviewQuestions = extractOrderedItems(body);
      continue;
    }
    const codeMatch = body.match(/```text\n([\s\S]*?)```/);
    if (!codeMatch) throw new Error(`Không tìm thấy code block cho biểu mẫu "${heading}" (${relPath})`);
    forms.push({ id: slugify(title), title, template: codeMatch[1].replace(/\n$/, '') });
  }
  if (!reviewQuestions.length) throw new Error(`Không tìm thấy 10 câu review sâu trong ${relPath}`);
  return { forms, reviewQuestions };
}

function buildGlossary() {
  const relPath = GLOSSARY_FILE;
  const { content } = frontMatterByPath.get(relPath);
  const { intro } = splitSections(stripLeadingH1(content));
  const rows = parseMarkdownTable(intro);
  const terms = rows.map(([term, definition]) => ({
    term: stripInlineMarkdown(term),
    definition: stripInlineMarkdown(definition),
  }));
  if (!terms.length) throw new Error(`Không parse được thuật ngữ nào từ ${relPath}`);
  return { terms };
}

function writeGenerated(fileName, src) {
  fs.writeFileSync(path.join(CONTENT_DIR, fileName), src);
}

async function main() {
  const warnings = [];
  const EVERGREEN_DIR = findEvergreenDir(WEBSITE_ROOT);

  const allFiles = walk(EVERGREEN_DIR).filter((f) => f.endsWith('.md'));
  const relFiles = allFiles.map((f) => toRel(EVERGREEN_DIR, f));

  for (const rel of relFiles) {
    const raw = fs.readFileSync(path.join(EVERGREEN_DIR, rel), 'utf8');
    const { data, content } = matter(raw);
    frontMatterByPath.set(rel, { data, content });
  }

  const lessonFiles = relFiles.filter(
    (rel) =>
      !EXCLUDED_FILES.has(rel) &&
      !ROADMAP_FILES.includes(rel) &&
      rel !== PRACTICE_FORM_FILE &&
      rel !== GLOSSARY_FILE &&
      !rel.startsWith('references/legacy/'),
  );
  if (lessonFiles.length !== 28) {
    throw new Error(`Kỳ vọng đúng 28 file lesson, thấy ${lessonFiles.length}:\n${lessonFiles.join('\n')}`);
  }

  const slugSet = new Set();
  for (const rel of lessonFiles) {
    const slug = frontMatterByPath.get(rel).data.slug;
    if (slugSet.has(slug)) throw new Error(`Slug trùng nhau: "${slug}" (${rel})`);
    slugSet.add(slug);
  }

  const fileMap = new Map();
  for (const rel of lessonFiles) {
    fileMap.set(rel, `/bai-hoc/${frontMatterByPath.get(rel).data.slug}`);
  }
  for (const rel of ROADMAP_FILES) fileMap.set(rel, '/lo-trinh');
  fileMap.set(PRACTICE_FORM_FILE, '/bieu-mau');
  fileMap.set(GLOSSARY_FILE, '/thuat-ngu');

  const lessons = lessonFiles.map((rel) => buildLesson(rel, fileMap, warnings));
  const roadmap = buildRoadmap(fileMap);
  const practiceForms = buildPracticeForms();
  const glossary = buildGlossary();

  writeGenerated(
    'lessons.generated.ts',
    `${GENERATED_HEADER}\nimport type { Lesson } from './lessons';\n\nexport const lessons: Lesson[] = ${JSON.stringify(
      lessons,
      null,
      2,
    )};\n\nexport function getLesson(slug: string): Lesson | undefined {\n  return lessons.find((lesson) => lesson.slug === slug);\n}\n`,
  );

  writeGenerated(
    'roadmap.generated.ts',
    `${GENERATED_HEADER}\nexport type RoadmapTier = { tier: string; question: string; skill: string };\nexport type RoadmapSymptom = { symptom: string; label: string; href: string };\nexport type RoadmapWeek = { title: string; read: Array<{ label: string; href: string }>; exercises: string[]; outcome: string };\n\nexport const roadmapTiers: RoadmapTier[] = ${JSON.stringify(
      roadmap.tiers,
      null,
      2,
    )};\n\nexport const roadmapSymptoms: RoadmapSymptom[] = ${JSON.stringify(
      roadmap.symptomMap,
      null,
      2,
    )};\n\nexport const roadmapWeeks: RoadmapWeek[] = ${JSON.stringify(
      roadmap.weeks,
      null,
      2,
    )};\n\nexport const roadmapAfterSteps: string[] = ${JSON.stringify(roadmap.afterSteps, null, 2)};\n`,
  );

  writeGenerated(
    'practice-forms.generated.ts',
    `${GENERATED_HEADER}\nexport type PracticeForm = { id: string; title: string; template: string };\n\nexport const practiceForms: PracticeForm[] = ${JSON.stringify(
      practiceForms.forms,
      null,
      2,
    )};\n\nexport const practiceReviewQuestions: string[] = ${JSON.stringify(practiceForms.reviewQuestions, null, 2)};\n`,
  );

  writeGenerated(
    'glossary.generated.ts',
    `${GENERATED_HEADER}\nexport type GlossaryTerm = { term: string; definition: string };\n\nexport const glossaryTerms: GlossaryTerm[] = ${JSON.stringify(
      glossary.terms,
      null,
      2,
    )};\n`,
  );

  if (warnings.length) {
    console.warn(`\n${warnings.length} cảnh báo cần review tay:`);
    warnings.forEach((w) => console.warn(` - ${w}`));
  }
  console.log(
    `\nĐã sinh ${lessons.length} lesson, ${roadmap.weeks.length} tuần lộ trình, ${practiceForms.forms.length} biểu mẫu, ${glossary.terms.length} thuật ngữ.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
