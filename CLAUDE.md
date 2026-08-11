# CLAUDE.md - Baron TFT Website

Repo-local guidance for agents working on Baron TFT.

## Project Profile

- Product: Vietnamese TFT learning website and decision-training web app.
- Stack: Next.js App Router, React 19, TypeScript strict, CSS Modules, GSAP, Drizzle ORM, Neon/Postgres, Vercel.
- Data model: production app mostly reads generated TypeScript content; Neon/Postgres is the authoring/source workflow for Set 18 and patch data.
- User state: localStorage MVP state for checklist, review draft, nav bubble, and progress.

## Working Rules

- Inspect the relevant code before proposing changes.
- Prefer the smallest correct change.
- Do not refactor large files just because they are large.
- Do not edit generated content by hand unless explicitly requested and the pipeline is part of the task.
- Do not run DB write scripts, deploy, or mutate production data without explicit approval.
- Do not use destructive git commands.
- Respect dirty worktrees and avoid overwriting user/agent changes.

## Safe Command Order

Use commands according to scope.

### General Code Change

```bash
pnpm typecheck
pnpm test
pnpm eslint <changed-files>
```

### Route, App Router, SEO, Or Build Behavior

```bash
pnpm typecheck
pnpm test
pnpm build
```

### Mobile, Modal, Navigation, Patch, Or Set18 Interaction

```bash
pnpm typecheck
pnpm test
pnpm playwright test <target-spec>
```

### Known Caveat

Repo-wide `pnpm lint` currently fails in old DB/PBE scripts. Do not treat that as a new regression unless your change touched those files. Targeted lint for changed files is still required.

Do not run `pnpm build` and `pnpm test:e2e` concurrently. They can contend over `.next` or dev-server artifacts.

## DB And Content Publishing Rules

- Neon/Postgres is the source workflow for Set 18 and patch data.
- Generated files under `src/content/set18/**`, `src/content/patch-notes.generated.ts`, and search/slug generated files should normally come from scripts.
- Use `pnpm db:pull` only when intentionally syncing DB state back to generated files.
- After any generated content sync, review `git diff` before continuing.
- `scripts/db/apply-patch-draft.ts` is currently a risk area because patch report + entries writes should be transaction-safe before heavy use.
- Do not use `db:push` against shared/prod DB unless the migration policy has been approved.
- Evergreen content generation depends on `docs/evergreen` outside the current repo boundary; confirm source path before running `pnpm content:sync`.

## Generated HTML Rules

- Existing `dangerouslySetInnerHTML` paths are allowed only for trusted/generated content.
- Before adding a new HTML render path, add sanitizer/allowlist or a generation-time validator.
- Check these areas before changing content rendering:
  - `src/components/features/knowledge-reader/KnowledgeReader.tsx`
  - `src/components/features/season-18/cards/ChampionCard.tsx`
  - `scripts/convert-evergreen-lessons.mjs`

## SEO Rules

- Preserve `/patch` as canonical for the latest patch.
- Preserve `/patch/[version]` for older patch versions.
- Preserve preview/non-production indexing protection in `robots.ts` and metadata.
- When changing `SITE_URL` or custom domain behavior, verify sitemap and canonical URLs.

## Agent Split

- Architecture/review agent: read-only findings, no edits.
- QA agent: tests, first root failure, no broad refactors.
- DB/content agent: schema, DB scripts, generated diffs, no DB writes without approval.
- UI/performance agent: component/CSS/mobile interactions, no generated data edits.
- SEO/release agent: metadata, canonical, sitemap, robots, build readiness.

Avoid parallel edits to the same large file, especially `Set18Codex.tsx`, `PatchBoard.tsx`, and DB scripts.

## Quality Bar Before Handoff

- State what changed and why.
- State exactly which commands ran and their result.
- If a gate was not run, state why and the remaining risk.
- Verify generated files were not edited manually unless that was the task.
- Verify no secrets or local artifacts are included.

## Known Review Checkpoint

See `docs/ARCHITECTURE_REVIEW_ROADMAP.md` for current risks and roadmap.
