import React from 'react';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** neutral (default), gold, teal, solid (gold fill), outline. */
  tone?: 'neutral' | 'gold' | 'teal' | 'solid' | 'outline';
  /** Show a leading status dot in the current color. */
  dot?: boolean;
  children?: React.ReactNode;
}

/**
 * Small uppercase pill for traits, roles, difficulty, or filter state.
 * @startingPoint section="Core" subtitle="Uppercase pill — traits, roles, difficulty" viewport="700x120"
 */
export function Tag(props: TagProps): JSX.Element;
