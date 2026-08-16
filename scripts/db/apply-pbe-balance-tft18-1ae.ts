// Migration một lần cho bản PBE 18.1ae (Truexy ghi ngày 8/14, đăng lúc 2:10
// AM giờ hiển thị Aug 15, 2026) — cập nhật set18_champions/set18_traits/
// set18_wisps/set18_augments. Nguồn: pbe-notes/Patch_TFT18.1ae-PBE-big-
// balance-pass.md.
//
// QUAN TRỌNG — nhiều số liệu trong ảnh gốc KHÔNG khớp chính xác với "from"
// đang có trong DB (lệch nhỏ vài đơn vị: Kobuko Heal 430 không phải 435,
// Defender Resist gold 115 không phải 110, Raptor Mana 40/80 không phải
// 30/70...). Theo xác nhận của người dùng, chiến lược áp dụng là: TIN giá
// trị "to" (đích) trong ảnh gốc, dùng giá trị THỰC TẾ đang có trong DB làm
// anchor assert (không assert theo "from" ảnh gốc nếu không khớp).
//
// Với các tướng có công thức tính điểm (calcs terms/total dạng "X ×
// AD-icon + Y × AP-icon" -> total): ưu tiên suy ra total mới bằng đại số khi
// khớp chính xác (vd Varus: total = AD-term + AP-term khớp CHÍNH XÁC ở mọi
// mốc sao). Khi KHÔNG suy luận đại số được (Yunara có "+1" cộng phẳng không
// khớp phép cộng đơn giản; Sivir không tìm được field nào khớp đúng magnitude
// patch ghi) — theo chỉ đạo người dùng (đợt duyệt DB thứ 2), vẫn GHI ĐÈ
// THẲNG số đích của ảnh gốc vào field hiển thị chính (ability/abilityHtmlVi
// text), chấp nhận có thể lệch nhỏ so với công thức nội bộ calc.terms (để
// nguyên phần terms cũ, chỉ số users thực sự nhìn thấy được ưu tiên đúng
// theo patch mới nhất).
//
// Những mục KHÔNG CÓ field/bullet nào chứa dữ liệu này trong DB (không phải
// lệch số, mà cấu trúc dữ liệu chưa từng lưu khái niệm này — vd Primal
// Phoenix takedowns/Bear Execute threshold, Elderwood Protector Enrage Heal
// Ratio, augment The Tower per-stage Health, augment Trait Ladder từng mốc
// cụ thể, Aphelios số lần vung vũ khí hiển thị "?" runtime) vẫn BỎ QUA — viết
// bừa vào cấu trúc JSON lồng nhau khi không biết đúng vị trí/tier rủi ro cao
// hơn nhiều so với để trống, cần tác vụ soạn nội dung riêng có review kỹ.
//
// Build a Bud (augment hoàn toàn mới, chưa từng có trong set18_augments) —
// theo yêu cầu người dùng, TẠO MỚI (insert) với rarity Silver (đoán, augment
// kinh tế sớm thường là Silver — người dùng đã duyệt), description CHỈ ghi
// đúng nội dung đã xác nhận (Initial Gold), icon dùng path placeholder theo
// đúng quy ước đặt tên file hiện có nhưng asset thật CHƯA chắc tồn tại — cần
// người dùng bổ sung ảnh + xác nhận lại rarity/category sau.
import { eq } from 'drizzle-orm';
import { db } from '../../src/db/client';
import { set18Champions, set18Traits, set18Wisps, set18Augments } from '../../src/db/schema';

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
  mutate: (row: {
    ability: string;
    abilityVi: string;
    mana: string;
    forms: any[] | null;
  }) => { ability: string; abilityVi: string; mana: string; forms: any[] | null },
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
        diffLine(`forms[${i}].mana`, b.mana ?? '', f.mana ?? '');
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

