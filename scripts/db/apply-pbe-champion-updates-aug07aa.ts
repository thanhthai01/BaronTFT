// Migration một lần cho bản PBE 18.1aa (07/08/2026) — cập nhật set18_champions/
// set18_traits theo đúng khuôn replaceExact + throw của apply-pbe-champion-updates.ts.
// Nguồn: pbe-notes/Patch_TFT18.1aa-PBE-light-pass.md. Dump xác minh state thật
// trước khi viết: scripts/db/dump-0807aa-output.txt (đã xoá cùng dump-0807aa.ts
// sau khi dùng).
//
// Field bị bỏ qua (không đủ căn cứ an toàn) — chi tiết ở cuối file:
// - Malphite: tầm đánh chiêu chỉ đổi ở mốc 3 sao, nhưng codex chỉ lưu MỘT giá
//   trị "phạm vi 2 ô" dùng chung cho mọi cấp sao — không có chỗ tách riêng.
// - Elder Dragon: "Flame Breath giảm 20% sát thương mỗi mục tiêu" là cơ chế
//   MỚI, ability text hiện tại không có câu tương ứng để thay — không có neo.
// - Raptor: phần "Sát thương phép (Tiny Beaks) 27/41/65 → 25/38/60" — ability
//   text hiện tại ĐÃ ghi "25/38/60" (đúng giá trị "sau" patch), nên bỏ qua
//   không áp lại; chỉ áp phần Alpha Armor Reduction (1 → 2).
import { eq } from 'drizzle-orm';
import { db } from '../../src/db/client';
import { set18Champions, set18Traits } from '../../src/db/schema';

function replaceExact(text: string, oldStr: string, newStr: string, ctx: string): string {
  if (!text.includes(oldStr)) {
    throw new Error(`[${ctx}] Không tìm thấy chuỗi cần thay: ${JSON.stringify(oldStr)}`);
  }
  return text.split(oldStr).join(newStr);
}

