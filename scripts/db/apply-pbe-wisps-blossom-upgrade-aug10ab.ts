// Bổ sung field `blossomUpgradeDescriptionVi` cho các Tinh Linh có mô tả
// "Nâng cấp Hoa Linh" bị đổi số liệu trong bản vá 18.1ab (10/08/2026, xem
// Website/pbe-notes/Patch_TFT18.1ab-PBE-moderate-balance-pass.md, mục
// "Blossom Charms"). Đây là field RIÊNG với `cost` (đã sửa ở
// apply-pbe-wisps-cost-aug10ab.ts) — mỗi tinh linh thường có 1 dòng "Bonus
// XP/Health/Gold/Chance/Time/Deaths..." mô tả phiên bản nâng cấp khi có tộc
// hệ Blossom, tách biệt với giá mua (Cost) của chính tinh linh đó.
//
// Đã dump dữ liệu hiện tại trước khi ghi — toàn bộ 12 dòng dưới đây đều khớp
// đúng giá trị "from" của patch, xác nhận đúng vị trí cần sửa.
import { eq } from 'drizzle-orm';
import { db } from '../../src/db/client';
import { set18Wisps } from '../../src/db/schema';

function replaceExact(text: string, oldStr: string, newStr: string, ctx: string): string {
  if (!text.includes(oldStr)) {
    throw new Error(`[${ctx}] Không tìm thấy chuỗi cần thay: ${JSON.stringify(oldStr)}`);
  }
  return text.split(oldStr).join(newStr);
}

async function updateBlossomUpgrade(name: string, from: string, to: string) {
  const [row] = await db.select().from(set18Wisps).where(eq(set18Wisps.name, name));
  if (!row) throw new Error(`Wisp không tìm thấy: ${name}`);
  const current = row.blossomUpgradeDescriptionVi ?? '';
  const next = replaceExact(current, from, to, `${name}/blossomUpgradeDescriptionVi`);
  await db.update(set18Wisps).set({ blossomUpgradeDescriptionVi: next, updatedAt: new Date() }).where(eq(set18Wisps.name, name));
  console.log(`✓ ${name}: "${from}" → "${to}"`);
}

async function main() {
  await updateBlossomUpgrade('Bronze Spoon', 'Nhận 6 XP.', 'Nhận 4 XP.');
  await updateBlossomUpgrade('Experienced', 'Nhận 4 XP.', 'Nhận 2 XP.');
  await updateBlossomUpgrade('Blood and Iron', 'Sau 14 lần', 'Sau 16 lần');
  await updateBlossomUpgrade('Blood Ritual', 'Mất 6 Máu Người Chơi.', 'Mất 8 Máu Người Chơi.');
  await updateBlossomUpgrade('Healing Pool', 'Hồi 9 Máu Người Chơi.', 'Hồi 7 Máu Người Chơi.');
  await updateBlossomUpgrade('Rolling Bones', '65% cơ hội', '60% cơ hội');
  await updateBlossomUpgrade('Roly-Polys', 'ở giây thứ 15,', 'ở giây thứ 16,');
  await updateBlossomUpgrade('All Fours', 'Nhận 4 vàng.', 'Nhận 2 vàng.');
  await updateBlossomUpgrade('All Threes', 'Nhận 3 vàng.', 'Nhận 2 vàng.');
  await updateBlossomUpgrade('All Twos', 'Nhận 2 vàng.', 'Nhận 1 vàng.');
  await updateBlossomUpgrade('Barter', 'cho 300% vàng.', 'cho 250% vàng.');
  await updateBlossomUpgrade('Lesser Chaos', 'có giá trị 2 vàng trở lên.', 'có giá trị 1 vàng trở lên.');

  console.log('✓ Hoàn tất cập nhật blossomUpgradeDescriptionVi cho 12 Tinh Linh.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

// ── Các mục CỐ Ý bỏ qua (không đủ căn cứ để sửa an toàn) ───────────
// - Radiant Mana Potion (patch: Starting Mana 25→20, Teamwide Mana 20→10):
//   wisp gốc trong DB là "Mana Potion", blossomUpgradeDescriptionVi chỉ ghi
//   trừu tượng "Nhận 1 Bình Năng Lượng Ánh Sáng dùng một lần có thể trang
//   bị." — không có số liệu Mana cụ thể trong text để thay.
// - Killing Frenzy (patch: Attack Speed 120%→140%): blossomUpgradeDescriptionVi
//   chỉ có "20% Tốc Độ Đánh khi hạ gục" (bonus khi hạ gục) — không khớp con
//   số 120%/140% của patch (nhiều khả năng là 1 field khác không lộ ra trong
//   mô tả), không đoán.
