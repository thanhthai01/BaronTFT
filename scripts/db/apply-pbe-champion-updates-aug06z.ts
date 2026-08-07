// Migration một lần cho bản PBE 18.1z (06/08/2026) — cập nhật set18_champions/
// set18_traits/set18_wisps theo đúng khuôn replaceExact + throw của
// apply-pbe-champion-updates.ts. Nguồn: pbe-notes/Patch_TFT18.1z-PBE-minor-balance-pass.md.
//
// Field không có chỗ neo an toàn (DoT AD/AP của Ashe gộp vào một số hiển thị
// đã tính sẵn theo baseline stat, Golden Pixie Gold của Fae không có value số
// trong breakpointDetails, mô tả Hand Of Baron chỉ ghi "Baron Buff" trừu
// tượng không có % cụ thể) — bỏ qua, liệt kê ở cuối file.
import { eq } from 'drizzle-orm';
import { db } from '../../src/db/client';
import { set18Champions, set18Traits, set18Wisps } from '../../src/db/schema';

function replaceExact(text: string, oldStr: string, newStr: string, ctx: string): string {
  if (!text.includes(oldStr)) {
    throw new Error(`[${ctx}] Không tìm thấy chuỗi cần thay: ${JSON.stringify(oldStr)}`);
  }
  return text.split(oldStr).join(newStr);
}

