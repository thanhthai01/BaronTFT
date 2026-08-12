# Operations Runbook

This runbook covers the minimum operational checks for Baron TFT: environment variables, deployment observation, rollback, and incident verification.

## Systems

- Hosting: Vercel.
- Database: Neon/Postgres for Set18 and patch authoring workflows.
- Runtime read model: committed generated TypeScript content.
- Client analytics: Vercel Analytics and Speed Insights in `src/app/layout.tsx`.

## Environment Variables

Required for DB scripts and Drizzle:

- `DATABASE_URL`

Used for canonical URLs and sitemap/robots:

- `NEXT_PUBLIC_SITE_URL`
- `VERCEL_ENV`

Rules:

- Local secrets live in `.env.local`, never committed.
- `.env.local.example` documents shape only.
- `VERCEL_ENV=production` is required for production indexing. Non-production deployments are blocked by metadata and `robots.ts`.

## Release Verification

Before release or PR handoff:

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm perf:smoke
pnpm lint
pnpm lint:release
```

If the change touches mobile interaction, modal behavior, Set18 UI, or Patch UI, run the relevant Playwright spec after known E2E failures are fixed or explicitly scoped.

Smoke important pages:

- `/`
- `/patch`
- `/patch/[older-version]`
- `/mua-18/ma-tran-toc-he`
- `/mua-18/chi-tiet-tuong`
- `/kien-thuc-nen-tang/<slug>`

## Monitoring Checks

After deploy:

- Check Vercel deployment status and build logs.
- Check Vercel Analytics for traffic anomalies.
- Check Vercel Speed Insights for Web Vitals regressions on `/`, `/mua-18/[section]`, and `/patch`.
- If DB scripts were involved, compare generated content diff and confirm the deployed pages show the intended patch/tip data.
- For DB/content publishes, run `pnpm db:publish-audit -- --expect-target <target>` and save audit output when needed.

For DB patch publishes, also verify:

- The DB target label and redacted host match the intended target.
- The patch report and related entity-table updates were planned together.
- Every unapplied patch-note change is documented with a reason.
- `pnpm db:pull:check` passes after generated files are pulled.
- `/patch` and affected `/mua-18/*` codex pages agree on the new values.

## Rollback

Preferred rollback path:

- Revert or redeploy the last known-good Vercel deployment for app/runtime regressions.
- Roll forward with corrected DB draft + `pnpm db:pull` for DB/content mistakes.

Do not hand-edit generated files as rollback unless explicitly approved and the source pipeline is unavailable.

For DB patch/entity mistakes, prefer roll-forward:

- Create a corrected draft or changeset.
- Dry-run against the confirmed target.
- Apply the correction.
- Pull generated files.
- Review the generated diff.
- Re-run publish audit.

Do not rollback irreversible data changes unless a restore rehearsal exists and
the exact target database has been confirmed.

## DB Publish Recovery Checklist

Use this checklist when a patch update, generated content pull, or entity-table
sync looks wrong.

1. Identify the target.

- Confirm `DB_TARGET_LABEL`.
- Confirm the redacted database host/path from audit output.
- Do not paste or request `DATABASE_URL`.

2. Classify the failure.

- Patch report missing or wrong on `/patch`.
- Entity codex value wrong on `/mua-18/*` pages.
- Patch entry icon/name not resolving through `entityId`.
- Generated files stale after DB changes.
- Schema drift or migration mismatch.

3. Stabilize.

- If production runtime is healthy but content is wrong, prepare a corrected
  roll-forward draft or changeset.
- If generated files are wrong, fix the DB source or draft and rerun `pnpm db:pull`.
- If schema drift is detected, stop writes and review `docs/DB_MIGRATION_GOVERNANCE.md`.

4. Verify.

- Run `pnpm db:check-schema` against the confirmed target.
- Run `pnpm db:pull:check` after pulling generated content.
- Run `pnpm db:publish-audit -- --expect-target <target>`.
- Smoke `/patch` and all affected codex pages.
- Record commands run, result, skipped checks, and remaining risk.

## Incident Triage

1. Identify scope.

- Whole site fails: check Vercel deploy/build/runtime logs first.
- One route fails: check the route component and recently changed generated content.
- Patch or Set18 content wrong: check DB source, draft file, and generated diff.
- SEO issue: check `SITE_URL`, sitemap, robots, and route metadata canonical.

2. Stabilize.

- If runtime deploy broke production, redeploy last known-good build.
- If content is wrong but site is usable, prepare corrected draft and roll forward.
- If indexing is wrong, verify `VERCEL_ENV`, `NEXT_PUBLIC_SITE_URL`, `robots.ts`, and metadata before requesting re-crawl.

3. Verify.

- Run local gates relevant to the fix.
- Smoke affected routes.
- Record commands run, result, and any skipped checks.

## Known Current Limits

- Full E2E has 4 triaged failures and is not yet a release gate. Manual CI includes `test:e2e:smoke` through `workflow_dispatch`.
- Repo-wide `pnpm lint` still fails in old DB/PBE scripts; use `pnpm lint:release` for the release gate.
- A baseline migration snapshot and schema drift policy are documented in `docs/DB_CONTENT_WORKFLOW.md`.
