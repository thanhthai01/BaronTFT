'use client';

import { useEffect } from 'react';
import { RouteStatePanel } from '@/components/layout/RouteStatePanel';

export default function LessonsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <RouteStatePanel
      label="baron-tft — lessons-error"
      command="pnpm recover-lessons"
      errorText="runtime: không mở được bài học"
      title="Không mở được bài học."
      description="Thử tải lại bài học. Nếu lỗi vẫn còn, quay về trang chủ rồi mở lại Kiến thức nền tảng."
      onRetry={reset}
      homeHref="/"
    />
  );
}
