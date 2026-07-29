Lesson / guide card — cover, difficulty tag, title, and progress meta (lessons + duration). Renders as `<a>` by default so it's a clickable link tile.

```jsx
<GuideCard number={1} title="Bàn cờ hoạt động thế nào" level="Nhập môn"
  lessons={4} duration="10 phút" href="/guide/board"
  description="Hiểu vàng, máu, và vòng đấu trong 10 phút." />
```

`level` drives the tag tone (Nhập môn/Cơ bản → teal, Trung cấp/Nâng cao → gold). Pass `cover` for real art.
