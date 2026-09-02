// Dọn lỗi dữ liệu DB codex Set 18 phát hiện qua audit sau bản vá 18.1d — xem
// kế hoạch "Dọn lỗi dữ liệu DB + hiển thị UI cho codex Set 18".
//
// Hỗ trợ --dry-run (log before/after, không ghi DB) — LUÔN chạy trước khi
// ghi thật.
//
// Đã đối chiếu trực tiếp với DB thật (đọc-only) trước khi viết script này,
// và đối chiếu ngược với pbe-notes/Patch_TFT18.1ag-skipped-items.md để xác
// nhận Maokai HP đích đúng là 1150 (patch note "Maokai HP (1100→1150)" từng
// bị skip ở 18.1ag vì forms.health lúc đó là [0,0,0]).
//
// Nguồn số liệu Máu/STVL sao 1 (Rakan, Fiddlesticks, Ivern, Gnar, Kog'Maw,
// Maokai): ảnh chụp màn hình tftips.app/vi do người dùng cung cấp trực tiếp
// (không scrape được bằng công cụ — trang render bằng SVG radar chart không
// có text số liệu). Sao 2/3 tính theo hệ số chuẩn TFT (Máu x1.8/sao, STVL
// x1.5/sao mỗi sao) — đã verify khớp 100% với Ashe (tướng không lỗi trong
// data local: 75/112.5/168.75). Số thập phân .5 làm tròn xuống theo tiền lệ
// duy nhất quan sát được trong DB thật (Fiddlesticks AD 112.5 lưu là 112).
// Người dùng đã xác nhận cả 2 điểm này trước khi chạy.
//
// Camille: ability/abilityVi đã ghi sẵn "160/240/410" nhưng calcs.total vẫn
// ở "160/240/390" — vá lại calc cho khớp text đã đúng từ trước.
//
// Riftbeast (Quái Rừng) mốc 7: DB ghi Armor/MR/Health +6/+6/+60, dữ liệu
// game đúng là +5/+5/+50 — người dùng xác nhận qua đối chiếu tftips.
import { eq } from 'drizzle-orm';
import { db } from '../../src/db/client';
import { set18Champions, set18Traits } from '../../src/db/schema';
import { assertKnownDbTarget, logDbTarget } from './lib/db-target';

const DRY_RUN = process.argv.includes('--dry-run');

function diffLine(label: string, from: unknown, to: unknown) {
  const a = JSON.stringify(from);
  const b = JSON.stringify(to);
  if (a === b) return;
  console.log(`    ${label}: ${a} -> ${b}`);
}

async function updateChampionStats(id: string, mutate: (stats: any, forms: any[]) => { stats: any; forms: any[] }) {
  const [row] = await db.select().from(set18Champions).where(eq(set18Champions.id, id));
  if (!row) throw new Error(`Champion không tìm thấy: ${id}`);
  const beforeStats = row.stats as any;
  const beforeForms = (row.forms as any[] | null) ?? [];
  const { stats, forms } = mutate(beforeStats, beforeForms);

  if (DRY_RUN) {
    console.log(`[DRY-RUN] champion ${id}`);
    diffLine('stats', beforeStats, stats);
    forms.forEach((f, i) => {
      diffLine(`forms[${i}].stats`, beforeForms[i]?.stats, f.stats);
      diffLine(`forms[${i}].calcs`, beforeForms[i]?.calcs, f.calcs);
    });
    return;
  }

  await db.update(set18Champions).set({ stats, forms, updatedAt: new Date() }).where(eq(set18Champions.id, id));
  console.log(`✓ champion ${id}`);
}

