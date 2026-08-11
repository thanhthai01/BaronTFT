# DB Migrations

This directory is the reviewed migration track for Baron TFT DB schema changes.

Current state:

- `0000_current_schema.sql` is a baseline schema snapshot matching `src/db/schema.ts`.
- Existing Neon databases may already contain these tables, so do not apply the baseline blindly to shared/prod DB.
- `pnpm db:push` is disabled; schema changes require reviewed migration files and explicit approval.

Use `pnpm db:check-schema` for read-only drift checks against the configured DB.
