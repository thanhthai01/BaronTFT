// Migration một lần cho bản PBE 18.1af (Truexy ghi ngày 8/18, đăng lúc 1:30
// AM giờ hiển thị Aug 19, 2026) — cập nhật set18_champions/set18_traits/
// set18_wisps/set18_items. Nguồn:
// pbe-notes/Patch_TFT18.1af-PBE-balance-pass.md.
//
// Hỗ trợ --dry-run (log before/after, không ghi DB) — LUÔN chạy trước khi
// ghi thật, xem [[feedback_patch_update_mismatched_anchors_and_dryrun]].
//
// Nhiều số liệu trong ảnh gốc KHÔNG khớp "from" thật trong DB (Manazane 120
// không phải 100, Radiantize cost 6 không phải 5...). Theo pattern đã thống
// nhất với người dùng: TIN "to" ảnh gốc, assert theo giá trị THẬT trong DB.
//
// Người dùng đã xác nhận trực tiếp các quyết định sau (không phải suy đoán):
// - Death's Defiance: gỡ bỏ khỏi game → set visible:false trong set18_items.
// - Hand of Justice / Gargoyle Stoneplate / Steadfast Heart trong mục
//   "Radiant Items" của patch → map sang bản Radiant riêng (Radiant Hand of
//   Justice / Radiant Gargoyle Stoneplate / Radiant Steadfast Heart), không
//   phải bản thường.
// - Brawler Emblem: DB hiện ghi 3% (không phải 2.5% như "from" ảnh gốc) —
//   người dùng xác nhận lấy patch làm chuẩn, ghi đè theo "to"=2%.
// - Executioner Emblem: statBadges có field "damageamp":"15%" — người dùng
//   xác nhận đây là field CŨ, patch đổi hẳn cơ chế sang "Critical Strike
//   Damage" — đổi tên field thành "critdamage":"8%" (không chỉ đổi số).
//
// Vòng duyệt tay thứ 2 (người dùng xem file skipped-items.md và trả lời
// từng mục) — các quyết định bổ sung:
// - Pebbles Spell Damage: đã kiểm tra lịch sử patch — DB thật "150/225/340"
//   khớp đúng "to" của patch 2026-08-06 (nerf từ 160/240/360), tức DB không
//   sai, chỉ là "from" ảnh gốc hôm nay dùng số cũ hơn nữa. Ghi theo pattern
//   chuẩn: anchor DB thật, tin "to" ảnh gốc mới.
// - Ornn: người dùng xác nhận ghi đè thẳng theo số đích của patch
//   (90k/155k/180k) dù "from" không khớp Forge Power thật (90k/235k/400k).
// - Nidalee: số patch (320/480) không khớp field nào, nhưng người dùng chỉ
//   đạo "nếu không có gì thay đổi được thì lấy chỉ số sau cập nhật của
//   patch làm chỉ số mới" — ghi thẳng 285/425 vào phần "Empowered Spell
//   Damage" (đòn đánh thứ 3, giá trị gần đúng nhất về ngữ nghĩa).
// - Kennen: người dùng chỉ định số patch (475/715) ghi thẳng vào firestorm
//   tổng (trường gần nghĩa nhất, DB "đang chậm" theo lời người dùng).
// - Blossom: người dùng xác nhận patch chỉ áp cho mốc 3/5/7/9 (không phải
//   11, mốc 11 giữ nguyên 100%). Mốc 3/5/7 DB đã khớp/đã đúng target sẵn —
//   chỉ mốc 9 cần đổi 60%→50%.
// - Inferno: tìm thấy anchor Burn Duration trong field `description` cấp
//   trait (không phải breakpointDetails) — "for 4 seconds" khớp đúng "from".
// - Moonrise, Iron Core: người dùng xác nhận "Removed from 3-5 to 4-1"
//   nghĩa là bỏ ràng buộc mốc xuất hiện hoàn toàn (wisp xuất hiện được ở
//   bất kỳ giai đoạn nào) — set appearsStart/appearsEnd = null.
//
// VẪN SKIP (không có anchor — cấu trúc DB không lưu khái niệm này):
// - Warwick: "giảm mức độ thời gian tung chiêu co giãn theo AS" — cơ chế,
//   không có số liệu để ghi.
// - Elderwood 7pc: "Hộ Vệ Rừng" không có giá trị HP nào trong
//   breakpointDetails (bullet.values rỗng) — đây là chỉ số của ĐƠN VỊ triệu
//   hồi (Hộ Vệ Rừng), không phải field cấp trait, schema hiện không có chỗ
//   lưu stat riêng cho unit triệu hồi này.
// - Adaptive Helm (Radiant): bugfix "cấp sai lượng Năng Lượng cộng thêm",
//   không có số liệu đích cụ thể trong ảnh gốc để biết giá trị đúng là gì —
//   không đoán số, giữ nguyên "Gain an additional 30% Mana" hiện tại.
import { eq } from 'drizzle-orm';
import { db } from '../../src/db/client';
import { set18Champions, set18Traits, set18Wisps, set18Items } from '../../src/db/schema';

