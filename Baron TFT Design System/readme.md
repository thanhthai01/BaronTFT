# Baron TFT — Design System

A design system for **Baron TFT**, a **personal knowledge-sharing site** where the author writes up the TFT knowledge and experience they actually use to climb rank in **Teamfight Tactics (Set 18)**. It is a place to *present what I know and apply* — comps, economy, positioning, meta reads — not a step-by-step course or a detailed teaching platform. Audience 18–40, clarity-first, **bilingual (Vietnamese default, English supported)**.

> **Original brand.** Baron TFT is an independent fan project *about* the game — not affiliated with or reproducing Riot Games' proprietary UI. All components, tokens, and copy here are original.

## Sources
- **Figma:** `..\figma\TFT SET18 LandingPage.fig` (attached, mounted read-only). On inspection this file contained **no components, tokens, fonts, or brand assets** — it is a moodboard of 4 unrelated website screenshots. Nothing was materialized from it.
- **Direction:** the first dark "hextech-gold" concept was rejected for looking like every other TFT site (tftacademy, mobalytics, metatft). The chosen direction is **"Zine Đấu Sĩ" — a risograph / print-zine aesthetic**: warm ivory paper, ink-black text, and two flat spot inks (cobalt blue + fluoro orange). Bold, editorial, distinctly personal — it reads like someone's zine of hard-won notes, not a corporate stats dashboard.

## No logo in source
There is **no logo file** anywhere in the provided material. Wherever a mark is needed the brand renders as a **type wordmark** — `BARON` + `TFT` set in Epilogue Extra-Bold, optionally beside a hexagon mark built from the shared `--hex-clip` filled with a cobalt/orange spot ink. Do not draw or invent a logo. If the user provides one, drop it into `assets/` and swap the wordmark.

---

## CONTENT FUNDAMENTALS
How Baron TFT writes.

- **Positioning:** knowledge-sharing, first person. The author shares *what they know and do*, not a curriculum. Frame content as notes, breakdowns, and opinions ("cách mình chơi", "mình xoay vàng thế này"), not lessons ("Bài 1: …").
- **Language:** Vietnamese first (the default), English fully supported. Keep translations parallel and short.
- **Voice:** a strong player sharing their playbook with peers — direct, confident, concrete, a little opinionated. "Mình" (I) as the author, "bạn" (you) to the reader. Not a lecturer, not hype.
- **Casing:** headings and buttons are **UPPERCASE** (heavy grotesk display). Body and captions are sentence case. Never uppercase long body sentences.
- **Numbers are sacred:** gold, HP, damage, odds, breakpoints are the content. Bold key numbers inline (`<b>50 vàng</b>`) and set raw stats in mono.
- **Tone by surface:** write-ups = clear and opinionated; callouts = punchy one-liners ("mẹo của mình"); tier/meta language = confident, first-hand ("mình leo Cao Thủ bằng comp này"). Avoid unglossed jargon.
- **Emoji:** avoided in chrome. A coin/star glyph may appear as a data marker, not decoration.
- **Examples:** eyebrow "GHI CHÚ CỦA MÌNH"; H1 "CÁCH MÌNH XOAY VÀNG"; lead "Giữ 50 vàng ăn lãi — trừ 3 tình huống mình luôn all-in."; tip "Mình luôn để **Sát Thủ** ở góc để nhảy vào carry."

