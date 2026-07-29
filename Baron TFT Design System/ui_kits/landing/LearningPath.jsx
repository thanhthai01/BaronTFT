// Baron TFT landing — "Learning path" section: guide cards + a sample lesson preview.
const { GuideCard, Callout, Tabs } = window.BaronTFTDesignSystem_5d933f;

function LearningPath() {
  const [level, setLevel] = React.useState('nhap-mon');
  const guides = {
    'nhap-mon': [
      { number: 1, title: 'Bàn cờ hoạt động thế nào', level: 'Nhập môn', lessons: 4, duration: '10 phút', description: 'Vàng, máu, vòng đấu và cửa hàng — nền tảng của mọi ván.' },
      { number: 2, title: 'Mua & bán tướng', level: 'Nhập môn', lessons: 3, duration: '8 phút', description: 'Cách roll, ghép 3 sao và khi nào nên bán.' },
      { number: 3, title: 'Tộc & Hệ là gì', level: 'Nhập môn', lessons: 5, duration: '12 phút', description: 'Kích hoạt sức mạnh cộng hưởng cho cả đội.' },
    ],
    'co-ban': [
      { number: 4, title: 'Quản lý vàng & lãi', level: 'Cơ bản', lessons: 4, duration: '11 phút', description: 'Giữ mốc 50 vàng, khi nào nên tiêu và giữ.' },
      { number: 5, title: 'Lên cấp đúng lúc', level: 'Cơ bản', lessons: 3, duration: '9 phút', description: 'Nhịp lên cấp để cân bằng máu và sức mạnh.' },
      { number: 6, title: 'Trang bị cơ bản', level: 'Cơ bản', lessons: 6, duration: '15 phút', description: 'Ghép đồ từ các mảnh và ưu tiên carry.' },
    ],
    'nang-cao': [
      { number: 7, title: 'Đọc vị đối thủ', level: 'Nâng cao', lessons: 4, duration: '13 phút', description: 'Scout bàn địch để xoay đội hình kịp thời.' },
      { number: 8, title: 'Positioning chuyên sâu', level: 'Nâng cao', lessons: 5, duration: '16 phút', description: 'Xếp vị trí chống sát thủ và AoE.' },
      { number: 9, title: 'Flex & chuyển hướng', level: 'Nâng cao', lessons: 4, duration: '14 phút', description: 'Không cố định lối chơi — bám theo tài nguyên.' },
    ],
  };
  return (
    <section className="lp-section" id="learn">
      <div className="lp-container">
        <div className="lp-section__head">
          <span className="tft-eyebrow">Lộ trình học</span>
          <h2 className="lp-section__title">Từ người mới đến leo rank</h2>
          <p className="lp-section__sub">Ba chặng, mỗi chặng vài bài ngắn. Học tới đâu, chơi tới đó.</p>
        </div>
        <div className="lp-section__tabs">
          <Tabs value={level} onChange={setLevel} tabs={[
            { label: 'Nhập môn', key: 'nhap-mon' },
            { label: 'Cơ bản', key: 'co-ban' },
            { label: 'Nâng cao', key: 'nang-cao' },
          ]} />
        </div>
        <div className="lp-guidegrid">
          {guides[level].map((g) => <GuideCard key={g.number} {...g} as="div" />)}
        </div>
        <div className="lp-calloutrow">
          <Callout variant="tip" title="Mẹo học nhanh">Làm theo thứ tự và chơi thử ngay sau mỗi bài. Kiến thức chỉ dính khi bạn <b>áp dụng trong ván thật</b>.</Callout>
        </div>
      </div>
    </section>
  );
}

window.LearningPath = LearningPath;
