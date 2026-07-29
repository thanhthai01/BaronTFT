Search field — leading glass icon, optional keyboard hint or clear button. Primary lookup control for the champion/item database.

```jsx
<SearchInput value={q} onChange={e => setQ(e.target.value)} kbd="/" />
<SearchInput size="sm" value={q} onChange={...} onClear={() => setQ('')} />
```

Placeholder defaults to Vietnamese. Pass `onClear` to show the × button when there's a value.
