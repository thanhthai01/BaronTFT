// Migration một lần cho bản vá LIVE 18.1d (micropatch cân bằng đầu tiên của
// Mùa 18, lên live rạng sáng 02/09/2026 giờ VN) — đồng bộ set18_champions +
// set18_traits về đúng số liệu live.
//
// Nguồn: pbe-notes/Patch_TFT18.1d-live-micropatch.md (ảnh gốc "18.1 Mid-Patch
// Balance Adjustments" + caption của Truexy).
// Các điểm cần quyết + lựa chọn của người dùng: pbe-notes/Patch_TFT18.1d-skipped-items.md
//
// Hỗ trợ --dry-run (log before/after, không ghi DB) — LUÔN chạy trước khi ghi
// thật, xem [[feedback_patch_update_mismatched_anchors_and_dryrun]].
//
// KHÔNG đụng set18_items / set18_augments / set18_wisps: ảnh gốc không có mục
// nào cho Trang Bị, Nâng Cấp hay Tinh Linh. Nguồn phụ tftips ghi nhận Nâng Cấp
// "Forge A Friend" bị gỡ, nhưng mục này KHÔNG có trong ảnh gốc và người dùng
// đã chốt loại khỏi phạm vi bản vá này.
//
// ── Quyết định khi anchor lệch (ghi ở ĐÂY, không ghi vào note của PatchEntry
//    vì note hiển thị công khai trên /patch) ────────────────────────────────
//
// 1) Cinderling — sát thương chiêu. Patch ghi "from" 340/510/765, DB có
//    300/450/680. KHÔNG phải lỗi nguồn: bản 18.1af buff Base AD 40→45
//    (apply-pbe-balance-tft18-1af.ts dòng 234-242) nhưng chỉ đổi attackDamage,
//    không tính lại sát thương chiêu dẫn xuất. Kiểm chứng:
//      300 × 45/40 = 337.5 ≈ 340 · 450 × 45/40 = 506.25 ≈ 510 · 680 × 45/40 = 765 ✓
//    ⇒ DB đang trễ đúng 1 nhịp. Người dùng chốt: ghi cả `total` lẫn `terms` về
//    giá trị đích 310/465/700, terms 270/405/610 → 280/420/630 để tổng vẫn
//    cộng đúng (280+30=310, 420+45=465, 630+70=700).
//
// 2) Cinderling — mốc sao thứ tư (1300 → 1200). Schema set18_champions chỉ lưu
//    3 mốc sao, không có chỗ cho giá trị thứ tư. Người dùng chốt: bỏ qua ở
//    codex, ghi đủ 4 mốc ở patch report để người đọc vẫn thấy đúng nguồn.
//
// 3) The Elder Dragon — Base AD 115 → 125. DB có 110 (top-level) và 100
//    (forms[0]), không chỗ nào là 115. Nguyên nhân: bản 18.1ag có mục
//    "Elder Dragon AD 110→115" nhưng ĐÃ BỊ SKIP (xem Patch_TFT18.1ag-skipped-
//    items.md mục 3 + comment dòng 33-34 trong apply-pbe-balance-tft18-1ag.ts)
//    vì lúc đó đối chiếu nhầm với forms[0] (=100) thay vì top-level (=110).
//    Chuỗi thật của Riot: 110 → 115 (18.1ag, ta bỏ lỡ) → 125 (18.1d).
//    Người dùng chốt: ghi 125 vào CẢ HAI field, bù luôn nhịp bỏ lỡ. Assert
//    chấp nhận cả 110 lẫn 100 làm giá trị hiện tại hợp lệ.
//
// 4) Amumu — hệ số hồi máu 2.2% → 2.5% có anchor sạch trong calcs.terms.
//    Nhưng dãy số hiển thị dẫn xuất "29.04/29.15/30.8" thì Riot không công bố
//    giá trị mới. Người dùng chốt: CHỈ đổi hệ số, giữ nguyên dãy số — không
//    bịa số, theo đúng tiền lệ 18.1ah (Leona/Elder Dragon: chỉ ghi mốc được
//    công bố, không suy diễn).
//
// ── SKIP thật sự (xác nhận không làm) ─────────────────────────────────────
//
// - Quái Rừng mốc 7, chỉ số phẳng: DB lưu Armor 6 / MR 6 / Health 60 trong khi
//   dữ liệu game hiện hành là +5 / +5 / +50. Bản vá 18.1d KHÔNG đụng tới các
//   số này (ảnh gốc chỉ nêu 3 con số phần trăm AD/AP/Tốc Đánh). Đây là drift
//   có sẵn từ trước bản vá này ⇒ ngoài phạm vi, để một lượt sync riêng dọn.
// (Draven `mana` top-level: xem ghi chú tại chỗ — người dùng chốt SỬA LUÔN)
import { eq } from 'drizzle-orm';
import { db } from '../../src/db/client';
import { set18Champions, set18Traits } from '../../src/db/schema';

