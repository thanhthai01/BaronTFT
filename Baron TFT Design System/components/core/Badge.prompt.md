Monospace numeric / status chip. Its signature use is the champion **cost badge** — a gold coin plus the cost number, tinted by tier color.

```jsx
<Badge cost={5} />          // gold 5-cost coin
<Badge cost={2} />          // green 2-cost coin
<Badge tone="success">Đã học</Badge>
```

Pass `cost` 1–5 for cost coins; otherwise `tone` = `success|warning|danger` with children.
