CREATE TABLE IF NOT EXISTS "set18_champions" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "nickname_vi" text,
  "cost" integer NOT NULL,
  "cost_label" text NOT NULL,
  "cost_color" text NOT NULL,
  "image" text NOT NULL,
  "traits" jsonb NOT NULL,
  "mana" text NOT NULL,
  "range" text NOT NULL,
  "role" text NOT NULL,
  "ability_icon" text NOT NULL,
  "ability_name" text NOT NULL,
  "ability_name_vi" text NOT NULL,
  "ability" text NOT NULL,
  "ability_vi" text NOT NULL,
  "stats" jsonb NOT NULL,
  "forms" jsonb,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "set18_traits" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "vi" text NOT NULL,
  "type" text NOT NULL,
  "type_vi" text NOT NULL,
  "accent" text NOT NULL,
  "accent_soft" text NOT NULL,
  "breakpoints" jsonb NOT NULL,
  "breaks_label" text NOT NULL,
  "breakpoint_details" jsonb NOT NULL,
  "icon_slug" text NOT NULL,
  "icon" text NOT NULL,
  "description" text NOT NULL,
  "description_vi" text NOT NULL,
  "champions" jsonb NOT NULL,
  "info_chips" jsonb,
  "bounties" jsonb,
  "sub_effects" jsonb,
  "note" text,
  "activation" text,
  "wide" boolean,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "set18_augments" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "name_vi" text NOT NULL,
  "rarity" text NOT NULL,
  "rarity_color" text NOT NULL,
  "category" text NOT NULL,
  "category_vi" text NOT NULL,
  "description" text NOT NULL,
  "description_vi" text NOT NULL,
  "icon" text NOT NULL,
  "associated_traits" jsonb NOT NULL,
  "rounds" jsonb NOT NULL,
  "round_variants" jsonb NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "set18_wisps" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "name_vi" text NOT NULL,
  "category" text NOT NULL,
  "category_vi" text NOT NULL,
  "category_icon" text NOT NULL,
  "tier" integer NOT NULL,
  "cost" integer,
  "description" text NOT NULL,
  "description_vi" text NOT NULL,
  "blossom_upgrade_cost" integer,
  "blossom_upgrade_description_vi" text,
  "appears_vi" text NOT NULL,
  "appears_start" text,
  "appears_end" text,
  "conditions_vi" jsonb NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "set18_items" (
  "id" text PRIMARY KEY NOT NULL,
  "api_name" text NOT NULL,
  "name" text NOT NULL,
  "name_vi" text NOT NULL,
  "category" text NOT NULL,
  "description" text NOT NULL,
  "description_vi" text NOT NULL,
  "icon" text NOT NULL,
  "stat_line" text,
  "composition_api" jsonb NOT NULL,
  "unique" boolean NOT NULL,
  "stat_badges" jsonb,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "patch_reports" (
  "id" text PRIMARY KEY NOT NULL,
  "report_order" integer NOT NULL,
  "version" text NOT NULL,
  "title" text NOT NULL,
  "author" text NOT NULL,
  "source" jsonb,
  "entity_set" integer DEFAULT 18,
  "date_vi" text NOT NULL,
  "summary_vi" text NOT NULL,
  "summary_origin" text,
  "rhythm_vi" jsonb,
  "impacts" jsonb,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "patch_entries" (
  "id" text PRIMARY KEY NOT NULL,
  "report_id" text NOT NULL REFERENCES "patch_reports"("id") ON DELETE CASCADE,
  "sort_order" integer NOT NULL,
  "entity_id" text,
  "category" text NOT NULL,
  "kind" text NOT NULL,
  "name" text NOT NULL,
  "note" text,
  "icon" text,
  "cost" integer,
  "rarity" text,
  "wisp_tier" integer,
  "wisp_category" text,
  "breakpoint" text,
  "breakpoint_style" text,
  "changes" jsonb
);

CREATE TABLE IF NOT EXISTS "set18_tips" (
  "id" text PRIMARY KEY NOT NULL,
  "slug" text NOT NULL,
  "title_vi" text NOT NULL,
  "content_vi" text NOT NULL,
  "champion_ids" jsonb NOT NULL,
  "trait_ids" jsonb NOT NULL,
  "source_url" text,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
