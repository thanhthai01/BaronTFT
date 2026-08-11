// Sửa lại 3 điểm sau khi người dùng review DB đã ghi từ bản vá 18.1ab
// (10/08/2026, xem Website/pbe-notes/Patch_TFT18.1ab-PBE-moderate-balance-pass.md):
//
// 1) Killing Frenzy — patch ghi "Attack Speed: 120% → 140%". Người dùng xác
//    nhận công thức: 100% (base) + X% (on-kill bonus trong mô tả) = tổng
//    hiển thị trong patch note. Vậy 120% ứng với bonus 20% (khớp đúng số
//    hiện có trong blossomUpgradeDescriptionVi), 140% ứng với bonus 40%.
//
// 2) 6 bùa Blossom Charm KHÔNG có giá gốc (Three Me, Big Guns, Doodad Bag,
//    Knick-Knack Bag, Smurfing, Thingamajig Bag) — trước script
//    apply-pbe-wisps-cost-aug10ab.ts, field `cost` của cả 6 đều là null
//    (khác 5 bùa còn lại đã có cost khớp "from" của patch). Người dùng xác
//    nhận: null nghĩa là các bùa này KHÔNG tồn tại dưới dạng giá gốc (trước
//    nâng cấp Hoa Linh) — không nên mặc định giá trị "to" của patch vào
//    `cost`. Trả `cost` về null, chuyển giá trị đó sang `blossomUpgradeCost`.
//
// 3) Radiant Mana Potion — là dạng nâng cấp Hoa Linh của "Mana Potion" trong
//    DB, mô tả gốc chỉ ghi trừu tượng không có số liệu. Người dùng muốn coi
//    đây như 1 trang bị riêng có chỉ số riêng — bổ sung số liệu cụ thể từ
//    patch (Starting Mana 20, Teamwide Mana 10) vào mô tả nâng cấp. Đây LÀ
//    ghi đè trực tiếp (không dùng replaceExact) vì bản gốc không có số để
//    đối chiếu — không phải nội dung patch note gốc, là bổ sung theo yêu cầu
//    người dùng 11/08/2026.
import { eq } from 'drizzle-orm';
import { db } from '../../src/db/client';
import { set18Wisps } from '../../src/db/schema';

function replaceExact(text: string, oldStr: string, newStr: string, ctx: string): string {
  if (!text.includes(oldStr)) {
    throw new Error(`[${ctx}] Không tìm thấy chuỗi cần thay: ${JSON.stringify(oldStr)}`);
  }
  return text.split(oldStr).join(newStr);
}

async function getWisp(name: string) {
  const [row] = await db.select().from(set18Wisps).where(eq(set18Wisps.name, name));
  if (!row) throw new Error(`Wisp không tìm thấy: ${name}`);
  return row;
}

async function main() {
  // 1) Killing Frenzy
  {
    const row = await getWisp('Killing Frenzy');
    const next = replaceExact(
      row.blossomUpgradeDescriptionVi ?? '',
      'Họ nhận được 20% Tốc Độ Đánh khi hạ gục.',
      'Họ nhận được 40% Tốc Độ Đánh khi hạ gục.',
      'KillingFrenzy/blossomUpgradeDescriptionVi',
    );
    await db.update(set18Wisps).set({ blossomUpgradeDescriptionVi: next, updatedAt: new Date() }).where(eq(set18Wisps.name, 'Killing Frenzy'));
    console.log('✓ Killing Frenzy: bonus AS khi hạ gục 20% → 40%');
  }

  // 2) Trả cost về null, chuyển giá trị sang blossomUpgradeCost
  const noBaseCostCharms: Array<{ name: string; upgradeCost: number }> = [
    { name: 'Three Me', upgradeCost: 8 },
    { name: 'Big Guns', upgradeCost: 7 },
    { name: 'Doodad Bag', upgradeCost: 1 },
    { name: 'Knick-Knack Bag', upgradeCost: 1 },
    { name: 'Smurfing', upgradeCost: 6 },
    { name: 'Thingamajig Bag', upgradeCost: 1 },
  ];
  for (const { name, upgradeCost } of noBaseCostCharms) {
    await db
      .update(set18Wisps)
      .set({ cost: null, blossomUpgradeCost: upgradeCost, updatedAt: new Date() })
      .where(eq(set18Wisps.name, name));
    console.log(`✓ ${name}: cost → null, blossomUpgradeCost → ${upgradeCost}`);
  }

  // 3) Radiant Mana Potion — bổ sung số liệu cụ thể (không có anchor để replaceExact)
  await db
    .update(set18Wisps)
    .set({
      blossomUpgradeDescriptionVi:
        'Nhận 1 Bình Năng Lượng Ánh Sáng dùng một lần có thể trang bị. Năng lượng khởi đầu: 20. Năng lượng cả đội: 10.',
      updatedAt: new Date(),
    })
    .where(eq(set18Wisps.name, 'Mana Potion'));
  console.log('✓ Mana Potion (Radiant Mana Potion): bổ sung số liệu Năng lượng khởi đầu/cả đội');

  console.log('✓ Hoàn tất fixup.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
