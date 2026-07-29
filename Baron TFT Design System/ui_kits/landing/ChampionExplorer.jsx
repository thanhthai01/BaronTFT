// Baron TFT landing — Champion explorer: search + cost filters + roster grid + a live tooltip.
const { SearchInput, FilterChip, ChampionCard, UnitTooltip, Tag } = window.BaronTFTDesignSystem_5d933f;

const ROSTER = [
  { name: 'Garen', cost: 1, traits: ['Đấu Sĩ', 'Hộ Vệ'] },
  { name: 'Lux', cost: 2, traits: ['Pháp Sư', 'Ánh Sáng'] },
  { name: 'Jax', cost: 2, traits: ['Võ Sư'] },
  { name: 'Vi', cost: 3, traits: ['Đấu Sĩ', 'Quả Đấm'] },
  { name: 'Sett', cost: 1, traits: ['Đấu Sĩ'] },
  { name: 'Ahri', cost: 4, traits: ['Pháp Sư', 'Học Giả'] },
  { name: 'Jinx', cost: 4, traits: ['Xạ Thủ', 'Phá Hoại'] },
  { name: 'Ari', cost: 5, traits: ['Thần Long', 'Pháp Sư'] },
];

function ChampionExplorer() {
  const [q, setQ] = React.useState('');
  const [cost, setCost] = React.useState(null);
  const list = ROSTER.filter((c) =>
    (cost == null || c.cost === cost) &&
    (q === '' || c.name.toLowerCase().includes(q.toLowerCase()) || c.traits.some((t) => t.toLowerCase().includes(q.toLowerCase())))
  );
  const counts = [1, 2, 3, 4, 5].map((c) => ROSTER.filter((u) => u.cost === c).length);
  return (
    <section className="lp-section lp-section--alt" id="champions">
      <div className="lp-container">
        <div className="lp-section__head">
          <span className="tft-eyebrow">Thư viện tướng</span>
          <h2 className="lp-section__title">Tra cứu mọi tướng Set 18</h2>
          <p className="lp-section__sub">Lọc theo giá tiền, xem tộc–hệ và chỉ số. Di chuột vào tướng để xem chi tiết.</p>
        </div>
        <div className="lp-explorer">
          <div className="lp-explorer__main">
            <div className="lp-explorer__controls">
              <SearchInput value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ('')} placeholder="Tìm tướng hoặc tộc–hệ…" />
              <div className="lp-chips">
                <FilterChip active={cost == null} onClick={() => setCost(null)}>Tất cả</FilterChip>
                {[1, 2, 3, 4, 5].map((c, i) => (
                  <FilterChip key={c} active={cost === c} count={counts[i]} onClick={() => setCost(cost === c ? null : c)}>{c} vàng</FilterChip>
                ))}
              </div>
            </div>
            <div className="lp-roster">
              {list.map((c) => <ChampionCard key={c.name} {...c} />)}
              {list.length === 0 && <div className="lp-roster__empty">Không tìm thấy tướng phù hợp.</div>}
            </div>
          </div>
          <aside className="lp-explorer__side">
            <div className="lp-explorer__sidelabel"><Tag tone="teal" dot>Ví dụ chi tiết</Tag></div>
            <UnitTooltip name="Ahri" cost={4} title="Cửu Vĩ Hồ" traits={['Pháp Sư', 'Học Giả']}
              stats={[{ label: 'Máu', value: '700' }, { label: 'Sát thương', value: '55' }, { label: 'Giáp', value: '30' }, { label: 'Mana', value: '0/80' }]}
              ability={{ name: 'Cầu Lửa Hồ Ly', mana: '80', desc: 'Bắn cầu lửa vào kẻ địch xa nhất, gây <b>250</b> sát thương phép và giảm <b>20%</b> giáp trong 4 giây.' }} />
          </aside>
        </div>
      </div>
    </section>
  );
}

window.ChampionExplorer = ChampionExplorer;
