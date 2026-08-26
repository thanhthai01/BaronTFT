// Migration một lần cho bản PBE 18.1ah (Truexy ghi ngày 8/24, đăng lúc 2:11
// AM giờ hiển thị Aug 25, 2026) — cập nhật set18_champions/set18_traits/
// set18_augments/set18_wisps/set18_items. Nguồn:
// pbe-notes/Patch_TFT18.1ah-PBE-pre-launch-patch.md.
//
// Hỗ trợ --dry-run (log before/after, không ghi DB) — LUÔN chạy trước khi ghi
// thật, xem [[feedback_patch_update_mismatched_anchors_and_dryrun]].
//
// Người dùng đã xác nhận trực tiếp (không phải suy đoán):
// - Diana Shield: ảnh gốc ghi "150/275/400 AP" nhưng tác giả tự đính chính
//   trong reply là lá chắn KHÔNG scale AP → ghi số, bỏ đơn vị AP.
// - Mama Beak trong caption = champion:tft18_raptor trong codex.
// - Mục Items chỉ có Hullcrusher, không bị cắt mất dòng nào.
//
// Quyết định khi anchor lệch (ghi ở đây, KHÔNG ghi vào note của PatchEntry vì
// note hiển thị công khai trên /patch):
// - Caitlyn: patch ghi "200/300/500 AD" = hệ số trong calcs[].terms, còn text
//   chiêu hiển thị "220/330/545" là TỔNG đã tính. Công thức trong DB là
//   total = (200/300/500 × AD) + (20/30/45 × AP), với AD/AP mặc định ×1 nên
//   200+20=220 khớp chính xác. Đổi terms sang 190/285/470 thì tổng mới là
//   210/315/515 — ghi cả hai để text và công thức không lệch nhau.
// - Raptor: abilityVi/forms[].abilityHtmlVi chứa "27/41/65" (khớp "from" của
//   patch) nhưng ability (EN) lại là "25/38/60" — lệch có sẵn từ trước. Ghi cả
//   hai về "20/30/48" theo "to" của patch.
// - Raptor AD: forms[0].stats.attackDamage[0]=65 khớp "from", nhưng
//   stats.attackDamage[0] cấp trên là 60 (bản 18.1af chỉ sửa forms, bỏ sót
//   stats). Ghi CẢ HAI về 50 để hết lệch.
// - Leona (Máu) và Elder Dragon (Kháng): patch chỉ cho 1 con số trong khi DB
//   lưu mảng 3 mốc sao. Theo tiền lệ Master Yi ở 18.1ae: chỉ ghi mốc 1 sao,
//   KHÔNG tự suy diễn mốc 2/3 sao.
// - Azir/Diana: patch cho 4 mốc (có mốc 4 sao), DB chỉ lưu 3 mốc — chỉ đổi 3
//   mốc đầu.
// - Hullcrusher: patch chỉ nói "Disabled". Làm theo tiền lệ Death's Defiance ở
//   18.1af → set visible:false.
//
// Các mục KHÔNG có anchor để replaceExact — người dùng đã duyệt từng mục ở
// vòng 2 (xem pbe-notes/Patch_TFT18.1ah-skipped-items.md):
// - Dark Ritual 7 mốc cashout: mô tả DB không chứa con số nào → BỔ SUNG hẳn
//   câu liệt kê 7 mốc mới (appendAugmentText, idempotent).
// - Unrivaled Kha'zix Mana Share: mô tả DB không nhắc cơ chế → BỔ SUNG câu mới
//   vào CẢ HAI bản (da_18_rivalsaugment và ...plus).
// - Beggar's Wisp: không tồn tại trong DB (đã dò cả 176 wisp theo tên EN/VI và
//   theo mô tả) → INSERT mới với đúng phần patch note cho biết. nameVi giữ
//   nguyên tên gốc vì chưa có bản dịch chính thức.
// - Vô hiệu hoá 3 augment + 2 wisp: schema trước đây không có field cho việc
//   này → migration 0006 thêm cột `visible` cho set18_augments/set18_wisps,
//   khớp cột cùng tên đã có ở set18_items.
//
// SKIP thật sự (xác nhận không làm):
// - Blackthorn Sacrifice Multiplier (1.5/2.25/1.8): breakpointDetails không có
//   field hệ số nhân theo cấp sao/giá tướng, và người dùng xác nhận đây là
//   hằng số nội bộ codex chưa từng hiển thị. (Phần Giáp/Kháng 17→15 CÓ anchor
//   và đã làm bên dưới.)
// - Lux "Primal Attack Speed 50%→60%": đã soát lại cả forms[8] "Nguyên Sinh"
//   của Lux (đã là 60%) lẫn trait Primal (30%/15%, khái niệm khác) — không
//   nơi nào trong DB chứa 50%, không có gì để đổi.
import { eq } from 'drizzle-orm';
import { db } from '../../src/db/client';
import { set18Champions, set18Traits, set18Augments, set18Wisps, set18Items } from '../../src/db/schema';

