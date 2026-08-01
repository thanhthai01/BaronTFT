/** Scroll-driven Animations (ScrollTimeline) chưa có trong lib.dom của
 *  TypeScript 5.8. Khai báo tối thiểu đúng phần ReadingProgressBar dùng —
 *  bỏ khi lib.dom bổ sung sẵn. */

interface ScrollTimelineOptions {
  source?: Element | null;
  axis?: 'block' | 'inline' | 'x' | 'y';
}

interface ScrollTimeline extends AnimationTimeline {
  readonly source: Element | null;
  readonly axis: 'block' | 'inline' | 'x' | 'y';
}

declare const ScrollTimeline: {
  prototype: ScrollTimeline;
  new (options?: ScrollTimelineOptions): ScrollTimeline;
};

/** WAAPI cho phép truyền timeline tuỳ ý vào element.animate(), lib.dom chưa mô tả. */
interface KeyframeAnimationOptions {
  timeline?: AnimationTimeline | null;
}
