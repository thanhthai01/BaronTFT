// DONE — KHÔNG CHẠY LẠI. Migration một lần cho 3 bản PBE (18.1x 04/08, 18.1y
// 05/08, 06/08) — cập nhật bảng set18_wisps theo đúng khuôn replaceExact +
// throw của apply-pbe-champion-updates.ts. Bản 06/08 chưa từng có script
// riêng cho Linh Hỏa (chỉ champion/trait/augment), nên gộp cả 3 bản vào đây.
//
// Nguyên tắc xử lý xung đột khi 1 field bị nhiều bản vá chạm tới: bản MỚI
// HƠN (06/08 > 05/08 > 04/08) là nguồn đúng cho state cuối cùng. Nếu giá trị
// "from" của một bản không khớp field hiện tại trong DB (codex đã lệch/cũ),
// hoặc field đó đã được một bản mới hơn ghi đè, BỎ QUA — không đoán. Danh
// sách các mục bị bỏ qua và lý do liệt kê ở cuối file.
import { eq } from 'drizzle-orm';
import { db } from '../../src/db/client';
import { set18Wisps } from '../../src/db/schema';

function replaceExact(text: string, oldStr: string, newStr: string, ctx: string): string {
  if (!text.includes(oldStr)) {
    throw new Error(`[${ctx}] Không tìm thấy chuỗi cần thay: ${JSON.stringify(oldStr)}`);
  }
  return text.split(oldStr).join(newStr);
}

async function updateWisp(
  name: string,
  edits: {
    cost?: number;
    appearsStart?: string;
    appearsEnd?: string;
    appearsVi?: string;
    description?: (s: string) => string;
    descriptionVi?: (s: string) => string;
    blossomUpgradeDescriptionVi?: (s: string) => string;
    conditionsVi?: string[];
  },
) {
  const [row] = await db.select().from(set18Wisps).where(eq(set18Wisps.name, name));
  if (!row) throw new Error(`Wisp không tìm thấy: ${name}`);
  const set: Record<string, unknown> = { updatedAt: new Date() };
  if (edits.cost !== undefined) set.cost = edits.cost;
  if (edits.appearsStart !== undefined) set.appearsStart = edits.appearsStart;
  if (edits.appearsEnd !== undefined) set.appearsEnd = edits.appearsEnd;
  if (edits.appearsVi !== undefined) set.appearsVi = edits.appearsVi;
  if (edits.description) set.description = edits.description(row.description ?? '');
  if (edits.descriptionVi) set.descriptionVi = edits.descriptionVi(row.descriptionVi ?? '');
  if (edits.blossomUpgradeDescriptionVi) {
    set.blossomUpgradeDescriptionVi = edits.blossomUpgradeDescriptionVi(row.blossomUpgradeDescriptionVi ?? '');
  }
  if (edits.conditionsVi) set.conditionsVi = edits.conditionsVi;
  await db.update(set18Wisps).set(set).where(eq(set18Wisps.name, name));
  console.log(`✓ wisp ${name}`);
}

