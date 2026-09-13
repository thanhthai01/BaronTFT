// Migration một lần cho bản LIVE 18.2 — cập nhật set18_champions/set18_traits/
// set18_augments/set18_wisps/set18_items. Nguồn: pbe-notes/Patch_TFT18.2-Live-main.md.
//
// Hỗ trợ --dry-run (log before/after, không ghi DB) — LUÔN chạy trước khi ghi thật.
//
// SKIP thật sự (không có anchor an toàn trong codex, xác nhận qua dump DB):
// - Brambleback Armor Ignore Base 10%→15%: không tìm thấy "10%" liên quan tới
//   armor ignore ở đâu trong ability text (chỉ có "30%" của hiệu ứng Active
//   khác — Ignore 30% Armor khi kích hoạt). Không suy diễn.
// - Taric Passive Shield 175/350+10%maxHP→100/225+15%maxHP: DB hiển thị tổng
//   "200/400" (đã gồm %HP tính sẵn ở mức tham chiếu nào đó không rõ) và calc
//   terms "12%/12%/100%" — không khớp cả từ lẫn công thức với patch note.
// - Kayle Wave Damage 40/40/40/50→35/35/35/45: DB ability text chỉ lưu MỘT
//   giá trị phẳng "40" cho toàn bộ 4 mốc thăng hoa (không phải mảng theo mốc),
//   không thể ánh xạ chính xác dãy 4 giá trị khác nhau vào 1 con số.
// - Fae Golden Pixie breakpoints (200k→170k...): không tồn tại trong bất kỳ
//   field nào của set18_traits (đã kiểm cả description/breakpointDetails/
//   breakpoints/subEffects/infoChips) — codex chưa từng lưu chi tiết mốc này.
// - Blackthorn base Health 175/300/550→175/350/600 (thưởng Máu khi có Gai Đen,
//   không phải máu hiến tế): tương tự, không có field nào lưu — breakpointDetails
//   của Blackthorn chỉ có các field liên quan tới hiến tế (TankSacrifice*,
//   ADSacrifice*, APSacrifice*), không có field cho bonus Máu cơ bản của trait.
//
// Các mục dưới đây có anchor lệch DB nhưng SUY RA được nguyên nhân (không phải
// bịa số):
// - Varus/Ancient Sentinel/Yunara: ability text hiển thị TOTAL đã tính sẵn
//   (calc terms + %HP hoặc AP khác), không phải số liệu AD/AP thô trong patch
//   note. Tính lại total theo đúng công thức hiện có trong calc, giữ nguyên
//   phần không đổi (vd giá trị 3-star nếu patch không nhắc).
// - Inferno: DB lưu HPBurnPerSecond ở 3 threshold rời rạc (2/5/7 = 1/3/3.5),
//   không phải mảng 4 phần tử — sửa trực tiếp từng threshold thay vì dùng
//   helper chung (giá trị lặp "1" ở threshold 2 và 3 gộp chung 1 con số).
import { eq } from 'drizzle-orm';
import { db } from '../../src/db/client';
import { set18Champions, set18Traits, set18Augments, set18Wisps, set18Items } from '../../src/db/schema';

const DRY_RUN = process.argv.includes('--dry-run');

type ChampionStats = Record<string, unknown> & {
  health?: number[];
  attackDamage?: number[];
  armor?: number;
  magicResist?: number;
  attackSpeed?: number;
};
type ChampionCalc = Record<string, unknown> & { id: string; terms: string; total: string };
type ChampionForm = Record<string, unknown> & {
  label?: string;
  mana?: string;
  abilityHtmlVi: string;
  stats?: ChampionStats;
  calcs?: ChampionCalc[];
};
type TraitBreakpoint = Record<string, unknown> & {
  threshold: string;
  bullet?: { values?: { row: string; value: string }[] };
};

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

type TextEdit = [string, string];

