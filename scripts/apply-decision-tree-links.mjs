// Script một lần: thay `related: KIEN_THUC_HREF` (hằng số dùng chung, luôn trỏ
// URL trần '/kien-thuc-nen-tang') bằng `related: lessonLink('<slug>')` — mỗi
// node trỏ đúng bài học sát ngữ cảnh của nó (đã map thủ công theo nội dung
// từng node, xem plan mục A-5). Chạy 1 lần rồi xoá.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.resolve(__dirname, '../src/content/decision-trees.ts');

// Thứ tự đúng bằng thứ tự xuất hiện `related: KIEN_THUC_HREF` trong file gốc
// (grep -n xác nhận đúng 25 dòng, theo đúng thứ tự dưới đây).
const SLUGS_IN_ORDER = [
  'level-roll-outs-va-breakpoint', // len-cap-tu-tu
  'level-roll-outs-va-breakpoint', // len-cap-giu-vang
  'kinh-te-mau-chuoi-va-tempo', // len-cap-ngay
  'level-roll-outs-va-breakpoint', // roll-chua-can
  'level-roll-outs-va-breakpoint', // roll-nhe
  'flex-transition-va-pivot', // pivot-flex-tung-phan
  'flex-transition-va-pivot', // pivot-doi-ngay
  'flex-transition-va-pivot', // pivot-du-phong
  'flex-transition-va-pivot', // pivot-khong-can
  'trang-bi-va-phan-bo-chi-so', // slam-do-giu-cho-pivot
  'trang-bi-va-phan-bo-chi-so', // slam-do-unit-khac
  'trang-bi-va-phan-bo-chi-so', // slam-do-cho
  'trang-bi-va-phan-bo-chi-so', // slam-do-ngay
  'kinh-te-mau-chuoi-va-tempo', // streak-lose-co-chu-dich
  'kinh-te-mau-chuoi-va-tempo', // streak-buong
  'kinh-te-mau-chuoi-va-tempo', // streak-nuoi
  'doc-trang-thai-va-muc-tieu-thu-hang', // placement-danh-top4
  'doc-trang-thai-va-muc-tieu-thu-hang', // placement-giu-top4
  'doc-trang-thai-va-muc-tieu-thu-hang', // placement-choi-top1
  'scouting-contest-va-lobby-ecology', // scout-chuan-bi
  'scouting-contest-va-lobby-ecology', // scout-bo-qua
  'scouting-contest-va-lobby-ecology', // scout-toan-lobby
  'positioning-targeting-va-pathing', // scout-doi-thu-round-toi
  'tu-duy-tft-xuyen-mua', // allin-cho
  'tu-duy-tft-xuyen-mua', // allin-giam-quy-mo
];

const raw = fs.readFileSync(FILE, 'utf8');
const EOL = raw.includes('\r\n') ? '\r\n' : '\n';
const lines = raw.split(/\r\n|\n/);
const TARGET = '                  related: KIEN_THUC_HREF,';

let cursor = 0;
for (let i = 0; i < lines.length; i++) {
  if (lines[i] === TARGET) {
    if (cursor >= SLUGS_IN_ORDER.length) throw new Error(`Thừa dòng KIEN_THUC_HREF tại line ${i + 1}, chỉ có ${SLUGS_IN_ORDER.length} slug trong danh sách.`);
    lines[i] = `                  related: lessonLink('${SLUGS_IN_ORDER[cursor]}'),`;
    cursor++;
  }
}

if (cursor !== SLUGS_IN_ORDER.length) {
  throw new Error(`Chỉ thay được ${cursor}/${SLUGS_IN_ORDER.length} dòng — kiểm tra lại TARGET có khớp indent không.`);
}

let out = lines.join('\n');
out = out.replace(
  "const KIEN_THUC_HREF = { label: 'Mở bài học liên quan', href: '/kien-thuc-nen-tang' };\n",
  '',
);
out = out.replace(
  "export type DecisionEdgeTone = 'good' | 'bad' | 'neutral';\n",
  "import { lessons } from './lessons';\n\nexport type DecisionEdgeTone = 'good' | 'bad' | 'neutral';\n",
);
out = out.replace(
  "const CHECKLIST_HREF = { label: 'Mở checklist trong trận', href: '/checklist' };\n",
  `const CHECKLIST_HREF = { label: 'Mở checklist trong trận', href: '/checklist' };

const lessonBySlug = new Map(lessons.map((lesson) => [lesson.slug, lesson]));

/** Trỏ tới đúng bài kiến thức nền tảng sát ngữ cảnh của node — thay cho hằng
 * số KIEN_THUC_HREF cũ (mọi node dùng chung 1 URL trần \`/kien-thuc-nen-tang\`,
 * luôn redirect sang bài đầu tiên bất kể chủ đề node là gì). */
function lessonLink(slug: string): { label: string; href: string } {
  const lesson = lessonBySlug.get(slug);
  if (!lesson) throw new Error(\`lessonLink: không tìm thấy slug "\${slug}"\`);
  return { label: \`Mở bài: \${lesson.title}\`, href: \`/kien-thuc-nen-tang/\${slug}\` };
}
`,
);

if (EOL === '\r\n') out = out.replace(/\n/g, '\r\n');
fs.writeFileSync(FILE, out);
console.log(`Đã thay ${cursor} dòng related: KIEN_THUC_HREF.`);
