// Nạp toàn bộ dữ liệu Set 18 hiện có trong src/content/set18/*.ts + patch-notes.ts
// vào Postgres. Idempotent — dùng upsert theo id nên chạy lại bao nhiêu lần cũng
// an toàn, không tạo bản trùng. Đây là script migrate MỘT LẦN từ file tĩnh sang DB;
// sau khi DB là nguồn thật, cập nhật patch mới đi qua script khác (apply-patch-draft),
// không chạy lại script này trừ khi cần đồng bộ lại từ đầu.
//
// Chạy: pnpm db:seed  (cần DATABASE_URL trong .env.local)

import { sql } from 'drizzle-orm';
import { db } from '../../src/db/client';
import { set18Champions, set18Traits, set18Augments, set18Wisps, patchReports, patchEntries } from '../../src/db/schema';
import { set18Champions as champions } from '../../src/content/set18/set18-champions';
import { set18Traits as traits } from '../../src/content/set18/set18-traits';
import { set18Augments as augments } from '../../src/content/set18/set18-augments';
import { set18Wisps as wisps } from '../../src/content/set18/set18-wisps';
import { set18EntityByKindAndName } from '../../src/content/set18/set18-entity-index';
import { patchReports as reports } from '../../src/content/patch-notes';

function resolveId(kind: 'champion' | 'trait' | 'wisp', name: string): string {
  const entry = set18EntityByKindAndName.get(`${kind}:${name}`);
  if (!entry) {
    throw new Error(`Không tìm thấy entity-index cho ${kind}:${name} — kiểm tra lại set18-entity-index.ts trước khi seed.`);
  }
  return entry.id;
}

/** Nhiều augment dùng chung `name` hiển thị nhưng là biến thể khác nhau (khác
 * tướng thưởng, khác mốc +/++) — vd 4 dòng "Beast Within" trỏ 4 icon khác nhau.
 * set18-entity-index chỉ giữ 1 id/tên nên KHÔNG dùng được làm khoá cho augment;
 * `icon` là field duy nhất unique trên toàn bộ 261 dòng (đã kiểm chứng riêng),
 * dùng nó làm khoá thay vì tên. */
function augmentIdFromIcon(icon: string): string {
  const basename = icon.split('/').pop()!.replace(/\.(png|jpg|jpeg)$/i, '');
  return `augment:${basename}`;
}

async function seedChampions() {
  const rows = champions.map((c) => ({
    id: resolveId('champion', c.name),
    name: c.name,
    cost: c.cost,
    costLabel: c.costLabel,
    costColor: c.costColor,
    image: c.image,
    traits: c.traits,
    mana: c.mana,
    range: c.range,
    role: c.role,
    abilityIcon: c.abilityIcon,
    abilityName: c.abilityName,
    abilityNameVi: c.abilityNameVi,
    ability: c.ability,
    abilityVi: c.abilityVi,
    stats: c.stats,
    forms: c.forms ?? null,
  }));
  for (const row of rows) {
    await db
      .insert(set18Champions)
      .values(row)
      .onConflictDoUpdate({ target: set18Champions.id, set: { ...row, updatedAt: sql`now()` } });
  }
  console.log(`✓ set18_champions: ${rows.length} dòng`);
}

async function seedTraits() {
  const rows = traits.map((t) => ({
    id: resolveId('trait', t.name),
    name: t.name,
    vi: t.vi,
    type: t.type,
    typeVi: t.typeVi,
    accent: t.accent,
    accentSoft: t.accentSoft,
    breakpoints: t.breakpoints,
    breaksLabel: t.breaksLabel,
    breakpointDetails: t.breakpointDetails,
    iconSlug: t.iconSlug,
    icon: t.icon,
    description: t.description,
    descriptionVi: t.descriptionVi,
    champions: t.champions,
    infoChips: t.infoChips ?? null,
    bounties: t.bounties ?? null,
    subEffects: t.subEffects ?? null,
    note: t.note ?? null,
    activation: t.activation ?? null,
    wide: t.wide ?? null,
  }));
  for (const row of rows) {
    await db
      .insert(set18Traits)
      .values(row)
      .onConflictDoUpdate({ target: set18Traits.id, set: { ...row, updatedAt: sql`now()` } });
  }
  console.log(`✓ set18_traits: ${rows.length} dòng`);
}

async function seedAugments() {
  const rows = augments.map((a) => ({
    id: augmentIdFromIcon(a.icon),
    name: a.name,
    nameVi: a.nameVi,
    rarity: a.rarity,
    rarityColor: a.rarityColor,
    category: a.category,
    categoryVi: a.categoryVi,
    description: a.description,
    descriptionVi: a.descriptionVi,
    icon: a.icon,
    associatedTraits: a.associatedTraits,
    rounds: a.rounds,
    roundVariants: a.roundVariants,
  }));
  for (const row of rows) {
    await db
      .insert(set18Augments)
      .values(row)
      .onConflictDoUpdate({ target: set18Augments.id, set: { ...row, updatedAt: sql`now()` } });
  }
  console.log(`✓ set18_augments: ${rows.length} dòng`);
}

async function seedWisps() {
  const rows = wisps.map((w) => ({
    id: resolveId('wisp', w.name),
    name: w.name,
    nameVi: w.nameVi,
    category: w.category,
    categoryVi: w.categoryVi,
    categoryIcon: w.categoryIcon,
    tier: w.tier,
    cost: w.cost,
    description: w.description,
    descriptionVi: w.descriptionVi,
    blossomUpgradeCost: w.blossomUpgradeCost,
    blossomUpgradeDescriptionVi: w.blossomUpgradeDescriptionVi,
    appearsVi: w.appearsVi,
    appearsStart: w.appearsStart,
    appearsEnd: w.appearsEnd,
    conditionsVi: w.conditionsVi,
  }));
  for (const row of rows) {
    await db
      .insert(set18Wisps)
      .values(row)
      .onConflictDoUpdate({ target: set18Wisps.id, set: { ...row, updatedAt: sql`now()` } });
  }
  console.log(`✓ set18_wisps: ${rows.length} dòng`);
}

async function seedPatchNotes() {
  // reports[0] trong patch-notes.ts là bản mới nhất — giữ nguyên ý nghĩa đó bằng
  // reportOrder tường minh (0 = mới nhất) thay vì suy ra từ thời điểm insert.
  for (const [reportOrder, report] of reports.entries()) {
    const { entries, ...reportFields } = report;
    const row = { ...reportFields, reportOrder };
    await db
      .insert(patchReports)
      .values(row)
      .onConflictDoUpdate({ target: patchReports.id, set: row });

    let sortOrder = 0;
    for (const entry of entries) {
      await db
        .insert(patchEntries)
        .values({ ...entry, reportId: report.id, sortOrder })
        .onConflictDoUpdate({ target: patchEntries.id, set: { ...entry, reportId: report.id, sortOrder } });
      sortOrder += 1;
    }
  }
  console.log(`✓ patch_reports: ${reports.length} bản vá, ${reports.reduce((n, r) => n + r.entries.length, 0)} mục`);
}

async function main() {
  await seedChampions();
  await seedTraits();
  await seedAugments();
  await seedWisps();
  await seedPatchNotes();
  console.log('Seed hoàn tất.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
