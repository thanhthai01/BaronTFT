-- Add canonical related-entity links for Set 18 tips while keeping legacy
-- champion_ids/trait_ids columns for draft and UI compatibility.
-- Run `pnpm db:validate-constraints` against the intended target before applying.

ALTER TABLE "set18_tips"
  ADD COLUMN IF NOT EXISTS "entity_ids" jsonb DEFAULT '[]'::jsonb;

UPDATE "set18_tips"
SET "entity_ids" = COALESCE("entity_ids", '[]'::jsonb) || COALESCE("champion_ids", '[]'::jsonb) || COALESCE("trait_ids", '[]'::jsonb)
WHERE jsonb_array_length(COALESCE("entity_ids", '[]'::jsonb)) = 0;

ALTER TABLE "set18_tips"
  ALTER COLUMN "entity_ids" SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'set18_tips_entity_ids_array_check') THEN
    ALTER TABLE "set18_tips"
      ADD CONSTRAINT "set18_tips_entity_ids_array_check"
      CHECK (jsonb_typeof("entity_ids") = 'array');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'set18_tips_champion_ids_array_check') THEN
    ALTER TABLE "set18_tips"
      ADD CONSTRAINT "set18_tips_champion_ids_array_check"
      CHECK (jsonb_typeof("champion_ids") = 'array');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'set18_tips_trait_ids_array_check') THEN
    ALTER TABLE "set18_tips"
      ADD CONSTRAINT "set18_tips_trait_ids_array_check"
      CHECK (jsonb_typeof("trait_ids") = 'array');
  END IF;
END $$;
