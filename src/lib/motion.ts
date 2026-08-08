'use client';

export const motion = {
  easeOut: 'power3.out',
  easeInOut: 'power2.inOut',
  easeExpo: 'expo.inOut',
  fast: 0.18,
  base: 0.32,
  slow: 0.56,
  throwSnap: 0.85,
} as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
