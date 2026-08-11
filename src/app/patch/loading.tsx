import { RouteStatePanel } from '@/components/layout/RouteStatePanel';

export default function PatchLoading() {
  return (
    <RouteStatePanel
      label="baron-tft — patch"
      command="pnpm load-patch"
      title="Đang tải bản vá…"
      description="Đang chuẩn bị bảng thay đổi, bộ lọc và phân tích bản vá."
    />
  );
}
