import { sql } from 'drizzle-orm';
import { db } from '../../src/db/client';

async function main() {
  await db.execute(sql.raw(`
    CREATE TABLE IF NOT EXISTS "set18_tips" (
      "id" text PRIMARY KEY NOT NULL,
      "slug" text NOT NULL,
      "title_vi" text NOT NULL,
      "content_vi" text NOT NULL,
      "entity_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
      "champion_ids" jsonb NOT NULL,
      "trait_ids" jsonb NOT NULL,
      "source_url" text,
      "updated_at" timestamp DEFAULT now() NOT NULL
    );
  `));

  console.log('✓ Ensured set18_tips table exists.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