async function updateWisp(name: string, opts: {
  description?: [string, string][];
  descriptionVi?: [string, string][];
  blossomUpgradeDescriptionVi?: [string, string][];
  cost?: [number, number];
}) {
  const [row] = await db.select().from(set18Wisps).where(eq(set18Wisps.name, name));
  if (!row) throw new Error(`Wisp không tìm thấy: ${name}`);

  let description = row.description;
  let descriptionVi = row.descriptionVi;
  let blossomUpgradeDescriptionVi = row.blossomUpgradeDescriptionVi;
  for (const [from, to] of opts.description ?? []) description = replaceExact(description, from, to, `${name}/description`);
  for (const [from, to] of opts.descriptionVi ?? []) descriptionVi = replaceExact(descriptionVi, from, to, `${name}/descriptionVi`);
  if (opts.blossomUpgradeDescriptionVi) {
    if (!blossomUpgradeDescriptionVi) throw new Error(`[${name}/blossomUpgradeDescriptionVi] rỗng, không có gì để thay`);
    for (const [from, to] of opts.blossomUpgradeDescriptionVi) {
      blossomUpgradeDescriptionVi = replaceExact(blossomUpgradeDescriptionVi, from, to, `${name}/blossomUpgradeDescriptionVi`);
    }
  }

  let cost = row.cost;
  if (opts.cost) {
    const [from, to] = opts.cost;
    if (cost !== from) throw new Error(`[${name}/cost] hiện tại (${cost}) không khớp "from" mong đợi (${from})`);
    cost = to;
  }

  if (DRY_RUN) {
    console.log(`[DRY-RUN] wisp ${name}`);
    diffLine('description', row.description, description);
    diffLine('descriptionVi', row.descriptionVi, descriptionVi);
    if (row.blossomUpgradeDescriptionVi !== blossomUpgradeDescriptionVi) {
      diffLine('blossomUpgradeDescriptionVi', row.blossomUpgradeDescriptionVi ?? '', blossomUpgradeDescriptionVi ?? '');
    }
    if (row.cost !== cost) diffLine('cost', String(row.cost), String(cost));
    return;
  }

  await db
    .update(set18Wisps)
    .set({ description, descriptionVi, blossomUpgradeDescriptionVi, ...(opts.cost ? { cost } : {}), updatedAt: new Date() })
    .where(eq(set18Wisps.name, name));
  console.log(`✓ wisp ${name}`);
}

async function updateAugment(id: string, opts: { description?: [string, string][]; descriptionVi?: [string, string][] }) {
  const [row] = await db.select().from(set18Augments).where(eq(set18Augments.id, id));
  if (!row) throw new Error(`Augment không tìm thấy: ${id}`);

  let description = row.description;
  let descriptionVi = row.descriptionVi;
  for (const [from, to] of opts.description ?? []) description = replaceExact(description, from, to, `${id}/description`);
  for (const [from, to] of opts.descriptionVi ?? []) descriptionVi = replaceExact(descriptionVi, from, to, `${id}/descriptionVi`);

  if (DRY_RUN) {
    console.log(`[DRY-RUN] augment ${id}`);
    diffLine('description', row.description, description);
    diffLine('descriptionVi', row.descriptionVi, descriptionVi);
    return;
  }

  await db.update(set18Augments).set({ description, descriptionVi, updatedAt: new Date() }).where(eq(set18Augments.id, id));
  console.log(`✓ augment ${id}`);
}

