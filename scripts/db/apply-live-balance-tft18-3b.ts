// Migration một lần cho micropatch LIVE 18.3b — cập nhật set18_champions/set18_traits.
// Nguồn: pbe-notes/Patch_TFT18.3b-live-micropatch.md. Helper copy từ
// apply-live-balance-tft18-3.ts.
//
// Hỗ trợ --dry-run (log before/after, không ghi DB) — LUÔN chạy trước khi ghi thật.
//
// Phạm vi:
// - Kha'Zix: 285/400/580 → 265/370/535 và 310/445/660 → 285/410/605 (dãy trần,
//   mỗi dãy xuất hiện đúng 1 lần trong ability/abilityVi/forms[0].abilityHtmlVi).
// - Blackthorn: row APSacrificeDamageAmpBonus 14% → 12% ở mốc 2 và 4 (cùng giá
//   trị nền). Nhắm theo row, KHÔNG thay chuỗi "14%" vì ADSacrificeASBonus cũng 14%.
//
// Không đụng (chỉ patch report): Brambleback (không có số), nhóm khôi phục
// 18.2b (DB đã ở giá trị mới), 4 Nâng Cấp bị tắt (không đụng `visible`).
import { eq } from 'drizzle-orm';
import { db } from '../../src/db/client';
import { set18Champions, set18Traits } from '../../src/db/schema';

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

async function main() {
  console.log(DRY_RUN ? '=== DRY RUN — không ghi DB ===' : '=== GHI DB ===');

  await updateChampion('champion:tft18_khazix', {
    text: [
      ['285/400/580', '265/370/535'],
      ['310/445/660', '285/410/605'],
    ],
  });

  for (const threshold of ['2', '4']) {
    await updateTraitBreakpointAtThreshold('Blackthorn', threshold, 'APSacrificeDamageAmpBonus', '14%', '12%');
  }

  console.log('\n' + (DRY_RUN ? 'DRY RUN xong — không có gì được ghi.' : 'GHI DB xong.'));
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
