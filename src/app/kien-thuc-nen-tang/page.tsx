import { redirect } from 'next/navigation';
import { lessons } from '@/content/lessons';

// Trang không-slug redirect sang bài đầu tiên thay vì tự render lesson[0]:
// tránh 2 URL (/kien-thuc-nen-tang và /kien-thuc-nen-tang/[slug đầu]) cùng
// serve một nội dung, vốn bị Google coi là duplicate content.
export default function FoundationalKnowledgePage() {
  redirect(`/kien-thuc-nen-tang/${lessons[0].slug}`);
}