async function main() {
  // ══════════════════════════ CHAMPIONS ══════════════════════════

  await updateChampion('champion:tft18_akali', (r) => ({
    ...r,
    forms: r.forms!.map((f) =>
      f.label === 'AP' ? { ...f, abilityHtmlVi: replaceExact(f.abilityHtmlVi, '155/235/385', '140/210/340', 'Akali/AP/abilityHtmlVi') } : f,
    ),
  }));

  await updateChampion('champion:tft18_camille', (r) => ({
    ability: replaceExact(r.ability, '60/85/160 Shield', '60/90/200 Shield', 'Camille/ability'),
    abilityVi: replaceExact(r.abilityVi, '60/85/160', '60/90/200', 'Camille/abilityVi'),
    mana: r.mana,
    forms: r.forms!.map((f) => ({ ...f, abilityHtmlVi: replaceExact(f.abilityHtmlVi, '60/85/160', '60/90/200', 'Camille/forms/abilityHtmlVi') })),
  }));

  await updateChampion('champion:tft18_kobuko', (r) => {
    const forms = r.forms!.map((f) => {
      const abilityHtmlVi = replaceExact(f.abilityHtmlVi, '265/315/430', '265/315/460', 'Kobuko/forms/abilityHtmlVi');
      const calcs = (f.calcs ?? []).map((c: any) => (c.total === '265/315/430' ? { ...c, total: '265/315/460' } : c));
      return { ...f, abilityHtmlVi, calcs };
    });
    return {
      ability: replaceExact(r.ability, '265/315/430', '265/315/460', 'Kobuko/ability'),
      abilityVi: replaceExact(r.abilityVi, '265/315/430', '265/315/460', 'Kobuko/abilityVi'),
      mana: r.mana,
      forms,
    };
  });

  await updateChampion('champion:tft18_rakan', (r) => {
    if (r.mana !== '20 / 90') throw new Error(`[Rakan/mana] hiện tại (${r.mana}) không khớp "20 / 90"`);
    const forms = r.forms!.map((f) => {
      if (f.mana !== '20 / 90') throw new Error(`[Rakan/forms.mana] hiện tại (${f.mana}) không khớp "20 / 90"`);
      if (f.stats?.mana?.[0] !== 20 || f.stats?.mana?.[1] !== 90) throw new Error('[Rakan/forms.stats.mana] không khớp [20,90]');
      return {
        ...f,
        mana: '35 / 105',
        stats: { ...f.stats, mana: [35, 105] },
        abilityHtmlVi: replaceExact(f.abilityHtmlVi, '250/300/375', '270/320/415', 'Rakan/forms/abilityHtmlVi'),
      };
    });
    return {
      ability: replaceExact(r.ability, '250/300/375 Shield', '270/320/415 Shield', 'Rakan/ability'),
      abilityVi: replaceExact(r.abilityVi, '250/300/375', '270/320/415', 'Rakan/abilityVi'),
      mana: '35 / 105',
      forms,
    };
  });

  await updateChampion('champion:tft18_varus', (r) => {
    // total = AD-term + AP-term khớp CHÍNH XÁC ở cả 3 mốc sao hiện tại
    // (380=350+30, 570=525+45, 860=790+70) — suy ra total mới an toàn bằng
    // đại số thay vì đoán mò.
    const forms = r.forms!.map((f) => {
      const calcs = (f.calcs ?? []).map((c: any) => {
        if (c.total !== '380/570/860') return c;
        const terms = replaceExact(c.terms, '350/525/790', '385/580/925', 'Varus/calc/terms');
        return { ...c, terms, total: '415/625/995' };
      });
      const abilityHtmlVi = replaceExact(f.abilityHtmlVi, '380/570/860', '415/625/995', 'Varus/forms/abilityHtmlVi');
      return { ...f, calcs, abilityHtmlVi };
    });
    return {
      ability: replaceExact(r.ability, '380/570/860', '415/625/995', 'Varus/ability'),
      abilityVi: replaceExact(r.abilityVi, '380/570/860', '415/625/995', 'Varus/abilityVi'),
      mana: r.mana,
      forms,
    };
  });

  await updateChampion('champion:tft18_teemo', (r) => ({
    // VI (ability_vi + forms.abilityHtmlVi) KHÔNG có dòng "giant mushroom" —
    // bản dịch thiếu sẵn từ trước, không liên quan patch này. Chỉ sửa được EN.
    ability: replaceExact(r.ability, '150/225/350 magic damage to target', '135/200/310 magic damage to target', 'Teemo/ability'),
    abilityVi: r.abilityVi,
    mana: r.mana,
    forms: r.forms,
  }));

  await updateChampion('champion:tft18_warwick', (r) => ({
    ability: replaceExact(r.ability, 'Gain 25% Attack Speed', 'Gain 20% Attack Speed', 'Warwick/ability'),
    abilityVi: replaceExact(r.abilityVi, 'Nhận 25% Tốc Độ Đánh', 'Nhận 20% Tốc Độ Đánh', 'Warwick/abilityVi'),
    mana: r.mana,
    forms: r.forms!.map((f) => ({
      ...f,
      abilityHtmlVi: replaceExact(f.abilityHtmlVi, '25%</span> Tốc Độ Đánh', '20%</span> Tốc Độ Đánh', 'Warwick/forms/abilityHtmlVi'),
    })),
  }));

  await updateChampion('champion:tft18_azir', (r) => ({
    ability: replaceExact(r.ability, '50/75/120 magic damage', '46/69/110 magic damage', 'Azir/ability'),
    abilityVi: replaceExact(r.abilityVi, '50/75/120 sát thương phép', '46/69/110 sát thương phép', 'Azir/abilityVi'),
    mana: r.mana,
    forms: r.forms!.map((f) => ({ ...f, abilityHtmlVi: replaceExact(f.abilityHtmlVi, '50/75/120', '46/69/110', 'Azir/forms/abilityHtmlVi') })),
  }));

  await updateChampion('champion:tft18_masteryi', (r) => {
    // AD Form AD 67->65: patch chỉ ghi 1 số (mốc 1 sao). Theo chỉ đạo người
    // dùng, ghi đè thẳng mốc 1 sao (67->65), KHÔNG suy diễn mốc 2/3 sao
    // (105/158 giữ nguyên, không có dữ liệu để tính lại theo tỉ lệ mới).
    const forms = r.forms!.map((f) => {
      // Cả 2 form (AD/AP) đều lưu cùng stats.attackDamage — cập nhật đồng bộ
      // cả 2 để tránh 2 form hiện AD gốc khác nhau.
      if (f.stats?.attackDamage?.[0] !== 67) throw new Error(`[MasterYi/${f.label}/stats.attackDamage[0]] hiện tại (${f.stats?.attackDamage?.[0]}) không khớp 67`);
      f = { ...f, stats: { ...f.stats, attackDamage: [65, f.stats.attackDamage[1], f.stats.attackDamage[2]] } };
      if (f.label === 'AP') {
        f = { ...f, abilityHtmlVi: replaceExact(f.abilityHtmlVi, '145/220/350', '140/210/335', 'MasterYi/AP/abilityHtmlVi') };
      }
      return f;
    });
    return { ability: r.ability, abilityVi: r.abilityVi, mana: r.mana, forms };
  });

  await updateChampion('champion:tft18_raptor', (r) => {
    if (r.mana !== '40 / 80') throw new Error(`[Raptor/mana] hiện tại (${r.mana}) không khớp "40 / 80"`);
    const forms = r.forms!.map((f) => {
      if (f.mana !== '40 / 80') throw new Error(`[Raptor/forms.mana] hiện tại (${f.mana}) không khớp "40 / 80"`);
      return { ...f, mana: '20 / 60', stats: { ...f.stats, mana: [20, 60] } };
    });
    return { ability: r.ability, abilityVi: r.abilityVi, mana: '20 / 60', forms };
  });

  await updateChampion('champion:tft18_khazix', (r) => ({
    ability: r.ability,
    abilityVi: r.abilityVi,
    mana: r.mana,
    forms: r.forms!.map((f) => {
      if (f.stats?.attackSpeed !== 0.8) throw new Error(`[KhaZix/stats.attackSpeed] hiện tại (${f.stats?.attackSpeed}) không khớp 0.8`);
      return { ...f, stats: { ...f.stats, attackSpeed: 0.85 } };
    }),
  }));

  await updateChampion('champion:tft18_tristana', (r) => ({
    ability: replaceExact(r.ability, '200/300/480 physical damage', '160/240/385 physical damage', 'Tristana/ability'),
    abilityVi: replaceExact(r.abilityVi, '200/300/480 sát thương vật lý', '160/240/385 sát thương vật lý', 'Tristana/abilityVi'),
    mana: r.mana,
    forms: r.forms!.map((f) => ({
      ...f,
      abilityHtmlVi: replaceExact(f.abilityHtmlVi, '200/300/480', '160/240/385', 'Tristana/forms/abilityHtmlVi'),
    })),
  }));

  await updateChampion('champion:tft18_ezreal', (r) => ({
    ability: replaceExact(r.ability, '225/340/1200 physical damage', '235/355/1200 physical damage', 'Ezreal/ability'),
    abilityVi: replaceExact(r.abilityVi, '225/340/1200 sát thương vật lý', '235/355/1200 sát thương vật lý', 'Ezreal/abilityVi'),
    mana: r.mana,
    forms: r.forms!.map((f) => ({ ...f, abilityHtmlVi: replaceExact(f.abilityHtmlVi, '225/340/1200', '235/355/1200', 'Ezreal/forms/abilityHtmlVi') })),
  }));

  await updateChampion('champion:tft18_zyra', (r) => ({
    ability: replaceExact(r.ability, '35/52/225 magic damage', '37/55/225 magic damage', 'Zyra/ability'),
    abilityVi: replaceExact(r.abilityVi, '35/52/225 sát thương phép', '37/55/225 sát thương phép', 'Zyra/abilityVi'),
    mana: r.mana,
    forms: r.forms!.map((f) => ({ ...f, abilityHtmlVi: replaceExact(f.abilityHtmlVi, '35/52/225', '37/55/225', 'Zyra/forms/abilityHtmlVi') })),
  }));

  await updateChampion('champion:tft18_lillia', (r) => ({
    // ability/abilityVi (800) và abilityHtmlVi (600) đã LỆCH NHAU SẴN trong DB
    // trước patch này — giữ nguyên độ lệch đó, chỉ sửa 2 số đầu ở mỗi field.
    ability: replaceExact(r.ability, '280/360/800 Health', '300/400/800 Health', 'Lillia/ability'),
    abilityVi: replaceExact(r.abilityVi, '280/360/800 Máu', '300/400/800 Máu', 'Lillia/abilityVi'),
    mana: r.mana,
    forms: r.forms!.map((f) => ({ ...f, abilityHtmlVi: replaceExact(f.abilityHtmlVi, '280/360/600', '300/400/600', 'Lillia/forms/abilityHtmlVi') })),
  }));

  await updateChampion('champion:tft18_alune', (r) => ({
    ability: replaceExact(r.ability, '2200/3400/7500 magic damage', '2350/3600/7500 magic damage', 'Alune/ability'),
    abilityVi: replaceExact(r.abilityVi, '2200/3400/7500 sát thương phép', '2350/3600/7500 sát thương phép', 'Alune/abilityVi'),
    mana: r.mana,
    forms: r.forms!.map((f) => ({ ...f, abilityHtmlVi: replaceExact(f.abilityHtmlVi, '2200/3400/7500', '2350/3600/7500', 'Alune/forms/abilityHtmlVi') })),
  }));

  await updateChampion('champion:tft18_elderdragon', (r) => ({
    ability: replaceExact(r.ability, '250/375/7200 physical damage', '265/400/7200 physical damage', 'ElderDragon/ability'),
    abilityVi: replaceExact(r.abilityVi, '250/375/7200 sát thương vật lý', '265/400/7200 sát thương vật lý', 'ElderDragon/abilityVi'),
    mana: r.mana,
    forms: r.forms!.map((f) => ({
      ...f,
      abilityHtmlVi: replaceExact(f.abilityHtmlVi, '250/375/7200', '265/400/7200', 'ElderDragon/forms/abilityHtmlVi'),
    })),
  }));

  await updateChampion('champion:tft18_yunara', (r) => {
    // Không suy ra total mới bằng đại số được (170+1=171≠180 total hiện tại).
    // Theo chỉ đạo người dùng, ghi đè thẳng số đích ảnh gốc (155/230/350)
    // vào field hiển thị chính (total hiện tại 180/270/425), chấp nhận
    // calc.terms bên dưới (hệ số AD "170/255/400 + 1") có thể không còn khớp
    // tuyệt đối 100% với total mới — số users nhìn thấy được ưu tiên đúng.
    const forms = r.forms!.map((f) => {
      const calcs = (f.calcs ?? []).map((c: any) => (c.total === '180/270/425' ? { ...c, total: '155/230/350' } : c));
      return { ...f, calcs, abilityHtmlVi: replaceExact(f.abilityHtmlVi, '180/270/425', '155/230/350', 'Yunara/forms/abilityHtmlVi') };
    });
    return {
      ability: replaceExact(r.ability, '180/270/425', '155/230/350', 'Yunara/ability'),
      abilityVi: replaceExact(r.abilityVi, '180/270/425', '155/230/350', 'Yunara/abilityVi'),
      mana: r.mana,
      forms,
    };
  });

  await updateChampion('champion:tft18_sivir', (r) => {
    // "180/270 AD" không khớp field nào trong calcs theo magnitude. Diễn giải
    // gần nhất: total hiện tại 2 mốc sao đầu là 165/250 (calc1.total), gần
    // magnitude patch hơn hẳn so với hệ số AD riêng (150/230). Theo chỉ đạo
    // người dùng, ghi đè thẳng 165/250 -> 190/285 vào total (giữ nguyên mốc 3
    // sao 1050 vì patch không cho số đích).
    const forms = r.forms!.map((f) => {
      const calcs = (f.calcs ?? []).map((c: any) => (c.total === '165/250/1050' ? { ...c, total: '190/285/1050' } : c));
      return { ...f, calcs, abilityHtmlVi: replaceExact(f.abilityHtmlVi, '165/250/1050', '190/285/1050', 'Sivir/forms/abilityHtmlVi') };
    });
    return {
      ability: replaceExact(r.ability, '165/250/1050', '190/285/1050', 'Sivir/ability'),
      abilityVi: replaceExact(r.abilityVi, '165/250/1050', '190/285/1050', 'Sivir/abilityVi'),
      mana: r.mana,
      forms,
    };
  });

  // SKIP (không phải lệch số — cấu trúc DB không có field/bullet nào lưu
  // khái niệm này, không đoán vị trí để tránh ghi sai):
  // - Aphelios: "Base Number of Swipes"/"Bonus AS% Required" không xuất hiện
  //   dạng số trong ability text (chỉ có "?" placeholder tính runtime).

  // ══════════════════════════ TRAITS ══════════════════════════

  async function writeTrait(name: string, details: any[], summary: string) {
    if (DRY_RUN) {
      console.log(`[DRY-RUN] trait ${name} — ${summary}`);
      return;
    }
    await db.update(set18Traits).set({ breakpointDetails: details, updatedAt: new Date() }).where(eq(set18Traits.name, name));
    console.log(`✓ trait ${name} (${summary})`);
  }

  await (async () => {
    const [row] = await db.select().from(set18Traits).where(eq(set18Traits.name, 'Blackthorn'));
    if (!row) throw new Error('Trait không tìm thấy: Blackthorn');
    const details = row.breakpointDetails as any[];
    const gold = details.find((x) => x.threshold === '6');
    if (!gold) throw new Error('[Blackthorn/mốc6] không tìm thấy breakpointDetails');
    const health = gold.bullet?.values?.find((v: any) => v.row === 'SacrificeTeamHealth');
    const pct = gold.bullet?.values?.find((v: any) => v.row === 'SacrificeStatsIncreasePercent');
    if (!health || health.value !== '500') throw new Error(`[Blackthorn/mốc6/health] hiện tại (${health?.value}) không khớp "500"`);
    if (!pct || pct.value !== '50%') throw new Error(`[Blackthorn/mốc6/pct] hiện tại (${pct?.value}) không khớp "50%"`);
    health.value = '550';
    pct.value = '60%';
    // "4 Piece Enhanced Effect: 25%->30%" — không tìm thấy field nào trong
    // breakpointDetails mốc 2/4 khớp giá trị 25% — BỎ QUA, không đoán field.
    await writeTrait('Blackthorn', details, 'mốc 6 — Enhanced Effect 50→60%, Teamwide Health 500→550');
  })();

  await (async () => {
    const [row] = await db.select().from(set18Traits).where(eq(set18Traits.name, 'Defender'));
    if (!row) throw new Error('Trait không tìm thấy: Defender');
    const details = row.breakpointDetails as any[];
    const gold = details.find((x) => x.threshold === '6');
    const v = gold?.bullet?.values?.find((x: any) => x.row === 'DefenderDefenseGain');
    if (!v || v.value !== '115') throw new Error(`[Defender/gold] hiện tại (${v?.value}) không khớp "115" (giá trị thật trong DB, ảnh gốc ghi nhầm 110)`);
    v.value = '120';
    await writeTrait('Defender', details, 'gold Resists 115→120, anchor thật khác "from" ảnh gốc 110');
  })();

  await (async () => {
    const [row] = await db.select().from(set18Traits).where(eq(set18Traits.name, 'Executioner'));
    if (!row) throw new Error('Trait không tìm thấy: Executioner');
    const details = row.breakpointDetails as any[];
    const gold = details.find((x) => x.threshold === '4');
    const v = gold?.bullet?.values?.find((x: any) => x.row === 'BonusBleedPercent');
    if (!v || v.value !== '50%') throw new Error(`[Executioner/gold] hiện tại (${v?.value}) không khớp "50%"`);
    v.value = '40%';
    await writeTrait('Executioner', details, 'gold Bonus Bleed 50→40%');
  })();

  await (async () => {
    const [row] = await db.select().from(set18Traits).where(eq(set18Traits.name, 'Invoker'));
    if (!row) throw new Error('Trait không tìm thấy: Invoker');
    const details = row.breakpointDetails as any[];
    const edits: [string, string, string][] = [['2', '2', '3'], ['3', '3', '4'], ['4', '5', '6'], ['5', '8', '9']];
    for (const [threshold, from, to] of edits) {
      const d = details.find((x) => x.threshold === threshold);
      const v = d?.bullet?.values?.find((x: any) => x.row === 'InvokerManaBonus');
      if (!v || v.value !== from) throw new Error(`[Invoker/mốc${threshold}] hiện tại (${v?.value}) không khớp "${from}"`);
      v.value = to;
    }
    await writeTrait('Invoker', details, 'Selfish Mana Regen 2/3/5/8 → 3/4/6/9');
  })();

  // Adaptor, Riftbeast: KHÔNG ghi (no-op thật sự) — DB đã ở đúng giá trị
  // "to" của patch (Adaptor gold=50%, Riftbeast mốc7=6%) từ trước khi patch
  // này ra, không phải bỏ sót.
  //
  // SKIP (không phải lệch số — breakpointDetails không có "bullet"/"values"
  // nào lưu khái niệm "Protector Enrage Heal Ratio" (Elderwood) hay "Phoenix
  // takedowns"/"Bear Execute threshold" (Primal) ở bất kỳ mốc nào — viết mới
  // vào đúng mốc nào (2 hay 4 cho Primal?) mà không có cách xác nhận rủi ro
  // cao hơn để trống, cần tác vụ soạn nội dung riêng).

  // ══════════════════════════ WISPS ══════════════════════════

  await updateWisp('Solar Gift', {
    // Patch "Cost: 5/2g -> 6/4g" — schema chỉ có 1 field `cost` (số nguyên),
    // khớp đúng "from"=5. Phần "2g/4g" (giá trị thứ 2) không có anchor trong
    // schema hiện tại — BỎ QUA phần đó.
    cost: [5, 6],
  });

  await updateWisp('Radiantize', {
    // "Upgrade Delay: 10/7 seconds -> 8/5 seconds" — DB thật: base=12 giây,
    // blossom upgrade=8 giây (không khớp "from" ảnh gốc 10/7). Tin "to" ảnh
    // gốc (8/5), map: base 12->8, blossom-upgrade 8->5.
    description: [['After 12 seconds,', 'After 8 seconds,']],
    descriptionVi: [['Sau 12 giây,', 'Sau 8 giây,']],
    blossomUpgradeDescriptionVi: [['Sau 8 giây,', 'Sau 5 giây,']],
  });

  // ══════════════════════════ AUGMENTS ══════════════════════════

  await updateAugment('augment:da_bronzeforlifei', {
    description: [['2% Damage Amp for each Bronze-tier trait.', '2.5% Damage Amp for each Bronze-tier trait.']],
    descriptionVi: [['2% Khuếch Đại Sát Thương cho mỗi tộc/hệ bậc Đồng.', '2.5% Khuếch Đại Sát Thương cho mỗi tộc/hệ bậc Đồng.']],
  });

  await updateAugment('augment:da_bronzeforlifeii', {
    description: [['2% Damage Amp and 4 Armor', '2.5% Damage Amp and 4 Armor']],
    descriptionVi: [['2% Khuếch Đại Sát Thương và 4 Giáp', '2.5% Khuếch Đại Sát Thương và 4 Giáp']],
  });

  await updateAugment('augment:da_componentquest', {
    // descriptionVi hiện ghi "nhận 1 Xẻng Vàng" — SAI/không khớp "8 gold"
    // gốc (lỗi dịch có sẵn từ trước, không liên quan patch này) — không sửa.
    description: [['Afterwards, gain 8 gold.', 'Afterwards, gain 5 gold.']],
  });

  await updateAugment('augment:da_doubletrouble', {
    description: [['gain 30% Attack Damage and Ability Power and 30 Armor, and Magic Resist', 'gain 25% Attack Damage and Ability Power and 25 Armor, and Magic Resist']],
    // descriptionVi không có số cho phần Kháng (bản dịch thiếu), chỉ sửa AD/AP.
    descriptionVi: [['được tăng 30% Sức Mạnh Công Kích, 30% Sức Mạnh Phép Thuật', 'được tăng 25% Sức Mạnh Công Kích, 25% Sức Mạnh Phép Thuật']],
  });

  await updateAugment('augment:da_18_infernotraitaugment', {
    description: [['gaining 40% Attack Speed', 'gaining 55% Attack Speed']],
    descriptionVi: [['nhận 40% Tốc Độ Đánh', 'nhận 55% Tốc Độ Đánh']],
  });

  await updateAugment('augment:da_18_fourcing', {
    description: [['your team gains 95 health', 'your team gains 120 health']],
    descriptionVi: [['đội của bạn nhận 95 máu', 'đội của bạn nhận 120 máu']],
  });

  await updateAugment('augment:da_itsmebaby', {
    description: [['drops 1 gold every 4 takedowns', 'drops 1 gold every 5 takedowns']],
    descriptionVi: [['drops 1 gold every 4 takedowns', 'drops 1 gold every 5 takedowns']], // VI hiện trùng hệt EN (chưa dịch)
  });

  for (const id of ['augment:da_nestingdolls', 'augment:da_nestingdollsplus', 'augment:da_nestingdollsplusplus']) {
    await updateAugment(id, {
      description: [['with 50% health', 'with 60% health']],
      descriptionVi: [['với 50% máu', 'với 60% máu']],
    });
  }

  await updateAugment('augment:da_shoppingspree', {
    description: [['Gain 2 gold.', 'Gain 6 gold.']],
    descriptionVi: [['Nhận 2 vàng.', 'Nhận 6 vàng.']],
  });

  await updateAugment('augment:da_smallfurryfriend', {
    description: [['second BFF summon that is 50% as powerful', 'second BFF summon that is 35% as powerful']],
    descriptionVi: [['thứ hai với sức mạnh bằng 50%', 'thứ hai với sức mạnh bằng 35%']],
  });

  await updateAugment('augment:da_verticalityiii', {
    // DB hiện ghi 4% (lệch nguyên 1 điểm % so với "from"=3% ảnh gốc, không
    // phải lệch nhỏ như các trường hợp khác — nghi ngờ ảnh thực ra áp cho
    // Verticality I/II). Theo chỉ đạo người dùng, vẫn ghi đè thẳng theo số
    // đích ảnh gốc (3.5%) thay vì bỏ qua.
    description: [['4% Attack Damage, 4% Ability Power, 4 Armor, and 4 Magic Resist', '3.5% Attack Damage, 3.5% Ability Power, 3.5 Armor, and 3.5 Magic Resist']],
    descriptionVi: [['4% Sức Mạnh Công Kích, 4% Sức Mạnh Phép Thuật, 4 Giáp và 4 Kháng Phép', '3.5% Sức Mạnh Công Kích, 3.5% Sức Mạnh Phép Thuật, 3.5 Giáp và 3.5 Kháng Phép']],
  });

  // ── Build a Bud — augment hoàn toàn mới, chưa từng có trong DB ──────
  // Insert mới theo yêu cầu người dùng. rarity/category là ĐOÁN (đã được
  // duyệt) — cần người dùng xác nhận lại + bổ sung icon thật sau.
  await (async () => {
    const id = 'augment:da_18_buildabud';
    const [existing] = await db.select().from(set18Augments).where(eq(set18Augments.id, id));
    if (existing) {
      console.log(`… augment ${id} đã tồn tại, bỏ qua insert`);
      return;
    }
    if (DRY_RUN) {
      console.log(`[DRY-RUN] augment ${id} — INSERT MỚI (rarity=Silver, description="Gain 6 gold."/"Nhận 6 vàng.", icon placeholder)`);
      return;
    }
    await db.insert(set18Augments).values({
      id,
      name: 'Build a Bud',
      nameVi: 'Build a Bud', // chưa có bản dịch — giữ nguyên tên gốc, cần bổ sung sau
      rarity: 'Silver', // ĐOÁN đã được người dùng duyệt — augment kinh tế sớm thường Silver, cần xác nhận lại
      rarityColor: '#477dcb', // màu Silver chuẩn theo các augment Silver khác trong DB
      category: 'Other',
      categoryVi: 'Khác',
      description: 'Gain 6 gold.', // CHỈ ghi đúng nội dung đã xác nhận (Initial Gold 3g->6g, giữ số ĐÍCH); mô tả đầy đủ cần bổ sung sau
      descriptionVi: 'Nhận 6 vàng.',
      icon: '/set18/assets/auguments/da_18_buildabud.png', // path placeholder theo quy ước đặt tên — ASSET THẬT CHƯA CHẮC TỒN TẠI, cần bổ sung
      associatedTraits: [],
      rounds: [],
      roundVariants: [],
      season: 18,
    });
    console.log(`✓ augment ${id} — INSERT MỚI (placeholder, cần bổ sung icon/rarity/description đầy đủ sau)`);
  })();

  // SKIP (không phải lệch số — cấu trúc DB không có field nào lưu khái niệm
  // này, viết bừa rủi ro cao hơn để trống):
  // - The Tower: description không có số Health theo giai đoạn (1000/1000/
  //   1400/2200/2800) — augment schema không có field mảng theo giai đoạn.
  // - Trait Ladder: description còn ghi "(đang được hoàn thiện)", dùng dấu
  //   "?" thay cho số — không có chỗ nào lưu từng mốc cụ thể trong patch.

  console.log('✓ Hoàn tất cập nhật champions/traits/wisps/augments cho 18.1ae (14/08).');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
