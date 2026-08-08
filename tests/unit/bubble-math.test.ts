import { describe, expect, it } from 'vitest';
import { clampOffsetY, computeVelocity, resolveSnapSide } from '../../src/components/layout/NavBubble/bubbleMath';

describe('resolveSnapSide', () => {
  it('snaps to the near side when velocity is near zero', () => {
    expect(resolveSnapSide({ x: 80, vx: 0, viewportWidth: 400 })).toBe('left');
    expect(resolveSnapSide({ x: 320, vx: 0, viewportWidth: 400 })).toBe('right');
  });

  it('crosses the midline when velocity is large enough to reach the other side', () => {
    // x=80, projected forward 180ms at 1.5 px/ms => predictedX = 80 + 270 = 350 > 200 midline
    expect(resolveSnapSide({ x: 80, vx: 1.5, viewportWidth: 400 })).toBe('right');
  });

  it('stays on the original side when velocity is too small to cross the midline', () => {
    // x=80, projected forward 180ms at 0.2 px/ms => predictedX = 80 + 36 = 116 < 200 midline
    expect(resolveSnapSide({ x: 80, vx: 0.2, viewportWidth: 400 })).toBe('left');
  });

  it('respects a custom projection window', () => {
    expect(resolveSnapSide({ x: 80, vx: 1.5, viewportWidth: 400, projectionMs: 0 })).toBe('left');
  });
});

describe('computeVelocity', () => {
  it('returns 0 for fewer than two samples', () => {
    expect(computeVelocity([], 1000)).toBe(0);
    expect(computeVelocity([{ x: 10, y: 10, t: 990 }], 1000)).toBe(0);
  });

  it('computes px/ms from the first and last samples inside the velocity window', () => {
    const samples = [
      { x: 0, y: 0, t: 900 },
      { x: 100, y: 0, t: 950 },
      { x: 150, y: 0, t: 1000 },
    ];
    // window keeps all samples within 100ms of now=1000 (t=900..1000): (150-0)/(1000-900)
    expect(computeVelocity(samples, 1000)).toBeCloseTo(1.5, 5);
  });

  it('ignores samples older than the velocity window', () => {
    const samples = [
      { x: -1000, y: 0, t: 0 },
      { x: 100, y: 0, t: 950 },
      { x: 150, y: 0, t: 1000 },
    ];
    // t=0 is outside the 100ms window, so only t=950 and t=1000 contribute
    expect(computeVelocity(samples, 1000)).toBeCloseTo(1, 5);
  });
});

describe('clampOffsetY', () => {
  it('clamps within the safe area', () => {
    expect(clampOffsetY(-50, 800, 56, 40, 40)).toBe(40);
    expect(clampOffsetY(900, 800, 56, 40, 40)).toBe(800 - 40 - 56);
    expect(clampOffsetY(400, 800, 56, 40, 40)).toBe(400);
  });

  it('never returns a value below the top safe area even if the viewport is tiny', () => {
    expect(clampOffsetY(500, 100, 56, 40, 40)).toBe(40);
  });
});
