import { redirect } from 'next/navigation';

// Trang không-section redirect sang section đầu tiên (ma-tran-toc-he) thay vì tự
// render Set18Codex ở đây: tránh /mua-18 và /mua-18/ma-tran-toc-he cùng serve một
// nội dung — cùng lý do với redirect ở /kien-thuc-nen-tang/page.tsx.
export default function Season18Page() {
  redirect('/mua-18/ma-tran-toc-he');
}
