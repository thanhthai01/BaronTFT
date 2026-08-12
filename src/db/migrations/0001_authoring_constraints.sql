-- Authoring data safety constraints for Baron TFT.
-- Run `pnpm db:validate-constraints` against the intended target before applying.

CREATE UNIQUE INDEX IF NOT EXISTS "patch_reports_report_order_unique"
  ON "patch_reports" ("report_order");

CREATE UNIQUE INDEX IF NOT EXISTS "set18_tips_slug_unique"
  ON "set18_tips" ("slug");

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'patch_entries_category_check') THEN
    ALTER TABLE "patch_entries"
      ADD CONSTRAINT "patch_entries_category_check"
      CHECK ("category" IN ('champion', 'trait', 'item', 'wisp', 'augment', 'mechanic'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'patch_entries_kind_check') THEN
    ALTER TABLE "patch_entries"
      ADD CONSTRAINT "patch_entries_kind_check"
      CHECK ("kind" IN ('buff', 'nerf', 'rework', 'mechanic'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'set18_augments_rarity_check') THEN
    ALTER TABLE "set18_augments"
      ADD CONSTRAINT "set18_augments_rarity_check"
      CHECK ("rarity" IN ('Silver', 'Gold', 'Prismatic'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'set18_traits_type_check') THEN
    ALTER TABLE "set18_traits"
      ADD CONSTRAINT "set18_traits_type_check"
      CHECK ("type" IN ('Origin', 'Class', 'Unique'));
  END IF;
END $$;
