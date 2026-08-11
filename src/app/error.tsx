'use client';

import { useEffect } from 'react';
import { RouteStatePanel } from '@/components/layout/RouteStatePanel';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <RouteStatePanel
      label="baron-tft — error"
      command="npm run recover"
      errorText="runtime: không tải được màn hình này"
      title="Có lỗi khi mở trang."
      description="Thử tải lại phần này. Nếu lỗi lặp lại, quay về trang chủ rồi mở lại luồng học."
      onRetry={reset}
      homeHref="/"
    />
  );
}
