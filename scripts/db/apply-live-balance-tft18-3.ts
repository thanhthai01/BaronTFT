// Migration một lần cho bản LIVE 18.3 — cập nhật set18_champions/set18_traits/
// set18_augments/set18_wisps/set18_items. Nguồn: pbe-notes/Patch_TFT18.3-Live-main.md.
//
// Hỗ trợ --dry-run (log before/after, không ghi DB) — LUÔN chạy trước khi ghi thật.
//
// SKIP thật sự (không có anchor an toàn trong codex, xác nhận qua dump DB đầy
// đủ kể cả field ẩn calcs/infoChips/subEffects — xem pbe-notes/Patch_TFT18.3-skipped-items.md):
// (không còn mục nào — toàn bộ 7 điểm nghi vấn ban đầu đã được người dùng
// quyết định ghi đè trực tiếp theo patch, xem ghi chú "GHI ĐÈ THEO PATCH" bên dưới)
//
// GHI ĐÈ THEO PATCH (người dùng xác nhận: DB phần lớn là dữ liệu PBE cũ, patch
// LIVE là nguồn đúng hiện tại — ghi thẳng giá trị "to" của patch, không giữ
// assert khớp "from"):
// - Rammus Shield: DB "325/400/500" không khớp "from" 350/450/550 của patch —
//   ghi thẳng "400/550/725" (giá trị "to").
// - Alistar Heal: DB lưu công thức "1 + 8%×Máu tối đa" (số "1" là base bị lỗi
//   hiển thị, không phải mảng thật) — sửa base thành "230/300/400" (đúng "to"
//   patch), tính lại total = base + 8%×[950,1710,3078] = 306/436/646.
// - Ornn Forge Power Bonus 3★: text gốc chỉ ghi "doubled" (gấp đôi = +100%),
//   đổi thành "increased by 85%"/"tăng 85%" theo đúng "to" của patch.
// - Coven Essence Per Loss (mốc threshold=4): DB thật là 22 (không phải 25 như
//   "from" patch nêu) — ghi thẳng thành 28 (giá trị "to" tương ứng vị trí thứ
//   2 trong dãy patch 18/25/32/60⇒22/28/35/60).
// - Hunter Emblem AD Per Takedown: description DB ghi "12%" (không khớp "from"
//   18% của patch) — ghi thẳng thành "15%" (giá trị "to").
// - Lux Solar Bonus: tìm thấy đúng trong form "Mặt Trời" của CHÍNH Lux (không
//   phải trait Solar chung) — dòng "Suy Yếu kẻ địch trúng đòn đi 12% trong 6
//   giây" — sửa 12→15.
//
// Các mục có anchor lệch nhưng SUY RA được nguyên nhân (không phải bịa số):
// - Taric Passive Shield: calc.terms chỉ hiện hệ số "%Máu tối đa" (15%/15%/100%),
//   không hiện base flat. Giải ngược từ total hiện tại (295/576/11300) và
//   Máu tối đa [1300,2340,4212]: base 1★=100, 2★=225 — khớp CHÍNH XÁC "from"
//   patch (100/225)! Tính lại theo "to" (75/150): total mới = 75+15%×1300=270,
//   150+15%×2340=501. Mốc 3★ giữ nguyên (patch không nhắc).
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

/** Ghi thẳng giá trị "to" bỏ qua assert "from" — dùng khi người dùng đã xác
 *  nhận trực tiếp là DB đang lệch (dữ liệu PBE cũ) và patch LIVE là nguồn
 *  đúng hiện tại (vd Coven threshold=4: DB thật 22, không phải 25 patch nêu). */
