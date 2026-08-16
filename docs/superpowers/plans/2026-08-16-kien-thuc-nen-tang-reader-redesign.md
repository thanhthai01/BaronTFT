# Kien Thuc Nen Tang Reader Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a focused, editorial reading layout for `/kien-thuc-nen-tang/[slug]` that improves readability and content orientation without losing the Baron TFT visual identity.

**Architecture:** Keep lesson data and routing unchanged. Move the visible lesson masthead into `KnowledgeReader`, reuse the existing lesson and block navigation models in desktop rails and one responsive native-dialog drawer, and restyle ordinary lesson sections as a continuous article while retaining framed treatments for structured practice content.

**Tech Stack:** Next.js App Router, React 19, TypeScript strict, CSS Modules, Playwright, axe-core.

## Global Constraints

- Do not add a focus-mode toggle, reading preference, font-size control, dark mode, or progress persistence.
- Do not modify generated lesson content, database code, canonical URLs, metadata schema, or global navigation.
- Keep Baron TFT ivory paper, ink-black text, cobalt primary accent, fluoro-orange secondary accent, existing typography, crisp borders, and selective hard offset shadows.
- Body copy must render at 17-18px on desktop with 1.75 line-height and at least 16px on mobile.
- Keep the main reading measure near 46-49rem and prevent horizontal page overflow.
- Auxiliary content must remain keyboard accessible and must not precede the main lesson content on mobile.

---

### Task 1: Lock the New Reader Contract with Playwright

**Files:**
- Create: `tests/e2e/knowledge-reader.spec.ts`
- Modify: `tests/e2e/core-flows.spec.ts`

**Interfaces:**
- Consumes: Existing route `/kien-thuc-nen-tang/level-roll-outs-va-breakpoint` and Playwright projects from `playwright.config.ts`.
- Produces: Browser-level acceptance coverage for the single masthead, desktop reading measure, responsive reader tools, dialog focus behavior, content order, overflow, and axe results.

- [ ] **Step 1: Write the failing reader tests**

Create `tests/e2e/knowledge-reader.spec.ts` with these assertions:

```ts
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const lessonPath = '/kien-thuc-nen-tang/level-roll-outs-va-breakpoint';

test('desktop reader keeps one masthead and a readable measure', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'Desktop reader contract');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(lessonPath);

  const article = page.getByRole('article');
  await expect(article.getByRole('heading', { level: 1, name: 'Level, roll, outs và breakpoint' })).toHaveCount(1);
  await expect(article.getByText(/Tính outs trước mỗi lần rolldown/)).toHaveCount(1);

  const metrics = await article.evaluate((node) => {
    const paragraph = node.querySelector('section p');
    const style = paragraph ? getComputedStyle(paragraph) : null;
    return {
      width: node.getBoundingClientRect().width,
      fontSize: style ? Number.parseFloat(style.fontSize) : 0,
      lineHeight: style ? Number.parseFloat(style.lineHeight) : 0,
    };
  });
  expect(metrics.width).toBeGreaterThanOrEqual(736);
  expect(metrics.width).toBeLessThanOrEqual(800);
  expect(metrics.fontSize).toBeGreaterThanOrEqual(17);
  expect(metrics.lineHeight).toBeGreaterThanOrEqual(28);
});

test('compact reader tools open accessible panels and keep article first', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'Mobile reader contract');
  await page.goto(lessonPath);

  const contentsTrigger = page.getByRole('button', { name: 'Mở mục lục bài' });
  await contentsTrigger.click();
  const dialog = page.getByRole('dialog', { name: 'Mục lục bài' });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(contentsTrigger).toBeFocused();

  const orderIsCorrect = await page.getByRole('article').evaluate((node) => {
    const firstBlock = node.querySelector('#level-la-mua-slot-va-phan-phoi-shop');
    const actions = node.querySelector('[data-reader-actions]');
    return Boolean(firstBlock && actions && (firstBlock.compareDocumentPosition(actions) & Node.DOCUMENT_POSITION_FOLLOWING));
  });
  expect(orderIsCorrect).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test('reader has no serious automated accessibility violations', async ({ page }) => {
  await page.goto(lessonPath);
  const results = await new AxeBuilder({ page }).include('[data-knowledge-reader]').analyze();
  expect(results.violations.filter((violation) => violation.impact === 'critical' || violation.impact === 'serious')).toEqual([]);
});
```

- [ ] **Step 2: Replace the obsolete mobile apply-order test**

In `tests/e2e/core-flows.spec.ts`, replace `mobile lesson shows apply before article content without lesson TOC` with a focused navigation smoke test that expects the responsive reader tools and verifies lesson switching from the lesson drawer.

- [ ] **Step 3: Run the focused tests and verify failure**

Run:

```powershell
$env:E2E_PORT='3108'; pnpm exec playwright test tests/e2e/knowledge-reader.spec.ts --project=desktop-chromium --project=mobile-chromium
```

