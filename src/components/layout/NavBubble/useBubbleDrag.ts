'use client';

import gsap from 'gsap';
import { useCallback, useEffect, useRef, type RefObject } from 'react';
import { motion } from '@/lib/motion';
import { clampOffsetY, computeVelocity, edgePeekLeft, resolveSnapSide, type BubbleSide, type PointerSample } from './bubbleMath';

export type BubblePosition = {
  side: BubbleSide;
  offsetY: number;
  collapsed: boolean;
};

const EDGE_GAP = 16;
const BUBBLE_SIZE = 56;
const COLLAPSED_SIZE = 44;
const COLLAPSED_VISIBLE = 18;
const TOP_SAFE = 16;
const BOTTOM_SAFE = 16;
const DRAG_THRESHOLD = 6;
const MAX_SAMPLES = 8;

function restingRect(position: BubblePosition, viewportWidth: number) {
  const size = position.collapsed ? COLLAPSED_SIZE : BUBBLE_SIZE;
  const left = position.collapsed
    ? edgePeekLeft({ side: position.side, viewportWidth, size, visibleSize: COLLAPSED_VISIBLE })
    : position.side === 'left'
      ? EDGE_GAP
      : viewportWidth - EDGE_GAP - size;
  return { left, top: position.offsetY, size };
}

export function useBubbleDrag(
  bubbleRef: RefObject<HTMLButtonElement | null>,
  position: BubblePosition,
  setPosition: (next: BubblePosition) => void,
  options: { reducedMotion: boolean; onTap: () => void; onDragStart?: () => void },
) {
  const { reducedMotion, onTap, onDragStart } = options;
  const dragState = useRef<{
    pointerId: number;
    startClientX: number;
    startClientY: number;
    anchorLeft: number;
    anchorTop: number;
    dragging: boolean;
    samples: PointerSample[];
  } | null>(null);

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      const el = bubbleRef.current;
      if (!el) return;

      gsap.killTweensOf(el);
      gsap.set(el, { x: 0, y: 0 });
      if (typeof el.setPointerCapture === 'function') {
        el.setPointerCapture(event.pointerId);
      }

      const rect = el.getBoundingClientRect();
      dragState.current = {
        pointerId: event.pointerId,
        startClientX: event.clientX,
        startClientY: event.clientY,
        anchorLeft: rect.left,
        anchorTop: rect.top,
        dragging: false,
        samples: [{ x: event.clientX, y: event.clientY, t: performance.now() }],
      };
    },
    [bubbleRef],
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      const el = bubbleRef.current;
      const state = dragState.current;
      if (!el || !state || state.pointerId !== event.pointerId) return;

      const dx = event.clientX - state.startClientX;
      const dy = event.clientY - state.startClientY;

      if (!state.dragging && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
        state.dragging = true;
        onDragStart?.();
      }

      if (!state.dragging) return;

      gsap.set(el, { x: dx, y: dy });

      state.samples.push({ x: event.clientX, y: event.clientY, t: performance.now() });
      if (state.samples.length > MAX_SAMPLES) state.samples.shift();
    },
    [bubbleRef, onDragStart],
  );

  const onPointerUp = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      const el = bubbleRef.current;
      const state = dragState.current;
      if (!el || !state || state.pointerId !== event.pointerId) return;

      if (typeof el.hasPointerCapture !== 'function' || el.hasPointerCapture(event.pointerId)) {
        el.releasePointerCapture(event.pointerId);
      }
      dragState.current = null;

      if (!state.dragging) {
        onTap();
        return;
      }

      const dx = event.clientX - state.startClientX;
      const dy = event.clientY - state.startClientY;
      const size = position.collapsed ? COLLAPSED_SIZE : BUBBLE_SIZE;
      const finalLeft = state.anchorLeft + dx;
      const finalTop = state.anchorTop + dy;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const vx = computeVelocity(state.samples, performance.now());
      const side = resolveSnapSide({ x: finalLeft + size / 2, vx, viewportWidth });
      // Kéo xuống đáy không còn thu gọn — chỉ clamp lại trong vùng an toàn,
      // giữ nguyên kích thước hiện tại (thường/collapsed) như trước khi kéo.
      const offsetY = clampOffsetY(finalTop, viewportHeight, size, TOP_SAFE, BOTTOM_SAFE);

      const nextPosition: BubblePosition = { side, offsetY, collapsed: position.collapsed };
      const rest = restingRect(nextPosition, viewportWidth);
      const deltaX = finalLeft - rest.left;
      const deltaY = finalTop - rest.top;

      setPosition(nextPosition);

      requestAnimationFrame(() => {
        if (!bubbleRef.current) return;
        gsap.set(bubbleRef.current, { x: deltaX, y: deltaY });
        if (reducedMotion) {
          gsap.set(bubbleRef.current, { x: 0, y: 0 });
        } else {
          gsap.to(bubbleRef.current, { x: 0, y: 0, duration: motion.throwSnap, ease: motion.easeExpo });
        }
      });
    },
    [bubbleRef, onTap, position.collapsed, reducedMotion, setPosition],
  );

  const onPointerCancel = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      const el = bubbleRef.current;
      const state = dragState.current;
      if (!el || !state || state.pointerId !== event.pointerId) return;

      if (typeof el.releasePointerCapture === 'function' && (!el.hasPointerCapture || el.hasPointerCapture(event.pointerId))) {
        el.releasePointerCapture(event.pointerId);
      }
      dragState.current = null;
      gsap.set(el, { x: 0, y: 0 });
    },
    [bubbleRef],
  );

  useEffect(() => {
    const el = bubbleRef.current;
    return () => {
      if (el) gsap.killTweensOf(el);
    };
  }, [bubbleRef]);

  return { onPointerDown, onPointerMove, onPointerUp, onPointerCancel };
}

export { BUBBLE_SIZE, COLLAPSED_SIZE, COLLAPSED_VISIBLE, EDGE_GAP, TOP_SAFE, BOTTOM_SAFE, restingRect };
