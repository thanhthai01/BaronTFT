Full champion hover card — name, cost, epithet, traits, stat grid, and ability text. The main surface for teaching what a unit does.

```jsx
<UnitTooltip name="Ahri" cost={4} title="Cửu Vĩ Hồ" traits={['Pháp Sư','Học Giả']}
  stats={[{label:'Máu',value:'700'},{label:'Sát thương',value:'55'},{label:'Giáp',value:'30'},{label:'Mana',value:'0/80'}]}
  ability={{ name:'Cầu Lửa Hồ Ly', mana:'80', desc:'Bắn cầu lửa gây <b>250</b> sát thương phép.' }} />
```

`ability.desc` accepts an HTML string (use `<b>` to highlight numbers) or a React node.