async function updateChampion(
  id: string,
  opts: {
    text?: TextEdit[];
    textEn?: TextEdit[];
    textVi?: TextEdit[];
    /** Chỉ áp cho abilityVi (plain) — KHÔNG đụng forms[].abilityHtmlVi. Dùng
     * khi bản HTML đã lệch sẵn khỏi bản plain (khác nội dung, cần formText
     * riêng cho HTML thay vì dùng chung anchor). */
    textViPlainOnly?: TextEdit[];
    formText?: { label: string; edits: TextEdit[] }[];
    mana?: [string, string];
    formMana?: { label: string; from: string; to: string }[];
    statArray?: { field: 'health' | 'attackDamage'; index: number; from: number[]; to: number }[];
    statScalar?: { field: 'armor' | 'magicResist' | 'attackSpeed'; from: number; to: number }[];
    calcEdits?: { calcId: string; terms?: TextEdit; total?: TextEdit }[];
  },
) {
  const [row] = await db.select().from(set18Champions).where(eq(set18Champions.id, id));
  if (!row) throw new Error(`Champion không tìm thấy: ${id}`);

  let ability = row.ability;
  let abilityVi = row.abilityVi;
  let mana = row.mana;
  const stats = JSON.parse(JSON.stringify(row.stats)) as ChampionStats;
  let forms = row.forms ? (JSON.parse(JSON.stringify(row.forms)) as ChampionForm[]) : null;

  for (const [from, to] of opts.text ?? []) {
    ability = replaceExact(ability, from, to, `${id}/ability`);
    abilityVi = replaceExact(abilityVi, from, to, `${id}/abilityVi`);
  }
  for (const [from, to] of opts.textEn ?? []) ability = replaceExact(ability, from, to, `${id}/ability`);
  for (const [from, to] of opts.textVi ?? []) abilityVi = replaceExact(abilityVi, from, to, `${id}/abilityVi`);
  for (const [from, to] of opts.textViPlainOnly ?? []) abilityVi = replaceExact(abilityVi, from, to, `${id}/abilityVi`);

  if (opts.mana) {
    const [from, to] = opts.mana;
    if (mana !== from) throw new Error(`[${id}/mana] hiện tại (${mana}) không khớp "from" (${from})`);
    mana = to;
  }

  for (const s of opts.statArray ?? []) {
    const cur = stats[s.field] as number[] | undefined;
    if (!cur) throw new Error(`[${id}/stats.${s.field}] không tồn tại`);
    if (!s.from.includes(cur[s.index]))
      throw new Error(`[${id}/stats.${s.field}[${s.index}]] hiện tại (${cur[s.index]}) không nằm trong "from" chấp nhận được (${s.from.join('|')})`);
    cur[s.index] = s.to;
  }
  for (const s of opts.statScalar ?? []) {
    if (stats[s.field] !== s.from) throw new Error(`[${id}/stats.${s.field}] hiện tại (${stats[s.field]}) không khớp "from" (${s.from})`);
    stats[s.field] = s.to;
  }

  if (forms) {
    forms = forms.map((f: ChampionForm) => {
      const next = { ...f };
      for (const [from, to] of [...(opts.text ?? []), ...(opts.textVi ?? [])]) {
        next.abilityHtmlVi = replaceExact(next.abilityHtmlVi, from, to, `${id}/forms[${f.label}]/abilityHtmlVi`);
      }
      for (const ft of opts.formText ?? []) {
        if (String(f.label) !== ft.label) continue;
        for (const [from, to] of ft.edits) {
          next.abilityHtmlVi = replaceExact(next.abilityHtmlVi, from, to, `${id}/forms[${f.label}]/abilityHtmlVi`);
        }
      }
      for (const fm of opts.formMana ?? []) {
        if (String(f.label) !== fm.label) continue;
        if (next.mana !== fm.from) throw new Error(`[${id}/forms[${f.label}]/mana] hiện tại (${next.mana}) không khớp "from" (${fm.from})`);
        next.mana = fm.to;
      }
      if (next.stats) {
        const st = JSON.parse(JSON.stringify(next.stats));
        for (const s of opts.statArray ?? []) {
          const cur = st[s.field] as number[] | undefined;
          if (!cur) continue;
          if (!s.from.includes(cur[s.index]))
            throw new Error(`[${id}/forms[${f.label}]/stats.${s.field}[${s.index}]] hiện tại (${cur[s.index]}) không nằm trong "from" chấp nhận được (${s.from.join('|')})`);
          cur[s.index] = s.to;
        }
        for (const s of opts.statScalar ?? []) {
          if (st[s.field] === undefined) continue;
          if (st[s.field] !== s.from) throw new Error(`[${id}/forms[${f.label}]/stats.${s.field}] hiện tại (${st[s.field]}) không khớp "from" (${s.from})`);
          st[s.field] = s.to;
        }
        next.stats = st;
      }
      if (next.calcs && (opts.calcEdits ?? []).length) {
        next.calcs = next.calcs.map((cc: ChampionCalc) => {
          const edit = (opts.calcEdits ?? []).find((e) => e.calcId === cc.id);
          if (!edit) return cc;
          const out = { ...cc };
          if (edit.terms) out.terms = replaceExact(out.terms, edit.terms[0], edit.terms[1], `${id}/calcs[${cc.id}]/terms`);
          if (edit.total) out.total = replaceExact(out.total, edit.total[0], edit.total[1], `${id}/calcs[${cc.id}]/total`);
          return out;
        });
      }
      return next;
    });
  }

  if (DRY_RUN) {
    console.log(`[DRY-RUN] champion ${id}`);
    diffLine('ability', row.ability, ability);
    diffLine('abilityVi', row.abilityVi, abilityVi);
    diffLine('mana', row.mana, mana);
    if (JSON.stringify(row.stats) !== JSON.stringify(stats)) console.log(`    stats: ${JSON.stringify(row.stats)}\n      -> ${JSON.stringify(stats)}`);
    const beforeForms = (row.forms as ChampionForm[] | null) ?? [];
    (forms ?? []).forEach((f: ChampionForm, i: number) => {
      const b = beforeForms[i] ?? {};
      diffLine(`forms[${i}:${f.label}].abilityHtmlVi`, b.abilityHtmlVi ?? '', f.abilityHtmlVi ?? '');
      if (b.mana !== f.mana) diffLine(`forms[${i}:${f.label}].mana`, b.mana ?? '', f.mana ?? '');
      if (JSON.stringify(b.stats) !== JSON.stringify(f.stats)) console.log(`    forms[${i}:${f.label}].stats: ${JSON.stringify(b.stats)}\n      -> ${JSON.stringify(f.stats)}`);
      if (JSON.stringify(b.calcs) !== JSON.stringify(f.calcs)) console.log(`    forms[${i}:${f.label}].calcs: ${JSON.stringify(b.calcs)}\n      -> ${JSON.stringify(f.calcs)}`);
    });
    return;
  }

  await db.update(set18Champions).set({ ability, abilityVi, mana, stats, forms, updatedAt: new Date() }).where(eq(set18Champions.id, id));
  console.log(`✓ champion ${id}`);
}

/** Ghi mới `subEffects` cho trait chưa từng lưu chi tiết mốc phụ (vd Golden
 *  Pixie của Fae) — field này CÓ render trên TraitCard (`trait.subEffects`),
 *  chỉ là trước giờ trait chưa có dữ liệu. Không phải sửa "from/to", là bổ
 *  sung nội dung hoàn toàn mới nên không assert. */
async function setTraitSubEffects(name: string, subEffects: { title?: string; items: { label: string; text: string }[] }) {
  const [row] = await db.select().from(set18Traits).where(eq(set18Traits.name, name));
  if (!row) throw new Error(`Trait không tìm thấy: ${name}`);
  if (DRY_RUN) {
    console.log(`[DRY-RUN] trait ${name} (subEffects — bổ sung mới)`);
    console.log('    ', JSON.stringify(row.subEffects), '->', JSON.stringify(subEffects));
    return;
  }
  await db.update(set18Traits).set({ subEffects, updatedAt: new Date() }).where(eq(set18Traits.name, name));
  console.log(`✓ trait ${name} (subEffects — bổ sung mới)`);
}

