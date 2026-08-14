import { FeedbackAdminLogin } from '@/components/features/feedback/FeedbackAdminLogin';

export const metadata = { title: 'Đăng nhập quản lý góp ý', robots: { index: false, follow: false } };

export default function FeedbackAdminLoginPage() {
  return (
    <>
      <header className="page-header">
        <div className="wide-container">
          <span className="kicker">Quản lý</span>
          <h1>Mở hộp thư góp ý</h1>
          <p>Chỉ quản trị viên có mật khẩu mới xem được nội dung và email liên hệ.</p>
        </div>
      </header>
      <section className="section">
        <div className="wide-container"><FeedbackAdminLogin /></div>
      </section>
    </>
  );
}
