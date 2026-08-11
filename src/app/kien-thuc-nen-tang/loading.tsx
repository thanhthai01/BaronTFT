import { RouteStatePanel } from '@/components/layout/RouteStatePanel';

export default function LessonsLoading() {
  return (
    <RouteStatePanel
      label="baron-tft — lessons"
      command="pnpm load-lessons"
      title="Đang tải bài học…"
      description="Đang chuẩn bị nội dung kiến thức nền tảng và bài tập áp dụng."
    />
  );
}
