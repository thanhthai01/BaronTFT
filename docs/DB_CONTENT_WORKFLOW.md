# DB And Content Workflow

This runbook defines the current source of truth for Baron TFT data, how DB-backed content is published, and what is intentionally not automated yet.

## Current Source Of Truth

Production reads committed TypeScript content. The Neon/Postgres database is the authoring source for Set 18 and patch data.

Generated runtime files:

- `src/content/set18/set18-champions.ts`
- `src/content/set18/set18-traits.ts`
- `src/content/set18/set18-augments.ts`
- `src/content/set18/set18-wisps.ts`
- `src/content/set18/set18-items.ts`
- `src/content/set18/set18-tips.ts`
- `src/content/set18/set18-entity-index.ts`
- `src/content/set18/set18-slugs.generated.ts`
- `src/content/patch-notes.generated.ts`

DB schema source in repo:

- `src/db/schema.ts`
- `drizzle.config.ts`

Current DB state is only partially reproducible from a fresh clone: `src/db/migrations/0000_current_schema.sql` is a baseline schema snapshot, while Neon remains the live data source for authored Set18 and patch content.

## Migration Policy

Do not run `pnpm db:push` against shared or production DB unless a schema migration policy has been explicitly approved for that change.

Current policy:

- Data/content updates use reviewed draft scripts, then `pnpm db:pull` to regenerate committed read-model files.
- Schema changes require a separate review step before execution.
- If schema changes are needed, add checked-in migration files under `src/db/migrations` before applying them to shared DB.
- Document any manual DB schema change in this file or the PR description with the exact SQL or Drizzle action used.
- `pnpm db:push` is disabled by default. Use reviewed migration files and explicit approval for schema changes.
- `pnpm db:check-schema` is the read-only drift gate for comparing `src/db/schema.ts` against the configured DB.
- `pnpm db:validate-constraints` is the read-only preflight before applying authoring safety constraints.

Next improvement:

- Add Drizzle migration journal metadata or an approved migration runner before allowing schema changes as a normal workflow.

See `docs/DB_MIGRATION_GOVERNANCE.md` for the reviewed schema-change policy,
constraint priorities, migration manifest, and production-clone validation rules.

## Content Pipelines

Evergreen lessons:

- Source: `docs/evergreen` outside this repo boundary.
- Generator: `pnpm content:sync` via `scripts/convert-evergreen-lessons.mjs`.
- Output: `src/content/lessons.generated.ts`, `src/content/roadmap.generated.ts`, `src/content/glossary.generated.ts`.
- Safety gate: generated lesson HTML is validated by `scripts/lib/trusted-html-validation.mjs`.

Set 18 and patch data:

- Source: Neon/Postgres tables declared in `src/db/schema.ts`.
- Pull/generator: `pnpm db:pull` via `scripts/db/pull-set18.ts`.
- Output: generated Set18 files and `src/content/patch-notes.generated.ts`.
- Safety gate: Set18 champion tooltip HTML is validated during pull.

Patch changeset target workflow:

- A patch update should become one reviewed changeset containing the `PatchReport`
  and every safe entity-table mutation implied by the patch.
- The changeset must dry-run before writing: validate target label, entity ids,
  affected rows, exact `from` values, enum-like values, duplicate ids, and any
  unapplied changes.
- Patch report writes and safe entity mutations should apply together in one
  transaction/batch or fail before any write.
- Any patch-note change that cannot be mapped safely to current DB fields must be
  listed as `unapplied`, with a reason and manual validation path.
- See `docs/DB_PATCH_CHANGESET_ARCHITECTURE.md` for the target design.

Search and slugs:

- `pnpm content:slugs` regenerates Set18 slug helpers.
- `pnpm content:search-index` regenerates search index data.
- `pnpm db:pull` already regenerates entity index and Set18 slugs for DB-backed content.

## Patch Publish Runbook

Use this only after confirming the target database and draft file.

Preferred future flow is the patch changeset workflow in
`docs/DB_PATCH_CHANGESET_ARCHITECTURE.md`. Until that implementation exists, keep
the current draft flow conservative and do not run separate entity update scripts
unless the exact target, expected rows, and roll-forward path have been reviewed.

1. Review the patch draft.

```bash
pnpm db:check-schema
pnpm db:apply-patch:dry-run scripts/db/drafts/<patch-file>.ts
```

Also review any entity-table updates implied by the patch. If a champion, trait,
wisp, augment, or item value must change, record it explicitly before applying
the patch. Do not rely on a later one-off script as an implicit second half of the
publish.

2. Apply the patch draft.

```bash
pnpm db:apply-patch scripts/db/drafts/<patch-file>.ts
```

3. Pull generated read-model files.

```bash
pnpm db:pull
```

4. Verify generated files are in sync and audit publish state.

```bash
pnpm db:pull:check
pnpm db:publish-audit -- --expect-target staging --draft scripts/db/drafts/<patch-file>.ts
```

Use `--write-log docs/publish-audits/<date>-<patch-id>.json` if the audit output should be preserved in the PR.

For patch publishes that include entity-table updates, the audit record should
also state affected tables, affected row count, skipped or unapplied changes, and
the exact generated files expected to change.

5. Review generated diff.

```bash
git diff -- src/content/patch-notes.generated.ts src/content/set18
```

6. Run gates.

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm lint:release
```

7. Smoke `/patch` and any linked entity pages affected by the patch.

Do not run patch apply scripts near the end of a session unless there is enough time to pull, diff, verify, and record rollback or roll-forward state.

Do not add new one-off patch/entity mutation scripts marked only as `DONE` or
`KHÔNG CHẠY LẠI` for normal patch publishing. Keep historical scripts as evidence,
but new patch work should move toward structured changesets with dry-run output.

## Tip Publish Runbook

1. Review the tip draft.

```bash
pnpm db:apply-tip scripts/db/drafts/<tip-file>.ts
```

2. Pull generated files.

```bash
pnpm db:pull
```

3. Verify generated files and audit publish state.

```bash
pnpm db:pull:check
pnpm db:publish-audit -- --expect-target staging
```

4. Review generated diff.

```bash
git diff -- src/content/set18/set18-tips.ts
```

5. Run gates.

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm lint:release
```

## Rollback And Recovery

Preferred recovery is roll-forward with a corrected draft, followed by `pnpm db:pull` and diff review.

If a patch draft was applied incorrectly:

- Fix the draft and rerun `pnpm db:apply-patch`.
- Rerun `pnpm db:pull`.
- Confirm the generated diff only changes intended entries.
- If entries were accidentally removed, restore them in the draft rather than editing generated files by hand.

If a generated file looks wrong after pull:

- Do not hand-edit generated output unless explicitly approved.
- Fix the DB row or source draft.
- Rerun the generator.
- Record the last successful command and failed command before handing off.

## Safety Checklist

Before any DB write:

- Confirm `DB_TARGET_LABEL` matches the intended database target.
- Confirm the script prints only a redacted database host/path, never the raw URL.
- Confirm `.env.local` points to the intended database without exposing its value.
- Confirm the exact draft file path.
- Confirm expected report id, row count, or entry count.
- Confirm affected tables and generated files that should change.
- Confirm skipped or unapplied patch-note changes are documented.
- Confirm rollback or roll-forward path.
- Prefer a read-only schema drift check and dry-run before the write.

Never commit `.env.local`, database URLs, or local artifacts.