const DRY_RUN = process.argv.includes('--dry-run');

function replaceExact(text: string, oldStr: string, newStr: string, ctx: string): string {
  if (!text.includes(oldStr)) {
    throw new Error(`[${ctx}] Không tìm thấy chuỗi cần thay: ${JSON.stringify(oldStr)}`);
  }
  return text.split(oldStr).join(newStr);
}

function diffLine(label: string, from: string, to: string) {
  if (from === to) return;
  console.log(`    ${label}: ${JSON.stringify(from)} -> ${JSON.stringify(to)}`);
}

async function updateChampion(
  id: string,
  mutate: (row: { ability: string; abilityVi: string; mana: string; forms: any[] | null }) => {
    ability: string;
    abilityVi: string;
    mana: string;
    forms: any[] | null;
  },
) {
  const [row] = await db.select().from(set18Champions).where(eq(set18Champions.id, id));
  if (!row) throw new Error(`Champion không tìm thấy: ${id}`);
  const before = { ability: row.ability, abilityVi: row.abilityVi, mana: row.mana, forms: row.forms as any[] | null };
  const result = mutate(before);

  if (DRY_RUN) {
    console.log(`[DRY-RUN] champion ${id}`);
    diffLine('ability', before.ability, result.ability);
    diffLine('abilityVi', before.abilityVi, result.abilityVi);
    diffLine('mana', before.mana, result.mana);
    const formsChanged = JSON.stringify(before.forms) !== JSON.stringify(result.forms);
    if (formsChanged) {
      const beforeForms = before.forms ?? [];
      const afterForms = result.forms ?? [];
      afterForms.forEach((f: any, i: number) => {
        const b = beforeForms[i] ?? {};
        diffLine(`forms[${i}].abilityHtmlVi`, b.abilityHtmlVi ?? '', f.abilityHtmlVi ?? '');
        if (JSON.stringify(b.stats) !== JSON.stringify(f.stats)) {
          console.log(`    forms[${i}].stats: ${JSON.stringify(b.stats)} -> ${JSON.stringify(f.stats)}`);
        }
        if (JSON.stringify(b.calcs) !== JSON.stringify(f.calcs)) {
          console.log(`    forms[${i}].calcs: ${JSON.stringify(b.calcs)} -> ${JSON.stringify(f.calcs)}`);
        }
      });
    }
    return;
  }

  await db
    .update(set18Champions)
    .set({ ability: result.ability, abilityVi: result.abilityVi, mana: result.mana, forms: result.forms, updatedAt: new Date() })
    .where(eq(set18Champions.id, id));
  console.log(`✓ champion ${id}`);
}

async function writeTrait(name: string, details: any[], summary: string) {
  if (DRY_RUN) {
    console.log(`[DRY-RUN] trait ${name} — ${summary}`);
    return;
  }
  await db.update(set18Traits).set({ breakpointDetails: details, updatedAt: new Date() }).where(eq(set18Traits.name, name));
  console.log(`✓ trait ${name} (${summary})`);
}

