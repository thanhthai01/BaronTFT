// DONE — KHÔNG CHẠY LẠI. Migration một lần cho 2 bản PBE 18.1x (04/08) và
// 18.1y (05/08) — cập nhật set18_champions/set18_traits theo đúng khuôn
// replaceExact + throw của apply-pbe-champion-updates.ts (bản 06/08).
//
// Nguyên tắc: bản 06/08 đã được áp trước (script riêng, DONE) và luôn là
// nguồn ĐÚNG NHẤT cho state cuối cùng khi field trùng nhau. Ở đây chỉ áp các
// field mà 06/08 KHÔNG chạm tới và giá trị "from" khớp CHÍNH XÁC với dữ liệu
// hiện tại trong DB (đã dump và soát tay trước khi viết). Field nào không có
// chỗ neo an toàn (không xuất hiện trong ability/description hiện tại, hoặc
// mâu thuẫn với giá trị đã có) — bỏ qua, liệt kê lý do ở cuối file.
import { eq } from 'drizzle-orm';
import { db } from '../../src/db/client';
import { set18Champions, set18Traits } from '../../src/db/schema';

function replaceExact(text: string, oldStr: string, newStr: string, ctx: string): string {
  if (!text.includes(oldStr)) {
    throw new Error(`[${ctx}] Không tìm thấy chuỗi cần thay: ${JSON.stringify(oldStr)}`);
  }
  return text.split(oldStr).join(newStr);
}

async function updateChampion(name: string, edits: (ability: string) => string, editsVi: (abilityVi: string) => string) {
  const [row] = await db.select().from(set18Champions).where(eq(set18Champions.name, name));
  if (!row) throw new Error(`Champion không tìm thấy: ${name}`);
  const newAbility = edits(row.ability);
  const newAbilityVi = editsVi(row.abilityVi);
  await db.update(set18Champions).set({ ability: newAbility, abilityVi: newAbilityVi, updatedAt: new Date() }).where(eq(set18Champions.name, name));
  console.log(`✓ champion ${name}`);
}

