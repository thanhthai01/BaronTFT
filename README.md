# Baron TFT

[![CI](https://github.com/thanhthai01/BaronTFT/actions/workflows/ci.yml/badge.svg)](https://github.com/thanhthai01/BaronTFT/actions/workflows/ci.yml)

Vietnamese TFT (Teamfight Tactics) learning hub — rank manual, decision-training tools, and patch notes for the Vietnamese player base.

**Live site:** https://barontft.vercel.app

> Trung tâm học TFT tiếng Việt — sổ tay leo rank, bộ công cụ luyện quyết định và bản tin patch notes cho cộng đồng người chơi Việt Nam.

## Features

- Interactive hex decision board for in-game decision training
- Unified knowledge reader merging curriculum and lessons (Vietnamese)
- In-game checklist with focus mode and local persistence
- Review Lab: post-game debrief with turning-point selection and Markdown export
- Practice templates, decision trees, and resources
- Patch notes for TFT Set 18 (incl. PBE) — translated into Vietnamese with credited sources
- Command palette (`Ctrl/Cmd + K`), responsive desktop + mobile bottom navigation
- Accessibility-first: keyboard-navigable tabs, native checkboxes, axe-verified

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript (strict)
- CSS Modules + CSS custom properties
- GSAP + `@gsap/react` orchestrated motion
- Drizzle ORM + Neon/Postgres (authoring pipeline for Set 18 + patch data)
- Vitest + Testing Library, Playwright + axe, ESLint
- Deployed on Vercel

## Getting started

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## Scripts

| Script | Description |
|---|---|
| `pnpm dev` / `pnpm build` / `pnpm start` | Next.js dev / build / start |
| `pnpm lint` / `pnpm lint:release` | ESLint (full / release gate) |
| `pnpm typecheck` | TypeScript check |
| `pnpm test` | Vitest unit tests |
| `pnpm test:e2e` | Playwright E2E suite |
| `pnpm perf:smoke` | Route bundle budget check |
| `pnpm content:sync` | Generate lessons from evergreen source |
| `pnpm db:check-schema` | Read-only schema drift gate |
| `pnpm db:publish-audit` | Verify generated content is in sync with DB target |
| `pnpm db:apply-patch:dry-run` | Preview a patch draft before publishing |

## Quality gates

CI runs on every push/PR: typecheck, unit tests, production build, route-budget smoke, and release lint. The E2E smoke suite runs on demand. See `docs/OPERATIONS_RUNBOOK.md` and `docs/PERFORMANCE_TARGETS.md`.

## Database & content workflow

Neon/Postgres is the source of truth for Set 18 and patch data; generated TypeScript content is produced by scripts and should not be edited by hand. See `docs/DB_CONTENT_WORKFLOW.md` for source-of-truth, migration policy, and publish runbooks.

## Documentation

- `docs/DB_CONTENT_WORKFLOW.md` — DB source-of-truth & content publishing workflow
- `docs/ARCHITECTURE_REVIEW_ROADMAP.md` — architecture review roadmap and known risks
- `docs/PERFORMANCE_TARGETS.md` — performance budgets and route-size targets
- `docs/OPERATIONS_RUNBOOK.md` — release, operations, and rollback runbook

## Contributing

Issues and pull requests are welcome. Keep changes small, run the quality gates, and check `CLAUDE.md` for project working rules.

## License

MIT © Huynh Thanh Thai — see `LICENSE`.

## Disclaimer

This is a fan-made project created under Riot Games' "Legal Jibber Jabber" policy using assets owned by Riot Games. Riot Games does not endorse or sponsor this project, and Baron TFT is not affiliated with Riot Games. Patch notes are unofficial Vietnamese translations of publicly available information, with all sources credited.
