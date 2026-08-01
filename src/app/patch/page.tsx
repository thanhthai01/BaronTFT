import type { Metadata } from 'next';
import { PatchBoard } from '@/components/features/patch/PatchBoard';
import styles from './page.module.css';

export const metadata: Metadata = { title: 'Patch' };

/** Không dùng band tiêu đề lớn như các trang khác: mục tiêu của trang này là
 * thấy được thay đổi của bản vá ngay trong khung hình đầu tiên, nên H1 nằm gọn
 * trong cột lọc bên trái (PatchBoard) và lưới thay đổi bắt đầu ngay từ trên. */
export default function PatchPage() {
  return (
    <section className={styles.page}>
      <div className="wide-container">
        <PatchBoard />
      </div>
    </section>
  );
}
