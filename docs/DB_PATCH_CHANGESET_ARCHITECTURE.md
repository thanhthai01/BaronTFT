# DB Patch Changeset Architecture

This document defines the target authoring workflow for Set 18 patch publishing.
The goal is to make one patch update a single reviewed changeset: the `/patch`
report and all safe codex/entity data updates are planned, validated, applied,
pulled, and audited together.

## Problem

The current workflow can publish a patch report and update related entity tables
through separate scripts. This creates a split-brain authoring state:

- `/patch` can show the new buff or nerf while `set18_champions`,
  `set18_traits`, `set18_wisps`, or `set18_augments` still hold old values.
- Entity data can be partially updated by one-off scripts before the patch report
  is fully published.
- Partial runs are currently recorded in comments inside scripts, not as a
  durable operation report.
- Skipped changes are easy to lose because they live in free-form notes instead
  of a structured publish artifact.

## Direction To Preserve

- Production routes should continue reading committed generated TypeScript
  content.
- Neon/Postgres should remain the authoring/source workflow for Set 18 and patch
  data.
- Generated files should continue to be reviewed by `git diff` before deploy.
- `pnpm db:push` should remain disabled for shared/prod safety.

## Target Unit: Patch Changeset

A patch changeset is the canonical publish unit for one patch.

It should contain:

- `patchReport`: the `PatchReport` object that becomes `patch_reports` and
  `patch_entries`.
- `entityMutations`: the safe codex updates implied by the patch report.
- `unappliedChanges`: patch-note changes that cannot be mapped safely to current
  DB fields.
- `sourceEvidence`: source URL, local source note, screenshot reference, or
  manually reviewed note.
- `expectedTarget`: the intended DB target label, usually a production clone for
  validation and a separately approved shared target for real publish.

## Entity Mutation Shape

Each entity mutation should be explicit and independently auditable.

Recommended fields:

- `id`: stable operation id, for example `patch-tft18-1ac:champion:krug:abilityVi`.
- `entryId`: the related patch entry id when available.
- `table`: target table name.
- `entityId`: stable entity id, not display name.
- `fieldPath`: dotted path for JSON/text field, for example
  `forms[].abilityHtmlVi` or `stats.attackDamage[0]`.
- `expectedCurrent`: exact value or exact substring expected before write.
- `nextValue`: exact value or replacement string.
- `matchMode`: `exact`, `replaceExact`, `jsonPath`, or `manual`.
- `risk`: `safe`, `needs-review`, or `unapplied`.
- `reason`: required for `needs-review` and `unapplied`.

## Dry-Run Requirements

Dry-run must be the default decision gate before any DB write.

It should validate:

- `DB_TARGET_LABEL` matches `expectedTarget`.
- The patch report has no duplicate report id or entry id conflict.
- Every `entry.entityId` resolves when the entry category is a Set 18 entity.
- Every `relatedEntryIds` value in `impacts` exists in the same patch report.
- Every mutation targets exactly one row.
- Every `expectedCurrent` value matches the current DB state.
- Every enum-like value is in the allowed set.
- Every skipped or unapplied change is listed in `unappliedChanges` with a reason.
- The planned generated files are known before apply.

## Target Isolation

Every changeset write path must refuse ambiguous targets.

Required controls:

- `expectedTarget` must be present in the changeset.
- `DB_TARGET_LABEL` must exactly match `expectedTarget` before dry-run and apply.
- Audit output must print only the redacted host/path, never `DATABASE_URL`.
- Production clone validation and shared/prod publish should be separate approved
  steps, even when they use the same changeset file.
- A write script must fail closed when `DB_TARGET_LABEL` is missing or `unknown`.
- No script should infer safety from a local filename like `.env.local`; it must
  use explicit target metadata.

Recommended target labels:

- `local`: disposable local development DB.
- `production-clone`: Neon clone used for validation and rehearsal.
- `staging`: shared non-production publish target.
- `production`: live authoring source, only after explicit approval.

Dry-run output should be short but complete:

```text
Target
Patch id
Entries planned
Entity mutations planned
Rows affected by table
Unapplied changes
Blocking validation errors
Generated files expected to change
```