Expected: FAIL because the page still has a route-level H1 outside the article, the mobile tools are a select rather than dialogs, apply actions precede the article blocks, and the desktop body size is 16px.

- [ ] **Step 4: Commit the failing acceptance contract**

```powershell
git add tests/e2e/knowledge-reader.spec.ts tests/e2e/core-flows.spec.ts
git commit -m "test: define focused knowledge reader behavior"
```

### Task 2: Consolidate the Masthead and Responsive Navigation

**Files:**
- Modify: `src/app/kien-thuc-nen-tang/[slug]/page.tsx`
- Modify: `src/app/kien-thuc-nen-tang/page.module.css`
- Modify: `src/components/features/knowledge-reader/KnowledgeReader.tsx`

**Interfaces:**
- Consumes: `KnowledgeReader({ initialSlug?: string })`, `lessons`, `LessonJumpList`, existing scrollspy state, and native `HTMLDialogElement`.
- Produces: A single article H1, desktop lesson/content rails, compact reader toolbar, one native dialog controlled by `activePanel: 'lessons' | 'contents' | null`, and end-of-article actions marked with `data-reader-actions`.

- [ ] **Step 1: Remove the duplicate route masthead**

Keep JSON-LD and the reader section in `[slug]/page.tsx`, but replace the route header plus reader wrapper with:

```tsx
<section aria-label="Nội dung kiến thức nền tảng" className={styles.readerSection}>
  <div className="wide-container">
    <KnowledgeReader initialSlug={slug} />
  </div>
</section>
```

Delete unused `.header` rules from `page.module.css`.

- [ ] **Step 2: Extract reusable lesson navigation markup inside `KnowledgeReader.tsx`**

Add a local `LessonNavigation` component with the exact contract:

```ts
type LessonGroup = { category: string; items: Lesson[] };

function LessonNavigation(props: {
  activeLesson: Lesson;
  expandedCategory: string;
  groups: LessonGroup[];
  onExpandedCategoryChange: (category: string) => void;
  onNavigate?: () => void;
}): React.ReactNode;
```

Move the existing accordion/link markup into that component so desktop and dialog navigation share labels, `aria-expanded`, `aria-current`, and URLs.

- [ ] **Step 3: Add the native reader dialog**

In `KnowledgeReader`, add:

```ts
const [activePanel, setActivePanel] = useState<'lessons' | 'contents' | null>(null);
const dialogRef = useRef<HTMLDialogElement>(null);
const lessonTriggerRef = useRef<HTMLButtonElement>(null);
const contentsTriggerRef = useRef<HTMLButtonElement>(null);
```

Synchronize state with `dialog.showModal()` and `dialog.close()`. Handle `onCancel`, backdrop click, and `onClose`; after closing, focus `lessonTriggerRef` or `contentsTriggerRef` according to the panel that was open.

- [ ] **Step 4: Render the unified masthead and responsive toolbar**

Move the module, title, summary and metadata into the article header:

```tsx
<article className={styles.article} data-knowledge-reader>
  <header className={styles.articleHead}>
    <span className="kicker">{activeLesson.module}</span>
    <h1>{activeLesson.title}</h1>
    <p className={styles.articleLead}>{activeLesson.summary}</p>
    <div className={styles.metaRow}>
      <span className={styles.metaChip}><ClockIcon /><span>{activeLesson.duration}</span></span>
      <span className={styles.metaChip}><FlagIcon /><span>{activeLesson.skill}</span></span>
      {activeLesson.exercise && (
        <span className={styles.metaChip}><PencilIcon /><span>{activeLesson.exercise}</span></span>
      )}
    </div>
  </header>
  <nav aria-label="Công cụ đọc" className={styles.readerToolbar}>
    <button ref={lessonTriggerRef} type="button" onClick={() => setActivePanel('lessons')}>
      Danh sách bài
    </button>
    <button ref={contentsTriggerRef} type="button" onClick={() => setActivePanel('contents')}>
      Mục lục bài
    </button>
  </nav>
</article>
```

Give the two buttons accessible names `Mở danh sách bài` and `Mở mục lục bài` while keeping their visible labels concise.

- [ ] **Step 5: Move apply actions after the lesson content**

Delete `mobileReaderTools` and remove apply actions from the right rail. Render one end section after blocks and related links:

```tsx
<section className={styles.readerActions} data-reader-actions aria-labelledby="reader-actions-title">
  <div>
    <span className={styles.actionsKicker}>Tiếp tục luyện tập</span>
    <h2 id="reader-actions-title">Áp dụng vào trận tiếp theo</h2>
  </div>
  <LessonApplyPanel lesson={activeLesson} />
</section>
```

- [ ] **Step 6: Run typecheck and focused browser tests**

Run:

```powershell
pnpm typecheck
$env:E2E_PORT='3108'; pnpm exec playwright test tests/e2e/knowledge-reader.spec.ts --project=desktop-chromium --project=mobile-chromium
```