async function main() {
  // ── Ashe (5 vàng) — Mana 30/90 → 20/80, Arrow Damage 260/400 → 400/600, ──
  // ── Arrow Falloff 40% → 80% ───────────────────────────────────────────
  {
    const [row] = await db.select().from(set18Champions).where(eq(set18Champions.name, 'Ashe'));
    if (!row) throw new Error('Champion không tìm thấy: Ashe');

    const stats = row.stats as Record<string, unknown>;
    const mana = stats.mana as number[];
    if (mana[0] !== 30 || mana[1] !== 90) {
      throw new Error(`[Ashe/stats.mana] hiện tại (${JSON.stringify(mana)}) không khớp "from" mong đợi ([30,90])`);
    }
    const newStats = { ...stats, mana: [20, 80] };

    const forms = row.forms as any[];
    const form0Mana = forms[0]?.stats?.mana as number[] | undefined;
    if (form0Mana) {
      forms[0].stats.mana = [20, 80];
      forms[0].mana = '20 / 80';
    }

    let ability = replaceExact(row.ability, '260/400/1000 physical damage', '400/600/1000 physical damage', 'Ashe/ability (Arrow Damage)');
    ability = replaceExact(ability, 'reduced by 40% per enemy hit', 'reduced by 80% per enemy hit', 'Ashe/ability (Arrow Falloff)');

    let abilityVi = replaceExact(row.abilityVi, '260/400/1000 sát thương vật lý', '400/600/1000 sát thương vật lý', 'Ashe/abilityVi (Arrow Damage)');
    abilityVi = replaceExact(abilityVi, 'giảm thiểu bởi 40% mỗi kẻ địch trúng đòn', 'giảm thiểu bởi 80% mỗi kẻ địch trúng đòn', 'Ashe/abilityVi (Arrow Falloff)');

    if (forms[0]?.abilityHtmlVi) {
      let html = replaceExact(forms[0].abilityHtmlVi, '260/400/1000</span> sát thương vật lý', '400/600/1000</span> sát thương vật lý', 'Ashe/forms[0].abilityHtmlVi (Arrow Damage)');
      html = replaceExact(html, 's18-value">40%</span> mỗi kẻ địch trúng đòn', 's18-value">80%</span> mỗi kẻ địch trúng đòn', 'Ashe/forms[0].abilityHtmlVi (Arrow Falloff)');
      forms[0].abilityHtmlVi = html;
    }

    await db
      .update(set18Champions)
      .set({ stats: newStats, forms, ability, abilityVi, updatedAt: new Date() })
      .where(eq(set18Champions.name, 'Ashe'));
    console.log('✓ champion Ashe (mana, arrow damage, arrow falloff)');
  }

  // ── Trait: Coven — Essence Per Loss (mốc 5: 35→30, mốc 7: 100→80), ──────
  // ── Essence Per Kill (mốc 5: 2→3, mốc 7: 7→10) ─────────────────────────
  {
    const [row] = await db.select().from(set18Traits).where(eq(set18Traits.name, 'Coven'));
    if (!row) throw new Error('Trait không tìm thấy: Coven');
    const details = row.breakpointDetails as any[];

    const t5 = details.find((d) => d.threshold === '5');
    const t5Loss = t5?.bullet?.values?.find((v: any) => v.row === 'EssencePerLoss');
    const t5Kill = t5?.bullet?.values?.find((v: any) => v.row === 'EssencePerDeath');
    if (!t5Loss || t5Loss.value !== '35') throw new Error(`[Coven/mốc5 EssencePerLoss] hiện tại (${t5Loss?.value}) không khớp "from" mong đợi ("35")`);
    if (!t5Kill || t5Kill.value !== '2') throw new Error(`[Coven/mốc5 EssencePerDeath] hiện tại (${t5Kill?.value}) không khớp "from" mong đợi ("2")`);
    t5Loss.value = '30';
    t5Kill.value = '3';

    const t7 = details.find((d) => d.threshold === '7');
    const t7Loss = t7?.bullet?.values?.find((v: any) => v.row === 'EssencePerLoss');
    const t7Kill = t7?.bullet?.values?.find((v: any) => v.row === 'EssencePerDeath');
    if (!t7Loss || t7Loss.value !== '100') throw new Error(`[Coven/mốc7 EssencePerLoss] hiện tại (${t7Loss?.value}) không khớp "from" mong đợi ("100")`);
    if (!t7Kill || t7Kill.value !== '7') throw new Error(`[Coven/mốc7 EssencePerDeath] hiện tại (${t7Kill?.value}) không khớp "from" mong đợi ("7")`);
    t7Loss.value = '80';
    t7Kill.value = '10';

    await db.update(set18Traits).set({ breakpointDetails: details, updatedAt: new Date() }).where(eq(set18Traits.name, 'Coven'));
    console.log('✓ trait Coven (mốc 5 + mốc 7)');
  }

  // ── Wisp: Greater Chaos — không còn thi triển Circle of Elders ─────────
  {
    const [row] = await db.select().from(set18Wisps).where(eq(set18Wisps.name, 'Greater Chaos'));
    if (!row) throw new Error('Wisp không tìm thấy: Greater Chaos');
    const conditionsVi = [...(row.conditionsVi ?? []), 'Không còn thi triển được Circle of Elders'];
    await db.update(set18Wisps).set({ conditionsVi, updatedAt: new Date() }).where(eq(set18Wisps.name, 'Greater Chaos'));
    console.log('✓ wisp Greater Chaos (conditionsVi)');
  }

  console.log('✓ Hoàn tất cập nhật champions/traits/wisps cho 18.1z (06/08).');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

// ── Các mục CỐ Ý bỏ qua (không đủ căn cứ để sửa an toàn) ───────────
// - Ashe DoT Damage (AD 20/30→5/8, AP 5/8→2/3): ability text chỉ hiển thị một
//   số tổng đã tính sẵn theo baseline stat giả định ("30/46/220" + "2% max
//   Health"), không tách riêng hệ số AD/AP để thay đúng theo patch.
// - Trait Coven — mốc 3/4 (EssencePerLoss patch "from" 20/25, DB hiện tại
//   18/22): không khớp, codex đã lệch từ trước — không đoán.
// - Trait Fae — Golden Pixie Gold (5/10/15/25/35/65 → 5/8/12/18/25/50):
//   breakpointDetails.values rỗng, description chỉ ghi "cho vàng" không có
//   số cụ thể để thay.
// - Wisp Hand Of Baron — AD/AP/AS/Health/Armor/MR/Omnivamp %, bỏ Mana Regen:
//   description chỉ ghi "Baron Buff, increasing their stats" trừu tượng,
//   không có số % nào trong text để thay; không có field liệt kê "cho Mana
//   Regen" để xoá.
