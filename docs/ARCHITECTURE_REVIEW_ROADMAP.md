# Baron TFT Architecture Review Roadmap

> Checkpoint review repo-only, tạo ngày 2026-08-11. Dùng file này để handoff sang phiên khác hoặc chia việc cho nhiều agent.

## Executive Summary

Baron TFT là website/web app học TFT tiếng Việt dùng Next.js App Router, TypeScript strict, CSS Modules, generated content, localStorage cho MVP state, Drizzle schema và Neon/Postgres cho authoring data. Kiến trúc hiện tại phù hợp với content-heavy product: static/generated read model, SEO route coverage tốt, nhiều lazy-loading có chủ đích, và test surface khá rộng.

Rủi ro chính không nằm ở stack mà nằm ở operational discipline: release gate chưa xanh, DB/content publish chưa đủ atomic/auditable, generated HTML chưa có sanitizer/allowlist rõ, content pipeline phụ thuộc source ngoài repo, thiếu CI/runbook/error boundaries, và một số feature file lớn cần tách dần khi tiếp tục phát triển.

## Evidence From Checks

| Check | Result | Notes |
|---|---|---|
| `pnpm typecheck` | Pass | TypeScript no emit passed. |
| `pnpm test` | Pass | 10 unit test files, 73 tests passed. |
| `pnpm build` | Pass | Passed when run alone; first concurrent run likely collided with `.next` while e2e was running. |
| `pnpm lint` | Fail | 37 errors, mostly old DB/PBE scripts using `any`, plus small TS lint issues. |
| `pnpm test:e2e` | Fail | 38 passed, 42 skipped, 4 failed. Failures around mobile Set18 matrix trigger, mobile back-to-top, and patch expectations. |

## Findings By Priority

### P0

No repo-only evidence of a current system-wide blocker. Production build passes when run alone.

### P2 - Quality Gates And CI

- Repo-wide lint currently fails in DB/PBE scripts, so `pnpm lint` cannot be used as a release gate without cleanup or targeted policy.
- No CI workflow, deployment config, IaC, runbook, or environment documentation was found in the repo.
- E2E has 4 current failures that need triage before treating the suite as a reliable gate.

### P2 - Data And Migrations

- `scripts/db/apply-patch-draft.ts` upserts a patch report, deletes old patch entries, then inserts new entries without an observed transaction, dry-run, or post-write verify count.
- `drizzle.config.ts` points to `src/db/migrations`, but no migration files were found in this repo.
- `db:push` exists, so production/shared DB workflow needs an explicit policy to avoid unreviewed schema drift.

### P2 - Generated HTML And Content Trust Boundary

- `KnowledgeReader.tsx` renders `block.html` with `dangerouslySetInnerHTML`.
- `ChampionCard.tsx` renders `abilityHtmlVi` and `calc.terms` with `dangerouslySetInnerHTML`.
- `scripts/convert-evergreen-lessons.mjs` uses `marked.parse` without an observed sanitizer/allowlist.
- This is acceptable only while all HTML sources are trusted and reviewed. It becomes unsafe if content comes from scrape/DB/external markdown without validation.

### P2 - Content Reproducibility

- `content:sync` searches for `docs/evergreen` outside the current repo boundary.
- Generated files are committed, which is good for build stability, but source reproducibility from a fresh repo checkout is unclear.

### P2 - Reliability And Observability

- No App Router `error.tsx`, `loading.tsx`, or `global-error.tsx` files were found.
- Observability in repo is limited to Vercel Analytics and Speed Insights.
- No incident runbook, alerting policy, or dashboard documentation was found.

### P3 - Performance

- Good patterns exist: dynamic command palette, mobile-only nav bubble, lazy-loaded Set18 section data, dynamic patch presentation.
- No measurable performance budget or automated performance gate was found.

### P3 - Architecture Hotspots

- `Set18Codex.tsx` and `PatchBoard.tsx` are large feature files with several concerns in one place.
- Do not rewrite them just because they are large. Extract only when touching related behavior, and put pure logic under tests first.

### P3 - SEO

- SEO foundation is good: metadata, canonical URLs, sitemap, robots preview blocking, entity detail pages, and breadcrumb JSON-LD are present.
- Missing piece is validation: no automated smoke test for sitemap/canonical duplication or structured metadata regressions.

## Roadmap

### Now

1. Triage the 4 current E2E failures.
2. Make release gates usable: fix or intentionally scope lint for old DB/PBE scripts.
3. Add CI minimum: `pnpm typecheck`, `pnpm test`, production build, and targeted lint.
4. Wrap `apply-patch-draft` writes in a DB transaction and verify inserted entry count.
5. Add generated HTML validation or sanitizer/allowlist.
6. Add minimal App Router `error.tsx` and `loading.tsx` boundaries.

### Next

1. Decide DB source of truth: reviewed migrations or documented schema snapshot process.
2. Document content pipeline source paths, especially external `docs/evergreen` dependency.
3. Add DB/content publish runbook: apply draft, pull generated files, review diff, validate, rollback/roll-forward.
4. Add SEO smoke checks for sitemap/canonical behavior.
5. Add performance targets for `/`, `/mua-18/[section]`, and `/patch`.
6. Add minimal observability/runbook docs for Vercel, Neon, env vars, rollback, and incident verification.

### Scale Trigger

Start the next level of architecture work when one of these happens:

- Season 19 or another large content set is added.
- More than one person/agent regularly changes DB/content scripts.
- Patch publishing becomes time-sensitive or frequent enough that local scripts become risky.
- Traffic or SEO importance makes performance regression expensive.
- User accounts, cloud sync, or non-local user data are introduced.

At that point, consider:

- Data publish pipeline with audit log and staging verification.
- Checked-in migrations and schema drift detection.
- HTML sanitization as a hard gate.
- CI with unit, build, e2e smoke, SEO smoke, and performance budget.
- Modular split of `Set18Codex` and `PatchBoard` by ownership boundaries.

## Recommended Agent Split

Use separate agents only when scopes do not overlap.

| Agent | Scope | Files/Areas | Rules |
|---|---|---|---|
| Architecture reviewer | Read-only risk mapping | whole repo | Do not edit files. Produce findings and priorities. |
| QA agent | Tests and gates | `tests/**`, configs | Run targeted checks, report first root failure. |
| DB/content agent | Drizzle, Neon scripts, generated content | `src/db/**`, `scripts/db/**`, `src/content/**` | Do not run DB write scripts without approval. Review generated diffs. |
| UI/performance agent | Components, CSS, mobile interactions | `src/components/**`, `src/app/**` | Avoid changing generated data. Run relevant Playwright specs. |
| SEO/release agent | metadata, sitemap, robots, deploy readiness | `src/app/**`, `src/lib/site.ts` | Preserve canonical and preview-indexing rules. |

Avoid assigning two agents to `Set18Codex.tsx`, `PatchBoard.tsx`, or DB scripts at the same time.

## Handoff Notes For Future Sessions

- Do not edit generated Set18 files by hand unless the task is explicitly to repair generated output and the source pipeline is unavailable.
- Before changing DB scripts, read `src/db/schema.ts`, `scripts/db/pull-set18.ts`, and `scripts/db/apply-patch-draft.ts`.
- Before changing content rendering, grep all `dangerouslySetInnerHTML` and identify trusted vs untrusted data sources.
- Treat repo-wide lint failure as known until DB/PBE scripts are cleaned up; still lint changed files.
- Build and e2e should not run concurrently because both can touch `.next` or the dev server.
- If a check cannot run, record why and what risk remains.