async function main() {
  // ── Bản 06/08 ───────────────────────────────────────────────────
  await updateWisp('Barrier', {
    description: (s) => replaceExact(s, '1000 Shield, decaying over 5 seconds.', '1200 Shield, decaying over 6 seconds.', 'Barrier/description'),
    descriptionVi: (s) => replaceExact(s, '1000 Lá Chắn, giảm dần trong 5 giây.', '1200 Lá Chắn, giảm dần trong 6 giây.', 'Barrier/descriptionVi'),
    blossomUpgradeDescriptionVi: (s) => replaceExact(s, 'giảm dần trong 8 giây.', 'giảm dần trong 9 giây.', 'Barrier/upgrade'),
  });
  await updateWisp('Blood Ritual', {
    cost: 6,
    description: (s) => replaceExact(s, 'Lose 9 Player Health.', 'Lose 10 Player Health.', 'BloodRitual/description'),
    descriptionVi: (s) => replaceExact(s, 'Mất 9 Máu Người Chơi.', 'Mất 10 Máu Người Chơi.', 'BloodRitual/descriptionVi'),
    blossomUpgradeDescriptionVi: (s) => replaceExact(s, 'Mất 5 Máu Người Chơi.', 'Mất 6 Máu Người Chơi.', 'BloodRitual/upgrade'),
  });
  await updateWisp('Booster Shot', { cost: 6 });
  await updateWisp('Cutpurse', { cost: 3 });
  await updateWisp('Downpour', { cost: 3 });
  await updateWisp('Flood', {
    description: (s) => replaceExact(s, 'Add 2 to your win streak.', 'Add 1 to your win streak.', 'Flood/description'),
    descriptionVi: (s) => replaceExact(s, 'Thêm 2 vào chuỗi thắng của bạn.', 'Thêm 1 vào chuỗi thắng của bạn.', 'Flood/descriptionVi'),
    blossomUpgradeDescriptionVi: (s) => replaceExact(s, 'Thêm 3 vào chuỗi thắng của bạn.', 'Thêm 2 vào chuỗi thắng của bạn.', 'Flood/upgrade'),
  });
  await updateWisp('Grow Up', {
    cost: 7,
    description: (s) => replaceExact(s, 'Gain 16 XP.', 'Gain 10 XP.', 'GrowUp/description'),
    descriptionVi: (s) => replaceExact(s, 'Nhận 16 XP.', 'Nhận 10 XP.', 'GrowUp/descriptionVi'),
    blossomUpgradeDescriptionVi: (s) => replaceExact(s, 'Nhận 20 XP.', 'Nhận 12 XP.', 'GrowUp/upgrade'),
  });
  await updateWisp('Homing Fireflies', {
    description: (s) => replaceExact(s, 'Each deals 150 magic damage.', 'Each deals 125 magic damage.', 'HomingFireflies/description'),
    descriptionVi: (s) => replaceExact(s, 'Mỗi đom đóm gây 150 sát thương phép.', 'Mỗi đom đóm gây 125 sát thương phép.', 'HomingFireflies/descriptionVi'),
  });
  await updateWisp('Infliction', {
    cost: 6,
    blossomUpgradeDescriptionVi: (s) => replaceExact(s, 'trong 14 giây.', 'trong 12 giây.', 'Infliction/upgrade'),
  });
  await updateWisp("Killer's Regret", {
    description: (s) => replaceExact(s, 'stun their killer for 1 second.', 'stun their killer for 1.25 seconds.', "KillersRegret/description"),
    descriptionVi: (s) => replaceExact(s, 'làm choáng kẻ đã hạ gục họ trong 1 giây.', 'làm choáng kẻ đã hạ gục họ trong 1.25 giây.', "KillersRegret/descriptionVi"),
    blossomUpgradeDescriptionVi: (s) => replaceExact(s, 'trong 1.25 giây.', 'trong 1.5 giây.', "KillersRegret/upgrade"),
  });
  await updateWisp('Killing Frenzy', {
    description: (s) => replaceExact(s, 'execute targets under 10% Health.', 'execute targets under 12% Health.', 'KillingFrenzy/description'),
    descriptionVi: (s) => replaceExact(s, 'còn dưới 10% Máu.', 'còn dưới 12% Máu.', 'KillingFrenzy/descriptionVi'),
    blossomUpgradeDescriptionVi: (s) => replaceExact(s, 'còn dưới 12% Máu.', 'còn dưới 15% Máu.', 'KillingFrenzy/upgrade'),
  });
  await updateWisp('Late Bloomer', {
    description: (s) => replaceExact(s, 'with 1 recommended items joins your team.', 'with 0 recommended items joins your team.', 'LateBloomer/description'),
    descriptionVi: (s) => replaceExact(s, 'với 1 trang bị khuyên dùng sẽ gia nhập đội của bạn.', 'với 0 trang bị khuyên dùng sẽ gia nhập đội của bạn.', 'LateBloomer/descriptionVi'),
  });
  await updateWisp('Lost Travelers', {
    blossomUpgradeDescriptionVi: (s) => replaceExact(s, 'tổng giá là 5 vàng.', 'tổng giá là 4 vàng.', 'LostTravelers/upgrade'),
  });
  await updateWisp("Marksmen's Marks", {
    description: (s) => replaceExact(s, 'have a 25% chance to double attack.', 'have a 30% chance to double attack.', "MarksmensMarks/description"),
    descriptionVi: (s) => replaceExact(s, 'có 25% cơ hội tung đòn đánh kép.', 'có 30% cơ hội tung đòn đánh kép.', "MarksmensMarks/descriptionVi"),
  });
  await updateWisp('Payday', { cost: 4 });
  await updateWisp('Prolific Power', {
    appearsStart: '4-2',
    appearsEnd: '4-6',
    appearsVi: 'Xuất hiện: 4-2 đến 4-6',
  });
  await updateWisp('Quicken', {
    description: (s) => replaceExact(s, 'gain 25% Attack Speed for 3 seconds.', 'gain 30% Attack Speed for 3 seconds.', 'Quicken/description'),
    descriptionVi: (s) => replaceExact(s, 'nhận 25% Tốc Độ Đánh trong 3 giây.', 'nhận 30% Tốc Độ Đánh trong 3 giây.', 'Quicken/descriptionVi'),
    blossomUpgradeDescriptionVi: (s) => replaceExact(s, 'nhận 30% Tốc Độ Đánh trong 4 giây.', 'nhận 40% Tốc Độ Đánh trong 4 giây.', 'Quicken/upgrade'),
  });
  await updateWisp('Resistant', {
    description: (s) => replaceExact(s, 'reduce instances of incoming damage by 15.', 'reduce instances of incoming damage by 10.', 'Resistant/description'),
    descriptionVi: (s) => replaceExact(s, 'được giảm 15 sát thương nhận vào mỗi lần nhận sát thương.', 'được giảm 10 sát thương nhận vào mỗi lần nhận sát thương.', 'Resistant/descriptionVi'),
    blossomUpgradeDescriptionVi: (s) => replaceExact(s, 'được giảm 25 sát thương nhận vào mỗi lần bị tấn công.', 'được giảm 18 sát thương nhận vào mỗi lần bị tấn công.', 'Resistant/upgrade'),
  });
  await updateWisp('Roly-Polys', { cost: 4 });
  await updateWisp('Slow Study', { cost: 4 });
  await updateWisp('Snacktime!', {
    description: (s) => replaceExact(s, 'under 12% Max Health.', 'under 15% Max Health.', 'Snacktime/description'),
    descriptionVi: (s) => replaceExact(s, 'còn dưới 12% Máu Tối Đa mà nó gây sát thương lên.', 'còn dưới 15% Máu Tối Đa mà nó gây sát thương lên.', 'Snacktime/descriptionVi'),
  });
  await updateWisp('Ultra Ascension', { cost: 1 });
  await updateWisp('Verdant Vitality', {
    appearsStart: '4-2',
    appearsEnd: '4-6',
    appearsVi: 'Xuất hiện: 4-2 đến 4-6',
  });

  // ── Bản 05/08 (18.1y) ───────────────────────────────────────────
  await updateWisp('Animate Shop', {
    description: (s) => replaceExact(s, 'For 20 seconds, your shop rerolls for free every 2 seconds.', 'For 18 seconds, your shop rerolls for free every 2 seconds.', 'AnimateShop/description'),
    descriptionVi: (s) => replaceExact(s, 'Trong 20 giây, cửa hàng của bạn sẽ làm mới miễn phí sau mỗi 2 giây.', 'Trong 18 giây, cửa hàng của bạn sẽ làm mới miễn phí sau mỗi 2 giây.', 'AnimateShop/descriptionVi'),
    blossomUpgradeDescriptionVi: (s) => replaceExact(s, 'Trong 30 giây, cửa hàng của bạn sẽ làm mới miễn phí sau mỗi 2 giây.', 'Trong 26 giây, cửa hàng của bạn sẽ làm mới miễn phí sau mỗi 2 giây.', 'AnimateShop/upgrade'),
  });
  await updateWisp('Bark Armor', { cost: 0, conditionsVi: ['Đang thắng liên tiếp (chuỗi ngắn)'] });
  await updateWisp('Barter', { cost: 2 });
  await updateWisp('Component Bounty', {
    description: (s) => replaceExact(s, 'gain a component anvil.', 'gain a random component.', 'ComponentBounty/description'),
  });
  await updateWisp('Found Friend', { cost: 0, conditionsVi: ['Đang thắng liên tiếp (chuỗi ngắn)'] });
  await updateWisp('Golden Goose', {
    description: (s) => replaceExact(s, 'for every 1500 damage', 'for every 1700 damage', 'GoldenGoose/description'),
    descriptionVi: (s) => replaceExact(s, 'mỗi 1500 sát thương', 'mỗi 1700 sát thương', 'GoldenGoose/descriptionVi'),
    blossomUpgradeDescriptionVi: (s) => replaceExact(s, 'mỗi 900 sát thương', 'mỗi 1000 sát thương', 'GoldenGoose/upgrade'),
  });
  await updateWisp('Life Debt', {
    description: (s) => replaceExact(s, 'for every 10 missing Player Health.', 'for every 12 missing Player Health.', 'LifeDebt/description'),
    descriptionVi: (s) => replaceExact(s, 'cho mỗi 10 Máu người chơi đã mất.', 'cho mỗi 12 Máu người chơi đã mất.', 'LifeDebt/descriptionVi'),
  });
  await updateWisp('Major Polymorph', { cost: 0 });
  await updateWisp('Minor Polymorph', { cost: 0 });
  await updateWisp('Polymorph', { cost: 0 });
  await updateWisp('Salvager', {
    conditionsVi: ['Không đề xuất cùng No Scout No Pivot', 'Không đề xuất nếu đã có Crafted Crafting'],
  });

  // ── Bản 06/08 ghi đè thêm cho Major Gambit (cost + upgrade), 05/08 cho base ──
  await updateWisp('Major Gambit', {
    cost: 3,
    description: (s) => replaceExact(s, 'If you win the next player combat, gain 10 Gold.', 'If you win the next player combat, gain 8 Gold.', 'MajorGambit/description'),
    descriptionVi: (s) => replaceExact(s, 'Nếu bạn thắng giao tranh người chơi tiếp theo, nhận 10 vàng.', 'Nếu bạn thắng giao tranh người chơi tiếp theo, nhận 8 vàng.', 'MajorGambit/descriptionVi'),
    blossomUpgradeDescriptionVi: (s) => replaceExact(
      s,
      'Nếu bạn thắng giao tranh tiếp theo, nhận được 10 Vàng và một trang bị thành phần.',
      'Nếu bạn thắng giao tranh tiếp theo, nhận được 12 Vàng.',
      'MajorGambit/upgrade',
    ),
  });

  console.log('✓ Hoàn tất cập nhật set18_wisps.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

// ── Các mục CỐ Ý bỏ qua (không đủ căn cứ để sửa an toàn) ───────────
// - Hand Of Baron (06/08): mô tả chỉ ghi "Baron Buff" trừu tượng, không có %
//   AD/AP/AS/Health/MR/Armor cụ thể trong description để thay.
// - Heroic Sacrifice (06/08): Health Regen %/Omnivamp % không xuất hiện
//   trong description hiện tại (trừu tượng hoá qua "HEROIC POWER").
// - Nature's Wrath (04/08 + 06/08): 04/08 nói "re-enabled" giá 1g, nhưng
//   06/08 (mới hơn) nói "Removed" — bảng set18_wisps không có field
//   enabled/disabled, và trạng thái cuối cùng là đã gỡ nên không có gì để
//   sửa số liệu (cost hiện tại vẫn là 6, giữ nguyên làm dữ liệu tham khảo).
// - Refreshing Light (06/08): appearsStart/End hiện tại "3-5"–"4-1", không
//   khớp mốc "5-1 đến 5-6" mà patch nhắc tới — lệch hẳn, không đoán.
// - Flow (06/08 cost 2g→3g): cost hiện tại là null, không khớp "from"=2g.
// - Doodad Bag/Jar, Knick-Knack Jar, Thingamajig Jar (05/08 cost): cost hiện
//   tại đều null, không khớp "from" patch nêu — có thể các item Túi/Bảo Bối
//   cấp 1 này vốn không hiển thị giá trong DB (miễn phí theo thiết kế cũ).
//   Cũng bỏ qua phần "Upgrade Count" đi kèm vì blossomUpgradeDescriptionVi
//   đang là null (không có chỗ để chèn số).
// - Knick-Knack Bag, Thingamajig Bag (05/08 cost 2g→1g): cost hiện tại đã là
//   1 — đã ở đúng giá trị cuối cùng, không cần sửa.
// - Major Gambit (05/08 "Gold on Win 10/12"): phần base (10→8) áp dụng ở
//   trên; phần "upgrade 12→..." không khớp field upgrade hiện tại (đang là
//   10+component, được 06/08 ghi đè logic khác hẳn) — ưu tiên 06/08.