async function main() {
  const target = assertKnownDbTarget('apply-codex-fix-2026-09-02', process.env);
  logDbTarget('apply-codex-fix-2026-09-02', target);

  // ═══════════════ Máu/STVL bị 0/0/0 (lỗi "0/0/0" người dùng thấy) ═══════════════

  await updateChampionStats('champion:tft18_fiddlesticks', (stats, forms) => ({
    stats: { ...stats, health: [1000, 1800, 3240] },
    forms: forms.map((f) => ({ ...f, stats: { ...f.stats, health: [1000, 1800, 3240] } })),
  }));

  await updateChampionStats('champion:tft18_ivern', (stats, forms) => ({
    stats: { ...stats, health: [1000, 1800, 3240] },
    forms: forms.map((f) => ({ ...f, stats: { ...f.stats, health: [1000, 1800, 3240] } })),
  }));

  await updateChampionStats('champion:tft18_maokai', (stats, forms) => ({
    stats: { ...stats, health: [1150, 2070, 3726] },
    forms: forms.map((f) => ({ ...f, stats: { ...f.stats, health: [1150, 2070, 3726] } })),
  }));

  await updateChampionStats('champion:tft18_rakan', (stats, forms) => ({
    stats: { ...stats, attackDamage: [45, 67, 101] },
    forms: forms.map((f) => ({ ...f, stats: { ...f.stats, attackDamage: [45, 67, 101] } })),
  }));

  await updateChampionStats('champion:tft18_gnar', (stats, forms) => ({
    stats: { ...stats, attackDamage: [100, 150, 225] },
    forms: forms.map((f) => ({ ...f, stats: { ...f.stats, attackDamage: [100, 150, 225] } })),
  }));

  await updateChampionStats('champion:tft18_kogmaw', (stats, forms) => ({
    // Quy ước top-level = forms[0].stats (form "AD" đứng trước "AP").
    stats: { ...stats, attackDamage: [40, 60, 90] },
    forms: forms.map((f) => ({
      ...f,
      stats: { ...f.stats, attackDamage: f.label === 'AD' ? [40, 60, 90] : [30, 45, 67] },
    })),
  }));

  // ═══════════════ Camille: calc chưa khớp ability text đã đúng ═══════════════

  await updateChampionStats('champion:tft18_camille', (stats, forms) => ({
    stats,
    forms: forms.map((f) => ({
      ...f,
      calcs: (f.calcs ?? []).map((c: any) =>
        c.id === 'camille:mac-inh:calc-1'
          ? { ...c, terms: c.terms.replace('150/225/365', '150/225/385'), total: '160/240/410' }
          : c,
      ),
    })),
  }));

  // ═══════════════ Riftbeast (Quái Rừng) mốc 7 ═══════════════

  const [riftbeast] = await db.select().from(set18Traits).where(eq(set18Traits.id, 'trait:riftbeast'));
  if (!riftbeast) throw new Error('Trait không tìm thấy: trait:riftbeast');
  const beforeDetails = riftbeast.breakpointDetails as any[];
  const afterDetails = beforeDetails.map((d) => {
    if (d.threshold !== '7') return d;
    const values = d.bullet.values.map((v: any) => {
      if (v.row === 'CapstoneArmor') return { ...v, value: '5' };
      if (v.row === 'CapstoneMR') return { ...v, value: '5' };
      if (v.row === 'CapstoneHealth') return { ...v, value: '50' };
      return v;
    });
    return { ...d, bullet: { ...d.bullet, values } };
  });

  if (DRY_RUN) {
    console.log('[DRY-RUN] trait trait:riftbeast');
    diffLine('breakpointDetails[threshold=7]', beforeDetails.find((d) => d.threshold === '7'), afterDetails.find((d) => d.threshold === '7'));
  } else {
    await db.update(set18Traits).set({ breakpointDetails: afterDetails, updatedAt: new Date() }).where(eq(set18Traits.id, 'trait:riftbeast'));
    console.log('✓ trait trait:riftbeast');
  }
}

main()
  .then(() => {
    console.log(DRY_RUN ? 'DRY RUN xong — không có gì được ghi.' : 'Hoàn tất ghi DB.');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
