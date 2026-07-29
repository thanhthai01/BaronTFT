// Baron TFT landing — Traits panel + item cheat row + CTA + footer.
const { TraitCard, ItemTooltip, Button, Tag } = window.BaronTFTDesignSystem_5d933f;

function TraitsSection() {
  return (
    <section className="lp-section" id="traits">
      <div className="lp-container">
        <div className="lp-two">
          <div className="lp-two__left">
            <span className="tft-eyebrow">Tộc & Hệ</span>
            <h2 className="lp-section__title">Cộng hưởng sức mạnh</h2>
            <p className="lp-section__sub">Gom đủ số tướng cùng tộc–hệ để kích hoạt hiệu ứng. Đây là trái tim của việc dựng đội.</p>
            <div className="lp-traitlist">
              <TraitCard name="Pháp Sư" icon="✦" count="4 / 6" active tiers={['2', '4', '6']} activeTier={1} description="Tăng sát thương phép cho toàn đội mỗi khi thi triển kỹ năng." />
              <TraitCard name="Đấu Sĩ" icon="⚔" count="2 / 4" tiers={['2', '4', '6']} activeTier={0} description="Nhận thêm máu tối đa và giáp khi vào trận." />
            </div>
          </div>
          <div className="lp-two__right">
            <div className="lp-itempanel">
              <div className="lp-itempanel__head"><Tag tone="gold" dot>Trang bị nổi bật</Tag></div>
              <div className="lp-itemrow">
                <ItemTooltip name="Sách Cũ Nát" kind="Trang bị hoàn chỉnh" stats={['+20 SM Phép', '+150 Máu', '+20 Mana']} description="Khi tướng thi triển kỹ năng, gây <b>cháy lan</b> lên kẻ địch xung quanh." recipe={['🗡', '⚡']} />
                <ItemTooltip name="Vô Cực Kiếm" kind="Trang bị hoàn chỉnh" stats={['+35% Chí Mạng', '+45 SM Vật Lý']} description="Sát thương chí mạng vượt trội — <b>trang bị carry</b> hàng đầu." recipe={['🗡', '🎯']} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="lp-cta" id="start">
      <div className="lp-cta__glow" />
      <div className="lp-container lp-cta__inner">
        <span className="tft-eyebrow">Sẵn sàng chưa?</span>
        <h2 className="lp-cta__title">Bắt đầu ván đầu tiên<br />với sự tự tin</h2>
        <p className="lp-cta__sub">Miễn phí, song ngữ, và luôn cập nhật theo phiên bản mới nhất.</p>
        <div className="lp-cta__buttons">
          <Button size="lg">Học bài đầu tiên</Button>
          <Button size="lg" variant="ghost">Tải cheat-sheet</Button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const cols = [
    { h: 'Học', links: ['Lộ trình', 'Nhập môn', 'Cơ bản', 'Nâng cao'] },
    { h: 'Dữ liệu', links: ['Tướng', 'Tộc & Hệ', 'Trang bị', 'Đội hình meta'] },
    { h: 'Cộng đồng', links: ['Discord', 'Đóng góp', 'Báo lỗi', 'Về Baron TFT'] },
  ];
  return (
    <footer className="lp-footer">
      <div className="lp-container lp-footer__inner">
        <div className="lp-footer__brand">
          <div className="lp-footer__mark">◆</div>
          <div>
            <div className="lp-footer__wm">BARON<em>TFT</em></div>
            <p className="lp-footer__note">Website giáo dục độc lập về Teamfight Tactics. Không liên kết với Riot Games.</p>
          </div>
        </div>
        <div className="lp-footer__cols">
          {cols.map((c) => (
            <div key={c.h} className="lp-footer__col">
              <div className="lp-footer__h">{c.h}</div>
              {c.links.map((l) => <a key={l} href="#" className="lp-footer__link">{l}</a>)}
            </div>
          ))}
        </div>
      </div>
      <div className="lp-footer__bar">© 2026 Baron TFT · Ngôn ngữ: Tiếng Việt (EN hỗ trợ)</div>
    </footer>
  );
}

Object.assign(window, { TraitsSection, CTASection, Footer });
