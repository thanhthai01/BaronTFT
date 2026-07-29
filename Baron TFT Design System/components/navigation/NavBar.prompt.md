Top navigation bar — hex brand mark, section links (gold underline on active), and a right-side actions slot. Header for every Baron TFT screen. There is no logo file; the wordmark renders in type (BARON + gold TFT).

```jsx
<NavBar active="guide" onNavigate={setPage}
  links={[{label:'Học',key:'guide'},{label:'Tướng',key:'champions'},{label:'Đội hình',key:'comps'}]}
  actions={<Button size="sm">Đăng nhập</Button>} />
```
