// Script một lần: ghi `summary` + `prerequisite` (đã duyệt ở kế hoạch Đợt 4)
// vào frontmatter 28 file docs/evergreen/*.md. Chạy xong thì chạy lại
// `pnpm content:sync` để regenerate lessons.generated.ts/roadmap.generated.ts.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EVERGREEN_DIR = path.resolve(__dirname, '../../docs/evergreen');

const SUMMARIES = {
  'tu-duy-tft-xuyen-mua': 'Mô hình 5 bước biến quan sát trong trận thành hành động: từ nhận tín hiệu đến chọn mục tiêu, ra quyết định và tự kiểm tra lại sau mỗi round.',
  'tai-nguyen-va-gia-tri-lua-chon': 'Xác định đúng sáu loại tài nguyên trong trận (vàng, máu, thời gian, thông tin...) và cách tính chi phí cơ hội trước khi đưa ra một lựa chọn lớn.',
  'doc-trang-thai-va-muc-tieu-thu-hang': 'Bảng chẩn đoán 2×2 để mô tả trạng thái trận bằng số liệu thật thay vì cảm giác, từ đó chọn đúng mục tiêu thứ hạng cho ván đấu.',
  'strongest-board-va-opener': 'Cách chọn khai cuộc mạnh nhất mỗi ván dựa trên sáu trụ sức mạnh của board, thay vì ép theo một đội hình định sẵn từ đầu.',
  'kinh-te-mau-chuoi-va-tempo': 'Đọc tempo lobby để quyết định khi nào nên giữ vàng, khi nào nên chi — hợp nhất kinh tế, máu và chuỗi thắng/thua vào một khung quyết định.',
  'level-roll-outs-va-breakpoint': 'Tính outs trước mỗi lần rolldown, chọn breakpoint lên cấp và đặt ngưỡng dừng rõ ràng — nền tảng cho các bài roll và xác suất nâng cao.',
  'ke-hoach-tft-theo-stage': 'Lộ trình từng stage trong trận gắn với điều kiện thắng cụ thể, giúp biết nên làm gì ở stage 2, 3, 4 thay vì chơi theo phản xạ.',
  'vai-tro-toc-he-va-board-cap': 'Xây board theo vai trò carry, tank, support và trần sức mạnh tộc hệ, thay vì chỉ nhìn tên tộc hệ rồi ghép quân theo quán tính.',
  'trang-bi-va-phan-bo-chi-so': 'Công thức thực dụng để ghép item đúng nút thắt của carry và tank — nền tảng trước khi học sâu về chỉ số, chí mạng và breakpoint trang bị.',
  'chon-nang-cap-tft': 'Đánh giá một Nâng Cấp theo đúng thời điểm, điều kiện kích hoạt và trạng thái board hiện tại, không chọn theo độ hiếm hay tên gọi hào nhoáng.',
  'flex-transition-va-pivot': 'Flex là chuyển tài nguyên hiệu quả giữa các phương án, không phải học thêm nhiều đội hình — biết khi nào nên pivot, khi nào nên giữ vững.',
  'scouting-contest-va-lobby-ecology': 'Quy trình scout để đổi quyết định thật và đọc mức độ tranh chấp bài trong lobby — nền trước khi học sâu bốn archetype tempo của lobby.',
  'positioning-targeting-va-pathing': 'Xếp đội hình theo mục tiêu combat cụ thể — ai cần chết trước, ai cần sống tới cast hai — thay vì copy sơ đồ có sẵn từ người khác.',
  'mana-chu-ky-cast-va-animation': 'Bốn điều kiện để một kỹ năng thực sự cast được và công thức tốc độ tạo mana thực tế — nền cơ bản trước khi học cast time và breakpoint mana.',
  'cast-time-va-animation-lock': 'Phân biệt thời điểm mana đầy với thời điểm kỹ năng thực sự chạm mục tiêu, và bốn loại thời gian chết khiến tướng yếu hơn số liệu trên giấy.',
  'breakpoint-mana-nang-cao': 'Cast order toàn đội và cách đánh giá trang bị mana theo breakpoint giao tranh thực tế — áp dụng nâng cao sau khi đã nắm chu kỳ cast cơ bản.',
  'doc-du-lieu-tft-khong-bi-danh-lua': 'Dùng dữ liệu tỉ lệ thắng, tần suất chơi để đặt câu hỏi và kiểm chứng giả thuyết, không lấy con số thay thế hoàn toàn cho tư duy trong trận.',
  'cap-nhat-set-va-patch-tft': 'Quy trình giữ nguyên tư duy nền tảng và chỉ cập nhật đúng phần thay đổi mỗi khi Riot ra Set mới hoặc patch cân bằng lớn.',
  'xac-suat-shop-pool-va-variance': 'Ba lớp xác suất shop, pool tướng và độ biến thiên của một lần rolldown — nền tảng trước khi tính giá trị kỳ vọng của một lần roll.',
  'vod-review-va-phan-loai-loi': 'Cách xem lại VOD để tìm đúng lỗi đầu tiên làm mất quyền lựa chọn trong ván, thay vì liệt kê mọi thứ mình đã làm sai suốt trận đấu.',
  'bai-tap-tft-theo-ky-nang': 'Bộ bài tập luyện từng năng lực riêng biệt theo khối 10-20 trận, chỉ tập trung một kỹ năng chính mỗi lần thay vì luyện lan man cả quy trình.',
  'quan-ly-phien-choi-va-mindset': 'Cách bảo vệ chất lượng quyết định qua nhiều trận liên tiếp — nhận diện đúng lúc nên dừng phiên chơi trước khi tilt ảnh hưởng tới lựa chọn.',
  'chi-so-trang-bi-chi-mang-can-bang': 'Năm dạng loãng chỉ số và công thức giá trị kỳ vọng của chí mạng — đọc đúng carry đang thiếu nhóm chỉ số nào trước khi ghép món tiếp theo.',
  'roll-lobby-item-trait-nang-cao': 'Giá trị kỳ vọng của một lần roll, giữ cặp tướng hay giữ kinh tế, và cách mức độ tranh chấp ảnh hưởng quyết định rolldown ở trình độ nâng cao.',
  'unknown-unknowns-va-kiem-chung-tft': 'Khung tổng quát để nhận diện lúc tooltip hoặc dữ liệu không đủ để kết luận, và quy trình kiểm chứng một cơ chế game trước khi tin vào nó.',
  'item-index-nang-cao-va-blind-spots': 'Đọc đúng trait và augment đang cấp miễn phí nhóm chỉ số nào để chọn item bù đúng chỗ thiếu, cùng các tương tác chí mạng ít ai để ý.',
  'lobby-ecology-nang-cao': 'Bốn archetype tempo của lobby và hệ quả cụ thể của từng loại lên cách bạn chơi mỗi ván — đọc lobby như đọc một hệ sinh thái có quy luật.',
  'item-value-va-trait-breakpoint-nang-cao': 'Tính tổng giá trị một trang bị theo thời gian nắm giữ, không chỉ theo sát thương gây ra, cùng cách đọc trait breakpoint ở trình độ nâng cao.',
};