const DRY_RUN = process.argv.includes('--dry-run');

/** Các cột jsonb của set18_champions không có type sinh sẵn ở tầng script —
 *  khai báo đúng phần field script này chạm tới, phần còn lại giữ `unknown`. */
type ChampionStats = Record<string, unknown> & {
  health?: number[];
  attackDamage?: number[];
  armor?: number;
  magicResist?: number;
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

/** Thay [from, to] trên ability (EN) / abilityVi / mọi forms[].abilityHtmlVi. */
type TextEdit = [string, string];

async function updateChampion(
  id: string,
  opts: {
    /** Áp cho cả ability, abilityVi và forms[].abilityHtmlVi. */
    text?: TextEdit[];
    /** Chỉ áp cho ability (EN) — dùng khi EN lệch VI. */
    textEn?: TextEdit[];
    /** Chỉ áp cho abilityVi + forms[].abilityHtmlVi. */
    textVi?: TextEdit[];
    /** Chỉ áp cho forms có label khớp. */
    formText?: { label: string; edits: TextEdit[] }[];
    mana?: [string, string];
    /** Chỉ áp cho forms[label].mana. */
    formMana?: { label: string; from: string; to: string }[];
    /** Sửa 1 phần tử trong mảng stats (health/attackDamage) ở cả stats gốc và forms. */
    statArray?: { field: 'health' | 'attackDamage'; index: number; from: number[]; to: number }[];
    /** Sửa stat vô hướng (armor/magicResist) ở cả stats gốc và forms. */
    statScalar?: { field: 'armor' | 'magicResist'; from: number; to: number }[];
    /** Sửa calcs[].terms và calcs[].total theo cặp. */
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

  await db
    .update(set18Champions)
    .set({ ability, abilityVi, mana, stats, forms, updatedAt: new Date() })
    .where(eq(set18Champions.id, id));
  console.log(`✓ champion ${id}`);
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

/** Đổi giá trị của một `row` cụ thể trong breakpointDetails[].bullet.values. */
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

async function updateAugment(id: string, edits: { description?: TextEdit[]; descriptionVi?: TextEdit[] }) {
  const [row] = await db.select().from(set18Augments).where(eq(set18Augments.id, id));
  if (!row) throw new Error(`Augment không tìm thấy: ${id}`);
  let description = row.description;
  let descriptionVi = row.descriptionVi;
  for (const [from, to] of edits.description ?? []) description = replaceExact(description, from, to, `${id}/description`);
  for (const [from, to] of edits.descriptionVi ?? []) descriptionVi = replaceExact(descriptionVi, from, to, `${id}/descriptionVi`);

  if (DRY_RUN) {
    console.log(`[DRY-RUN] augment ${id}`);
    diffLine('description', row.description, description);
    diffLine('descriptionVi', row.descriptionVi, descriptionVi);
    return;
  }
  await db.update(set18Augments).set({ description, descriptionVi, updatedAt: new Date() }).where(eq(set18Augments.id, id));
  console.log(`✓ augment ${id}`);
}

async function updateWisp(
  name: string,
  opts: {
    description?: TextEdit[];
    descriptionVi?: TextEdit[];
    blossomUpgradeDescriptionVi?: TextEdit[];
    cost?: [number, number];
  },
) {
  const [row] = await db.select().from(set18Wisps).where(eq(set18Wisps.name, name));
  if (!row) throw new Error(`Wisp không tìm thấy: ${name}`);

  let description = row.description;
  let descriptionVi = row.descriptionVi;
  let upgrade = row.blossomUpgradeDescriptionVi;
  for (const [from, to] of opts.description ?? []) description = replaceExact(description, from, to, `${name}/description`);
  for (const [from, to] of opts.descriptionVi ?? []) descriptionVi = replaceExact(descriptionVi, from, to, `${name}/descriptionVi`);
  for (const [from, to] of opts.blossomUpgradeDescriptionVi ?? []) {
    if (!upgrade) throw new Error(`[${name}/blossomUpgradeDescriptionVi] đang null, không sửa được`);
    upgrade = replaceExact(upgrade, from, to, `${name}/blossomUpgradeDescriptionVi`);
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
    diffLine('blossomUpgradeDescriptionVi', row.blossomUpgradeDescriptionVi ?? '', upgrade ?? '');
    if (row.cost !== cost) diffLine('cost', String(row.cost), String(cost));
    return;
  }

  await db
    .update(set18Wisps)
    .set({ description, descriptionVi, blossomUpgradeDescriptionVi: upgrade, ...(opts.cost ? { cost } : {}), updatedAt: new Date() })
    .where(eq(set18Wisps.name, name));
  console.log(`✓ wisp ${name}`);
}

/** Nối thêm câu mới vào cuối mô tả — dùng khi patch đổi một con số mà mô tả
 *  hiện tại KHÔNG hề nhắc tới (không có anchor để replaceExact). Idempotent:
 *  bỏ qua nếu câu đó đã có sẵn. */
async function appendAugmentText(id: string, suffixEn: string, suffixVi: string) {
  const [row] = await db.select().from(set18Augments).where(eq(set18Augments.id, id));
  if (!row) throw new Error(`Augment không tìm thấy: ${id}`);
  const description = row.description.includes(suffixEn.trim()) ? row.description : row.description + suffixEn;
  const descriptionVi = row.descriptionVi.includes(suffixVi.trim()) ? row.descriptionVi : row.descriptionVi + suffixVi;

  if (DRY_RUN) {
    console.log(`[DRY-RUN] augment ${id} (append)`);
    diffLine('description', row.description, description);
    diffLine('descriptionVi', row.descriptionVi, descriptionVi);
    return;
  }
  await db.update(set18Augments).set({ description, descriptionVi, updatedAt: new Date() }).where(eq(set18Augments.id, id));
  console.log(`✓ augment ${id} (append)`);
}

async function setAugmentVisibility(id: string, visible: boolean) {
  const [row] = await db.select().from(set18Augments).where(eq(set18Augments.id, id));
  if (!row) throw new Error(`Augment không tìm thấy: ${id}`);
  if (DRY_RUN) {
    console.log(`[DRY-RUN] augment ${id} (${row.nameVi})`);
    diffLine('visible', String(row.visible), String(visible));
    return;
  }
  await db.update(set18Augments).set({ visible, updatedAt: new Date() }).where(eq(set18Augments.id, id));
  console.log(`✓ augment ${id} (visible: ${row.visible} -> ${visible})`);
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

async function insertWisp(row: typeof set18Wisps.$inferInsert) {
  const [existing] = await db.select().from(set18Wisps).where(eq(set18Wisps.id, row.id));
  if (existing) {
    console.log(`• wisp ${row.name} đã tồn tại (${row.id}) — bỏ qua insert`);
    return;
  }
  if (DRY_RUN) {
    console.log(`[DRY-RUN] INSERT wisp ${row.name}`);
    console.log(`    ${JSON.stringify(row)}`);
    return;
  }
  await db.insert(set18Wisps).values(row);
  console.log(`✓ wisp ${row.name} (INSERT mới)`);
}

async function setItemVisibility(name: string, visible: boolean) {
  const [row] = await db.select().from(set18Items).where(eq(set18Items.name, name));
  if (!row) throw new Error(`Item không tìm thấy: ${name}`);
  if (DRY_RUN) {
    console.log(`[DRY-RUN] item ${name} (${row.nameVi})`);
    diffLine('visible', String(row.visible), String(visible));
    return;
  }
  await db.update(set18Items).set({ visible, updatedAt: new Date() }).where(eq(set18Items.name, name));
  console.log(`✓ item ${name} (visible: ${row.visible} -> ${visible})`);
}

async function main() {
  console.log(DRY_RUN ? '=== DRY RUN — không ghi DB ===\n' : '=== GHI DB THẬT ===\n');

  // ── Tướng ───────────────────────────────────────────────────────
  // Leona: Máu 700 -> 750 (chỉ mốc 1 sao, theo tiền lệ Master Yi ở 18.1ae).
  await updateChampion('champion:tft18_leona', {
    statArray: [{ field: 'health', index: 0, from: [700], to: 750 }],
  });

  // Caitlyn: patch đổi hệ số (calcs.terms), tổng hiển thị tính lại theo
  // total = terms1 + terms2 = 190/285/470 + 20/30/45 = 210/315/515.
  await updateChampion('champion:tft18_caitlyn', {
    text: [['220/330/545', '210/315/515']],
    calcEdits: [
      {
        calcId: 'caitlyn:mac-inh:calc-1',
        terms: ['200/300/500', '190/285/470'],
        total: ['220/330/545', '210/315/515'],
      },
    ],
  });

  await updateChampion('champion:tft18_warwick', { text: [['200/300/450', '215/325/500']] });

  // Azir: patch cho 4 mốc (48/72/115/205), DB chỉ lưu 3 mốc sao.
  await updateChampion('champion:tft18_azir', { text: [['48/72/115', '40/60/96']] });

  // Diana: lá chắn bỏ đơn vị AP theo đính chính của tác giả. Sát thương chiêu
  // DB có mốc 4 sao (270) mà patch không nhắc — giữ nguyên.
  await updateChampion('champion:tft18_diana', {
    text: [
      ['150/225/300', '150/275/400'],
      ['65/100/155', '70/105/170'],
    ],
  });

  // Raptor: EN lệch VI có sẵn (25/38/60 vs 27/41/65) — ghi cả hai về 20/30/48.
  // AD: stats cấp trên là 60 (18.1af bỏ sót), forms là 65 — ghi cả hai về 50.
  await updateChampion('champion:tft18_raptor', {
    textEn: [['25/38/60', '20/30/48']],
    textVi: [['27/41/65', '20/30/48']],
    statArray: [{ field: 'attackDamage', index: 0, from: [60, 65], to: 50 }],
  });

  await updateChampion('champion:tft18_ahri', { text: [['485/735', '450/675']] });

  // Nidalee: patch đổi năng lượng dạng AP (0/40 -> 0/45). Dạng AD (0/20) giữ nguyên.
  await updateChampion('champion:tft18_nidalee', {
    mana: ['0 / 40', '0 / 45'],
    formMana: [{ label: 'AP', from: '0 / 40', to: '0 / 45' }],
  });

  await updateChampion('champion:tft18_alune', { text: [['53/80', '55/83']] });

  await updateChampion('champion:tft18_elderdragon', {
    text: [['265/400', '285/435']],
    statScalar: [
      { field: 'armor', from: 70, to: 75 },
      { field: 'magicResist', from: 70, to: 75 },
    ],
  });

  // Lux: chỉ phần Hoả Ngục (8 -> 10). Nguyên Sinh đã sẵn 60%, không đổi.
  await updateChampion('champion:tft18_lux', {
    formText: [
      {
        label: 'Hoả Ngục',
        edits: [['Hồi lại <span class="s18-value">8</span> năng lượng', 'Hồi lại <span class="s18-value">10</span> năng lượng']],
      },
    ],
  });

  // ── Tộc Hệ ──────────────────────────────────────────────────────
  // Blackthorn: chỉ Giáp/Kháng khi hiến tế tướng Đỡ Đòn có anchor (17 -> 15).
  // Chú ý KHÔNG đụng TankSacrificeHPBonus (cũng là "17%").
  await updateTraitBreakpointValue('Blackthorn', 'TankSacrificeResistBonus', '17', '15');

  await updateTraitDescription('Fae', { description: [['5% and 2% Heal', '5% and 2.5% Heal']] });
  await updateTraitDescription('Solar', {
    description: [['Convert 50% of the bonus magic damage', 'Convert 40% of the bonus magic damage']],
  });

  // ── Nâng Cấp ────────────────────────────────────────────────────
  await updateAugment('augment:da_18_solartraitaugment', {
    description: [['60 permanent max Health', '70 permanent max Health']],
    descriptionVi: [['60 permanent max Health', '70 permanent max Health']],
  });
  await updateAugment('augment:da_18_fourcing', {
    description: [['gains 120 health', 'gains 100 health']],
    descriptionVi: [['nhận 120 máu', 'nhận 100 máu']],
  });
  await updateAugment('augment:da_blackthorntraitaugment', {
    description: [['first 3 times', 'first 4 times']],
    descriptionVi: [['Trong 3 lần đầu tiên', 'Trong 4 lần đầu tiên']],
  });

  // Dark Ritual: mô tả gốc không liệt kê mốc AP nào nên không có gì để thay —
  // theo chỉ đạo người dùng, BỔ SUNG hẳn câu liệt kê 7 mốc sau bản vá.
  await appendAugmentText(
    'augment:da_18_coventraitaugment_loottoap',
    ' Ability Power per cashout: 5 / 12 / 40 / 60 / 100 / 175 / 250.',
    ' Sức Mạnh Phép Thuật mỗi lần đổi thưởng: 5 / 12 / 40 / 60 / 100 / 175 / 250.',
  );

  // Unrivaled: mô tả gốc không nhắc cơ chế chia năng lượng — bổ sung vào CẢ HAI
  // bản (bản thường và bản "+"), theo chỉ đạo người dùng. Ảnh gốc chỉ cho con
  // số đích (70%), không mô tả cơ chế, nên viết đúng mức đó, không suy diễn.
  for (const id of ['augment:da_18_rivalsaugment', 'augment:da_18_rivalsaugmentplus']) {
    await appendAugmentText(id, " Kha'Zix Mana Share: 70%.", " Tỉ lệ chia năng lượng của Kha'Zix: 70%.");
  }

  // Vô hiệu hoá 3 Augment bị gỡ khỏi game (cột `visible` thêm ở migration
  // 0006). Dùng `visible`, KHÔNG dùng `isPublished` — isPublished lọc ngay ở
  // tầng pull nên sẽ kéo mục này ra khỏi entity index, làm /patch mất tên
  // tiếng Việt + icon của chính mục vừa bị gỡ.
  for (const id of ['augment:da_doubletrouble', 'augment:da_calculatedloss', 'augment:da_constructacompanion']) {
    await setAugmentVisibility(id, false);
  }

  // ── Tinh Linh ───────────────────────────────────────────────────
  // Abandon Ship: patch KHÔNG đổi lượng vàng, chỉ XP và lượt đổi.
  await updateWisp('Abandon Ship', {
    description: [['10 XP, and 10 rerolls', '8 XP, and 8 rerolls']],
    descriptionVi: [['10 XP và 10 lượt đổi', '8 XP và 8 lượt đổi']],
    blossomUpgradeDescriptionVi: [['12 XP và 12 lượt đổi', '10 XP và 10 lượt đổi']],
  });
  await updateWisp('Forest Mage', { cost: [0, 1] });
  await updateWisp('Prolific Power', {
    description: [['8% Attack Damage', '4% Attack Damage']],
    descriptionVi: [['8% Sức Mạnh Công Kích', '4% Sức Mạnh Công Kích']],
    blossomUpgradeDescriptionVi: [['15% Sức Mạnh Công Kích', '6% Sức Mạnh Công Kích']],
  });
  await updateWisp('Verdant Vitality', {
    description: [['100 Health', '50 Health']],
    descriptionVi: [['100 Máu', '50 Máu']],
    blossomUpgradeDescriptionVi: [['175 Máu', '75 Máu']],
  });

  // Vô hiệu hoá 2 Tinh Linh bị gỡ khỏi game (patch ghi rõ gỡ cả bản thường,
  // bản nâng cấp và bản ngọc — DB chỉ có 1 dòng cho mỗi Tinh Linh, các bản
  // nâng cấp nằm trong blossomUpgradeDescriptionVi của chính dòng đó).
  for (const name of ['Clone Companion', 'Memorial Dummy']) {
    await setWispVisibility(name, false);
  }

  // Beggar's Wisp chưa từng có trong DB (đã dò cả 176 dòng theo tên EN/VI và
  // theo mô tả) — Tinh Linh mới, lần scrape gần nhất chưa bắt được. Theo chỉ
  // đạo người dùng: tạo mới với đúng những gì patch note cho biết, không bịa
  // thêm. Ảnh gốc chỉ có duy nhất dòng "Gold Granted: 3/6g >>> 3/5g", nên:
  // - description/descriptionVi = giá trị thường sau vá (3 vàng)
  // - blossomUpgradeDescriptionVi = giá trị nâng cấp sau vá (5 vàng)
  // - nameVi giữ nguyên tên gốc: chưa có bản dịch chính thức, không tự dịch.
  // - category GoldXP/tier 1/cost 0 suy từ nhóm Tinh Linh cho vàng cùng loại
  //   (Coin Flip, Truce — GoldXP tier 1 cost 0); appears/conditions bỏ trống
  //   vì patch note không nói.
  await insertWisp({
    id: 'wisp:beggars-wisp',
    name: "Beggar's Wisp",
    nameVi: "Beggar's Wisp",
    category: 'GoldXP',
    categoryVi: 'Vàng/XP',
    categoryIcon: '/set18/assets/wisp_categories/t_shopcardsicon18_goldxp_tier1.png',
    tier: 1,
    cost: 0,
    description: 'Gain 3 gold.',
    descriptionVi: 'Nhận 3 vàng.',
    blossomUpgradeCost: null,
    blossomUpgradeDescriptionVi: 'Nhận 5 vàng.',
    appearsVi: 'Xuất hiện: chưa có dữ liệu',
    appearsStart: null,
    appearsEnd: null,
    conditionsVi: [],
    visible: true,
  });

  // ── Trang Bị ────────────────────────────────────────────────────
  await setItemVisibility('Hullcrusher', false);

  console.log(DRY_RUN ? '\n=== DRY RUN xong — chưa ghi gì ===' : '\n=== Đã ghi DB xong ===');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
