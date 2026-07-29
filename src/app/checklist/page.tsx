import type { Metadata } from 'next';
import { ChecklistApp } from '@/components/features/checklist/ChecklistApp';

export const metadata: Metadata = {
  title: 'Checklist trong trận',
};

export default function ChecklistPage() {
  return (
    <>
      <header className="page-header">
        <div className="wide-container">
          <span className="kicker">Dùng khi đang chơi</span>
          <h1>Checklist trong trận</h1>
          <p>Font lớn, câu hỏi ngắn, local state. Mở trên điện thoại hoặc màn hình phụ và chỉ tick những quyết định thật sự đổi trận.</p>
        </div>
      </header>
      <section className="section">
        <div className="wide-container">
          <ChecklistApp />
        </div>
      </section>
    </>
  );
}
