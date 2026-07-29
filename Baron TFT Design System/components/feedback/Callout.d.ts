import React from 'react';

export interface CalloutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** note (gold), tip (teal), warning, danger, success. */
  variant?: 'note' | 'tip' | 'warning' | 'danger' | 'success';
  /** Override the hex glyph. */
  mark?: React.ReactNode;
  title?: string;
  children?: React.ReactNode;
}

/**
 * Tutorial tip box — hex marker, title, and body. The teaching aside used throughout lessons and guides.
 * @startingPoint section="Feedback" subtitle="Tutorial tip box — note/tip/warning" viewport="700x180"
 */
export function Callout(props: CalloutProps): JSX.Element;
