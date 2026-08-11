import { RouteStatePanel } from '@/components/layout/RouteStatePanel';

export default function Mua18Loading() {
  return (
    <RouteStatePanel
      label="baron-tft — set18"
      command="pnpm load-set18"
      title="Đang tải dữ liệu Mùa 18…"
      description="Đang chuẩn bị ma trận, tướng, tộc hệ, Tinh Linh và nâng cấp."
    />
  );
}
