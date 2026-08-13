// Đồng bộ bản dịch tiếng Việt cho set18_augments từ vntft.com/loi-nang-cap.
//
// Input:
//   .claude/tmp/final_updates.json — 194 augment đã khớp tên với DB, chỉ update description_vi.
//   .claude/tmp/final_inserts.json — 316 augment vntft không khớp DB nào, insert mới với
//     is_published=false, season=null để chờ soát lại thủ công (thiếu name tiếng Anh,
//     category, icon, associatedTraits, rounds — cần bổ sung sau khi review).
//
// Chạy dry-run trước khi ghi thật:
//   pnpm tsx scripts/db/apply-vntft-augment-sync.ts --dry-run
//   pnpm tsx scripts/db/apply-vntft-augment-sync.ts
import { readFileSync } from 'node:fs';
import { eq } from 'drizzle-orm';
import { db } from '../../src/db/client';
import { set18Augments } from '../../src/db/schema';
import { assertKnownDbTarget, logDbTarget } from './lib/db-target';

type UpdateRow = { id: string; description_vi: string };
type InsertRow = {
  id: string;
  name: string;
  name_vi: string;
  rarity: 'Silver' | 'Gold' | 'Prismatic';
  rarity_color: string;
  category: string;
  category_vi: string;
  description: string;
  description_vi: string;
  icon: string;
  associated_traits: string[];
  rounds: string[];
  round_variants: string[];
  season: number | null;
  is_published: boolean;
};

function readJson<T>(relPath: string): T {
  return JSON.parse(readFileSync(relPath, 'utf8')) as T;
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const target = assertKnownDbTarget('apply-vntft-augment-sync', process.env);
  logDbTarget('apply-vntft-augment-sync', target);

  const updates = readJson<UpdateRow[]>('.claude/tmp/final_updates.json');
  const inserts = readJson<InsertRow[]>('.claude/tmp/final_inserts.json');

  console.log(`Updates (description_vi cho augment đã khớp DB): ${updates.length}`);
  console.log(`Inserts (augment mới, is_published=false, chờ soát): ${inserts.length}`);

  if (dryRun) {
    console.log('\n--dry-run: không ghi gì vào DB.');
    console.log('Mẫu update đầu tiên:', JSON.stringify(updates[0], null, 2));
    console.log('Mẫu insert đầu tiên:', JSON.stringify(inserts[0], null, 2));
    return;
  }

  let updated = 0;
  for (const u of updates) {
    const [row] = await db.select().from(set18Augments).where(eq(set18Augments.id, u.id));
    if (!row) {
      console.warn(`⚠ Bỏ qua update — không tìm thấy id ${u.id}`);
      continue;
    }
    await db
      .update(set18Augments)
      .set({ descriptionVi: u.description_vi, season: 18, updatedAt: new Date() })
      .where(eq(set18Augments.id, u.id));
    updated++;
  }
  console.log(`✓ Đã update ${updated}/${updates.length} augment.`);

  let inserted = 0;
  for (const ins of inserts) {
    const [existing] = await db.select().from(set18Augments).where(eq(set18Augments.id, ins.id));
    if (existing) {
      console.warn(`⚠ Bỏ qua insert — id đã tồn tại ${ins.id}`);
      continue;
    }
    await db.insert(set18Augments).values({
      id: ins.id,
      name: ins.name,
      nameVi: ins.name_vi,
      rarity: ins.rarity,
      rarityColor: ins.rarity_color,
      category: ins.category,
      categoryVi: ins.category_vi,
      description: ins.description,
      descriptionVi: ins.description_vi,
      icon: ins.icon,
      associatedTraits: ins.associated_traits,
      rounds: ins.rounds,
      roundVariants: ins.round_variants,
      season: ins.season,
      isPublished: ins.is_published,
    });
    inserted++;
  }
  console.log(`✓ Đã insert ${inserted}/${inserts.length} augment mới.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
