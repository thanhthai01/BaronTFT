// Bổ sung field `cost` cho 11 bùa Blossom Charm bị thay đổi giá trong bản vá
// 18.1ab (10/08/2026, xem Website/pbe-notes/Patch_TFT18.1ab-PBE-moderate-balance-pass.md).
// Đây KHÔNG phải nội dung patch note gốc (Riot không công bố giá trị "hiện
// tại" của các bùa này trong DB) — người dùng đã xác nhận trực tiếp muốn bổ
// sung field `cost` còn thiếu/lệch bằng giá trị "to" mới nhất của patch, sau
// khi thấy bùa "Three Me" hiện "NaN" (cost null) trên UI. Đã dump giá trị
// hiện tại trước khi ghi — 5/11 khớp đúng "from" của patch (Bronze Spoon,
// Die Roll, Experienced, Forest Twins, Lost Travelers), 6/11 đang null (Three
// Me, Big Guns, Doodad Bag, Knick-Knack Bag, Smurfing, Thingamajig Bag).
import { eq } from 'drizzle-orm';
import { db } from '../../src/db/client';
import { set18Wisps } from '../../src/db/schema';

const updates: Array<{ name: string; cost: number }> = [
  { name: 'Three Me', cost: 8 },
  { name: 'Big Guns', cost: 7 },
  { name: 'Bronze Spoon', cost: 2 },
  { name: 'Die Roll', cost: 3 },
  { name: 'Doodad Bag', cost: 1 },
  { name: 'Experienced', cost: 0 },
  { name: 'Forest Twins', cost: 5 },
  { name: 'Knick-Knack Bag', cost: 1 },
  { name: 'Lost Travelers', cost: 4 },
  { name: 'Smurfing', cost: 6 },
  { name: 'Thingamajig Bag', cost: 1 },
];

async function main() {
  for (const { name, cost } of updates) {
    const [row] = await db.select().from(set18Wisps).where(eq(set18Wisps.name, name));
    if (!row) throw new Error(`Wisp không tìm thấy: ${name}`);
    await db.update(set18Wisps).set({ cost, updatedAt: new Date() }).where(eq(set18Wisps.name, name));
    console.log(`✓ ${name}: cost → ${cost}`);
  }
  console.log('✓ Hoàn tất cập nhật cost cho 11 bùa Blossom.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
