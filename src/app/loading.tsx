import { RouteStatePanel } from '@/components/layout/RouteStatePanel';

export default function Loading() {
  return (
    <RouteStatePanel
      label="baron-tft — loading"
      command="pnpm load-session"
      title="Đang tải Baron TFT…"
      description="Đang chuẩn bị dữ liệu và giao diện huấn luyện."
    />
  );
}
