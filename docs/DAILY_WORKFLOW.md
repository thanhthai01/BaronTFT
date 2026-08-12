# Daily Workflow For Baron TFT

This is a practical daily operating guide for working on Baron TFT alone or with multiple agents.

## Start Of Day

1. Check current state.

```bash
git status --short
git branch --show-current
```

2. Pick one work type.

- UI/mobile fix
- Content/DB publish
- SEO/release
- QA/regression
- Architecture review

3. Avoid mixing unrelated work in the same session.

## Standard Workflow

### UI Or Feature Work

1. Read the route/component and nearby tests first.
2. Make the smallest change that solves the task.
3. Run:

```bash
pnpm typecheck
pnpm test
pnpm eslint <changed-files>
```

4. If the change affects mobile, modal, command palette, nav, Set18, or Patch UI, run the relevant Playwright spec.

```bash
pnpm playwright test tests/e2e/core-flows.spec.ts
```

5. Review diff.

```bash
git diff -- <changed-files>
```

### DB Or Content Publish Work

1. Read `docs/DB_CONTENT_WORKFLOW.md` and confirm which source is being changed: DB, patch draft, tip draft, evergreen markdown, or generated file.
2. Do not edit generated files by hand unless explicitly intentional.
3. Before any DB write, require exact target approval in chat.

```text
approve DB target: <DB_TARGET_LABEL>
```

4. If the request is only to inspect Neon data, use read-only commands and do not ask for write approval.

```bash
node --env-file=.env.local --input-type=module -e "import { neon } from '@neondatabase/serverless'; const sql = neon(process.env.DATABASE_URL); const rows = await sql.query('select count(*)::int as tips from set18_tips', []); console.log(JSON.stringify(rows, null, 2));"
```

5. For Set18/Patch DB sync, use the approved script path, then review generated diff.

```bash
pnpm db:pull
```

6. Run verification after generated content changes.

```bash
pnpm typecheck
pnpm test
pnpm build
```

7. Do not run DB write scripts near the end of a session unless you have time to verify and recover.

### SEO Or Release Work

1. Check affected metadata, canonical, sitemap, robots, redirects, and `docs/OPERATIONS_RUNBOOK.md`.
2. Run:

```bash
pnpm typecheck
pnpm test
pnpm build
```

3. Smoke these pages when relevant:

- `/`
- `/patch`
- `/patch/[version]`
- `/mua-18/ma-tran-toc-he`
- `/mua-18/chi-tiet-tuong`
- `/kien-thuc-nen-tang/<slug>`

## Multi-Agent Operating Model

Use agents when the work can be split without touching the same file.

### Recommended Split

- Architecture agent: read-only review and risk map.
- UI agent: component/CSS/interaction implementation.
- DB/content agent: schema, scripts, generated data, content diff.
- QA agent: targeted tests, e2e failure triage, accessibility checks.
- SEO/release agent: metadata, canonical, sitemap, robots, build readiness.

### Coordination Rules

- Give every agent a bounded scope and exact output format.
- Do not let two agents edit `Set18Codex.tsx` or `PatchBoard.tsx` at the same time.
- Do not let a DB/content agent deploy or run production write scripts without explicit approval.
- QA should run after UI/content changes settle.
- Architecture review should stay read-only unless the task is documentation.

## Quality Gates

### Minimum For Any Code Change

- `pnpm typecheck` passes.
- Unit tests pass, or there is a clear reason they were not run.
- Targeted lint on changed files passes.

### Before Release Or Deploy

- `pnpm build` passes.
- E2E smoke is run for changed critical flows.
- Generated content diff is reviewed if content changed.
- No secrets or local artifacts are staged.

### Current Known Gate Issues

- Repo-wide `pnpm lint` should pass. Legacy one-off PBE scripts have narrow overrides for historical untyped JSON mutation code.
- Current usable release lint gate is `pnpm lint:release`, scoped to app, tests, and shared config.
- `pnpm test:e2e` currently has 4 triaged failures that still need fixes before it can be a release gate.
- Treat these as known issues until fixed, but do not introduce new failures in changed areas.