async function updateWisp(
  name: string,
  opts: {
    description?: [string, string][];
    descriptionVi?: [string, string][];
    cost?: [number, number];
    /** Bỏ ràng buộc mốc xuất hiện — set appearsStart/appearsEnd = null. */
    clearAppearsRestriction?: boolean;
  },
) {
  const [row] = await db.select().from(set18Wisps).where(eq(set18Wisps.name, name));
  if (!row) throw new Error(`Wisp không tìm thấy: ${name}`);

  let description = row.description;
  let descriptionVi = row.descriptionVi;
  for (const [from, to] of opts.description ?? []) description = replaceExact(description, from, to, `${name}/description`);
  for (const [from, to] of opts.descriptionVi ?? []) descriptionVi = replaceExact(descriptionVi, from, to, `${name}/descriptionVi`);

  let cost = row.cost;
  if (opts.cost) {
    const [from, to] = opts.cost;
    if (cost !== from) throw new Error(`[${name}/cost] hiện tại (${cost}) không khớp "from" mong đợi (${from})`);
    cost = to;
  }

  const appearsVi = opts.clearAppearsRestriction ? 'Xuất hiện: Bất kỳ lúc nào' : row.appearsVi;

  if (DRY_RUN) {
    console.log(`[DRY-RUN] wisp ${name}`);
    diffLine('description', row.description, description);
    diffLine('descriptionVi', row.descriptionVi, descriptionVi);
    if (row.cost !== cost) diffLine('cost', String(row.cost), String(cost));
    if (opts.clearAppearsRestriction) {
      diffLine('appearsStart', row.appearsStart ?? '', '');
      diffLine('appearsEnd', row.appearsEnd ?? '', '');
      diffLine('appearsVi', row.appearsVi, appearsVi);
    }
    return;
  }

  await db
    .update(set18Wisps)
    .set({
      description,
      descriptionVi,
      ...(opts.cost ? { cost } : {}),
      ...(opts.clearAppearsRestriction ? { appearsStart: null, appearsEnd: null, appearsVi } : {}),
      updatedAt: new Date(),
    })
    .where(eq(set18Wisps.name, name));
  console.log(`✓ wisp ${name}`);
}

async function updateItem(
  name: string,
  opts: {
    description?: [string, string][];
    descriptionVi?: [string, string][];
    statLine?: [string, string];
    statBadges?: { stat: string; value: string }[];
    visible?: boolean;
  },
) {
  const [row] = await db.select().from(set18Items).where(eq(set18Items.name, name));
  if (!row) throw new Error(`Item không tìm thấy: ${name}`);

  let description = row.description;
  let descriptionVi = row.descriptionVi;
  for (const [from, to] of opts.description ?? []) description = replaceExact(description, from, to, `${name}/description`);
  for (const [from, to] of opts.descriptionVi ?? []) descriptionVi = replaceExact(descriptionVi, from, to, `${name}/descriptionVi`);

  let statLine = row.statLine;
  if (opts.statLine) {
    const [from, to] = opts.statLine;
    if (statLine !== from) throw new Error(`[${name}/statLine] hiện tại (${JSON.stringify(statLine)}) không khớp "from" mong đợi (${JSON.stringify(from)})`);
    statLine = to;
  }

  if (DRY_RUN) {
    console.log(`[DRY-RUN] item ${name}`);
    diffLine('description', row.description, description);
    diffLine('descriptionVi', row.descriptionVi, descriptionVi);
    if (opts.statLine) diffLine('statLine', row.statLine ?? '', statLine ?? '');
    if (opts.statBadges) console.log(`    statBadges: ${JSON.stringify(row.statBadges)} -> ${JSON.stringify(opts.statBadges)}`);
    if (opts.visible !== undefined && opts.visible !== row.visible) diffLine('visible', String(row.visible), String(opts.visible));
    return;
  }

  await db
    .update(set18Items)
    .set({
      description,
      descriptionVi,
      ...(opts.statLine ? { statLine } : {}),
      ...(opts.statBadges ? { statBadges: opts.statBadges } : {}),
      ...(opts.visible !== undefined ? { visible: opts.visible } : {}),
      updatedAt: new Date(),
    })
    .where(eq(set18Items.name, name));
  console.log(`✓ item ${name}`);
}