Expected: TypeScript passes. Interaction assertions pass; typography assertions may remain red until Task 3.

- [ ] **Step 7: Commit the semantic and interaction change**

```powershell
git add src/app/kien-thuc-nen-tang/[slug]/page.tsx src/app/kien-thuc-nen-tang/page.module.css src/components/features/knowledge-reader/KnowledgeReader.tsx
git commit -m "feat: focus the knowledge reader structure"
```

### Task 3: Apply the Editorial Reading System

**Files:**
- Modify: `src/components/features/knowledge-reader/KnowledgeReader.module.css`

**Interfaces:**
- Consumes: Class names introduced in Task 2 and existing global design tokens.
- Produces: A 46-49rem reading measure, 17-18px body type, continuous unframed sections, restrained desktop rails, responsive dialog styling, and overflow-safe mobile behavior.

- [ ] **Step 1: Rebuild the desktop shell around the reading measure**

Use this sizing model at wide desktop:

```css
.shell {
  --reader-measure: 48rem;
  display: grid;
  grid-template-columns: minmax(11.5rem, 13rem) minmax(0, var(--reader-measure)) minmax(10.5rem, 12.5rem);
  justify-content: center;
  gap: clamp(1.5rem, 2.5vw, 2.5rem);
  align-items: start;
}

.article {
  min-width: 0;
  font-size: 1.09375rem;
  line-height: 1.75;
}
```

- [ ] **Step 2: Make ordinary sections read continuously**

Remove the default card background/border from `.block`. Give ordinary blocks vertical spacing and a top rule, while keeping framed surface styles only on scenario cards, matrices, checklists, drills, callouts, and the end action section. Ensure `.conceptBody` inherits `1em` rather than resetting to 16px.

- [ ] **Step 3: Restrain desktop rails**

Keep `.toc` and `.apply` sticky but remove card shadows and heavy fills. Use smaller labels, a transparent/paper surface, an active left rule or spot-ink marker, and a max-height with local overflow. The right rail contains only `LessonJumpList`.

- [ ] **Step 4: Style responsive tools and dialog**

At the breakpoint where all three columns no longer fit, hide both rails and show `.readerToolbar`. Style the dialog as a right-side sheet on tablet and a bottom sheet on mobile, with:

```css
.readerDialog::backdrop {
  background: rgb(27 27 27 / 45%);
}

.readerDialog[open] {
  display: grid;
}
```

Provide at least 44px targets, visible focus, a maximum viewport height, internal scrolling, and no horizontal overflow.

- [ ] **Step 5: Verify the focused browser contract passes**

Run:

```powershell
$env:E2E_PORT='3108'; pnpm exec playwright test tests/e2e/knowledge-reader.spec.ts --project=desktop-chromium --project=tablet-chromium --project=mobile-chromium
```

Expected: All reader tests pass in applicable projects.

- [ ] **Step 6: Commit the visual system**

```powershell
git add src/components/features/knowledge-reader/KnowledgeReader.module.css
git commit -m "style: improve foundational article readability"
```

### Task 4: Regression, Accessibility, and Visual Verification

**Files:**
- Modify only if a verified regression requires a focused fix: files from Tasks 1-3.
- Create as ignored artifacts: `test-results/knowledge-reader-after-*.png`

**Interfaces:**
- Consumes: Completed reader implementation.
- Produces: Passing quality gates and inspected screenshots at 1440px, 1024px, 768px, and 390px.

- [ ] **Step 1: Run static and unit gates**

Run each command separately:

```powershell
pnpm typecheck
pnpm test
pnpm eslint src/app/kien-thuc-nen-tang/[slug]/page.tsx src/components/features/knowledge-reader/KnowledgeReader.tsx tests/e2e/knowledge-reader.spec.ts tests/e2e/core-flows.spec.ts
```

Expected: all commands exit 0; unit suite remains 138 passing unless new unit tests are intentionally added.

- [ ] **Step 2: Run route regression tests**

Run:

```powershell
$env:E2E_PORT='3108'; pnpm exec playwright test tests/e2e/knowledge-reader.spec.ts tests/e2e/core-flows.spec.ts --project=desktop-chromium --project=tablet-chromium --project=mobile-chromium
```

Expected: all applicable tests pass.

- [ ] **Step 3: Run the production build**

Run:

```powershell
pnpm build
```

Expected: Next.js production build exits 0 and statically generates the knowledge routes.

- [ ] **Step 4: Capture and inspect responsive screenshots**

Capture the long lesson at viewport widths 1440, 1024, 768, and 390. Inspect each saved PNG for text size, line length, heading wrapping, drawer/tool visibility, content order, clipping, overlap, blank canvas areas, and brand consistency.

- [ ] **Step 5: Check the final diff and worktree state**

Run:

```powershell
git diff --check
git status --short
git log --oneline -5
```

Expected: no whitespace errors, no generated lesson data changes, and no screenshots/logs staged.
