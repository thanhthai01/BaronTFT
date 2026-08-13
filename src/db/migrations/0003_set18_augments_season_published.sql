-- Add season tracking and publish gating to set18_augments so augments
-- sourced from other seasons/unverified drops can be stored without
-- appearing in the current Set 18 UI.
-- Run `pnpm db:validate-constraints` against the intended target before applying.

-- season is nullable: newly scraped augments whose season/set is not yet
-- confirmed are inserted with season = NULL until reviewed.
ALTER TABLE "set18_augments"
  ADD COLUMN IF NOT EXISTS "season" integer;

ALTER TABLE "set18_augments"
  ADD COLUMN IF NOT EXISTS "is_published" boolean DEFAULT true NOT NULL;

UPDATE "set18_augments"
SET "season" = 18
WHERE "season" IS NULL;
