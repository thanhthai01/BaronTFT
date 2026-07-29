Tab switcher — segmented gold pill (default) or underlined `line` style. Splits content within a page.

```jsx
<Tabs value={tab} onChange={setTab} tabs={[
  {label:'Tổng quan',key:'overview'},
  {label:'Kỹ năng',key:'ability'},
  {label:'Trang bị',key:'items',badge:3},
]} />
<Tabs variant="line" .../>
```
