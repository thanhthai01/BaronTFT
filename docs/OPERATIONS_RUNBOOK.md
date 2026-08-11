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

## Rollback

Preferred rollback path:

- Revert or redeploy the last known-good Vercel deployment for app/runtime regressions.
- Roll forward with corrected DB draft + `pnpm db:pull` for DB/content mistakes.

Do not hand-edit generated files as rollback unless explicitly approved and the source pipeline is unavailable.

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
