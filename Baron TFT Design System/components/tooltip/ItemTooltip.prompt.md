Item hover card — icon, stat lines, passive text, and the build recipe (component items). Teaches what an item grants and how to craft it.

```jsx
<ItemTooltip name="Sách Cũ Nát" kind="Trang bị hoàn chỉnh"
  stats={['+20 SM Phép','+150 Máu','+20 Mana']}
  description="Khi tướng thi triển kỹ năng, <b>cháy lan</b> gây sát thương." 
  recipe={['🗡','⚡']} />
```

`description` accepts an HTML string; `recipe` shows component icons joined by `+`.
