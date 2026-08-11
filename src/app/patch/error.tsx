'use client';

import { useEffect } from 'react';
import { RouteStatePanel } from '@/components/layout/RouteStatePanel';

export default function PatchError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <RouteStatePanel
      label="baron-tft — patch-error"
      command="pnpm recover-patch"
      errorText="runtime: không mở được bảng patch"
      title="Không mở được bảng patch."
      description="Thử tải lại bản vá. Nếu lỗi lặp lại, quay về trang chủ rồi mở lại Patch."
      onRetry={reset}
      homeHref="/"
    />
  );
}