async function updateTraitDescription(name: string, edits: { description?: TextEdit[]; descriptionVi?: TextEdit[] }) {
  const [row] = await db.select().from(set18Traits).where(eq(set18Traits.name, name));
  if (!row) throw new Error(`Trait không tìm thấy: ${name}`);
  let description = row.description;
  let descriptionVi = row.descriptionVi;
  for (const [from, to] of edits.description ?? []) description = replaceExact(description, from, to, `${name}/description`);
  for (const [from, to] of edits.descriptionVi ?? []) descriptionVi = replaceExact(descriptionVi, from, to, `${name}/descriptionVi`);

  if (DRY_RUN) {
    console.log(`[DRY-RUN] trait ${name}`);
    diffLine('description', row.description, description);
    diffLine('descriptionVi', row.descriptionVi, descriptionVi);
    return;
  }
  await db.update(set18Traits).set({ description, descriptionVi, updatedAt: new Date() }).where(eq(set18Traits.name, name));
  console.log(`✓ trait ${name} (description)`);
}

async function updateTraitBreakpointValue(name: string, rowKey: string, from: string, to: string) {
  const [row] = await db.select().from(set18Traits).where(eq(set18Traits.name, name));
  if (!row) throw new Error(`Trait không tìm thấy: ${name}`);
  const details = JSON.parse(JSON.stringify(row.breakpointDetails)) as TraitBreakpoint[];

  let hits = 0;
  for (const bp of details) {
    for (const v of bp.bullet?.values ?? []) {
      if (v.row !== rowKey) continue;
      if (v.value !== from) throw new Error(`[${name}/${rowKey}@${bp.threshold}] hiện tại (${v.value}) không khớp "from" (${from})`);
      v.value = to;
      hits++;
    }
  }
  if (hits === 0) throw new Error(`[${name}/${rowKey}] không tìm thấy dòng nào để sửa`);

  if (DRY_RUN) {
    console.log(`[DRY-RUN] trait ${name} — ${rowKey}: ${from} -> ${to} (${hits} mốc)`);
    return;
  }
  await db.update(set18Traits).set({ breakpointDetails: details, updatedAt: new Date() }).where(eq(set18Traits.name, name));
  console.log(`✓ trait ${name} (${rowKey}: ${from} -> ${to}, ${hits} mốc)`);
}

/** Sửa 1 threshold cụ thể (khi cùng rowKey có nhiều giá trị khác nhau ở các
 *  threshold khác nhau — updateTraitBreakpointValue không xử lý được vì nó áp
 *  1 "from" cho MỌI threshold trùng rowKey). */
async function updateTraitBreakpointAtThreshold(name: string, threshold: string, rowKey: string, from: string, to: string) {
  const [row] = await db.select().from(set18Traits).where(eq(set18Traits.name, name));
  if (!row) throw new Error(`Trait không tìm thấy: ${name}`);
  const details = JSON.parse(JSON.stringify(row.breakpointDetails)) as TraitBreakpoint[];

  let hit = false;
  for (const bp of details) {
    if (bp.threshold !== threshold) continue;
    for (const v of bp.bullet?.values ?? []) {
      if (v.row !== rowKey) continue;
      if (v.value !== from) throw new Error(`[${name}/${rowKey}@${threshold}] hiện tại (${v.value}) không khớp "from" (${from})`);
      v.value = to;
      hit = true;
    }
  }
  if (!hit) throw new Error(`[${name}/${rowKey}@${threshold}] không tìm thấy`);

  if (DRY_RUN) {
    console.log(`[DRY-RUN] trait ${name} — ${rowKey}@${threshold}: ${from} -> ${to}`);
    return;
  }
  await db.update(set18Traits).set({ breakpointDetails: details, updatedAt: new Date() }).where(eq(set18Traits.name, name));
  console.log(`✓ trait ${name} (${rowKey}@${threshold}: ${from} -> ${to})`);
}

async function updateAugment(id: string, edits: { description?: TextEdit[]; descriptionVi?: TextEdit[]; nameVi?: [string, string] }) {
  const [row] = await db.select().from(set18Augments).where(eq(set18Augments.id, id));
  if (!row) throw new Error(`Augment không tìm thấy: ${id}`);
  let description = row.description;
  let descriptionVi = row.descriptionVi;
  let nameVi = row.nameVi;
  for (const [from, to] of edits.description ?? []) description = replaceExact(description, from, to, `${id}/description`);
  for (const [from, to] of edits.descriptionVi ?? []) descriptionVi = replaceExact(descriptionVi, from, to, `${id}/descriptionVi`);
  if (edits.nameVi) {
    const [from, to] = edits.nameVi;
    if (nameVi !== from) throw new Error(`[${id}/nameVi] hiện tại (${nameVi}) không khớp "from" (${from})`);
    nameVi = to;
  }

  if (DRY_RUN) {
    console.log(`[DRY-RUN] augment ${id}`);
    diffLine('description', row.description, description);
    diffLine('descriptionVi', row.descriptionVi, descriptionVi);
    diffLine('nameVi', row.nameVi, nameVi);
    return;
  }
  await db.update(set18Augments).set({ description, descriptionVi, nameVi, updatedAt: new Date() }).where(eq(set18Augments.id, id));
  console.log(`✓ augment ${id}`);
}

