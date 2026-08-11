# Performance Targets

These targets define the current performance budget for the pages that matter most to Baron TFT. They are intentionally simple until automated Lighthouse or Web Vitals budgets are added.

## Measurement Policy

Measure production builds only.

Use:

```bash
pnpm build
```

For manual browser checks, use a production deployment or `pnpm build` followed by `pnpm start`. Do not judge performance from `next dev`.

Track three route groups first:

- `/`
- `/mua-18/ma-tran-toc-he`, `/mua-18/chi-tiet-tuong`, `/mua-18/nang-cap`
- `/patch`

## Route Budgets

| Route | Goal | Budget |
|---|---|---|
| `/` | Fast orientation page with decision-board interaction ready quickly. | First Load JS stays near current baseline, no heavy Set18/Patch bundle in initial page. |
| `/mua-18/[section]` | Content-heavy codex remains usable on mobile and desktop. | Keep lazy section loading; avoid importing all card/detail data into unrelated sections. |
| `/patch` | Patch changes visible in first viewport on desktop. | Keep presentation code lazy; do not regress first-screen patch grid visibility. |

Current build baseline from this worktree:

- `/`: First Load JS about `110 kB`.
- `/mua-18/[section]`: route size about `40.7 kB`, First Load JS about `158 kB`.
- `/patch`: First Load JS about `156 kB`.

Treat a sustained increase over roughly 15 percent on these routes as a review trigger unless the feature explicitly justifies it.

## Guardrails

- Keep command palette, Patch presentation, NavBubble, and Set18 section data lazy where practical.
- Do not import generated Set18 detail data into routes that do not render it.
- Do not add route-wide client components just to pass callbacks through static content.
- Avoid adding new analytics or visual libraries without checking their first-load impact.
- Do not run `pnpm build` and E2E at the same time; both can contend over `.next` or dev-server artifacts.

## Next Automation

CI now runs `pnpm perf:smoke` after `pnpm build`, reading `.next/app-build-manifest.json` and enforcing route bundle budgets. Full Lighthouse budgets can come later once a stable deploy preview URL is available in CI.
