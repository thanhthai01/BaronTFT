// Giai đoạn 4a của "Dọn lỗi dữ liệu DB + hiển thị UI cho codex Set 18": điền
// `nicknameVi` (tên VI chính thức) cho 10 tướng Quái Rừng — cột này tồn tại
// sẵn (xem set-champion-nicknames.ts, 07/08/2026) nhưng trước đó chỉ có 1/65
// tướng (Raptor) được điền, và điền SAI ("Chim Quỷ Biến Dị" thay vì "Chim Mẹ").
//
// Hỗ trợ --dry-run — LUÔN chạy trước khi ghi thật.
//
// Nguồn: tftips.app/vi/champs — trích trực tiếp text hiển thị của link mỗi
// tướng (map qua href/slug, KHÔNG qua thứ tự hiển thị). Đã quét toàn bộ 65
// tướng: chỉ đúng 10 tướng Quái Rừng có tên VI thay thế tên EN, 55 tướng còn
// lại tftips vẫn hiển thị nguyên tên EN (Akali, Ahri, Camille...) — khớp quy
// ước cột này ("tên VI chính thức", phần lớn để trống, chỉ điền khi có bản
// dịch xác nhận, xem comment schema.ts).
//
// Raptor: người dùng đã xác nhận chốt "Chim Mẹ" (khớp slug tftips
// `18_mamabeak`, và khớp `riot_official` glossary trong Set18/CLAUDE.md:
// "Mama Beak `Chim Biến Dị` → `Chim Mẹ`"), ghi đè giá trị sai cũ.
import { eq } from 'drizzle-orm';
import { db } from '../../src/db/client';
import { set18Champions } from '../../src/db/schema';

const DRY_RUN = process.argv.includes('--dry-run');

function replaceExact(text: string, oldStr: string, newStr: string, ctx: string): string {
  if (!text.includes(oldStr)) throw new Error(`[${ctx}] Không tìm thấy chuỗi cần thay: ${JSON.stringify(oldStr)}`);
  return text.split(oldStr).join(newStr);
}

function diffLine(label: string, from: unknown, to: unknown) {
  const a = JSON.stringify(from);
  const b = JSON.stringify(to);
  if (a === b) return;
  console.log(`    ${label}: ${a} -> ${b}`);
}

const NICKNAMES: Record<string, string> = {
  'champion:tft18_cinderling': 'Mầm Non',
  'champion:tft18_pebbles': 'Sỏi',
  'champion:tft18_gromp': 'Cóc Thành Tinh Gromp',
  'champion:tft18_scuttlecrab': 'Cua Kỳ Cục',
  'champion:tft18_murkwolf': 'Sói Hắc Ám',
  'champion:tft18_raptor': 'Chim Mẹ',
  'champion:tft18_krug': 'Quái Đá Krug',
  'champion:tft18_brambleback': 'Bụi Gai Đỏ',
  'champion:tft18_ancientsentinel': 'Người Đá',
  'champion:tft18_elderdragon': 'Rồng Ngàn Tuổi',
};

async function main() {
  const ids = Object.keys(NICKNAMES);
  const rows = await db.select({ id: set18Champions.id, name: set18Champions.name, nicknameVi: set18Champions.nicknameVi }).from(set18Champions);
  for (const id of ids) {
    const row = rows.find((r) => r.id === id);
    if (!row) throw new Error(`Champion không tìm thấy: ${id}`);
    const before = row.nicknameVi;
    const after = NICKNAMES[id];
    if (before === after) {
      console.log(`= ${id} (${row.name}): đã khớp "${after}", bỏ qua`);
      continue;
    }
    if (DRY_RUN) {
      console.log(`[DRY-RUN] champion ${id} (${row.name}): nicknameVi ${JSON.stringify(before)} -> ${JSON.stringify(after)}`);
      continue;
    }
    await db.update(set18Champions).set({ nicknameVi: after, updatedAt: new Date() }).where(eq(set18Champions.id, id));
    console.log(`✓ champion ${id} (${row.name}): nicknameVi = "${after}"`);
  }

  // ═══════════════ abilityVi/abilityHtmlVi tự gọi tên mình lệch nicknameVi ═══════════════
  // Gromp ("Cóc Thành Tinh Gromp") và Ancient Sentinel ("Người Đá") đã khớp
  // sẵn nicknameVi trong text — không cần sửa. Elder Dragon/Krug/Scuttlecrab/
  // Murkwolf/Pebbles không tự nhắc tên mình trong ability text.

  await fixAbilitySelfName('champion:tft18_cinderling', 'Mầm Non Thành Tinh', 'Mầm Non');
  await fixAbilitySelfName('champion:tft18_brambleback', 'cho Brambleback', 'cho Bụi Gai Đỏ');
  await fixAbilitySelfName('champion:tft18_raptor', 'nào Raptor tấn công', 'nào Chim Mẹ tấn công');
}

async function fixAbilitySelfName(id: string, from: string, to: string) {
  const [row] = await db.select().from(set18Champions).where(eq(set18Champions.id, id));
  if (!row) throw new Error(`Champion không tìm thấy: ${id}`);
  const abilityVi = replaceExact(row.abilityVi, from, to, `${id}/abilityVi`);
  const forms = (row.forms as any[]).map((f) => ({ ...f, abilityHtmlVi: replaceExact(f.abilityHtmlVi, from, to, `${id}/forms/abilityHtmlVi`) }));

  if (DRY_RUN) {
    console.log(`[DRY-RUN] champion ${id} (ability self-name)`);
    diffLine('abilityVi', row.abilityVi, abilityVi);
    forms.forEach((f, i) => diffLine(`forms[${i}].abilityHtmlVi`, (row.forms as any[])[i]?.abilityHtmlVi, f.abilityHtmlVi));
    return;
  }

  await db.update(set18Champions).set({ abilityVi, forms, updatedAt: new Date() }).where(eq(set18Champions.id, id));
  console.log(`✓ champion ${id} (ability self-name: "${from}" -> "${to}")`);
}

main()
  .then(() => {
    console.log(DRY_RUN ? 'DRY RUN xong — không có gì được ghi.' : 'Hoàn tất ghi DB.');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
