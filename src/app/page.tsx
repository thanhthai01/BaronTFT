import { Button } from '@/components/design-system/Button/Button';
import { DecisionBoard } from '@/components/features/decision-board/DecisionBoard';
import styles from './page.module.css';

const destinations = [
  {
    title: 'Mùa 18',
    text: 'Tra cứu tướng, tộc hệ, Tinh Linh và nâng cấp của set hiện tại.',
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
            <span className="kicker">Phòng huấn luyện TFT xuyên mùa</span>
            <h1>
              Học cách thắng lobby, <em>không học thuộc đội hình.</em>
            </h1>
            <p className={styles.lead}>
              Baron TFT giúp bạn chọn đúng kỹ năng cần luyện, đọc đúng tín hiệu trong trận và sửa một hành vi sau trận — dùng được qua nhiều mùa, không phụ thuộc tier list hôm nay.
            </p>
            <div className={styles.ctaRow}>
              <Button href="/lo-trinh" size="lg">Bắt đầu lộ trình</Button>
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
