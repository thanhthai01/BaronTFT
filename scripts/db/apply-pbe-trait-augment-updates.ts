// DONE — KHÔNG CHẠY LẠI. Migration một lần, giữ làm hồ sơ lịch sử (xem đầu
// apply-pbe-champion-updates.ts).
//
// Cập nhật DB cho tộc hệ + nâng cấp theo PBE 06/08/2026, cùng nguyên tắc với
// apply-pbe-champion-updates.ts: replace đúng field hiện có, throw ngay nếu
// không khớp — không âm thầm bỏ qua/đoán số.
import { eq } from 'drizzle-orm';
import { db } from '../../src/db/client';
import { set18Traits, set18Augments } from '../../src/db/schema';

function replaceExact(text: string, oldStr: string, newStr: string, ctx: string): string {
  if (!text.includes(oldStr)) {
    throw new Error(`[${ctx}] Không tìm thấy chuỗi cần thay: ${JSON.stringify(oldStr)}`);
  }
  return text.split(oldStr).join(newStr);
}

function setBullet(details: any[], threshold: string, row: string, newValue: string, ctx: string) {
  const tier = details.find((d) => d.threshold === threshold);
  if (!tier) throw new Error(`[${ctx}] Không tìm thấy threshold ${threshold}`);
  const val = tier.bullet?.values?.find((v: any) => v.row === row);
  if (!val) throw new Error(`[${ctx}] Không tìm thấy row ${row} ở threshold ${threshold}`);
  val.value = newValue;
}

