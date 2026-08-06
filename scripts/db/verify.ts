// Kiểm tra nhanh dữ liệu trong DB sau khi seed/apply patch — đếm số dòng mỗi
// bảng và in thử 1 bản ghi để soát bằng mắt (đủ trường, không rỗng, đúng dấu).
// Chạy: pnpm db:verify

import { db } from '../../src/db/client';
import { set18Champions, set18Traits, set18Augments, set18Wisps, patchReports, patchEntries } from '../../src/db/schema';
import { count } from 'drizzle-orm';

async function main() {
  const [champions, traits, augments, wisps, reports, entries] = await Promise.all([
    db.select({ n: count() }).from(set18Champions),
    db.select({ n: count() }).from(set18Traits),
    db.select({ n: count() }).from(set18Augments),
    db.select({ n: count() }).from(set18Wisps),
    db.select({ n: count() }).from(patchReports),
    db.select({ n: count() }).from(patchEntries),
  ]);

  console.log('set18_champions:', champions[0].n);
  console.log('set18_traits:', traits[0].n);
  console.log('set18_augments:', augments[0].n);
  console.log('set18_wisps:', wisps[0].n);
  console.log('patch_reports:', reports[0].n);
  console.log('patch_entries:', entries[0].n);

  const sample = await db.select().from(set18Champions).limit(1);
  console.log('\nSample champion:', JSON.stringify(sample[0], null, 2).slice(0, 800));
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
