import type { Metadata } from 'next';
import { FeedbackForm } from '@/components/features/feedback/FeedbackForm';

export const metadata: Metadata = {
  title: 'Góp ý',
  description: 'Báo lỗi dữ liệu Mùa 18 hoặc đề xuất tính năng cho Baron TFT qua email.',
  alternates: { canonical: '/gop-y' },
};

export default function FeedbackPage() {
  return (
    <>
      <header className="page-header">
        <div className="wide-container">
          <span className="kicker">Góp ý</span>
          <h1>Website còn thiếu gì, hoặc có chỗ nào chưa ổn?</h1>
          <p>Gửi thẳng qua email, mình đọc và phản hồi trực tiếp.</p>
        </div>
      </header>
      <section className="section">
        <div className="wide-container">
          <FeedbackForm />
        </div>
      </section>
    </>
  );
}