async function forceTraitBreakpointAtThreshold(name: string, threshold: string, rowKey: string, to: string) {
  const [row] = await db.select().from(set18Traits).where(eq(set18Traits.name, name));
  if (!row) throw new Error(`Trait không tìm thấy: ${name}`);
  const details = JSON.parse(JSON.stringify(row.breakpointDetails)) as TraitBreakpoint[];

  let hit = false;
  let before = '';
  for (const bp of details) {
    if (bp.threshold !== threshold) continue;
    for (const v of bp.bullet?.values ?? []) {
      if (v.row !== rowKey) continue;
      before = v.value;
      v.value = to;
      hit = true;
    }
  }
  if (!hit) throw new Error(`[${name}/${rowKey}@${threshold}] không tìm thấy`);

  if (DRY_RUN) {
    console.log(`[DRY-RUN] trait ${name} — ${rowKey}@${threshold} (FORCE, bỏ qua assert from): ${before} -> ${to}`);
    return;
  }
  await db.update(set18Traits).set({ breakpointDetails: details, updatedAt: new Date() }).where(eq(set18Traits.name, name));
  console.log(`✓ trait ${name} (${rowKey}@${threshold} FORCE: ${before} -> ${to})`);
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
  opts: { description?: TextEdit[]; descriptionVi?: TextEdit[]; blossomUpgradeDescriptionVi?: TextEdit[]; cost?: [number, number] },
) {
  const [row] = await db.select().from(set18Wisps).where(eq(set18Wisps.name, name));
  if (!row) throw new Error(`Wisp không tìm thấy: ${name}`);

  let description = row.description;
  let descriptionVi = row.descriptionVi;
  let blossomUpgradeDescriptionVi = row.blossomUpgradeDescriptionVi;
  for (const [from, to] of opts.description ?? []) description = replaceExact(description, from, to, `${name}/description`);
  for (const [from, to] of opts.descriptionVi ?? []) descriptionVi = replaceExact(descriptionVi, from, to, `${name}/descriptionVi`);
  for (const [from, to] of opts.blossomUpgradeDescriptionVi ?? []) {
    if (!blossomUpgradeDescriptionVi) throw new Error(`[${name}/blossomUpgradeDescriptionVi] null, không có gì để sửa`);
    blossomUpgradeDescriptionVi = replaceExact(blossomUpgradeDescriptionVi, from, to, `${name}/blossomUpgradeDescriptionVi`);
  }

  let cost = row.cost;
  if (opts.cost) {
    const [from, to] = opts.cost;
    if (cost !== from) throw new Error(`[${name}/cost] hiện tại (${cost}) không khớp "from" (${from})`);
    cost = to;
  }

  if (DRY_RUN) {
    console.log(`[DRY-RUN] wisp ${name}`);
    diffLine('description', row.description, description);
    diffLine('descriptionVi', row.descriptionVi, descriptionVi);
    diffLine('blossomUpgradeDescriptionVi', row.blossomUpgradeDescriptionVi ?? '', blossomUpgradeDescriptionVi ?? '');
    if (row.cost !== cost) diffLine('cost', String(row.cost), String(cost));
    return;
  }
  await db
    .update(set18Wisps)
    .set({ description, descriptionVi, blossomUpgradeDescriptionVi, ...(opts.cost ? { cost } : {}), updatedAt: new Date() })
    .where(eq(set18Wisps.name, name));
  console.log(`✓ wisp ${name}`);
}

async function updateItem(name: string, opts: { description?: TextEdit[]; descriptionVi?: TextEdit[]; statLine?: TextEdit[]; statBadges?: { stat: string; value: string }[] }) {
  const [row] = await db.select().from(set18Items).where(eq(set18Items.name, name));
  if (!row) throw new Error(`Item không tìm thấy: ${name}`);
  let description = row.description;
  let descriptionVi = row.descriptionVi;
  let statLine = row.statLine ?? '';
  for (const [from, to] of opts.description ?? []) description = replaceExact(description, from, to, `${name}/description`);
  for (const [from, to] of opts.descriptionVi ?? []) descriptionVi = replaceExact(descriptionVi, from, to, `${name}/descriptionVi`);
  for (const [from, to] of opts.statLine ?? []) statLine = replaceExact(statLine, from, to, `${name}/statLine`);

  if (DRY_RUN) {
    console.log(`[DRY-RUN] item ${name}`);
    diffLine('description', row.description, description);
    diffLine('descriptionVi', row.descriptionVi, descriptionVi);
    if (row.statLine !== statLine) diffLine('statLine', row.statLine ?? '', statLine);
    if (opts.statBadges) console.log('    statBadges ->', JSON.stringify(opts.statBadges));
    return;
  }
  await db
    .update(set18Items)
    .set({
      description,
      descriptionVi,
      ...(opts.statLine ? { statLine } : {}),
      ...(opts.statBadges ? { statBadges: opts.statBadges } : {}),
      updatedAt: new Date(),
    })
    .where(eq(set18Items.name, name));
  console.log(`✓ item ${name}`);
}

