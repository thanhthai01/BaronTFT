// Giai đoạn 3 của "Dọn lỗi dữ liệu DB codex Set 18": đồng bộ `stats` top-level
// = `forms[0].stats` cho các tướng còn lệch. UI CHỈ đọc `form.stats`
// (statRows(form.stats) tại ChampionCard.tsx) — top-level là dữ liệu chết,
// không ảnh hưởng hiển thị, nhưng là nguyên nhân gốc khiến 2 lượt áp patch
// trước (18.1af, 18.1ag) từng soi nhầm chỗ.
//
// Hỗ trợ --dry-run — LUÔN chạy trước khi ghi thật.
//
// Hướng đồng bộ: form thắng (không phải top). Xác nhận qua patch history có
// sẵn trong pbe-notes/:
// - Master Yi AD 67→65 (18.1ae), Pebbles AD 30→35 (18.1af), Kha'Zix Health
//   850→950 (18.1af), Kha'Zix AS 0.8→0.85 (18.1ae), Brambleback AD 110→115
//   (18.1af), Draven AD 48→40 (tiền lệ 18.1af: "base AD ghi vào
//   forms[].stats.attackDamage[0], không ghi top-level" — pbe-notes/
//   Patch_TFT18.1d-live-micropatch.md dòng 95) — tất cả xác nhận forms[0] là
//   giá trị ĐÃ vá đúng, top-level là dữ liệu cũ trước khi tách forms.
// - Kennen attackSpeed 0.85→0.9: không tìm thấy patch note riêng, nhưng
//   khớp đúng pattern hệ thống ở trên (forms luôn là nơi patch ghi vào) —
//   áp dụng cùng quy tắc.
import { eq, inArray } from 'drizzle-orm';
import { db } from '../../src/db/client';
import { set18Champions } from '../../src/db/schema';

const DRY_RUN = process.argv.includes('--dry-run');

const IDS = [
  'champion:tft18_pebbles',
  'champion:tft18_khazix',
  'champion:tft18_masteryi',
  'champion:tft18_brambleback',
  'champion:tft18_draven',
  'champion:tft18_kennen',
];

async function main() {
  const rows = await db.select().from(set18Champions).where(inArray(set18Champions.id, IDS));
  for (const row of rows) {
    const forms = row.forms as any[];
    const formStats = forms[0].stats;
    const before = row.stats as any;
    const after = { ...before, ...formStats };

    if (JSON.stringify(before) === JSON.stringify(after)) {
      console.log(`= ${row.id}: đã khớp, bỏ qua`);
      continue;
    }

    if (DRY_RUN) {
      console.log(`[DRY-RUN] champion ${row.id}`);
      console.log(`    stats: ${JSON.stringify(before)} -> ${JSON.stringify(after)}`);
      continue;
    }

    await db.update(set18Champions).set({ stats: after, updatedAt: new Date() }).where(eq(set18Champions.id, row.id));
    console.log(`✓ champion ${row.id}`);
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