async function main() {
  // ══════════════════════════ CHAMPIONS ══════════════════════════

  await updateChampion('champion:tft18_cinderling', (r) => ({
    ability: r.ability,
    abilityVi: r.abilityVi,
    mana: r.mana,
    forms: r.forms!.map((f) => {
      if (f.stats?.attackDamage?.[0] !== 40) throw new Error(`[Cinderling/stats.attackDamage[0]] hiện tại (${f.stats?.attackDamage?.[0]}) không khớp 40`);
      return { ...f, stats: { ...f.stats, attackDamage: [45, f.stats.attackDamage[1], f.stats.attackDamage[2]] } };
    }),
  }));

  await updateChampion('champion:tft18_pebbles', (r) => ({
    // Ảnh gốc đã được người dùng xác nhận qua đối chiếu lịch sử patch —
    // DB thật "150/225/340" là kết quả patch 2026-08-06 (nerf từ 160/240/360),
    // không sai; hôm nay tin "to"=155/235/350.
    ability: replaceExact(r.ability, '150/225/340 magic damage', '155/235/350 magic damage', 'Pebbles/ability'),
    abilityVi: replaceExact(r.abilityVi, '150/225/340 sát thương phép', '155/235/350 sát thương phép', 'Pebbles/abilityVi'),
    mana: r.mana,
    forms: r.forms!.map((f) => {
      if (f.stats?.attackDamage?.[0] !== 30) throw new Error(`[Pebbles/stats.attackDamage[0]] hiện tại (${f.stats?.attackDamage?.[0]}) không khớp 30`);
      return {
        ...f,
        stats: { ...f.stats, attackDamage: [35, f.stats.attackDamage[1], f.stats.attackDamage[2]] },
        abilityHtmlVi: replaceExact(f.abilityHtmlVi, '150/225/340', '155/235/350', 'Pebbles/forms/abilityHtmlVi'),
      };
    }),
  }));

  await updateChampion('champion:tft18_xayah', (r) => ({
    ability: replaceExact(r.ability, '72/108/165 physical damage', '68/102/155 physical damage', 'Xayah/ability'),
    abilityVi: replaceExact(r.abilityVi, '72/108/165 sát thương vật lý', '68/102/155 sát thương vật lý', 'Xayah/abilityVi'),
    mana: r.mana,
    forms: r.forms!.map((f) => ({ ...f, abilityHtmlVi: replaceExact(f.abilityHtmlVi, '72/108/165', '68/102/155', 'Xayah/forms/abilityHtmlVi') })),
  }));

  await updateChampion('champion:tft18_ornn', (r) => {
    // Người dùng xác nhận ghi đè thẳng theo số đích patch (90k/155k/180k)
    // dù Forge Power thật (90000/235000/400000) không khớp "from" ảnh gốc.
    const forms = r.forms!.map((f) => ({
      ...f,
      abilityHtmlVi: replaceExact(f.abilityHtmlVi, '90000/235000/400000', '90000/155000/180000', 'Ornn/forms/abilityHtmlVi'),
    }));
    return {
      ability: replaceExact(r.ability, '90000/235000/400000', '90000/155000/180000', 'Ornn/ability'),
      abilityVi: replaceExact(r.abilityVi, '90000/235000/400000', '90000/155000/180000', 'Ornn/abilityVi'),
      mana: r.mana,
      forms,
    };
  });

  await updateChampion('champion:tft18_yunara', (r) => {
    const forms = r.forms!.map((f) => {
      const calcs = (f.calcs ?? []).map((c: any) => (c.total === '155/230/350' ? { ...c, total: '150/225/335' } : c));
      return { ...f, calcs, abilityHtmlVi: replaceExact(f.abilityHtmlVi, '155/230/350', '150/225/335', 'Yunara/forms/abilityHtmlVi') };
    });
    return {
      ability: replaceExact(r.ability, '155/230/350', '150/225/335', 'Yunara/ability'),
      abilityVi: replaceExact(r.abilityVi, '155/230/350', '150/225/335', 'Yunara/abilityVi'),
      mana: r.mana,
      forms,
    };
  });

  await updateChampion('champion:tft18_khazix', (r) => ({
    ability: replaceExact(r.ability, '260/370/550 magic damage', '285/400/580 magic damage', 'KhaZix/ability'),
    abilityVi: replaceExact(r.abilityVi, '260/370/550 sát thương phép', '285/400/580 sát thương phép', 'KhaZix/abilityVi'),
    mana: r.mana,
    forms: r.forms!.map((f) => {
      if (f.stats?.health?.[0] !== 850) throw new Error(`[KhaZix/stats.health[0]] hiện tại (${f.stats?.health?.[0]}) không khớp 850`);
      return {
        ...f,
        stats: { ...f.stats, health: [950, f.stats.health[1], f.stats.health[2]] },
        abilityHtmlVi: replaceExact(f.abilityHtmlVi, '260/370/550', '285/400/580', 'KhaZix/forms/abilityHtmlVi'),
      };
    }),
  }));

  await updateChampion('champion:tft18_raptor', (r) => ({
    ability: r.ability,
    abilityVi: r.abilityVi,
    mana: r.mana,
    forms: r.forms!.map((f) => {
      if (f.stats?.attackDamage?.[0] !== 60) throw new Error(`[Raptor/stats.attackDamage[0]] hiện tại (${f.stats?.attackDamage?.[0]}) không khớp 60`);
      return { ...f, stats: { ...f.stats, attackDamage: [65, f.stats.attackDamage[1], f.stats.attackDamage[2]] } };
    }),
  }));

  await updateChampion('champion:tft18_rengar', (r) => ({
    // ability_vi/abilityHtmlVi có cấu trúc khác hẳn EN (không nêu "up to
    // 150"), không replaceExact được — CHỈ sửa field EN.
    ability: (() => {
      let a = replaceExact(r.ability, 'heal for 70', 'heal for 60', 'Rengar/ability/min');
      a = replaceExact(a, 'up to 150', 'up to 120', 'Rengar/ability/max');
      return a;
    })(),
    abilityVi: r.abilityVi,
    mana: r.mana,
    forms: r.forms,
  }));

  await updateChampion('champion:tft18_vi', (r) => ({
    ability: replaceExact(r.ability, '225/300/400 Health', '200/265/360 Health', 'Vi/ability'),
    abilityVi: replaceExact(r.abilityVi, '225/300/400 Máu', '200/265/360 Máu', 'Vi/abilityVi'),
    mana: r.mana,
    forms: r.forms!.map((f) => ({ ...f, abilityHtmlVi: replaceExact(f.abilityHtmlVi, '225/300/400', '200/265/360', 'Vi/forms/abilityHtmlVi') })),
  }));

  await updateChampion('champion:tft18_brambleback', (r) => ({
    ability: r.ability,
    abilityVi: r.abilityVi,
    mana: r.mana,
    forms: r.forms!.map((f) => {
      if (f.stats?.attackDamage?.[0] !== 110) throw new Error(`[Brambleback/stats.attackDamage[0]] hiện tại (${f.stats?.attackDamage?.[0]}) không khớp 110`);
      return { ...f, stats: { ...f.stats, attackDamage: [115, f.stats.attackDamage[1], f.stats.attackDamage[2]] } };
    }),
  }));

  await updateChampion('champion:tft18_alune', (r) => ({
    ability: replaceExact(r.ability, '50/75/500 magic damage', '53/80/500 magic damage', 'Alune/ability'),
    abilityVi: replaceExact(r.abilityVi, '50/75/500 sát thương phép', '53/80/500 sát thương phép', 'Alune/abilityVi'),
    mana: r.mana,
    forms: r.forms!.map((f) => ({ ...f, abilityHtmlVi: replaceExact(f.abilityHtmlVi, '50/75/500', '53/80/500', 'Alune/forms/abilityHtmlVi') })),
  }));

  await updateChampion('champion:tft18_nidalee', (r) => {
    // "Empowered Spell Damage 320/480" không khớp field nào. Theo chỉ đạo
    // người dùng: ghi thẳng số đích patch (285/425) vào "đòn đánh thứ 3"
    // (Empowered) — dùng giá trị THẬT hiện có của từng field làm anchor
    // (abilityHtmlVi AP-form "300/450/3000"; ability EN "250/375/3000" —
    // 2 field đã lệch nhau sẵn từ trước, không phải do patch này).
    const forms = r.forms!.map((f) => {
      if (f.label !== 'AP') return f;
      return { ...f, abilityHtmlVi: replaceExact(f.abilityHtmlVi, '300/450/3000', '285/425/3000', 'Nidalee/AP/abilityHtmlVi') };
    });
    return {
      ability: replaceExact(r.ability, '250/375/3000', '285/425/3000', 'Nidalee/ability'),
      abilityVi: r.abilityVi,
      mana: r.mana,
      forms,
    };
  });

  await updateChampion('champion:tft18_kennen', (r) => {
    // "Spell Damage 450/675" không khớp field nào. Theo chỉ đạo người dùng:
    // ghi thẳng số đích patch (475/715) vào firestorm tổng (600/900/2000 —
    // trường gần nghĩa nhất, DB "đang chậm"), giữ nguyên mốc 3 sao (2000).
    const forms = r.forms!.map((f) => ({
      ...f,
      abilityHtmlVi: replaceExact(f.abilityHtmlVi, '600/900/2000', '475/715/2000', 'Kennen/forms/abilityHtmlVi'),
    }));
    return {
      ability: replaceExact(r.ability, '600/900/2000', '475/715/2000', 'Kennen/ability'),
      abilityVi: replaceExact(r.abilityVi, '600/900/2000', '475/715/2000', 'Kennen/abilityVi'),
      mana: r.mana,
      forms,
    };
  });

  // Lux: DB đã ghi 12% (Thưởng Mặt Trời) — trùng khớp "to" của patch, NO-OP
  // (đã đúng từ trước, không phải bỏ sót).

  // ══════════════════════════ TRAITS ══════════════════════════

  await (async () => {
    const [row] = await db.select().from(set18Traits).where(eq(set18Traits.name, 'Inferno'));
    if (!row) throw new Error('Trait không tìm thấy: Inferno');
    const details = row.breakpointDetails as any[];
    const t5 = details.find((x) => x.threshold === '5');
    const t7 = details.find((x) => x.threshold === '7');
    const v5 = t5?.bullet?.values?.find((x: any) => x.row === 'HPBurnPerSecond');
    const v7 = t7?.bullet?.values?.find((x: any) => x.row === 'HPBurnPerSecond');
    if (!v5 || v5.value !== '2') throw new Error(`[Inferno/mốc5] hiện tại (${v5?.value}) không khớp "2"`);
    if (!v7 || v7.value !== '3') throw new Error(`[Inferno/mốc7] hiện tại (${v7?.value}) không khớp "3"`);
    v5.value = '3';
    v7.value = '3.5';
    // Burn Duration 4s->3s — anchor tìm thấy ở field `description` cấp
    // trait (KHÔNG phải breakpointDetails), người dùng yêu cầu soát lại.
    const description = replaceExact(row.description, 'for 4 seconds', 'for 3 seconds', 'Inferno/description');
    const descriptionVi = replaceExact(row.descriptionVi, 'trong 4 giây', 'trong 3 giây', 'Inferno/descriptionVi');
    if (DRY_RUN) {
      console.log('[DRY-RUN] trait Inferno — mốc 5 Burn 2→3%, mốc 7 Burn 3→3.5%, Burn Duration 4→3s');
      diffLine('description', row.description, description);
      diffLine('descriptionVi', row.descriptionVi, descriptionVi);
    } else {
      await db.update(set18Traits).set({ breakpointDetails: details, description, descriptionVi, updatedAt: new Date() }).where(eq(set18Traits.name, 'Inferno'));
      console.log('✓ trait Inferno (mốc 5 Burn 2→3%, mốc 7 Burn 3→3.5%, Burn Duration 4→3s)');
    }
  })();

  await (async () => {
    const [row] = await db.select().from(set18Traits).where(eq(set18Traits.name, 'Vanguard'));
    if (!row) throw new Error('Trait không tìm thấy: Vanguard');
    const details = row.breakpointDetails as any[];
    const t4 = details.find((x) => x.threshold === '4');
    const t6 = details.find((x) => x.threshold === '6');
    const v4 = t4?.bullet?.values?.find((x: any) => x.row === 'MaxHealthShield');
    const v6 = t6?.bullet?.values?.find((x: any) => x.row === 'MaxHealthShield');
    if (!v4 || v4.value !== '35%') throw new Error(`[Vanguard/mốc4] hiện tại (${v4?.value}) không khớp "35%" (anchor thật, ảnh gốc ghi 32%)`);
    if (!v6 || v6.value !== '42%') throw new Error(`[Vanguard/mốc6] hiện tại (${v6?.value}) không khớp "42%"`);
    v4.value = '30%';
    v6.value = '40%';
    // Mốc 2 (18%) không đổi — patch giữ nguyên 18% ở cả from và to.
    await writeTrait('Vanguard', details, 'mốc 4 Shield 35→30%, mốc 6 Shield 42→40%');
  })();

  await (async () => {
    const [row] = await db.select().from(set18Traits).where(eq(set18Traits.name, 'Blossom'));
    if (!row) throw new Error('Trait không tìm thấy: Blossom');
    const details = row.breakpointDetails as any[];
    const t9 = details.find((x) => x.threshold === '9');
    const v9 = t9?.bullet?.values?.find((x: any) => x.row === 'ADAP');
    if (!v9 || v9.value !== '60%') throw new Error(`[Blossom/mốc9] hiện tại (${v9?.value}) không khớp "60%"`);
    v9.value = '50%';
    // Người dùng xác nhận: patch áp cho mốc 3/5/7/9 (không phải 11, mốc 11
    // giữ nguyên 100%). Mốc 3 (12%) và mốc 5 (30%) đã đúng target sẵn —
    // KHÔNG ghi (no-op). Mốc 7 DB thật đã là 45% — trùng khớp "to" của patch
    // (12/30/45/50%) — cũng NO-OP, chỉ mốc 9 cần đổi 60%→50%.
    await writeTrait('Blossom', details, 'mốc 9 AD/AP 60→50% (mốc 3/5/7 đã đúng target sẵn, mốc 11 giữ 100% không đổi)');
  })();

  // Elderwood 7pc: SKIP — xem ghi chú đầu file (chỉ số HP thuộc đơn vị Hộ Vệ
  // Rừng triệu hồi, không phải field cấp trait, schema không có chỗ lưu).

  // ══════════════════════════ WISPS ══════════════════════════

  await updateWisp('Artifactinate', { cost: [0, 2] });

  await updateWisp('Backrow Star', {
    description: [['gains 75% Attack Speed', 'gains 85% Attack Speed']],
    descriptionVi: [['nhận 75% Tốc Độ Đánh', 'nhận 85% Tốc Độ Đánh']],
    cost: [4, 3],
  });

  await updateWisp('Giant Growth', {
    description: [['gaining 700 Health', 'gaining 750 Health']],
    descriptionVi: [['nhận thêm 700 Máu', 'nhận thêm 750 Máu']],
  });

  await updateWisp("Killer's Regret", {
    description: [['stun their killer for 1.25 seconds', 'stun their killer for 1.5 seconds']],
    descriptionVi: [['làm choáng kẻ đã hạ gục họ trong 1.25 giây', 'làm choáng kẻ đã hạ gục họ trong 1.5 giây']],
  });

  await updateWisp('Snacktime!', {
    description: [['damages under 15% Max Health', 'damages under 16% Max Health']],
    descriptionVi: [['còn dưới 15% Máu Tối Đa', 'còn dưới 16% Máu Tối Đa']],
    cost: [3, 2],
  });

  await updateWisp('Stealthy', { cost: [1, 0] });

  await updateWisp('Iron Core', {
    description: [['gains 4% Max Health per front-row unit', 'gains 6% Max Health per front-row unit']],
    descriptionVi: [['nhận 4% Máu tối đa cho mỗi đơn vị ở hàng trước', 'nhận 6% Máu tối đa cho mỗi đơn vị ở hàng trước']],
    clearAppearsRestriction: true, // người dùng xác nhận "Removed from 3-5 to 4-1" = bỏ ràng buộc mốc xuất hiện
  });

  await updateWisp('Moonrise', { clearAppearsRestriction: true });

  await updateWisp('Ironwood', {
    description: [['deal 12% less damage', 'deal 14% less damage']],
    descriptionVi: [['giảm 12% sát thương gây ra', 'giảm 14% sát thương gây ra']],
  });

  await updateWisp('Radiantize', { cost: [6, 4] }); // "from" thật trong DB là 6, không phải 5 như ảnh gốc — tin "to"=4

  await updateWisp('Terraforming', {
    description: [['Gain 5 seeds', 'Gain 7 seeds']],
    descriptionVi: [['Nhận 5 hạt giống', 'Nhận 7 hạt giống']],
  });


  // ══════════════════════════ ITEMS ══════════════════════════

  // Death's Defiance — gỡ bỏ khỏi game, ẩn khỏi UI (người dùng xác nhận).
  await updateItem("Death's Defiance", { visible: false });

  await updateItem('Aegis of Dusk', {
    description: [['deal 15% of the holder', 'deal 18% of the holder']],
    descriptionVi: [['gây 15% lượng sát thương phép bằng Kháng Phép', 'gây 18% lượng sát thương phép bằng Kháng Phép']],
  });

  await updateItem('Manazane', {
    // DB thật ghi "gain 120 Mana" (không phải 100 như "from" ảnh gốc) — tin "to"=110.
    description: [['gain 120 Mana over 5 seconds', 'gain 110 Mana over 5 seconds']],
    descriptionVi: [['hồi lại 120 Năng Lượng trong vòng 5 giây', 'hồi lại 110 Năng Lượng trong vòng 5 giây']],
  });

  await updateItem('Rapid Firecannon', {
    // statLine "65% 5%" — "65%" khớp đúng "from" AS.
    statLine: ['65% 5%', '55% 5%'],
  });

  await updateItem('Silvermere Dawn', {
    // statLine "125% 30 30 20%" — "20%" khớp đúng "from" Omnivamp.
    statLine: ['125% 30 30 20%', '125% 30 30 30%'],
  });

  await updateItem("Wit's End", {
    // statLine "400 20 20 25%" — "400" khớp đúng "from" Health.
    statLine: ['400 20 20 25%', '300 20 20 25%'],
  });

  // Adaptive Helm — bugfix, không có số liệu before/after — chỉ patch report.

  await updateItem('Radiant Gargoyle Stoneplate', {
    statLine: ['300 50 50', '400 50 50'],
    statBadges: [
      { stat: 'armor', value: '50' },
      { stat: 'mr', value: '50' },
      { stat: 'health', value: '400' },
    ],
  });

  await updateItem('Radiant Hand of Justice', {
    description: [['30% Attack Damage and 30% Ability Power', '35% Attack Damage and 35% Ability Power']],
  });

  await updateItem('Radiant Steadfast Heart', {
    statLine: ['? 40 40%', '? 40 40%'], // không đổi — chỉ Health (statBadges) thay đổi, statLine giữ nguyên format "?"
    statBadges: [
      { stat: 'armor', value: '40' },
      { stat: 'health', value: '500' },
      { stat: 'critchance', value: '40%' },
    ],
  });

  await updateItem('Brawler Emblem', {
    // Người dùng xác nhận: lấy patch làm chuẩn. DB thật ghi "3%" (không phải
    // 2.5% như "from" ảnh gốc) — ghi đè theo "to"=2%.
    description: [["Attacks deal 3% of the holder's max Health", "Attacks deal 2% of the holder's max Health"]],
    descriptionVi: [['Đòn đánh gây sát thương phép bằng 3% Máu tối đa', 'Đòn đánh gây sát thương phép bằng 2% Máu tối đa']],
  });

  await updateItem('Executioner Emblem', {
    // Người dùng xác nhận: field statBadges "damageamp":"15%" là mechanic CŨ,
    // patch thay bằng "Critical Strike Damage" — đổi tên field, không chỉ số.
    description: [['Damage executes enemies below 12% of their max Health', 'Damage executes enemies below 8% of their max Health']],
    descriptionVi: [['Sát thương sẽ hành quyết kẻ địch còn dưới 12% Máu tối đa', 'Sát thương sẽ hành quyết kẻ địch còn dưới 8% Máu tối đa']],
    statBadges: [
      { stat: 'critchance', value: '35%' },
      { stat: 'critdamage', value: '8%' }, // thay cho "damageamp" cũ theo mechanic mới
    ],
  });

  await updateItem('Juggernaut Emblem', {
    // statLine "400" khớp đúng "from" Base Health.
    statLine: ['400', '350'],
  });

  await updateItem('Vanguard Emblem', {
    description: [['survives 20 seconds in player combat', 'survives 22 seconds in player combat']],
    descriptionVi: [['sống sót 20 giây trong giao tranh người chơi', 'sống sót 22 giây trong giao tranh người chơi']],
  });

  console.log('✓ Hoàn tất cập nhật champions/traits/wisps/items cho 18.1af (18/08).');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