async function main() {
  console.log(DRY_RUN ? '=== DRY RUN — không ghi DB ===\n' : '=== GHI DB THẬT ===\n');

  // ── Tộc/Hệ ──────────────────────────────────────────────────────
  await updateTraitBreakpointAtThreshold('Defender', '6', 'DefenderDefenseGain', '120', '115');
  await updateTraitBreakpointAtThreshold('Hunter', '5', 'HunterAD', '65%', '60%');
  await updateTraitBreakpointAtThreshold('Inferno', '5', 'HPBurnPerSecond', '3.5', '3');
  await updateTraitBreakpointAtThreshold('Inferno', '7', 'HPBurnPerSecond', '4.5', '4');
  await updateTraitBreakpointAtThreshold('Invoker', '5', 'InvokerManaBonus', '9', '8');
  await updateTraitBreakpointAtThreshold('Coven', '3', 'EssencePerLoss', '18', '22');
  await updateTraitBreakpointAtThreshold('Coven', '5', 'EssencePerLoss', '32', '35');
  // Coven threshold=4: DB thật 22 (không phải 25 như "from" patch nêu) —
  // người dùng xác nhận ghi thẳng "to" (28) theo đúng vị trí thứ 2 trong dãy
  // patch 18/25/32/60⇒22/28/35/60.
  await forceTraitBreakpointAtThreshold('Coven', '4', 'EssencePerLoss', '28');

  // ── Wisp — nhóm "Blossom Charms" (nerf khi splash Hoa Linh) ───────
  // Số liệu patch nằm ở `blossomUpgradeDescriptionVi` (bản NÂNG CẤP khi có
  // Hoa Linh), KHÔNG phải `description`/`descriptionVi` (bản cơ bản) — xác
  // nhận qua dump: "26 giây"/"7 điểm hạ gục"/"600 Máu"/... đều khớp CHÍNH XÁC
  // "from" của patch chỉ khi tra đúng field upgrade này.
  await updateWisp('Animate Shop', { blossomUpgradeDescriptionVi: [['Trong 26 giây', 'Trong 24 giây']] });
  // Blood Money: DB cost thật đã là 2 (khớp "to" của patch, không phải "from"
  // 1 patch nêu) — đã đúng sẵn, không cần ghi.
  await updateWisp('Heated Rivalry', { blossomUpgradeDescriptionVi: [['nhận 7 điểm hạ gục', 'nhận 5 điểm hạ gục']] });
  await updateWisp('Hugify', { blossomUpgradeDescriptionVi: [['nhận thêm 600 Máu', 'nhận thêm 500 Máu']] });
  await updateWisp('Mana-Rich Soil', { blossomUpgradeDescriptionVi: [['giảm 25% Năng Lượng Tối Đa', 'giảm 20% Năng Lượng Tối Đa']] });
  await updateWisp('Mercenary Force', { blossomUpgradeDescriptionVi: [['Nhận 4.5% Khuếch Đại Sát Thương', 'Nhận 4% Khuếch Đại Sát Thương']] });
  await updateWisp('Moonlight Ritual', { cost: [2, 3] });
  await updateWisp('Sinister Deal', {
    blossomUpgradeDescriptionVi: [
      ['Mất 3 Máu Người Chơi', 'Mất 2 Máu Người Chơi'],
      ['Nhận 3 Vàng', 'Nhận 2 Vàng'],
    ],
  });
  await updateWisp('Stand Alone', {
    blossomUpgradeDescriptionVi: [['22% Máu và 22% Khuếch Đại Sát Thương', '20% Máu và 20% Khuếch Đại Sát Thương']],
  });
  // Blaze/Combust/Curio Cart/Heroic Sacrifice: blossomUpgradeDescriptionVi là
  // null hoặc không chứa số liệu tương ứng (đã kiểm tra toàn bộ record) —
  // không có anchor an toàn, giữ nguyên DB, chỉ patch report ghi nhận.

  // ── Wisp khác ─────────────────────────────────────────────────
  await updateWisp('Blood and Iron', { cost: [3, 4] });
  await updateWisp('Three Me', {});

  // ── Tướng ───────────────────────────────────────────────────────
  await updateChampion('champion:tft18_karma', {
    // Patch note ghi 4 mốc "120/180/270/460⇒125/185/300/515", DB chỉ lưu 3
    // mốc sao "120/180/270" — chỉ cập nhật phần có trong DB.
    text: [['120/180/270', '125/185/300']],
  });
  await updateChampion('champion:tft18_ornn', {
    // Forge Power threshold khớp chính xác (155000 nằm giữa mảng 3 mốc).
    text: [['155000/180000', '140000/180000']],
    // "doubled at 3-star" (=+100%) không còn đúng ở 18.3 (+85%) — người dùng
    // xác nhận sửa lại chữ theo đúng nghĩa mới.
    textEn: [['doubled at 3-star', 'increased 85% at 3-star']],
    textVi: [['nhân đôi ở mốc 3 sao', 'tăng 85% ở mốc 3 sao']],
  });
  await updateChampion('champion:tft18_veigar', {
    textEn: [
      ['permanently gain 3% Ability Power', 'permanently gain 2% Ability Power'],
      ['175/265/395 magic damage, increased to 265/400/595', '200/300/450 magic damage, increased to 300/450/675'],
    ],
    // "3%" nằm trong <span>3</span>% ở forms — dùng textViPlainOnly (chỉ áp
    // abilityVi phẳng) + formText riêng (token số trần, không kèm chữ xung
    // quanh) để không vỡ ranh giới HTML, theo đúng cảnh báo trong skill.
    textViPlainOnly: [
      ['vĩnh viễn nhận thêm 3% Sức Mạnh Phép Thuật', 'vĩnh viễn nhận thêm 2% Sức Mạnh Phép Thuật'],
      ['175/265/395 sát thương phép, tăng lên 265/400/595', '200/300/450 sát thương phép, tăng lên 300/450/675'],
    ],
    formText: [
      {
        label: 'Mặc định',
        edits: [
          ['175/265/395', '200/300/450'],
          ['265/400/595', '300/450/675'],
          ['vĩnh viễn nhận thêm <span class="s18-value">3</span>%', 'vĩnh viễn nhận thêm <span class="s18-value">2</span>%'],
        ],
      },
    ],
  });
  await updateChampion('champion:tft18_alistar', {
    text: [['100/150/225', '180/270/420']],
  });
  await updateChampion('champion:tft18_gromp', {
    // "160/240/360" (DoT dạng AP) có ở ability/abilityVi top-level (mô tả
    // gộp) VÀ form AP, nhưng KHÔNG có ở form AD — dùng textEn/textViPlainOnly
    // cho top-level + formText riêng cho form AP.
    textEn: [['160/240/360', '175/265/410']],
    textViPlainOnly: [['160/240/360', '175/265/410']],
    formText: [{ label: 'AP', edits: [['160/240/360', '175/265/410']] }],
    statArray: [{ field: 'attackDamage', index: 0, from: [45], to: 50 }],
    statScalar: [{ field: 'attackSpeed', from: 0.7, to: 0.75 }],
  });
  await updateChampion('champion:tft18_murkwolf', {
    text: [['60/90/135', '65/100/160']],
  });
  await updateChampion('champion:tft18_warwick', {
    text: [['215/325/500', '230/345/535']],
    textEn: [['healing for 20% of the damage dealt', 'healing for 25% of the damage dealt']],
    textViPlainOnly: [['hồi máu bằng 20% lượng sát thương gây ra', 'hồi máu bằng 25% lượng sát thương gây ra']],
    // "20%" của Hồi Máu dùng class "colorHealth" khác với "20%" của Tốc Độ
    // Đánh (class "colorStat") — dùng đúng đoạn class làm anchor duy nhất.
    formText: [
      {
        label: 'Mặc định',
        edits: [
          ['s18-style-colorHealth"><span class="s18-icon s18-icon-icon_ap"></span>20%', 's18-style-colorHealth"><span class="s18-icon s18-icon-icon_ap"></span>25%'],
        ],
      },
    ],
  });
  await updateChampion('champion:tft18_azir', {
    text: [['43/65/103', '46/69/110']],
  });
  await updateChampion('champion:tft18_cassiopeia', {
    text: [['400/600/950', '425/630/1020']],
  });
  await updateChampion('champion:tft18_rammus', {
    // DB "325/400/500" không khớp "from" 350/450/550 của patch — người dùng
    // xác nhận ghi thẳng "to" (giá trị thật hiện tại đã lệch từ trước, coi
    // patch là nguồn đúng).
    text: [['325/400/500', '400/550/725']],
  });
  await updateChampion('champion:tft18_lillia', {
    text: [['325/475', '350/525']],
  });
  await updateChampion('champion:tft18_nidalee', {
    formText: [
      { label: 'AD', edits: [['225/340', '210/315']] },
      { label: 'AP', edits: [['300/450/3000', '330/500/3000']] },
    ],
  });
  await updateChampion('champion:tft18_lux', {
    // Chỉ áp dụng cho form "Mặt Trời" — dòng "Suy Yếu... 12% trong 6 giây" là
    // đúng trường Solar bonus damage per 3-star mà patch nhắc tới.
    // "12" nằm trong <span>12</span>%, tách khỏi chữ xung quanh — dùng token
    // số trần, không kèm cụm cả câu.
    formText: [{ label: 'Mặt Trời', edits: [['s18-value">12</span>%', 's18-value">15</span>%']] }],
  });
  await updateChampion('champion:tft18_taric', {
    text: [['250/375', '275/450']],
    calcEdits: [{ calcId: 'taric:mac-inh:calc-1', terms: ['15%/15%/100%', '15%/15%/100%'], total: ['295/576/11300', '270/501/11300'] }],
  });
  // Alistar Heal: base flat trong calc.terms hiện ghi nhầm literal "1" (bug dữ
  // liệu có sẵn, không phải do bản vá này) thay vì mảng base thật. Người dùng
  // xác nhận sửa lại thành mảng base đúng theo "to" của patch (230/300/400),
  // tính lại total = base + 8%×[950,1710,3078] = 306/436/646.
  {
    const [row] = await db.select().from(set18Champions).where(eq(set18Champions.id, 'champion:tft18_alistar'));
    if (!row) throw new Error('Champion không tìm thấy: champion:tft18_alistar');
    const forms = JSON.parse(JSON.stringify(row.forms)) as ChampionForm[];
    const before = JSON.parse(JSON.stringify(forms));
    forms.forEach((f) => {
      f.calcs = (f.calcs ?? []).map((cc) => {
        if (cc.id !== 'alistar:mac-inh:calc-1') return cc;
        return {
          ...cc,
          terms: replaceExact(
            cc.terms,
            '<span class="s18-value s18-style-colorStat">1</span>',
            '<span class="s18-value s18-style-colorStat">230/300/400</span>',
            'alistar/calcs/terms',
          ),
          total: replaceExact(cc.total, '276/336/396', '306/436/646', 'alistar/calcs/total'),
        };
      });
    });
    if (DRY_RUN) {
      console.log('[DRY-RUN] champion champion:tft18_alistar (Heal calc fix)');
      diffLine('forms[0].calcs', JSON.stringify(before[0]?.calcs), JSON.stringify(forms[0]?.calcs));
    } else {
      await db.update(set18Champions).set({ forms, updatedAt: new Date() }).where(eq(set18Champions.id, 'champion:tft18_alistar'));
      console.log('✓ champion champion:tft18_alistar (Heal calc fix)');
    }
  }

  // ── Trang bị / Tạo Tác ────────────────────────────────────────
  await updateItem('Gold Collector', { statLine: [['40%', '35%']] });
  await updateItem('Eternal Pact', {
    description: [['gain 15 Mana', 'gain 10 Mana']],
    descriptionVi: [['nhận 15 Năng Lượng', 'nhận 10 Năng Lượng']],
  });
  await updateItem('Statikk Shiv', { statLine: [['15%', '25%']], statBadges: [{ stat: 'as', value: '40%' }, { stat: 'ap', value: '25' }] });

  // ── Ấn (Emblems) ──────────────────────────────────────────────
  await updateItem('Brawler Emblem', {
    description: [['2% of the holder', '2.5% of the holder']],
    descriptionVi: [['2% Máu tối đa', '2.5% Máu tối đa']],
  });
  await updateItem('Hunter Emblem', {
    // description DB ghi 12% (không khớp "from" 18% patch) — người dùng xác
    // nhận ghi thẳng theo "to" (15%).
    description: [['12% Attack Damage', '15% Attack Damage']],
    descriptionVi: [['tăng 12% Sức Mạnh Công Kích', 'tăng 15% Sức Mạnh Công Kích']],
  });
  await updateItem('Invoker Emblem', { statLine: [['3', '2']], statBadges: [{ stat: 'manaregen', value: '2' }] });
  await updateItem('Juggernaut Emblem', { description: [['Gain 15 mana', 'Gain 10 mana']] });

  // ── Nâng Cấp (Augments) ─────────────────────────────────────────
  // Blossom's Call: description DB thật ("gain a random Blossom champion
  // based on the Wisp's cost. Gain a Yunara, a Yorick, and a Karma.") không
  // hề chứa các mốc vàng patch nhắc tới (15/6/4/0g...) — không có anchor an
  // toàn, bỏ qua codex (patch report vẫn ghi đúng số liệu Riot).
  await updateAugment('augment:da_challengersgrace', {
    description: [['3 seconds', '4 seconds']],
    descriptionVi: [['3 giây', '4 giây']],
  });
  await updateAugment('augment:da_earlylearnings', {
    description: [['5% Attack Damage & Ability Power', '3% Attack Damage & Ability Power']],
  });
  await updateAugment('augment:da_electrochargei', {
    // DB tóm gọn dạng khoảng "30-90 (based on current Stage)" thay vì mảng 4
    // mốc đầy đủ — chỉ sửa được 2 đầu mút khoảng theo patch (25/40/60/80).
    description: [['30-90', '25-80']],
  });
  await updateAugment('augment:da_futurefocused', {
    description: [['8 gold', '5 gold']],
  });
  await updateAugment('augment:da_giantandmighty', {
    description: [['200 Health', '225 Health']],
  });
  await updateAugment('augment:da_grouphugi', {
    description: [['6 Armor', '7 Armor']],
  });
  await updateAugment('augment:da_grouphugii', {
    description: [['9 Armor', '10 Armor']],
  });
  await updateAugment('augment:da_heroicgrabbag', {
    description: [['4 Gold', '6 Gold']],
  });
  await updateAugment('augment:da_holdtheline', {
    // DB ghi ngược thứ tự so với patch (AP trước, AD sau) — cả 2 số đều hội
    // tụ về 11% nên thay nguyên cụm để không cần phân biệt AD/AP.
    description: [['9% Ability Power and 8% Attack Damage', '11% Ability Power and 11% Attack Damage']],
  });
  await updateAugment('augment:da_jeweledlotus_i', {
    description: [['10% Critical Strike Chance', '15% Critical Strike Chance']],
  });
  await updateAugment('augment:da_retribution', {
    description: [['25% Critical Strike Chance', '15% Critical Strike Chance']],
  });
  await updateAugment('augment:da_shimmerscaleessence', {
    // DB thật: "Gain a Mogul's Mail. After 7 player combats, gain a Gamblers
    // Blade." — số vòng trì hoãn thật là 7 (không phải 8 như "from" patch),
    // và thứ tự trang bị hiện tại là Mogul's Mail trước — ghi thẳng theo "to"
    // (delay 6, đảo thứ tự: Gambler's Blade trước, Mogul's Mail sau).
    description: [["Gain a Mogul's Mail. After 7 player combats, gain a Gamblers Blade.", "Gain a Gambler's Blade. After 6 player combats, gain a Mogul's Mail."]],
  });
  await updateAugment('augment:da_spiritofredemption', {
    description: [['7.5%', '9%']],
  });
  await updateAugment('augment:da_upwardmobility', {
    description: [['1 free reroll', '2 free rerolls']],
  });

  console.log('\n' + (DRY_RUN ? 'DRY RUN xong — không có gì được ghi.' : 'GHI DB xong.'));
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
