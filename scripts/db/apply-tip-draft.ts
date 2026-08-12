// Đẩy MỘT mẹo vào DB. Draft là 1 file .ts export default một object đúng type
// `Set18Tip` (xem type trong src/content/set18/set18-types.ts). Draft trùng id
// một mẹo đã có thì cập nhật nội dung (upsert theo id).
//
// Cách dùng:
//   1. Soạn file draft, vd scripts/db/drafts/tip-akali-ap-carry.ts:
//        import type { Set18Tip } from '../../../src/content/set18/set18-types';
//        const tip: Set18Tip = {
//          id: 'tip-akali-ap-carry',
//          slug: 'akali-ap-carry',
//          titleVi: '...',
//          contentVi: '...',
//          entityIds: ['champion:tft18_akali'],
//          championIds: ['champion:tft18_akali'], // legacy compatibility
//          traitIds: [],
//          sourceUrl: 'https://www.datatft.com/tip/...',
//        };
//        export default tip;
//   2. pnpm db:apply-tip scripts/db/drafts/tip-akali-ap-carry.ts
//   3. pnpm db:pull   (đồng bộ lại set18-tips.ts)
//   4. git diff Website/src/content/set18/set18-tips.ts   (duyệt trước khi commit)

import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { neon } from '@neondatabase/serverless';
import type { Set18Tip } from '../../src/content/set18/set18-types';
import { set18EntityIndex } from '../../src/content/set18/set18-entity-index';
import { assertKnownDbTarget, logDbTarget } from './lib/db-target';
import { assertValidTipLinks, buildTipUpsertPlan, normalizeTipForWrite } from './lib/tip-draft';

async function loadDraft(filePath: string): Promise<Set18Tip> {
  const absPath = path.resolve(process.cwd(), filePath);
  const mod: Record<string, unknown> = await import(pathToFileURL(absPath).href);
  const tip = (mod.default ?? mod.tip) as Set18Tip | undefined;
  if (!tip) {
    throw new Error(`Draft "${filePath}" phải export default (hoặc export const tip) một object Set18Tip.`);
  }
  if (!tip.id || !tip.slug || !tip.titleVi || !tip.contentVi) {
    throw new Error(`Draft "${filePath}" thiếu field bắt buộc (id/slug/titleVi/contentVi) — kiểm tra lại đúng type Set18Tip.`);
  }
  return tip;
}

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Dùng: pnpm db:apply-tip <đường dẫn file draft.ts>');
    process.exit(1);
  }

  const target = assertKnownDbTarget('db:apply-tip');
  logDbTarget('write', target);
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL chưa được set.');
  const sql = neon(process.env.DATABASE_URL);

  const tip = normalizeTipForWrite(await loadDraft(filePath));
  assertValidTipLinks(tip, set18EntityIndex);
  const entityIdsColumn = await sql.query(
    'select exists (select 1 from information_schema.columns where table_schema = $1 and table_name = $2 and column_name = $3) as exists',
    ['public', 'set18_tips', 'entity_ids'],
  ) as { exists: boolean }[];
  const plan = buildTipUpsertPlan(tip, entityIdsColumn[0]?.exists ?? false);
  await sql.query(plan.sql, plan.values);

  console.log(`✓ Đã ghi mẹo "${tip.id}".`);
  console.log('Chạy `pnpm db:pull` để đồng bộ lại set18-tips.ts, rồi `git diff` để duyệt trước khi commit.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
