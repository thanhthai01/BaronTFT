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

export function clampOffsetY(offsetY: number, viewportHeight: number, bubbleSize: number, topSafe: number, bottomSafe: number): number {
  const min = topSafe;
  const max = Math.max(min, viewportHeight - bottomSafe - bubbleSize);
  return Math.min(Math.max(offsetY, min), max);
}