async function main() {
  // ── Caitlyn (2 vàng) — Enhanced AD 190/285/450 → 200/300/500 ───────────
  // Tổng hiển thị (calc.total / ability text) = AD-coeff + AP-coeff, xác minh
  // qua giá trị hiện tại: 190+20=210 ✓, 285+30=315 ✓, 450+45=495 ✓ — nên tổng
  // mới = 200+20=220, 300+30=330, 500+45=545.
  {
    const [row] = await db.select().from(set18Champions).where(eq(set18Champions.name, 'Caitlyn'));
    if (!row) throw new Error('Champion không tìm thấy: Caitlyn');

    const ability = replaceExact(row.ability, '210/315/495 physical damage', '220/330/545 physical damage', 'Caitlyn/ability');
    const abilityVi = replaceExact(row.abilityVi, '210/315/495 sát thương vật lý', '220/330/545 sát thương vật lý', 'Caitlyn/abilityVi');

    const forms = row.forms as any[];
    const calc = forms[0]?.calcs?.[0];
    if (!calc || calc.total !== '210/315/495') {
      throw new Error(`[Caitlyn/forms[0].calcs[0].total] hiện tại (${calc?.total}) không khớp "from" mong đợi ("210/315/495")`);
    }
    if (!calc.terms.includes('190/285/450')) {
      throw new Error('[Caitlyn/forms[0].calcs[0].terms] không tìm thấy "190/285/450"');
    }
    calc.terms = calc.terms.split('190/285/450').join('200/300/500');
    calc.total = '220/330/545';
    forms[0].abilityHtmlVi = replaceExact(forms[0].abilityHtmlVi, '210/315/495</span> sát thương vật lý', '220/330/545</span> sát thương vật lý', 'Caitlyn/forms[0].abilityHtmlVi');

    await db.update(set18Champions).set({ ability, abilityVi, forms, updatedAt: new Date() }).where(eq(set18Champions.name, 'Caitlyn'));
    console.log('✓ champion Caitlyn (Enhanced AD)');
  }

  // ── Raptor (3 vàng, "Mama Beak") — Alpha Armor Reduction 1 → 2 ─────────
  {
    const [row] = await db.select().from(set18Champions).where(eq(set18Champions.name, 'Raptor'));
    if (!row) throw new Error('Champion không tìm thấy: Raptor');

    const ability = replaceExact(row.ability, 'reduces enemy Armor by 1.', 'reduces enemy Armor by 2.', 'Raptor/ability');
    const abilityVi = replaceExact(row.abilityVi, 'giảm Giáp của kẻ địch đi.1 .', 'giảm Giáp của kẻ địch đi.2 .', 'Raptor/abilityVi');

    const forms = row.forms as any[];
    forms[0].abilityHtmlVi = replaceExact(
      forms[0].abilityHtmlVi,
      'giảm Giáp của kẻ địch đi.<span class="s18-value">1</span> .',
      'giảm Giáp của kẻ địch đi.<span class="s18-value">2</span> .',
      'Raptor/forms[0].abilityHtmlVi',
    );

    await db.update(set18Champions).set({ ability, abilityVi, forms, updatedAt: new Date() }).where(eq(set18Champions.name, 'Raptor'));
    console.log('✓ champion Raptor (Alpha Armor Reduction)');
  }

  // ── The Elder Dragon (5 vàng) — Base AD 100 → 110, Spell Damage 200/300 → ──
  // ── 250/375 (giữ nguyên "7200" ở vị trí thứ 3, placeholder không thuộc patch) ─
  {
    const [row] = await db.select().from(set18Champions).where(eq(set18Champions.name, 'The Elder Dragon'));
    if (!row) throw new Error('Champion không tìm thấy: The Elder Dragon');

    const stats = row.stats as any;
    if (stats.attackDamage[0] !== 100) throw new Error(`Elder Dragon attackDamage[0] hiện là ${stats.attackDamage[0]}, không phải 100`);
    stats.attackDamage[0] = 110;

    const ability = replaceExact(row.ability, 'dealing 200/300/7200 physical damage', 'dealing 250/375/7200 physical damage', 'ElderDragon/ability');
    const abilityVi = replaceExact(row.abilityVi, 'gây 200/300/7200 sát thương vật lý', 'gây 250/375/7200 sát thương vật lý', 'ElderDragon/abilityVi');

    const forms = row.forms as any[];
    forms[0].abilityHtmlVi = replaceExact(forms[0].abilityHtmlVi, '200/300/7200</span> sát thương vật lý', '250/375/7200</span> sát thương vật lý', 'ElderDragon/forms[0].abilityHtmlVi');

    await db.update(set18Champions).set({ stats, ability, abilityVi, forms, updatedAt: new Date() }).where(eq(set18Champions.name, 'The Elder Dragon'));
    console.log('✓ champion The Elder Dragon (Base AD, Spell Damage)');
  }

  // ── Maokai (5 vàng) — Heal AP 300/400 → 330/400, Missing HP Heal 8% → 10% ──
  {
    const [row] = await db.select().from(set18Champions).where(eq(set18Champions.name, 'Maokai'));
    if (!row) throw new Error('Champion không tìm thấy: Maokai');

    let ability = replaceExact(row.ability, 'restore 300/400/2000 + 8% missing Health', 'restore 330/400/2000 + 10% missing Health', 'Maokai/ability');
    let abilityVi = replaceExact(row.abilityVi, 'hồi lại 300/400/2000 + 8% Máu đã mất', 'hồi lại 330/400/2000 + 10% Máu đã mất', 'Maokai/abilityVi');

    const forms = row.forms as any[];
    let html = replaceExact(forms[0].abilityHtmlVi, '300/400/2000</span> + <span class="s18-value s18-style-colorHealth">8%</span> Máu đã mất.', '330/400/2000</span> + <span class="s18-value s18-style-colorHealth">10%</span> Máu đã mất.', 'Maokai/forms[0].abilityHtmlVi');
    forms[0].abilityHtmlVi = html;

    await db.update(set18Champions).set({ ability, abilityVi, forms, updatedAt: new Date() }).where(eq(set18Champions.name, 'Maokai'));
    console.log('✓ champion Maokai (Heal AP, Missing HP Heal)');
  }

  // ── Trait: Blackthorn (mốc 6) — Health 200→150, AS 18%→15%, AD/AP 18→15, ──
  // ── Resists 15→10 ───────────────────────────────────────────────────────
  {
    const [row] = await db.select().from(set18Traits).where(eq(set18Traits.name, 'Blackthorn'));
    if (!row) throw new Error('Trait không tìm thấy: Blackthorn');
    const details = row.breakpointDetails as any[];
    const t6 = details.find((d) => d.threshold === '6');
    const values = t6?.bullet?.values as any[];
    const get = (rowName: string) => values?.find((v) => v.row === rowName);

    const checks: [string, string][] = [
      ['BonusHealth', '200'],
      ['BonusAttackSpeed', '18%'],
      ['BonusAD', '18'],
      ['BonusAP', '18'],
      ['BonusResists', '15'],
    ];
    for (const [rowName, expected] of checks) {
      const v = get(rowName);
      if (!v || v.value !== expected) throw new Error(`[Blackthorn/mốc6 ${rowName}] hiện tại (${v?.value}) không khớp "from" mong đợi ("${expected}")`);
    }
    get('BonusHealth').value = '150';
    get('BonusAttackSpeed').value = '15%';
    get('BonusAD').value = '15';
    get('BonusAP').value = '15';
    get('BonusResists').value = '10';

    await db.update(set18Traits).set({ breakpointDetails: details, updatedAt: new Date() }).where(eq(set18Traits.name, 'Blackthorn'));
    console.log('✓ trait Blackthorn (mốc 6)');
  }

  // ── Trait: Vanguard (mốc 6) — Shield 45%→42%, Durability 6%→5% ──────────
  {
    const [row] = await db.select().from(set18Traits).where(eq(set18Traits.name, 'Vanguard'));
    if (!row) throw new Error('Trait không tìm thấy: Vanguard');
    const details = row.breakpointDetails as any[];
    const t6 = details.find((d) => d.threshold === '6');
    const values = t6?.bullet?.values as any[];
    const shield = values?.find((v) => v.row === 'MaxHealthShield');
    const durability = values?.find((v) => v.row === 'DurabilityIncrease');

    if (!shield || shield.value !== '45%') throw new Error(`[Vanguard/mốc6 MaxHealthShield] hiện tại (${shield?.value}) không khớp "from" mong đợi ("45%")`);
    if (!durability || durability.value !== '6%') throw new Error(`[Vanguard/mốc6 DurabilityIncrease] hiện tại (${durability?.value}) không khớp "from" mong đợi ("6%")`);
    shield.value = '42%';
    durability.value = '5%';

    await db.update(set18Traits).set({ breakpointDetails: details, updatedAt: new Date() }).where(eq(set18Traits.name, 'Vanguard'));
    console.log('✓ trait Vanguard (mốc 6)');
  }

  console.log('✓ Hoàn tất cập nhật champions/traits cho 18.1aa (07/08).');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
