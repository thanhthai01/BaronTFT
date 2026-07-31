import { Button } from '@/components/design-system/Button/Button';
import { DecisionBoard } from '@/components/features/decision-board/DecisionBoard';
import styles from './page.module.css';

const destinations = [
  {
    title: 'Mùa 18',
    text: 'Tra cứu tướng, tộc hệ, linh hỏa và nâng cấp của set hiện tại.',
    href: '/mua-18',
    cta: 'Xem Mùa 18',
  },
  {
    title: 'Checklist',
    text: 'Câu hỏi ngắn dùng ngay trong trận: lên cấp, roll, giữ vàng hay pivot.',
    href: '/checklist',
    cta: 'Mở checklist',
  },
  {
    title: 'Patch',
    text: 'Đọc thay đổi patch mới nhất: buff, nerf, rework và ảnh hưởng tới meta.',
    href: '/patch',
    cta: 'Xem patch',
  },
];

export default function HomePage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={[styles.heroGrid, 'wide-container'].join(' ')}>
          <div>
            <span className="kicker">Blog TFT cá nhân</span>
            <h1>
              Ghi lại <em>kiến thức cơ bản</em> mình học được khi chơi TFT.
            </h1>
            <p className={styles.lead}>
              Nơi mình lưu kiến thức nền tảng, dữ liệu Mùa 18, checklist trong trận và các bản patch — viết đơn giản, dùng lại được ngay.
            </p>
            <div className={styles.ctaRow}>
              <Button href="/kien-thuc-nen-tang" size="lg">Đọc kiến thức nền tảng</Button>
              <Button href="/checklist" size="lg" variant="secondary">Mở checklist trong trận</Button>
            </div>
          </div>
          <DecisionBoard />
        </div>
      </section>

      <section className="section">
        <div className="wide-container">
          <span className="kicker">Bắt đầu từ đâu</span>
          <h2 className="section-title">Ba trang bạn sẽ dùng nhiều nhất</h2>
          <div className={styles.entryGrid}>
            {destinations.map((item) => (
              <article className={styles.card} key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <Button className={styles.cardAction} href={item.href} variant="secondary">{item.cta}</Button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
