# Baron TFT Architecture Review Roadmap

> Checkpoint review repo-only, tạo ngày 2026-08-11. Dùng file này để handoff sang phiên khác hoặc chia việc cho nhiều agent.

## Executive Summary

Baron TFT là website/web app học TFT tiếng Việt dùng Next.js App Router, TypeScript strict, CSS Modules, generated content, localStorage cho MVP state, Drizzle schema và Neon/Postgres cho authoring data. Kiến trúc hiện tại phù hợp với content-heavy product: static/generated read model, SEO route coverage tốt, nhiều lazy-loading có chủ đích, và test surface khá rộng.

Rủi ro chính không nằm ở stack mà nằm ở operational discipline. Các gate cốt lõi, CI, DB/content runbook, HTML validation, error boundaries, SEO/performance smoke và audit hooks đã được bổ sung; phần còn lại chủ yếu là sửa E2E known failures, nâng cấp migration/schema policy theo thực tế vận hành, và tiếp tục tách dần feature file lớn khi có test seam.

## Evidence From Checks

| Check | Result | Notes |
|---|---|---|
| `pnpm typecheck` | Pass | TypeScript no emit passed. |
| `pnpm test` | Pass | Unit test suite includes SEO, trusted HTML, JSON-LD, and pure model seams. |
| `pnpm build` | Pass | Passed when run alone; first concurrent run likely collided with `.next` while e2e was running. |
| `pnpm lint` | Pass | Legacy one-off PBE scripts have narrow overrides for historical untyped JSON mutation code. |
| `pnpm lint:release` | Pass | Scoped to app, tests, and shared config. |
| `pnpm test:e2e` | Known fail | 4 stable failures triaged around mobile Set18 matrix trigger, mobile back-to-top, and patch expectations. |

## Findings By Priority

### P0

No repo-only evidence of a current system-wide blocker. Production build passes when run alone.

### P2 - Quality Gates And CI

- Repo-wide `pnpm lint` and scoped `pnpm lint:release` are usable. Legacy one-off PBE scripts are isolated by narrow overrides.
- CI exists at `.github/workflows/ci.yml` with typecheck, unit tests, build, perf smoke, lint, and manual E2E smoke.
- Full E2E has 4 triaged failures; use manual desktop smoke until the full suite is fixed.

### P2 - Data And Migrations

- `scripts/db/apply-patch-draft.ts` supports dry-run, writes report + entries through a Neon HTTP transaction batch, and verifies inserted entry count.
- `src/db/migrations/0000_current_schema.sql` is checked in as a baseline snapshot; existing shared DBs still require explicit migration review before applying schema changes.
- `pnpm db:push` is disabled and `pnpm db:check-schema` provides a read-only drift gate.

### P2 - Generated HTML And Content Trust Boundary

- `KnowledgeReader.tsx` renders generated `block.html` with `dangerouslySetInnerHTML`.
- `ChampionCard.tsx` renders generated `abilityHtmlVi` and `calc.terms` with `dangerouslySetInnerHTML`.
- Generation-time HTML allowlist validation now guards evergreen Markdown conversion and Set18 champion DB pull output; runtime render gates also validate trusted HTML before `dangerouslySetInnerHTML`.
- This remains a trusted/generated content model, not a user-input HTML renderer.

### P2 - Content Reproducibility

- `content:sync` searches for `docs/evergreen` outside the current repo boundary.
- Generated files are committed, which is good for build stability, but source reproducibility from a fresh repo checkout is unclear.

### P2 - Reliability And Observability

- Root, global, and key route App Router `error.tsx`/`loading.tsx` boundaries now exist.
- Observability in repo is Vercel Analytics + Speed Insights, documented in `docs/OPERATIONS_RUNBOOK.md`.
- Incident runbook and rollback verification are documented; dashboard/alerting automation remains future work.

### P3 - Performance

- Good patterns exist: dynamic command palette, mobile-only nav bubble, lazy-loaded Set18 section data, dynamic patch presentation.
- Route bundle budgets are documented and enforced by `pnpm perf:smoke` after build.

### P3 - Architecture Hotspots

- `Set18Codex.tsx` and `PatchBoard.tsx` are large feature files with several concerns in one place.
- Do not rewrite them just because they are large. Extract only when touching related behavior, and put pure logic under tests first.

### P3 - SEO

- SEO foundation is good: metadata, canonical URLs, sitemap, robots preview blocking, entity detail pages, and breadcrumb JSON-LD are present.
- SEO smoke tests now cover sitemap uniqueness, `/patch` canonical behavior, older patch canonicals, and non-production robots blocking.

## Roadmap

### Now

1. Done — triage the 4 current E2E failures.
2. Done — make release gates usable with repo-wide `pnpm lint` and scoped `pnpm lint:release`.
3. Done — add CI minimum: `pnpm typecheck`, `pnpm test`, production build, and `pnpm lint:release`.
4. Done — wrap `apply-patch-draft` writes in a Neon transaction batch and verify inserted entry count.
5. Done — add generated HTML validation/allowlist at content generation boundaries.
6. Done — add minimal App Router `error.tsx` and `loading.tsx` boundaries.

### Next

1. Done — document current DB source of truth and migration policy in `docs/DB_CONTENT_WORKFLOW.md`.
2. Done — document content pipeline source paths, especially external `docs/evergreen` dependency.
3. Done — add DB/content publish runbook: apply draft, pull generated files, review diff, validate, rollback/roll-forward.
4. Done — add SEO smoke checks for sitemap/canonical behavior.
5. Done — add performance targets for `/`, `/mua-18/[section]`, and `/patch` in `docs/PERFORMANCE_TARGETS.md`.
6. Done — add minimal observability/runbook docs for Vercel, Neon, env vars, rollback, and incident verification in `docs/OPERATIONS_RUNBOOK.md`.

### Scale Trigger

Start the next level of architecture work when one of these happens:

- Season 19 or another large content set is added.
- More than one person/agent regularly changes DB/content scripts.
- Patch publishing becomes time-sensitive or frequent enough that local scripts become risky.
- Traffic or SEO importance makes performance regression expensive.
- User accounts, cloud sync, or non-local user data are introduced.

At that point, consider:

- Done — data publish pipeline with audit script/log option and target verification.
- Done — checked-in baseline migration snapshot and read-only schema drift detection.
- Done — HTML validation at generation and runtime render gates.
- Done — CI with unit, build, SEO smoke, performance budget, and manual E2E smoke workflow.
- Started — modular split of `Set18Codex` and `PatchBoard` through pure model helpers and tests.

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
- Repo-wide `pnpm lint` is expected to pass; legacy one-off PBE scripts are covered by narrow overrides.
- Build and e2e should not run concurrently because both can touch `.next` or the dev server.
- If a check cannot run, record why and what risk remains.
