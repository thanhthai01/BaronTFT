// Baron TFT landing — Hero section. Uses NavBar + Button + Tag from the DS bundle.
const { Button, Tag } = window.BaronTFTDesignSystem_5d933f;

function Hero() {
  return (
    <section className="lp-hero">
      <div className="lp-hero__glow" />
      <div className="lp-container lp-hero__inner">
        <div className="lp-hero__copy">
          <span className="tft-eyebrow">Học TFT · Set 18 · Miễn phí</span>
          <h1 className="lp-hero__title">Làm chủ<br /><em>đấu trường</em><br />chỉ trong<br />vài ván</h1>
          <p className="lp-hero__lead">Baron TFT dạy bạn từ con số 0: vàng, máu, tộc–hệ, đội hình và cách leo rank. Bài học ngắn, ví dụ trực quan, đọc là hiểu.</p>
          <div className="lp-hero__cta">
            <Button size="lg">Bắt đầu học</Button>
            <Button size="lg" variant="secondary">Xem lộ trình</Button>
          </div>
          <div className="lp-hero__stats">
            <div className="lp-stat"><b>60+</b><span>Bài học</span></div>
            <div className="lp-stat"><b>Set 18</b><span>Cập nhật</span></div>
            <div className="lp-stat"><b>VI / EN</b><span>Song ngữ</span></div>
          </div>
        </div>
        <div className="lp-hero__board">
          <HeroBoard />
        </div>
      </div>
    </section>
  );
}

function HeroBoard() {
  const { HexBoard, Tag } = window.BaronTFTDesignSystem_5d933f;
  const units = [
    { row: 0, col: 2, name: 'Ari', cost: 5, stars: 2 }, { row: 0, col: 4, name: 'Ahri', cost: 4, stars: 2 },
    { row: 1, col: 3, name: 'Vi', cost: 3, stars: 1 }, { row: 1, col: 5, name: 'Lux', cost: 2, stars: 2 },
    { row: 2, col: 1, name: 'Jax', cost: 2, stars: 1 }, { row: 3, col: 2, name: 'Garen', cost: 1, stars: 2 }, { row: 3, col: 4, name: 'Sett', cost: 1, stars: 1 },
  ];
  return (
    <div className="lp-heroboard">
      <div className="lp-heroboard__tag"><Tag tone="gold" dot>Đội hình mẫu</Tag></div>
      <HexBoard units={units} hexSize={58} />
      <div className="lp-heroboard__caption">Kéo–thả để xếp đội · vị trí quyết định thắng thua</div>
    </div>
  );
}

window.Hero = Hero;
