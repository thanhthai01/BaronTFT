// Xoá vĩnh viễn một hoặc nhiều bản vá khỏi DB theo id. `patch_entries` có
// onDelete: 'cascade' trên `report_id` nên xoá `patch_reports` là đủ, không
// cần xoá `patch_entries` riêng.
//
// Cách dùng:
//   dotenv -e .env.local -- tsx scripts/db/delete-patch-reports.ts <id1> <id2> ...
// Sau khi xoá, chạy `pnpm db:pull` để đồng bộ lại patch-notes.generated.ts.

import { inArray } from 'drizzle-orm';
import { db } from '../../src/db/client';
import { patchReports } from '../../src/db/schema';

async function main() {
  const ids = process.argv.slice(2);
  if (ids.length === 0) {
    console.error('Dùng: pnpm tsx scripts/db/delete-patch-reports.ts <id1> <id2> ...');
    process.exit(1);
  }

  const deleted = await db.delete(patchReports).where(inArray(patchReports.id, ids)).returning({ id: patchReports.id });

  console.log(`✓ Đã xoá ${deleted.length}/${ids.length} bản vá:`, deleted.map((row) => row.id));
  const missing = ids.filter((id) => !deleted.some((row) => row.id === id));
  if (missing.length > 0) {
    console.warn('Không tìm thấy (đã xoá trước đó hoặc sai id):', missing);
  }
  console.log('Chạy `pnpm db:pull` để đồng bộ lại patch-notes.generated.ts, rồi `git diff` để duyệt trước khi commit.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