## VISUAL FOUNDATIONS
- **Theme:** risograph "zine". Warm ivory **paper** ground (`--ink-900`, value flipped light), near-black **ink** text (`--paper-0`) and hairlines. Two flat spot inks: **cobalt** (`--gold-500` — lead) and **fluoro orange** (`--teal-500` — secondary). Max two accent hues. *(Token names are kept from the old dark theme so components didn't need rewriting — only the values flipped.)*
- **Color vibe:** printed-paper warmth, hard flat inks, high contrast, no glow. Cost tiers use the canonical TFT palette (1 steel · 2 green · 3 blue · 4 purple · 5 gold), darkened slightly for contrast on paper.
- **Type:** display = **Epilogue** (heavy geometric grotesk, poster weight, UPPERCASE, VI diacritics); body/UI = **Libre Franklin** (sturdy grotesque, bilingual); data = **JetBrains Mono** (tabular). Display runs large and bold; tracking slightly negative on headings, wide (`0.12em`) on eyebrows.
- **Backgrounds:** flat paper fills + a faint `--grad-board` paper texture. Cobalt (`--grad-gold`) is a near-flat solid reserved for primary CTAs, active states, brand mark. No busy patterns, no photos required.
- **Motif:** the **hexagon** (`--hex-clip`) — board cells, trait badges, callout markers, brand mark. Signature shape, now filled with flat spot ink.
- **Corners:** crisp, small radii (3–12px). Cards `--r-md` (8px). Pills fully round. Zine keeps borders visible.
- **Elevation = hard offset "misregister" shadows**, not blur. `--shadow-sm/md` are ink offsets (`2–4px 4px 0`); `--shadow-lg` is a **cobalt** offset used on card hover — the signature zine move. **No soft glows anywhere** (the old `--glow-*` tokens are re-tuned to hard offsets).
- **Borders:** dark ink hairlines (`rgba(27,27,27,0.12–0.55)`) — kept visible, print-like. Cobalt border (`--border-gold`) marks selection/active.
- **Cards:** paper/white surface (`--ink-800`), 1px ink hairline, hover → colored border + lift (`translateY(-3px)`) + cobalt offset shadow. Champion/trait cards take the **cost tier color** on their frame.
- **Motion:** snappy and tactical — `--ease-out`, 120–360ms. Buttons press down 1px; cards lift on hover; **no bounce**.
- **Layout:** `--container` 1200 / wide 1360, 24px gutter. Sticky translucent top nav over paper. Generous vertical rhythm on marketing, denser on database views.

## ICONOGRAPHY
- **No custom icon font or SVG set exists in the source.** The system's iconography is **geometric + typographic**: the hex mark, star glyphs (★) for unit tiers, a spot-ink coin dot for cost/gold, and a small inline stroked SVG magnifier baked into `SearchInput`.
- **Recommended set for build-out:** **Lucide** (CDN: `https://unpkg.com/lucide-static`) — 2px stroke, rounded caps. **Confirm with the user** before adopting; swap for a licensed set if Baron TFT chooses one.
- **Emoji / unicode:** used only as data markers (◆ mark, ★ stars, ⛁ coin, +/× in recipes), never as UI icons or decoration.
- **Champion/item art:** none shipped (would be Riot IP). Components fall back to tinted **initials** and accept a `portrait`/`icon`/`cover` URL for real art the user supplies.

---

## Index / manifest
- `styles.css` — global entry (import lines only).
- `tokens/` — `fonts.css` (Google Fonts: Epilogue, Libre Franklin, JetBrains Mono), `colors.css`, `typography.css`, `spacing.css`, `effects.css`.
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Brand).
- `components/` — reusable primitives, grouped:
  - **core/** — `Button`, `Tag`, `Badge`
  - **cards/** — `ChampionCard`, `TraitCard`, `GuideCard`
  - **tooltip/** — `UnitTooltip`, `ItemTooltip`
  - **feedback/** — `Callout`
  - **forms/** — `SearchInput`, `FilterChip`
  - **board/** — `HexBoard`
  - **navigation/** — `NavBar`, `Tabs`, `Breadcrumb`
- `ui_kits/landing/` — Baron TFT homepage composition.
- `explorations/` — direction studies (`Direction Proposals`, `Direction Preview`) kept for reference.
- `thumbnail.html` — homepage tile. `SKILL.md` — Agent-Skill wrapper.

### Component inventory note
The source Figma defined **no components**, so this set was authored from scratch to fit the requested surfaces (cards, tooltips, buttons/tags/badges, callouts, forms, hex board, nav/tabs/breadcrumb). No component here reproduces a Riot-owned UI pattern. Naming note: several color tokens keep legacy names (`--gold-*` now = cobalt, `--teal-*` now = orange, `--ink-*` now = light paper) so the flip from dark→zine needed no component rewrites.

## Fonts note
Webfonts load via a Google Fonts `@import` in `tokens/fonts.css` (no local binaries, so the compiler reports 0 `@font-face`). If offline/self-hosted fonts are required, download Epilogue + Libre Franklin + JetBrains Mono and add local `@font-face` rules.
