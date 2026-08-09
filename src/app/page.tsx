import { Button } from '@/components/design-system/Button/Button';
import { DecisionBoard } from '@/components/features/decision-board/DecisionBoard';
import styles from './page.module.css';

const taskEntries = [
  {
    title: 'Tôi chưa biết nên luyện gì',
    text: 'Chẩn đoán triệu chứng đang lặp lại rồi chọn đúng bài trong lộ trình.',
    href: '/lo-trinh',
    cta: 'Bắt đầu lộ trình',
  },
  {
    title: 'Tôi đang trong trận',
    text: 'Mở checklist ngắn để chốt level, roll, giữ vàng, pivot và xếp bài.',
    href: '/checklist',
    cta: 'Mở checklist',
  },
  {
    title: 'Tôi vừa chơi xong',
    text: 'Ghi lỗi đầu tiên có thể sửa và một hành vi cho trận kế tiếp trong 30–60 giây.',
    href: '/checklist?stage=post',
    cta: 'Ghi debrief sau trận',
  },
];

const lookupLinks = [
  { label: 'Mùa 18', href: '/mua-18' },
  { label: 'Patch', href: '/patch' },
  { label: 'Nguồn học', href: '/nguon-hoc' },
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
          <span className="kicker">Bắt đầu từ việc đang cần</span>
          <h2 className="section-title">Bạn đang ở nhịp nào?</h2>
          <div className={styles.entryGrid}>
            {taskEntries.map((item) => (
              <article className={styles.card} key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <Button className={styles.cardAction} href={item.href} variant="secondary">{item.cta}</Button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.lookupStrip} aria-labelledby="lookup-title">
        <div className={[styles.lookupInner, 'wide-container'].join(' ')}>
          <div>
            <span className="kicker">Tra cứu nhanh</span>
            <h2 id="lookup-title">Dữ liệu mùa và patch vẫn ở đây, nhưng không phải điểm bắt đầu.</h2>
          </div>
          <div className={styles.lookupLinks}>
            {lookupLinks.map((link) => (
              <Button href={link.href} key={link.href} variant="secondary">{link.label}</Button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
