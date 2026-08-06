// Schema Drizzle cho dữ liệu Set 18 (tướng/tộc/nâng cấp/Tinh Linh) và bản vá,
// nguồn thay thế cho Website/src/content/set18/*.ts + patch-notes.ts.
//
// Các trường lồng nhau (stats, forms, breakpointDetails, changes...) giữ nguyên
// dạng jsonb — cấu trúc các trường này khác nhau tuỳ loại và ít khi cần query
// theo từng field con, nên không tách bảng con. Field dùng để lọc/sắp xếp/join
// (name, cost, kind, category, entityId...) mới lên cột riêng.

import { pgTable, text, integer, boolean, jsonb, timestamp } from 'drizzle-orm/pg-core';

export const set18Champions = pgTable('set18_champions', {
  id: text('id').primaryKey(), // khớp entity-index, vd "champion:tft18_akali"
  name: text('name').notNull(),
  cost: integer('cost').notNull(),
  costLabel: text('cost_label').notNull(),
  costColor: text('cost_color').notNull(),
  image: text('image').notNull(),
  traits: jsonb('traits').$type<string[]>().notNull(),
  mana: text('mana').notNull(),
  range: text('range').notNull(),
  role: text('role').notNull(),
  abilityIcon: text('ability_icon').notNull(),
  abilityName: text('ability_name').notNull(),
  abilityNameVi: text('ability_name_vi').notNull(),
  ability: text('ability').notNull(),
  abilityVi: text('ability_vi').notNull(),
  stats: jsonb('stats').notNull(), // Set18ChampionStats
  forms: jsonb('forms'), // Set18ChampionForm[] | null — chỉ 6 tướng nhiều dạng
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const set18Traits = pgTable('set18_traits', {
  id: text('id').primaryKey(), // vd "trait:elderwood"
  name: text('name').notNull(),
  vi: text('vi').notNull(),
  type: text('type').notNull(), // 'Origin' | 'Class' | 'Unique'
  typeVi: text('type_vi').notNull(),
  accent: text('accent').notNull(),
  accentSoft: text('accent_soft').notNull(),
  breakpoints: jsonb('breakpoints').$type<string[]>().notNull(),
  breaksLabel: text('breaks_label').notNull(),
  breakpointDetails: jsonb('breakpoint_details').notNull(), // Set18TraitBreakpoint[]
  iconSlug: text('icon_slug').notNull(),
  icon: text('icon').notNull(),
  description: text('description').notNull(),
  descriptionVi: text('description_vi').notNull(),
  champions: jsonb('champions').$type<string[]>().notNull(),
  infoChips: jsonb('info_chips').$type<string[]>(),
  bounties: jsonb('bounties'), // { mission, reward, difficulty }[] | null — chỉ Draven
  subEffects: jsonb('sub_effects'), // { title?, items: {label,text}[] } | null
  note: text('note'),
  activation: text('activation'),
  wide: boolean('wide'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const set18Augments = pgTable('set18_augments', {
  id: text('id').primaryKey(), // vd "augment:da_loadeddice"
  name: text('name').notNull(),
  nameVi: text('name_vi').notNull(),
  rarity: text('rarity').notNull(), // 'Silver' | 'Gold' | 'Prismatic'
  rarityColor: text('rarity_color').notNull(),
  category: text('category').notNull(),
  categoryVi: text('category_vi').notNull(),
  description: text('description').notNull(),
  descriptionVi: text('description_vi').notNull(),
  icon: text('icon').notNull(),
  associatedTraits: jsonb('associated_traits').$type<string[]>().notNull(),
  rounds: jsonb('rounds').$type<string[]>().notNull(),
  roundVariants: jsonb('round_variants').$type<string[]>().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const set18Wisps = pgTable('set18_wisps', {
  id: text('id').primaryKey(), // vd "wisp:doodad-sack"
  name: text('name').notNull(),
  nameVi: text('name_vi').notNull(),
  category: text('category').notNull(),
  categoryVi: text('category_vi').notNull(),
  categoryIcon: text('category_icon').notNull(),
  tier: integer('tier').notNull(),
  cost: integer('cost'),
  description: text('description').notNull(),
  descriptionVi: text('description_vi').notNull(),
  blossomUpgradeCost: integer('blossom_upgrade_cost'),
  blossomUpgradeDescriptionVi: text('blossom_upgrade_description_vi'),
  appearsVi: text('appears_vi').notNull(),
  appearsStart: text('appears_start'),
  appearsEnd: text('appears_end'),
  conditionsVi: jsonb('conditions_vi').$type<string[]>().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const set18Items = pgTable('set18_items', {
  id: text('id').primaryKey(), // vd "item:da_deathblade"
  apiName: text('api_name').notNull(),
  name: text('name').notNull(),
  nameVi: text('name_vi').notNull(),
  /** Quyết định luôn kiểu viền hiển thị: Radiant = viền vàng, Artifact = viền
   * Ornn (cam/đỏ). Component/Normal/Emblem/Other/Armory dùng viền xám mặc định. */
  category: text('category').notNull(), // 'Component'|'Normal'|'Emblem'|'Artifact'|'Radiant'|'Other'|'Armory'
  description: text('description').notNull(),
  descriptionVi: text('description_vi').notNull(),
  icon: text('icon').notNull(),
  statLine: text('stat_line'), // chuỗi số liệu thô tiếng Anh từ MetaTFT, chưa soát — fallback khi chưa có statBadges
  compositionApi: jsonb('composition_api').$type<string[]>().notNull(), // apiName của 2 nguyên liệu ghép ra item này, [] nếu không ghép
  unique: boolean('unique').notNull(),
  /** Chỉ set cho item đã soát tay khớp giữa statLine và mô tả thật trong game —
   * KHÔNG suy đoán hàng loạt từ statLine (đã phát hiện lệch, vd Titan's Resolve
   * có giá trị HP hard-code không nằm trong statLine tự động trích xuất). */
  statBadges: jsonb('stat_badges').$type<{ stat: string; value: string }[]>(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const patchReports = pgTable('patch_reports', {
  id: text('id').primaryKey(), // vd "patch-17-8"
  /** Thứ tự hiển thị — SỐ CÀNG NHỎ CÀNG MỚI (0 = patchReports[0] = bản mới nhất).
   * Cố ý không dùng `createdAt`/thời điểm insert để xếp thứ tự: bản vá áp dụng
   * sau (qua apply-patch-draft) chưa chắc mới hơn nội dung — người biên soạn có
   * thể backfill bản cũ. Cột này set tường minh mỗi lần ghi. */
  reportOrder: integer('report_order').notNull(),
  version: text('version').notNull(),
  title: text('title').notNull(),
  author: text('author').notNull(),
  source: jsonb('source'), // { label, url? } | null
  entitySet: integer('entity_set').default(18),
  dateVi: text('date_vi').notNull(),
  summaryVi: text('summary_vi').notNull(),
  summaryOrigin: text('summary_origin'), // 'official' | 'analysis'
  rhythmVi: jsonb('rhythm_vi').$type<string[]>(),
  impacts: jsonb('impacts'), // PatchImpact[] | null
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const patchEntries = pgTable('patch_entries', {
  id: text('id').primaryKey(), // vd "p178-briar"
  reportId: text('report_id')
    .notNull()
    .references(() => patchReports.id, { onDelete: 'cascade' }),
  sortOrder: integer('sort_order').notNull(), // giữ đúng thứ tự entries[] gốc
  entityId: text('entity_id'), // trỏ set18_entity_index (champion:.../trait:...)
  category: text('category').notNull(), // PatchCategory
  kind: text('kind').notNull(), // 'buff' | 'nerf' | 'rework' | 'mechanic'
  name: text('name').notNull(),
  note: text('note'),
  icon: text('icon'),
  cost: integer('cost'),
  rarity: text('rarity'),
  wispTier: integer('wisp_tier'),
  wispCategory: text('wisp_category'),
  breakpoint: text('breakpoint'),
  breakpointStyle: text('breakpoint_style'),
  changes: jsonb('changes'), // { label, from, to }[] | null
});