async function main() {
  // ── Gnar (18.1x — Leap Damage 150/225 AD → 100/150 AD) ─────────────
  await updateChampion(
    'Gnar',
    (a) => replaceExact(a, 'deal 150/225/1500 physical damage to enemies within 2 hexes', 'deal 100/150/1500 physical damage to enemies within 2 hexes', 'Gnar/ability'),
    (a) => replaceExact(a, 'gây 150/225/1500 sát thương vật lý lên kẻ địch trong phạm vi 2 ô', 'gây 100/150/1500 sát thương vật lý lên kẻ địch trong phạm vi 2 ô', 'Gnar/abilityVi'),
  );

  // ── Lillia (18.1x — 3★ Heal 600 AP → 800 AP) ────────────────────────
  await updateChampion(
    'Lillia',
    (a) => replaceExact(a, 'Restore 280/360/600 Health', 'Restore 280/360/800 Health', 'Lillia/ability'),
    (a) => replaceExact(a, 'Hồi lại 280/360/600 Máu', 'Hồi lại 280/360/800 Máu', 'Lillia/abilityVi'),
  );

  // ── Akali (18.1y — Spell Bonus Damage 30/45/68 → 35/52/80) ──────────
  await updateChampion(
    'Akali',
    (a) => replaceExact(a, 'deal an additional 30/45/68 damage.', 'deal an additional 35/52/80 damage.', 'Akali/ability'),
    (a) => replaceExact(a, 'gây thêm 30/45/68 sát thương.', 'gây thêm 35/52/80 sát thương.', 'Akali/abilityVi'),
  );

  // ── Yorick (18.1y — Heal 280/325/410 → 280/325/435) ─────────────────
  await updateChampion(
    'Yorick',
    (a) => replaceExact(a, 'Restore 280/325/410 Health', 'Restore 280/325/435 Health', 'Yorick/ability'),
    (a) => replaceExact(a, 'Hồi lại 280/325/410 Máu', 'Hồi lại 280/325/435 Máu', 'Yorick/abilityVi'),
  );

  // ── Scuttlecrab (18.1y — Heal 250/325/525 → 300/375/575) ────────────
  await updateChampion(
    'Scuttlecrab',
    (a) => replaceExact(a, 'healing 250/325/525 over the duration.', 'healing 300/375/575 over the duration.', 'Scuttlecrab/ability'),
    (a) => replaceExact(a, 'hồi phục 250/325/525 trong suốt thời gian này.', 'hồi phục 300/375/575 trong suốt thời gian này.', 'Scuttlecrab/abilityVi'),
  );

  // ── Cassiopeia (18.1y — Spell Damage 400/600/960 → 425/640/1020) ────
  await updateChampion(
    'Cassiopeia',
    (a) => replaceExact(a, 'dealing 400/600/960 magic damage over 15 seconds.', 'dealing 425/640/1020 magic damage over 15 seconds.', 'Cassiopeia/ability'),
    (a) => replaceExact(a, 'gây 400/600/960 sát thương phép trong 15 giây.', 'gây 425/640/1020 sát thương phép trong 15 giây.', 'Cassiopeia/abilityVi'),
  );

  // ── Taric (18.1y — Heal 225/325 AP → 200/300 AP; Shield ĐÃ do 06/08 xử lý) ──
  await updateChampion(
    'Taric',
    (a) => replaceExact(a, 'Restore 225/325/3000 Health.', 'Restore 200/300/3000 Health.', 'Taric/ability'),
    (a) => replaceExact(a, 'Hồi 225/325/3000 Máu.', 'Hồi 200/300/3000 Máu.', 'Taric/abilityVi'),
  );

  // ── Kennen (18.1y — AS 0.9 → 0.85, field số trong `stats`, không phải ability text) ──
  {
    const [row] = await db.select().from(set18Champions).where(eq(set18Champions.name, 'Kennen'));
    if (!row) throw new Error('Kennen không tìm thấy');
    const stats = row.stats as Record<string, unknown>;
    if (stats.attackSpeed !== 0.9) throw new Error(`[Kennen/stats] attackSpeed hiện tại (${stats.attackSpeed}) không khớp giá trị "from" mong đợi (0.9)`);
    await db.update(set18Champions).set({ stats: { ...stats, attackSpeed: 0.85 }, updatedAt: new Date() }).where(eq(set18Champions.name, 'Kennen'));
    console.log('✓ champion Kennen (stats.attackSpeed)');
  }

  // ── Trait: Blossom (18.1x — Gold Per Charm Purchased 5 → 4) ─────────
  {
    const [row] = await db.select().from(set18Traits).where(eq(set18Traits.name, 'Blossom'));
    if (!row) throw new Error('Trait không tìm thấy: Blossom');
    const details = row.breakpointDetails as any[];
    const tier7 = details.find((d) => d.threshold === '7');
    const goldValue = tier7?.bullet?.values?.find((v: any) => v.row === 'GoldPerCharmPurchased');
    if (!goldValue || goldValue.value !== '5') {
      throw new Error(`[Blossom/breakpointDetails] GoldPerCharmPurchased hiện tại (${goldValue?.value}) không khớp "from" mong đợi ("5")`);
    }
    goldValue.value = '4';
    const description = replaceExact(row.description, 'and 12% max Health.', 'and 10% max Health.', 'Blossom/description');
    const descriptionVi = replaceExact(row.descriptionVi, 'Sức Mạnh Phép Thuật, và 12% Máu tối đa.', 'Sức Mạnh Phép Thuật, và 10% Máu tối đa.', 'Blossom/descriptionVi');
    await db.update(set18Traits).set({ breakpointDetails: details, description, descriptionVi, updatedAt: new Date() }).where(eq(set18Traits.name, 'Blossom'));
    console.log('✓ trait Blossom');
  }

  // ── Trait: Solar (18.1y — 3 Threshold AS 25% → 18%) ─────────────────
  {
    const [row] = await db.select().from(set18Traits).where(eq(set18Traits.name, 'Solar'));
    if (!row) throw new Error('Trait không tìm thấy: Solar');
    const subEffects = row.subEffects as any;
    const item3 = subEffects?.items?.find((i: any) => i.label === '3');
    if (!item3 || !item3.text.includes('Nhận 25% Tốc Độ Đánh')) {
      throw new Error(`[Solar/subEffects] text mốc 3 hiện tại không khớp "from" mong đợi (25% Tốc Độ Đánh): ${item3?.text}`);
    }
    item3.text = item3.text.replace('Nhận 25% Tốc Độ Đánh', 'Nhận 18% Tốc Độ Đánh');
    const description = replaceExact(row.description, '3 : 25% and 15', '3 : 18% and 15', 'Solar/description');
    await db.update(set18Traits).set({ subEffects, description, updatedAt: new Date() }).where(eq(set18Traits.name, 'Solar'));
    console.log('✓ trait Solar');
  }

  console.log('✓ Hoàn tất cập nhật champions/traits cho 18.1x + 18.1y.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

// ── Các mục CỐ Ý bỏ qua (không đủ căn cứ để sửa an toàn) ───────────
// - Krug (18.1x, Spell Damage %HP 10%→8%): không xuất hiện dạng % trong
//   ability text hiện tại (chỉ có số flat), không có field %HP riêng.
// - Amumu (18.1x, 3★ Max HP Heal 2.2%→4%): không có field % trong ability
//   text; trùng khái niệm với field %HP mà 06/08 đã sửa (2.4%→2.2%, ẩn ở
//   nơi khác trong DB, không lộ trong text) — nguy cơ đụng field đã đúng.
// - Nidalee (18.1x armor ignore 3★; 18.1y forms AD/AP): field nằm trong
//   `forms` (không phải `ability` đơn) và số liệu "from" của 2 bản này
//   không khớp với số hiện tại sau khi 06/08 đã áp — bỏ qua để không ghi đè
//   nhầm giá trị mới hơn/đúng hơn của 06/08.
// - Cinderling, Yunara (18.1y): số hiện tại trong ability text không khớp
//   "from" của patch (codex lệch/cũ hơn cả patch note) — không đoán.
// - Pebbles, Sivir (18.1y): 06/08 đã nerf/chỉnh lại các field này SAU đó —
//   giá trị hiện tại đã là kết quả cuối đúng theo 06/08, áp 18.1y vào sẽ
//   ghi đè NGƯỢC về giá trị cũ hơn. Bỏ qua.
// - Ezreal (18.1y — "better dash logic"): thay đổi hành vi AI, không có số
//   liệu cụ thể để neo trong ability text.
// - Ivern (18.1y — Shield 165/325 AP → 150/275 AP): giá trị hiện tại trong
//   ability text là placeholder "?" (chưa được điền số thật), không có gì
//   để thay thế an toàn.
// - Razorbeak (18.1y): không tồn tại trong bảng set18_champions (không có
//   trang codex cho đơn vị này).
// - Riftbeast (18.1y, 7 Piece Armor/MR 3→5): giá trị hiện tại trong DB là 6
//   (không khớp "from"=3 patch nêu) — lệch hẳn, không đoán.
// - Coven (18.1y, breakpoint essence threshold 140/200/275/375→...): schema
//   breakpointDetails chỉ lưu EssencePerDeath/EssencePerLoss, không có field
//   "essence cần để mở khoá mốc" — không có chỗ để ghi số này.
