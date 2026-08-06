// Đẩy MỘT bản vá vào DB. Draft là 1 file .ts export default một object đúng
// type `PatchReport` (xem type trong src/content/patch-notes.ts). Draft mới (id
// chưa có trong DB) mặc định lên vị trí MỚI NHẤT (patchReports[0] sau khi pull).
// Draft trùng id một bản đã có thì cập nhật nội dung, GIỮ NGUYÊN vị trí hiện tại.
//
// Cách dùng:
//   1. Soạn file draft, vd scripts/db/drafts/patch-18-4.ts:
//        import type { PatchReport } from '../../../src/content/patch-notes';
//        const report: PatchReport = { id: 'patch-18-4', version: '...', ... };
//        export default report;
//   2. pnpm db:apply-patch scripts/db/drafts/patch-18-4.ts
//   3. pnpm db:pull   (đồng bộ lại patch-notes.generated.ts)
//   4. git diff Website/src/content/patch-notes.generated.ts  (duyệt trước khi commit)

import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { eq, min } from 'drizzle-orm';
import { db } from '../../src/db/client';
import { patchReports, patchEntries } from '../../src/db/schema';
import type { PatchReport } from '../../src/content/patch-notes';

async function loadDraft(filePath: string): Promise<PatchReport> {
  const absPath = path.resolve(process.cwd(), filePath);
  const mod: Record<string, unknown> = await import(pathToFileURL(absPath).href);
  const report = (mod.default ?? mod.report) as PatchReport | undefined;
  if (!report) {
    throw new Error(`Draft "${filePath}" phải export default (hoặc export const report) một object PatchReport.`);
  }
  if (!report.id || !report.entries) {
    throw new Error(`Draft "${filePath}" thiếu field bắt buộc (id/entries) — kiểm tra lại đúng type PatchReport.`);
  }
  return report;
}

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Dùng: pnpm db:apply-patch <đường dẫn file draft.ts>');
    process.exit(1);
  }

  const report = await loadDraft(filePath);
  const { entries, ...reportFields } = report;

  const existing = await db
    .select({ reportOrder: patchReports.reportOrder })
    .from(patchReports)
    .where(eq(patchReports.id, report.id));

  let reportOrder: number;
  if (existing.length > 0) {
    reportOrder = existing[0].reportOrder;
    console.log(`Bản vá "${report.id}" đã tồn tại — cập nhật nội dung, giữ nguyên vị trí (reportOrder=${reportOrder}).`);
  } else {
    const [{ minOrder }] = await db.select({ minOrder: min(patchReports.reportOrder) }).from(patchReports);
    reportOrder = minOrder === null ? 0 : minOrder - 1;
    console.log(`Bản vá "${report.id}" mới — thêm làm bản MỚI NHẤT (reportOrder=${reportOrder}).`);
  }

  const row = { ...reportFields, reportOrder };
  await db.insert(patchReports).values(row).onConflictDoUpdate({ target: patchReports.id, set: row });

  // Xoá sạch entries cũ của report này rồi ghi lại toàn bộ — đúng hơn upsert
  // từng entry khi draft có thể xoá/thêm/sắp lại thứ tự entries giữa các lần sửa.
  await db.delete(patchEntries).where(eq(patchEntries.reportId, report.id));
  let sortOrder = 0;
  for (const entry of entries) {
    await db.insert(patchEntries).values({ ...entry, reportId: report.id, sortOrder });
    sortOrder += 1;
  }

  console.log(`✓ Đã ghi "${report.id}": ${entries.length} mục.`);
  console.log('Chạy `pnpm db:pull` để đồng bộ lại patch-notes.generated.ts, rồi `git diff` để duyệt trước khi commit.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
