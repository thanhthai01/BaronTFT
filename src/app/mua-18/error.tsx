'use client';

import { useEffect } from 'react';
import { RouteStatePanel } from '@/components/layout/RouteStatePanel';

export default function Mua18Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <RouteStatePanel
      label="baron-tft — set18-error"
      command="pnpm recover-set18"
      errorText="runtime: không mở được dữ liệu Mùa 18"
      title="Không mở được dữ liệu Mùa 18."
      description="Thử tải lại phần này. Nếu lỗi vẫn còn, quay về trang chủ rồi mở lại Mùa 18."
      onRetry={reset}
      homeHref="/"
    />
  );
}