async function updateWisp(
  name: string,
  opts: {
    description?: TextEdit[];
    descriptionVi?: TextEdit[];
    cost?: [number, number];
    blossomUpgradeCost?: [number, number];
    nameVi?: [string, string];
    /** Ghi thẳng giá trị cuối (bỏ qua assert "from") — dùng khi cost hiện tại
     * trong DB (null hoặc số khác) không đáng tin, đã được người dùng xác
     * nhận trực tiếp ghi đè theo giá trị "to" cuối cùng của patch note. */
    forceCost?: number;
    forceBlossomUpgradeCost?: number;
  },
) {
  const [row] = await db.select().from(set18Wisps).where(eq(set18Wisps.name, name));
  if (!row) throw new Error(`Wisp không tìm thấy: ${name}`);

  let description = row.description;
  let descriptionVi = row.descriptionVi;
  let nameVi = row.nameVi;
  for (const [from, to] of opts.description ?? []) description = replaceExact(description, from, to, `${name}/description`);
  for (const [from, to] of opts.descriptionVi ?? []) descriptionVi = replaceExact(descriptionVi, from, to, `${name}/descriptionVi`);

  let cost = row.cost;
  if (opts.cost) {
    const [from, to] = opts.cost;
    if (cost !== from) throw new Error(`[${name}/cost] hiện tại (${cost}) không khớp "from" (${from})`);
    cost = to;
  }
  if (opts.forceCost !== undefined) cost = opts.forceCost;

  let blossomUpgradeCost = row.blossomUpgradeCost;
  if (opts.blossomUpgradeCost) {
    const [from, to] = opts.blossomUpgradeCost;
    if (blossomUpgradeCost !== from) throw new Error(`[${name}/blossomUpgradeCost] hiện tại (${blossomUpgradeCost}) không khớp "from" (${from})`);
    blossomUpgradeCost = to;
  }
  if (opts.forceBlossomUpgradeCost !== undefined) blossomUpgradeCost = opts.forceBlossomUpgradeCost;

  if (opts.nameVi) {
    const [from, to] = opts.nameVi;
    if (nameVi !== from) throw new Error(`[${name}/nameVi] hiện tại (${nameVi}) không khớp "from" (${from})`);
    nameVi = to;
  }

  if (DRY_RUN) {
    console.log(`[DRY-RUN] wisp ${name}`);
    diffLine('description', row.description, description);
    diffLine('descriptionVi', row.descriptionVi, descriptionVi);
    diffLine('nameVi', row.nameVi, nameVi);
    if (row.cost !== cost) diffLine('cost', String(row.cost), String(cost));
    if (row.blossomUpgradeCost !== blossomUpgradeCost) diffLine('blossomUpgradeCost', String(row.blossomUpgradeCost), String(blossomUpgradeCost));
    return;
  }

  await db
    .update(set18Wisps)
    .set({
      description,
      descriptionVi,
      nameVi,
      ...(opts.cost || opts.forceCost !== undefined ? { cost } : {}),
      ...(opts.blossomUpgradeCost || opts.forceBlossomUpgradeCost !== undefined ? { blossomUpgradeCost } : {}),
      updatedAt: new Date(),
    })
    .where(eq(set18Wisps.name, name));
  console.log(`✓ wisp ${name}`);
}

async function setWispVisibility(name: string, visible: boolean) {
  const [row] = await db.select().from(set18Wisps).where(eq(set18Wisps.name, name));
  if (!row) throw new Error(`Wisp không tìm thấy: ${name}`);
  if (DRY_RUN) {
    console.log(`[DRY-RUN] wisp ${name} (${row.nameVi})`);
    diffLine('visible', String(row.visible), String(visible));
    return;
  }
  await db.update(set18Wisps).set({ visible, updatedAt: new Date() }).where(eq(set18Wisps.name, name));
  console.log(`✓ wisp ${name} (visible: ${row.visible} -> ${visible})`);
}

async function updateItem(name: string, opts: { description?: TextEdit[]; descriptionVi?: TextEdit[]; statBadges?: { stat: string; value: string }[] }) {
  const [row] = await db.select().from(set18Items).where(eq(set18Items.name, name));
  if (!row) throw new Error(`Item không tìm thấy: ${name}`);
  let description = row.description;
  let descriptionVi = row.descriptionVi;
  for (const [from, to] of opts.description ?? []) description = replaceExact(description, from, to, `${name}/description`);
  for (const [from, to] of opts.descriptionVi ?? []) descriptionVi = replaceExact(descriptionVi, from, to, `${name}/descriptionVi`);

  if (DRY_RUN) {
    console.log(`[DRY-RUN] item ${name}`);
    diffLine('description', row.description, description);
    diffLine('descriptionVi', row.descriptionVi, descriptionVi);
    if (opts.statBadges) console.log('    statBadges ->', JSON.stringify(opts.statBadges));
    return;
  }
  await db
    .update(set18Items)
    .set({ description, descriptionVi, ...(opts.statBadges ? { statBadges: opts.statBadges } : {}), updatedAt: new Date() })
    .where(eq(set18Items.name, name));
  console.log(`✓ item ${name}`);
}

