Primary action control — condensed uppercase label, hextech-gold CTA. Use `primary` for the main action on a view, `secondary`/`ghost` for supporting actions.

```jsx
<Button variant="primary" size="lg">Bắt đầu học</Button>
<Button variant="secondary">Xem meta</Button>
<Button variant="ghost" size="sm" leftIcon={<span>＋</span>}>Thêm tướng</Button>
```

Variants: `primary` (gold gradient), `secondary` (gold outline), `ghost` (neutral outline), `danger`. Sizes `sm|md|lg`. Pass `as="a"` + `href` for link buttons; `block` to fill width.
