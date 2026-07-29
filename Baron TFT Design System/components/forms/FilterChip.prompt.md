Toggleable filter pill — cost, trait, or role facets above a results grid. Fills gold when active; behaves as a button with `aria-pressed`.

```jsx
<FilterChip active={c===2} onClick={()=>setC(2)} count={12}>2 vàng</FilterChip>
<FilterChip active removable onClick={clear}>Sát thủ</FilterChip>
```

Use `count` to show how many results match; `removable` adds an × on the active state.
