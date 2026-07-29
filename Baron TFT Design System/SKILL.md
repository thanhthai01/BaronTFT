---
name: baron-tft-design
description: Use this skill to generate well-branded interfaces and assets for Baron TFT — a personal Teamfight Tactics (Set 18) knowledge-sharing site where the author writes up the comps, economy and meta reads they use to climb rank (bilingual Vietnamese/English, risograph "zine" theme: ivory paper + cobalt & fluoro-orange spot inks, Epilogue + Libre Franklin) — for production or throwaway prototypes/mocks. Contains design guidelines, colors, type, fonts, and UI-kit components for prototyping.
user-invocable: true
---

Read the `readme.md` file within this skill first, then explore the other files (tokens/, components/, guidelines/, ui_kits/).

- If creating visual artifacts (slides, mocks, throwaway prototypes), copy assets out and create static HTML files for the user to view. Link `styles.css`, then load components via the compiled bundle (`_ds_bundle.js`, namespace `window.BaronTFTDesignSystem_*`) — the component card HTML files under `components/*/` show the exact mount pattern.
- If working on production code, copy assets and read the rules here to become an expert in designing with this brand.
- Positioning: knowledge-sharing, first person — the author shares what they know and do to climb rank, NOT a course. Frame content as notes/breakdowns/opinions ("cách mình chơi"), not lessons.
- Language: Vietnamese is the default; keep English parallel and available. Headings/buttons UPPERCASE; body sentence case; bold key game numbers.
- Visual: risograph zine — ivory paper ground, ink-black text/hairlines, cobalt (`--gold-*`) + fluoro-orange (`--teal-*`) spot inks, hard offset shadows (no glow). Token names are legacy (gold=cobalt, teal=orange, ink=light paper).
- There is **no logo** — render the wordmark in type (BARON + TFT, Epilogue). Never invent one. No Riot-owned champion/item art is bundled; use tinted initials or user-supplied images.

If the user invokes this skill without other guidance, ask what they want to build, ask a few focused questions, and act as an expert designer who outputs HTML artifacts _or_ production code depending on the need.
