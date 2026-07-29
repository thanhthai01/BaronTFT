# Baron TFT — Landing UI Kit

A high-fidelity recreation of the **Baron TFT homepage** — an educational Teamfight Tactics (Set 18) site. Composes the design-system primitives; nothing is re-implemented here.

## Screens
- `index.html` — full interactive homepage. Sections:
  - **Hero** (`Hero.jsx`) — headline, dual CTA, live stats, and a populated `HexBoard` sample comp.
  - **Learning path** (`LearningPath.jsx`) — `Tabs` switch across Nhập môn / Cơ bản / Nâng cao, each a grid of `GuideCard`s + a `Callout`.
  - **Champion explorer** (`ChampionExplorer.jsx`) — `SearchInput` + cost `FilterChip`s filtering a live `ChampionCard` roster, with a `UnitTooltip` detail panel.
  - **Traits & items** (`Sections.jsx`) — `TraitCard` synergies beside `ItemTooltip` cards.
  - **CTA + Footer** (`Sections.jsx`).

## Interactions
- Level tabs re-populate the guide grid.
- Champion search + cost chips filter the roster in real time (empty state included).
- Nav links / language toggle are stateful (cosmetic routing).

## Components used
NavBar, Button, Tag, Badge, HexBoard, GuideCard, Callout, Tabs, SearchInput, FilterChip, ChampionCard, UnitTooltip, TraitCard, ItemTooltip — every family in the system.

## Notes
- Vietnamese-default copy, English toggle in nav.
- No champion/item art (Riot IP); cards use tinted initials. Supply `portrait`/`cover` URLs for real imagery.
- Loads the compiled bundle `../../_ds_bundle.js` (namespace `window.BaronTFTDesignSystem_*`).