async function main() {
  // ── Coven — mốc 7: EssencePerLoss 70 → 100 ──────────────────────────
  {
    const [row] = await db.select().from(set18Traits).where(eq(set18Traits.name, 'Coven'));
    if (!row) throw new Error('Coven không tìm thấy');
    const details = row.breakpointDetails as any[];
    setBullet(details, '7', 'EssencePerLoss', '100', 'Coven');
    await db.update(set18Traits).set({ breakpointDetails: details, updatedAt: new Date() }).where(eq(set18Traits.name, 'Coven'));
    console.log('✓ trait Coven');
  }

  // ── Defender — mốc 6: DefenderDefenseGain 110 → 115 ─────────────────
  {
    const [row] = await db.select().from(set18Traits).where(eq(set18Traits.name, 'Defender'));
    if (!row) throw new Error('Defender không tìm thấy');
    const details = row.breakpointDetails as any[];
    setBullet(details, '6', 'DefenderDefenseGain', '115', 'Defender');
    await db.update(set18Traits).set({ breakpointDetails: details, updatedAt: new Date() }).where(eq(set18Traits.name, 'Defender'));
    console.log('✓ trait Defender');
  }

  // ── Juggernaut — mốc 4: 28%→30%, mốc 6: 34%→40% ─────────────────────
  {
    const [row] = await db.select().from(set18Traits).where(eq(set18Traits.name, 'Juggernaut'));
    if (!row) throw new Error('Juggernaut không tìm thấy');
    const details = row.breakpointDetails as any[];
    setBullet(details, '4', 'JuggernautDurability', '30%', 'Juggernaut');
    setBullet(details, '6', 'JuggernautDurability', '40%', 'Juggernaut');
    await db.update(set18Traits).set({ breakpointDetails: details, updatedAt: new Date() }).where(eq(set18Traits.name, 'Juggernaut'));
    console.log('✓ trait Juggernaut');
  }

  // ── Vanguard — mốc 6: DurabilityIncrease 8%→6% ──────────────────────
  {
    const [row] = await db.select().from(set18Traits).where(eq(set18Traits.name, 'Vanguard'));
    if (!row) throw new Error('Vanguard không tìm thấy');
    const details = row.breakpointDetails as any[];
    setBullet(details, '6', 'DurabilityIncrease', '6%', 'Vanguard');
    await db.update(set18Traits).set({ breakpointDetails: details, updatedAt: new Date() }).where(eq(set18Traits.name, 'Vanguard'));
    console.log('✓ trait Vanguard');
  }

  // ── Solar — hệ số cộng dồn 2.5% → 1.5% ───────────────────────────────
  {
    const [row] = await db.select().from(set18Traits).where(eq(set18Traits.name, 'Solar'));
    if (!row) throw new Error('Solar không tìm thấy');
    const description = replaceExact(row.description, 'Increase shield and magic damage by 2.5% for each 3-star', 'Increase shield and magic damage by 1.5% for each 3-star', 'Solar/description');
    const descriptionVi = replaceExact(row.descriptionVi, 'tăng thêm 2.5% với mỗi tướng 3 sao khác nhau', 'tăng thêm 1.5% với mỗi tướng 3 sao khác nhau', 'Solar/descriptionVi');
    await db.update(set18Traits).set({ description, descriptionVi, updatedAt: new Date() }).where(eq(set18Traits.name, 'Solar'));
    console.log('✓ trait Solar');
  }

  // ── Blackthorn / Eldritch — rework toàn bộ cơ chế (đã xác nhận với user) ──
  // Codex hiện phản ánh bản TRƯỚC lần rework "hiến tế theo vai trò", nên xây
  // lại breakpointDetails theo đúng cơ chế PBE 06/08 mô tả — không phải sửa
  // số trên nền cũ vì nền cũ không còn đúng cấu trúc. Mốc 2 và 4 dùng chung
  // 1 bộ số hiến tế (ảnh PBE gộp "Mốc 2/4" thành một dòng); mốc 6 là thưởng
  // cố định không hi sinh. Hệ số nhân 3-sao theo giá tướng (280%/330%) không
  // khớp khuôn breakpoint theo số quân, để riêng ở `note`.
  {
    const sacrificeBullet = {
      textVi: 'Hi sinh Đỡ đòn: {0}, {1}. Hi sinh SMCK: {2}, {3}. Hi sinh SMPT: {4}, {5}',
      values: [
        { row: 'TankSacrificeHPBonus', icons: ['health'], value: '17%' },
        { row: 'TankSacrificeResistBonus', icons: ['armor', 'mr'], value: '17' },
        { row: 'ADSacrificeADBonus', icons: ['ad'], value: '22' },
        { row: 'ADSacrificeASBonus', icons: ['as'], value: '10%' },
        { row: 'APSacrificeDamageAmpBonus', icons: ['ap'], value: '13%' },
        { row: 'APSacrificeManaRegenBonus', icons: ['mana'], value: '1.7' },
      ],
    };
    const breakpointDetails = [
      { threshold: '2', style: 'bronze', color: '#cd8256', bullet: sacrificeBullet },
      { threshold: '4', style: 'silver', color: '#9aafb6', bullet: sacrificeBullet },
      {
        threshold: '6',
        style: 'gold',
        color: '#dac379',
        bullet: {
          textVi: 'Cả đội nhận {0}, {1}, {2}, {3}, {4}',
          values: [
            { row: 'BonusHealth', icons: ['health'], value: '200' },
            { row: 'BonusAttackSpeed', icons: ['as'], value: '18%' },
            { row: 'BonusAD', icons: ['ad'], value: '18' },
            { row: 'BonusAP', icons: ['ap'], value: '18' },
            { row: 'BonusResists', icons: ['armor', 'mr'], value: '15' },
          ],
        },
      },
    ];
    const note =
      'Hệ số nhân chỉ số khi tướng Gai Đen lên 3 sao: 280% (tướng 2 vàng), 330% (tướng 3 vàng).';
    await db
      .update(set18Traits)
      .set({ breakpointDetails, note, updatedAt: new Date() })
      .where(eq(set18Traits.name, 'Blackthorn'));
    console.log('✓ trait Blackthorn/Eldritch (rework — best-effort theo ảnh PBE, xem ghi chú báo cáo)');
  }

  // ================= AUGMENTS =================

  async function updateAugment(name: string, edit: (desc: string) => string, editVi: (descVi: string) => string) {
    const [row] = await db.select().from(set18Augments).where(eq(set18Augments.name, name));
    if (!row) throw new Error(`Augment không tìm thấy: ${name}`);
    const description = edit(row.description);
    const descriptionVi = editVi(row.descriptionVi);
    await db.update(set18Augments).set({ description, descriptionVi, updatedAt: new Date() }).where(eq(set18Augments.name, name));
    console.log(`✓ augment ${name}`);
  }

  await updateAugment(
    'Bonus Gift',
    (d) => replaceExact(d, 'you have a 30% chance', 'you have a 25% chance', 'BonusGift/en'),
    (d) => replaceExact(d, 'bạn có 30% cơ hội', 'bạn có 25% cơ hội', 'BonusGift/vi'),
  );
  await updateAugment(
    'Bonus Gift +',
    (d) => replaceExact(d, 'you have a 30% chance', 'you have a 25% chance', 'BonusGift+/en'),
    (d) => replaceExact(d, 'bạn có 30% cơ hội', 'bạn có 25% cơ hội', 'BonusGift+/vi'),
  );
  await updateAugment(
    'Champ Delivery',
    (d) => replaceExact(d, 'After 4 rounds, gain 3 more', 'After 6 rounds, gain 3 more', 'ChampDelivery/en'),
    (d) => replaceExact(d, 'Sau 4 vòng, nhận thêm 3 tướng cùng bậc', 'Sau 6 vòng, nhận thêm 3 tướng cùng bậc', 'ChampDelivery/vi'),
  );
  await updateAugment(
    'Cry Me A River',
    (d) => replaceExact(d, 'increase this to 3', 'increase this to 4', 'CryMeARiver/en'),
    (d) => replaceExact(d, 'tăng hiệu ứng này lên thành 3', 'tăng hiệu ứng này lên thành 4', 'CryMeARiver/vi'),
  );
  await updateAugment(
    'Flame On',
    (d) => replaceExact(d, 'gaining 25% Attack Speed', 'gaining 40% Attack Speed', 'FlameOn/en'),
    (d) => replaceExact(d, 'nhận 25% Tốc Độ Đánh', 'nhận 40% Tốc Độ Đánh', 'FlameOn/vi'),
  );
  await updateAugment(
    'Forged In Strength',
    (d) => replaceExact(d, '1 random completed item, and 1 random component', '1 random completed item, and 2 random components', 'ForgedInStrength/en'),
    (d) => (d), // Vietnamese thiếu vế "completed item"/"component" từ trước — không tự thêm câu mới.
  );
  await updateAugment(
    'FOURcing',
    (d) => replaceExact(d, 'your team gains 85 health', 'your team gains 95 health', 'FOURcing/en'),
    (d) => replaceExact(d, 'đội của bạn nhận 85 máu', 'đội của bạn nhận 95 máu', 'FOURcing/vi'),
  );
  await updateAugment(
    'Investment Strategy I',
    (d) => replaceExact(d, 'Your champions gain 8 permanent max health per interest you earn.', 'Your champions gain 8 permanent max health per interest you earn. Gain 4 gold now.', 'InvestmentStrategyI/en'),
    (d) => replaceExact(d, 'Tướng của bạn nhận thêm vĩnh viễn 8 máu tối đa với mỗi vàng lợi tức bạn kiếm được.', 'Tướng của bạn nhận thêm vĩnh viễn 8 máu tối đa với mỗi vàng lợi tức bạn kiếm được. Nhận ngay 4 vàng.', 'InvestmentStrategyI/vi'),
  );
  await updateAugment(
    'Investment Strategy II',
    (d) => replaceExact(d, 'Gain 3 gold.', 'Gain 8 gold.', 'InvestmentStrategyII/en'),
    (d) => replaceExact(d, 'Nhận 3 vàng.', 'Nhận 8 vàng.', 'InvestmentStrategyII/vi'),
  );
  await updateAugment(
    'Max Build',
    (d) => {
      let s = replaceExact(d, 'Gain 18 free Shop rerolls', 'Gain 10 free Shop rerolls', 'MaxBuild/en rerolls');
      s = replaceExact(s, 'gain 5 free Shop rerolls', 'gain 3 free Shop rerolls', 'MaxBuild/en lvl9');
      return s;
    },
    (d) => {
      let s = replaceExact(d, 'Nhận 18 lượt đổi Cửa Hàng miễn phí', 'Nhận 10 lượt đổi Cửa Hàng miễn phí', 'MaxBuild/vi rerolls');
      s = replaceExact(s, 'nhận 5 lượt làm mới Cửa Hàng miễn phí', 'nhận 3 lượt làm mới Cửa Hàng miễn phí', 'MaxBuild/vi lvl9');
      return s;
    },
  );
  await updateAugment(
    'Quick Streaks',
    (d) => replaceExact(d, 'Gain 4 gold.', 'Gain 2 gold.', 'QuickStreaks/en'),
    (d) => replaceExact(d, 'Nhận 4 vàng.', 'Nhận 2 vàng.', 'QuickStreaks/vi'),
  );
  await updateAugment(
    'Residual Magic',
    (d) => replaceExact(d, 'Your team gains 100 Health', 'Your team gains 80 Health', 'ResidualMagic/en'),
    (d) => replaceExact(d, 'Đội của bạn được tăng 100 Máu', 'Đội của bạn được tăng 80 Máu', 'ResidualMagic/vi'),
  );
  await updateAugment(
    'Residual Magic +',
    (d) => replaceExact(d, 'Your team gains 130 Health', 'Your team gains 100 Health', 'ResidualMagic+/en'),
    (d) => replaceExact(d, 'Đội của bạn được tăng 130 Máu', 'Đội của bạn được tăng 100 Máu', 'ResidualMagic+/vi'),
  );
  await updateAugment(
    'Residual Magic ++',
    (d) => replaceExact(d, 'Your team gains 150 Health', 'Your team gains 120 Health', 'ResidualMagic++/en'),
    (d) => replaceExact(d, 'Đội của bạn được tăng 150 Máu', 'Đội của bạn được tăng 120 Máu', 'ResidualMagic++/vi'),
  );
  await updateAugment(
    'Shimmerscale Essence',
    (d) => replaceExact(d, 'After 6 player combats', 'After 7 player combats', 'ShimmerscaleEssence/en'),
    (d) => replaceExact(d, 'Sau 6 giao tranh người chơi', 'Sau 7 giao tranh người chơi', 'ShimmerscaleEssence/vi'),
  );
  await updateAugment(
    'U.R.F',
    (d) => replaceExact(d, 'gain 15% Attack Speed and 2 Mana Regen', 'gain 20% Attack Speed and 3 Mana Regen', 'URF/en'),
    (d) => replaceExact(d, 'nhận thêm 15% Tốc Độ Đánh và 2 Hồi Năng Lượng', 'nhận thêm 20% Tốc Độ Đánh và 3 Hồi Năng Lượng', 'URF/vi'),
  );
  await updateAugment(
    'Wisp Rebate',
    (d) => replaceExact(d, 'Gain 6 gold now', 'Gain 4 gold now', 'WispRebate/en'),
    (d) => replaceExact(d, 'Nhận ngay 6 vàng', 'Nhận ngay 4 vàng', 'WispRebate/vi'),
  );
  await updateAugment(
    'Wisp Rebate +',
    (d) => replaceExact(d, 'Gain 10 gold now', 'Gain 8 gold now', 'WispRebate+/en'),
    (d) => replaceExact(d, 'Nhận ngay 10 vàng', 'Nhận ngay 8 vàng', 'WispRebate+/vi'),
  );

  // Expedition — thưởng đổi hẳn (loot cũ "1 tướng 3 vàng" → loot mới, kèm bugfix)
  await updateAugment(
    'Expedition',
    (d) => replaceExact(d, 'Gain a 3-cost champion now.', 'Gain 2 5-cost champions, 1 masterwork upgrade, and 1 component anvil now (bugfix — previously granted incorrect loot).', 'Expedition/en'),
    (d) => replaceExact(d, 'Nhận ngay 1 tướng 3 vàng.', 'Nhận ngay 2 tướng 5 vàng, 1 nâng cấp masterwork và 1 component anvil (bugfix — trước đó trả sai loot).', 'Expedition/vi'),
  );

  // Blossom's Call — chuyển hẳn về mốc 4-2 (field `rounds`, không phải description)
  {
    const [row] = await db.select().from(set18Augments).where(eq(set18Augments.name, "Blossom's Call"));
    if (!row) throw new Error("Blossom's Call không tìm thấy");
    if (JSON.stringify(row.rounds) !== JSON.stringify(['2-1', '3-2', '4-2'])) {
      throw new Error(`Blossom's Call rounds hiện là ${JSON.stringify(row.rounds)}, khác dự kiến`);
    }
    await db.update(set18Augments).set({ rounds: ['4-2'], roundVariants: ['Late'], updatedAt: new Date() }).where(eq(set18Augments.name, "Blossom's Call"));
    console.log("✓ augment Blossom's Call (rounds)");
  }

  console.log('\n✓ Xong toàn bộ tộc hệ + nâng cấp.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
