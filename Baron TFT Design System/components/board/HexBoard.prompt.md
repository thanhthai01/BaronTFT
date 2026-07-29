TFT hexagonal board — offset rows of hexes, with placed units colored by cost and marked with star tiers. The canvas for teaching positioning and team comps.

```jsx
<HexBoard rows={4} cols={7} units={[
  { row: 0, col: 3, name: 'Ahri', cost: 4, stars: 2 },
  { row: 3, col: 1, name: 'Garen', cost: 1, stars: 1 },
]} onHexClick={(r,c,u)=>console.log(r,c,u)} />
```

Rows are 0-based from the back. Units carry `cost` (tier color), `stars` (1–3), and optional `portrait`.