## DB Safety Checklist

Before any DB write script:

- Confirm `DB_TARGET_LABEL` and intended target environment.
- Confirm the user explicitly approved that target in chat, using `approve DB target: <DB_TARGET_LABEL>` or equivalent wording that names the target.
- Confirm audit or dry-run output redacts the database host/path and never prints
  the raw connection string.
- Run `pnpm db:check-schema` when the target DB is available.
- Confirm input draft file.
- Confirm expected row count or entry count.
- Confirm affected tables and generated files.
- Confirm skipped or unapplied changes are documented.
- Confirm rollback or roll-forward path.
- Prefer dry-run/summary when available.
- For patches, run `pnpm db:apply-patch:dry-run <draft>` before the real write.
- Run `pnpm db:pull` after intended DB content changes and review generated diff.

Patch application now writes report + entries through a Neon transaction batch and verifies inserted entry count; still confirm target/input/rollback before running it.

### DB Migration / Constraint Apply Flow

Use this only after the migration file has been reviewed. Prefer a production
clone first; do not apply directly to shared/prod without explicit approval.

1. Confirm `.env.local` points to the intended target without exposing the value.
2. Confirm `DB_TARGET_LABEL`, for example `production-clone`, `staging`, or `production`.
3. Run read-only preflight:

```bash
pnpm db:validate-constraints
pnpm db:check-schema
```

4. Apply the reviewed migration with an explicit target match:

```bash
pnpm db:migrate:apply src/db/migrations/0001_authoring_constraints.sql --expect-target <target>
```

For Set18 tip `entityIds`, the reviewed Phase 1 migration is:

```bash
pnpm db:migrate:apply src/db/migrations/0002_set18_tips_entity_ids.sql --expect-target <target>
```

5. Re-run verification:

```bash
pnpm db:check-schema
pnpm db:validate-constraints
```

6. If content tables changed, run `pnpm db:pull:check`, `pnpm db:publish-audit -- --expect-target <target>`, and smoke `/patch` plus affected `/mua-18/*` pages.

Never run migration apply if constraint preflight fails, target label is missing,
or backup/PITR/restore posture is unknown for a non-disposable target.

### Set18 Tips Entity Link Rules

- Use `entityIds` as the canonical relation field for every new or edited tip.
- Keep `championIds` and `traitIds` populated for legacy compatibility. They should be the champion/trait subset of `entityIds`.
- `RelatedTips` and `/mua-18/meo` must read through `set18TipEntityIds()` so old generated content still works.
- `pull-set18` must remain compatible with DB targets both before and after `entity_ids` migration; do not switch back to a plain Drizzle select for tips unless all active targets are migrated.
- Run `pnpm content:validate-tips` after any tip draft, pull, or relation helper change.
- Do not hand-edit `src/content/set18/set18-tips.ts`; change DB content via a reviewed tip draft, then run `pnpm db:pull` and review the generated diff.

## Generated HTML Checklist

Before touching HTML-rendered content:

- Identify source: internal markdown, generated DB content, scrape, or user input.
- If not fully trusted, add sanitizer/allowlist before rendering.
- Test rejection of `<script>`, event handlers like `onclick`, and `javascript:` URLs.
- Avoid adding new `dangerouslySetInnerHTML` paths.

## End Of Day

1. Check diff and status.

```bash
git status --short
git diff --stat
```

2. Record:

- What changed.
- Commands run.
- Failures or skipped gates.
- Follow-up tasks.

3. Do not leave DB/content publish half-done. If interrupted, record exact last successful step.

## Avoid

- Do not deploy after DB pipeline changes without build/test verification.
- Do not fix unrelated lint issues inside a feature task unless requested.
- Do not manually edit generated content and forget the source pipeline.
- Do not run build and e2e at the same time.
- Do not start broad refactors without a test seam and rollback plan.
