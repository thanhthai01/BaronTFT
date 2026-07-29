import { Button } from '@/components/design-system/Button/Button';
import { DecisionBoard } from '@/components/features/decision-board/DecisionBoard';
import { trainingWeeks } from '@/content/curriculum';
import styles from './page.module.css';

const entries = [
  {
    title: 'Tôi muốn học từ đầu',
    text: 'Đi theo lộ trình 8 module, mỗi module có một kỹ năng và một bài tập trong trận.',
  },
  {
    title: 'Tôi đang kẹt rank',
    text: 'Chẩn đoán lỗi lặp lại: econ, tempo, item, scout, positioning hay pivot.',
  },
  {
    title: 'Tôi vừa thua và muốn review',
    text: 'Tìm turning point, chọn lỗi đầu tiên có thể sửa và copy summary Markdown.',
  },
];

const problems = [
  'Roll không có mục tiêu rõ.',
  'Giữ đồ quá lâu vì sợ sai meta.',
  'Scout nhưng không đổi positioning.',
  'Không biết trận này đánh top 1, top 4 hay cứu top 6.',
];

export default function HomePage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={[styles.heroGrid, 'wide-container'].join(' ')}>
          <div>
            <span className="kicker">TFT War Room · Evergreen skill</span>
            <h1>
              Học cách thắng lobby, <em>không học thuộc đội hình.</em>
            </h1>
            <p className={styles.lead}>
              Một giáo trình TFT xuyên mùa giúp bạn đọc sức mạnh bàn đấu, quản lý tài nguyên, chọn nhịp roll và review lỗi sau mỗi phiên leo rank.
            </p>
            <div className={styles.ctaRow}>
              <Button href="/kien-thuc-nen-tang" size="lg">Mở kiến thức nền tảng</Button>
              <Button href="/checklist" size="lg" variant="secondary">Mở checklist trong trận</Button>
            </div>
          </div>
          <DecisionBoard />
        </div>
      </section>

      <section className="section">
        <div className="wide-container">
          <span className="kicker">Chọn cửa vào</span>
          <h2 className="section-title">Hôm nay bạn cần học, chơi hay review?</h2>
          <p className="section-lead">Website không ép bạn đọc từ đầu. Chọn đúng trạng thái hiện tại để vào đúng công cụ.</p>
          <div className={styles.entryGrid}>
            {entries.map((entry) => (
              <article className={styles.card} key={entry.title}>
                <h3>{entry.title}</h3>
                <p>{entry.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--band">
        <div className="wide-container">
          <span className="kicker">Bạn đang mất rank vì…</span>
          <h2 className="section-title">Không phải thiếu meta. Thường là thiếu một quyết định đúng lúc.</h2>
          <div className={styles.problemGrid}>
            {problems.map((problem) => (
              <article className={styles.card} key={problem}>
                <h3>{problem}</h3>
                <p>Mở checklist, chọn một lỗi và luyện đúng hành vi đó trong 10 trận.</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wide-container">
          <span className="kicker">Giáo án 8 tuần</span>
          <h2 className="section-title">Một tuần, một kỹ năng, một cách đo tiến bộ.</h2>
          <div className={styles.weekGrid}>
            {trainingWeeks.map((week, index) => (
              <div className={styles.week} key={week}>
                <strong>Tuần {index + 1}</strong>
                <span>{week}</span>
              </div>
            ))}
          </div>
          <div className={styles.quickChecklist}>
            <div>
              <h2>Trước trận tiếp theo</h2>
              <p>Board mình mạnh hay yếu? Mình đang chơi vì top 4 hay top 1? Nếu roll, mình tìm chính xác điều gì?</p>
            </div>
            <Button href="/checklist" variant="secondary">Mở checklist</Button>
          </div>
        </div>
      </section>
    </>
  );
}
