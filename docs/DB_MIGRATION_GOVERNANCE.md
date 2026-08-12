# DB Migration Governance

This document defines the safety policy for Baron TFT database schema changes.
It complements `docs/DB_CONTENT_WORKFLOW.md` and focuses on schema, constraints,
migration review, and recovery.

## Current Position

- `src/db/schema.ts` is the repository schema source.
- `src/db/migrations/0000_current_schema.sql` is a baseline snapshot, not a
  migration that should be blindly applied to shared or production databases.
- Neon/Postgres is the authoring database for Set 18 and patch content.
- Production app routes read committed generated TypeScript content.
- `pnpm db:push` is disabled and must stay disabled for shared/prod safety.

## Migration Principles

- Prefer the smallest schema change that protects a real invariant.
- Do not use `db:push` against shared or production databases.
- Do not mix schema changes with content publishing unless the schema change is
  backward-compatible and explicitly approved.
- Prefer expand-and-contract for any change that may affect existing data.
- Prefer roll-forward for data corrections.
- Never assume repository migrations match deployed DB state without schema drift
  evidence from the target database.

## Approved Migration Track

Every schema change should have a checked-in migration file under
`src/db/migrations` and a short manifest.

Manifest fields:

- `id`: migration id.
- `purpose`: why this change is needed.
- `affectedObjects`: tables, indexes, constraints, functions, or views.
- `compatibility`: whether old and new application/schema versions can coexist.
- `lockRisk`: expected lock behavior and table size considerations.
- `destructiveRisk`: whether data can be lost or rewritten.
- `backfill`: required backfill, batch size, and resume behavior.
- `rollbackOrRollForward`: preferred recovery path.
- `validation`: commands and expected results.
- `target`: local, production clone, staging, or shared/prod.

## Required Checks Before Schema Apply

Before applying schema changes to any shared or production-like target:

1. Confirm `DB_TARGET_LABEL` and redacted database host.
2. Run read-only schema drift check against the intended target.
3. Review current table sizes and whether the migration can lock hot tables.
4. Confirm backup/PITR status or explain why the target is disposable.
5. Run the migration on a production clone first.
6. Run post-migration validation and generated-content checks when content tables
   are affected.

If backup/PITR or restore evidence is unavailable, treat destructive migrations
as blocked. For non-destructive migrations, record the missing evidence and use a
production clone rehearsal before touching shared/prod.

## Role And Secret Boundaries

Database access should use the least privilege that can complete the task.

Target posture:

- Read-only checks use a read-only role when available.
- Content publish scripts use a content-writer role scoped to the authoring
  tables, not an owner role.
- Schema migrations use a separate migration role and require explicit approval.
- Local `.env.local` stores secrets, but scripts should identify targets through
  `DB_TARGET_LABEL` and redacted host output.
- Audit logs must never include raw connection strings or credentials.

Until separate roles exist, every DB write should be treated as higher risk and
must include target confirmation plus a roll-forward plan.

## Backup And Restore Evidence

Before irreversible data changes or destructive schema changes, collect sanitized
recovery metadata:

- PITR availability and retention window;
- last successful backup timestamp;
- last restore rehearsal timestamp;
- expected RPO and RTO for the authoring DB;
- dependencies needed during restore, such as Neon project access, DNS, secrets,
  and Vercel environment variable updates.

Repository evidence alone cannot prove recovery readiness. If restore has never
been rehearsed, record recovery confidence as low and prefer roll-forward changes.

## Constraint Priorities

Add constraints only after validating existing data on a production clone.

Near-term candidates:

- Unique `patch_reports.report_order`.
- Unique `set18_tips.slug`.
- Check `patch_entries.category` against allowed patch categories.
- Check `patch_entries.kind` against allowed change kinds.
- Check `set18_augments.rarity` against `Silver`, `Gold`, `Prismatic`.
- Check `set18_traits.type` against `Origin`, `Class`, `Unique`.

Phase 5 implementation status:

- `src/db/migrations/0001_authoring_constraints.sql` contains the reviewed SQL
  for the near-term candidates above.
- `src/db/schema.ts` declares the same checks and unique indexes for future drift
  visibility.
- `pnpm db:validate-constraints` is the read-only preflight that must pass on the
  intended target before applying the migration.
- Do not apply the migration to shared/prod until target, backup/PITR posture, and
  production-clone rehearsal are confirmed.

Use script-level validation first for JSON references such as:

- `patch_entries.entity_id`;
- `set18_champions.traits`;
- `set18_traits.champions`;
- `set18_augments.associated_traits`;
- `set18_tips.champion_ids` and `set18_tips.trait_ids`.

Do not force all JSON references into foreign keys until the data model actually
needs multi-set querying, runtime DB reads, or multi-person publishing.

## Migration Journal

Schema changes should go through the guarded migration runner when possible:

```bash
pnpm db:migrate:apply src/db/migrations/<migration>.sql --expect-target <target>
```

The runner creates and writes `schema_migrations` with migration id, checksum,
target label, redacted database identity, optional git revision, and file path. It
is intentionally conservative: destructive SQL and `CREATE INDEX CONCURRENTLY`
are blocked and require a separately reviewed runbook.

Minimum journal record:

- migration id;
- applied timestamp;
- target label;
- redacted database identity;
- operator;
- git revision;
- checksum of migration file;
- validation result.

Without a journal, every schema review must treat applied state as unknown until
confirmed through sanitized database metadata.

## Expand-And-Contract Pattern

Use this pattern for non-trivial changes:

1. Add backward-compatible schema.
2. Deploy or run code compatible with both old and new forms.
3. Backfill in bounded, observable, resumable batches.
4. Reconcile counts and spot-check data.
5. Switch reads or generation logic.
6. Stop old writes.
7. Remove old schema in a later reviewed migration.

Do not recommend rollback for irreversible data changes. Prefer tested
roll-forward unless a restore rehearsal proves rollback is safe.

## Production Clone Metadata

Use only sanitized metadata for architecture review and migration planning:

- table and column definitions;
- constraints and indexes;
- row counts and table sizes;
- migration journal rows if available;
- backup/PITR status;
- restore-test timestamp;
- role names and privilege classes without credentials.

Never share raw production content dumps, connection strings, credentials, or
private user data.
