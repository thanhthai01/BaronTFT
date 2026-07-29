# Baron TFT Website

Website cá nhân ghi lại kiến thức TFT, hành trình leo rank và bộ công cụ luyện quyết định cho người chơi Việt Nam.

Production website/web app for the Vietnamese TFT Evergreen Rank Manual.

## Stack

- Next.js App Router + TypeScript
- CSS Modules + CSS custom properties
- GSAP + `@gsap/react` for orchestrated motion
- MDX-ready content pipeline
- `cmdk` command palette
- Local Storage for MVP progress/drafts
- Vitest + Testing Library + Playwright + axe-ready verification

## Scripts

```bash
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

## Current implementation

- Responsive app shell with desktop header and mobile bottom navigation.
- Zine Đấu Sĩ design tokens ported into semantic production tokens.
- Home page with Interactive Hex Decision Board and GSAP entrance/selection animation.
- Unified `Kiến thức nền tảng` reader that merges curriculum and lessons with active left TOC and varied lesson blocks.
- In-game Checklist with accessible tabs, native checkboxes, focus mode, and local persistence.
- Review Lab with turning-point selector, error tags, Markdown preview/copy, and local draft persistence.
- Practice Templates, Patch, Decision Trees, and Resources preview routes.
- Command palette with `Ctrl/Cmd + K` search actions.

## Notes

The previous `Baron TFT.html.dc.html` prototype and `Baron TFT Design System/` are retained as references. The production app does not import `support.js`, custom `<x-dc>` tags, CDN React/Babel, or `_ds_bundle.js`.
