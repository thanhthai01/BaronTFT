import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** TFT champion cost 1–5. Renders a gold-coin cost badge in the tier color. */
  cost?: 1 | 2 | 3 | 4 | 5;
  /** Status tone when not a cost badge. */
  tone?: 'success' | 'warning' | 'danger';
  children?: React.ReactNode;
}

/**
 * Monospace numeric / status chip. Primary use: champion cost badge (1–5) in canonical tier colors.
 * @startingPoint section="Core" subtitle="Cost coins (1–5) + status badges" viewport="700x120"
 */
export function Badge(props: BadgeProps): JSX.Element;
