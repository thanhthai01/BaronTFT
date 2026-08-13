-- Add UI visibility flag and season tracking to set18_items.
-- Some items scraped from external references turned out to be from an
-- earlier season (e.g. vnTFT item pages that hadn't been updated for Set 18)
-- rather than genuinely part of Set 18. Rather than deleting that reference
-- data, mark it visible=false + season=<real season> so it stays queryable
-- but the UI can filter it out.
-- Run `pnpm db:validate-constraints` against the intended target before applying.

ALTER TABLE "set18_items"
  ADD COLUMN IF NOT EXISTS "visible" boolean NOT NULL DEFAULT true;

ALTER TABLE "set18_items"
  ADD COLUMN IF NOT EXISTS "season" integer NOT NULL DEFAULT 18;