async function main() {
  console.log(DRY_RUN ? '=== DRY RUN — không ghi DB ===\n' : '=== GHI DB THẬT ===\n');

  // ── Tướng ───────────────────────────────────────────────────────
  await updateChampion('champion:tft18_akali', {
    mana: ['0 / 30', '0 / 25'],
    formMana: [{ label: 'AD', from: '0 / 30', to: '0 / 25' }],
  });
  await updateChampion('champion:tft18_leona', {
    mana: ['40 / 100', '30 / 90'],
    text: [['60/70/80', '60/80/100']],
  });
  await updateChampion('champion:tft18_varus', {
    text: [['415/625/995', '445/670/1070']],
    calcEdits: [{ calcId: 'varus:mac-inh:calc-1', terms: ['385/580/925', '415/625/1000'], total: ['415/625/995', '445/670/1070'] }],
  });
  await updateChampion('champion:tft18_veigar', {
    textEn: [['1.5% Ability Power', '3% Ability Power']],
    textVi: [['1.5', '3']],
  });
  await updateChampion('champion:tft18_leblanc', {
    text: [
      ['250/375/565', '260/390/615'],
      ['85/130/190', '100/150/230'],
    ],
  });
  // Kayle Wave Damage: DB chỉ lưu 1 số phẳng "40" cho toàn bộ 4 mốc Thăng Hoa.
  // Theo yêu cầu người dùng: viết lại thành dãy 4 giá trị đầy đủ khớp patch
  // (35/35/35/45) thay vì giữ 1 số duy nhất.
  await updateChampion('champion:tft18_kayle', {
    text: [['56/84', '62/92']],
    textEn: [['40 magic damage to all other units hit', '35/35/35/45 magic damage to all other units hit']],
    textViPlainOnly: [
      ['gây 40 sát thương phép lên tất cả các đơn vị khác trúng đòn', 'gây 35/35/35/45 sát thương phép lên tất cả các đơn vị khác trúng đòn'],
    ],
    formText: [
      {
        label: 'Mặc định',
        edits: [
          [
            '<span class="s18-value s18-style-colorMagic"><span class="s18-icon s18-icon-icon_ap"></span>40</span> sát thương phép lên tất cả các đơn vị khác trúng đòn',
            '<span class="s18-value s18-style-colorMagic"><span class="s18-icon s18-icon-icon_ap"></span>35/35/35/45</span> sát thương phép lên tất cả các đơn vị khác trúng đòn',
          ],
        ],
      },
    ],
  });
  await updateChampion('champion:tft18_shen', { text: [['325/400/500', '350/430/550']] });
  await updateChampion('champion:tft18_warwick', { statArray: [{ field: 'attackDamage', index: 0, from: [40], to: 45 }] });
  await updateChampion('champion:tft18_yunara', {
    text: [['150/225/335', '160/240/370']],
    calcEdits: [{ calcId: 'yunara:mac-inh:calc-1', total: ['150/225/335', '160/240/370'] }],
  });
  await updateChampion('champion:tft18_azir', { text: [['40/60/96', '43/65/103']] });
  await updateChampion('champion:tft18_diana', {
    text: [
      ['70/105/170', '75/115/180'],
      ['150/275/400', '150/275/500'],
    ],
  });
  await updateChampion('champion:tft18_khazix', { statArray: [{ field: 'attackDamage', index: 0, from: [30], to: 40 }] });
  await updateChampion('champion:tft18_raptor', {
    statArray: [{ field: 'attackDamage', index: 0, from: [50], to: 55 }],
    text: [['20/30/48', '22/33/48']],
  });
  await updateChampion('champion:tft18_masteryi', {
    statArray: [{ field: 'attackDamage', index: 0, from: [65], to: 60 }],
    formText: [{ label: 'AP', edits: [['140/210/335', '125/190/285']] }],
  });
  await updateChampion('champion:tft18_rengar', { statScalar: [{ field: 'attackSpeed', from: 0.8, to: 0.75 }] });
  await updateChampion('champion:tft18_ahri', {
    text: [['425/640', '455/685']],
    textEn: [['20% per hex', '21% per hex']],
    textVi: [['20%', '21%']],
  });
  await updateChampion('champion:tft18_ancientsentinel', {
    text: [['530/630/2130', '480/580/2130']],
    calcEdits: [{ calcId: 'ancient-sentinel:mac-inh:calc-1', terms: ['400/500/2000', '350/450/2000'], total: ['530/630/2130', '480/580/2130'] }],
  });
  await updateChampion('champion:tft18_brambleback', {
    statArray: [{ field: 'attackDamage', index: 0, from: [115], to: 120 }],
    text: [['170/255/600', '155/235/600']],
  });
  await updateChampion('champion:tft18_ezreal', { text: [['235/355', '250/375']] });
  await updateChampion('champion:tft18_nidalee', { formText: [{ label: 'AP', edits: [['285/425', '300/450']] }] });
  await updateChampion('champion:tft18_zyra', { text: [['37/55', '35/53']] });
  await updateChampion('champion:tft18_ashe', {
    text: [['440/660/1000', '465/700/1000']],
  });
  // Ivern Ability Damage: DB hiện là 160/240 (không khớp "from" 140/210 của
  // patch — có thể lệch từ 3 lượt vá trước: 18.1ab/18.1af/18.1y). Theo yêu
  // cầu người dùng: ghi thẳng DB cho khớp với patch — đổi 160/240 (giá trị
  // thật hiện tại) sang 155/235 (giá trị "to" chính thức của patch note).
  await updateChampion('champion:tft18_ivern', {
    text: [
      ['165/300/3000', '185/350/3000'],
      ['160/240/2000', '155/235/2000'],
    ],
  });
  await updateChampion('champion:tft18_lux', {
    text: [
      ['355/550', '375/565'],
      ['5000', '6500'],
    ],
  });
  await updateChampion('champion:tft18_maokai', { mana: ['40 / 100', '30 / 90'] });
  // ability/abilityVi (plain) đều ghi 200/300 khớp patch (Active Heal), nhưng
  // bản HTML forms[Mặc định].abilityHtmlVi lệch riêng thành 225/325 (lỗi có
  // sẵn, không liên quan bản vá này) — sửa cả hai nơi về cùng "to" 250/375.
  //
  // Passive Shield: patch ghi công thức "175/350 + 10% max HP ⇒ 100/225 +
  // 15% max HP", nhưng DB không lưu công thức này — total hiển thị sẵn
  // "200/400/11300" qua calc "12%/12%/100% × Health" không khớp cách tính
  // của patch (175+10%×1300=305≠200). Theo yêu cầu người dùng "sửa ở mọi
  // nơi cho phù hợp với patch": tính lại total bằng chính công thức patch
  // nêu + Máu thật của Taric (1300/2340/4212), CHỈ cho mốc 1-2 sao (patch
  // không cho số 3 sao, giữ nguyên 11300 theo tiền lệ không suy diễn):
  //   1★: 100 + 15%×1300 = 295 · 2★: 225 + 15%×2340 = 576
  // Calc terms cũng đổi hệ số hiển thị 12%→15% (mốc 3 giữ "100%").
  await updateChampion('champion:tft18_taric', {
    // Shield: "200/400/11300" giống hệt nhau ở cả 3 nơi (ability EN, abilityVi
    // plain, forms.abilityHtmlVi) -> dùng `text` chung 1 lần.
    text: [['200/400/11300', '295/576/11300']],
    // Heal: EN/VI-plain đều "200/300" nhưng forms.abilityHtmlVi lệch riêng
    // "225/325" (lỗi có sẵn) -> tách textEn/textViPlainOnly + formText riêng.
    textEn: [['200/300/3000', '250/375/3000']],
    textViPlainOnly: [['200/300/3000', '250/375/3000']],
    formText: [{ label: 'Mặc định', edits: [['225/325/3000', '250/375/3000']] }],
    calcEdits: [{ calcId: 'taric:mac-inh:calc-1', terms: ['12%/12%/100%', '15%/15%/100%'], total: ['200/400/11300', '295/576/11300'] }],
  });
  // Gnar: cả 3 thay đổi đều chỉ ở mốc 3 sao (giá trị cuối của mỗi mảng). "5"
  // xuất hiện 2 lần trong HTML (mỗi số bọc span riêng: "mỗi giây" và "mỗi đòn
  // đánh") nên phải nhắm đúng đoạn HTML có "đòn đánh" qua formText.
  await updateChampion('champion:tft18_gnar', {
    text: [
      ['15/20/100', '15/20/250'],
      ['400/600/10000', '400/600/15000'],
    ],
    textEn: [['5 Rage per attack', '20 Rage per attack']],
    textViPlainOnly: [['5 Nộ mỗi đòn đánh', '20 Nộ mỗi đòn đánh']],
    formText: [{ label: 'Mặc định', edits: [['<span class="s18-value">5</span> Nộ mỗi đòn đánh', '<span class="s18-value">20</span> Nộ mỗi đòn đánh']] }],
  });

  // ── Tộc Hệ ──────────────────────────────────────────────────────
  await updateTraitBreakpointValue('Blackthorn', 'TankSacrificeResistBonus', '15', '12');
  await updateTraitBreakpointValue('Blackthorn', 'ADSacrificeASBonus', '12%', '14%');
  await updateTraitBreakpointValue('Blackthorn', 'APSacrificeManaRegenBonus', '1.7', '2');

  await updateTraitBreakpointAtThreshold('Inferno', '5', 'HPBurnPerSecond', '3', '3.5');
  await updateTraitBreakpointAtThreshold('Inferno', '7', 'HPBurnPerSecond', '3.5', '4.5');

  await updateTraitBreakpointAtThreshold('Rapidfire', '4', 'ASPerAttack', '9%', '8%');
  await updateTraitBreakpointAtThreshold('Rapidfire', '5', 'ASPerAttack', '15%', '12%');

  await updateTraitDescription('Solar', {
    description: [
      ['deal 7% bonus magic damage', 'deal 8% bonus magic damage'],
      ['18% and 15', '15% and 12'],
    ],
    descriptionVi: [['gây 7% sát thương phép cộng thêm', 'gây 8% sát thương phép cộng thêm']],
  });
  await updateTraitDescription('Solar', {
    description: [['Increase shield and magic damage by 1.5% for each 3-star', 'Increase shield and magic damage by 1% for each 3-star']],
    descriptionVi: [['tăng thêm 1.5% với mỗi tướng 3 sao khác nhau', 'tăng thêm 1% với mỗi tướng 3 sao khác nhau']],
  });

  await updateTraitDescription('Hunter', {
    description: [["hasn't swapped targets for 4 seconds", "hasn't swapped targets for 3 seconds"]],
    descriptionVi: [['không đổi mục tiêu trong 4 giây', 'không đổi mục tiêu trong 3 giây']],
  });

  // Fae — Golden Pixie breakpoints: đã kiểm không tồn tại ở bất kỳ field nào
  // (description/breakpointDetails/breakpoints/subEffects/infoChips đều
  // trống). `subEffects` CÓ được TraitCard.tsx render (dòng 158-170) nên là
  // chỗ đúng để bổ sung — ghi mới 6 mốc theo giá trị ĐÃ VÁ (18.2), vì đây là
  // nội dung lần đầu được thêm, không phải sửa from/to.
  await setTraitSubEffects('Fae', {
    title: 'Mốc Pix Hoàng Kim',
    items: [
      { label: 'Mốc 1', text: '170.000' },
      { label: 'Mốc 2', text: '200.000' },
      { label: 'Mốc 3', text: '300.000' },
      { label: 'Mốc 4', text: '400.000' },
      { label: 'Mốc 5', text: '500.000' },
      { label: 'Mốc 6', text: '600.000' },
    ],
  });

  // Blackthorn — Máu cơ bản (bonus trait) 175/300/550→175/350/600: đã kiểm
  // lại kỹ (breakpointDetails/breakpoints/subEffects/infoChips/description
  // đều không có field cho bonus Máu cơ bản, chỉ có các field liên quan hiến
  // tế TankSacrifice*/ADSacrifice*/APSacrifice*) — xác nhận SKIP như dự tính.

  // ── Nâng Cấp ────────────────────────────────────────────────────
  await updateAugment('augment:da_dummify', {
    description: [['1000 Health per stage', '1150 Health per stage']],
    descriptionVi: [['1000 Máu mỗi giai đoạn', '1150 Máu mỗi giai đoạn']],
  });
  // Unrivaled nameVi sai lệch (đã duyệt): "Hóa Thù Thành Bạn" -> "Không Đối Thủ"
  await updateAugment('augment:da_18_rivalsaugment', { nameVi: ['Hóa Thù Thành Bạn', 'Không Đối Thủ'] });
  await updateAugment('augment:da_18_rivalsaugmentplus', { nameVi: ['Hóa Thù Thành Bạn', 'Không Đối Thủ'] });

  // ── Tinh Linh — 1 call/wisp, gộp cả nameVi + cost + description ────
  // Barrier: DB hiện là 5 (không khớp "from" 4 — có thể trôi giá từ 18.1ac).
  // Theo yêu cầu người dùng: ghi thẳng về giá trị patch note cuối cùng (3).
  await updateWisp('Barrier', { forceCost: 3 });
  await updateWisp('Backrow Star', { cost: [3, 1] });
  await updateWisp("Bunch-o'-Belts", { cost: [2, 1] });
  await updateWisp('Combust', {
    cost: [5, 3],
    description: [['15% Max Health', '12% Max Health']],
    descriptionVi: [['15% Máu Tối Đa', '12% Máu Tối Đa']],
  });
  await updateWisp('Downpour', { cost: [3, 2] });
  await updateWisp('Infliction', { cost: [6, 4] });
  await updateWisp('Ironwood', { cost: [3, 2] });
  // Late Bloomer: DB cost=null — ghi thẳng giá trị "to" cuối cùng (4).
  await updateWisp('Late Bloomer', { forceCost: 4 });
  await updateWisp('Lightning Storm', { cost: [5, 3] });
  await updateWisp('Lightning Strike', { cost: [2, 1] });
  await updateWisp('Blaze', { cost: [5, 3] });
  await updateWisp('Fellowship', { cost: [4, 3] });
  await updateWisp("Giant's Aura", { cost: [5, 3] });
  await updateWisp("Hero's Entrance", { cost: [4, 2] });
  // Hireling: DB cost=null — ghi thẳng giá trị "to" cuối cùng (2).
  await updateWisp('Hireling', { forceCost: 2 });
  await updateWisp('Iron Core', { cost: [2, 1] });
  await updateWisp('Killing Frenzy', { cost: [3, 2] });
  await updateWisp("Killer's Regret", { cost: [2, 1] });
  await updateWisp('Mana-Rich Soil', { cost: [3, 2] });
  await updateWisp('Petrify Shields', { cost: [2, 1] });
  // Potted Stonebark/Lifebloom: patch "2v/1v ⇒ 1v/0v" — cả cost (base) VÀ
  // blossomUpgradeCost (mốc nâng cấp) đều đổi.
  await updateWisp('Potted Stonebark', { cost: [2, 1], blossomUpgradeCost: [1, 0] });
  await updateWisp('Potted Lifebloom', { cost: [2, 1], blossomUpgradeCost: [1, 0] });
  await updateWisp('Phantom Emblem', { cost: [3, 2] });
  await updateWisp('Radiantize', { cost: [4, 3] });
  await updateWisp('Revenge', { cost: [3, 2] });
  await updateWisp("Solitude's Cloak", { cost: [3, 2] });
  await updateWisp('Stand Alone', { cost: [3, 2] });
  await updateWisp('Supercritical', { cost: [3, 2] });
  await updateWisp('Treetop Archers', { cost: [5, 3] });
  await updateWisp('Tremors', { cost: [4, 3] });
  await updateWisp('Yordle Spirit', { cost: [3, 2] });

  await updateWisp('Cutpurse', {
    nameVi: ['Thịnh Vượng Muôn Năm', 'Móc Túi'],
    cost: [3, 2],
    description: [['a 15% chance', 'a 20% chance']],
  });
  await updateWisp('Good Loss', { cost: [5, 4] });
  await updateWisp('Payday', { nameVi: ['Điểm Thưởng Bùng Nổ', 'Hoàn Tất Phi Vụ'], cost: [4, 3] });
  await updateWisp('Slow Study', { nameVi: ['Giữ Để Học', 'Học Chậm'], cost: [4, 2] });

  // All Fives / All Fours: giá đơn, DB cost=null — ghi thẳng "to".
  await updateWisp('All Fives', { forceCost: 8 });
  await updateWisp('All Fours', { forceCost: 3 });
  // Border Village / Middle Path / Starting Town: giá 2 mốc "X/Y", DB
  // cost=null — quy ước như Smurfing: mốc CAO hơn (giá gốc) -> `cost`, mốc
  // THẤP hơn (giá khi nâng cấp Hoa Linh) -> `blossomUpgradeCost`.
  await updateWisp('Border Village', { forceCost: 3, forceBlossomUpgradeCost: 2 });
  await updateWisp('Starting Town', { forceCost: 2, forceBlossomUpgradeCost: 1 });

  await updateWisp('Field of Mice', { nameVi: ['Đội Quân 1 Vàng', 'Chuột Nhắt Lan Tràn'] });
  await setWispVisibility('Field of Mice', false);
  await updateWisp('Flash Fire', { cost: [2, 1] });
  await updateWisp('Middle Path', { nameVi: ['Quận Trung Tâm', 'Chơi Đường Giữa'], forceCost: 4, forceBlossomUpgradeCost: 3 });
  await updateWisp('Roly-Polys', { nameVi: ['Giữ Để Đổi Lại', 'Càng Đông Càng Vui'], cost: [4, 3] });
  // Search Party: cost=3 khớp "from" mốc 1 (3->1). blossomUpgradeCost hiện
  // null trong khi patch có mốc 2 (1->0) — ghi thẳng.
  await updateWisp('Search Party', { nameVi: ['Lựa Và Chọn', 'Tổ Đội Tìm Kiếm'], cost: [3, 1], forceBlossomUpgradeCost: 0 });

  await updateWisp('Potioncraft', { cost: [3, 2] });
  // Smurfing: cost (base)=null, blossomUpgradeCost=6 (khớp mốc thứ 2 "6g").
  // Theo giải thích người dùng: mốc cao hơn (7) = giá gốc -> cost; mốc thấp
  // hơn (6) = giá khi nâng cấp Hoa Linh -> blossomUpgradeCost. Patch: 7/6 ⇒
  // 6/5 — ghi thẳng cost=6 (to của mốc gốc), blossomUpgradeCost 6->5 (assert
  // sạch vì DB đang đúng 6).
  await updateWisp('Smurfing', { forceCost: 6, blossomUpgradeCost: [6, 5] });

  // ── Trang Bị / Tạo Tác / Ấn ─────────────────────────────────────
  // Blighting Jewel: description DB ghi sai "reduces Magic Resist by 6"
  // (không phải 4 như patch "from"). Theo yêu cầu người dùng: sửa về đúng
  // baseline patch nêu rồi áp luôn nerf của bản này — ghi thẳng "by 3" (kết
  // quả cuối cùng sau patch, tương đương sửa 6->4 rồi áp 4->3).
  await updateItem('Blighting Jewel', {
    description: [["reduces the target’s Magic Resist by 6", "reduces the target’s Magic Resist by 3"]],
    descriptionVi: [['giảm Kháng Phép của mục tiêu đi 6', 'giảm Kháng Phép của mục tiêu đi 3']],
  });
  await updateItem('Forbidden Idol', { statBadges: [{ stat: 'health', value: '500' }, { stat: 'manaregen', value: '2' }] });
  await updateItem("Luden's Tempest", {
    description: [['plus 100 is dealt', 'plus 130 is dealt']],
    descriptionVi: [['+ 100 sẽ được gây', '+ 130 sẽ được gây']],
  });
  await updateItem('Flickerblades', {
    description: [['grant 5% stacking Attack Speed', 'grant 4% stacking Attack Speed']],
    descriptionVi: [['cho 5% Tốc Độ Đánh cộng dồn', 'cho 4% Tốc Độ Đánh cộng dồn']],
  });
  await updateItem('Silvermere Dawn', { statBadges: [{ stat: 'ad', value: '150%' }, { stat: 'armor', value: '30' }, { stat: 'mr', value: '30' }, { stat: 'omnivamp', value: '30%' }] });
  await updateItem("Wit's End", {
    description: [['30/55/75/95/115', '25/45/65/85/100']],
    descriptionVi: [['30/55/75/95/115', '25/45/65/85/100']],
  });
  await updateItem('Bloodthirster', {
    description: [
      ['at 40% Health', 'at 50% Health'],
      ['25% max Health Shield', '30% max Health Shield'],
    ],
    descriptionVi: [
      ['khi còn 40% Máu', 'khi còn 50% Máu'],
      ['25% Máu tối đa', '30% Máu tối đa'],
    ],
    statBadges: [{ stat: 'ad', value: '18%' }, { stat: 'ap', value: '18' }, { stat: 'mr', value: '20' }, { stat: 'omnivamp', value: '20%' }],
  });
  await updateItem('Radiant Bloodthirster', {
    description: [
      ['40%', '50%'],
      ['50% max Health Shield', '60% max Health Shield'],
    ],
    descriptionVi: [
      ['khi còn 40% Máu', 'khi còn 50% Máu'],
      ['50% Máu tối đa', '60% Máu tối đa'],
    ],
    statBadges: [{ stat: 'ad', value: '40%' }, { stat: 'ap', value: '40' }, { stat: 'mr', value: '40' }, { stat: 'omnivamp', value: '40%' }],
  });
  await updateItem('Edge of Night', {
    description: [
      ['At 60% Health', 'At 40% Health'],
      ['heal 20% missing health', 'heal 15% missing health'],
    ],
    descriptionVi: [
      ['60% Máu, trở nên', '40% Máu, trở nên'],
      ['hồi lại 20% Máu đã mất', 'hồi lại 15% Máu đã mất'],
    ],
  });
  await updateItem('Radiant Edge of Night', {
    description: [['At 60% Health', 'At 40% Health']],
    descriptionVi: [['Khi còn 60% Máu', 'Khi còn 40% Máu']],
  });
  await updateItem('Hand Of Justice', {
    description: [
      ['15% Attack Damage and 15% Ability Power', '18% Attack Damage and 18% Ability Power'],
      ['12% Omnivamp', '15% Omnivamp'],
    ],
    descriptionVi: [
      ['15% Sức Mạnh Công Kích và 15% Sức Mạnh Phép Thuật', '18% Sức Mạnh Công Kích và 18% Sức Mạnh Phép Thuật'],
      ['12% Hút Máu Toàn Phần', '15% Hút Máu Toàn Phần'],
    ],
  });
  await updateItem('Radiant Hand of Justice', {
    description: [['24% Omnivamp', '30% Omnivamp']],
    descriptionVi: [['24% Hút Máu Toàn Phần', '30% Hút Máu Toàn Phần']],
  });
  await updateItem('Brawler Emblem', { statBadges: [{ stat: 'health', value: '150' }] });
  await updateItem('Fae Emblem', { statBadges: [{ stat: 'health', value: '200' }, { stat: 'ad', value: '10%' }, { stat: 'ap', value: '10%' }] });
  await updateItem('Hunter Emblem', { statBadges: [{ stat: 'ad', value: '25%' }] });
  await updateItem('Invoker Emblem', {
    description: [['equal to 10% of Mana spent', 'equal to 8% of Mana spent']],
    descriptionVi: [['tương đương 10% Năng Lượng tiêu hao', 'tương đương 8% Năng Lượng tiêu hao']],
  });
  await updateItem('Juggernaut Emblem', { statBadges: [{ stat: 'health', value: '250' }] });
  // Primal Emblem: statBadges DB ghi sai "as":"15%" (không khớp "from" 25%
  // của patch). Theo yêu cầu người dùng: ghi thẳng giá trị "to" cuối cùng (35%).
  await updateItem('Primal Emblem', { statBadges: [{ stat: 'as', value: '35%' }, { stat: 'health', value: '250' }, { stat: 'critchance', value: '20%' }] });
  await updateItem('Sprykin Emblem', {
    description: [['30% 20 20', '20% 15 15']],
    descriptionVi: [],
    statBadges: [{ stat: 'as', value: '20%' }, { stat: 'armor', value: '15' }, { stat: 'mr', value: '15' }],
  });
  await updateItem('Vanguard Emblem', { statBadges: [{ stat: 'armor', value: '25' }, { stat: 'mr', value: '25' }] });

  console.log(DRY_RUN ? '\n=== DRY RUN xong — chưa ghi gì ===' : '\n=== Đã ghi DB xong ===');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