// Chuỗi cơ bản → nâng cao trong cùng cụm chủ đề (xem plan Đợt 4 / mục A-3).
const PREREQUISITES = {
  'cast-time-va-animation-lock': 'mana-chu-ky-cast-va-animation',
  'breakpoint-mana-nang-cao': 'cast-time-va-animation-lock',
  'xac-suat-shop-pool-va-variance': 'level-roll-outs-va-breakpoint',
  'roll-lobby-item-trait-nang-cao': 'xac-suat-shop-pool-va-variance',
  'chi-so-trang-bi-chi-mang-can-bang': 'trang-bi-va-phan-bo-chi-so',
  'item-index-nang-cao-va-blind-spots': 'chi-so-trang-bi-chi-mang-can-bang',
  'item-value-va-trait-breakpoint-nang-cao': 'trang-bi-va-phan-bo-chi-so',
  'lobby-ecology-nang-cao': 'scouting-contest-va-lobby-ecology',
};

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    if (entry.name === 'legacy') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files = files.concat(walk(full));
    else if (entry.name.endsWith('.md')) files.push(full);
  }
  return files;
}

const files = walk(EVERGREEN_DIR);
const bySlug = new Map();
for (const file of files) {
  const raw = fs.readFileSync(file, 'utf8');
  const parsed = matter(raw);
  if (parsed.data.slug) bySlug.set(parsed.data.slug, { file, parsed });
}

let updated = 0;
const missing = [];
for (const [slug, summary] of Object.entries(SUMMARIES)) {
  const entry = bySlug.get(slug);
  if (!entry) {
    missing.push(slug);
    continue;
  }
  entry.parsed.data.summary = summary;
  if (PREREQUISITES[slug]) entry.parsed.data.prerequisite = PREREQUISITES[slug];
  const out = matter.stringify(entry.parsed.content, entry.parsed.data);
  fs.writeFileSync(entry.file, out);
  updated++;
}

if (missing.length) {
  console.error(`Không tìm thấy slug: ${missing.join(', ')}`);
  process.exit(1);
}
console.log(`Đã cập nhật ${updated} file.`);
