import type { Metadata } from 'next';
import { ReviewLab } from '@/components/features/review-lab/ReviewLab';

export const metadata: Metadata = {
  title: 'Review Lab',
};

export default function ReviewPage() {
  return (
    <>
      <header className="page-header">
        <div className="wide-container">
          <span className="kicker">15 phút sau trận</span>
          <h1>Phòng review sau trận</h1>
          <p>Đừng review toàn bộ trận. Tìm turning point, chọn lỗi đầu tiên có thể sửa, viết quyết định thay thế và mang nó vào trận sau.</p>
        </div>
      </header>
      <section className="section">
        <div className="wide-container">
          <ReviewLab />
        </div>
      </section>
    </>
  );
}
