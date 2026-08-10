export type PointerSample = { x: number; y: number; t: number };

export type BubbleSide = 'left' | 'right';

/** Số mili-giây chiếu vận tốc hiện tại về phía trước để dự đoán điểm rơi —
 * cho phép "ném" bubble từ cạnh này sang cạnh kia dù điểm thả tức thời còn
 * ở nửa màn hình cũ, giống cơ chế physics-based landing của Android Bubble API. */
export const PROJECTION_MS = 180;

/** Chỉ giữ mẫu pointer trong khoảng thời gian này để tính vận tốc — mẫu cũ
 * hơn không còn phản ánh chuyển động "ném" ngay trước khi thả. */
export const VELOCITY_WINDOW_MS = 100;

export function computeVelocity(samples: PointerSample[], now: number): number {
  const recent = samples.filter((sample) => now - sample.t <= VELOCITY_WINDOW_MS);
  if (recent.length < 2) return 0;

  const first = recent[0];
  const last = recent[recent.length - 1];
  const dt = last.t - first.t;
  if (dt <= 0) return 0;

  return (last.x - first.x) / dt;
}

export function resolveSnapSide(params: { x: number; vx: number; viewportWidth: number; projectionMs?: number }): BubbleSide {
  const { x, vx, viewportWidth, projectionMs = PROJECTION_MS } = params;
  const predictedX = x + vx * projectionMs;
  return predictedX < viewportWidth / 2 ? 'left' : 'right';
}

export type BubblePositionValue = {
  side: BubbleSide;
  offsetY: number;
  collapsed: boolean;
};

export type PanelPlacementResult = {
  placement: 'above' | 'below';
  maxHeight: number;
};

export function clampOffsetY(offsetY: number, viewportHeight: number, bubbleSize: number, topSafe: number, bottomSafe: number): number {
  const min = topSafe;
  const max = Math.max(min, viewportHeight - bottomSafe - bubbleSize);
  return Math.min(Math.max(offsetY, min), max);
}

export function normalizeBubblePosition(
  value: unknown,
  fallback: BubblePositionValue,
  viewportHeight: number,
  expandedSize: number,
  collapsedSize: number,
  topSafe: number,
  bottomSafe: number,
): BubblePositionValue {
  if (!value || typeof value !== 'object') return fallback;
  const candidate = value as Partial<BubblePositionValue>;
  const side = candidate.side === 'left' || candidate.side === 'right' ? candidate.side : fallback.side;
  const collapsed = typeof candidate.collapsed === 'boolean' ? candidate.collapsed : fallback.collapsed;
  const rawOffset = typeof candidate.offsetY === 'number' && Number.isFinite(candidate.offsetY) ? candidate.offsetY : fallback.offsetY;
  const size = collapsed ? collapsedSize : expandedSize;

  return {
    side,
    collapsed,
    offsetY: clampOffsetY(rawOffset, viewportHeight, size, topSafe, bottomSafe),
  };
}

export function edgePeekLeft(params: { side: BubbleSide; viewportWidth: number; size: number; visibleSize: number }): number {
  const { side, viewportWidth, size, visibleSize } = params;
  return side === 'left' ? visibleSize - size : viewportWidth - visibleSize;
}

export function choosePanelPlacement(params: {
  bubbleTop: number;
  bubbleSize: number;
  panelHeight: number;
  viewportHeight: number;
  topClearance: number;
  bottomClearance: number;
  gap: number;
}): PanelPlacementResult {
  const { bubbleTop, bubbleSize, panelHeight, viewportHeight, topClearance, bottomClearance, gap } = params;
  const spaceAbove = bubbleTop - gap - topClearance;
  const spaceBelow = viewportHeight - bottomClearance - (bubbleTop + bubbleSize + gap);
  const fitsAbove = panelHeight <= spaceAbove;
  const fitsBelow = panelHeight <= spaceBelow;

  if (fitsAbove) return { placement: 'above', maxHeight: Math.max(0, spaceAbove) };
  if (fitsBelow) return { placement: 'below', maxHeight: Math.max(0, spaceBelow) };

  return spaceBelow >= spaceAbove
    ? { placement: 'below', maxHeight: Math.max(0, spaceBelow) }
    : { placement: 'above', maxHeight: Math.max(0, spaceAbove) };
}
