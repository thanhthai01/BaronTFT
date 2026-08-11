'use client';

import { useEffect } from 'react';
import { RouteStatePanel } from '@/components/layout/RouteStatePanel';
import '@/styles/globals.css';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="vi">
      <body>
        <RouteStatePanel
          label="baron-tft — fatal"
          command="pnpm recover-root"
          errorText="fatal: lỗi toàn trang"
          title="Baron TFT gặp lỗi toàn trang."
          description="Thử tải lại. Nếu vẫn lỗi, quay về trang chủ sau ít phút."
          onRetry={reset}
          homeHref="/"
        />
      </body>
    </html>
  );
}
