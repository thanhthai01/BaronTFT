import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. primary = gold CTA, secondary = gold outline, ghost = neutral, danger = destructive. */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  /** Stretch to full container width. */
  block?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  /** Render as another element (e.g. 'a' for links). */
  as?: any;
  children?: React.ReactNode;
}

/**
 * Primary action control for Baron TFT. Condensed uppercase label with a hextech-gold CTA.
 * @startingPoint section="Core" subtitle="Gold CTA + outline/ghost/danger variants" viewport="700x200"
 */
export function Button(props: ButtonProps): JSX.Element;