const DRY_RUN = process.argv.includes('--dry-run');

/** Các cột jsonb của set18_champions không có type sinh sẵn ở tầng script —
 *  khai báo đúng phần field script này chạm tới, phần còn lại giữ `unknown`. */
type ChampionStats = Record<string, unknown> & {
  mana?: number[];
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

type StatArrayField = 'mana' | 'health' | 'attackDamage';
type StatScalarField = 'armor' | 'magicResist' | 'attackSpeed';

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
    /** Áp cho cả ability (EN), abilityVi và mọi forms[].abilityHtmlVi. */
    text?: TextEdit[];
    /** Chỉ áp cho forms có label khớp. */
    formText?: { label: string; edits: TextEdit[] }[];
    /** Chuỗi mana top-level, có assert. */
    mana?: [string, string];
    /** Chuỗi mana của forms[label]. */
    formMana?: { label: string; from: string; to: string }[];
    /** Sửa 1 phần tử trong mảng stats ở cả stats gốc và forms.
     *  `from` là DANH SÁCH giá trị hiện tại chấp nhận được (top-level và forms
     *  có thể lệch nhau — xem ghi chú Elder Dragon đầu file). */
    statArray?: { field: StatArrayField; index: number; from: number[]; to: number }[];
    /** Sửa stat vô hướng ở cả stats gốc và forms. */
    statScalar?: { field: StatScalarField; from: number; to: number }[];
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

  if (opts.mana) {
    const [from, to] = opts.mana;
    if (mana !== from) throw new Error(`[${id}/mana] hiện tại (${mana}) không khớp "from" (${from})`);
    mana = to;
  }

  for (const s of opts.statArray ?? []) {
    const cur = stats[s.field] as number[] | undefined;
    if (!cur) throw new Error(`[${id}/stats.${s.field}] không tồn tại`);
    if (!s.from.includes(cur[s.index]))
      throw new Error(
        `[${id}/stats.${s.field}[${s.index}]] hiện tại (${cur[s.index]}) không nằm trong "from" chấp nhận được (${s.from.join('|')})`,
      );
    cur[s.index] = s.to;
  }
  for (const s of opts.statScalar ?? []) {
    if (stats[s.field] !== s.from)
      throw new Error(`[${id}/stats.${s.field}] hiện tại (${stats[s.field]}) không khớp "from" (${s.from})`);
    stats[s.field] = s.to;
  }

  if (forms) {
    forms = forms.map((f: ChampionForm) => {
      const next = { ...f };
      for (const [from, to] of opts.text ?? []) {
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
        if (next.mana !== fm.from)
          throw new Error(`[${id}/forms[${f.label}]/mana] hiện tại (${next.mana}) không khớp "from" (${fm.from})`);
        next.mana = fm.to;
      }
      if (next.stats) {
        const st = JSON.parse(JSON.stringify(next.stats)) as ChampionStats;
        for (const s of opts.statArray ?? []) {
          const cur = st[s.field] as number[] | undefined;
          if (!cur) continue;
          if (!s.from.includes(cur[s.index]))
            throw new Error(
              `[${id}/forms[${f.label}]/stats.${s.field}[${s.index}]] hiện tại (${cur[s.index]}) không nằm trong "from" chấp nhận được (${s.from.join('|')})`,
            );
          cur[s.index] = s.to;
        }
        for (const s of opts.statScalar ?? []) {
          if (st[s.field] === undefined) continue;
          if (st[s.field] !== s.from)
            throw new Error(
              `[${id}/forms[${f.label}]/stats.${s.field}] hiện tại (${st[s.field]}) không khớp "from" (${s.from})`,
            );
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
    if (JSON.stringify(row.stats) !== JSON.stringify(stats))
      console.log(`    stats: ${JSON.stringify(row.stats)}\n      -> ${JSON.stringify(stats)}`);
    const beforeForms = (row.forms as ChampionForm[] | null) ?? [];
    (forms ?? []).forEach((f: ChampionForm, i: number) => {
      const b = beforeForms[i] ?? ({} as ChampionForm);
      diffLine(`forms[${i}:${f.label}].abilityHtmlVi`, b.abilityHtmlVi ?? '', f.abilityHtmlVi ?? '');
      if (b.mana !== f.mana) diffLine(`forms[${i}:${f.label}].mana`, b.mana ?? '', f.mana ?? '');
      if (JSON.stringify(b.stats) !== JSON.stringify(f.stats))
        console.log(`    forms[${i}:${f.label}].stats: ${JSON.stringify(b.stats)}\n      -> ${JSON.stringify(f.stats)}`);
      if (JSON.stringify(b.calcs) !== JSON.stringify(f.calcs))
        console.log(`    forms[${i}:${f.label}].calcs: ${JSON.stringify(b.calcs)}\n      -> ${JSON.stringify(f.calcs)}`);
    });
    return;
  }

  await db
    .update(set18Champions)
    .set({ ability, abilityVi, mana, stats, forms, updatedAt: new Date() })
    .where(eq(set18Champions.id, id));
  console.log(`✓ champion ${id}`);
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
      if (v.value !== from)
        throw new Error(`[${name}/${rowKey}@${bp.threshold}] hiện tại (${v.value}) không khớp "from" (${from})`);
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
  console.log(`✓ trait ${name} — ${rowKey}: ${from} -> ${to} (${hits} mốc)`);
}

async function main() {
  console.log(DRY_RUN ? '=== DRY RUN — không ghi DB ===\n' : '=== GHI DB THẬT ===\n');

  // ══════════════════════════ TỘC/HỆ ══════════════════════════

  // Thực Vật (Flora Fatalis) ▼ — mốc 1: Năng Lượng 10→8, mốc 2: Hồi máu 8%→6%.
  // Mục này tftips BỎ SÓT hoàn toàn, chỉ có trong ảnh gốc Truexy.
  await updateTraitBreakpointValue('Flora Fatalis', 'Mana', '10', '8');
  await updateTraitBreakpointValue('Flora Fatalis', 'PercentHeal', '8%', '6%');

  // Quái Rừng (Riftbeast) ▼ — mốc 7: chỉ số tăng trưởng 6%→5% (AD/AP/Tốc Đánh).
  // Các row phẳng CapstoneArmor/MR/Health/ManaRegen KHÔNG đổi (xem SKIP đầu file).
  await updateTraitBreakpointValue('Riftbeast', 'CapstoneAD', '6%', '5%');
  await updateTraitBreakpointValue('Riftbeast', 'CapstoneAP', '6%', '5%');
  await updateTraitBreakpointValue('Riftbeast', 'CapstoneAspd', '6%', '5%');

  // ══════════════════════════ TƯỚNG ══════════════════════════

  // Cinderling ▼ — Base AD 45→40 + sát thương chiêu (xem quyết định 1 & 2).
  // statArray chấp nhận cả 45 (forms, giá trị thật trước vá) lẫn 40 (top-level,
  // lệch sẵn từ trước — 18.1af chỉ ghi vào forms).
  await updateChampion('champion:tft18_cinderling', {
    text: [['300/450/680', '310/465/700']],
    statArray: [{ field: 'attackDamage', index: 0, from: [45, 40], to: 40 }],
    calcEdits: [
      {
        calcId: 'cinderling:mac-inh:calc-1',
        terms: ['270/405/610', '280/420/630'],
        total: ['300/450/680', '310/465/700'],
      },
    ],
  });

  // Cassiopeia ▼ — sát thương chiêu 440/660/1050 → 400/600/950 AP.
  await updateChampion('champion:tft18_cassiopeia', {
    text: [['440/660/1050', '400/600/950']],
  });

  // Master Yi ▼ — Giáp & Kháng Phép 60→55 (top-level + cả 2 form AD/AP).
  await updateChampion('champion:tft18_masteryi', {
    statScalar: [
      { field: 'armor', from: 60, to: 55 },
      { field: 'magicResist', from: 60, to: 55 },
    ],
  });

  // Ahri ▼ — sát thương chiêu 450/675 → 425/640 AP (mốc 3 sao 3500 giữ nguyên).
  await updateChampion('champion:tft18_ahri', {
    text: [['450/675/3500', '425/640/3500']],
  });

  // Morgana ▼ — Năng Lượng 0/60 → 0/65.
  await updateChampion('champion:tft18_morgana', {
    mana: ['0 / 60', '0 / 65'],
    formMana: [{ label: 'Mặc định', from: '0 / 60', to: '0 / 65' }],
    statArray: [{ field: 'mana', index: 1, from: [60], to: 65 }],
  });

  // Amumu ▲ — Năng Lượng 30/140 → 30/125 và hệ số hồi máu 2.2% → 2.5%.
  // Dãy số hiển thị dẫn xuất "29.04/29.15/30.8" GIỮ NGUYÊN (quyết định 4).
  await updateChampion('champion:tft18_amumu', {
    mana: ['30 / 140', '30 / 125'],
    formMana: [{ label: 'Mặc định', from: '30 / 140', to: '30 / 125' }],
    statArray: [{ field: 'mana', index: 1, from: [140], to: 125 }],
    calcEdits: [{ calcId: 'amumu:mac-inh:calc-1', terms: ['2.2%', '2.5%'] }],
  });

  // Soraka ▲ — sát thương tinh tú đầu 190/285 → 225/335 AP.
  // Dùng chuỗi số trần: chỉ tinh tú ĐẦU mới là 190/285/1000; ba tinh tú phụ là
  // 100/150/1000 (không đổi) nên không có nguy cơ thay nhầm.
  await updateChampion('champion:tft18_soraka', {
    text: [['190/285/1000', '225/335/1000']],
  });

  // Draven ▲ — Năng Lượng 0/120 → 0/110, Tốc Độ Đánh gốc 0.8 → 0.85.
  // Chuỗi `mana` top-level ("0 / 140") lệch sẵn từ TRƯỚC bản vá này (đúng phải
  // là 120, khớp stats.mana và forms[0].mana). Người dùng chốt sửa luôn cho
  // đúng — đây là chuỗi mà thẻ tướng trên UI hiển thị. Assert theo giá trị
  // THẬT hiện có ("0 / 140"), không theo "from" của patch note.
  // KHÔNG đưa mục này lên /patch: nó là dọn dữ liệu lệch sẵn, không phải nội
  // dung bản vá 18.1d.
  // Lưu ý: ability text của Draven có "140/210/3000" là sát thương chảy máu,
  // KHÔNG phải năng lượng — tuyệt đối không đụng vào (đó là lý do chỉ sửa
  // đúng trường `mana` chứ không thay chuỗi "140" toàn cục).
  await updateChampion('champion:tft18_draven', {
    mana: ['0 / 140', '0 / 110'],
    formMana: [{ label: 'Mặc định', from: '0 / 120', to: '0 / 110' }],
    statArray: [{ field: 'mana', index: 1, from: [120], to: 110 }],
    statScalar: [{ field: 'attackSpeed', from: 0.8, to: 0.85 }],
  });

  // The Elder Dragon ▲ — Base AD 115 → 125 (xem quyết định 3: bù luôn nhịp
  // 110→115 bị bỏ lỡ ở 18.1ag; assert chấp nhận cả 110 lẫn 100).
  await updateChampion('champion:tft18_elderdragon', {
    statArray: [{ field: 'attackDamage', index: 0, from: [110, 100], to: 125 }],
  });

  // Lux ▲▼ — sát thương chiêu 330/520 → 355/550 AP (áp cho cả 10 form),
  // kèm nerf riêng phần thưởng Mặt Trăng: Suy Yếu 10% → 8%.
  await updateChampion('champion:tft18_lux', {
    text: [['330/520/5000', '355/550/5000']],
    formText: [
      {
        label: 'Mặt Trăng',
        edits: [['<span class="s18-value">10</span>% lên kẻ địch', '<span class="s18-value">8</span>% lên kẻ địch']],
      },
    ],
  });

  console.log(DRY_RUN ? '\n=== DRY RUN xong — chưa ghi gì ===' : '\n=== Xong ===');
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