## Apply Requirements

Apply should write patch report data and safe entity mutations as one operation.

Preferred behavior:

1. Re-run all dry-run validations.
2. Write `patch_reports`, `patch_entries`, and entity table mutations in one
   transaction or Neon transaction batch.
3. Verify affected row counts inside the same operation.
4. Emit a publish report with redacted DB identity and changed rows.
5. Stop before deploy until generated file diff is reviewed.

If the database client cannot express all mutations in a single transaction, the
script must fail before writes or use a staged roll-forward plan that records
exactly which operation completed.

## Testing And Quality Gates

Changeset implementation should have unit tests before it becomes the normal
patch publish path.

Minimum test coverage:

- duplicate patch entry ids fail validation;
- unresolved `entityId` fails validation for Set 18 entity categories;
- `relatedEntryIds` that do not exist in the same patch fail validation;
- enum-like values outside allowed sets fail validation;
- a mutation with zero or multiple affected rows fails validation;
- a mutation with mismatched `expectedCurrent` fails validation;
- `unappliedChanges` are included in dry-run output;
- target mismatch fails before any write plan is built.

Release checks after a successful apply remain:

- `pnpm db:pull:check`;
- `pnpm db:publish-audit -- --expect-target <target>`;
- generated diff review for `src/content/patch-notes.generated.ts` and
  `src/content/set18/**`;
- `pnpm typecheck`;
- `pnpm test`;
- `pnpm build`;
- `pnpm lint:release`.

## Observability And Audit

Every apply should emit a compact publish report.

Required fields:

- changeset id;
- git revision;
- target label;
- redacted database identity;
- dry-run validation result;
- changed tables and row counts;
- patch report id and entry count;
- entity mutation count;
- unapplied changes count and ids;
- generated files expected to change;
- post-apply verification commands and results.

Commit audit logs only when they are useful for a reviewed release or incident
record. Audit logs must not contain raw DB URLs, secrets, raw production dumps, or
unredacted credentials.

## Unapplied Changes

Some patch-note changes are real but not safely mappable to current DB fields.
Examples include:

- The patch has a fourth star-value but the DB only stores three values.
- The current DB value does not match the patch-note `from` value.
- The field shown on the site is translated text while the only matching value is
  in an English fallback field.
- The patch describes a bugfix or mechanic with no codex display field.

These should not be silently ignored. They must be listed as `unappliedChanges`
with:

- related `entryId`;
- original patch change;
- reason it cannot be safely applied;
- suggested manual validation path;
- expiry trigger, usually a future schema/model improvement.

## Publish Flow

Recommended target flow:

```bash
pnpm db:check-schema
pnpm db:apply-changeset:dry-run scripts/db/changesets/<patch-id>.ts
pnpm db:apply-changeset scripts/db/changesets/<patch-id>.ts
pnpm db:pull
pnpm db:pull:check
pnpm db:publish-audit -- --expect-target <target> --draft scripts/db/changesets/<patch-id>.ts
git diff -- src/content/patch-notes.generated.ts src/content/set18
pnpm typecheck
pnpm test
pnpm build
pnpm lint:release
```

These commands describe the target workflow. Do not add or run write scripts until
the implementation has been reviewed.

Current implementation note: `pnpm db:apply-changeset` applies `patch_reports`,
`patch_entries`, and allowlisted top-level scalar `entityMutations` in one Neon
batch after all `expectedCurrent` values pass preflight. Nested JSON paths,
`manual`, and `needs-review` mutations are blocked before writes.

## Recovery

Preferred recovery is roll-forward:

- Fix the changeset.
- Re-run dry-run.
- Apply the corrected changeset.
- Pull generated files.
- Review the generated diff.
- Record what changed in the publish report.

Do not rollback irreversible data changes unless a tested restore plan exists and
the target DB has been explicitly confirmed.

## Scale Triggers

Consider a more normalized data model or canonical `set18_entities` table when:

- More than one person or agent regularly publishes patches.
- Multiple TFT sets are active in the same DB.
- Runtime routes begin reading from DB directly.
- Patch publishing becomes time-sensitive.
- Repeated entity reference drift occurs despite changeset validation.
